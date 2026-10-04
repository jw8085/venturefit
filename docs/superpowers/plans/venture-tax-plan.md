# 벤처투자 소득공제 웹사이트 구현 계획

> For agentic workers: Use superpowers:executing-plans to implement task by task after user review.

**Goal:** 누구나 직장인·개인사업자의 벤처투자 공제와 예상 절세액을 그래프로 비교한다.
**Architecture:** 정적 React 앱에서 계산을 수행한다. 계산 엔진, 법령 규칙 데이터, 표시 컴포넌트를 분리하고 입력은 저장하지 않는다.
**Tech Stack:** React, TypeScript, Vite, Vitest, SVG 그래프.
**Spec:** ../specs/venture-tax-design.md

## Global Constraints
- 별도 프로젝트 /workspace/venture-tax에 구현하며 기존 굿노트 저장소는 변경하지 않는다.
- 회원가입, 개인정보 저장, 결제, 투자상품 추천은 제외한다.
- 공식 자료에서 확인한 연도·방식만 계산하고 나머지는 차단한다.
- 공제액·산출세액 차이·실제 환급액을 구분한다.
- 공제 연도별 비교에서 같은 투자금을 중복 공제하지 않는다.

## Review Focus
- 빈 입력, 음수, NaN, 과도한 입력은 검증 오류로 처리한다.
- 과세표준과 종합소득금액을 별도 값으로 처리한다.
- 모바일 화면에서 입력과 그래프를 읽고 조작할 수 있어야 한다.
- 미확인 연도는 기존 규칙을 자동 재사용하지 않는다.
- 개인사업자의 입력을 매출로 오해하지 않게 설명한다.

## Task 1: 계산 규칙과 엔진
Files: src/tax/rules.ts, src/tax/calculate.ts, src/tax/calculate.test.ts, docs/tax-sources.md.
Interfaces: calculate(input: SimulationInput): SimulationResult; rulesByYear: Record<number, TaxRules>.
- [x] 공식 법령·국세청 출처, 규칙, 확인일을 기록한다. 접근 불가 시 입력 화면과 시각화 구조를 구현하되 미확인 세법에 대한 금액 계산은 차단한다. 샘플 그래프는 예시로 표시하고 정식 계산 기능의 외부 차단 상태를 보고한다.
- [x] 계산 모드, 공제 구간 경계, 한도, 세율 경계, 0원, 고액, 잘못된 입력, 지원하지 않는 연도에 대한 실패 테스트를 작성하고 실행한다.
- [x] 급여 변환, 사업소득 입력, 상세 과세표준 입력을 구분하고 공제 전후 세액과 지방소득세 차이를 산출한다.
- [x] 독립 수기 계산 예시와 테스트 결과를 대조한다.

## Task 2: 입력·결과·시각화
Files: package.json, index.html, src/main.tsx, src/App.tsx, src/components/ComparisonChart.tsx, src/styles.css.
Consumes: calculate, rulesByYear.
Produces: 회원가입 없는 반응형 단일 페이지.
- [x] Vite 프로젝트와 실행·빌드·타입 검사·테스트 명령을 구성한다.
- [x] 소득 유형과 계산 모드 전환, 투자 방식, 소득·투자금·연도 입력을 구현한다.
- [x] 실시간 결과 카드, SVG 투자금별 그래프와 수치표, 연도별 비교, 계산 근거와 한계 설명을 구현한다.
- [x] 공제 한도에 종합소득금액을 사용하고 미지원 규칙에는 계산 불가 안내를 표시한다.
- [x] 키보드 입력, 빈 입력, 유형 전환, 사업소득 설명, 모바일 너비에서 기능을 검증한다.

## Task 3: 실행 검증과 재사용 안내
Files: README.md, docs/validation.md.
- [x] npm test, npm run typecheck, npm run build를 실행하고 결과를 기록한다.
- [x] 개발 서버를 시작해 실제 페이지를 요청하고 가능하면 브라우저에서 상호작용·모바일 레이아웃을 검증한다.
- [x] 설치 및 실행 방법, 검증 결과, 세법 확인 차단 여부를 문서화한다.
- [x] 환경 설정 도구가 제공되면 테스트한 설치·서버 시작 지침을 저장한다. 서비스 공개 배포는 별도 작업으로 보고한다.

## 실행 방식
주 에이전트가 이 세션에서 직접 구현한다. 별도 에이전트 사용 없이 계산 테스트와 기능 검증으로 확인한다.
