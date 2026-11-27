// ---------- Static prototype data (no backend) ----------

export const GOALS = [
  { id: 'loss', label: 'Weight loss', emoji: '🔥', group: 'Body goals' },
  { id: 'gain', label: 'Weight gain', emoji: '🍚', group: 'Body goals' },
  { id: 'maintain', label: 'Maintenance', emoji: '⚖️', group: 'Body goals' },
  { id: 'muscle', label: 'Muscle gain', emoji: '💪', group: 'Body goals' },
  { id: 'energy', label: 'More energy', emoji: '⚡', group: 'Body goals' },
  { id: 'general', label: 'General improvement', emoji: '🌱', group: 'Body goals' },
  { id: 'diabetes', label: 'Diabetes monitoring', emoji: '🩸', group: 'Health goals' },
  { id: 'heart', label: 'Heart health', emoji: '❤️', group: 'Health goals' },
  { id: 'cholesterol', label: 'Lower cholesterol', emoji: '🫀', group: 'Health goals' },
  { id: 'bp', label: 'Blood pressure', emoji: '🩺', group: 'Health goals' },
  { id: 'pcos', label: 'PCOS-friendly eating', emoji: '🌸', group: 'Health goals' },
  { id: 'thyroid', label: 'Thyroid support', emoji: '🦋', group: 'Health goals' },
  { id: 'gut', label: 'Gut & digestion', emoji: '🥬', group: 'Health goals' },
]

export const RESTRICTIONS = [
  { id: 'vegetarian', label: 'Vegetarian', forbids: ['meat', 'fish', 'shellfish', 'egg'] },
  { id: 'eggetarian', label: 'Eggetarian', forbids: ['meat', 'fish', 'shellfish'] },
  { id: 'pescatarian', label: 'Pescatarian', forbids: ['meat'] },
  { id: 'vegan', label: 'Vegan', forbids: ['meat', 'fish', 'shellfish', 'egg', 'dairy', 'honey'] },
  { id: 'jain', label: 'Jain', forbids: ['meat', 'fish', 'shellfish', 'egg', 'root', 'allium'] },
  { id: 'satvik', label: 'No onion / garlic', forbids: ['allium'] },
  { id: 'nuts', label: 'Nut / peanut allergy', forbids: ['nuts', 'peanut'] },
  { id: 'gluten', label: 'Gluten-free', forbids: ['gluten'] },
  { id: 'dairy', label: 'Lactose intolerant', forbids: ['dairy'] },
  { id: 'soy', label: 'Soy allergy', forbids: ['soy'] },
  { id: 'eggallergy', label: 'Egg allergy', forbids: ['egg'] },
  { id: 'shellfish', label: 'Shellfish allergy', forbids: ['shellfish'] },
  { id: 'sesame', label: 'Sesame allergy', forbids: ['sesame'] },
  { id: 'nohoney', label: 'No honey / added sugar', forbids: ['honey'] },
]

export const TAG_LABEL = {
  meat: 'meat', fish: 'fish', egg: 'egg', dairy: 'dairy', honey: 'honey',
  root: 'root vegetables', allium: 'onion/garlic', shellfish: 'shellfish', sesame: 'sesame', nuts: 'tree nuts', peanut: 'peanuts', gluten: 'gluten', soy: 'soy',
}

export const ACTIVITY = [
  { id: 1.2, label: 'Mostly seated' },
  { id: 1.375, label: 'Lightly active' },
  { id: 1.55, label: 'Moderately active' },
  { id: 1.725, label: 'Very active' },
]

