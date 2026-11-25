\set ON_ERROR_STOP on

-- User A 설정 (실제 앱 페이로드 형식: skipped 생략 응답 + skipped:true null 응답 포함)
set role authenticated;
select set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', false);

-- 1) 최초 일괄 INSERT
select public.save_survey_submission($${
  "sessionId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "startedAt": "2026-11-25T08:00:00Z",
  "completedAt": "2026-11-25T08:05:00Z",
  "uiType": "type2",
  "participant": { "name": "tester", "birthDate": "19990101", "gender": "female", "job": "student", "region": "Seoul" },
  "privacyConsent": { "agreed": true, "at": "2026-11-25T08:00:00Z", "textVersion": "v1" },
  "preMood": { "row": 2, "col": 3, "emotion": "joy", "quadrant": "highEnergyPositive", "checkedAt": "2026-11-25T08:01:00Z" },
  "postMood": { "row": 4, "col": 4, "emotion": "calm", "quadrant": "lowEnergyPositive", "checkedAt": "2026-11-25T08:05:00Z" },
  "responses": [
    { "imageId": "img-1", "orderIndex": 0, "valence": 5, "arousal": 4, "responseMs": 1200, "respondedAt": "2026-11-25T08:02:00Z" },
    { "imageId": "img-2", "orderIndex": 1, "valence": null, "arousal": null, "skipped": true, "responseMs": 950, "respondedAt": "2026-11-25T08:03:00Z" }
  ]
}$$::jsonb);

-- 2) 동일 sessionId 재시도 (멱등성)
select public.save_survey_submission($${
  "sessionId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "startedAt": "2026-11-25T08:00:00Z",
  "completedAt": "2026-11-25T08:05:00Z",
  "uiType": "type2",
  "participant": { "name": "tester", "birthDate": "19990101", "gender": "female", "job": "student", "region": "Seoul" },
  "privacyConsent": { "agreed": true, "at": "2026-11-25T08:00:00Z", "textVersion": "v1" },
  "preMood": { "row": 2, "col": 3, "emotion": "joy", "quadrant": "highEnergyPositive", "checkedAt": "2026-11-25T08:01:00Z" },
  "postMood": { "row": 4, "col": 4, "emotion": "calm", "quadrant": "lowEnergyPositive", "checkedAt": "2026-11-25T08:05:00Z" },
  "responses": [
    { "imageId": "img-1", "orderIndex": 0, "valence": 5, "arousal": 4, "responseMs": 1200, "respondedAt": "2026-11-25T08:02:00Z" },
    { "imageId": "img-2", "orderIndex": 1, "valence": null, "arousal": null, "skipped": true, "responseMs": 950, "respondedAt": "2026-11-25T08:03:00Z" }
  ]
}$$::jsonb);

-- 3) User A 본인 조회 건수 확인 (1, 2, 2)
do $$
declare
  v_sessions int;
  v_moods int;
  v_responses int;
begin
  select count(*) into v_sessions from public.mm_sessions where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  select count(*) into v_moods from public.mm_mood_checks where session_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  select count(*) into v_responses from public.mm_image_responses where session_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  if v_sessions <> 1 or v_moods <> 2 or v_responses <> 2 then
    raise exception 'FAIL: unexpected own counts (%, %, %)', v_sessions, v_moods, v_responses;
  end if;
end $$;

-- 4) 비-UUID sessionId 거부(22P02) 확인
do $outer$
begin
  begin
    perform public.save_survey_submission($${
      "sessionId": "not-a-uuid",
      "startedAt": "2026-11-25T08:00:00Z",
      "completedAt": "2026-11-25T08:05:00Z",
      "uiType": "type2",
      "participant": { "name": "테스터", "birthDate": "19990101", "gender": "여성", "job": "학생", "region": "서울특별시" },
      "privacyConsent": { "agreed": true, "at": "2026-11-25T08:00:00Z", "textVersion": "v1" },
      "preMood": { "row": 2, "col": 3, "emotion": "기쁨", "quadrant": "highEnergyPositive", "checkedAt": "2026-11-25T08:01:00Z" },
      "postMood": { "row": 4, "col": 4, "emotion": "평온", "quadrant": "lowEnergyPositive", "checkedAt": "2026-11-25T08:05:00Z" },
      "responses": []
    }$$::jsonb);
    raise exception 'FAIL: non-UUID sessionId should have been rejected';
  exception when invalid_text_representation then
    raise notice 'PASS: non-UUID sessionId rejected (22P02)';
  end;
end $outer$;

