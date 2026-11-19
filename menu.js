// Ling Chan Guerilla menu, transcribed from the menu photos on the restaurant's Google listing.
// Chinese names are the restaurant's own where printed. Names marked "~" in comments are our own and need checking.
// Item: [English, Chinese, price, note]. price: number, [smaller, larger], or a preformatted string.
const GROUPS = [
  { id: 'trays', label: 'Party trays', cats: [
    ['Pork', '猪肉', [['Lumpiang Shanghai', '上海春卷', 1250, '48 pcs'], ['Sweet & Sour Pork', '糖醋里脊', 1699]]],
    ['Shrimp', '虾', [['Buttered Garlic Shrimp', '黄油蒜蓉虾', 1899], ['Salt and Pepper Shrimp', '椒盐虾', 1899], ['Sweet Chili Shrimp', '香辣虾', 1999], ['Salted Egg Shrimp', '咸蛋虾', 2099]]],
    ['Beef', '牛肉', [['Beef Broccoli', '牛肉西兰花', 1899], ['Beef with Bokchoy', '白菜牛肉', 1899]]],
    ['Chicken', '鸡肉', [['Sweet & Sour Chicken', '糖醋鸡', 1599]]],
    ['Rice', '米饭', [['Egg Fried Rice', '蛋炒饭', 1499], ['Yang Chow Fried Rice', '扬州炒饭', 1799], ["Ling Chan's Fried Rice", 'Ling Chan 海鲜炒饭', 1899]]],
    ['Noodles', '面', [['Chow Mien', '炒面', 1499], ['Birthday Noodles', '长寿面', 1799]]],
    ['Dim sum', '点心', [['Pork & Shrimp Siomai', '猪肉虾仁烧麦', 1100, '20 pcs'], ['Siopao', '烧包', 750, '3 pcs each: Asado, Choco, Taro, Egg Yolk']]],
    ['Dessert', '甜点', [['Buchi', '麻团', 1000, '20 pcs: 12 Custard, 4 Taro, 4 Black Sesame']]]
  ], note: 'Each tray serves about 10 to 12. Order any 2 and get a free Ling Chan umbrella.' },
  { id: 'starters', label: 'Starters', cats: [
    ['Appetizer', '开胃菜', [['Hot and Sour Potato Salad', '酸辣土豆丝', 160], ['Smacked Cucumber Salad', '凉拌黄瓜', 160], ['Wood Ear Mushroom in Black Vinegar Dressing', '凉拌木耳', 160], ['Eggplant with Green Pepper Sauce', '青椒炒茄子', 180]]]
  ] },
  { id: 'soup', label: 'Soup', cats: [
    ['Soup', '汤', [['Halaan Soup', '蛤蜊汤', [460, 860]], ['Black Seamoss Seafood with Century Egg', '黑海藻海鲜皮蛋羹', [440, 840]], ['Chicken Corn Soup', '鸡肉玉米羹', [380, 780]], ['Minced Beef Soup', '西湖牛肉羹', [420, 820]], ['Hototay Soup', '蛋花海鲜汤', [420, 820]], ['Pumpkin Seafood Soup', '南瓜海鲜汤', [440, 840]], ['Hot & Sour Soup', '酸辣汤', [420, 820]], ['Spinach Seafood Soup', '菠菜海鲜羹', [440, 840]]]]
  ] },
  { id: 'dimsum', label: 'Dim sum', cats: [
    ['Xiao Long Bao', '小笼包', [['Original', '正宗小笼包', [260, 360], '6 pcs | 10 pcs'], ['Crab Chili', '辣味蟹包', [280, 380], '6 pcs | 10 pcs'], ['XLB Combination', '小笼包拼盘', [290, 390], '6 pcs | 10 pcs']]],
    ['Siopao', '烧包', [['Asado', '烤肉', 190], ['Bola-Bola', '波波包', 210, '1 pc'], ['Egg Yolk Pao', '流心蛋黄包', 190], ['Taro Pao', '芋头包', 180], ['Vegetable Pao', '蔬菜包', 190], ['Red Bean Pao', '红豆包', 170], ['Choco Pao', 'Choco 包', 190], ['Jumbo Pao', '大包', 210, '1 pc']]],
    ['Dumplings & siomai', '点心/饺子', [['Pork and Shrimp Siomai', '猪肉虾仁烧麦', 210, '4 pcs'], ['Japanese Siomai', '日本烧麦', 210, '4 pcs'], ['Century Siomai', '世纪烧麦', 220, '4 pcs'], ['Hakao Dumpling', '虾饺', 240, '4 pcs'], ['Scallop Dumpling', '扇贝饺', 240, '4 pcs'], ['Vegetable Dumpling', '蔬菜饺', 190, '3 pcs'], ['Kutchay Dumpling', '韭菜饺', 190, '3 pcs'], ['Beancurd Roll', '豆腐卷', 238, '3 pcs'], ['Seafood Roll', '海鲜卷', 238, '2 pcs'], ['Chicken Feet Taosi', '蚝油鸡爪', 210, '150 g'], ['Shrimp Ball', '虾丸', 210, '3 pcs'], ['Malay Cake', '马来糕', 180, '4 slices'], ['Matcha', '抹茶', 210, '2 pcs']]],
    ['Fried dim sum', '炸点心', [['Pan-fried Gyoza', '煎饺子', 210, '3 pcs'], ['Pan-fried Shrimp', '煎虾', 210, '3 pcs'], ['Taro Puff', '芋头泡芙', 210, '3 pcs'], ['Pumpkin Ball', '南瓜球', 190, '3 pcs'], ['Radish Puff', '萝卜酥', 190, '3 pcs'], ['Shrimp Puff', '虾卜', 210, '3 pcs']]],
    ['Baked', '烘焙', [['Baked Pork Bun', '烤叉烧包', 178, '3 pcs'], ['Chicken Tart', '鸡挞', 210, '3 pcs']]]
  ] },
  { id: 'pork', label: 'Pork', cats: [
    ['Pork', '猪肉', [['Eggplant Minced Pork with Salted Fish', '咸鱼肉末茄子', [420, 740]], ['Lumpiang Shanghai', '上海春卷', 280], ['Sweet and Sour Pork', '糖醋里脊', [420, 780]], ['Lechon Kawali Chinese Style', '澳门烧肉', [420, 780]], ['Patatim with Mantou (Taishan Style)', '台山猪脚配馒头', 1398], ['Stir-Fry Pork with Green Chili (Hunan Style)', '青椒炒肉', [510, 980]], ['Tausi Spare Ribs', '豆豉排骨', [450, 850]], ['Salt & Pepper Spare Ribs', '椒盐排骨', [450, 850]], ['Minced Pork with Lettuce', '生菜猪肉碎', [450, 850]], ['French Beans with Minced Pork', '干煸四季豆', [450, 850]], ['Crispy Pork Knuckle in Salt and Pepper', '椒盐脆皮猪手', 450], ['Pata Misua', '猪脚面线', 450]]]
  ] },
  { id: 'chicken', label: 'Chicken', cats: [
    ['Chicken', '鸡肉', [['Lemon Chicken', '柠檬鸡', [380, 720]], ['Sweet & Sour Chicken', '糖醋鸡', [360, 680]], ['White Chicken with Ginger Scallion', '姜葱白切鸡', [380, 720], 'half | whole'], ['Soy Chicken', '酱油鸡', [380, 720], 'half | whole'], ["Ling Chan's Fried Chicken", 'Ling Chan 炸鸡', [380, 720], 'half | whole'], ["General Tso's Chicken", '左宗棠鸡', [380, 720]], ['Kung Pao Chicken', '宫保鸡丁', [380, 720]], ['Salted Egg Chicken', '咸蛋鸡', [410, 780]], ['Three-Cup Chicken (Claypot)', '砂锅三杯鸡', 460], ['Okiam Fried Chicken', '奥金炸鸡', [380, 720]]]]
  ] },
  { id: 'beef', label: 'Beef', cats: [
    ['Beef', '牛肉', [['Sizzling Beef Tenderloin Chinese Style', '中式铁板牛肉', 595], ['Beef Broccoli', '牛肉西兰花', [550, 1060]], ['Beef Ampalaya', '苦瓜牛肉', [550, 1060]], ['Beef Curry Brisket', '咖喱牛腩', [550, 1060]], ['Braised Beef Brisket in a Claypot', '红烧牛腩煲', 580], ['Braised Beef Tendon in a Claypot', '红烧牛筋煲', 610], ['Sizzling Beef Ribs in Black Pepper Sauce', '黑椒铁板牛仔骨', 595], ['Sizzling Beef Tenderloin Black Pepper Sauce', '黑椒铁板牛柳', 595], ['Beef with Bok Choy', '白菜牛肉', [550, 1060]]]]
  ] },
  { id: 'seafood', label: 'Seafood', cats: [
    ['Seafood', '海鲜', [['Steamed Pompano', '清蒸鲳鱼', '₱900 · ₱1,050 · ₱1,200', '600 g · 700 g · 800 g'], ['Salt & Pepper Squid', '椒盐鱿鱼', [450, 780]], ['Salt & Pepper Shrimp', '椒盐虾', [650, 1250]], ['Buttered Garlic Shrimp', '黄油蒜蓉虾', [650, 1250]], ['Steamed Garlic Shrimp', '蒜蓉虾', [650, 1250]], ['Salted Egg Shrimp', '咸蛋虾', [680, 1280]], ['Sweet Chili Shrimp', '香辣虾', [680, 1280]], ['Steamed Lapu-Lapu', '清蒸石斑鱼', '₱1,800 · ₱2,100 · ₱2,400 · ₱2,700', '600 g · 700 g · 800 g · 900 g'], ['Steamed Suahe', '清蒸虾', [650, 1250]], ['Black Bean Nylon Clams', '黑豆蛤蜊', [440, 820]], ['Sweet & Sour Fish', '糖醋鱼', [420, 780]], ['Sweet & Sour Lapu-Lapu', '糖醋石斑鱼', '₱1,800 · ₱2,100 · ₱2,400 · ₱3,600', '600 g · 700 g · 800 g · 900 g'], ['Hot Shrimp Salad', '沙拉虾', [680, 1280]], ['X.O. Talaba', '生蚝 (时价)', [600, 1150], 'seasonal price'], ['Thousand Silk Dragon Balls', '千丝龙珠', 580]]],
    ['Crab creations', '螃蟹创作', [['Sate Crab', '沙爹蟹', '₱2,160 · ₱2,520 · ₱2,880 · ₱3,240', '600 g · 700 g · 800 g · 900 g'], ['Salt & Pepper Crab', '椒盐蟹', '₱2,160 · ₱2,520 · ₱2,880 · ₱3,240', '600 g · 700 g · 800 g · 900 g'], ['Salted Egg Crab', '咸蛋蟹', '₱2,160 · ₱2,520 · ₱2,880 · ₱3,240', '600 g · 700 g · 800 g · 900 g'], ['Steamed Garlic Crab Sotanghon', '蒜蓉蒸蟹粉丝', '₱2,160 · ₱2,520 · ₱2,880 · ₱3,240', '600 g · 700 g · 800 g · 900 g']]]
  ] },
  { id: 'szechuan', label: 'Szechuan', cats: [
    ['Szechuan cuisine', '川菜', [['Mapo Tofu', '麻婆豆腐', [380, 720]], ['Szechuan Crispy Chicken', '四川辣子鸡', [440, 790]], ['Szechuan Cabbage Twice Cooked Pork', '回锅肉包菜', [450, 790]], ['Red Hot Szechuan Shrimp', '麻辣虾', [690, 1350]], ['Szechuan Poached Beef', '水煮牛肉', 898], ['Szechuan Stir Fry Beef', '四川炒牛肉', [580, 1100]]]]
  ] },
  { id: 'tofu', label: 'Tofu', cats: [
    ['Tofu', '豆腐', [['Pan Fried Tofu with Dried Scallops', '干贝炒豆腐', 520], ['Fish Fillet Tofu in a Pot', '鱼片豆腐煲', [420, 800]], ['Fried Tofu with Sweet Soy', '甜酱油炸豆腐', [290, 540]], ['Red Braised Tofu with Pork', '红烧豆腐', [420, 800]], ['Seafood Golden Mountain Tofu', '海鲜金山豆腐', [450, 850], 'new']]]
  ] },
  { id: 'veg', label: 'Vegetables', cats: [
    ['Vegetables', '时蔬', [['Mixed Vegetables', '什锦蔬菜', [380, 720]], ['Salted Egg French Beans', '咸蛋四季豆', 350], ['French Beans with Garlic', '蒜蓉四季豆', 350], ['Kangkong with Garlic', '蒜蓉空心菜', 230], ['Bok Choy with Garlic', '蒜蓉白菜', 310], ['Kangkong with Sweet Soy Garlic', '甜酱油蒜蓉空心菜', 230], ['Broccoli with Garlic', '蒜蓉西兰花', 420], ['Polonchay with Garlic', '蒜蓉青菜', 320], ['Kailan with Garlic', '蒜蓉芥兰', 420], ['Kailan with Oyster Sauce', '蚝油芥兰', 420], ['Choysum with Garlic', '蒜蓉菜心', 420]]]
  ] },
  { id: 'rice', label: 'Rice', cats: [
    ['Rice', '米饭', [['Minced Beef Fried Rice', '牛肉炒饭', [378, 748]], ["Ling Chan's Fried Rice (Seafood)", 'Ling Chan 海鲜炒饭', [398, 788]], ['Salted Fish Fried Rice', '咸鱼炒饭', [378, 748]], ['Yang Chow', '扬州炒饭', [398, 788]], ['Shanghai Fried Rice', '双拼腊肠炒饭', [418, 818]], ['Pork Fried Rice', '肉丝炒饭', [378, 748]], ['Garlic Fried Rice', '蒜蓉炒饭', [320, 620]], ['Egg Fried Rice', '蛋炒饭', [328, 648]], ['Plain Rice (Jasmine Rice)', '泰国米饭', [220, 440]], ['Cup of Rice', '米饭', 50]]],
    ['Rice bowl', '盖浇饭', [['Tausi Sparerib Rice with Sweet Soy', '豆豉甜酱油排骨饭', 238], ['Braised Beef Over Rice', '红烧牛肉盖饭', 248], ["General Tso's Over Rice", '左宗棠鸡盖饭', 228]]]
  ] },
  { id: 'noodles', label: 'Noodles', cats: [
    ['Noodle soup / dry noodle', '汤面/干面', [['Classic Beef Wonton Noodles', '经典牛肉云吞面', 310], ['Birthday Noodles', '长寿面', 390], ['Crispy Birthday Noodles', '脆长寿面', 390], ['Beef Hofan', '牛肉河粉', 420], ['Seafood Hofan', '海鲜河粉', 450], ['E-Fu Noodles (Canton Guisado)', '伊府面 (广式)', 360], ['Chow Mien', '炒面', 350]]]
  ] },
  { id: 'congee', label: 'Congee', cats: [
    ['Congee', '粥', [['Pork Meat Ball Congee', '猪肉丸粥', 165], ['Beef Congee', '牛肉粥', 185], ['Chicken Congee', '鸡肉粥', 165], ['Shredded Pork with Century Egg', '皮蛋瘦肉粥', 165]]]
  ] },
  { id: 'dessert', label: 'Dessert', cats: [
    ['Dessert', '甜点', [['Snow Ball', '椰子麻团', 190], ['Custard Buchi', '奶油麻团', 190], ['Taro Buchi', '紫薯麻团', 180], ['Black Sesame Buchi', '黑芝麻酱麻团', 190], ['Coffee Jelly', '咖啡果冻', 190], ['Mango Pudding', '芒果布丁', 185], ['Red Bean Pudding', '红豆布丁', 160], ['Coconut Jelly', '椰子果冻', 180], ['Mango Sago with Pomelo', '芒果西米柚', 195], ['Almond Jelly', '杏仁果冻', 180], ['Chocolate Tart', '巧克力挞', 190], ['Egg Tart', '蛋挞', 180], ['Masachi', '麻糬', 190], ['Hot Taro', '热芋头', 240]]],
    ['Combi buchi', '综合麻团', [['Custard & Taro', '奶油芋头麻团', 210], ['Taro & Black Sesame', '芋头黑芝麻麻团', 210], ['Custard & Black Sesame', '奶油黑芝麻麻团', 220]]]
  ] },
  { id: 'drinks', label: 'Drinks', cats: [
    ['Juice / tea', '果汁/茶', [['Red Iced Tea', '红冰茶', '₱90 · ₱348', 'glass · pitcher'], ['Green Tea Lychee', '荔枝绿茶', '₱90 · ₱348', 'glass · pitcher'], ['Fruit shake: melon, buko, watermelon, avocado', '水果冰沙', 220], ['Fruit shake, any 2 combination', '水果冰沙 (任选两种)', 250]]]
  ] }
];
(function () {
  const e = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const p = n => '₱' + n.toLocaleString('en-PH');
  const price = v => typeof v === 'string' ? v : (Array.isArray(v) ? v : [v]).map(p).join(' | ');
  const item = ([n, zh, v, note]) =>
    `<li><span>${e(n)} <em lang="zh-Hans">${e(zh)}</em>${note ? `<small>${e(note)}</small>` : ''}</span><i class="dots"></i><span class="price">${e(price(v))}</span></li>`;
  const cat = ([title, zh, items]) =>
    `<section class="cat"><h3>${e(title)} <span lang="zh-Hans">${e(zh)}</span></h3><ul>${items.map(item).join('')}</ul></section>`;
  const tabs = document.getElementById('menuTabs'), grid = document.getElementById('menuGrid'), note = document.getElementById('menuNote');
  if (!tabs || !grid) return;
  const show = id => {
    const g = GROUPS.find(x => x.id === id) || GROUPS[0];
    tabs.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.id === g.id)));
    grid.innerHTML = g.cats.map(cat).join('');
    if (note) note.textContent = g.note || '';
  };
  tabs.innerHTML = GROUPS.map(g => `<button type="button" data-id="${g.id}" aria-pressed="false">${e(g.label)}</button>`).join('');
  tabs.addEventListener('click', ev => { const b = ev.target.closest('button'); if (b) show(b.dataset.id); });
  show('dimsum');
})();