// ---------- Packaged foods (stand-in for Open Food Facts) ----------
// per100: kcal, protein, carbs, sugar, fat, satfat, fiber, sodium(mg)
export const PRODUCTS = [
  {
    id: 'p1', barcode: '8901001000011', name: 'Crunchy Choco Cereal', brand: 'Morning Crunch', emoji: '🥣', group: 'Breakfast', serving: 40,
    per100: { kcal: 385, protein: 6, carbs: 80, sugar: 32, fat: 3, satfat: 1, fiber: 3, sodium: 280 },
    ingredients: ['Refined wheat flour (maida)', 'Sugar', 'Cocoa solids', 'Glucose syrup', 'Malt extract', 'Salt', 'Emulsifier (322)', 'Soy lecithin'],
    contains: ['gluten', 'soy'],
  },
  {
    id: 'p2', barcode: '8901001000028', name: 'Instant Masala Noodles', brand: 'Slurpy', emoji: '🍜', group: 'Meals', serving: 70,
    per100: { kcal: 440, protein: 9, carbs: 62, sugar: 4, fat: 17, satfat: 8, fiber: 2, sodium: 1650 },
    ingredients: ['Refined wheat flour (maida)', 'Palm oil', 'Salt', 'Sugar', 'Flavour enhancers (627, 631)', 'Onion powder', 'Garlic powder', 'Spices'],
    contains: ['gluten', 'root', 'allium'],
  },
  {
    id: 'p3', barcode: '8901001000035', name: 'Roasted Chana Snack', brand: 'Desi Bites', emoji: '🫘', group: 'Snacks', serving: 30,
    per100: { kcal: 360, protein: 20, carbs: 58, sugar: 2, fat: 6, satfat: 1, fiber: 16, sodium: 420 },
    ingredients: ['Roasted chickpeas (92%)', 'Rice bran oil', 'Salt', 'Black pepper', 'Cumin'],
    contains: [],
  },
  {
    id: 'p4', barcode: '8901001000042', name: 'High-Protein Greek Yogurt', brand: 'Dairy Fresh', emoji: '🥛', group: 'Dairy & protein', serving: 150,
    per100: { kcal: 75, protein: 10, carbs: 5, sugar: 4, fat: 1.5, satfat: 1, fiber: 0, sodium: 45 },
    ingredients: ['Toned milk', 'Milk protein concentrate', 'Live cultures'],
    contains: ['dairy'],
  },
  {
    id: 'p5', barcode: '8901001000059', name: 'Salted Peanut Butter', brand: 'Nutty Co.', emoji: '🥜', group: 'Spreads', serving: 32,
    per100: { kcal: 600, protein: 25, carbs: 18, sugar: 8, fat: 50, satfat: 9, fiber: 6, sodium: 380 },
    ingredients: ['Roasted peanuts (90%)', 'Sugar', 'Palm oil', 'Salt'],
    contains: ['peanut', 'nuts'],
  },
  {
    id: 'p6', barcode: '8901001000066', name: 'Mango Fruit Drink', brand: 'Juicy Joy', emoji: '🧃', group: 'Beverages', serving: 200,
    per100: { kcal: 62, protein: 0.2, carbs: 15, sugar: 14, fat: 0, satfat: 0, fiber: 0, sodium: 10 },
    ingredients: ['Water', 'Sugar', 'Mango pulp (12%)', 'Acidity regulator (330)', 'Preservative (211)', 'Artificial flavour'],
    contains: [],
  },
  {
    id: 'p7', barcode: '8901001000073', name: 'Multigrain Cream Biscuits', brand: 'Crisp & Co.', emoji: '🍪', group: 'Snacks', serving: 30,
    per100: { kcal: 470, protein: 6, carbs: 68, sugar: 28, fat: 19, satfat: 10, fiber: 3, sodium: 360 },
    ingredients: ['Refined wheat flour (maida)', 'Sugar', 'Palm oil', 'Invert syrup', 'Wheat bran', 'Raising agents', 'Milk solids'],
    contains: ['gluten', 'dairy'],
  },
  {
    id: 'p8', barcode: '8901001000080', name: 'Soy Protein Bar', brand: 'FitFuel', emoji: '🍫', group: 'Snacks', serving: 50,
    per100: { kcal: 380, protein: 30, carbs: 40, sugar: 6, fat: 12, satfat: 3, fiber: 8, sodium: 190 },
    ingredients: ['Soy protein isolate', 'Dates', 'Almonds', 'Oats', 'Cocoa', 'Sunflower oil'],
    contains: ['soy', 'nuts', 'gluten'],
  },
  {
    id: 'p9', barcode: '8901001000097', name: 'Rolled Oats (Plain)', brand: 'Whole Fields', emoji: '🌾', group: 'Breakfast', serving: 40,
    per100: { kcal: 380, protein: 13, carbs: 66, sugar: 1, fat: 7, satfat: 1.3, fiber: 10, sodium: 5 },
    ingredients: ['Whole grain rolled oats (100%)'],
    contains: ['gluten'],
  },
  {
    id: 'p10', barcode: '8901001000103', name: 'Ragi Millet Puffs', brand: 'Desi Bites', emoji: '🥨', group: 'Snacks', serving: 30,
    per100: { kcal: 395, protein: 8, carbs: 72, sugar: 3, fat: 8, satfat: 2, fiber: 9, sodium: 310 },
    ingredients: ['Ragi (finger millet) flour (60%)', 'Rice flour', 'Sunflower oil', 'Salt', 'Jeera'],
    contains: [],
  },
  {
    id: 'p11', barcode: '8901001000110', name: 'Unsweetened Soy Milk', brand: 'Green Pour', emoji: '🥤', group: 'Beverages', serving: 200,
    per100: { kcal: 33, protein: 3, carbs: 1.5, sugar: 0.5, fat: 1.8, satfat: 0.3, fiber: 0.5, sodium: 40 },
    ingredients: ['Water', 'Soybeans (8%)', 'Calcium carbonate', 'Salt'],
    contains: ['soy'],
  },
  {
    id: 'p12', barcode: '8901001000127', name: 'Fresh Paneer Block', brand: 'Dairy Fresh', emoji: '🧀', group: 'Dairy & protein', serving: 100,
    per100: { kcal: 296, protein: 18, carbs: 3, sugar: 2, fat: 23, satfat: 14, fiber: 0, sodium: 22 },
    ingredients: ['Full-fat milk', 'Citric acid'],
    contains: ['dairy'],
  },
]

