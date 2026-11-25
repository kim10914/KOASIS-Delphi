\set ON_ERROR_STOP on

-- User A 설정
set role authenticated;
select set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', false);

-- 1) 최초 일괄 INSERT
select public.save_survey_submission($${
  "sessionId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "startedAt": "2026-11-25T08:00:00Z",
  "completedAt": "2026-11-25T08:05:00Z",
  "uiType": "v1",
  "participant": { "name": "TEST", "birthDate": "1999-01-01", "gender": "female", "job": "tester", "region": "Seoul" },
  "privacyConsent": { "at": "2026-11-25T08:00:00Z", "textVersion": "v1" },
  "preMood": { "row": 2, "col": 3, "emotion": "기쁨", "quadrant": "pleasant-high", "checkedAt": "2026-11-25T08:01:00Z" },
  "postMood": { "row": 4, "col": 4, "emotion": "평온", "quadrant": "pleasant-low", "checkedAt": "2026-11-25T08:05:00Z" },
  "responses": [
    { "imageId": "img-1", "orderIndex": 0, "valence": 5, "arousal": 4, "skipped": false, "responseMs": 1200, "respondedAt": "2026-11-25T08:02:00Z" },
    { "imageId": "img-2", "orderIndex": 1, "valence": 3, "arousal": 6, "skipped": false, "responseMs": 950, "respondedAt": "2026-11-25T08:03:00Z" }
  ]
}$$::jsonb);

-- 2) 동일 sessionId 재시도 (멱등성)
select public.save_survey_submission($${
  "sessionId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "startedAt": "2026-11-25T08:00:00Z",
  "completedAt": "2026-11-25T08:05:00Z",
  "uiType": "v1",
  "participant": { "name": "TEST", "birthDate": "1999-01-01", "gender": "female", "job": "tester", "region": "Seoul" },
  "privacyConsent": { "at": "2026-11-25T08:00:00Z", "textVersion": "v1" },
  "preMood": { "row": 2, "col": 3, "emotion": "기쁨", "quadrant": "pleasant-high", "checkedAt": "2026-11-25T08:01:00Z" },
  "postMood": { "row": 4, "col": 4, "emotion": "평온", "quadrant": "pleasant-low", "checkedAt": "2026-11-25T08:05:00Z" },
  "responses": [
    { "imageId": "img-1", "orderIndex": 0, "valence": 5, "arousal": 4, "skipped": false, "responseMs": 1200, "respondedAt": "2026-11-25T08:02:00Z" },
    { "imageId": "img-2", "orderIndex": 1, "valence": 3, "arousal": 6, "skipped": false, "responseMs": 950, "respondedAt": "2026-11-25T08:03:00Z" }
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

-- 4) User A UPDATE / DELETE 차단 확인
do $$
begin
  begin
    update public.mm_sessions set ui_type = 'hacked' where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    raise exception 'FAIL: UPDATE should have been blocked';
  exception when insufficient_privilege then
    raise notice 'PASS: UPDATE blocked';
  end;

  begin
    delete from public.mm_sessions where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    raise exception 'FAIL: DELETE should have been blocked';
  exception when insufficient_privilege then
    raise notice 'PASS: DELETE blocked';
  end;
end $$;

-- User B 설정
select set_config('request.jwt.claim.sub', '22222222-2222-2222-2222-222222222222', false);

-- 5) User B 타인 세션 조회 차단 확인 (0, 0, 0)
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

-- 6) User B 타인 sessionId로 RPC 재호출(탈취/추가) 차단 확인
do $outer$
begin
  begin
    perform public.save_survey_submission($${
      "sessionId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      "startedAt": "2026-11-25T08:00:00Z",
      "completedAt": "2026-11-25T08:05:00Z",
      "uiType": "v1",
      "participant": { "name": "HACK", "birthDate": "1999-01-01", "gender": "male", "job": "x", "region": "x" },
      "privacyConsent": { "at": "2026-11-25T08:00:00Z", "textVersion": "v1" },
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
