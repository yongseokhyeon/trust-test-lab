/* ===========================================================
   버그 헌팅 미션 공통 엔진
   - 미션 페이지는 설정(cfg)과 가상 앱(renderApp)만 정의하면 됩니다.
   - 테스트 로그, 테스트 케이스/시나리오 표, 버그 리포트, 채점, 포트폴리오 저장을 담당
   =========================================================== */
function BugHunt(cfg) {
  const DRAFT_KEY = "draft-" + cfg.missionId;
  const mission = MISSIONS.find(m => m.id === cfg.missionId);
  Progress.setLast(mission.href, "실습 LAB · " + mission.title);

  let draft = Drafts.get(DRAFT_KEY, null) || { tcs: [], bugs: [], log: [], triggered: [], seq: { tc: 0, bug: 0 }, submitted: null };
  const save = () => Drafts.set(DRAFT_KEY, draft);
  const locked = () => !!draft.submitted;
  const T = cfg.table;                       // { title, idPrefix, desc, input, descPh, inputPh }
  const reqIds = cfg.reqs.map(r => r.id);
  const bugPts = Math.round(60 / cfg.bugs.length);
  const findMax = bugPts * cfg.bugs.length;

  /* ---------- 화면 골격 ---------- */
  const root = document.getElementById("hunt");
  root.innerHTML = `
    <div class="brief sw">
      <div class="from">${cfg.from}</div>
      <h2>${cfg.briefTitle}</h2>
      ${cfg.briefHtml}
    </div>
    <div class="mission-grid wide-left">
      <div>
        <div class="block-title" style="margin-top:0"><h2>📋 요구사항 명세</h2></div>
        <div class="table-wrap" style="margin-top:0"><table>
          <thead><tr><th>ID</th><th>항목</th><th>요구사항</th></tr></thead>
          <tbody>${cfg.reqs.map(r => `<tr><td><b>${r.id}</b></td><td>${r.item}</td><td>${r.text}</td></tr>`).join("")}</tbody>
        </table></div>
        <div class="callout"><b>💡 테스트 팁</b><ul style="margin:0">${cfg.tips.map(t => `<li>${t}</li>`).join("")}
          <li>테스트 로그의 <b>"표에 추가"</b>를 누르면 입력값과 실제 결과가 아래 표에 자동으로 채워집니다.</li></ul></div>
      </div>
      <div>
        <div class="block-title" style="margin-top:0"><h2>📱 테스트 서버</h2><span class="tag">${cfg.version}</span></div>
        <div class="device"><div class="device-bar"><span>${cfg.host}</span><span>🔒 테스트 서버</span></div>
          <div class="device-body" id="bh-app"></div></div>
        <div class="practice" style="margin-top:18px">
          <div class="practice-head"><h3>🧾 테스트 실행 로그</h3><button class="btn btn-ghost btn-sm" id="bh-log-clear">로그 지우기</button></div>
          <div class="log" id="bh-log"></div>
        </div>
      </div>
    </div>

    <div class="block-title">
      <h2>STEP 3 · ${T.title} <span class="tag sw" id="bh-tc-count" style="vertical-align:middle">0건</span></h2>
      <button class="btn btn-outline btn-sm" id="bh-tc-add">+ 빈 행 추가</button>
    </div>
    <div class="table-wrap edit-table" style="margin-top:0"><table>
      <thead><tr><th>ID</th><th>요구사항</th><th>${T.desc}</th><th>${T.input}</th><th>기대 결과</th><th>실제 결과</th><th>판정</th><th></th></tr></thead>
      <tbody id="bh-tc"></tbody>
    </table></div>

    <div class="block-title"><h2>STEP 4 · 버그 리포트 작성 <span class="tag sw" id="bh-bug-count" style="vertical-align:middle">0건</span></h2></div>
    <div class="grid grid-2" style="align-items:start">
      <form class="practice" id="bh-form" style="margin:0" novalidate>
        <div class="practice-head"><h3 id="bh-form-title">✍️ 새 버그 리포트</h3></div>
        <div class="field"><label for="b-title">제목</label><input class="input" id="b-title" placeholder="[화면] 무엇을 하면 어떤 문제가 생기는지 한 줄로"></div>
        <div class="field-row three">
          <div class="field"><label for="b-req">관련 요구사항</label><select class="select" id="b-req"><option value="">선택</option>${reqIds.map(r => `<option>${r}</option>`).join("")}</select></div>
          <div class="field"><label for="b-sev">심각도</label><select class="select" id="b-sev"><option value="">선택</option><option>치명적</option><option>높음</option><option>보통</option><option>낮음</option></select></div>
          <div class="field"><label for="b-pri">우선순위</label><select class="select" id="b-pri"><option>높음</option><option selected>보통</option><option>낮음</option></select></div>
        </div>
        <div class="field"><label for="b-env">환경</label><input class="input" id="b-env"></div>
        <div class="field"><label for="b-steps">재현 절차</label><textarea class="textarea" id="b-steps" placeholder="1. ...&#10;2. ...&#10;3. ..."></textarea></div>
        <div class="field-row">
          <div class="field"><label for="b-exp">기대 결과</label><textarea class="textarea" id="b-exp" placeholder="요구사항에 따라 원래 일어나야 할 일"></textarea></div>
          <div class="field"><label for="b-act">실제 결과</label><textarea class="textarea" id="b-act" placeholder="실제로 일어난 일 (화면 표시 그대로)"></textarea></div>
        </div>
        <div class="btn-row"><button class="btn btn-primary" type="submit" id="bh-save">버그 리포트 등록</button><button class="btn btn-ghost hidden" type="button" id="bh-cancel">수정 취소</button></div>
      </form>
      <div id="bh-bugs"></div>
    </div>

    <div class="complete-box" style="margin-top:36px">
      <div><b>테스트를 마쳤나요?</b><div class="small muted">제출하면 숨겨진 결함과 비교해 채점합니다. 작성 중인 내용은 자동 저장됩니다.</div></div>
      <div class="btn-row"><button class="btn btn-ghost" id="bh-reset">처음부터 다시</button><button class="btn btn-primary btn-lg" id="bh-submit">결과물 제출하고 채점받기</button></div>
    </div>

    <div id="bh-result" class="hidden">
      <div class="block-title"><h2>STEP 5 · 채점 결과와 피드백</h2></div>
      <div class="score-hero" id="bh-score"></div>
      <div id="bh-notes"></div>
      <h3 style="margin-top:28px">숨겨진 결함 ${cfg.bugs.length}개</h3>
      <div id="bh-findings"></div>
      <div class="btn-row" style="margin-top:18px">
        <button class="btn btn-primary btn-lg" id="bh-save-pf">📁 포트폴리오에 저장</button>
        <a class="btn btn-ghost btn-lg" href="mypage.html#results">마이페이지에서 결과 보기</a>
        <button class="btn btn-ghost btn-lg" id="bh-retry">다시 도전</button>
      </div>
    </div>`;

  /* ---------- 가상 앱 연결 ---------- */
  const api = {
    /* 미션 앱이 테스트 1회 실행마다 호출: 입력 요약, 결과 문구, 성공 여부, 재현된 결함 ID 목록 */
    record(input, result, ok, triggered = []) {
      triggered.forEach(b => { if (!draft.triggered.includes(b)) draft.triggered.push(b); });
      draft.log.unshift({ at: Date.now(), input, result, ok });
      draft.log = draft.log.slice(0, 40);
      save(); renderLog(); updateStepper();
    },
    locked,
    count: () => draft.log.length,
  };
  cfg.renderApp(document.getElementById("bh-app"), api);

  /* ---------- 로그 ---------- */
  function renderLog() {
    $("#bh-log").innerHTML = draft.log.length ? draft.log.map((l, i) => `
      <div class="log-item">
        <div style="display:flex;justify-content:space-between;gap:8px;align-items:center">
          <span class="${l.ok ? "r-ok" : "r-err"}">${l.ok ? "✔ " + (cfg.okLabel || "처리 성공") : "✖ " + (cfg.errLabel || "오류 표시")}</span>
          ${locked() ? "" : `<button class="btn btn-ghost btn-sm" data-log="${i}">표에 추가</button>`}
        </div>
        <span class="muted">${esc(l.input)}</span><span>${esc(l.result)}</span>
      </div>`).join("")
      : `<p class="muted small" style="margin:0;padding:8px">아직 실행한 테스트가 없습니다. 위의 테스트 서버에서 값을 입력하고 실행해 보세요.</p>`;
  }
  $("#bh-log").addEventListener("click", e => {
    const b = e.target.closest("[data-log]");
    if (!b) return;
    const l = draft.log[+b.dataset.log];
    addTc({ input: l.input, actual: l.result });
    toast("표에 추가했어요. 요구사항, 내용, 기대 결과, 판정을 채워 주세요.");
  });
  $("#bh-log-clear").addEventListener("click", () => { if (!locked()) { draft.log = []; save(); renderLog(); } });

  /* ---------- 테스트 케이스 / 시나리오 표 ---------- */
  function addTc(pre = {}) {
    draft.seq.tc += 1;
    draft.tcs.push(Object.assign({ id: `${T.idPrefix}-${String(draft.seq.tc).padStart(2, "0")}`, req: "", desc: "", input: "", expected: "", actual: "", verdict: "" }, pre));
    save(); renderTcs(); updateStepper();
  }
  function renderTcs() {
    const dis = locked() ? "disabled" : "";
    $("#bh-tc-count").textContent = draft.tcs.length + "건";
    $("#bh-tc").innerHTML = draft.tcs.length ? draft.tcs.map((t, i) => `
      <tr data-i="${i}">
        <td>${t.id}</td>
        <td><select class="select" data-f="req" ${dis}><option value="">-</option>${reqIds.map(r => `<option ${t.req === r ? "selected" : ""}>${r}</option>`).join("")}</select></td>
        <td><input class="input" data-f="desc" value="${esc(t.desc)}" placeholder="${T.descPh}" ${dis}></td>
        <td><input class="input" data-f="input" value="${esc(t.input)}" placeholder="${T.inputPh}" ${dis}></td>
        <td><input class="input" data-f="expected" value="${esc(t.expected)}" placeholder="요구사항 기준 결과" ${dis}></td>
        <td><input class="input" data-f="actual" value="${esc(t.actual)}" placeholder="실제로 본 결과" ${dis}></td>
        <td><select class="select" data-f="verdict" ${dis}><option value="">-</option><option value="pass" ${t.verdict === "pass" ? "selected" : ""}>통과</option><option value="fail" ${t.verdict === "fail" ? "selected" : ""}>실패</option></select></td>
        <td>${locked() ? "" : `<button class="icon-del" data-del="${i}" aria-label="${t.id} 삭제">✕</button>`}</td>
      </tr>`).join("")
      : `<tr><td colspan="8" class="muted" style="text-align:center;padding:22px">테스트 로그에서 "표에 추가"를 누르거나 빈 행을 추가하세요.</td></tr>`;
  }
  $("#bh-tc-add").addEventListener("click", () => { if (!locked()) addTc(); });
  $("#bh-tc").addEventListener("input", e => {
    const row = e.target.closest("tr"), f = e.target.dataset.f;
    if (!row || !f) return;
    draft.tcs[+row.dataset.i][f] = e.target.value; save(); updateStepper();
  });
  $("#bh-tc").addEventListener("click", e => {
    const b = e.target.closest("[data-del]");
    if (!b) return;
    draft.tcs.splice(+b.dataset.del, 1); save(); renderTcs(); updateStepper();
  });

  /* ---------- 버그 리포트 ---------- */
  let editing = null;
  const BF = { title: "#b-title", req: "#b-req", severity: "#b-sev", priority: "#b-pri", env: "#b-env", steps: "#b-steps", expected: "#b-exp", actual: "#b-act" };
  const readBug = () => { const o = {}; Object.entries(BF).forEach(([k, s]) => o[k] = $(s).value.trim()); return o; };
  const fillBug = b => Object.entries(BF).forEach(([k, s]) => $(s).value = b[k] ?? "");
  function resetForm() {
    editing = null;
    fillBug({ priority: "보통", env: cfg.env });
    $("#bh-form-title").textContent = "✍️ 새 버그 리포트";
    $("#bh-save").textContent = "버그 리포트 등록";
    $("#bh-cancel").classList.add("hidden");
  }
  $("#bh-form").addEventListener("submit", e => {
    e.preventDefault();
    if (locked()) return;
    const b = readBug();
    if (!b.title || !b.req || !b.severity) { toast("제목, 관련 요구사항, 심각도는 꼭 입력해 주세요."); return; }
    if (editing !== null) { Object.assign(draft.bugs[editing], b); toast("버그 리포트를 수정했어요."); }
    else { draft.seq.bug += 1; draft.bugs.push(Object.assign({ id: "BUG-" + String(draft.seq.bug).padStart(3, "0") }, b)); toast("버그 리포트를 등록했어요."); }
    save(); resetForm(); renderBugs(); updateStepper();
  });
  $("#bh-cancel").addEventListener("click", resetForm);
  function renderBugs() {
    $("#bh-bug-count").textContent = draft.bugs.length + "건";
    $("#bh-bugs").innerHTML = draft.bugs.length ? draft.bugs.map((b, i) => bugReportCard(b, locked() ? "" : `
        <div class="btn-row" style="flex-wrap:nowrap"><button class="btn btn-ghost btn-sm" data-edit="${i}">수정</button><button class="btn btn-danger btn-sm" data-delbug="${i}">삭제</button></div>`)).join("")
      : `<div class="empty">등록한 버그 리포트가 없습니다.<br><span class="small">요구사항과 다르게 동작하는 부분을 찾으면 왼쪽 양식으로 등록하세요.</span></div>`;
  }
  $("#bh-bugs").addEventListener("click", e => {
    const ed = e.target.closest("[data-edit]"), del = e.target.closest("[data-delbug]");
    if (ed) {
      editing = +ed.dataset.edit; fillBug(draft.bugs[editing]);
      $("#bh-form-title").textContent = `✏️ ${draft.bugs[editing].id} 수정`;
      $("#bh-save").textContent = "수정 저장"; $("#bh-cancel").classList.remove("hidden");
      $("#bh-form").scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (del && confirm("이 버그 리포트를 삭제할까요?")) {
      draft.bugs.splice(+del.dataset.delbug, 1);
      if (editing !== null) resetForm();
      save(); renderBugs(); updateStepper();
    }
  });

  /* ---------- 단계 표시 ---------- */
  function updateStepper() {
    const st = [true, draft.log.length > 0, draft.tcs.length > 0, draft.bugs.length > 0, locked()];
    let onSet = false;
    $$("#stepper li").forEach((li, i) => { li.className = st[i] ? "done" : (onSet ? "" : "on"); if (!st[i]) onSet = true; });
  }

  /* ---------- 채점 ---------- */
  function grade() {
    const found = cfg.bugs.map(b => ({ ...b, found: draft.bugs.some(r => r.req === b.req), reproduced: draft.triggered.includes(b.id) }));
    const foundCount = found.filter(f => f.found).length;
    const findPts = foundCount * bugPts;
    const quality = draft.bugs.length ? draft.bugs.reduce((s, b) => s +
      [b.title.length >= 8, b.steps.length >= 10, b.expected.length >= 4, b.actual.length >= 4, !!b.severity].filter(Boolean).length / 5, 0) / draft.bugs.length : 0;
    const qualityPts = Math.round(quality * 25);
    const meaningful = draft.tcs.filter(t => t.req && (t.desc || t.input));
    const covered = new Set(meaningful.map(t => t.req)).size;
    const tcPts = Math.round(covered / reqIds.length * 10 + Math.min(meaningful.length, cfg.minTc) / cfg.minTc * (15 - 10));
    const bugReqs = cfg.bugs.map(b => b.req);
    const falsePos = draft.bugs.filter(b => !bugReqs.includes(b.req));
    const dupReqs = Object.entries(draft.bugs.reduce((m, b) => (m[b.req] = (m[b.req] || 0) + 1, m), {})).filter(([, n]) => n > 1).map(([r]) => r);
    return { total: findPts + qualityPts + tcPts, found, foundCount, findPts, qualityPts, tcPts, covered, tcN: meaningful.length, falsePos, dupReqs };
  }

  function showResult(r, scroll) {
    renderTcs(); renderBugs(); renderLog();
    $$("#bh-app input, #bh-app select, #bh-app button, #bh-form input, #bh-form select, #bh-form textarea, #bh-form button, #bh-tc-add, #bh-submit, #bh-log-clear").forEach(x => x.disabled = true);
    $("#bh-result").classList.remove("hidden");
    $("#bh-score").innerHTML = `
      <div class="score-ring" style="--p:${r.total}"><div><div><b>${r.total}</b><span>/ 100점</span></div></div></div>
      <div class="score-breakdown">
        <div class="row"><span>결함 발견</span><div class="progress sw"><i style="width:${r.findPts / findMax * 100}%"></i></div><b>${r.findPts}/${findMax}</b></div>
        <div class="row"><span>리포트 품질</span><div class="progress sw"><i style="width:${r.qualityPts / 25 * 100}%"></i></div><b>${r.qualityPts}/25</b></div>
        <div class="row"><span>${T.short}</span><div class="progress sw"><i style="width:${r.tcPts / 15 * 100}%"></i></div><b>${r.tcPts}/15</b></div>
        <div class="small muted">결함 <b>${r.foundCount}/${cfg.bugs.length}</b>개 보고 · ${T.short} ${r.tcN}건 (요구사항 ${r.covered}/${reqIds.length}개 커버)</div>
      </div>`;
    const notes = [];
    if (r.falsePos.length) notes.push(`<div class="callout warn"><b>⚠️ 오탐(False Positive) ${r.falsePos.length}건</b>${[...new Set(r.falsePos.map(b => b.req))].join(", ")}은(는) 요구사항대로 정상 동작합니다. ${cfg.falsePosHint || "재현 절차를 다시 확인하는 습관이 중요해요."}</div>`);
    if (r.dupReqs.length) notes.push(`<div class="callout"><b>ℹ️ 같은 요구사항에 리포트가 여러 건 (${r.dupReqs.join(", ")})</b>서로 다른 결함이라면 괜찮지만, 같은 결함을 중복 보고하지 않았는지 확인해 보세요.</div>`);
    if (r.qualityPts < 20 && draft.bugs.length) notes.push(`<div class="callout"><b>✍️ 리포트 품질 높이기</b>제목은 '[화면] 조건 → 문제' 형식으로, 재현 절차는 번호를 붙여 단계별로, 기대 결과에는 요구사항 번호를 함께 적어 보세요.</div>`);
    $("#bh-notes").innerHTML = notes.join("");
    $("#bh-findings").innerHTML = r.found.map(f => `
      <div class="finding ${f.found ? "found" : "missed"}">
        <h4>${f.found ? "✅" : "❌"} ${f.req} · ${f.title}
          <span class="tag ${f.found ? "ok" : "bad"}">${f.found ? "보고함" : "놓침"}</span>
          <span class="tag">${f.reproduced ? "🔁 앱에서 재현함" : "앱에서 재현 안 함"}</span>
          <span class="tag">권장 심각도: ${f.sev}</span></h4>
        <p>${f.how}</p>
        <details><summary>모범 버그 리포트 보기</summary>
          <div class="report-card" style="margin-top:10px"><h4>${f.model.title}</h4>
            <dl><dt>재현 절차</dt><dd>${f.model.steps}</dd><dt>기대 결과</dt><dd>${f.model.expected}</dd><dt>실제 결과</dt><dd>${f.model.actual}</dd><dt>심각도</dt><dd>${f.sev}</dd></dl></div>
        </details>
      </div>`).join("");
    updateStepper();
    if (scroll) $("#bh-result").scrollIntoView({ behavior: "smooth" });
  }

  $("#bh-submit").addEventListener("click", () => {
    if (!draft.bugs.length && !draft.tcs.length) { toast("표나 버그 리포트를 하나 이상 작성해 주세요."); return; }
    if (!confirm("제출하면 결과물을 더 이상 수정할 수 없어요. 제출할까요?")) return;
    const r = grade();
    draft.submitted = { at: Date.now(), score: r.total }; save();
    Progress.recordMission(cfg.missionId, r.total, {
      found: r.foundCount, total: cfg.bugs.length,
      missedLabels: r.found.filter(f => !f.found).map(f => `${f.req} ${f.short}`),
      qualityPts: r.qualityPts, tcPts: r.tcPts, falsePos: r.falsePos.length, tcLabel: T.short,
    });
    showResult(r, true);
    toast(`채점 완료! ${r.total}점`);
  });

  $("#bh-save-pf").addEventListener("click", () => {
    const r = grade();
    Portfolio.add({
      type: "bug-report", typeName: mission.output, track: "sw", missionId: cfg.missionId,
      title: cfg.portfolioTitle, score: r.total,
      summary: `${T.short} ${draft.tcs.length}건 · 버그 리포트 ${draft.bugs.length}건 · 결함 ${r.foundCount}/${cfg.bugs.length} 발견`,
      content: { target: cfg.target, tcTitle: T.short, testCases: draft.tcs, bugs: draft.bugs },
    });
    $("#bh-save-pf").textContent = "✓ 포트폴리오에 저장됨"; $("#bh-save-pf").disabled = true;
    toast("포트폴리오에 저장했어요. 마이페이지에서 확인할 수 있습니다.");
  });

  function restart() {
    if (!confirm("작성한 내용을 지우고 처음부터 다시 할까요? (포트폴리오에 저장한 결과물은 유지됩니다)")) return;
    Drafts.clear(DRAFT_KEY); location.reload();
  }
  $("#bh-reset").addEventListener("click", restart);
  $("#bh-retry").addEventListener("click", restart);

  renderLog(); renderTcs(); renderBugs(); resetForm(); updateStepper();
  if (locked()) showResult(grade(), false);
}
