// 인테리어필름 컬러 상담소 — 데이터
// 20년 경력 시공 전문가 관점에서 정리한 "요즘 많이 찾는" 스테디셀러 색상/질감 목록입니다.
// 가격은 지역/시공사/현장 상태에 따라 달라질 수 있는 참고용 추정치입니다.

// 실사 이미지 참고용 외부 링크 (사용자가 직접 제공한 URL)
const REFERENCE_SITE = {
  name: "이보닥(ebodaq) 필름 카탈로그",
  url: "https://www.ebodaq.com/Product/Product/Detail?pattern=&gloss=&color=&listType=0&searchText=&sortOrder=2&currentPage=1&pageSize=10000&idProduct=1674",
};

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

// texture: solid(무광단색) / wood(우드그레인) / gloss(하이그로시) / metal(메탈릭) / marble(마블·스톤)
const FILMS = {
  wardrobe: [
    { id: "w1", code: "WD-101", name: "내추럴 화이트오크", texture: "wood", hex: "#D8C4A0", tag: "올해 인기 1위", desc: "밝은 원목 결로 어떤 인테리어에도 무난하게 어울리는 스테디셀러." },
    { id: "w2", code: "WD-102", name: "스칸디 라이트그레이", texture: "solid", hex: "#C9CBCB", tag: "무난 최다선택", desc: "차분하고 깔끔한 톤으로 벽지 색을 크게 타지 않습니다." },
    { id: "w3", code: "WD-103", name: "웜그레이지 무광", texture: "solid", hex: "#B9AFA4", tag: "베스트셀러", desc: "그레이보다 따뜻하고 베이지보다 세련된 중간 톤." },
    { id: "w4", code: "WD-104", name: "클래식 월넛", texture: "wood", hex: "#6B4A34", tag: "고급스러움", desc: "짙은 우드톤으로 호텔같은 안정감을 연출합니다." },
    { id: "w5", code: "WD-105", name: "다크 스모크오크", texture: "wood", hex: "#4A3B31", tag: "모던 우드", desc: "월넛보다 회색기가 돌아 더 모던한 느낌을 줍니다." },
    { id: "w6", code: "WD-106", name: "미니멀 화이트 무광", texture: "solid", hex: "#F2F1ED", tag: "가장 밝은 선택", desc: "공간을 가장 넓고 환하게 보이게 하는 기본 화이트." },
    { id: "w7", code: "WD-107", name: "딥 세이지그린", texture: "solid", hex: "#6E7C63", tag: "요즘 뜨는 컬러", desc: "포인트 벽 대신 붙박이장에 그린을 적용하는 추세." },
    { id: "w8", code: "WD-108", name: "소프트 베이지", texture: "solid", hex: "#E4D6C1", tag: "따뜻한 톤", desc: "우드 바닥재와 톤온톤으로 잘 어울리는 베이지." },
    { id: "w9", code: "WD-109", name: "매트 블랙", texture: "solid", hex: "#2B2B2B", tag: "포인트 강추", desc: "손잡이리스 도어와 함께 시공하면 고급스러운 느낌 극대화." },
    { id: "w10", code: "WD-110", name: "화이트 하이그로시", texture: "gloss", hex: "#F5F5F3", tag: "화사함 최고", desc: "빛 반사로 화사하고 넓어 보이지만 지문 관리가 필요." },
  ],
  sink: [
    { id: "s1", code: "SK-201", name: "화이트 하이그로시", texture: "gloss", hex: "#F7F6F2", tag: "주방 부동의 1위", desc: "밝고 청결한 느낌으로 가장 많이 선택하는 주방 컬러." },
    { id: "s2", code: "SK-202", name: "그레이 하이그로시", texture: "gloss", hex: "#B9BCC0", tag: "모던 주방", desc: "화이트보다 때가 덜 타면서도 화사한 광택을 유지." },
    { id: "s3", code: "SK-203", name: "라이트오크 우드그레인", texture: "wood", hex: "#C9A876", tag: "내추럴 키친", desc: "따뜻한 우드 톤 주방으로 카페 분위기를 연출." },
    { id: "s4", code: "SK-204", name: "웜그레이 무광", texture: "solid", hex: "#A9A29A", tag: "스테디셀러", desc: "무광이라 기름때·지문이 눈에 덜 띄어 실용적입니다." },
    { id: "s5", code: "SK-205", name: "세이지그린 무광", texture: "solid", hex: "#7C8B6F", tag: "요즘 뜨는 컬러", desc: "그린 하부장 + 화이트 상부장 조합이 인기입니다." },
    { id: "s6", code: "SK-206", name: "딥네이비 무광", texture: "solid", hex: "#2E3A4F", tag: "고급 주방", desc: "블랙 대신 네이비로 부드럽지만 고급스러운 느낌." },
    { id: "s7", code: "SK-207", name: "마블화이트", texture: "marble", hex: "#EDEBE6", tag: "포인트 추천", desc: "아일랜드 식탁이나 상판 측면 포인트로 인기." },
    { id: "s8", code: "SK-208", name: "콘크리트그레이", texture: "marble", hex: "#9C9A96", tag: "인더스트리얼", desc: "카페형 인더스트리얼 주방을 연출할 때 선택." },
    { id: "s9", code: "SK-209", name: "아이보리 화이트", texture: "solid", hex: "#F1EAD9", tag: "무난 최다선택", desc: "순백보다 은은해서 오래 봐도 질리지 않습니다." },
    { id: "s10", code: "SK-210", name: "블랙 매트", texture: "solid", hex: "#232323", tag: "하부장 포인트", desc: "상부장은 화이트, 하부장은 블랙으로 대비를 주는 구성." },
  ],
  door: [
    { id: "d1", code: "DR-301", name: "화이트 무광", texture: "solid", hex: "#F4F3EF", tag: "부동의 1위", desc: "몰딩·걸레받이와 통일하기 가장 쉬운 기본 컬러." },
    { id: "d2", code: "DR-302", name: "그레이지 무광", texture: "solid", hex: "#BDB6AC", tag: "베스트셀러", desc: "화이트보다 때가 덜 타는 실용적인 인기 컬러." },
    { id: "d3", code: "DR-303", name: "화이트오크 우드그레인", texture: "wood", hex: "#D9C7A8", tag: "내추럴 인기", desc: "바닥재가 밝은 톤일 때 자연스럽게 이어집니다." },
    { id: "d4", code: "DR-304", name: "월넛 우드그레인", texture: "wood", hex: "#5B3E2B", tag: "고급스러움", desc: "짙은 색 문으로 공간에 무게감을 줍니다." },
    { id: "d5", code: "DR-305", name: "라이트그레이", texture: "solid", hex: "#CFCFCC", tag: "무난 최다선택", desc: "어떤 벽지 색과도 무난하게 어울리는 톤." },
    { id: "d6", code: "DR-306", name: "딥그레이 무광", texture: "solid", hex: "#5A5A58", tag: "모던 포인트", desc: "화이트 벽과 대비되어 문이 하나의 디자인 요소가 됩니다." },
    { id: "d7", code: "DR-307", name: "블랙 무광", texture: "solid", hex: "#2A2A2A", tag: "요즘 뜨는 컬러", desc: "손잡이·경첩까지 블랙으로 맞추면 스타일리시합니다." },
    { id: "d8", code: "DR-308", name: "애쉬그레이 우드그레인", texture: "wood", hex: "#B9B2A6", tag: "은은한 우드", desc: "우드 질감은 살리되 톤은 차분하게 가고 싶을 때." },
    { id: "d9", code: "DR-309", name: "베이지 무광", texture: "solid", hex: "#E6D9C3", tag: "따뜻한 톤", desc: "우드 바닥재, 베이지 벽지와 조화롭게 어울립니다." },
    { id: "d10", code: "DR-310", name: "딥그린 무광", texture: "solid", hex: "#4C5A47", tag: "포인트 추천", desc: "서재·아이방 등 한 문만 포인트로 많이 선택합니다." },
  ],
  jungmoon: [
    { id: "j1", code: "JM-401", name: "블랙 무광 프레임톤", texture: "solid", hex: "#242424", tag: "부동의 1위", desc: "카페형 중문의 정석, 유리와 대비되어 선이 살아납니다." },
    { id: "j2", code: "JM-402", name: "화이트 무광", texture: "solid", hex: "#F3F2EE", tag: "밝은 현관", desc: "현관이 어둡거나 좁을 때 개방감을 줍니다." },
    { id: "j3", code: "JM-403", name: "골드브론즈 메탈", texture: "metal", hex: "#8A6A3D", tag: "고급 포인트", desc: "프레임 라인에 포인트로 넣으면 호텔 로비 느낌." },
    { id: "j4", code: "JM-404", name: "그레이 메탈릭", texture: "metal", hex: "#8C8C8C", tag: "모던 포인트", desc: "무채색 현관 인테리어와 잘 어울리는 은은한 메탈." },
    { id: "j5", code: "JM-405", name: "월넛 우드그레인", texture: "wood", hex: "#5B3E2B", tag: "내추럴 현관", desc: "우드 톤 현관장과 세트로 시공하는 경우가 많습니다." },
    { id: "j6", code: "JM-406", name: "스모크그레이", texture: "solid", hex: "#4E4E4C", tag: "베스트셀러", desc: "블랙보다 부드럽고 화이트보다 때가 덜 탑니다." },
    { id: "j7", code: "JM-407", name: "화이트오크", texture: "wood", hex: "#D9C7A8", tag: "밝은 우드", desc: "밝은 톤의 우드 중문으로 따뜻한 현관을 연출." },
    { id: "j8", code: "JM-408", name: "딥네이비", texture: "solid", hex: "#2C3648", tag: "고급스러움", desc: "블랙 대신 네이비로 차분하고 고급스러운 현관." },
    { id: "j9", code: "JM-409", name: "샴페인골드 메탈", texture: "metal", hex: "#C9AE7C", tag: "요즘 뜨는 컬러", desc: "골드보다 옅은 톤이라 부담 없이 포인트를 줍니다." },
    { id: "j10", code: "JM-410", name: "차콜그레이", texture: "solid", hex: "#3A3A38", tag: "무난 최다선택", desc: "블랙만큼 진하지 않아 무난하게 쓰기 좋습니다." },
  ],
  molding: [
    { id: "m1", code: "ML-501", name: "화이트 무광", texture: "solid", hex: "#F5F4F0", tag: "부동의 1위", desc: "가장 무난하고 밝은 공간을 만드는 기본 컬러." },
    { id: "m2", code: "ML-502", name: "라이트그레이", texture: "solid", hex: "#D6D4CE", tag: "베스트셀러", desc: "화이트보다 때가 덜 타면서 깔끔한 느낌 유지." },
    { id: "m3", code: "ML-503", name: "웜그레이", texture: "solid", hex: "#B7AFA4", tag: "스테디셀러", desc: "따뜻한 톤의 마감재·가구와 잘 어울립니다." },
    { id: "m4", code: "ML-504", name: "화이트오크", texture: "wood", hex: "#DCCBA9", tag: "내추럴 인기", desc: "몰딩까지 우드로 통일해 원목 느낌을 강조." },
    { id: "m5", code: "ML-505", name: "다크브라운", texture: "wood", hex: "#3E2C22", tag: "클래식", desc: "걸레받이만 짙게 시공해 바닥과 벽의 경계를 명확히." },
    { id: "m6", code: "ML-506", name: "블랙 무광", texture: "solid", hex: "#262626", tag: "요즘 뜨는 컬러", desc: "무몰딩 느낌을 내고 싶을 때 걸레받이만 블랙으로." },
    { id: "m7", code: "ML-507", name: "베이지", texture: "solid", hex: "#E7DAC2", tag: "따뜻한 톤", desc: "베이지 벽지와 톤온톤으로 자연스럽게 이어집니다." },
    { id: "m8", code: "ML-508", name: "아이보리", texture: "solid", hex: "#F1E9D6", tag: "무난 최다선택", desc: "순백보다 부드러운 톤으로 오래도록 무난합니다." },
    { id: "m9", code: "ML-509", name: "그레이지", texture: "solid", hex: "#BDB2A4", tag: "인기 상승", desc: "그레이와 베이지 사이, 최근 문의가 가장 많은 톤." },
    { id: "m10", code: "ML-510", name: "딥그레이", texture: "solid", hex: "#57534E", tag: "모던 포인트", desc: "화이트 벽 + 딥그레이 몰딩으로 대비를 주는 스타일." },
  ],
  shoe: [
    { id: "sh1", code: "SH-601", name: "화이트 무광", texture: "solid", hex: "#F3F2ED", tag: "부동의 1위", desc: "현관을 밝고 넓어 보이게 하는 기본 선택." },
    { id: "sh2", code: "SH-602", name: "그레이 무광", texture: "solid", hex: "#B7B5AF", tag: "베스트셀러", desc: "때가 덜 타서 신발장에 특히 많이 선택됩니다." },
    { id: "sh3", code: "SH-603", name: "라이트오크", texture: "wood", hex: "#CBAE82", tag: "내추럴 현관", desc: "따뜻한 톤으로 현관에 온기를 더합니다." },
    { id: "sh4", code: "SH-604", name: "월넛", texture: "wood", hex: "#5C4030", tag: "고급스러움", desc: "짙은 톤으로 현관에 무게감과 고급스러움을 줍니다." },
    { id: "sh5", code: "SH-605", name: "블랙 무광", texture: "solid", hex: "#252525", tag: "모던 포인트", desc: "중문과 블랙으로 통일하면 시크한 현관 완성." },
    { id: "sh6", code: "SH-606", name: "세이지그린", texture: "solid", hex: "#748268", tag: "요즘 뜨는 컬러", desc: "화이트 벽 현관에 그린 포인트로 신선한 느낌." },
    { id: "sh7", code: "SH-607", name: "네이비", texture: "solid", hex: "#2D3A50", tag: "고급 포인트", desc: "블랙보다 부드러운 고급스러움을 원할 때 선택." },
    { id: "sh8", code: "SH-608", name: "하이그로시 화이트", texture: "gloss", hex: "#F6F5F1", tag: "화사함 최고", desc: "좁은 현관을 화사하고 넓어 보이게 합니다." },
    { id: "sh9", code: "SH-609", name: "베이지", texture: "solid", hex: "#E6D7BE", tag: "따뜻한 톤", desc: "우드 바닥재와 자연스럽게 어울리는 톤." },
    { id: "sh10", code: "SH-610", name: "스모크그레이", texture: "solid", hex: "#54514C", tag: "무난 최다선택", desc: "화이트보다 관리가 편해 실사용 만족도가 높습니다." },
  ],
};

