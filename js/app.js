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
// shade()가 만든 밝기 보정 색을 그대로 알파값과 함께 rgba()로 만든다.
// (rgbaFromHex(shade(...)) 처럼 shade()의 "rgb(...)" 출력을 다시 hex 파서에 넣으면 NaN이 나므로 금지)
function shadeRgba(hex, percent, alpha) {
  const { r, g, b } = hexToRgb(hex);
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent);
  const mix = (c) => Math.round(c + (t - c) * p);
  return `rgba(${mix(r)}, ${mix(g)}, ${mix(b)}, ${alpha})`;
}

// 질감별 배경 스타일 생성 (실사 대체 시뮬레이션)
function textureBackground(hex, texture) {
  switch (texture) {
    case "wood":
      return `
        repeating-linear-gradient(
          92deg,
          ${shadeRgba(hex, -0.25, 0.55)} 0px,
          ${shadeRgba(hex, -0.25, 0.55)} 1px,
          transparent 1px,
          transparent 5px
        ),
        repeating-linear-gradient(
          92deg,
          ${shadeRgba(hex, 0.2, 0.35)} 0px,
          transparent 3px,
          transparent 9px
        ),
        linear-gradient(100deg, ${shade(hex, 0.12)}, ${hex} 45%, ${shade(hex, -0.12)})
      `;
    case "gloss":
      return `linear-gradient(135deg, ${shade(hex, 0.35)} 0%, ${hex} 40%, ${shade(hex, -0.08)} 100%)`;
    case "concrete":
      return `
        radial-gradient(3px 3px at 15% 25%, ${shadeRgba(hex, -0.3, 0.45)} 0%, transparent 60%),
        radial-gradient(2px 2px at 65% 15%, ${shadeRgba(hex, -0.25, 0.4)} 0%, transparent 60%),
        radial-gradient(4px 4px at 40% 55%, ${shadeRgba(hex, -0.2, 0.35)} 0%, transparent 60%),
        radial-gradient(3px 3px at 80% 65%, ${shadeRgba(hex, 0.25, 0.4)} 0%, transparent 60%),
        radial-gradient(2px 2px at 25% 80%, ${shadeRgba(hex, -0.28, 0.35)} 0%, transparent 60%),
        radial-gradient(3px 3px at 90% 40%, ${shadeRgba(hex, 0.2, 0.3)} 0%, transparent 60%),
        linear-gradient(155deg, ${shade(hex, 0.06)}, ${hex} 55%, ${shade(hex, -0.06)})
      `;
    case "metal":
      return `
        repeating-linear-gradient(100deg, ${shadeRgba(hex, 0.4, 0.25)} 0px, transparent 2px, transparent 6px),
        linear-gradient(120deg, ${shade(hex, 0.3)}, ${hex} 50%, ${shade(hex, -0.2)})
      `;
    case "marble":
      return `
        radial-gradient(120% 40% at 15% 20%, ${shadeRgba(hex, -0.4, 0.5)} 0%, transparent 45%),
        radial-gradient(160% 50% at 80% 70%, ${shadeRgba(hex, -0.3, 0.4)} 0%, transparent 50%),
        radial-gradient(100% 30% at 50% 45%, ${shadeRgba(hex, 0.3, 0.5)} 0%, transparent 60%),
        linear-gradient(160deg, ${shade(hex, 0.1)}, ${hex})
      `;
    default: // solid
      return `linear-gradient(160deg, ${shade(hex, 0.08)}, ${hex} 60%, ${shade(hex, -0.05)})`;
  }
}

// ---------- 실사 이미지 (이보닥 공식 사이트에서 실시간으로 불러옴, 저장소에는 저장하지 않음) ----------
function filmImageUrl(code, size) {
  const folder = size === "preview" ? "Preview" : "List";
  return `https://www.ebodaq.com/Upload/Product/${folder}/${encodeURIComponent(code)}.jpg`;
}
// 실사 이미지를 맨 위 레이어로, 질감 시뮬레이션을 그 아래 폴백 레이어로 쌓는다.
// 이미지 로드에 실패하면(네트워크 차단 등) 해당 레이어가 투명해져 아래 시뮬레이션이 그대로 보인다.
function filmBackground(film, size) {
  const photo = `url('${filmImageUrl(film.code, size)}') center / cover no-repeat`;
  const sim = textureBackground(film.hex, film.texture);
  return `${photo}, ${sim}`;
}

const TEXTURE_LABEL = {
  solid: "무광 단색",
  concrete: "콘크리트 질감",
  wood: "우드그레인",
  gloss: "하이그로시",
  metal: "메탈릭",
  marble: "마블·스톤",
};

