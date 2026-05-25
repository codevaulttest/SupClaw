export const TOKEN_LABELS = {
  A: 'A · 品牌定制',
  B: 'B · 创意文案',
  C: 'C · 极速盲盒',
};

export const VISIBLE_CATEGORIES = [
  { id: 'confucian',     name: '儒家经典',     nameEn: 'Confucian Classics',                    image: '/assets/category-images-v2/01-confucian-classics.webp',       locked: false },
  { id: 'taoist',        name: '道家经典',     nameEn: 'Taoist Classics',                        image: '/assets/category-images-v2/02-daoist-classics.webp',           locked: false },
  { id: 'mohist',        name: '墨家法家名家', nameEn: 'Mohist, Legalist & Logician Schools',    image: '/assets/category-images-v2/03-mohist-legalist-logicians.webp',  locked: false },
  { id: 'military',      name: '兵家谋略',     nameEn: 'Military Strategy',                      image: '/assets/category-images-v2/04-military-strategy.webp',         locked: false },
  { id: 'miscellaneous', name: '诸子杂家',     nameEn: 'Miscellaneous Schools of Thought',       image: '/assets/category-images-v2/05-hundred-schools.webp',           locked: false },
  { id: 'astronomy',     name: '天文历法',     nameEn: 'Astronomy & Calendar',                   image: '/assets/category-images-v2/06-astronomy-calendar.webp',        locked: false },
  { id: 'medicine',      name: '医药医学',     nameEn: 'Medicine & Pharmacology',                image: '/assets/category-images-v2/07-medicine.webp',                  locked: false },
  { id: 'mathematics',   name: '数学算术',     nameEn: 'Mathematics & Arithmetic',               image: '/assets/category-images-v2/08-mathematics.webp',               locked: false },
  { id: 'agriculture',   name: '农学农业',     nameEn: 'Agriculture & Agronomy',                 image: '/assets/category-images-v2/09-agriculture.webp',               locked: false },
  { id: 'technology',    name: '科技工艺',     nameEn: 'Technology & Craftsmanship',             image: '/assets/category-images-v2/10-technology-craft.webp',           locked: false },
  { id: 'geography',     name: '地理方志',     nameEn: 'Geography & Local Chronicles',           image: '/assets/category-images-v2/11-geography-gazetteers.webp',      locked: false },
  { id: 'history',       name: '史书典籍',     nameEn: 'Historical Texts & Classics',            image: '/assets/category-images-v2/12-history-classics.webp',          locked: false },
];