// ---------- Meals (stand-in for IFCT 2017 based recipes) ----------
// gi: low | med | high   contains = dietary tags; ing = main ingredients (pantry matching)
export const MEALS = [
  { id: 'm1', name: 'Moong Dal Chilla with Mint Chutney', emoji: '🥞', type: 'breakfast', kcal: 280, p: 16, c: 38, f: 7, fiber: 8, gi: 'low', time: 20, contains: [], ing: ['moong dal', 'onion', 'green chilli', 'coriander', 'mint'], goals: ['loss', 'diabetes', 'muscle', 'general'], root: true },
  { id: 'm2', name: 'Vegetable Poha with Peanuts', emoji: '🍛', type: 'breakfast', kcal: 330, p: 8, c: 54, f: 10, fiber: 4, gi: 'med', time: 15, contains: ['peanut', 'nuts', 'root'], ing: ['poha', 'onion', 'peanuts', 'curry leaves', 'lemon', 'peas'], goals: ['maintain', 'gain', 'general'] },
  { id: 'm3', name: 'Idli with Sambar', emoji: '🍚', type: 'breakfast', kcal: 300, p: 11, c: 56, f: 3, fiber: 6, gi: 'med', time: 25, contains: [], ing: ['idli batter', 'toor dal', 'drumstick', 'tomato', 'sambar powder'], goals: ['maintain', 'loss', 'general'] },
  { id: 'm4', name: 'Veg Oats Upma', emoji: '🥣', type: 'breakfast', kcal: 260, p: 10, c: 40, f: 6, fiber: 7, gi: 'low', time: 15, contains: ['gluten'], ing: ['oats', 'carrot', 'peas', 'mustard seeds', 'curry leaves'], goals: ['loss', 'diabetes', 'general'] },
  { id: 'm5', name: 'Egg Bhurji with Multigrain Roti', emoji: '🍳', type: 'breakfast', kcal: 390, p: 24, c: 30, f: 18, fiber: 5, gi: 'low', time: 15, contains: ['egg', 'gluten', 'root'], ing: ['eggs', 'onion', 'tomato', 'multigrain atta', 'green chilli'], goals: ['muscle', 'gain', 'maintain'] },
  { id: 'm6', name: 'Banana Oat Protein Smoothie', emoji: '🥤', type: 'breakfast', kcal: 420, p: 22, c: 56, f: 12, fiber: 6, gi: 'med', time: 5, contains: ['dairy', 'gluten'], ing: ['banana', 'oats', 'milk', 'peanut butter', 'whey'], goals: ['gain', 'muscle'] },
  { id: 'm7', name: 'Rajma Chawal Bowl', emoji: '🍲', type: 'lunch', kcal: 520, p: 19, c: 82, f: 11, fiber: 14, gi: 'med', time: 40, contains: ['root'], ing: ['rajma', 'rice', 'onion', 'tomato', 'garam masala'], goals: ['gain', 'maintain', 'general'] },
  { id: 'm8', name: 'Palak Dal with Jowar Roti', emoji: '🥬', type: 'lunch', kcal: 410, p: 20, c: 58, f: 9, fiber: 12, gi: 'low', time: 30, contains: ['root'], ing: ['toor dal', 'spinach', 'jowar atta', 'garlic', 'tomato'], goals: ['loss', 'diabetes', 'general', 'maintain'] },
  { id: 'm9', name: 'Grilled Chicken, Roti & Cucumber Raita', emoji: '🍗', type: 'lunch', kcal: 560, p: 46, c: 50, f: 18, fiber: 6, gi: 'low', time: 35, contains: ['meat', 'dairy', 'gluten', 'root'], ing: ['chicken', 'atta', 'curd', 'cucumber', 'ginger'], goals: ['muscle', 'loss', 'gain'] },
  { id: 'm10', name: 'Paneer Tikka Salad Bowl', emoji: '🥗', type: 'lunch', kcal: 430, p: 28, c: 22, f: 26, fiber: 6, gi: 'low', time: 25, contains: ['dairy'], ing: ['paneer', 'capsicum', 'curd', 'lettuce', 'cucumber'], goals: ['muscle', 'loss', 'diabetes'] },
  { id: 'm11', name: 'Tofu & Veggie Stir-fry with Brown Rice', emoji: '🥘', type: 'lunch', kcal: 470, p: 24, c: 62, f: 14, fiber: 9, gi: 'low', time: 30, contains: ['soy', 'root'], ing: ['tofu', 'brown rice', 'broccoli', 'capsicum', 'soy sauce', 'garlic'], goals: ['loss', 'muscle', 'general', 'diabetes'] },
  { id: 'm12', name: 'Fish Curry with Steamed Rice', emoji: '🐟', type: 'dinner', kcal: 520, p: 34, c: 62, f: 14, fiber: 4, gi: 'med', time: 35, contains: ['fish', 'root'], ing: ['fish', 'rice', 'coconut', 'tomato', 'onion'], goals: ['maintain', 'muscle', 'general'] },
  { id: 'm13', name: 'Dalia Khichdi with Vegetables', emoji: '🍚', type: 'dinner', kcal: 350, p: 14, c: 60, f: 6, fiber: 10, gi: 'low', time: 30, contains: ['gluten'], ing: ['dalia', 'moong dal', 'carrot', 'peas', 'ghee'], goals: ['loss', 'diabetes', 'maintain', 'general'] },
  { id: 'm14', name: 'Chole with Bhature-style Kulcha', emoji: '🫓', type: 'dinner', kcal: 640, p: 20, c: 88, f: 22, fiber: 13, gi: 'high', time: 45, contains: ['gluten', 'root'], ing: ['chickpeas', 'maida', 'onion', 'tomato', 'curd'], goals: ['gain'] },
  { id: 'm15', name: 'Lauki Kofta Curry with Bajra Roti', emoji: '🥒', type: 'dinner', kcal: 380, p: 14, c: 52, f: 13, fiber: 9, gi: 'low', time: 40, contains: ['gluten'], ing: ['lauki', 'besan', 'bajra atta', 'tomato', 'ginger'], goals: ['loss', 'diabetes', 'general'] },
  { id: 'm16', name: 'Egg Curry with Brown Rice', emoji: '🍛', type: 'dinner', kcal: 480, p: 26, c: 56, f: 16, fiber: 5, gi: 'med', time: 30, contains: ['egg', 'root'], ing: ['eggs', 'brown rice', 'onion', 'tomato', 'garam masala'], goals: ['muscle', 'maintain', 'gain'] },
  { id: 'm17', name: 'Sprouts Chaat', emoji: '🥙', type: 'snack', kcal: 150, p: 10, c: 24, f: 2, fiber: 8, gi: 'low', time: 10, contains: ['root'], ing: ['sprouts', 'onion', 'tomato', 'lemon', 'coriander'], goals: ['loss', 'diabetes', 'general', 'maintain'] },
  { id: 'm18', name: 'Roasted Makhana', emoji: '🍿', type: 'snack', kcal: 120, p: 4, c: 20, f: 3, fiber: 3, gi: 'low', time: 10, contains: [], ing: ['makhana', 'ghee', 'black pepper'], goals: ['loss', 'diabetes', 'general'] },
  { id: 'm19', name: 'Almonds & Seasonal Fruit', emoji: '🍎', type: 'snack', kcal: 210, p: 6, c: 24, f: 11, fiber: 5, gi: 'low', time: 2, contains: ['nuts'], ing: ['almonds', 'apple'], goals: ['maintain', 'general', 'gain'] },
  { id: 'm20', name: 'Peanut Butter Banana Toast', emoji: '🍞', type: 'snack', kcal: 340, p: 12, c: 42, f: 15, fiber: 5, gi: 'med', time: 5, contains: ['peanut', 'nuts', 'gluten'], ing: ['bread', 'peanut butter', 'banana'], goals: ['gain', 'muscle'] },
  { id: 'm21', name: 'Masala Chaas & Roasted Chana', emoji: '🥛', type: 'snack', kcal: 170, p: 10, c: 22, f: 4, fiber: 6, gi: 'low', time: 5, contains: ['dairy'], ing: ['curd', 'roasted chana', 'cumin'], goals: ['loss', 'diabetes', 'maintain', 'muscle'] },
  { id: 'm23', name: 'Garlic Prawn Stir-fry with Brown Rice', emoji: '🍤', type: 'dinner', kcal: 450, p: 32, c: 52, f: 12, fiber: 5, gi: 'low', time: 25, contains: ['shellfish'], ing: ['prawns', 'brown rice', 'garlic', 'capsicum', 'lemon'], goals: ['muscle', 'loss', 'heart'] },
  { id: 'm24', name: 'Til-Jaggery Energy Ladoo', emoji: '🟤', type: 'snack', kcal: 190, p: 5, c: 24, f: 9, fiber: 3, gi: 'med', time: 10, contains: ['sesame'], ing: ['sesame seeds', 'jaggery', 'peanuts'], goals: ['energy', 'gain'] },
  { id: 'm25', name: 'Flaxseed Oats Porridge with Berries', emoji: '🫐', type: 'breakfast', kcal: 290, p: 11, c: 44, f: 8, fiber: 10, gi: 'low', time: 10, contains: ['gluten'], ing: ['oats', 'flaxseed', 'berries', 'chia seeds'], goals: ['heart', 'cholesterol', 'gut'] },
  { id: 'm26', name: 'Methi Thepla with Plain Curd', emoji: '🫓', type: 'dinner', kcal: 360, p: 13, c: 50, f: 11, fiber: 8, gi: 'low', time: 30, contains: ['gluten', 'dairy'], ing: ['methi', 'atta', 'curd', 'ajwain'], goals: ['pcos', 'diabetes', 'thyroid'] },
  { id: 'm27', name: 'Curd Rice with Pomegranate', emoji: '🍚', type: 'lunch', kcal: 340, p: 11, c: 52, f: 9, fiber: 3, gi: 'med', time: 15, contains: ['dairy'], ing: ['rice', 'curd', 'pomegranate', 'curry leaves'], goals: ['gut', 'maintain', 'bp'] },
  { id: 'm22', name: 'Soya Chunk Tikki', emoji: '🥩', type: 'snack', kcal: 220, p: 18, c: 20, f: 7, fiber: 5, gi: 'low', time: 20, contains: ['soy', 'root'], ing: ['soya chunks', 'onion', 'oats', 'spices'], goals: ['muscle', 'loss'] },
]

