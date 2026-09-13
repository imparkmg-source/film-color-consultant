// 인테리어필름 컬러 상담소 — 화면 로직

const state = { categoryId: null, filmId: null };

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
      return {
        background: `
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
        `,
      };
    case "gloss":
      return {
        background: `linear-gradient(135deg, ${shade(hex, 0.35)} 0%, ${hex} 40%, ${shade(hex, -0.08)} 100%)`,
      };
    case "metal":
      return {
        background: `
          repeating-linear-gradient(100deg, ${rgbaFromHex(shade(hex, 0.4), 0.25)} 0px, transparent 2px, transparent 6px),
          linear-gradient(120deg, ${shade(hex, 0.3)}, ${hex} 50%, ${shade(hex, -0.2)})
        `,
      };
    case "marble":
      return {
        background: `
          radial-gradient(120% 40% at 15% 20%, ${rgbaFromHex(shade(hex, -0.4), 0.5)} 0%, transparent 45%),
          radial-gradient(160% 50% at 80% 70%, ${rgbaFromHex(shade(hex, -0.3), 0.4)} 0%, transparent 50%),
          radial-gradient(100% 30% at 50% 45%, ${rgbaFromHex(shade(hex, 0.3), 0.5)} 0%, transparent 60%),
          linear-gradient(160deg, ${shade(hex, 0.1)}, ${hex})
        `,
      };
    default: // solid
      return {
        background: `linear-gradient(160deg, ${shade(hex, 0.08)}, ${hex} 60%, ${shade(hex, -0.05)})`,
      };
  }
}

const TEXTURE_LABEL = {
  solid: "무광 단색",
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
    const swatchStyle = textureBackground(film.hex, film.texture);
    card.innerHTML = `
      <div class="film-swatch ${film.texture === "gloss" ? "shine" : ""}" style="background:${swatchStyle.background}">
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

// ---------- 상세 모달 ----------
function openDetail(catId, filmId) {
  const cat = CATEGORIES.find((c) => c.id === catId);
  const film = FILMS[catId].find((f) => f.id === filmId);
  state.filmId = filmId;

  $("#detail-tag").textContent = film.tag;
  $("#detail-name").textContent = `${cat.name} · ${film.name}`;
  $("#detail-desc").textContent = film.desc;

  const macroStyle = textureBackground(film.hex, film.texture);
  const macro = $("#swatch-macro");
  macro.style.background = macroStyle.background;
  macro.className = "swatch-macro" + (film.texture === "gloss" ? " shine" : "");

  // 3D mockup 색상 반영
  const front = document.querySelector("#mockup3d .face.front");
  const side = document.querySelector("#mockup3d .face.side");
  const top = document.querySelector("#mockup3d .face.top");
  const frontBg = textureBackground(film.hex, film.texture).background;
  front.style.background = frontBg;
  side.style.background = frontBg;
  top.style.background = frontBg;

  // 팁: 질감 공통 팁 + 부위별 팁
  const tipsEl = $("#detail-tips");
  const tips = [...TEXTURE_TIPS[film.texture], CATEGORY_TIPS[catId]];
  tipsEl.innerHTML = tips.map((t) => `<li>${t}</li>`).join("");

  // 예산 계산기 초기화
  $("#calc-size-label").textContent = `사이즈 (${cat.unit})`;
  $("#calc-size").value = cat.defaultSize;
  $("#labor-note").textContent = `※ 인건비 기준: ${BUDGET[catId].laborNote}`;
  runCalc(catId, film.texture);

  $("#detail-modal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function formatWon(n) {
  return Math.round(n).toLocaleString("ko-KR") + "원";
}

function runCalc(catId, texture) {
  const size = Math.max(1, Number($("#calc-size").value) || 1);
  const tier = TIER_BY_TEXTURE[texture];
  const budget = BUDGET[catId];
  const [matLow, matHigh] = budget.unitPrice[tier];
  const [laborLow, laborHigh] = budget.labor;

  const materialLow = size * matLow;
  const materialHigh = size * matHigh;
  const totalLow = materialLow + laborLow;
  const totalHigh = materialHigh + laborHigh;

  $("#budget-material").textContent = `${formatWon(materialLow)} ~ ${formatWon(materialHigh)}`;
  $("#budget-labor").textContent = `${formatWon(laborLow)} ~ ${formatWon(laborHigh)}`;
  $("#budget-total").textContent = `${formatWon(totalLow)} ~ ${formatWon(totalHigh)}`;
}

function closeDetail() {
  $("#detail-modal").classList.add("hidden");
  document.body.style.overflow = "";
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
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDetail();
});

$("#calc-run").addEventListener("click", () => {
  const film = FILMS[state.categoryId].find((f) => f.id === state.filmId);
  runCalc(state.categoryId, film.texture);
});
$("#calc-size").addEventListener("keydown", (e) => {
  if (e.key === "Enter") $("#calc-run").click();
});

// ---------- 초기화 ----------
renderCategories();
