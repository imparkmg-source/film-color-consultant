// 인테리어필름 컬러 상담소 — 화면 로직

const state = { categoryId: null, filmId: null, activeBudgetKey: null, lastBudget: null };

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ---------- 색상 유틸 ----------
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}
function shade(hex, percent) {
  // percent: -1(어둡게) ~ 1(밝게)
  const { r, g, b } = hexToRgb(hex);
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent);
  const mix = (c) => Math.round(c + (t - c) * p);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}
function rgbaFromHex(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// 질감별 배경 스타일 생성 (실사 대체 시뮬레이션)
function textureBackground(hex, texture) {
  switch (texture) {
    case "wood":
      return `
        repeating-linear-gradient(
          92deg,
          ${rgbaFromHex(shade(hex, -0.25), 0.55)} 0px,
          ${rgbaFromHex(shade(hex, -0.25), 0.55)} 1px,
          transparent 1px,
          transparent 5px
        ),
        repeating-linear-gradient(
          92deg,
          ${rgbaFromHex(shade(hex, 0.2), 0.35)} 0px,
          transparent 3px,
          transparent 9px
        ),
        linear-gradient(100deg, ${shade(hex, 0.12)}, ${hex} 45%, ${shade(hex, -0.12)})
      `;
    case "gloss":
      return `linear-gradient(135deg, ${shade(hex, 0.35)} 0%, ${hex} 40%, ${shade(hex, -0.08)} 100%)`;
    case "concrete":
      return `
        radial-gradient(3px 3px at 15% 25%, ${rgbaFromHex(shade(hex, -0.3), 0.45)} 0%, transparent 60%),
        radial-gradient(2px 2px at 65% 15%, ${rgbaFromHex(shade(hex, -0.25), 0.4)} 0%, transparent 60%),
        radial-gradient(4px 4px at 40% 55%, ${rgbaFromHex(shade(hex, -0.2), 0.35)} 0%, transparent 60%),
        radial-gradient(3px 3px at 80% 65%, ${rgbaFromHex(shade(hex, 0.25), 0.4)} 0%, transparent 60%),
        radial-gradient(2px 2px at 25% 80%, ${rgbaFromHex(shade(hex, -0.28), 0.35)} 0%, transparent 60%),
        radial-gradient(3px 3px at 90% 40%, ${rgbaFromHex(shade(hex, 0.2), 0.3)} 0%, transparent 60%),
        linear-gradient(155deg, ${shade(hex, 0.06)}, ${hex} 55%, ${shade(hex, -0.06)})
      `;
    case "metal":
      return `
        repeating-linear-gradient(100deg, ${rgbaFromHex(shade(hex, 0.4), 0.25)} 0px, transparent 2px, transparent 6px),
        linear-gradient(120deg, ${shade(hex, 0.3)}, ${hex} 50%, ${shade(hex, -0.2)})
      `;
    case "marble":
      return `
        radial-gradient(120% 40% at 15% 20%, ${rgbaFromHex(shade(hex, -0.4), 0.5)} 0%, transparent 45%),
        radial-gradient(160% 50% at 80% 70%, ${rgbaFromHex(shade(hex, -0.3), 0.4)} 0%, transparent 50%),
        radial-gradient(100% 30% at 50% 45%, ${rgbaFromHex(shade(hex, 0.3), 0.5)} 0%, transparent 60%),
        linear-gradient(160deg, ${shade(hex, 0.1)}, ${hex})
      `;
    default: // solid
      return `linear-gradient(160deg, ${shade(hex, 0.08)}, ${hex} 60%, ${shade(hex, -0.05)})`;
  }
}

const TEXTURE_LABEL = {
  solid: "무광 단색",
  concrete: "콘크리트 질감",
  wood: "우드그레인",
  gloss: "하이그로시",
  metal: "메탈릭",
  marble: "마블·스톤",
};

// ---------- 렌더링: STEP 1 카테고리 ----------
function renderCategories() {
  const grid = $("#category-grid");
  grid.innerHTML = "";
  CATEGORIES.forEach((cat) => {
    const card = document.createElement("button");
    card.className = "category-card";
    card.style.setProperty("--tint-light", cat.tint.light);
    card.style.setProperty("--tint-dark", cat.tint.dark);
    card.innerHTML = `
      <span class="category-icon">${cat.icon}</span>
      <h3>${cat.name}</h3>
      <p>${cat.desc}</p>
    `;
    card.addEventListener("click", () => selectCategory(cat.id));
    grid.appendChild(card);
  });
}

function selectCategory(catId) {
  state.categoryId = catId;
  const cat = CATEGORIES.find((c) => c.id === catId);
  $("#films-title").textContent = `${cat.name} — 스테디셀러 TOP 10`;
  $("#films-desc").textContent = `최근 시공 문의 데이터를 기반으로 정리한 ${cat.name} 인기 컬러입니다. 카드를 클릭하면 3D 미리보기와 예상 견적을 확인할 수 있어요.`;
  renderFilms(catId);
  $("#step-category").classList.add("hidden");
  $("#step-films").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---------- 렌더링: STEP 2 필름 카드 ----------
function renderFilms(catId) {
  const grid = $("#film-grid");
  grid.innerHTML = "";
  const films = FILMS[catId];
  films.forEach((film, idx) => {
    const card = document.createElement("button");
    card.className = "film-card";
    card.innerHTML = `
      <div class="film-swatch ${film.texture === "gloss" ? "shine" : ""}" style="background:${textureBackground(film.hex, film.texture)}">
        <span class="film-rank">TOP ${idx + 1}</span>
        <span class="film-tag">${film.tag}</span>
      </div>
      <div class="film-info">
        <h3>${film.name}</h3>
        <p>${film.desc}</p>
        <span class="texture-badge">${TEXTURE_LABEL[film.texture]}</span>
      </div>
    `;
    card.addEventListener("click", () => openDetail(catId, film.id));
    grid.appendChild(card);
  });
}

// ---------- 3D 목업 빌더 ----------
function doorLinesHTML(doors) {
  let out = "";
  for (let i = 1; i < doors; i++) {
    out += `<div class="door-line" style="left:${((100 / doors) * i).toFixed(2)}%"></div>`;
  }
  return out;
}
function handlesHTML(doors) {
  let out = "";
  const doorWidthPct = 100 / doors;
  for (let i = 0; i < doors; i++) {
    const onRightEdge = i % 2 === 0;
    const pos = onRightEdge ? doorWidthPct * i + doorWidthPct * 0.86 : doorWidthPct * i + doorWidthPct * 0.14;
    out += `<div class="door-handle" style="left:${pos.toFixed(2)}%"></div>`;
  }
  return out;
}
function cabinetHTML(cfg, frontBg, texture, extraFrontContent) {
  const { w, h, d, doors, handles } = cfg;
  const shineCls = texture === "gloss" ? " shine" : "";
  return `
    <div class="mockup3d" style="--w:${w}px;--h:${h}px;--d:${d}px;">
      <div class="face top" style="background:${frontBg}"></div>
      <div class="face side" style="background:${frontBg}"></div>
      <div class="face front${shineCls}" style="background:${frontBg}">
        ${doors > 1 ? doorLinesHTML(doors) : ""}
        ${handles ? handlesHTML(doors) : ""}
        ${extraFrontContent || ""}
      </div>
    </div>
  `;
}
function kitchenHTML(frontBg, texture) {
  const upper = cabinetHTML({ w: 108, h: 56, d: 26, doors: 2, handles: false }, frontBg, texture);
  const lower = cabinetHTML({ w: 172, h: 92, d: 42, doors: 3, handles: true }, frontBg, texture);
  return `
    <div class="mockup-kitchen">
      <div class="upper">${upper}</div>
      <div class="counter-line" style="--kw:172"></div>
      <div class="lower">${lower}</div>
    </div>
  `;
}
function glassHTML(cfg, frontBg, texture) {
  const glassOverlay = `<div class="glass-fill"></div><div class="glass-grid"></div>`;
  return cabinetHTML({ w: cfg.w, h: cfg.h, d: cfg.d, doors: 2, handles: false }, frontBg, texture, glassOverlay);
}
function cornerHTML(frontBg) {
  return `
    <div class="mockup-corner">
      <div class="corner-wall left">
        <div class="corner-strip molding-top" style="background:${frontBg}"></div>
        <div class="corner-strip baseboard-bottom" style="background:${frontBg}"></div>
      </div>
      <div class="corner-wall right">
        <div class="corner-strip molding-top" style="background:${frontBg}"></div>
        <div class="corner-strip baseboard-bottom" style="background:${frontBg}"></div>
      </div>
    </div>
  `;
}
function mockupHTML(catId, film) {
  const cat = CATEGORIES.find((c) => c.id === catId);
  const cfg = cat.mockup;
  const frontBg = textureBackground(film.hex, film.texture);
  if (cfg.type === "kitchen") return kitchenHTML(frontBg, film.texture);
  if (cfg.type === "glass") return glassHTML(cfg, frontBg, film.texture);
  if (cfg.type === "corner") return cornerHTML(frontBg);
  return cabinetHTML(cfg, frontBg, film.texture);
}
function buildMockup(catId, film) {
  $("#mockup-stage").innerHTML = mockupHTML(catId, film);
}

// ---------- 상세 모달 ----------
function openDetail(catId, filmId) {
  const cat = CATEGORIES.find((c) => c.id === catId);
  const film = FILMS[catId].find((f) => f.id === filmId);
  state.categoryId = catId;
  state.filmId = filmId;
  state.activeBudgetKey = null;

  $("#detail-tag").textContent = film.tag;
  $("#detail-name").textContent = `${cat.name} · ${film.name}`;
  $("#detail-code").textContent = film.code;
  $("#detail-desc").textContent = film.desc;

  const bg = textureBackground(film.hex, film.texture);
  const macro = $("#swatch-macro");
  macro.style.background = bg;
  macro.className = "swatch-macro" + (film.texture === "gloss" ? " shine" : "");

  buildMockup(catId, film);

  // 팁: 질감 공통 팁 + 부위별 팁
  const tipsEl = $("#detail-tips");
  const tips = [...TEXTURE_TIPS[film.texture], CATEGORY_TIPS[catId]];
  tipsEl.innerHTML = tips.map((t) => `<li>${t}</li>`).join("");

  // 예산 계산기 초기화
  $("#calc-size-label").textContent = `사이즈 (${cat.unit})`;
  $("#calc-size").value = cat.defaultSize;
  $("#budget-detail").classList.add("hidden");
  $$(".budget-card").forEach((c) => c.setAttribute("aria-expanded", "false"));
  runCalc();

  $("#detail-modal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function formatWon(n) {
  return Math.round(n).toLocaleString("ko-KR") + "원";
}

function computeBudget(catId, texture, size) {
  const tier = TIER_BY_TEXTURE[texture];
  const budget = BUDGET[catId];
  const [matLow, matHigh] = budget.unitPrice[tier];
  const [laborLow, laborHigh] = budget.labor;
  const materialLow = size * matLow;
  const materialHigh = size * matHigh;
  return {
    tier,
    tierLabel: TIER_LABEL[tier],
    size,
    unit: CATEGORIES.find((c) => c.id === catId).unit,
    matLow, matHigh, laborLow, laborHigh,
    materialLow, materialHigh,
    totalLow: materialLow + laborLow,
    totalHigh: materialHigh + laborHigh,
    laborNote: budget.laborNote,
  };
}

function runCalc() {
  const cat = CATEGORIES.find((c) => c.id === state.categoryId);
  const film = FILMS[state.categoryId].find((f) => f.id === state.filmId);
  const size = Math.max(1, Number($("#calc-size").value) || 1);
  const b = computeBudget(cat.id, film.texture, size);
  state.lastBudget = b;

  $("#budget-material").textContent = `${formatWon(b.materialLow)} ~ ${formatWon(b.materialHigh)}`;
  $("#budget-labor").textContent = `${formatWon(b.laborLow)} ~ ${formatWon(b.laborHigh)}`;
  $("#budget-total").textContent = `${formatWon(b.totalLow)} ~ ${formatWon(b.totalHigh)}`;

  if (state.activeBudgetKey) renderBudgetDetail(state.activeBudgetKey);
}

function renderBudgetDetail(key) {
  const b = state.lastBudget;
  if (!b) return;
  let html = "";
  if (key === "material") {
    html = `
      <div class="formula">단가 ${formatWon(b.matLow)}~${formatWon(b.matHigh)} × ${b.size}${b.unit.replace(/\(.*\)/, "")} = ${formatWon(b.materialLow)} ~ ${formatWon(b.materialHigh)}</div>
      <dl>
        <dt>적용 등급</dt><dd>${b.tierLabel}</dd>
        <dt>단가</dt><dd>${formatWon(b.matLow)} ~ ${formatWon(b.matHigh)} / ${b.unit}</dd>
        <dt>필요 수량</dt><dd>${b.size} ${b.unit}</dd>
        <dt>자재비 소계</dt><dd>${formatWon(b.materialLow)} ~ ${formatWon(b.materialHigh)}</dd>
      </dl>
    `;
  } else if (key === "labor") {
    html = `
      <div class="formula">${formatWon(b.laborLow)} ~ ${formatWon(b.laborHigh)}</div>
      <dl>
        <dt>산정 기준</dt><dd>${b.laborNote}</dd>
        <dt>인건비 소계</dt><dd>${formatWon(b.laborLow)} ~ ${formatWon(b.laborHigh)}</dd>
      </dl>
    `;
  } else {
    html = `
      <div class="formula">자재비 + 인건비 = ${formatWon(b.totalLow)} ~ ${formatWon(b.totalHigh)}</div>
      <dl>
        <dt>자재비</dt><dd>${formatWon(b.materialLow)} ~ ${formatWon(b.materialHigh)}</dd>
        <dt>인건비</dt><dd>${formatWon(b.laborLow)} ~ ${formatWon(b.laborHigh)}</dd>
        <dt>합계</dt><dd>${formatWon(b.totalLow)} ~ ${formatWon(b.totalHigh)}</dd>
      </dl>
    `;
  }
  const detail = $("#budget-detail");
  detail.innerHTML = html;
  detail.classList.remove("hidden");
}

function toggleBudgetDetail(key) {
  if (state.activeBudgetKey === key) {
    state.activeBudgetKey = null;
    $("#budget-detail").classList.add("hidden");
    $$(".budget-card").forEach((c) => c.setAttribute("aria-expanded", "false"));
    return;
  }
  state.activeBudgetKey = key;
  $$(".budget-card").forEach((c) => c.setAttribute("aria-expanded", String(c.dataset.key === key)));
  renderBudgetDetail(key);
}

function closeDetail() {
  $("#detail-modal").classList.add("hidden");
  document.body.style.overflow = "";
}

// ---------- 실사 이미지 참고 모달 ----------
function openPhotoModal() {
  const cat = CATEGORIES.find((c) => c.id === state.categoryId);
  const film = FILMS[state.categoryId].find((f) => f.id === state.filmId);

  const bg = textureBackground(film.hex, film.texture);
  const hero = $("#photo-hero");
  hero.style.background = bg;
  hero.className = "photo-hero" + (film.texture === "gloss" ? " shine" : "");

  $("#photo-tag").textContent = `${cat.name} · ${TEXTURE_LABEL[film.texture]}`;
  $("#photo-name").textContent = film.name;
  $("#photo-code").textContent = film.code;
  $("#photo-desc").textContent = film.desc;

  const link = $("#photo-ref-link");
  link.href = ebodaqLink(film.code);
  link.textContent = `이보닥에서 ${film.code} 실사 이미지 보기 ↗`;

  $("#photo-modal").classList.remove("hidden");
}
function closePhotoModal() {
  $("#photo-modal").classList.add("hidden");
}

// ---------- 예상 견적서 (A4 인쇄/PDF) ----------
function buildEstimateDoc() {
  const cat = CATEGORIES.find((c) => c.id === state.categoryId);
  const film = FILMS[state.categoryId].find((f) => f.id === state.filmId);
  const b = state.lastBudget;
  const bg = textureBackground(film.hex, film.texture);
  const today = new Date();
  const dateStr = today.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
  const docNo = `EST-${film.code}-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;

  const tips = [...TEXTURE_TIPS[film.texture], CATEGORY_TIPS[cat.id]];

  $("#estimate-doc").innerHTML = `
    <div class="doc-header">
      <div>
        <h2>인테리어필름 시공 예상 견적서</h2>
        <div class="doc-brand">인테리어필름 컬러 상담소</div>
      </div>
      <div class="doc-meta">
        발행일: ${dateStr}<br />
        문서번호: ${docNo}
      </div>
    </div>

    <div class="doc-section doc-product">
      <div class="doc-swatch" style="background:${bg}"></div>
      <div class="doc-product-info">
        <div>${cat.name}</div>
        <h3>${film.name}</h3>
        <div>제품코드 <span class="doc-code">${film.code}</span> · ${TEXTURE_LABEL[film.texture]}</div>
      </div>
    </div>

    <div class="doc-section">
      <h4>3D 시공 배치 시안</h4>
      <div class="doc-mockup-wrap">${mockupHTML(cat.id, film)}</div>
    </div>

    <div class="doc-section">
      <h4>전문가 시공 Tip</h4>
      <ul class="doc-tips">${tips.map((t) => `<li>${t}</li>`).join("")}</ul>
    </div>

    <div class="doc-section">
      <h4>예상 견적</h4>
      <table>
        <tr><th>시공 부위</th><td>${cat.name}</td></tr>
        <tr><th>선택 컬러</th><td>${film.name} (${film.code})</td></tr>
        <tr><th>시공 사이즈</th><td>${b.size} ${b.unit}</td></tr>
        <tr><th>자재비</th><td>단가 ${formatWon(b.matLow)}~${formatWon(b.matHigh)} × ${b.size} = ${formatWon(b.materialLow)} ~ ${formatWon(b.materialHigh)}</td></tr>
        <tr><th>인건비</th><td>${formatWon(b.laborLow)} ~ ${formatWon(b.laborHigh)} (${b.laborNote})</td></tr>
        <tr class="doc-total-row"><th>합계 (예상)</th><td>${formatWon(b.totalLow)} ~ ${formatWon(b.totalHigh)}</td></tr>
      </table>
    </div>

    <div class="doc-footer">
      본 견적서는 화면 표현용 시뮬레이션과 참고용 단가를 기반으로 산출한 예상 금액이며, 법적 효력이 있는 정식 견적서가 아닙니다. 실제 시공 견적은 현장 실측 후 확정되며, 모서리 수·기존 필름 제거 여부·층수 및 엘리베이터 유무 등에 따라 달라질 수 있습니다.
    </div>
  `;
}

function openEstimateModal() {
  if (!state.lastBudget) runCalc();
  buildEstimateDoc();
  $("#estimate-modal").classList.remove("hidden");
}
function closeEstimateModal() {
  $("#estimate-modal").classList.add("hidden");
}

// ---------- 이벤트 바인딩 ----------
$("#btn-back-category").addEventListener("click", () => {
  $("#step-films").classList.add("hidden");
  $("#step-category").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

$("#btn-close-modal").addEventListener("click", closeDetail);
$("#detail-modal").addEventListener("click", (e) => {
  if (e.target.id === "detail-modal") closeDetail();
});
$("#btn-photo-ref").addEventListener("click", openPhotoModal);
$("#btn-close-photo").addEventListener("click", closePhotoModal);
$("#photo-modal").addEventListener("click", (e) => {
  if (e.target.id === "photo-modal") closePhotoModal();
});

$("#btn-estimate").addEventListener("click", openEstimateModal);
$("#btn-close-estimate").addEventListener("click", closeEstimateModal);
$("#btn-print-estimate").addEventListener("click", () => window.print());
$("#estimate-modal").addEventListener("click", (e) => {
  if (e.target.id === "estimate-modal") closeEstimateModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!$("#photo-modal").classList.contains("hidden")) closePhotoModal();
  else if (!$("#estimate-modal").classList.contains("hidden")) closeEstimateModal();
  else if (!$("#detail-modal").classList.contains("hidden")) closeDetail();
});

$("#calc-size").addEventListener("input", runCalc);

$$(".budget-card").forEach((card) => {
  card.addEventListener("click", () => toggleBudgetDetail(card.dataset.key));
});

// ---------- 초기화 ----------
renderCategories();