export const SAMPLE_PANTRY = ['onion', 'tomato', 'eggs', 'rice', 'toor dal', 'curd', 'spinach', 'atta', 'moong dal', 'oats']
export const PANTRY_SUGGESTIONS = [
  'onion', 'tomato', 'eggs', 'rice', 'brown rice', 'toor dal', 'moong dal', 'curd', 'milk', 'spinach', 'atta', 'oats',
  'paneer', 'tofu', 'chicken', 'fish', 'chickpeas', 'rajma', 'peas', 'carrot', 'capsicum', 'banana', 'peanut butter',
  'sprouts', 'cucumber', 'lemon', 'garlic', 'ginger', 'poha', 'besan', 'dalia', 'lauki',
]

// ---------- Nearby professionals (fictional, for UI prototype) ----------
export const PROVIDERS = [
  { id: 'd1', type: 'dietitian', name: 'Ananya Rao', title: 'Clinical Dietitian', spec: ['Diabetes', 'Weight loss'], dist: 0.8, rating: 4.9, reviews: 212, clinic: 'GreenLeaf Nutrition Clinic', open: 'Open · closes 7 pm', x: 38, y: 42 },
  { id: 'd2', type: 'doctor', name: 'Dr. Rohan Mehta', title: 'Endocrinologist', spec: ['Diabetes', 'Thyroid'], dist: 1.6, rating: 4.8, reviews: 341, clinic: 'CityCare Hospital', open: 'Open · closes 8 pm', x: 66, y: 28 },
  { id: 'd3', type: 'dietitian', name: 'Priya Nair', title: 'Sports Nutritionist', spec: ['Muscle gain', 'Weight gain'], dist: 2.1, rating: 4.7, reviews: 128, clinic: 'PeakFit Wellness', open: 'Opens 9 am', x: 24, y: 68 },
  { id: 'd4', type: 'doctor', name: 'Dr. Sana Qureshi', title: 'General Physician', spec: ['Blood pressure', 'General health'], dist: 2.4, rating: 4.6, reviews: 457, clinic: 'Sunrise Family Clinic', open: 'Open · closes 6 pm', x: 74, y: 62 },
  { id: 'd5', type: 'dietitian', name: 'Kavita Joshi', title: 'Registered Dietitian', spec: ['Vegetarian', 'Jain diets', 'Weight loss'], dist: 3.2, rating: 4.9, reviews: 96, clinic: 'Wholesome Diet Studio', open: 'Open · closes 5 pm', x: 52, y: 80 },
  { id: 'd6', type: 'doctor', name: 'Dr. Arjun Iyer', title: 'Diabetologist', spec: ['Diabetes', 'Lifestyle medicine'], dist: 4.0, rating: 4.8, reviews: 289, clinic: 'Metro Diabetes Centre', open: 'Opens 10 am', x: 84, y: 40 },
]

export const SEED_GLUCOSE = [
  { d: 13, ctx: 'fasting', v: 96 }, { d: 12, ctx: 'post-meal', v: 148 }, { d: 11, ctx: 'fasting', v: 101 },
  { d: 10, ctx: 'post-meal', v: 136 }, { d: 9, ctx: 'fasting', v: 94 }, { d: 8, ctx: 'post-meal', v: 152 },
  { d: 7, ctx: 'fasting', v: 99 }, { d: 6, ctx: 'post-meal', v: 131 }, { d: 5, ctx: 'fasting', v: 92 },
  { d: 4, ctx: 'post-meal', v: 128 }, { d: 3, ctx: 'fasting', v: 97 }, { d: 2, ctx: 'post-meal', v: 139 },
  { d: 1, ctx: 'fasting', v: 95 }, { d: 0, ctx: 'post-meal', v: 126 },
]
