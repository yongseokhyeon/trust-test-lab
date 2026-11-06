/* ===========================================================
   TRUST&TEST LAB — 공통 기능
   - 학습 기록/결과/포트폴리오 저장 (브라우저 localStorage)
   - 공통 헤더/푸터, 용어 툴팁, 퀴즈, 토스트
   =========================================================== */

/* ---------- 저장소 ---------- */
const STORE_KEY = "ttlab-v1";
const DEFAULT_STATE = () => ({
  interest: null,          // 'ai' | 'sw' | 'both'
  modules: {},             // { [moduleId]: { done, doneAt, quiz: {score,total,at}, practice: {score,total} } }
  missions: {},            // { [missionId]: { best, last, attempts, at, detail } }
  portfolio: [],           // [{ id, type, missionId, track, title, score, at, summary, content }]
  drafts: {},              // { [key]: any }
  last: null,              // { href, title, at }
});

const Store = {
  _cache: null,
  load() {
    if (this._cache) return this._cache;
    let s = null;
    try { s = JSON.parse(localStorage.getItem(STORE_KEY)); } catch { s = null; }
    this._cache = Object.assign(DEFAULT_STATE(), s || {});
    return this._cache;
  },
  save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(this._cache)); }
    catch { toast("이 브라우저에서는 저장이 지원되지 않습니다."); }
  },
  update(fn) { const s = this.load(); fn(s); this.save(); return s; },
  reset() { this._cache = DEFAULT_STATE(); this.save(); },
};

/* 학습 기록 API */
const Progress = {
  module(id) { return Store.load().modules[id] || {}; },
  setModuleDone(id, done) {
    Store.update(s => {
      s.modules[id] = s.modules[id] || {};
      s.modules[id].done = done;
      s.modules[id].doneAt = done ? Date.now() : null;
    });
  },
  setQuiz(id, score, total) {
    Store.update(s => {
      s.modules[id] = s.modules[id] || {};
      s.modules[id].quiz = { score, total, at: Date.now() };
    });
  },
  setPractice(id, key, score, total, name) {
    Store.update(s => {
      s.modules[id] = s.modules[id] || {};
      s.modules[id].practice = s.modules[id].practice || {};
      s.modules[id].practice[key] = { score, total, name, at: Date.now() };
    });
  },
  recordMission(id, score, detail) {
    Store.update(s => {
      const m = s.missions[id] || { attempts: 0, best: 0 };
      m.attempts += 1; m.last = score; m.best = Math.max(m.best || 0, score);
      m.at = Date.now(); m.detail = detail;
      s.missions[id] = m;
    });
  },
  mission(id) { return Store.load().missions[id] || null; },
  track(track) {
    const list = MODULES.filter(m => m.track === track);
    const done = list.filter(m => Progress.module(m.id).done).length;
    return { done, total: list.length, pct: Math.round(done / list.length * 100) };
  },
  hasActivity() {
    const s = Store.load();
    return Object.keys(s.modules).length > 0 || Object.keys(s.missions).length > 0 || s.portfolio.length > 0;
  },
  setLast(href, title) { Store.update(s => { s.last = { href, title, at: Date.now() }; }); },
};

const Portfolio = {
  list() { return Store.load().portfolio.slice().sort((a, b) => b.at - a.at); },
  add(item) {
    const entry = Object.assign({ id: "pf-" + Date.now(), at: Date.now() }, item);
    Store.update(s => { s.portfolio.push(entry); });
    return entry;
  },
  remove(id) { Store.update(s => { s.portfolio = s.portfolio.filter(p => p.id !== id); }); },
  get(id) { return Store.load().portfolio.find(p => p.id === id); },
};

const Drafts = {
  get(key, fallback) { const d = Store.load().drafts[key]; return d === undefined ? fallback : d; },
  set(key, value) { Store.update(s => { s.drafts[key] = value; }); },
  clear(key) { Store.update(s => { delete s.drafts[key]; }); },
};

