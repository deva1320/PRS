/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TransactionPreset, SeasonPresets } from "../types";

export interface ProductMeta {
  emoji: string;
  category: string;
  description: string;
  image: string;
}

export const SEASONAL_RECOMMENDATIONS: SeasonPresets = {
  Summer: {
    Food: "Watermelon",
    Grocery: "Tender Coconut",
    Clothing: "Cotton Shirt",
  },
  Winter: {
    Food: "Soup",
    Grocery: "Tea Powder",
    Clothing: "Sweater",
  },
  Rainy: {
    Food: "Hot Snacks",
    Grocery: "Coffee Powder",
    Clothing: "Raincoat",
  },
  Spring: {
    Food: "Fresh Fruits",
    Grocery: "Juices",
    Clothing: "Light Wear",
  },
};

export const DATASET_PRESETS: TransactionPreset[] = [
  {
    id: "groceries",
    name: "Classic Grocery & Essentials",
    description: "Daily grocery list featuring staples, baking essentials, and rich exotic recipe ingredients like Saffron, Chicken, and spices.",
    items: [
      "Milk", "Bread", "Butter", "Jam", "Rice", "Salt", "Chocolates", "Biscuits", "Sugar", "Oil",
      "Garam Masala", "Chilli Powder", "Saffron", "Turmeric", "Yogurt", "Chicken", "Egg", "Cocoa Powder", "Baking Powder", "Cardamom",
      "Tomato", "Onion", "Potato", "Coriander", "Ginger", "Garlic", "Apple", "Banana", "Orange", "Grapes"
    ],
    transactions: [
      ["Rice", "Salt", "Chocolates", "Biscuits", "Milk", "Bread", "Jam", "Butter"], // User's full previous checkout
      ["Rice", "Salt", "Chocolates", "Biscuits", "Milk", "Bread", "Jam", "Butter", "Sugar"], // Classic purchase
      ["Rice", "Salt", "Chocolates", "Biscuits", "Milk", "Bread", "Jam", "Butter", "Oil"],   // Classic purchase with oil
      ["Rice", "Salt", "Chocolates", "Biscuits", "Milk", "Bread", "Jam", "Butter", "Sugar", "Oil"], // All-inclusive
      ["Milk", "Bread", "Butter"],
      ["Bread", "Jam"],
      ["Milk", "Butter"],
      ["Milk", "Bread"],
      ["Bread", "Butter", "Jam"],
      ["Milk", "Bread", "Butter"],
      ["Milk", "Jam"],
      ["Bread", "Butter"],
      ["Rice", "Oil"],
      ["Rice", "Oil", "Sugar"],
      ["Rice", "Sugar"],
      ["Oil", "Sugar"],
      // Specially seeded real Biryani culinary checkouts
      ["Rice", "Chicken", "Garam Masala", "Chilli Powder", "Saffron", "Yogurt", "Oil"],
      ["Rice", "Chicken", "Garam Masala", "Chilli Powder", "Yogurt", "Oil"],
      ["Rice", "Chicken", "Garam Masala", "Chilli Powder", "Salt", "Oil"],
      ["Garam Masala", "Chilli Powder", "Turmeric", "Cardamom", "Salt"],
      ["Rice", "Garam Masala", "Chilli Powder", "Chicken", "Yogurt"],
      // Specially seeded real Chocolate Cake culinary checkouts
      ["Milk", "Sugar", "Butter", "Egg", "Cocoa Powder", "Baking Powder", "Chocolates"],
      ["Sugar", "Butter", "Egg", "Cocoa Powder", "Baking Powder"],
      ["Egg", "Cocoa Powder", "Baking Powder", "Chocolates"],
      ["Butter", "Egg", "Sugar", "Cocoa Powder"],
      // Specially seeded real Vegetable cooking checkouts
      ["Tomato", "Onion", "Garlic", "Ginger", "Coriander", "Oil"],
      ["Tomato", "Onion", "Potato", "Salt", "Oil"],
      ["Onion", "Garlic", "Ginger", "Oil"],
      ["Tomato", "Onion", "Garlic", "Ginger"],
      ["Chicken", "Onion", "Tomato", "Ginger", "Garlic", "Garam Masala", "Chilli Powder", "Oil"],
      ["Chicken", "Onion", "Tomato", "Ginger", "Garlic", "Garam Masala", "Chilli Powder"],
      // Specially seeded real Fruit Basket checkouts
      ["Apple", "Banana", "Orange", "Grapes"],
      ["Apple", "Banana", "Orange"],
      ["Apple", "Orange", "Grapes"],
      ["Banana", "Milk", "Sugar"]
    ],
  },
  {
    id: "electronics",
    name: "Tech Hardware Hub",
    description: "Customer purchasing items in an electronics store (Laptop, Mouse, Keyboard, Webcam, Monitor, Headset, USB-C Cable, etc.).",
    items: ["Laptop", "Mouse", "Keyboard", "Webcam", "Monitor", "Headset", "USB-C Cable", "Docking Station"],
    transactions: [
      ["Laptop", "USB-C Cable", "Docking Station"],
      ["Mouse", "Keyboard"],
      ["Laptop", "Mouse", "Keyboard"],
      ["Monitor", "USB-C Cable"],
      ["Laptop", "Monitor", "Docking Station"],
      ["Headset", "Webcam"],
      ["Laptop", "Headset"],
      ["Mouse", "Keyboard", "Monitor"],
      ["Mouse", "USB-C Cable"],
      ["Laptop", "Mouse", "Keyboard", "Webcam", "Monitor", "USB-C Cable"],
      ["Laptop", "USB-C Cable"],
      ["Keyboard", "Monitor"],
    ],
  },
  {
    id: "bistro",
    name: "Artisanal Coffee & Bistro",
    description: "Morning café routines pairing Espresso, Latte, tea, muffins, croissants, and bagels.",
    items: ["Espresso", "Croissant", "Muffin", "Latte", "Bagel", "Avocado Toast", "Tea", "Cookie"],
    transactions: [
      ["Espresso", "Croissant"],
      ["Latte", "Muffin"],
      ["Espresso", "Latte"],
      ["Bagel", "Avocado Toast"],
      ["Espresso", "Bagel"],
      ["Latte", "Croissant", "Cookie"],
      ["Tea", "Muffin"],
      ["Tea", "Cookie"],
      ["Espresso", "Croissant", "Avocado Toast"],
      ["Latte", "Croissant"],
      ["Espresso", "Croissant", "Latte"],
      ["Muffin", "Cookie"],
    ],
  },
];

