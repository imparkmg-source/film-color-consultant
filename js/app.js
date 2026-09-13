// 인테리어필름 컬러&견적 상담소 — 화면 로직

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
function kitchenHTML(frontBg, texture, cfg) {
  const upper = cabinetHTML({ w: cfg.upperW, h: 73, d: 34, doors: cfg.upperDoors, handles: false }, frontBg, texture);
  const lower = cabinetHTML({ w: cfg.lowerW, h: 120, d: 55, doors: cfg.lowerDoors, handles: true }, frontBg, texture);
  return `
    <div class="mockup-kitchen">
      <div class="upper">${upper}</div>
      <div class="counter-line" style="--kw:${cfg.lowerW}"></div>
      <div class="lower">${lower}</div>
    </div>
  `;
}
function glassHTML(cfg, frontBg, texture) {
  const glassOverlay = `<div class="glass-fill"></div><div class="glass-grid"></div>`;
  return cabinetHTML({ w: cfg.w, h: cfg.h, d: cfg.d, doors: 2, handles: false }, frontBg, texture, glassOverlay);
}
function cornerHTML(frontBg, scale) {
  const style = scale && scale !== 1 ? ` style="--corner-scale:${scale}"` : "";
  return `
    <div class="mockup-corner"${style}>
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

// 여러 개(문짝/중문)를 나란히 배치해서 보여준다. 개수가 많을수록 각 목업을 살짝 축소해
// 스테이지 폭을 벗어나지 않도록 한다.
const REPLICATE_SCALE = { 1: 1, 2: 0.82, 3: 0.68, 4: 0.58 };
function replicateHTML(count, overflow, buildItem) {
  const scale = REPLICATE_SCALE[count] || 0.58;
  let items = "";
  for (let i = 0; i < count; i++) items += `<div class="mockup-multi-item">${buildItem(scale)}</div>`;
  const more = overflow > 0 ? `<div class="mockup-more">+${overflow}개</div>` : "";
  return `<div class="mockup-multi">${items}${more}</div>`;
}
function scaleDims(cfg, scale) {
  return { ...cfg, w: Math.round(cfg.w * scale), h: Math.round(cfg.h * scale), d: Math.round(cfg.d * scale) };
}
function clampInt(v, lo, hi) {
  return Math.max(lo, Math.min(hi, Math.round(v)));
}

// 사이즈 선택(자/개수/평)에 맞춰 3D 시공 배치 시안의 폭·문짝 수·반복 개수를 조절한다.
// 예: 싱크대 폭을 6자→15자로 바꾸면 하부장 도어 수와 캐비닛 폭이 함께 늘어난다.
function scaledMockupConfig(catId) {
  const cat = CATEGORIES.find((c) => c.id === catId);
  const base = cat.mockup;
  const raw = Number($("#calc-size").value) || cat.sizeInput.default;
  switch (catId) {
    case "wardrobe":
      return { ...base, doors: clampInt(raw / 2.5, 1, 5), w: clampInt(raw * 17, 70, 230) };
    case "shoe":
      return { ...base, doors: clampInt(raw / 2.5, 1, 4), w: clampInt(raw * 20, 90, 230) };
    case "sink":
      return {
        ...base,
        lowerDoors: clampInt(raw / 3, 2, 6),
        lowerW: clampInt(raw * 15, 120, 250),
        upperDoors: clampInt(raw / 4, 1, 4),
        upperW: clampInt(raw * 10, 80, 190),
      };
    case "door":
      return { ...base, count: clampInt(raw, 1, 4), overflow: Math.max(0, Math.round(raw) - 4) };
    case "jungmoon":
      return { ...base, count: clampInt(raw, 1, 3) };
    case "molding":
      return { ...base, scale: raw <= 24 ? 1 : raw <= 44 ? 1.15 : 1.3 };
    default:
      return base;
  }
}

function mockupHTML(catId, film) {
  const cat = CATEGORIES.find((c) => c.id === catId);
  const cfg = scaledMockupConfig(catId);
  const frontBg = filmBackground(film);
  const texture = film.texture;

  if (cfg.type === "kitchen") return kitchenHTML(frontBg, texture, cfg);
  if (cfg.type === "corner") return cornerHTML(frontBg, cfg.scale);
  if (cfg.type === "glass") return replicateHTML(cfg.count, 0, (scale) => glassHTML(scaleDims(cfg, scale), frontBg, texture));
  if (cfg.type === "cabinet" && cat.sizeInput.mode === "count") {
    return replicateHTML(cfg.count, cfg.overflow, (scale) => cabinetHTML(scaleDims(cfg, scale), frontBg, texture));
  }
  return cabinetHTML(cfg, frontBg, texture);
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

  const photoRef = $("#btn-photo-ref");
  photoRef.href = ebodaqLink(film.code);
  photoRef.textContent = `이보닥에서 ${film.code} 실사 이미지 보기 ↗`;

  // 예산 계산기 사이즈 선택지부터 채워야 3D 목업이 올바른 기본값으로 그려진다.
  $("#calc-size-label").textContent = cat.sizeInput.label;
  $("#calc-size").innerHTML = cat.sizeInput.options
    .map((v) => `<option value="${v}"${v === cat.sizeInput.default ? " selected" : ""}>${v}${cat.sizeInput.unitLabel}</option>`)
    .join("");
  $("#calc-fire").checked = false;

  // 팁: 질감 공통 팁 + 부위별 팁
  const tipsEl = $("#detail-tips");
  const tips = [...TEXTURE_TIPS[film.texture], CATEGORY_TIPS[catId]];
  tipsEl.innerHTML = tips.map((t) => `<li>${t}</li>`).join("");

  $("#budget-detail").classList.add("hidden");
  $$(".budget-card").forEach((c) => c.setAttribute("aria-expanded", "false"));
  runCalc();

  $("#detail-modal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function formatWon(n) {
  return Math.round(n).toLocaleString("ko-KR") + "원";
}

function formatQty(n) {
  return (Math.round(n * 100) / 100).toLocaleString("ko-KR");
}

function computeBudget(catId, texture, size, fireRetardant) {
  const grade = GRADE_BY_TEXTURE[texture];
  const budget = BUDGET[catId];
  const [priceLow, priceHigh] = budget.materialUnitPrice[grade];

  // 업계 관행: 필름은 폭 1,220mm 롤로 팔리므로 자재비는 "원/㎡"가 아니라 "원/m"(길이) 기준.
  // rollWidthM이 있으면 실측 면적(㎡)을 그 폭으로 나눠 필요한 필름 "길이(m)"를 구하고,
  // 없으면(=몰딩·걸레받이, 이미 폭이 좁은 별도 제품) 입력값을 그대로 길이로 취급합니다.
  const rollWidth = budget.rollWidthM || 1;
  const neededLength = size / rollWidth;
  const purchaseLength = neededLength * (1 + WASTE_RATE); // 로스율 반영 구매 길이(m)

  const frMul = fireRetardant ? FIRE_RETARDANT_MULTIPLIER : [1, 1];
  const filmLow = purchaseLength * priceLow * frMul[0];
  const filmHigh = purchaseLength * priceHigh * frMul[1];

  const ancillaryLow = filmLow * ANCILLARY_RATE;
  const ancillaryHigh = filmHigh * ANCILLARY_RATE;

  const materialLow = filmLow + ancillaryLow + DELIVERY_FEE;
  const materialHigh = filmHigh + ancillaryHigh + DELIVERY_FEE;

  const [laborUnitLow, laborUnitHigh] = budget.laborUnitPrice;
  const laborLow = size * laborUnitLow;
  const laborHigh = size * laborUnitHigh;

  return {
    grade,
    gradeLabel: GRADE_LABEL[grade],
    size,
    unit: CATEGORIES.find((c) => c.id === catId).unit,
    priceLow, priceHigh,
    materialUnit: "m",
    rollWidth,
    isRollConverted: rollWidth !== 1,
    neededLength,
    purchaseLength,
    fireRetardant: !!fireRetardant,
    filmLow, filmHigh,
    ancillaryLow, ancillaryHigh,
    deliveryFee: DELIVERY_FEE,
    materialLow, materialHigh,
    laborLow, laborHigh,
    totalLow: materialLow + laborLow,
    totalHigh: materialHigh + laborHigh,
    laborNote: budget.laborNote,
  };
}

function runCalc() {
  const cat = CATEGORIES.find((c) => c.id === state.categoryId);
  const film = FILMS[state.categoryId].find((f) => f.id === state.filmId);
  const rawValue = Number($("#calc-size").value) || cat.sizeInput.default;
  const size = Math.max(0.5, rawValue * cat.sizeInput.factor);
  const fireRetardant = $("#calc-fire").checked;
  const b = computeBudget(cat.id, film.texture, size, fireRetardant);
  b.rawValue = rawValue;
  b.rawUnitLabel = cat.sizeInput.unitLabel;
  b.rawLabel = cat.sizeInput.label;
  state.lastBudget = b;

  $("#calc-size-note").textContent = `→ 약 ${formatQty(size)}${cat.unit} 기준으로 계산됩니다. ${cat.sizeInput.helpText}`;
  $("#budget-material").textContent = `${formatWon(b.materialLow)} ~ ${formatWon(b.materialHigh)}`;
  $("#budget-labor").textContent = `${formatWon(b.laborLow)} ~ ${formatWon(b.laborHigh)}`;
  $("#budget-total").textContent = `${formatWon(b.totalLow)} ~ ${formatWon(b.totalHigh)}`;

  // 사이즈 선택에 따라 3D 시공 배치 시안도 함께 갱신
  buildMockup(cat.id, film);

  if (state.activeBudgetKey) renderBudgetDetail(state.activeBudgetKey);
}

function renderBudgetDetail(key) {
  const b = state.lastBudget;
  if (!b) return;
  let html = "";
  if (key === "material") {
    const rollRow = b.isRollConverted
      ? `<dt>필요 길이(폭 1,220mm 기준)</dt><dd>${b.size}${b.unit} ÷ ${b.rollWidth}m = ${formatQty(b.neededLength)}m</dd>`
      : "";
    html = `
      <div class="formula">필요 길이 × 로스율 12% × m당 단가 + 부자재비 + 배송비 = ${formatWon(b.materialLow)} ~ ${formatWon(b.materialHigh)}</div>
      <dl>
        <dt>적용 등급</dt><dd>${b.gradeLabel}${b.fireRetardant ? " · 방염" : ""}</dd>
        <dt>${b.rawLabel}</dt><dd>${b.rawValue}${b.rawUnitLabel} (약 ${formatQty(b.size)}${b.unit})</dd>
        ${rollRow}
        <dt>구매 길이(로스율 12% 포함)</dt><dd>${formatQty(b.purchaseLength)} ${b.materialUnit}</dd>
        <dt>필름 단가</dt><dd>${formatWon(b.priceLow)} ~ ${formatWon(b.priceHigh)} / ${b.materialUnit}${b.fireRetardant ? " (방염 할증 반영)" : ""}</dd>
        <dt>필름 자재비</dt><dd>${formatWon(b.filmLow)} ~ ${formatWon(b.filmHigh)}</dd>
        <dt>부자재비 (프라이머 등, 자재비의 10%)</dt><dd>${formatWon(b.ancillaryLow)} ~ ${formatWon(b.ancillaryHigh)}</dd>
        <dt>배송비</dt><dd>${formatWon(b.deliveryFee)}</dd>
        <dt>자재비 소계</dt><dd>${formatWon(b.materialLow)} ~ ${formatWon(b.materialHigh)}</dd>
      </dl>
    `;
  } else if (key === "labor") {
    html = `
      <div class="formula">${b.size}${b.unit} × 단가 = ${formatWon(b.laborLow)} ~ ${formatWon(b.laborHigh)}</div>
      <dl>
        <dt>산정 기준</dt><dd>${b.laborNote}</dd>
        <dt>인건비 소계</dt><dd>${formatWon(b.laborLow)} ~ ${formatWon(b.laborHigh)}</dd>
      </dl>
    `;
  } else {
    html = `
      <div class="formula">자재비(부자재·배송 포함) + 인건비 = ${formatWon(b.totalLow)} ~ ${formatWon(b.totalHigh)}</div>
      <dl>
        <dt>필름 자재비</dt><dd>${formatWon(b.filmLow)} ~ ${formatWon(b.filmHigh)}</dd>
        <dt>부자재비</dt><dd>${formatWon(b.ancillaryLow)} ~ ${formatWon(b.ancillaryHigh)}</dd>
        <dt>배송비</dt><dd>${formatWon(b.deliveryFee)}</dd>
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
        <div class="doc-brand">인테리어필름 컬러&견적 상담소</div>
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
        <tr><th>선택 컬러</th><td>${film.name} (${film.code}) · ${b.gradeLabel}${b.fireRetardant ? " · 방염" : " · 비방염"}</td></tr>
        <tr><th>${b.rawLabel}</th><td>${b.rawValue}${b.rawUnitLabel} → 약 ${formatQty(b.size)}${b.unit}${b.isRollConverted ? ` → 필름 길이 ${formatQty(b.neededLength)}m (폭 1,220mm 기준)` : ""}, 로스율 12% 반영 구매 길이 ${formatQty(b.purchaseLength)}${b.materialUnit}</td></tr>
        <tr><th>필름 자재비</th><td>단가 ${formatWon(b.priceLow)}~${formatWon(b.priceHigh)}/${b.materialUnit} × ${formatQty(b.purchaseLength)}${b.materialUnit} = ${formatWon(b.filmLow)} ~ ${formatWon(b.filmHigh)}</td></tr>
        <tr><th>부자재비</th><td>${formatWon(b.ancillaryLow)} ~ ${formatWon(b.ancillaryHigh)} (프라이머·사포·마스킹테이프 등, 자재비의 10%)</td></tr>
        <tr><th>배송비</th><td>${formatWon(b.deliveryFee)}</td></tr>
        <tr><th>인건비</th><td>${formatWon(b.laborLow)} ~ ${formatWon(b.laborHigh)} (${b.laborNote})</td></tr>
        <tr class="doc-total-row"><th>합계 (예상)</th><td>${formatWon(b.totalLow)} ~ ${formatWon(b.totalHigh)}</td></tr>
      </table>
    </div>

    <div class="doc-section">
      <h4>브랜드별 필름 시세 참고</h4>
      <table>
        ${BRAND_GUIDE.map((brand) => `<tr><th>${brand.brand}</th><td>${brand.priceRange} · ${brand.note}</td></tr>`).join("")}
      </table>
    </div>

    <div class="doc-footer">
      제품 이미지는 이보닥(ebodaq) 공식 사이트에서 불러온 참고용 이미지입니다. 본 견적서는 웹 조사를 기반으로 한 참고용 단가로 산출한 예상 금액이며, 법적 효력이 있는 정식 견적서가 아닙니다. 실제 시공 견적은 현장 실측·브랜드/제품 선택·지역·업체에 따라 달라질 수 있습니다. ${FIRE_RETARDANT_INFO.mandatoryText} ${FIRE_RETARDANT_INFO.residentialText}
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

// ---------- 다크모드 / 라이트모드 토글 ----------
const THEME_ICON = {
  // 라이트 모드일 땐 달(누르면 다크로), 다크 모드일 땐 해(누르면 라이트로) 아이콘을 보여준다.
  sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7"/></svg>`,
  moon: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.2 14.9A8.4 8.4 0 0 1 9 3.8a8.5 8.5 0 1 0 11.2 11.1z"/></svg>`,
};
function effectiveTheme() {
  const explicit = document.documentElement.getAttribute("data-theme");
  if (explicit === "light" || explicit === "dark") return explicit;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function renderThemeToggle() {
  const eff = effectiveTheme();
  const btn = $("#theme-toggle");
  btn.innerHTML = eff === "dark" ? THEME_ICON.sun : THEME_ICON.moon;
  btn.setAttribute("aria-label", eff === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환");
}
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("theme", theme);
  } catch (e) {
    /* 저장 실패해도 화면 전환 자체는 동작 */
  }
  renderThemeToggle();
}
$("#theme-toggle").addEventListener("click", () => {
  setTheme(effectiveTheme() === "dark" ? "light" : "dark");
});

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

$("#btn-estimate").addEventListener("click", openEstimateModal);
$("#btn-close-estimate").addEventListener("click", closeEstimateModal);
$("#btn-print-estimate").addEventListener("click", printEstimate);
$("#estimate-modal").addEventListener("click", (e) => {
  if (e.target.id === "estimate-modal") closeEstimateModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!$("#estimate-modal").classList.contains("hidden")) closeEstimateModal();
  else if (!$("#detail-modal").classList.contains("hidden")) closeDetail();
});

$("#calc-size").addEventListener("change", runCalc);
$("#calc-fire").addEventListener("change", runCalc);

$$(".budget-card").forEach((card) => {
  card.addEventListener("click", () => toggleBudgetDetail(card.dataset.key));
});

// ---------- 참고 정보 (방염 안내 · 브랜드 가이드) ----------
function renderStaticInfo() {
  $("#fire-note").textContent = `※ ${FIRE_RETARDANT_INFO.mandatoryText} ${FIRE_RETARDANT_INFO.residentialText}`;
  $("#brand-guide-body").innerHTML = BRAND_GUIDE.map(
    (b) => `
      <div class="brand-guide-item">
        <span class="bg-name">${b.brand} <span class="muted">· ${b.tier}</span></span>
        <span class="bg-price">${b.priceRange}</span>
        <span class="bg-note">${b.note}</span>
      </div>
    `
  ).join("");
}

// ---------- 초기화 ----------
renderCategories();
renderStaticInfo();
renderThemeToggle();