// 질감(texture)별 공통 시공 팁
const TEXTURE_TIPS = {
  solid: [
    "지문·잔스크래치가 잘 티 나지 않아 유지관리가 편합니다.",
    "손잡이가 없는 미니멀(핸들리스) 도어 디자인과 특히 잘 어울립니다.",
    "같은 계열 무광 몰딩과 매치하면 통일감 있는 공간이 됩니다.",
  ],
  wood: [
    "실제 원목 결처럼 보이려면 문짝 방향에 맞춰 결 방향을 통일해서 시공하는 것이 중요합니다.",
    "좁은 공간엔 밝은 오크 톤, 넓은 공간엔 짙은 월넛 톤이 안정감을 줍니다.",
    "바닥재·몰딩 색상과 톤을 맞추면 훨씬 자연스러운 공간이 됩니다.",
  ],
  gloss: [
    "광택이 있는 만큼 지문·스크래치가 도드라져 보일 수 있어 주기적인 관리가 필요합니다.",
    "빛 반사로 공간이 실제보다 넓고 화사해 보이는 효과가 있습니다.",
    "습기·기름때가 많은 주방은 물걸레 청소는 쉽지만 자국이 남기 쉬우니 참고하세요.",
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
  wood: "mid",
  gloss: "premium",
  metal: "premium",
  marble: "premium",
};

const TIER_LABEL = { basic: "무광 단색 등급", mid: "우드그레인 등급", premium: "프리미엄(하이그로시·메탈·마블) 등급" };

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
