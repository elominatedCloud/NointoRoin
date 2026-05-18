# 시니어 AI 일자리 도우미

Next.js + TypeScript + Tailwind CSS 기반 MVP입니다. 중장년·고령층은 말로 이력과 건강 상태를 등록하고 공공 일자리를 쉬운 말로 확인할 수 있으며, 기업은 시니어 채용 공고를 등록하고 적합도 기반 추천 근로자를 볼 수 있습니다. DB와 외부 AI/API 키가 없어도 mock mode로 동작합니다.

## 환경 변수

로컬 개발은 `.env.local`에 저장합니다.

```env
DATABASE_URL=
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.0-flash
PUBLIC_JOB_API_KEY="공공데이터포털 일반 인증키 Decoding 값"
PUBLIC_JOB_API_BASE_URL="https://apis.data.go.kr/B552474/SenuriService"
CRON_SECRET="local-dev-cron-secret"
NEXT_PUBLIC_APP_NAME="시니어 AI 일자리 도우미"
```

공공 API 키와 Gemini API 키는 브라우저에 노출하지 않도록 `NEXT_PUBLIC_` 접두사를 붙이지 않습니다. Vercel 배포 시에는 Project Settings > Environment Variables에 같은 이름으로 추가하세요.
`GEMINI_API_KEY`가 없거나 Gemini 호출이 실패하면 기존 규칙 기반 설명으로 자동 fallback합니다.

## 실행

```bash
npm install
npm run dev
```

## 주요 경로

- `/senior`
- `/senior/voice`
- `/senior/result`
- `/senior/public-jobs`
- `/senior/public-jobs/[id]`
- `/senior/jobs-map`
- `/senior/attendance`
- `/senior/resume`
- `/senior/help`
- `/senior/my`
- `/employer`
- `/employer/profile`
- `/employer/jobs/new`
- `/employer/jobs`
- `/employer/applications`
- `/employer/attendance`
- `/employer/policies`
- `/employer/help`
- `/employer/my`
- `/employer/public-jobs` (관리자/디버그용)

## 데모 데이터 구조

현재 MVP는 실제 DB 없이 서버 in-memory store를 내부 DB처럼 사용합니다.

- 노인용 추천 선택 흐름을 완료하면 `/api/senior/profile`에 데모 구직자 프로필이 저장됩니다.
- 노인용 공공 일자리 화면은 실제 API에서 수집한 공고를 쉬운 설명으로 보여주고, 상세 화면에서 `신청하기`를 누르면 신청 순서와 `전화하기` 버튼을 보여줍니다.
- 기업용 메인 홈은 공고, 제출 이력서, 출퇴근 관리, 고용·정책, 기업 정보, 마이, AI 도움챗봇 축으로 구성합니다.
- 기업용 제출 이력서 화면은 `/api/employer/matches`에서 공고와 구직자 프로필을 비교한 적합도와 사유를 보여줍니다.
- 공공 일자리 수집은 `/api/cron/sync-public-jobs`에서 실제 공공 API를 호출하고, 결과를 내부 store에 저장합니다.
- Vercel 배포나 서버 재시작 후 데이터 유지를 원하면 `DATABASE_URL` 기반 Postgres 저장소로 교체해야 합니다.

## API

- `POST /api/ai/voice-job-helper`
- `POST /api/ai/explain`
- `POST /api/ai/recommend`
- `GET /api/jobs`
- `GET /api/jobs/:id`
- `GET /api/senior/profile`
- `POST /api/senior/profile`
- `GET /api/employer/matches`
- `GET /api/cron/sync-public-jobs`

Cron route는 아래 헤더가 필요합니다.

```text
Authorization: Bearer local-dev-cron-secret
```
