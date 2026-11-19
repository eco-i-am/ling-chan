// Menu data. Chinese names are our own translations, to be checked by the restaurant.
// Each item: [English name, Chinese name, price | [price, price], optional note]
const TRAYS = [
  ['Pork', '豬肉', [['Lumpiang Shanghai', '上海春卷', 1250, '48 pcs'], ['Sweet & Sour Pork', '咕嚕肉', 1699]]],
  ['Shrimp', '蝦', [['Buttered Garlic Shrimp', '蒜香牛油蝦', 1899], ['Salt and Pepper Shrimp', '椒鹽蝦', 1899], ['Sweet Chili Shrimp', '甜辣蝦', 1999], ['Salted Egg Shrimp', '鹹蛋黃蝦', 2099]]],
  ['Beef', '牛肉', [['Beef Broccoli', '西蘭花牛肉', 1899], ['Beef with Bokchoy', '白菜牛肉', 1899]]],
  ['Rice', '飯', [['Egg Fried Rice', '蛋炒飯', 1499], ['Yang Chow Fried Rice', '揚州炒飯', 1799], ["Ling Chan's Fried Rice", '招牌炒飯', 1899]]],
  ['Chicken', '雞', [['Sweet & Sour Chicken', '咕嚕雞', 1599]]],
  ['Noodles', '麵', [['Chow Mien', '炒麵', 1499], ['Birthday Noodles', '生日麵', 1799]]],
  ['Dim sum', '點心', [['Pork & Shrimp Siomai', '豬蝦燒賣', 1100, '20 pcs'], ['Siopao', '包子', 750, '3 pcs each: Asado, Choco, Taro, Egg Yolk']]],
  ['Dessert', '甜點', [['Buchi', '煎堆', 1000, '20 pcs: 12 Custard, 4 Taro, 4 Black Sesame']]]
];
// À la carte items found in public listings. Branch in the first field.
const ALA = [
  ['Guerilla', 'Appetizers', '前菜', [['Hot and Sour Potato Salad', '酸辣土豆絲', 160], ['Smacked Cucumber Salad', '拍黃瓜', 160], ['Wood Ear Mushroom in Black Vinegar', '黑醋木耳', 160], ['Eggplant with Green Pepper Sauce', '青椒茄子', 180]]],
  ['Guerilla', 'Soups', '湯', [['Seafood Soup with Century Egg', '皮蛋海鮮羹', [420, 780]], ['Chicken Corn Soup', '雞蓉粟米羹', [350, 640]]]],
  ['Panorama', 'Dim sum & noodles', '點心 · 麵', [['Xiao Long Bao', '小籠包', [270, 370], '6 pcs / 10 pcs'], ['Pork & Shrimp Siomai', '豬蝦燒賣', 180, '3 pcs'], ['Birthday Noodles', '生日麵', 390], ['Beef Wonton Noodles', '牛肉雲吞麵', 330]]],
  ['Panorama', 'Beef', '牛肉', [['Beef Broccoli', '西蘭花牛肉', 590]]]
];
(function () {
  const e = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const p = n => '₱' + n.toLocaleString('en-PH');
  const price = v => (Array.isArray(v) ? v : [v]).map(p).join(' · ');
  const item = ([n, zh, v, note]) =>
    `<li><span>${e(n)} <em lang="zh-Hant">${zh}</em>${note ? `<small>${e(note)}</small>` : ''}</span><i class="dots"></i><span class="price">${price(v)}</span></li>`;
  const cat = (title, zh, items, tag) =>
    `<section class="cat"><h3>${title} <span lang="zh-Hant">${zh}</span>${tag ? `<b class="tag">${tag}</b>` : ''}</h3><ul>${items.map(item).join('')}</ul></section>`;
  const t = document.getElementById('menuGrid'), a = document.getElementById('alaGrid');
  if (t) t.innerHTML = TRAYS.map(([c, zh, items]) => cat(c, zh, items)).join('');
  if (a) a.innerHTML = ALA.map(([br, c, zh, items]) => cat(c, zh, items, br)).join('');
})();
