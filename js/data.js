/* ===========================================================
   TRUST&TEST LAB — 콘텐츠 데이터
   =========================================================== */

const TRACKS = {
  ai: {
    name: "AI 신뢰성", room: "AI 신뢰성 학습실", page: "ai-lab.html", icon: "🤖",
    role: "AI 신뢰성 전문가",
    tagline: "이 AI 답변을 믿어도 될까?",
    desc: "AI가 정확하고, 공정하고, 안전하게 동작하는지 검증하는 방법을 배웁니다.",
  },
  sw: {
    name: "SW 테스트", room: "SW 테스트 학습실", page: "sw-lab.html", icon: "🧪",
    role: "QA / SW 테스트 엔지니어",
    tagline: "이 소프트웨어를 출시해도 될까?",
    desc: "소프트웨어의 결함을 찾고, 테스트를 설계하고, 품질을 증명하는 방법을 배웁니다.",
  },
};

/* 학습실 모듈 — href 가 있는 모듈만 1차 공개 */
const MODULES = [
  { id: "ai-1", track: "ai", no: 1, title: "AI 신뢰성 개론", minutes: 15,
    desc: "신뢰할 수 있는 AI의 핵심 요소와 AI 신뢰성 전문가의 역할을 이해합니다.",
    practice: "AI 사고 사례를 신뢰성 요소별로 분류하기" },
  { id: "ai-2", track: "ai", no: 2, title: "AI 답변의 정확성 검증", minutes: 20,
    desc: "AI 답변을 문장 단위로 쪼개고 근거 자료와 대조하는 팩트체크 절차를 익힙니다.",
    practice: "답변 문장마다 사실 / 오류 / 확인 불가 표시하기" },
  { id: "ai-3", track: "ai", no: 3, title: "AI 환각(Hallucination) 현상 분석", minutes: 25,
    desc: "AI가 그럴듯한 거짓을 만드는 이유와 유형을 배우고, 근거 문서와 대조해 환각을 찾아냅니다.",
    practice: "근거 문서와 대조해 환각 문장 찾기", href: "module-hallucination.html", mission: "m-ai-chatbot" },
  { id: "ai-4", track: "ai", no: 4, title: "AI 편향성 및 공정성 평가", minutes: 25,
    desc: "조건만 바꾼 질문으로 AI 답변의 편향을 발견하고 공정성 지표를 이해합니다.",
    practice: "성별·이름만 바꾼 두 답변 비교하기" },
  { id: "ai-5", track: "ai", no: 5, title: "AI 안전성 검증", minutes: 20,
    desc: "위험한 요청에 대한 AI의 대응을 평가하고 레드팀 테스트의 기초를 배웁니다.",
    practice: "위험 요청에 대한 AI 응답 적절성 판정하기" },
  { id: "ai-6", track: "ai", no: 6, title: "개인정보 보호 및 설명 가능성", minutes: 20,
    desc: "AI 답변 속 개인정보 노출 위험을 찾고, 판단 근거를 설명할 수 있는지 평가합니다.",
    practice: "답변 속 개인정보 노출 찾기" },

  { id: "sw-1", track: "sw", no: 1, title: "소프트웨어 테스트 기초", minutes: 15,
    desc: "오류·결함·실패의 차이, 테스트 7원칙, 테스트 레벨을 이해합니다.",
    practice: "오류·결함·실패 사례 분류하기" },
  { id: "sw-2", track: "sw", no: 2, title: "기능 테스트 및 비기능 테스트", minutes: 20,
    desc: "요구사항을 기능·성능·보안·사용성으로 나누고 각각을 어떻게 테스트하는지 배웁니다.",
    practice: "요구사항 카드를 테스트 유형별로 분류하기" },
  { id: "sw-3", track: "sw", no: 3, title: "테스트 케이스 작성", minutes: 25,
    desc: "동등 분할과 경계값 분석으로 적은 수의 효과적인 테스트 케이스를 설계합니다.",
    practice: "로그인 기능 테스트 케이스 표 작성하기" },
  { id: "sw-4", track: "sw", no: 4, title: "테스트 시나리오 설계", minutes: 20,
    desc: "사용자 흐름을 따라 여러 기능을 잇는 엔드투엔드 테스트 시나리오를 설계합니다.",
    practice: "쇼핑몰 구매 흐름 시나리오 배열하기" },
  { id: "sw-5", track: "sw", no: 5, title: "버그 발견 및 버그 리포트 작성", minutes: 25,
    desc: "개발자가 바로 재현하고 고칠 수 있는 좋은 버그 리포트의 구성과 작성법을 익힙니다.",
    practice: "나쁜 버그 리포트 고치기 · 심각도 판정하기", href: "module-bug-report.html", mission: "m-sw-signup" },
  { id: "sw-6", track: "sw", no: 6, title: "테스트 자동화 기초", minutes: 25,
    desc: "pytest 테스트 코드를 읽고 실행 결과(통과/실패)를 해석하는 법을 배웁니다.",
    practice: "테스트 실행 결과 보고 실패 원인 찾기" },
];

