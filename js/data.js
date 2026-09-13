// 인테리어필름 컬러 상담소 — 데이터
// 제품명·제품코드는 현대L&C "Bodaq Interior Film" 2026-2027 카탈로그(2026_Bodaq_Sample_book.pdf)에서
// 가져온 실제 제품 정보입니다. 색상(hex)은 카탈로그 이미지를 참고해 화면 표현용으로 근사한 값이며,
// 실물과는 차이가 있을 수 있습니다. 20년 경력 시공 전문가 관점에서 시공부위별로 어울리는 제품을 선별했습니다.

// 이보닥(ebodaq) 제품 검색 링크 — 제품코드로 검색하면 실제 제품 상세 페이지가 열립니다.
// (WebFetch로 실제 동작 확인: searchText={코드}&idProduct=0 조합이 해당 코드의 단일 제품 페이지를 반환합니다.)
function ebodaqLink(code) {
  return `https://www.ebodaq.com/Product/Product/Detail?pattern=&gloss=&color=&listType=0&searchText=${encodeURIComponent(code)}&sortOrder=2&currentPage=1&pageSize=10000&idProduct=0`;
}

const CATEGORIES = [
  {
    id: "wardrobe",
    name: "붙박이장",
    icon: "🗄️",
    desc: "안방·옷방 붙박이장, 드레스룸 도어 필름",
    unit: "자(30cm 폭)",
    defaultSize: 10,
    tint: { light: "#ECE6F7", dark: "#332C49" },
    mockup: { type: "cabinet", w: 128, h: 176, d: 34, doors: 2, handles: true },
  },
  {
    id: "sink",
    name: "싱크대·주방가구",
    icon: "🍽️",
    desc: "하부장·상부장 도어, 옆판 필름",
    unit: "자(30cm 폭)",
    defaultSize: 12,
    tint: { light: "#DFF3EA", dark: "#1F3A30" },
    mockup: { type: "kitchen" },
  },
  {
    id: "door",
    name: "방문",
    icon: "🚪",
    desc: "실내 방문 필름 리폼 (문틀 포함)",
    unit: "자(30cm 폭)",
    defaultSize: 3,
    tint: { light: "#FCEBDD", dark: "#3E2E22" },
    mockup: { type: "cabinet", w: 92, h: 188, d: 14, doors: 1, handles: true, frame: true },
  },
  {
    id: "jungmoon",
    name: "중문",
    icon: "🪟",
    desc: "현관 중문·거실 파티션 필름",
    unit: "자(30cm 폭)",
    defaultSize: 4,
    tint: { light: "#E1EAF8", dark: "#233047" },
    mockup: { type: "glass", w: 128, h: 188, d: 16 },
  },
  {
    id: "molding",
    name: "몰딩·걸레받이",
    icon: "📏",
    desc: "천장 몰딩, 바닥 걸레받이 라인 필름",
    unit: "미터(m)",
    defaultSize: 80,
    tint: { light: "#FBF1D6", dark: "#3E351D" },
    mockup: { type: "corner" },
  },
  {
    id: "shoe",
    name: "신발장",
    icon: "👞",
    desc: "현관 신발장 도어 필름",
    unit: "자(30cm 폭)",
    defaultSize: 6,
    tint: { light: "#FBE5EC", dark: "#3C2530" },
    mockup: { type: "cabinet", w: 150, h: 96, d: 34, doors: 3, handles: true },
  },
];