// ---------- 카테고리 아이콘 (커스텀 라인 SVG) ----------
const CATEGORY_ICONS = {
  wardrobe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <rect x="4" y="3" width="16" height="18" rx="1.5"/>
    <line x1="12" y1="3" x2="12" y2="21"/>
    <circle cx="9.7" cy="12" r="0.65" fill="currentColor" stroke="none"/>
    <circle cx="14.3" cy="12" r="0.65" fill="currentColor" stroke="none"/>
  </svg>`,
  sink: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8.5 4v2.5"/>
    <path d="M8.5 4h3.5a2 2 0 012 2v1.2"/>
    <rect x="3" y="11.5" width="18" height="8.5" rx="1.5"/>
    <path d="M3 15h18"/>
  </svg>`,
  door: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <rect x="6" y="2.5" width="12" height="19" rx="1"/>
    <circle cx="14.4" cy="12" r="0.75" fill="currentColor" stroke="none"/>
  </svg>`,
  jungmoon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <rect x="4" y="3" width="16" height="18" rx="1"/>
    <line x1="12" y1="3" x2="12" y2="21"/>
    <line x1="4" y1="9" x2="20" y2="9"/>
    <line x1="4" y1="15" x2="20" y2="15"/>
  </svg>`,
  molding: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4.5 4v16h16"/>
    <path d="M4.5 8h11"/>
    <path d="M4.5 16.5h16"/>
  </svg>`,
  shoe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2.5" y="7.5" width="19" height="10" rx="1.5"/>
    <line x1="9.5" y1="7.5" x2="9.5" y2="17.5"/>
    <line x1="14.5" y1="7.5" x2="14.5" y2="17.5"/>
    <line x1="2" y1="20.5" x2="22" y2="20.5"/>
  </svg>`,
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
    card.style.setProperty("--icon-light", shade(cat.tint.light, -0.62));
    card.style.setProperty("--icon-dark", shade(cat.tint.dark, 0.55));
    card.innerHTML = `
      <span class="category-icon">${CATEGORY_ICONS[cat.id]}</span>
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
      <div class="film-swatch ${film.texture === "gloss" ? "shine" : ""}" style="background:${filmBackground(film)}">
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
  const frontBg = filmBackground(film);
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

  const bg = filmBackground(film);
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

  const bg = filmBackground(film, "preview");
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
  const bg = filmBackground(film, "preview");
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
      제품 이미지는 이보닥(ebodaq) 공식 사이트에서 불러온 참고용 이미지입니다. 본 견적서는 참고용 단가를 기반으로 산출한 예상 금액이며, 법적 효력이 있는 정식 견적서가 아닙니다. 실제 시공 견적은 현장 실측 후 확정되며, 모서리 수·기존 필름 제거 여부·층수 및 엘리베이터 유무 등에 따라 달라질 수 있습니다.
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

// 새 탭에 견적서만 담아 인쇄한다. (모달을 그대로 인쇄하면 미리보기 iframe 등 일부 환경에서
// window.print()가 조용히 막히는 경우가 있어, 별도 창을 열어 그 창에서 인쇄를 트리거한다.)
async function printEstimate() {
  const cssLink = document.querySelector('link[rel="stylesheet"][href$="style.css"]');
  let cssText = "";
  try {
    cssText = await fetch(cssLink.href).then((r) => r.text());
  } catch (e) {
    /* 스타일을 못 불러와도 문서 자체는 인쇄 가능하도록 계속 진행 */
  }

  const printWin = window.open("", "_blank");
  if (!printWin) {
    alert("팝업이 차단되어 인쇄 창을 열 수 없습니다. 브라우저의 팝업 차단을 해제한 뒤 다시 시도해주세요.");
    return;
  }

  printWin.document.write(`<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<title>인테리어필름 시공 예상 견적서</title>
<style>${cssText}</style>
<style>
  html, body { background: #d9d5e3; margin: 0; padding: 24px 16px; }
  .estimate-doc { margin: 0 auto; }
  .print-bar { max-width: 210mm; margin: 0 auto 12px; display: flex; justify-content: flex-end; }
  .print-bar button {
    background: #6c63a6; color: #fff; border: none; border-radius: 8px;
    padding: 9px 16px; font-size: 13px; font-weight: 700; cursor: pointer;
  }
  @media print {
    html, body { background: #fff; padding: 0; }
    .print-bar { display: none; }
  }
</style>
</head>
<body>
<div class="print-bar"><button onclick="window.print()">🖨️ 인쇄 / PDF로 저장</button></div>
${$("#estimate-doc").outerHTML}
</body>
</html>`);
  printWin.document.close();
  printWin.focus();
  setTimeout(() => {
    try {
      printWin.print();
    } catch (e) {
      /* 자동 인쇄가 막히면 사용자가 새 탭의 인쇄 버튼을 직접 눌러도 된다 */
    }
  }, 350);
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
$("#btn-print-estimate").addEventListener("click", printEstimate);
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
