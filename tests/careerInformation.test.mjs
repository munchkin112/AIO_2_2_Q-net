import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as certificateApi from '../src/api/certificates.ts';

test('자격증 직업 API를 호출해 직업 목록을 반환한다', async () => {
  const fetchCareerInformation = certificateApi.getCertificateCareerInformation;
  assert.equal(typeof fetchCareerInformation, 'function', '직업 정보 API 함수가 있어야 합니다.');

  const originalFetch = globalThis.fetch;
  const job = { name: '산림자원 조사원', note: '공식 직무 근거에 연결된 역할' };
  let requestUrl = '';
  globalThis.fetch = async (input) => {
    requestUrl = String(input);
    return new Response(JSON.stringify({
      certificate_id: '282ef4b0-075e-4885-a912-c4b08d24c0b8',
      status: 'available',
      recommended_for: [{ text: '산림기술사 관련 업무에 관심 있는 분', source_ids: ['qnet:0801:duties'] }],
      related_jobs: [job],
      sources: [],
      usage_restrictions: [],
      message: '공통 직무 안내입니다.'
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };

  try {
    const result = await fetchCareerInformation(
      '282ef4b0-075e-4885-a912-c4b08d24c0b8',
      undefined,
      'http://127.0.0.1:8000/',
    );
    assert.equal(requestUrl, 'http://127.0.0.1:8000/certificates/282ef4b0-075e-4885-a912-c4b08d24c0b8/career-info');
    assert.deepEqual(result.related_jobs, [job]);
    assert.equal(result.recommended_for[0].text, '산림기술사 관련 업무에 관심 있는 분');
  } finally {
    globalThis.fetch = originalFetch;
  }
});