/**
 * A highly comprehensive database of product categories, variants, and brands
 * with exact and substring-based fallbacks for dynamic search matching.
 */
const PRODUCT_METADATA_DATABASE: Record<string, ProductMeta> = {
  // --- BISCUITS & COOKIES ---
  "parle-g": {
    emoji: "🍪",
    category: "Biscuits",
    description: "Classic golden-baked glucose biscuits, highly energetic.",
    image: "https://images.unsplash.com/photo-1558961309-dbdf000a12f1?auto=format&fit=crop&w=200&q=80",
  },
  "oreo": {
    emoji: "🥯",
    category: "Biscuits",
    description: "Rich dark cocoa sandwich cookies stuffed with sweet vanilla cream.",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=200&q=80",
  },
  "bourbon": {
    emoji: "🍫",
    category: "Biscuits",
    description: "Elegant chocolate-flavored sandwich biscuit sprinkled with sugar crystals.",
    image: "https://images.unsplash.com/photo-1600431521340-491eca880813?auto=format&fit=crop&w=200&q=80",
  },
  "cookies": {
    emoji: "🍪",
    category: "Biscuits",
    description: "Crisp and chewy baked cookies packed with sweet dark chocolate chips.",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=200&q=80",
  },
  "cookie": {
    emoji: "🍪",
    category: "Biscuits",
    description: "Crunchy brown butter cookie with rich chocolate chunks.",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=200&q=80",
  },
  "biscuits": {
    emoji: "🍪",
    category: "Biscuits",
    description: "Premium selection of baked tea biscuits and shortbreads.",
    image: "https://images.unsplash.com/photo-1558961309-dbdf000a12f1?auto=format&fit=crop&w=200&q=80",
  },
  "biscuit": {
    emoji: "🍪",
    category: "Biscuits",
    description: "Buttery, flaky traditional baked biscuit.",
    image: "https://images.unsplash.com/photo-1558961309-dbdf000a12f1?auto=format&fit=crop&w=200&q=80",
  },
  "digestive biscuits": {
    emoji: "🌾",
    category: "Biscuits",
    description: "Whole wheat fiber-rich semi-sweet digestive biscuits.",
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=200&q=80",
  },
  "marie gold": {
    emoji: "🪙",
    category: "Biscuits",
    description: "Crispy, light round biscuits prepared with wholesome wheat flour.",
    image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=200&q=80",
  },

  // --- DAIRY ---
  "milk": {
    emoji: "🥛",
    category: "Dairy",
    description: "Fresh farm whole milk pasteurized and rich in calcium.",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&q=80",
  },
  "almond milk": {
    emoji: "🥛",
    category: "Dairy Alternatives",
    description: "Unsweetened plant milk crafted from organic roasted almonds.",
    image: "https://images.unsplash.com/photo-1568651347641-a2c99373db6c?auto=format&fit=crop&w=200&q=80",
  },
  "oat milk": {
    emoji: "🌾",
    category: "Dairy Alternatives",
    description: "Extremely creamy, heart-healthy vegan milk made from gluten-free oats.",
    image: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=200&q=80",
  },
  "whole milk": {
    emoji: "🥛",
    category: "Dairy",
    description: "Full cream rich organic pasteurized dairy milk.",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&q=80",
  },
  "butter": {
    emoji: "🧈",
    category: "Dairy",
    description: "Churned creamy golden butter, perfectly salted for toasted slices.",
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=200&q=80",
  },
  "peanut butter": {
    emoji: "🥜",
    category: "Spreads",
    description: "Rich, slow-roasted creamy peanut butter spread.",
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=200&q=80",
  },

  // --- BAKERY & BREADS ---
  "bread": {
    emoji: "🍞",
    category: "Bakery",
    description: "Freshly baked country white loaf sliced to sandwich perfection.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80",
  },
  "sourdough": {
    emoji: "🥖",
    category: "Bakery",
    description: "Crusty, artisanal slow-fermented wild yeast sourdough.",
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=200&q=80",
  },
  "whole wheat bread": {
    emoji: "🍞",
    category: "Bakery",
    description: "Organic stoneground fiber-rich wheat sandwich bread.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80",
  },
  "garlic bread": {
    emoji: "🧄",
    category: "Bakery",
    description: "Oven-toasted classic French roll saturated in buttery roasted garlic.",
    image: "https://images.unsplash.com/photo-1573140286924-709fbc28a49c?auto=format&fit=crop&w=200&q=80",
  },
  "croissant": {
    emoji: "🥐",
    category: "Bakery",
    description: "Buttery, multi-layered flaky Parisian golden baked crescent.",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=200&q=80",
  },
  "bagel": {
    emoji: "🥯",
    category: "Bakery",
    description: "Chewy boiled-then-baked New York style bagel, perfect for cream cheese grains.",
    image: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=200&q=80",
  },
  "muffin": {
    emoji: "🧁",
    category: "Bakery",
    description: "Moist, sweet baking cake bursting with juicy mountain blueberries.",
    image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=200&q=80",
  },

  // --- SPREADS & PRESERVES ---
  "strawberry jam": {
    emoji: "🍓",
    category: "Spreads",
    description: "Preserved strawberry sweet spread featuring real fruit chunks.",
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=200&q=80",
  },
  "blueberry jam": {
    emoji: "🫐",
    category: "Spreads",
    description: "Tart and deeply flavorful mountain wild blueberry sugar preserve.",
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=200&q=80",
  },
  "jam": {
    emoji: "🏺",
    category: "Spreads",
    description: "Fruity mixed berry gourmet conserve, sweetened with cane nectar.",
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=200&q=80",
  },

  // --- GRAINS, OILS & SPICES ---
  "garam masala": {
    emoji: "🌶️",
    category: "Spices",
    description: "Fragrant blend of ground dry-roasted whole spices including cardamom, cinnamon, and cloves.",
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=200&q=80",
  },
  "chilli powder": {
    emoji: "🌶️",
    category: "Spices",
    description: "Vibrant ground Kashmiri red chilli powder, moderately hot and aromatic.",
    image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=200&q=80",
  },
  "saffron": {
    emoji: "🌸",
    category: "Spices",
    description: "Exquisite hand-harvested pure Kashmiri saffron keys for rich color and aromatic royal finish.",
    image: "https://images.unsplash.com/photo-1508686207856-001b95cf60ca?auto=format&fit=crop&w=200&q=80",
  },
  "turmeric": {
    emoji: "🟫",
    category: "Spices",
    description: "Bright golden organic ground turmeric powder possessing deep warm herbaceous benefits.",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=200&q=80",
  },
  "cardamom": {
    emoji: "🟢",
    category: "Spices",
    description: "Aromatic intense green cardamom pods, freshly gathered.",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=200&q=80",
  },
  "yogurt": {
    emoji: "🥛",
    category: "Dairy",
    description: "Thick, creamy set natural yogurt, ideal for marinating protein grains.",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=200&q=80",
  },
  "chicken": {
    emoji: "🍗",
    category: "Meat / Protein",
    description: "Farm-sourced premium tender chicken breasts or thighs, succulent and clean.",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=200&q=80",
  },
  "egg": {
    emoji: "🥚",
    category: "Dairy & Eggs",
    description: "Farm-fresh high protein white country eggs, perfect for fluffy bakes.",
    image: "https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=200&q=80",
  },
  "cocoa powder": {
    emoji: "🍫",
    category: "Baking Essentials",
    description: "100% Dutch-processed dark cocoa powder, rich, pure, and chocolatey.",
    image: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&w=200&q=80",
  },
  "baking powder": {
    emoji: "🥫",
    category: "Baking Essentials",
    description: "Double-acting leavening agent for producing light and airy sponge textures.",
    image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=200&q=80",
  },
  "rice": {
    emoji: "🌾",
    category: "Pantry Grains",
    description: "Long-grain aromatic Basmati rice, perfectly aged.",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=200&q=80",
  },
  "basmati rice": {
    emoji: "🌾",
    category: "Pantry Grains",
    description: "Fragrant Himalayan basmati grain, stellar for curries.",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=200&q=80",
  },
  "oil": {
    emoji: "🫗",
    category: "Pantry",
    description: "Pure extra virgin sunflower or olive cooking oil extract.",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=200&q=80",
  },
  "olive oil": {
    emoji: "🫒",
    category: "Pantry",
    description: "First cold-pressed Italian extra virgin olive oil.",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=200&q=80",
  },
  "salt": {
    emoji: "🧂",
    category: "Spices",
    description: "Iodized fine-grain pure Himalayan crystal cooking salt.",
    image: "https://images.unsplash.com/photo-1604152135912-04a022e23696?auto=format&fit=crop&w=200&q=80",
  },
  "sugar": {
    emoji: "🍬",
    category: "Pantry",
    description: "Fine granulated white sugar crystals from sugarcane.",
    image: "https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&w=200&q=80",
  },
  "brown sugar": {
    emoji: "🟫",
    category: "Pantry",
    description: "Aromatic soft molasses-rich dark brown sugar.",
    image: "https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&w=200&q=80",
  },

  // --- SWEETS & CHOCOLATES ---
  "chocolates": {
    emoji: "🍫",
    category: "Sweets",
    description: "Artisanal dark chocolate bars made with handpicked organic cacao bean.",
    image: "https://images.unsplash.com/photo-1548907040-4d42b52125f0?auto=format&fit=crop&w=200&q=80",
  },
  "chocolate": {
    emoji: "🍫",
    category: "Sweets",
    description: "Mouthwatering cocoa block bar with smooth milk solids.",
    image: "https://images.unsplash.com/photo-1548907040-4d42b52125f0?auto=format&fit=crop&w=200&q=80",
  },

  // --- DRINKS, COFFEE & TEA ---
  "espresso": {
    emoji: "☕️",
    category: "Beverages",
    description: "Intense, robust double-shot extracted under high pressure.",
    image: "https://images.unsplash.com/photo-1510972527409-cac5c441502a?auto=format&fit=crop&w=200&q=80",
  },
  "latte": {
    emoji: "☕️",
    category: "Beverages",
    description: "Silky espresso poured with rich textured steamed dairy foam.",
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=200&q=80",
  },
  "tea": {
    emoji: "🍵",
    category: "Beverages",
    description: "Soothing brew from dried organic Assam tea leaves.",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=200&q=80",
  },
  "green tea": {
    emoji: "🍵",
    category: "Beverages",
    description: "Rich, antioxidant Japanese premium sencha leaves.",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=200&q=80",
  },
  "tender coconut": {
    emoji: "🥥",
    category: "Fruits",
    description: "Refreshing, electrolyte-packed young real coconut nectar.",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=200&q=80",
  },
  "watermelon": {
    emoji: "🍉",
    category: "Fruits",
    description: "Crispy sweet hydrating red seedless watermelon halves.",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=200&q=80",
  },
  "tomato": {
    emoji: "🍅",
    category: "Vegetables",
    description: "Farm-fresh, juicy red organic vine tomatoes, sweet and tangy.",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=200&q=80",
  },
  "onion": {
    emoji: "🧅",
    category: "Vegetables",
    description: "Crisp, premium organic red onions, sweet with sharp aroma.",
    image: "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=200&q=80",
  },
  "potato": {
    emoji: "🥔",
    category: "Vegetables",
    description: "All-purpose, starchy organic golden Russet potatoes.",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=200&q=80",
  },
  "coriander": {
    emoji: "🌿",
    category: "Vegetables",
    description: "Fragrant, freshly gathered organic coriander (cilantro) greens.",
    image: "https://images.unsplash.com/photo-1588879460618-9249e0d93708?auto=format&fit=crop&w=200&q=80",
  },
  "ginger": {
    emoji: "🫚",
    category: "Vegetables",
    description: "Warm, pungent, premium organic ginger root knuckles.",
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=200&q=80",
  },
  "garlic": {
    emoji: "🧄",
    category: "Vegetables",
    description: "Extremely flavorful, plump organic whole bulb garlic.",
    image: "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=200&q=80",
  },
  "apple": {
    emoji: "🍎",
    category: "Fruits",
    description: "Symphony of crispiness: hand-harvested sweet organic Gala apples.",
    image: "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&w=200&q=80",
  },
  "banana": {
    emoji: "🍌",
    category: "Fruits",
    description: "Potassium-dense sweet yellow tree-ripened bananas.",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=200&q=80",
  },
  "orange": {
    emoji: "🍊",
    category: "Fruits",
    description: "Succulent, sweet organic round oranges bursting with vitamin C juice.",
    image: "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=200&q=80",
  },
  "grapes": {
    emoji: "🍇",
    category: "Fruits",
    description: "Plump, seedless sweet royal black grapes, freshly picked.",
    image: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=200&q=80",
  },

  // --- HARDWARE & ELECTRONICS ---
  "laptop": {
    emoji: "💻",
    category: "Electronics",
    description: "Dynamic development workstation with high display specs.",
    image: "https://images.unsplash.com/photo-1496181130204-7552cc14ac1a?auto=format&fit=crop&w=200&q=80",
  },
  "mouse": {
    emoji: "🖱️",
    category: "Electronics",
    description: "Ergonomic precision laser wireless pointing peripheral.",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=200&q=80",
  },
  "keyboard": {
    emoji: "⌨️",
    category: "Electronics",
    description: "Highly responsive customized mechanical typewriter keyboard.",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=200&q=80",
  },
  "webcam": {
    emoji: "📷",
    category: "Electronics",
    description: "High definition wide-aperture streaming video webcam.",
    image: "https://images.unsplash.com/photo-1603184017905-b4ee0961edf2?auto=format&fit=crop&w=200&q=80",
  },
  "monitor": {
    emoji: "🖥️",
    category: "Electronics",
    description: "Ultra-wide calibrated color-accurate desktop display.",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=200&q=80",
  },
  "headset": {
    emoji: "🎧",
    category: "Electronics",
    description: "Active noise-canceling stereo deep-bass headphones.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80",
  },
  "usb-c cable": {
    emoji: "🔌",
    category: "Accessories",
    description: "High-speed power and data transfer standard braided wire.",
    image: "https://images.unsplash.com/photo-1611532736597-9c60aa5d0e2e?auto=format&fit=crop&w=200&q=80",
  },
  "docking station": {
    emoji: "🎛️",
    category: "Accessories",
    description: "All-in-one multi-port workstation expansion dock.",
    image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=200&q=80",
  },
};

