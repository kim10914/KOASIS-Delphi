-- Mind Mirror 조사 결과 저장 스키마와 RLS.
-- 클라이언트는 익명 인증(authenticated 역할) 사용자이며 INSERT와 SELECT만 허용한다.
-- UPDATE, DELETE 정책은 만들지 않으므로 클라이언트에서 수정과 삭제는 불가능하다.
-- service_role 키는 사용하지 않는다.

create table public.mm_sessions (
  id uuid primary key,
  owner_id uuid not null default auth.uid() references auth.users (id),
  created_at timestamptz not null default now(),
  started_at timestamptz not null,
  completed_at timestamptz not null,
  ui_type text not null,
  image_count integer not null check (image_count >= 0),
  participant_name text not null,
  birth_date text not null,
  gender text not null,
  job text not null,
  region text not null,
  consent_at timestamptz not null,
  consent_text_version text not null
);

create table public.mm_mood_checks (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.mm_sessions (id),
  phase text not null check (phase in ('pre', 'post')),
  row_index smallint not null check (row_index between 1 and 6),
  col_index smallint not null check (col_index between 1 and 6),
  emotion text not null,
  quadrant text not null,
  checked_at timestamptz not null,
  unique (session_id, phase)
);

create table public.mm_image_responses (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.mm_sessions (id),
  image_id text not null,
  order_index integer not null check (order_index >= 0),
  valence smallint check (valence between 1 and 7),
  arousal smallint check (arousal between 1 and 7),
  skipped boolean not null default false,
  response_ms integer not null check (response_ms >= 0),
  responded_at timestamptz not null,
  unique (session_id, order_index),
  check (
    (skipped and valence is null and arousal is null)
    or (not skipped and valence is not null and arousal is not null)
  )
);

create index mm_mood_checks_session_id_idx on public.mm_mood_checks (session_id);
create index mm_image_responses_session_id_idx on public.mm_image_responses (session_id);

alter table public.mm_sessions enable row level security;
alter table public.mm_mood_checks enable row level security;
alter table public.mm_image_responses enable row level security;

revoke all on public.mm_sessions, public.mm_mood_checks, public.mm_image_responses from anon, authenticated;
grant select, insert on public.mm_sessions, public.mm_mood_checks, public.mm_image_responses to authenticated;

create policy mm_sessions_select_own on public.mm_sessions
  for select to authenticated using (owner_id = (select auth.uid()));

create policy mm_sessions_insert_own on public.mm_sessions
  for insert to authenticated with check (owner_id = (select auth.uid()));

create policy mm_mood_checks_select_own on public.mm_mood_checks
  for select to authenticated using (
    exists (select 1 from public.mm_sessions s where s.id = session_id and s.owner_id = (select auth.uid()))
  );

create policy mm_mood_checks_insert_own on public.mm_mood_checks
  for insert to authenticated with check (
    exists (select 1 from public.mm_sessions s where s.id = session_id and s.owner_id = (select auth.uid()))
  );

create policy mm_image_responses_select_own on public.mm_image_responses
  for select to authenticated using (
    exists (select 1 from public.mm_sessions s where s.id = session_id and s.owner_id = (select auth.uid()))
  );

create policy mm_image_responses_insert_own on public.mm_image_responses
  for insert to authenticated with check (
    exists (select 1 from public.mm_sessions s where s.id = session_id and s.owner_id = (select auth.uid()))
  );

-- 설문 전체를 한 트랜잭션으로 저장한다. SECURITY INVOKER이므로 모든 INSERT에 RLS가 적용된다.
-- 같은 id로 다시 호출하면(재시도) 세션과 하위 행 모두 중복 없이 무시된다.
create or replace function public.save_survey_submission(p_submission jsonb)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_session_id uuid := (p_submission ->> 'sessionId')::uuid;
begin
  if auth.uid() is null then
    raise exception 'authentication required' using errcode = '28000';
  end if;

  insert into mm_sessions (
    id, started_at, completed_at, ui_type, image_count,
    participant_name, birth_date, gender, job, region,
    consent_at, consent_text_version
  )
  values (
    v_session_id,
    (p_submission ->> 'startedAt')::timestamptz,
    (p_submission ->> 'completedAt')::timestamptz,
    p_submission ->> 'uiType',
    jsonb_array_length(p_submission -> 'responses'),
    p_submission #>> '{participant,name}',
    p_submission #>> '{participant,birthDate}',
    p_submission #>> '{participant,gender}',
    p_submission #>> '{participant,job}',
    p_submission #>> '{participant,region}',
    (p_submission #>> '{privacyConsent,at}')::timestamptz,
    p_submission #>> '{privacyConsent,textVersion}'
  )
  on conflict (id) do nothing;

  insert into mm_mood_checks (session_id, phase, row_index, col_index, emotion, quadrant, checked_at)
  select
    v_session_id, m.phase,
    (m.value ->> 'row')::smallint, (m.value ->> 'col')::smallint,
    m.value ->> 'emotion', m.value ->> 'quadrant',
    (m.value ->> 'checkedAt')::timestamptz
  from (
    values ('pre', p_submission -> 'preMood'), ('post', p_submission -> 'postMood')
  ) as m (phase, value)
  on conflict (session_id, phase) do nothing;

  insert into mm_image_responses (
    session_id, image_id, order_index, valence, arousal, skipped, response_ms, responded_at
  )
  select
    v_session_id,
    r ->> 'imageId',
    (r ->> 'orderIndex')::integer,
    (r ->> 'valence')::smallint,
    (r ->> 'arousal')::smallint,
    coalesce((r ->> 'skipped')::boolean, false),
    (r ->> 'responseMs')::integer,
    (r ->> 'respondedAt')::timestamptz
  from jsonb_array_elements(p_submission -> 'responses') as r
  on conflict (session_id, order_index) do nothing;
end;
$$;

revoke all on function public.save_survey_submission(jsonb) from public, anon;
grant execute on function public.save_survey_submission(jsonb) to authenticated;