// texture: solid(무광단색) / concrete(콘크리트 질감) / wood(우드그레인) / metal(메탈릭) / marble(마블·스톤)
const FILMS = {
  wardrobe: [
    { id: "w1", code: "BLC05", name: "Pure White", texture: "solid", hex: "#EEE9DE", tag: "2026 신제품", desc: "가장 무난하고 밝은 화이트, 어떤 인테리어에도 무리 없이 어울립니다." },
    { id: "w2", code: "BLC06", name: "Cream White", texture: "solid", hex: "#EDE6D5", tag: "2026 신제품", desc: "순백보다 따뜻한 톤으로 아늑한 옷방 분위기를 만듭니다." },
    { id: "w3", code: "BLC01", name: "Valen", texture: "solid", hex: "#D6CEC0", tag: "2026 신제품", desc: "그레이와 베이지 사이 톤으로 세련된 무광 마감을 원할 때 선택합니다." },
    { id: "w4", code: "BLC07", name: "White", texture: "solid", hex: "#E8E6DF", tag: "2026 신제품", desc: "은은한 그레이 기운이 도는 화이트로 차분한 느낌을 줍니다." },
    { id: "w5", code: "LW111", name: "Nordic Oak", texture: "wood", hex: "#C9A876", tag: "우드톤 스테디셀러", desc: "북유럽풍 밝은 오크 결로 어떤 방에도 자연스럽게 어울립니다." },
    { id: "w6", code: "LW103", name: "Denver Oak", texture: "wood", hex: "#A69485", tag: "그레이 우드 추천", desc: "그레이가 살짝 도는 오크 톤으로 모던한 느낌의 옷방에 잘 맞습니다." },
    { id: "w7", code: "LW116", name: "Amber Oak", texture: "wood", hex: "#C89A5D", tag: "따뜻한 우드톤", desc: "꿀빛이 도는 앰버 오크로 따뜻하고 고급스러운 분위기를 냅니다." },
    { id: "w8", code: "LW115", name: "Alpine Oak", texture: "wood", hex: "#7C5D42", tag: "다크 우드 포인트", desc: "짙은 오크 결로 호텔 객실 같은 안정감을 연출합니다." },
    { id: "w9", code: "PNC47", name: "Slate", texture: "concrete", hex: "#E1DACB", tag: "모던 콘크리트 질감", desc: "회벽을 바른 듯한 콘크리트 질감으로 미니멀한 옷방에 어울립니다." },
    { id: "w10", code: "PNC57", name: "Stone Blast", texture: "concrete", hex: "#423931", tag: "다크 포인트 추천", desc: "짙은 콘크리트 톤으로 손잡이리스 도어와 함께 시공하면 고급스럽습니다." },
  ],
  sink: [
    { id: "s1", code: "BLC05", name: "Pure White", texture: "solid", hex: "#EEE9DE", tag: "주방 스테디셀러", desc: "밝고 청결한 인상의 화이트 주방을 만드는 기본 컬러입니다." },
    { id: "s2", code: "BLC03", name: "Porcelain", texture: "solid", hex: "#E6E1D4", tag: "2026 신제품", desc: "순백보다 부드러운 톤으로 오래 봐도 질리지 않는 주방 화이트입니다." },
    { id: "s3", code: "PNC47", name: "Slate", texture: "concrete", hex: "#E1DACB", tag: "모던 주방", desc: "콘크리트 질감의 그레이로 카페형 주방을 연출합니다." },
    { id: "s4", code: "PNC50", name: "Moon Stone", texture: "concrete", hex: "#A89A87", tag: "인기 타일톤", desc: "타일을 닮은 중간 톤 그레이지로 하부장에 특히 잘 어울립니다." },
    { id: "s5", code: "LW110", name: "Nordic Oak", texture: "wood", hex: "#D8BE93", tag: "내추럴 키친", desc: "밝은 오크 톤 주방으로 카페 분위기를 연출할 때 선택합니다." },
    { id: "s6", code: "LW102", name: "Denver Oak", texture: "wood", hex: "#C69C68", tag: "우드톤 인기", desc: "따뜻한 오크 톤으로 원목가구와 잘 어우러집니다." },
    { id: "s7", code: "PM017", name: "Bianco", texture: "marble", hex: "#E7E1D6", tag: "대리석 포인트", desc: "아일랜드 식탁이나 상판 측면 포인트로 인기 있는 화이트 마블입니다." },
    { id: "s8", code: "PM016", name: "Fior di Bosco", texture: "marble", hex: "#6C6B69", tag: "다크 마블 포인트", desc: "짙은 그레이 마블 무늬로 고급스러운 주방을 완성합니다." },
    { id: "s9", code: "VM910", name: "Ash", texture: "metal", hex: "#5C726A", tag: "요즘 뜨는 톤", desc: "그린 기가 도는 메탈릭 톤으로 세이지그린 주방 트렌드를 반영합니다." },
    { id: "s10", code: "PM003", name: "Onyx", texture: "marble", hex: "#E2D6C1", tag: "웜톤 마블", desc: "따뜻한 베이지 계열 마블 무늬로 아늑한 주방을 연출합니다." },
  ],
  door: [
    { id: "d1", code: "BLC05", name: "Pure White", texture: "solid", hex: "#EEE9DE", tag: "부동의 1위", desc: "몰딩·걸레받이와 통일하기 가장 쉬운 기본 화이트입니다." },
    { id: "d2", code: "BLC02", name: "Cream", texture: "solid", hex: "#EFE4CE", tag: "2026 신제품", desc: "순백보다 은은한 크림톤으로 따뜻한 방문을 연출합니다." },
    { id: "d3", code: "LW111", name: "Nordic Oak", texture: "wood", hex: "#C9A876", tag: "내추럴 인기", desc: "바닥재가 밝은 톤일 때 자연스럽게 이어지는 오크 도어입니다." },
    { id: "d4", code: "LW101", name: "Denver Oak", texture: "wood", hex: "#D3AE79", tag: "우드톤 스테디셀러", desc: "따뜻한 미드톤 오크로 무난하게 선택하는 방문 컬러입니다." },
    { id: "d5", code: "LW117", name: "Amber Oak", texture: "wood", hex: "#B5854F", tag: "고급스러운 우드", desc: "짙은 앰버 톤으로 방문에 무게감을 더합니다." },
    { id: "d6", code: "LW113", name: "Alpine Oak", texture: "wood", hex: "#CDA671", tag: "밝은 우드 추천", desc: "밝고 부드러운 오크 결로 좁은 복도도 환하게 만듭니다." },
    { id: "d7", code: "PNC47", name: "Slate", texture: "concrete", hex: "#E1DACB", tag: "모던 그레이", desc: "화이트 벽과 자연스럽게 어울리는 콘크리트 톤 그레이입니다." },
    { id: "d8", code: "PNC46", name: "Stucco", texture: "concrete", hex: "#837D70", tag: "차분한 다크톤", desc: "무게감 있는 다크 그레이로 문을 하나의 디자인 요소로 만듭니다." },
    { id: "d9", code: "BLC01", name: "Valen", texture: "solid", hex: "#D6CEC0", tag: "무난 최다선택", desc: "그레이지 톤으로 어떤 벽지 색과도 무난하게 어울립니다." },
    { id: "d10", code: "PNC49", name: "Moon Stone", texture: "concrete", hex: "#E8E2D2", tag: "베스트셀러", desc: "은은한 스톤 질감으로 심플한 방문을 원할 때 선택합니다." },
  ],
  jungmoon: [
    { id: "j1", code: "VM901", name: "Chrome", texture: "metal", hex: "#8E8E8E", tag: "모던 포인트", desc: "은은한 실버 메탈로 무채색 현관과 잘 어울립니다." },
    { id: "j2", code: "VM907", name: "Gold", texture: "metal", hex: "#B9A24D", tag: "고급 포인트", desc: "화려한 골드 프레임으로 호텔 로비 같은 느낌을 줍니다." },
    { id: "j3", code: "VM905", name: "Champagne", texture: "metal", hex: "#9C8D80", tag: "은은한 포인트", desc: "골드보다 차분한 샴페인 톤으로 부담 없이 포인트를 줍니다." },
    { id: "j4", code: "VM909", name: "Brown", texture: "metal", hex: "#5D4E40", tag: "차분한 브론즈", desc: "브론즈 톤 프레임으로 카페형 중문 느낌을 냅니다." },
    { id: "j5", code: "VM911", name: "Navy", texture: "metal", hex: "#454A63", tag: "고급스러움", desc: "블랙 대신 네이비로 차분하고 고급스러운 현관을 연출합니다." },
    { id: "j6", code: "VM910", name: "Ash", texture: "metal", hex: "#5C726A", tag: "요즘 뜨는 컬러", desc: "그린빛이 도는 메탈릭 톤으로 개성 있는 중문을 만듭니다." },
    { id: "j7", code: "PNC57", name: "Stone Blast", texture: "concrete", hex: "#423931", tag: "카페형 중문", desc: "짙은 콘크리트 톤 프레임으로 카페형 중문의 정석을 보여줍니다." },
    { id: "j8", code: "BLC05", name: "Pure White", texture: "solid", hex: "#EEE9DE", tag: "밝은 현관", desc: "현관이 어둡거나 좁을 때 개방감을 주는 화이트 프레임입니다." },
    { id: "j9", code: "RM009", name: "Real Metal", texture: "metal", hex: "#211F1D", tag: "블랙 메탈", desc: "무광에 가까운 짙은 메탈로 선이 살아나는 블랙 프레임을 만듭니다." },
    { id: "j10", code: "APZ05", name: "Gold Crack", texture: "metal", hex: "#7A6931", tag: "화려한 포인트", desc: "크랙 패턴이 있는 앤틱 골드로 존재감 있는 중문을 연출합니다." },
  ],
  molding: [
    { id: "m1", code: "BLC05", name: "Pure White", texture: "solid", hex: "#EEE9DE", tag: "부동의 1위", desc: "가장 무난하고 밝은 공간을 만드는 기본 몰딩 컬러입니다." },
    { id: "m2", code: "BLC06", name: "Cream White", texture: "solid", hex: "#EDE6D5", tag: "2026 신제품", desc: "포근한 아이보리 톤으로 벽지와 자연스럽게 이어집니다." },
    { id: "m3", code: "BLC07", name: "White", texture: "solid", hex: "#E8E6DF", tag: "2026 신제품", desc: "은은한 그레이 기가 도는 화이트로 차분하게 마감됩니다." },
    { id: "m4", code: "BLC01", name: "Valen", texture: "solid", hex: "#D6CEC0", tag: "인기 상승", desc: "그레이지와 베이지 사이 톤, 최근 문의가 많은 컬러입니다." },
    { id: "m5", code: "BLC03", name: "Porcelain", texture: "solid", hex: "#E6E1D4", tag: "2026 신제품", desc: "부드러운 웜톤 화이트로 오래도록 무난합니다." },
    { id: "m6", code: "PNC47", name: "Slate", texture: "concrete", hex: "#E1DACB", tag: "모던 그레이", desc: "화이트 벽과 은은한 대비를 주는 콘크리트 톤입니다." },
    { id: "m7", code: "PNC49", name: "Moon Stone", texture: "concrete", hex: "#E8E2D2", tag: "스테디셀러", desc: "따뜻한 스톤 질감으로 우드 바닥과 잘 어울립니다." },
    { id: "m8", code: "PNC42", name: "Stone Blast", texture: "concrete", hex: "#EDE9DE", tag: "밝은 스톤톤", desc: "은은한 스톤 텍스처로 밋밋하지 않은 화이트 계열입니다." },
    { id: "m9", code: "PNC57", name: "Stone Blast", texture: "concrete", hex: "#423931", tag: "다크 포인트", desc: "걸레받이만 짙게 시공해 바닥과 벽의 경계를 명확히 할 때 선택합니다." },
    { id: "m10", code: "BLC04", name: "Terranova", texture: "solid", hex: "#DBD5C8", tag: "2026 신제품", desc: "따뜻한 그레이 베이지로 다양한 벽지 톤에 무난히 어울립니다." },
  ],
  shoe: [
    { id: "sh1", code: "BLC05", name: "Pure White", texture: "solid", hex: "#EEE9DE", tag: "부동의 1위", desc: "현관을 밝고 넓어 보이게 하는 기본 화이트입니다." },
    { id: "sh2", code: "BLC02", name: "Cream", texture: "solid", hex: "#EFE4CE", tag: "2026 신제품", desc: "따뜻한 크림 톤으로 현관에 온기를 더합니다." },
    { id: "sh3", code: "LW112", name: "Nordic Oak", texture: "wood", hex: "#8C7461", tag: "그레이 우드", desc: "그레이가 도는 오크 톤으로 모던한 현관에 잘 어울립니다." },
    { id: "sh4", code: "LW102", name: "Denver Oak", texture: "wood", hex: "#C69C68", tag: "내추럴 현관", desc: "따뜻한 오크 톤으로 현관에 자연스러운 느낌을 더합니다." },
    { id: "sh5", code: "LW116", name: "Amber Oak", texture: "wood", hex: "#C89A5D", tag: "따뜻한 우드톤", desc: "꿀빛 앰버 오크로 포근한 현관 분위기를 만듭니다." },
    { id: "sh6", code: "LW114", name: "Alpine Oak", texture: "wood", hex: "#C0925A", tag: "우드톤 추천", desc: "부드러운 중간톤 오크로 무난하게 선택하는 신발장 컬러입니다." },
    { id: "sh7", code: "PNC47", name: "Slate", texture: "concrete", hex: "#E1DACB", tag: "모던 그레이", desc: "콘크리트 질감의 그레이로 심플한 현관을 연출합니다." },
    { id: "sh8", code: "PNC57", name: "Stone Blast", texture: "concrete", hex: "#423931", tag: "모던 포인트", desc: "짙은 다크 톤으로 중문과 통일하면 시크한 현관이 완성됩니다." },
    { id: "sh9", code: "PNC58", name: "Sand Stone", texture: "concrete", hex: "#AEA091", tag: "샌드 스톤톤", desc: "모래빛 스톤 질감으로 자연스러운 현관 느낌을 줍니다." },
    { id: "sh10", code: "PNC55", name: "Moon Stone", texture: "concrete", hex: "#E7E3DA", tag: "은은한 스톤톤", desc: "부드러운 스톤 텍스처로 무난하게 선택하는 밝은 톤입니다." },
  ],
};