/**
 * Custom product mapper returning emoji, category, description, and high-res image.
 * Uses smart substring checking to capture custom brands or variants of core products automatically!
 */
export function getProductMetadata(item: string): ProductMeta {
  const normalized = item.trim().toLowerCase();

  // 1. Direct exact match first
  if (PRODUCT_METADATA_DATABASE[normalized]) {
    return PRODUCT_METADATA_DATABASE[normalized];
  }

  // 2. Substring matching for variants, flavors, or brands:
  // Biscuits variations
  if (normalized.includes("biscuit") || normalized.includes("cookie") || normalized.includes("oreo") || normalized.includes("parle") || normalized.includes("bourbon") || normalized.includes("chip")) {
    if (normalized.includes("oreo")) return PRODUCT_METADATA_DATABASE["oreo"];
    if (normalized.includes("parle")) return PRODUCT_METADATA_DATABASE["parle-g"];
    if (normalized.includes("bourbon")) return PRODUCT_METADATA_DATABASE["bourbon"];
    return PRODUCT_METADATA_DATABASE["cookies"];
  }

  // Milk variations
  if (normalized.includes("milk") || normalized.includes("dairy")) {
    if (normalized.includes("almond")) return PRODUCT_METADATA_DATABASE["almond milk"];
    if (normalized.includes("oat")) return PRODUCT_METADATA_DATABASE["oat milk"];
    if (normalized.includes("whole")) return PRODUCT_METADATA_DATABASE["whole milk"];
    return PRODUCT_METADATA_DATABASE["milk"];
  }

  // Bread variations
  if (normalized.includes("bread") || normalized.includes("toast") || normalized.includes("baguette") || normalized.includes("sourdough")) {
    if (normalized.includes("sourdough")) return PRODUCT_METADATA_DATABASE["sourdough"];
    if (normalized.includes("garlic")) return PRODUCT_METADATA_DATABASE["garlic bread"];
    return PRODUCT_METADATA_DATABASE["bread"];
  }

  // Jam variations
  if (normalized.includes("jam") || normalized.includes("jelly") || normalized.includes("preserve")) {
    if (normalized.includes("strawberry")) return PRODUCT_METADATA_DATABASE["strawberry jam"];
    if (normalized.includes("blueberry")) return PRODUCT_METADATA_DATABASE["blueberry jam"];
    return PRODUCT_METADATA_DATABASE["jam"];
  }

  // Rice and Grains variations
  if (normalized.includes("rice") || normalized.includes("grain")) {
    if (normalized.includes("basmati")) return PRODUCT_METADATA_DATABASE["basmati rice"];
    return PRODUCT_METADATA_DATABASE["rice"];
  }

  // Butter variations
  if (normalized.includes("butter")) {
    if (normalized.includes("peanut")) return PRODUCT_METADATA_DATABASE["peanut butter"];
    return PRODUCT_METADATA_DATABASE["butter"];
  }

  // Sugar variations
  if (normalized.includes("sugar")) {
    if (normalized.includes("brown")) return PRODUCT_METADATA_DATABASE["brown sugar"];
    return PRODUCT_METADATA_DATABASE["sugar"];
  }

  // Oil variations
  if (normalized.includes("oil")) {
    if (normalized.includes("olive")) return PRODUCT_METADATA_DATABASE["olive oil"];
    return PRODUCT_METADATA_DATABASE["oil"];
  }

  // Tea variations
  if (normalized.includes("tea")) {
    if (normalized.includes("green")) return PRODUCT_METADATA_DATABASE["green tea"];
    return PRODUCT_METADATA_DATABASE["tea"];
  }

  // Coffee variations
  if (normalized.includes("coffee") || normalized.includes("espresso") || normalized.includes("latte")) {
    if (normalized.includes("espresso")) return PRODUCT_METADATA_DATABASE["espresso"];
    if (normalized.includes("latte")) return PRODUCT_METADATA_DATABASE["latte"];
    return PRODUCT_METADATA_DATABASE["espresso"];
  }

  // Chocolates variations
  if (normalized.includes("chocolate") || normalized.includes("cacao") || normalized.includes("truffle")) {
    return PRODUCT_METADATA_DATABASE["chocolates"];
  }

  // Watermelon
  if (normalized.includes("melon")) {
    return PRODUCT_METADATA_DATABASE["watermelon"];
  }

  // Fresh Fruits
  if (normalized.includes("fruit") || normalized.includes("apple") || normalized.includes("banana") || normalized.includes("orange") || normalized.includes("grape")) {
    if (normalized.includes("apple")) return PRODUCT_METADATA_DATABASE["apple"];
    if (normalized.includes("banana")) return PRODUCT_METADATA_DATABASE["banana"];
    if (normalized.includes("orange")) return PRODUCT_METADATA_DATABASE["orange"];
    if (normalized.includes("grapes") || normalized.includes("grape")) return PRODUCT_METADATA_DATABASE["grapes"];
    return {
      emoji: "🍎",
      category: "Fruits",
      description: "Crispy freshly-sourced organic sweet orchard fruit.",
      image: "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&w=200&q=80",
    };
  }

  // Vegetables
  if (normalized.includes("veg") || normalized.includes("salad") || normalized.includes("potato") || normalized.includes("tomato") || normalized.includes("onion") || normalized.includes("coriander") || normalized.includes("ginger") || normalized.includes("garlic")) {
    if (normalized.includes("tomato")) return PRODUCT_METADATA_DATABASE["tomato"];
    if (normalized.includes("onion")) return PRODUCT_METADATA_DATABASE["onion"];
    if (normalized.includes("potato")) return PRODUCT_METADATA_DATABASE["potato"];
    if (normalized.includes("coriander") || normalized.includes("cilantro")) return PRODUCT_METADATA_DATABASE["coriander"];
    if (normalized.includes("ginger")) return PRODUCT_METADATA_DATABASE["ginger"];
    if (normalized.includes("garlic")) return PRODUCT_METADATA_DATABASE["garlic"];
    return {
      emoji: "🥗",
      category: "Vegetables",
      description: "Farm-fresh vibrant organic vegetable goodness.",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=200&q=80",
    };
  }

  // Fallbacks: Build a reliable aesthetic seed representation
  const emojis = ["🛍️", "🏷️", "📦", "🥫", "🥑", "🥨", "🍳", "🥤", "🍖", "🥦", "🥕", "🍕", "🍔", "🧁", "🍥"];
  const charSum = normalized.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const pickedEmoji = emojis[charSum % emojis.length];

  return {
    emoji: pickedEmoji,
    category: "Store item",
    description: `High-quality, freshly-stocked grocery product.`,
    image: `https://picsum.photos/seed/${encodeURIComponent(normalized)}/200/200`,
  };
}

/**
 * Returns a high-res custom product image URL using direct curated CDN photographs.
 * Retains compatibility with previous implementations.
 */
export function getProductImage(item: string): string {
  return getProductMetadata(item).image;
}

/**
 * Quick emoji exporter for product visualization.
 */
export function getProductEmoji(item: string): string {
  return getProductMetadata(item).emoji;
}