/* 전용 페이지가 없는 모듈은 공통 모듈 페이지(module.html)로 연결 */
const MODULE_MISSION = {
  "ai-2": "m-ai-chatbot", "ai-4": "m-ai-fairness", "ai-5": "m-ai-chatbot", "ai-6": "m-ai-chatbot",
  "sw-2": "m-sw-booking", "sw-3": "m-sw-signup", "sw-4": "m-sw-cart", "sw-1": "m-sw-signup",
};
MODULES.forEach(m => {
  if (!m.href) m.href = "module.html?id=" + m.id;
  if (!m.mission && MODULE_MISSION[m.id]) m.mission = MODULE_MISSION[m.id];
});

/* 실습 LAB 미션 */
const MISSIONS = [
  { id: "m-ai-chatbot", track: "ai", title: "학사 도우미 챗봇 출시 전 검수", minutes: 30, level: "입문",
    brief: "대학 학사 챗봇의 테스트 대화 8건을 학사 규정과 대조해 문제를 찾고, 출시 여부를 판정합니다.",
    output: "AI 답변 평가 리포트", skills: ["정확성 검증", "환각 분석", "편향성", "안전성", "개인정보"],
    href: "mission-chatbot.html" },
  { id: "m-ai-factcheck", track: "ai", title: "AI가 쓴 보고서 팩트체크", minutes: 30, level: "중급",
    brief: "생성형 AI가 작성한 시장 조사 보고서에서 날조된 통계와 가짜 출처를 모두 찾아냅니다.",
    output: "환각 분석 리포트", skills: ["환각 분석", "정확성 검증"], href: "mission-factcheck.html" },
  { id: "m-ai-fairness", track: "ai", title: "채용 추천 AI 공정성 감사", minutes: 40, level: "중급",
    brief: "지원자 정보만 바꾼 입력 쌍으로 채용 추천 AI의 편향 여부를 감사합니다.",
    output: "공정성 평가 리포트", skills: ["편향성", "공정성 지표"], href: "mission-fairness.html" },
  { id: "m-sw-signup", track: "sw", title: "회원가입 기능 배포 전 테스트", minutes: 35, level: "입문",
    brief: "결함이 숨어 있는 쇼핑몰 회원가입 화면을 직접 테스트하고 테스트 케이스와 버그 리포트를 작성합니다.",
    output: "테스트 케이스 + 버그 리포트", skills: ["테스트 케이스", "경계값 분석", "버그 리포트"],
    href: "mission-signup.html" },
  { id: "m-sw-cart", track: "sw", title: "쇼핑몰 장바구니 계산 검증", minutes: 35, level: "중급",
    brief: "쿠폰·수량·배송비가 얽힌 장바구니 금액 계산 로직을 시나리오 기반으로 검증합니다.",
    output: "테스트 시나리오 + 버그 리포트", skills: ["테스트 시나리오", "결정 테이블"], href: "mission-cart.html" },
  { id: "m-sw-booking", track: "sw", title: "예약 시스템 입력 검증", minutes: 30, level: "중급",
    brief: "날짜·인원·시간대 입력의 경계 조건을 검증하고 비기능(사용성) 문제도 함께 보고합니다.",
    output: "테스트 케이스 + 버그 리포트", skills: ["경계값 분석", "비기능 테스트"], href: "mission-booking.html" },
];