/* ---------- 유틸 ---------- */
function esc(str) {
  return String(str ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function fmtDate(ts) {
  if (!ts) return "-";
  const d = new Date(ts);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}
function $(sel, root = document) { return root.querySelector(sel); }
function $$(sel, root = document) { return [...root.querySelectorAll(sel)]; }

let toastTimer;
function toast(msg) {
  let el = $("#toast");
  if (!el) { el = document.createElement("div"); el.id = "toast"; el.className = "toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2400);
}

/* ---------- 공통 헤더/푸터 ---------- */
const NAV = [
  ["index.html", "홈", "home"],
  ["ai-lab.html", "AI 신뢰성 학습실", "ai"],
  ["sw-lab.html", "SW 테스트 학습실", "sw"],
  ["lab.html", "실습 LAB", "lab"],
  ["resources.html", "학습 자료실", "resources"],
  ["mypage.html", "마이페이지", "my"],
];

function renderChrome() {
  const page = document.body.dataset.page || "";
  const header = $("#site-header");
  if (header) {
    header.className = "site-header";
    header.innerHTML = `
      <nav class="container nav" aria-label="주 메뉴">
        <a class="logo" href="index.html"><span class="logo-mark">T&amp;T</span>TRUST<span class="amp">&amp;</span>TEST LAB</a>
        <button class="menu-btn" id="menu-btn" aria-label="메뉴 열기" aria-expanded="false">☰</button>
        <ul class="nav-links" id="nav-links">
          ${NAV.map(([href, label, key]) => `<li><a href="${href}" class="${page === key ? "active" : ""} ${key === "my" ? "my" : ""}">${key === "my" ? "👤 " : ""}${label}</a></li>`).join("")}
        </ul>
      </nav>`;
    $("#menu-btn").addEventListener("click", e => {
      const open = $("#nav-links").classList.toggle("open");
      e.currentTarget.setAttribute("aria-expanded", open);
    });
  }
  const footer = $("#site-footer");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="container footer-grid">
        <div>
          <strong style="color:var(--text)">TRUST&amp;TEST LAB</strong><br>
          이론 · 실습 · 분석 · 포트폴리오를 하나로 잇는 AI 신뢰성 & QA 교육 플랫폼<br>
          <span class="small">학습 기록은 사용 중인 브라우저에만 저장됩니다.</span>
        </div>
        <ul>${NAV.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join("")}</ul>
      </div>`;
  }
}

/* ---------- 용어 툴팁: <span class="term">환각</span> ---------- */
function initTerms() {
  $$(".term").forEach(el => {
    const key = el.dataset.term || el.textContent.trim();
    const def = glossaryDef(key);
    if (!def) return;
    el.dataset.tip = def;
    el.tabIndex = 0;
    el.setAttribute("aria-label", `${el.textContent}: ${def}`);
  });
}

/* ---------- 퀴즈 컴포넌트 ---------- */
function renderQuiz(el, moduleId, questions) {
  const answered = {};
  let score = 0;
  el.innerHTML = questions.map((q, i) => `
    <div class="quiz-q" data-i="${i}">
      <p>Q${i + 1}. ${q.q}</p>
      ${q.opts.map((o, j) => `<button class="quiz-opt" data-j="${j}">${o}</button>`).join("")}
      <div class="quiz-explain">💡 ${q.ex}</div>
    </div>`).join("") +
    `<div class="quiz-result" id="${moduleId}-quiz-result"><b></b><button class="btn btn-ghost btn-sm" data-retry>다시 풀기</button></div>`;

  const prev = Progress.module(moduleId).quiz;
  if (prev) {
    const r = $(".quiz-result", el);
    r.classList.add("show");
    r.querySelector("b").textContent = `지난 결과: ${prev.total}문제 중 ${prev.score}문제 정답 (${fmtDate(prev.at)})`;
  }

  el.onclick = e => {
    if (e.target.closest("[data-retry]")) { renderQuiz(el, moduleId, questions); return; }
    const btn = e.target.closest(".quiz-opt");
    if (!btn) return;
    const box = btn.closest(".quiz-q");
    const i = +box.dataset.i, j = +btn.dataset.j;
    if (answered[i] !== undefined) return;
    answered[i] = j;
    const correct = questions[i].a;
    $$(".quiz-opt", box).forEach((b, k) => {
      b.disabled = true;
      if (k === correct) b.classList.add("correct");
      else if (k === j) b.classList.add("wrong");
    });
    $(".quiz-explain", box).classList.add("show");
    if (j === correct) score++;
    if (Object.keys(answered).length === questions.length) {
      Progress.setQuiz(moduleId, score, questions.length);
      const r = $(".quiz-result", el);
      r.classList.add("show");
      r.querySelector("b").textContent = `결과: ${questions.length}문제 중 ${score}문제 정답! ` +
        (score === questions.length ? "🏆 완벽해요." : "해설을 확인하고 복습해 보세요.");
      toast("퀴즈 결과가 마이페이지에 저장되었습니다.");
    }
  };
}

/* ---------- 모듈 완료 박스 ----------
   required: 완료 전에 끝내야 할 미니 실습 목록 [{ key, name, anchor }]
   미니 실습(채점까지)과 확인 퀴즈(모든 문항 응답)를 모두 마쳐야 완료할 수 있습니다. */
function bindComplete(btn, moduleId, required = []) {
  const box = btn.closest(".complete-box");
  let msg = box && box.querySelector(".complete-msg");
  if (box && !msg) {
    msg = document.createElement("div");
    msg.className = "feedback complete-msg";
    msg.style.flexBasis = "100%";
    msg.setAttribute("role", "alert");
    box.appendChild(msg);
  }
  const missing = () => {
    const st = Progress.module(moduleId);
    const list = required.filter(p => !(st.practice && st.practice[p.key]))
      .map(p => `<a href="#${p.anchor}">미니 실습 · ${p.name}</a>`);
    if (!st.quiz) list.push('<a href="#quiz">확인 퀴즈</a>');
    return list;
  };
  const sync = () => {
    const done = !!Progress.module(moduleId).done;
    btn.textContent = done ? "✓ 학습 완료 (취소하기)" : "학습 완료로 표시";
    btn.className = "btn " + (done ? "btn-ghost" : "btn-primary");
  };
  btn.addEventListener("click", () => {
    const done = !Progress.module(moduleId).done;
    if (done) {
      const left = missing();
      if (left.length) {
        if (msg) {
          msg.className = "feedback complete-msg show bad";
          msg.innerHTML = `<b>아직 풀지 않은 문제가 있어요.</b> 아래 항목을 모두 푼 뒤에 학습 완료를 눌러 주세요.<br>${left.map(l => "· " + l).join("<br>")}`;
        }
        toast("미니 실습과 퀴즈를 모두 풀어야 학습 완료할 수 있어요.");
        return;
      }
    }
    if (msg) msg.className = "feedback complete-msg";
    Progress.setModuleDone(moduleId, done);
    sync();
    toast(done ? "학습 완료! 진도가 마이페이지에 반영되었습니다." : "완료 표시를 취소했습니다.");
  });
  sync();
}

/* ---------- 학습실 페이지 렌더링 ---------- */
function renderTrackRoom(track) {
  const t = TRACKS[track];
  const p = Progress.track(track);
  $("#track-progress").innerHTML = `
    <div style="display:flex;justify-content:space-between;font-size:.9rem;margin-bottom:6px">
      <b>내 진도</b><span class="muted">${p.done} / ${p.total} 모듈 완료 · ${p.pct}%</span>
    </div>
    <div class="progress ${track}"><i style="width:${p.pct}%"></i></div>`;

  $("#module-list").innerHTML = MODULES.filter(m => m.track === track).map(m => {
    const st = Progress.module(m.id);
    const open = !!m.href;
    const status = st.done ? '<span class="tag ok">✓ 완료</span>'
      : open ? '<span class="tag blue">학습 가능</span>' : '<span class="tag">준비 중</span>';
    const quiz = st.quiz ? `<span>📝 퀴즈 ${st.quiz.score}/${st.quiz.total}</span>` : "";
    return `
      <article class="module-item ${track} ${st.done ? "done" : ""} ${open ? "" : "locked"}">
        <div class="no">${st.done ? "✓" : String(m.no).padStart(2, "0")}</div>
        <div>
          <div class="tags">${status}</div>
          <h3>${m.title}</h3>
          <p>${m.desc}</p>
          <div class="meta"><span>⏱ ${m.minutes}분</span><span>✋ 미니 실습: ${m.practice}</span>${quiz}</div>
        </div>
        <div class="action">
          ${open ? `<a class="btn ${st.done ? "btn-ghost" : "btn-primary"}" href="${m.href}">${st.done ? "복습하기" : "학습 시작"}</a>`
                 : '<button class="btn btn-ghost" disabled>준비 중</button>'}
        </div>
      </article>`;
  }).join("");

  $("#track-missions").innerHTML = MISSIONS.filter(m => m.track === track).map(missionCard).join("");
}

/* ---------- 미션 카드 ---------- */
function missionCard(m) {
  const rec = Progress.mission(m.id);
  const open = !!m.href;
  return `
    <article class="card ${open ? "hover" : "dim"}">
      <div class="icon-box ${m.track}">${m.track === "ai" ? "🔎" : "🐞"}</div>
      <div class="tags">
        <span class="tag ${m.track}">${TRACKS[m.track].name}</span>
        <span class="tag">${m.level}</span>
        ${rec ? `<span class="tag ok">최고 ${rec.best}점</span>` : ""}
      </div>
      <h3>${m.title}</h3>
      <p class="grow">${m.brief}</p>
      <div class="small muted">📄 결과물: <b style="color:var(--text-2)">${m.output}</b></div>
      <div class="card-foot">
        <span>⏱ 약 ${m.minutes}분</span>
        ${open ? `<a class="btn btn-sm ${rec ? "btn-ghost" : "btn-primary"}" href="${m.href}">${rec ? "다시 도전" : "미션 시작"}</a>`
               : '<span class="tag">준비 중</span>'}
      </div>
    </article>`;
}

/* ---------- 모달 ---------- */
function openModal(html) {
  let bd = $("#modal");
  if (!bd) {
    bd = document.createElement("div");
    bd.id = "modal"; bd.className = "modal-backdrop";
    bd.innerHTML = `<div class="modal" role="dialog" aria-modal="true"><button class="modal-close" aria-label="닫기">✕</button><div class="modal-body"></div></div>`;
    document.body.appendChild(bd);
    bd.addEventListener("click", e => { if (e.target === bd || e.target.closest(".modal-close")) closeModal(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
  }
  $(".modal-body", bd).innerHTML = html;
  bd.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  const bd = $("#modal");
  if (bd) bd.classList.remove("open");
  document.body.style.overflow = "";
}

/* ---------- 포트폴리오 결과물 렌더링 (마이페이지·미션 공용) ---------- */
function renderPortfolioDoc(item) {
  const c = item.content || {};
  const head = `
    <div class="tags"><span class="tag ${item.track}">${TRACKS[item.track].name}</span><span class="tag">${esc(item.typeName || "")}</span><span class="tag blue">${item.score}점</span></div>
    <h2 style="margin-bottom:4px">${esc(item.title)}</h2>
    <p class="muted small">작성일 ${fmtDate(item.at)} · 미션: ${esc((MISSIONS.find(m => m.id === item.missionId) || {}).title || "")}</p>`;

  if (item.type === "ai-report") {
    return head + `
      <h3>1. 검수 개요</h3>
      <p>${esc(c.scope)}</p>
      <h3>2. 종합 판정: ${esc(c.verdictLabel)}</h3>
      <p style="white-space:pre-wrap">${esc(c.summary) || '<span class="muted">(작성하지 않음)</span>'}</p>
      <h3>3. 항목별 검수 결과</h3>
      <div class="table-wrap"><table>
        <thead><tr><th>#</th><th>질문</th><th>판정</th><th>심각도</th><th>검수 의견</th></tr></thead>
        <tbody>${(c.items || []).map((r, i) => `<tr><td>${i + 1}</td><td>${esc(r.q)}</td><td>${esc(r.label)}</td><td>${esc(r.severity)}</td><td>${esc(r.memo) || "-"}</td></tr>`).join("")}</tbody>
      </table></div>
      <h3>4. 개선 권고</h3>
      <p style="white-space:pre-wrap">${esc(c.recommendation) || '<span class="muted">(작성하지 않음)</span>'}</p>`;
  }

  /* 범용 문서형 결과물: sections = [{ h, text } | { h, table: { head: [], rows: [[]] } }] */
  if (item.type === "doc") {
    return head + (c.sections || []).map((s, i) => `<h3>${i + 1}. ${esc(s.h)}</h3>` + (s.table
      ? `<div class="table-wrap"><table><thead><tr>${s.table.head.map(h => `<th>${esc(h)}</th>`).join("")}</tr></thead>
          <tbody>${s.table.rows.map(r => `<tr>${r.map(v => `<td>${esc(v) || "-"}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`
      : `<p style="white-space:pre-wrap">${esc(s.text) || '<span class="muted">(작성하지 않음)</span>'}</p>`)).join("");
  }

  if (item.type === "bug-report") {
    return head + `
      <h3>1. 테스트 대상</h3>
      <p>${esc(c.target)}</p>
      <h3>2. ${esc(c.tcTitle || "테스트 케이스")} (${(c.testCases || []).length}건)</h3>
      <div class="table-wrap"><table>
        <thead><tr><th>ID</th><th>요구사항</th><th>테스트 내용</th><th>입력값</th><th>기대 결과</th><th>실제 결과</th><th>판정</th></tr></thead>
        <tbody>${(c.testCases || []).map(t => `<tr><td>${esc(t.id)}</td><td>${esc(t.req)}</td><td>${esc(t.desc)}</td><td>${esc(t.input)}</td><td>${esc(t.expected)}</td><td>${esc(t.actual)}</td><td>${t.verdict === "fail" ? '<span class="tag bad">실패</span>' : t.verdict === "pass" ? '<span class="tag ok">통과</span>' : "-"}</td></tr>`).join("")}</tbody>
      </table></div>
      <h3>3. 버그 리포트 (${(c.bugs || []).length}건)</h3>
      ${(c.bugs || []).map(b => bugReportCard(b)).join("") || '<p class="muted">작성한 버그 리포트가 없습니다.</p>'}`;
  }
  return head;
}

function bugReportCard(b, actions = "") {
  return `
    <div class="report-card">
      <div class="rc-head">
        <div>
          <div class="tags"><span class="tag">${esc(b.id)}</span><span class="tag sw">${esc(b.req)}</span>
            <span class="tag ${b.severity === "치명적" || b.severity === "높음" ? "bad" : b.severity === "보통" ? "warn" : ""}">심각도: ${esc(b.severity)}</span>
            <span class="tag">우선순위: ${esc(b.priority)}</span></div>
          <h4>${esc(b.title)}</h4>
        </div>
        ${actions}
      </div>
      <dl>
        <dt>환경</dt><dd>${esc(b.env)}</dd>
        <dt>재현 절차</dt><dd>${esc(b.steps)}</dd>
        <dt>기대 결과</dt><dd>${esc(b.expected)}</dd>
        <dt>실제 결과</dt><dd>${esc(b.actual)}</dd>
      </dl>
    </div>`;
}

document.addEventListener("DOMContentLoaded", () => {
  renderChrome();
  initTerms();
});
