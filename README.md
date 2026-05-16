# 시니어 AI 일자리 도우미

Next.js + TypeScript + Tailwind CSS 기반 MVP입니다. 중장년·고령층은 말로 일자리 질문을 하고, 기업은 시니어 채용 공고를 등록할 수 있습니다. DB와 외부 AI/API 키가 없어도 mock mode로 동작합니다.

## 환경 변수

로컬 개발은 `.env.local`에 저장합니다.

```env
DATABASE_URL=
OPENAI_API_KEY=
PUBLIC_JOB_API_KEY="공공데이터포털 일반 인증키 Decoding 값"
PUBLIC_JOB_API_BASE_URL="https://apis.data.go.kr/B552474/SenuriService"
CRON_SECRET="local-dev-cron-secret"
NEXT_PUBLIC_APP_NAME="시니어 AI 일자리 도우미"
```

공공 API 키는 브라우저에 노출하지 않도록 `NEXT_PUBLIC_` 접두사를 붙이지 않습니다. Vercel 배포 시에는 Project Settings > Environment Variables에 같은 이름으로 추가하세요.

## 실행

```bash
npm install
npm run dev
```

## 주요 경로

- `/senior`
- `/senior/voice`
- `/senior/result`
- `/employer`
- `/employer/profile`
- `/employer/jobs/new`
- `/employer/jobs`

## API

- `POST /api/ai/voice-job-helper`
- `POST /api/ai/explain`
- `POST /api/ai/recommend`
- `GET /api/jobs`
- `GET /api/jobs/:id`
- `GET /api/cron/sync-public-jobs`

Cron route는 아래 헤더가 필요합니다.

```text
Authorization: Bearer local-dev-cron-secret
```