// 질감(texture)별 공통 시공 팁
const TEXTURE_TIPS = {
  solid: [
    "지문·잔스크래치가 잘 티 나지 않아 유지관리가 편합니다.",
    "손잡이가 없는 미니멀(핸들리스) 도어 디자인과 특히 잘 어울립니다.",
    "같은 계열 무광 몰딩과 매치하면 통일감 있는 공간이 됩니다.",
  ],
  concrete: [
    "미장 콘크리트 질감이라 미니멀하고 모던한 공간에 잘 어울립니다.",
    "표면에 요철이 있어 매끈한 소재보다 지문·잔스크래치가 덜 도드라집니다.",
    "같은 계열 무광 벽지·바닥재와 매치하면 카페형 공간으로 완성됩니다.",
  ],
  wood: [
    "실제 원목 결처럼 보이려면 문짝 방향에 맞춰 결 방향을 통일해서 시공하는 것이 중요합니다.",
    "좁은 공간엔 밝은 오크 톤, 넓은 공간엔 짙은 톤이 안정감을 줍니다.",
    "바닥재·몰딩 색상과 톤을 맞추면 훨씬 자연스러운 공간이 됩니다.",
  ],
  metal: [
    "전체 시공보다는 도어 프레임이나 몰딩 일부에 포인트로 사용하는 것을 추천합니다.",
    "포인트 시공만으로도 고급스러운 느낌을 낼 수 있어 비용 대비 효과가 좋습니다.",
    "지문이 잘 묻는 편이라 현관처럼 손이 자주 닿는 곳은 무광 메탈을 고려해보세요.",
  ],
  marble: [
    "화려한 무늬라 전체 시공보다는 아일랜드 식탁이나 중문 등 일부 포인트 시공을 추천합니다.",
    "무늬 이음새가 자연스럽게 이어지도록 숙련된 기사의 재단이 중요합니다.",
    "밝은 마블은 공간을 화사하게, 어두운 톤은 카페 같은 분위기를 연출합니다.",
  ],
};