-- 5) 3개 테이블 모두 UPDATE / DELETE 차단 확인
do $$
begin
  begin
    update public.mm_sessions set ui_type = 'hacked' where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    raise exception 'FAIL: mm_sessions UPDATE should have been blocked';
  exception when insufficient_privilege then
    raise notice 'PASS: mm_sessions UPDATE blocked';
  end;

  begin
    delete from public.mm_sessions where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    raise exception 'FAIL: mm_sessions DELETE should have been blocked';
  exception when insufficient_privilege then
    raise notice 'PASS: mm_sessions DELETE blocked';
  end;

  begin
    update public.mm_mood_checks set emotion = 'hacked' where session_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    raise exception 'FAIL: mm_mood_checks UPDATE should have been blocked';
  exception when insufficient_privilege then
    raise notice 'PASS: mm_mood_checks UPDATE blocked';
  end;

  begin
    delete from public.mm_mood_checks where session_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    raise exception 'FAIL: mm_mood_checks DELETE should have been blocked';
  exception when insufficient_privilege then
    raise notice 'PASS: mm_mood_checks DELETE blocked';
  end;

  begin
    update public.mm_image_responses set valence = 1 where session_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    raise exception 'FAIL: mm_image_responses UPDATE should have been blocked';
  exception when insufficient_privilege then
    raise notice 'PASS: mm_image_responses UPDATE blocked';
  end;

  begin
    delete from public.mm_image_responses where session_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    raise exception 'FAIL: mm_image_responses DELETE should have been blocked';
  exception when insufficient_privilege then
    raise notice 'PASS: mm_image_responses DELETE blocked';
  end;
end $$;

-- 6) anon 역할의 조회·입력·RPC 호출 차단 확인
set role anon;
select set_config('request.jwt.claim.sub', '', false);

do $outer$
begin
  begin
    perform 1 from public.mm_sessions limit 1;
    raise exception 'FAIL: anon SELECT should have been blocked';
  exception when insufficient_privilege then
    raise notice 'PASS: anon SELECT blocked';
  end;

  begin
    insert into public.mm_sessions (
      id, started_at, completed_at, ui_type, image_count,
      participant_name, birth_date, gender, job, region,
      consent_at, consent_text_version
    ) values (
      'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', now(), now(), 'type2', 0,
      'anon', '19990101', 'female', 'student', 'Seoul', now(), 'v1'
    );
    raise exception 'FAIL: anon INSERT should have been blocked';
  exception when insufficient_privilege then
    raise notice 'PASS: anon INSERT blocked';
  end;

  begin
    perform public.save_survey_submission($${
      "sessionId": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      "startedAt": "2026-11-25T08:00:00Z",
      "completedAt": "2026-11-25T08:05:00Z",
      "uiType": "type2",
      "participant": { "name": "anon", "birthDate": "19990101", "gender": "female", "job": "student", "region": "Seoul" },
      "privacyConsent": { "agreed": true, "at": "2026-11-25T08:00:00Z", "textVersion": "v1" },
      "preMood": { "row": 2, "col": 3, "emotion": "joy", "quadrant": "highEnergyPositive", "checkedAt": "2026-11-25T08:01:00Z" },
      "postMood": { "row": 4, "col": 4, "emotion": "calm", "quadrant": "lowEnergyPositive", "checkedAt": "2026-11-25T08:05:00Z" },
      "responses": []
    }$$::jsonb);
    raise exception 'FAIL: anon RPC should have been blocked';
  exception when insufficient_privilege then
    raise notice 'PASS: anon RPC blocked';
  end;
end $outer$;

-- User B 설정
set role authenticated;
select set_config('request.jwt.claim.sub', '22222222-2222-2222-2222-222222222222', false);

-- 7) User B 타인 세션 조회 차단 확인 (0, 0, 0)
do $$
declare
  v_sessions int;
  v_moods int;
  v_responses int;
begin
  select count(*) into v_sessions from public.mm_sessions where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  select count(*) into v_moods from public.mm_mood_checks where session_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  select count(*) into v_responses from public.mm_image_responses where session_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  if v_sessions <> 0 or v_moods <> 0 or v_responses <> 0 then
    raise exception 'FAIL: cross-user select leaked (%, %, %)', v_sessions, v_moods, v_responses;
  end if;
end $$;

-- 8) User B 타인 sessionId로 RPC 재호출(탈취/추가) 차단 확인
do $outer$
begin
  begin
    perform public.save_survey_submission($${
      "sessionId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      "startedAt": "2026-11-25T08:00:00Z",
      "completedAt": "2026-11-25T08:05:00Z",
      "uiType": "type2",
      "participant": { "name": "HACK", "birthDate": "19990101", "gender": "male", "job": "x", "region": "x" },
      "privacyConsent": { "agreed": true, "at": "2026-11-25T08:00:00Z", "textVersion": "v1" },
      "preMood": { "row": 1, "col": 1, "emotion": "x", "quadrant": "x", "checkedAt": "2026-11-25T08:01:00Z" },
      "postMood": { "row": 1, "col": 1, "emotion": "x", "quadrant": "x", "checkedAt": "2026-11-25T08:05:00Z" },
      "responses": [
        { "imageId": "img-x", "orderIndex": 99, "valence": 1, "arousal": 1, "skipped": false, "responseMs": 100, "respondedAt": "2026-11-25T08:02:00Z" }
      ]
    }$$::jsonb);
    raise exception 'FAIL: User B RPC into User A session should have been blocked';
  exception when insufficient_privilege then
    raise notice 'PASS: cross-user RPC blocked';
  end;
end $outer$;
