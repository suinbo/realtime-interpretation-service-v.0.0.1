# Realtime Translation Service

-   실시간 동시통역 서비스 (v.0.0.1)
    -   디스플레이 구성(1 / 2) 별 실시간 음성 통번역 채팅 서비스
    -   다국어 지원(기본) : 한국어/영어/중국어/일본어

---

### Description

-   [Front]

    -   Next.js (웹 애플리케이션)
    -   Electron (데스크탑 애플리케이션)

-   [Backend]

    -   Supabase
        -   Realtime : 실시간 통신
        -   Authentication : JWT 인증, 세션 관리(자동 유지)
        -   Database : DB

-   [API]
    -   Whisper API : STT 변환
    -   Openai API : 번역

---

### Environment

-   [Nodejs] - v.18.18.2 (LTS)
-   [NextJS] - v.14.2.5
-   [Electron] - v.31.2.1

---

### Main Plugins

-   [i18next] - Language translation
-   [supabase/supabase-js] - Real-time database, authentication
-   [typescript] - Typing js syntax
-   [recoil] - Global State Management

---

### Development

Install the dependencies and devDependencies and start the server.

```bash
cd realtime-interpretation-service
npm i -g

```

---

#### Serve (NODE_ENV: development)

```
npm run dev
```

---

### Dependencies

`package.json` 참고