// type is derived from 支付说明: ASC→A, BSC→B, CSC→C
const BOOKLISTS = {
  confucian: [
    { title: '《论语》',     type: 'C' },
    { title: '《孟子》',     type: 'A' },
    { title: '《荀子》',     type: 'B' },
    { title: '《礼记》',     type: 'C' },
    { title: '《孝经》',     type: 'C' },
    { title: '《大学》',     type: 'C' },
    { title: '《中庸》',     type: 'C' },
    { title: '《曾子》',     type: 'C' },
    { title: '《子思》',     type: 'C' },
    { title: '《晏子春秋》', type: 'C' },
    { title: '《孔子家语》', type: 'C' },
    { title: '《说苑》',     type: 'C' },
    { title: '《新序》',     type: 'C' },
    { title: '《法言》',     type: 'C' },
    { title: '《新语》',     type: 'C' },
    { title: '《申鉴》',     type: 'C' },
    { title: '《潜夫论》',   type: 'C' },
    { title: '《中说》',     type: 'C' },
    { title: '《近思录》',   type: 'C' },
    { title: '《传习录》',   type: 'C' },
  ],
  taoist: [
    { title: '《老子》(《道德经》)',   type: 'C' },
    { title: '《庄子》(《南华经》)',   type: 'C' },
    { title: '《列子》',               type: 'C' },
    { title: '《文子》',               type: 'C' },
    { title: '《关尹子》',             type: 'C' },
    { title: '《鬻子》',               type: 'C' },
    { title: '《鹖冠子》',             type: 'C' },
    { title: '《淮南子》',             type: 'C' },
    { title: '《抱朴子》',             type: 'C' },
    { title: '《太平经》',             type: 'C' },
    { title: '《周易参同契》',         type: 'C' },
    { title: '《黄帝四经》',           type: 'C' },
    { title: '《通玄真经》',           type: 'C' },
    { title: '《冲虚真经》',           type: 'C' },
    { title: '《南华真经》',           type: 'C' },
  ],
  mohist: [
    { title: '《墨子》',     type: 'C' },
    { title: '《随巢子》',   type: 'C' },
    { title: '《管子》',     type: 'C' },
    { title: '《商君书》',   type: 'C' },
    { title: '《韩非子》',   type: 'C' },
    { title: '《慎子》',     type: 'C' },
    { title: '《申子》',     type: 'C' },
    { title: '《邓析子》',   type: 'C' },
    { title: '《公孙龙子》', type: 'C' },
    { title: '《尹文子》',   type: 'C' },
  ],
  military: [
    { title: '《孙子兵法》',         type: 'C' },
    { title: '《吴子兵法》',         type: 'C' },
    { title: '《孙膑兵法》',         type: 'C' },
    { title: '《司马法》',           type: 'C' },
    { title: '《六韬》',             type: 'C' },
    { title: '《尉缭子》',           type: 'C' },
    { title: '《三略》',             type: 'C' },
    { title: '《唐太宗李卫公问对》', type: 'C' },
    { title: '《太白阴经》',         type: 'C' },
    { title: '《虎钤经》',           type: 'C' },
    { title: '《纪效新书》',         type: 'C' },
    { title: '《练兵实纪》',         type: 'C' },
    { title: '《三十六计》',         type: 'C' },
  ],
  miscellaneous: [
    { title: '《吕氏春秋》', type: 'C' },
    { title: '《尸子》',     type: 'C' },
    { title: '《颜氏家训》', type: 'C' },
  ],
  astronomy: [
    { title: '《鬼谷子》',   type: 'C' },
    { title: '《甘石星经》', type: 'C' },
    { title: '《灵宪》',     type: 'C' },
  ],
  medicine: [
    { title: '《大明历》',     type: 'C' },
    { title: '《黄帝内经》',   type: 'C' },
    { title: '《难经》',       type: 'C' },
    { title: '《伤寒杂病论》', type: 'C' },
    { title: '《神农本草经》', type: 'C' },
    { title: '《针灸甲乙经》', type: 'C' },
    { title: '《脉经》',       type: 'C' },
    { title: '《肘后备急方》', type: 'C' },
    { title: '《千金方》',     type: 'C' },
  ],
  mathematics: [
    { title: '《本草纲目》',   type: 'C' },
    { title: '《周髀算经》',   type: 'C' },
  ],
  agriculture: [
    { title: '《九章算术》', type: 'C' },
    { title: '《齐民要术》', type: 'C' },
    { title: '《王祯农书》', type: 'C' },
  ],
  technology: [
    { title: '《农政全书》', type: 'C' },
    { title: '《天工开物》', type: 'C' },
  ],
  geography: [
    { title: '《考工记》',     type: 'C' },
    { title: '《山海经》',     type: 'C' },
    { title: '《穆天子传》',   type: 'C' },
    { title: '《国语》',       type: 'C' },
    { title: '《战国策》',     type: 'C' },
    { title: '《越绝书》',     type: 'C' },
    { title: '《吴越春秋》',   type: 'C' },
    { title: '《华阳国志》',   type: 'C' },
    { title: '《水经注》',     type: 'C' },
    { title: '《大唐西域记》', type: 'C' },
  ],
  history: [
    { title: '《徐霞客游记》', type: 'C' },
    { title: '《尚书》',       type: 'C' },
    { title: '《春秋》',       type: 'C' },
    { title: '《左传》',       type: 'C' },
    { title: '《周易》',       type: 'C' },
    { title: '《尔雅》',       type: 'C' },
    { title: '《释名》',       type: 'C' },
    { title: '《方言》',       type: 'C' },
    { title: '《说文解字》',   type: 'C' },
    { title: '《论衡》',       type: 'C' },
  ],
};

export const CATEGORY_NAME_BY_ID = Object.fromEntries(
  VISIBLE_CATEGORIES.map((category) => [category.id, category.name]),
);

export const CATEGORY_NAME_EN_BY_ID = Object.fromEntries(
  VISIBLE_CATEGORIES.map((category) => [category.id, category.nameEn]),
);

export function getBookTitleEn(title) {
  const countSuffix = title.match(/\s×\s\d+$/)?.[0] ?? '';
  const baseTitle = title.replace(/\s×\s\d+$/, '').replace(/^《|》$/g, '');
  return `${baseTitle}${countSuffix}`;
}

export function getProductsByCategory(categoryId) {
  return (BOOKLISTS[categoryId] ?? []).map((item, index) => ({
    id: `${categoryId}-${index + 1}`,
    title: item.title,
    titleEn: getBookTitleEn(item.title),
    type: item.type,
    price: 1,
    duration: 10,
  }));
}

export function getFeaturedProducts(limit = 4) {
  return [
    ...getProductsByCategory('confucian').slice(0, 2),
    ...getProductsByCategory('military').slice(0, 2),
  ].slice(0, limit);
}