// 시공 부위별 전문가 팁 (한 줄씩 추가)
const CATEGORY_TIPS = {
  wardrobe: "붙박이장은 손잡이 주변부터 필름이 들뜨는 경우가 많아 마감 실리콘 처리를 꼼꼼히 하는 업체인지 확인하세요.",
  sink: "싱크대 상판(인조대리석 등)은 필름 시공이 되지 않아 도어와 옆판 위주로 진행됩니다.",
  door: "문틀(문선)까지 함께 시공해야 색이 자연스럽게 이어져 완성도가 높아집니다.",
  jungmoon: "중문은 유리·금속 프레임 소재라 곡면과 모서리 마감 기술이 특히 중요한 부위입니다.",
  molding: "걸레받이는 바닥과 맞닿는 부분이라 방수·오염에 강한 필름을 추천합니다.",
  shoe: "신발장은 내부보다 도어 외부 위주로 시공해 비용을 절감할 수 있습니다.",
};

// 질감(texture) -> 자재비 단가 등급(tier) 매핑
const TIER_BY_TEXTURE = {
  solid: "basic",
  concrete: "mid",
  wood: "mid",
  metal: "premium",
  marble: "premium",
};

const TIER_LABEL = { basic: "무광 단색 등급", mid: "텍스처(콘크리트·우드) 등급", premium: "프리미엄(메탈·마블) 등급" };