/* 용어 사전 */
const GLOSSARY = [
  // AI 신뢰성
  ["ai", "신뢰할 수 있는 AI", "Trustworthy AI", "정확성, 공정성, 안전성, 투명성, 프라이버시, 책임성 등을 갖춰 사람이 믿고 쓸 수 있는 AI."],
  ["ai", "환각", "Hallucination", "AI가 사실이 아니거나 근거 없는 내용을 그럴듯하게 만들어 내는 현상. 가짜 출처, 존재하지 않는 제도 등을 지어내는 것이 대표적."],
  ["ai", "근거 문서", "Grounding Source", "AI 답변이 맞는지 대조할 때 기준으로 삼는 신뢰할 수 있는 자료. 규정집, 공식 문서 등."],
  ["ai", "팩트체크", "Fact-checking", "답변을 주장 단위로 나누고 하나씩 근거 자료와 대조해 사실 여부를 확인하는 작업."],
  ["ai", "사실 오류", "Factual Error", "실제로 존재하는 정보를 틀리게 말하는 것. 예: 정정 기간 1주를 2주라고 답함."],
  ["ai", "출처 날조", "Fabricated Citation", "존재하지 않는 논문, 법 조항, URL 등을 근거인 것처럼 제시하는 환각 유형."],
  ["ai", "편향", "Bias", "AI가 성별·나이·출신 등 특정 집단에 대해 부당하게 치우친 판단이나 고정관념을 드러내는 것."],
  ["ai", "공정성", "Fairness", "AI가 민감 속성과 무관하게 사람들을 동등하게 대우하는 성질."],
  ["ai", "반사실적 테스트", "Counterfactual Testing", "이름·성별 등 한 가지 조건만 바꾼 입력 쌍으로 AI 답변이 달라지는지 확인하는 편향 테스트 기법."],
  ["ai", "안전성", "Safety", "AI가 사람에게 해를 끼칠 수 있는 정보나 조언을 제공하지 않고, 위기 상황에 적절히 대응하는 성질."],
  ["ai", "레드팀", "Red Teaming", "공격자 관점에서 AI 시스템의 취약점과 위험한 동작을 의도적으로 찾아내는 활동."],
  ["ai", "프롬프트 인젝션", "Prompt Injection", "악의적 입력으로 AI가 원래 지시를 무시하고 의도치 않게 동작하도록 만드는 공격."],
  ["ai", "개인정보", "Personal Information", "이름, 연락처, 학번 등 살아 있는 개인을 알아볼 수 있는 정보. AI가 함부로 노출하면 안 된다."],
  ["ai", "설명 가능성", "Explainability (XAI)", "AI가 왜 그런 결론을 내렸는지 사람이 이해할 수 있게 설명하는 능력."],
  ["ai", "근거 기반 생성", "RAG", "검색한 근거 문서를 바탕으로 답변을 생성하는 방식. 환각을 줄이는 대표적 방법."],
  ["ai", "견고성", "Robustness", "오타, 변형된 입력, 의도적인 공격에도 AI가 안정적으로 동작하는 성질."],
  ["ai", "적대적 예제", "Adversarial Example", "사람은 거의 구분하지 못하는 미세한 변형으로 AI의 오판을 유도하는 입력."],
  ["ai", "인구통계적 동등성", "Demographic Parity", "집단 간 선택률(합격률 등)이 비슷해야 한다는 공정성 기준."],
  ["ai", "균등 기회", "Equal Opportunity", "실제로 자격이 있는 사람 중 선택되는 비율이 집단 간 같아야 한다는 공정성 기준."],
  ["ai", "과잉 거절", "Over-refusal", "정당한 요청인데도 AI가 위험하다고 판단해 답하지 않는 것. 유용성을 떨어뜨린다."],
  ["ai", "민감정보", "Sensitive Information", "건강·진료 기록, 사상·신념 등 유출 시 피해가 커서 더 엄격히 보호해야 하는 개인정보."],
  ["ai", "마스킹", "Masking", "개인정보 일부를 * 등으로 가려 노출 범위를 줄이는 방법. 예: 010-****-5678"],
  ["ai", "EU AI Act", "EU Artificial Intelligence Act", "AI 시스템을 위험 수준에 따라 분류하고 규제하는 유럽연합의 AI 법."],
  ["ai", "ISO/IEC 42001", "AI Management System", "조직이 AI를 책임 있게 개발·운영하기 위한 관리 체계(AIMS)에 대한 국제 표준."],
  ["ai", "평가 리포트", "Evaluation Report", "AI 테스트 결과, 발견된 문제, 심각도, 출시 판단과 개선 권고를 정리한 문서."],
  // SW 테스트
  ["sw", "오류", "Error / Mistake", "결함을 만들어 내는 사람의 실수. 예: 요구사항을 잘못 이해함."],
  ["sw", "결함", "Defect / Bug", "코드나 문서에 존재하는 잘못된 부분. 실행되면 실패를 일으킬 수 있다."],
  ["sw", "실패", "Failure", "결함이 실행되어 시스템이 기대와 다르게 동작하는 현상."],
  ["sw", "요구사항", "Requirement", "소프트웨어가 무엇을 해야 하는지 정의한 명세. 테스트의 기준(기대 결과)이 된다."],
  ["sw", "기능 테스트", "Functional Testing", "소프트웨어가 요구된 기능을 올바르게 수행하는지 확인하는 테스트."],
  ["sw", "비기능 테스트", "Non-functional Testing", "성능, 보안, 사용성, 호환성 등 '얼마나 잘' 동작하는지를 확인하는 테스트."],
  ["sw", "테스트 케이스", "Test Case", "입력값, 실행 조건, 기대 결과를 정의한 하나의 테스트 단위."],
  ["sw", "테스트 시나리오", "Test Scenario", "사용자 관점의 흐름(예: 검색→장바구니→결제)을 따라 여러 기능을 연결해 검증하는 테스트 설계."],
  ["sw", "동등 분할", "Equivalence Partitioning", "같은 방식으로 처리될 입력을 그룹으로 나누고 그룹별 대표값만 테스트하는 기법."],
  ["sw", "경계값 분석", "Boundary Value Analysis", "입력 범위의 경계와 그 주변 값을 집중적으로 테스트하는 기법. 결함이 경계에서 자주 발생하기 때문."],
  ["sw", "버그 리포트", "Bug Report", "발견한 결함을 개발자가 재현하고 수정할 수 있도록 정리한 문서."],
  ["sw", "재현 절차", "Steps to Reproduce", "결함을 다시 발생시키는 구체적인 단계. 버그 리포트에서 가장 중요한 항목."],
  ["sw", "심각도", "Severity", "결함이 시스템에 미치는 영향의 크기. 치명적·높음·보통·낮음 등으로 구분."],
  ["sw", "우선순위", "Priority", "결함을 얼마나 빨리 고쳐야 하는지에 대한 비즈니스 관점의 판단."],
  ["sw", "오탐", "False Positive", "실제로는 결함이 아닌데 결함으로 보고하는 것."],
  ["sw", "회귀 테스트", "Regression Testing", "코드 변경 후 기존 기능이 여전히 잘 동작하는지 다시 확인하는 테스트."],
  ["sw", "단위 테스트", "Unit Testing", "함수나 클래스처럼 가장 작은 단위를 독립적으로 검증하는 테스트."],
  ["sw", "결정 테이블 테스트", "Decision Table Testing", "여러 조건의 조합과 그에 따른 결과를 표로 정리해 빠짐없이 테스트하는 기법."],
  ["sw", "지속적 통합", "Continuous Integration (CI)", "코드 변경을 자주 통합하고, 그때마다 자동으로 빌드와 테스트를 실행하는 개발 방식."],
  ["sw", "Flaky 테스트", "Flaky Test", "코드 변경이 없는데도 실행할 때마다 통과·실패가 바뀌는 불안정한 테스트. 주로 환경·타이밍 문제가 원인."],
  ["sw", "테스트 자동화", "Test Automation", "테스트 실행과 결과 확인을 코드와 도구로 자동 수행하는 것. 예: pytest, Playwright."],
];

function glossaryDef(ko) {
  const t = GLOSSARY.find(g => g[1] === ko);
  return t ? t[3] : "";
}
