# 벤처핏 — 벤처투자 소득공제 시뮬레이터

한국어 반응형 React 웹사이트. 회원가입·서버·개인정보 저장 없이 입력값에 따라 결과와 그래프를 갱신합니다.

## 실행
Node.js 22 이상 사용 권장 (이 환경 Node 24 검증).

```sh
git clone https://github.com/jw8085/venturefit.git
cd venturefit
npm ci --cache /tmp/venture-npm-cache
npm run dev -- --port 5173
```

```sh
npm test
npm run typecheck
npm run build
npx --cache /tmp/venture-npm-cache playwright test
```

브라우저 테스트는 이 환경의 /usr/bin/chromium을 사용합니다. 다른 환경은 playwright.config.ts의 executablePath를 설치 경로에 맞추세요.

## 기능
직장인·사업자, 간편·상세 입력, 공제 전후 세금, 소득·투자금별 비교 그래프와 수치표, 공제 적용 연도 비교, 계산 과정과 출처 안내.

기본은 **예시 모드**입니다. **세법 기준 모드**는 2026년 투자·2026년 공제 대상 직접투자만 제공합니다. 해당 요건을 사용자가 확인해야 합니다. 개인사업자는 단일 사업소득에 대한 최저한세를 반영합니다. 모든 결과는 세액공제·다른 감면·기납부세액을 반영한 실제 환급액과 다릅니다. 상세 범위와 검증한 공식 출처는 [계산 근거](docs/tax-sources.md)를 확인하세요.

## 구성
- src/tax: 순수 계산 엔진과 검증한 연도별 규칙
- src/components: 비교 그래프 및 접근 가능한 수치표
- src/App.tsx: 입력과 결과 화면
- tests/site.spec.ts: 실제 Chromium에서 기능 검증
- docs: 설계·계획·출처·검증 기록

아직 외부 서비스에 배포하지 않았습니다. 공개 배포 시 npm run build로 생성한 dist/를 정적 호스팅하면 됩니다. 계정·도메인과 배포 대상은 별도로 결정합니다. 굿노트 파일 및 해당 저장소의 Git 이력을 포함하지 않습니다.
