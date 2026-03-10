# 🛠 Tech Demo

> 환경: Vite + 순수 JS (No React)  
> 기술 스택: Clerk · RxDB · wagmi · Upbit WebSocket

---

## 📦 기술 스택

| # | 기술 | 용도 |
|---|------|------|
| 1 | Clerk | 인증 |
| 2 | RxDB | 로컬 DB 캐싱 |
| 3 | wagmi core | 지갑 연결 |
| 4 | Upbit WebSocket | 실시간 데이터 |

---

## 🛠 트러블슈팅

<details>
<summary>Clerk</summary>

### UI 컴포넌트 없는 버전 로드 문제

**에러 메시지**
Clerk was not loaded with Ui components
assertComponentsReady @ clerk.browser.js
mountSignIn @ clerk.browser.js

text

**원인**
- jsdelivr CDN의 `clerk.browser.js`는 **headless(UI 없는) 버전**
- `mountSignIn()` 등 UI 컴포넌트는  
  **Clerk 자체 CDN**에서 로드한 버전에서만 동작

**해결**  
Publishable Key를 Base64 디코딩 → 본인 Clerk 도메인 추출:
pk_my_key
→ probable-kitten-32.clerk.accounts.dev

text

```html
<!-- ❌ jsdelivr (UI 없음) -->
<script src="https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js"></script>

<!-- ✅ 본인 Clerk 도메인 CDN (UI 포함) -->
<script
  async
  crossorigin="anonymous"
  data-clerk-publishable-key="pk_test_YOUR_KEY"
  src="https://probable-kitten-32.clerk.accounts.dev/npm/@clerk/clerk-js@latest/dist/clerk.browser.js"
></script>
```
</details> <details> <summary>wagmi</summary>
injected는 @wagmi/core 안에 포함되어 있음
원인
injected를 별도 패키지에서 가져올 필요 없이
@wagmi/core에 이미 포함되어 있음

해결
```html
// ❌ 틀림
import { injected } from '@wagmi/connectors';

// ✅ 수정
import { createConfig, connect, disconnect, getAccount, injected } from '@wagmi/core';
```

transports 빈 객체 사용 불가
```html
원인
체인별 전송 설정 없이 빈 객체로 두면 동작 안 함

해결
import { http } from 'viem';

// ❌ 틀림
transports: {}

// ✅ 수정
transports: {
  [mainnet.id]: http(),
}
```
</details> <details> <summary>Upbit WebSocket</summary>
### 문제 1: TextDecoder 인스턴스 생성 누락

**에러 메시지**
Uncaught TypeError: TextDecoder.decode is not a constructor

text

**원인**  
`TextDecoder` 는 클래스라 `new` 로 인스턴스 생성 후 `.decode()` 호출해야 함

**해결**
```js
// ❌ 틀림
const data = JSON.parse(new TextDecoder().decode(evt.data));

// ✅ 수정
const decoder = new TextDecoder('utf-8');
const data = JSON.parse(decoder.decode(evt.data));
```
</details> 
