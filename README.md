# TRUST&TEST LAB

대학생과 입문자를 위한 **AI 신뢰성 · QA/소프트웨어 테스트 실습 중심 교육 플랫폼**입니다.
이론 학습 → 직접 테스트 → 문제 분석 → 결과물 작성 → 포트폴리오로 이어지는 학습 경험을 제공합니다.

## 주요 메뉴

| 메뉴 | 내용 |
|---|---|
| 홈 | 서비스 소개, 관심 직무별 추천, 재방문 시 학습 현황 |
| AI 신뢰성 학습실 | 모듈 6개: 개론, 정확성 검증, 환각 분석, 편향·공정성, 안전성, 개인정보·설명 가능성 |
| SW 테스트 학습실 | 모듈 6개: 테스트 기초, 기능·비기능, 테스트 케이스, 시나리오, 버그 리포트, 자동화 기초 |
| 실습 LAB | 실무형 미션 6개 (AI 검증 3 · 버그 헌팅 3), 자동 채점과 피드백 |
| 학습 자료실 | 용어 사전, 직무 가이드, 실무 양식 |
| 마이페이지 | 학습 기록, 테스트 결과(강점·약점 분석), 포트폴리오 |

## 실행 방법

빌드 과정이 없는 정적 웹사이트(HTML/CSS/JavaScript)입니다.

- 로컬: `index.html`을 브라우저로 열기
- 배포: Vercel, GitHub Pages 등 정적 호스팅에 그대로 업로드

학습 기록·결과물은 서버 없이 **사용자의 브라우저(localStorage)** 에만 저장됩니다.

## 폴더 구조

```
index.html, ai-lab.html, sw-lab.html, lab.html, resources.html, mypage.html
module.html                  공통 학습 모듈 페이지 (module.html?id=ai-1 등)
module-hallucination.html    AI 모듈 3 (전용 페이지)
module-bug-report.html       SW 모듈 5 (전용 페이지)
mission-*.html               실습 LAB 미션 6개
css/style.css                공통 스타일
js/data.js                   모듈·미션·용어 데이터
js/core.js                   저장, 공통 메뉴, 퀴즈, 포트폴리오
js/content-ai.js, content-sw.js   학습 모듈 본문 콘텐츠
js/bughunt.js                버그 헌팅 미션 공통 엔진
```