// 카테고리별 예산 기준 (단위: 원). unitPrice는 CATEGORIES[].unit 1단위당 자재비.
const BUDGET = {
  wardrobe: {
    unitPrice: { basic: [6000, 8000], mid: [7000, 9500], premium: [10000, 15000] },
    labor: [300000, 450000],
    laborNote: "붙박이장 1조 기준 (기사 1인 반나절~1일 작업)",
  },
  sink: {
    unitPrice: { basic: [6000, 8000], mid: [7500, 10000], premium: [11000, 16000] },
    labor: [350000, 500000],
    laborNote: "상부장+하부장 기준 (기사 1인 1일 작업)",
  },
  door: {
    unitPrice: { basic: [6000, 8000], mid: [7000, 9500], premium: [10000, 14000] },
    labor: [80000, 120000],
    laborNote: "방문 1개 기준 (여러 개 동시 시공 시 할인 가능)",
  },
  jungmoon: {
    unitPrice: { basic: [7000, 9000], mid: [8000, 10500], premium: [12000, 18000] },
    labor: [150000, 250000],
    laborNote: "중문 1조 기준",
  },
  molding: {
    unitPrice: { basic: [3000, 4500], mid: [4000, 5500], premium: [5500, 8000] },
    labor: [200000, 400000],
    laborNote: "전용면적 24평형 몰딩+걸레받이 전체 기준",
  },
  shoe: {
    unitPrice: { basic: [6000, 8000], mid: [7000, 9500], premium: [10000, 14000] },
    labor: [150000, 250000],
    laborNote: "신발장 2m 내외 기준",
  },
};
