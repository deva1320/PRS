/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Recipe {
  id: string;
  name: string;
  emoji: string;
  category: string;
  description: string;
  // Ingredients requested for this recipe. We specify standard names,
  // and our utility will map them to the closest match in the store's availableItems.
  ingredients: {
    name: string;
    required: boolean;
    emoji: string;
    details: string;
  }[];
  prepTime: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export const RECIPE_DATABASE: Recipe[] = [
  {
    id: "biryani",
    name: "Classic Basmati Biryani",
    emoji: "🥘",
    category: "Indian Delicacy",
    description: "An aromatic, slow-cooked royal rice dish filled with fragrant spices, visual saffron layers, herbs, and pristine rich taste.",
    prepTime: "45 mins",
    difficulty: "Medium",
    ingredients: [
      { name: "Rice", required: true, emoji: "🌾", details: "Aromatic Basmati long grains" },
      { name: "Chicken", required: true, emoji: "🍗", details: "Tender boneless chicken breast pieces" },
      { name: "Garam Masala", required: true, emoji: "🌶️", details: "Aromatic ground wholes spices mix" },
      { name: "Chilli Powder", required: true, emoji: "🌶️", details: "Spicy & vibrant Kashmiri red powder" },
      { name: "Yogurt", required: true, emoji: "🥛", details: "Thick creamy yogurt marination base" },
      { name: "Oil", required: true, emoji: "🫗", details: "For sautéing core whole spices" },
      { name: "Salt", required: true, emoji: "🧂", details: "Classic seasoning for rice boiling" },
      { name: "Onion", required: true, emoji: "🧅", details: "Caramelized crisp red onion layers" },
      { name: "Tomato", required: false, emoji: "🍅", details: "Tangy base thick gravy tomatoes" },
      { name: "Ginger", required: false, emoji: "🫚", details: "Warm pungent aromatic ginger root paste" },
      { name: "Garlic", required: false, emoji: "🧄", details: "Freshly pressed intense garlic cloves" },
      { name: "Coriander", required: false, emoji: "🌿", details: "Fresh chopped coriander leaves garnish" },
      { name: "Saffron", required: false, emoji: "🌸", details: "Kashmiri saffron filaments for golden hue" },
      { name: "Turmeric", required: false, emoji: "🟫", details: "Earthy antiseptic yellow spice powder" },
      { name: "Cardamom", required: false, emoji: "🟢", details: "Cardamom pods to flavor grain steam" }
    ]
  },
  {
    id: "salad",
    name: "Fresh Farm Garden Salad",
    emoji: "🥗",
    category: "Healthy Vegetables",
    description: "A super refreshing, vitamin-rich bowl of crisp garden vegetables, raw onions, and boiled potatoes spiced with savory herbs and light oil dressing.",
    prepTime: "10 mins",
    difficulty: "Easy",
    ingredients: [
      { name: "Tomato", required: true, emoji: "🍅", details: "Diced fresh vine tomatoes" },
      { name: "Onion", required: true, emoji: "🧅", details: "Sliced sweet red onions for crisp bite" },
      { name: "Potato", required: false, emoji: "🥔", details: "Boiled cubed golden potatoes" },
      { name: "Coriander", required: true, emoji: "🌿", details: "Finely chopped fresh coriander leaves" },
      { name: "Salt", required: true, emoji: "🧂", details: "Seasoning pinch to bring out raw vegetable juices" },
      { name: "Oil", required: false, emoji: "🫗", details: "Extra virgin healthy garnish oil drizzle" }
    ]
  },
  {
    id: "fruit_medley",
    name: "Fresh Orchard Fruit Medley",
    emoji: "🍇",
    category: "Healthy Fruits",
    description: "A loaded, refreshing organic sweet fruit bowl containing sliced apples, sun-ripened yellow bananas, citrus oranges, and sweet grapes.",
    prepTime: "10 mins",
    difficulty: "Easy",
    ingredients: [
      { name: "Apple", required: true, emoji: "🍎", details: "Thinly sliced sweet orchard Galla apples" },
      { name: "Banana", required: true, emoji: "🍌", details: "Sliced sweet ripe bananas" },
      { name: "Orange", required: true, emoji: "🍊", details: "Zesty healthy citrus orange segments" },
      { name: "Grapes", required: false, emoji: "🍇", details: "Plump seedless sweet grapes" },
      { name: "Sugar", required: false, emoji: "🍬", details: "Light organic sugar glaze sprinkle" }
    ]
  },
  {
    id: "cake",
    name: "Sweet Chocolate Cream Cake",
    emoji: "🎂",
    category: "Dessert / Baking",
    description: "A rich, moist sponge cake with velvety whipped butter cream and luxury dark chocolate shavings.",
    prepTime: "30 mins",
    difficulty: "Medium",
    ingredients: [
      { name: "Sugar", required: true, emoji: "🍬", details: "Granulated sugar for sweet baking fluff" },
      { name: "Butter", required: true, emoji: "🧈", details: "Creamy butter for rich crumb moisture" },
      { name: "Milk", required: true, emoji: "🥛", details: "Fresh whole milk to enrich batter" },
      { name: "Egg", required: true, emoji: "🥚", details: "Fluffy bakes binder and rising agent" },
      { name: "Cocoa Powder", required: true, emoji: "🍫", details: "Rich Dutch-processed dark cocoa taste" },
      { name: "Baking Powder", required: true, emoji: "🥫", details: "Leavener for a soft rise and crumb" },
      { name: "Chocolates", required: false, emoji: "🍫", details: "Artisanal dark chips for dynamic layers" }
    ]
  },
  {
    id: "garlic_bread",
    name: "Artisanal Herb Garlic Bread",
    emoji: "🧄",
    category: "Bakery / Italian",
    description: "Cripsy golden oven-toasted sourdough baguettes, generously spread with melted creamy herb butter and warm roasted garlic.",
    prepTime: "15 mins",
    difficulty: "Easy",
    ingredients: [
      { name: "Bread", required: true, emoji: "🍞", details: "Fresh farm sliced bread or country baguette" },
      { name: "Butter", required: true, emoji: "🧈", details: "Rich creamy butter whipped with garlic" },
      { name: "Salt", required: false, emoji: "🧂", details: "Fine sea salt to awaken herb flavors" },
      { name: "Oil", required: false, emoji: "🫗", details: "Extra virgin olive oil splash for optimal crispy baking" }
    ]
  },
  {
    id: "sweet_toast_feast",
    name: "Cozy Breakfast Sweet Toast",
    emoji: "🥞",
    category: "Morning Special",
    description: "Warm golden brown toast spread beautifully with wholesome pasture butter and sweet traditional mixed-berry fruit jams.",
    prepTime: "5 mins",
    difficulty: "Easy",
    ingredients: [
      { name: "Bread", required: true, emoji: "🍞", details: "Artisanal sliced bread toasted crisp" },
      { name: "Butter", required: true, emoji: "🧈", details: "Spreadable cream butter base" },
      { name: "Jam", required: true, emoji: "🏺", details: "Fruity mixed berry or strawberry sweet jam conserve" },
      { name: "Milk", required: false, emoji: "🥛", details: "Warm pasteurized dairy beverage to pair" }
    ]
  },
  {
    id: "bistro_coffee_cookie",
    name: "Afternoon High-Tea Bistro Trio",
    emoji: "🍪",
    category: "Café Comforts",
    description: "A calming warm beverage (latte, tea, or intense espresso) paired with flaky, buttery croissants and sweet chocolate baked cookies.",
    prepTime: "8 mins",
    difficulty: "Easy",
    ingredients: [
      { name: "Espresso", required: true, emoji: "☕️", details: "Double shot robust high-pressure brew" },
      { name: "Latte", required: false, emoji: "☕️", details: "Creamy steamed milk latte alternative" },
      { name: "Croissant", required: true, emoji: "🥐", details: "Flaky golden baked crescent" },
      { name: "Cookie", required: true, emoji: "🍪", details: "Crunchy brown butter chocolate chip cookies" },
      { name: "Tea", required: false, emoji: "🍵", details: "Rich green tea or black tea alternative option" },
      { name: "Muffin", required: false, emoji: "🧁", details: "Moist sweet blueberry baking treat" }
    ]
  },
  {
    id: "hardware_workstation",
    name: "Developer Workspace Pack",
    emoji: "💻",
    category: "Hardware Setup",
    description: "The ideal ergonomic gear setup to facilitate productive development: responsive keyboard, high spec laptop, and calibrated monitor.",
    prepTime: "20 mins",
    difficulty: "Hard",
    ingredients: [
      { name: "Laptop", required: true, emoji: "💻", details: "High display specifications workstation core" },
      { name: "Mouse", required: true, emoji: "🖱️", details: "Ergonomic precision wireless laser pointer" },
      { name: "Keyboard", required: true, emoji: "⌨️", details: "Responsive mechanical clicks layout" },
      { name: "Monitor", required: false, emoji: "🖥️", details: "Calibrated high resolutions visual expansion" },
      { name: "USB-C Cable", required: false, emoji: "🔌", details: "Braided high-speed data & power wire charging" }
    ]
  }
];

export interface MatchedIngredients {
  recipe: Recipe;
  // Items that are actually present in the current inventory catalog
  storeMatches: {
    originalName: string; // Name in recipe
    matchedItem: string;  // Closest item name found in current store availableItems
    emoji: string;
    required: boolean;
    details: string;
  }[];
  // Items in the recipe that are NOT in the current store catalogue (virtual recommendations)
  missingFromInventory: {
    originalName: string;
    emoji: string;
    required: boolean;
    details: string;
  }[];
}

/**
 * Normalizes item names for rigorous matching comparison.
 */
function normalize(val: string): string {
  return val.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Searches the RECIPE_DATABASE for a dish matching the input string, or dynamically construct one.
 */
export function recommendIngredientsForDish(dishName: string, availableItems: string[]): MatchedIngredients {
  const normInput = normalize(dishName);
  
  // 1. Look for a pre-defined recipe match
  let foundRecipe = RECIPE_DATABASE.find(r => 
    normalize(r.name).includes(normInput) || 
    normInput.includes(normalize(r.name)) ||
    normalize(r.id).includes(normInput) ||
    normalize(r.category).includes(normInput)
  );

  // Special aliases: "biriyani" -> "biryani"
  if (!foundRecipe && (normInput.includes("biriyani") || normInput.includes("biri") || normInput.includes("biry"))) {
    foundRecipe = RECIPE_DATABASE.find(r => r.id === "biryani");
  }

  // Special aliases for cake
  if (!foundRecipe && (normInput.includes("cake") || normInput.includes("bake") || normInput.includes("pastry") || normInput.includes("muffin") || normInput.includes("pudding"))) {
    foundRecipe = RECIPE_DATABASE.find(r => r.id === "cake");
  }

  // 2. If no pre-defined recipe, dynamically build an intelligent recipe list from current inventory items!
  if (!foundRecipe) {
    const matchedTokens: string[] = [];
    const lowerInput = dishName.toLowerCase();
    
    // Attempt to parse out items matching from inventory
    const inventoryMatches = availableItems.filter(item => {
      const lowerItem = item.toLowerCase();
      // e.g. "milk" in "curd rice and milk"
      return lowerInput.includes(lowerItem) || lowerItem.includes(lowerInput);
    });

    const ingredientsList = [];
    
    // Add explicitly matched inventory tokens
    inventoryMatches.forEach(item => {
      ingredientsList.push({
        name: item,
        required: true,
        emoji: "🥫",
        details: "Direct store match for your typed recipe request"
      });
    });

    // Make sure we have at least standard defaults for random dishes
    if (ingredientsList.length === 0) {
      // Dynamic fallbacks based on dish name descriptors
      if (lowerInput.includes("juice") || lowerInput.includes("shake") || lowerInput.includes("smoothie") || lowerInput.includes("drink")) {
        ingredientsList.push(
          { name: "Milk", required: true, emoji: "🥛", details: "Creamy liquid base" },
          { name: "Sugar", required: true, emoji: "🍬", details: "To sweeten the blend" },
          { name: "Chocolates", required: false, emoji: "🍫", details: "Decadent topping flavor" }
        );
      } else if (lowerInput.includes("rice") || lowerInput.includes("pulao") || lowerInput.includes("khichdi")) {
        ingredientsList.push(
          { name: "Rice", required: true, emoji: "🌾", details: "Long grain pantry standard grain" },
          { name: "Salt", required: true, emoji: "🧂", details: "Salty cooking seasoning" },
          { name: "Oil", required: true, emoji: "🫗", details: "Sauté oil standard" }
        );
      } else if (lowerInput.includes("sandwich") || lowerInput.includes("burger") || lowerInput.includes("toast")) {
        ingredientsList.push(
          { name: "Bread", required: true, emoji: "🍞", details: "Fresh sliced sandwich bread" },
          { name: "Butter", required: true, emoji: "🧈", details: "Spreadable savory baseline" },
          { name: "Jam", required: false, emoji: "🏺", details: "Sweet visual preserve addon" }
        );
      } else if (lowerInput.includes("tea") || lowerInput.includes("coffee") || lowerInput.includes("brew")) {
        ingredientsList.push(
          { name: "Tea", required: true, emoji: "🍵", details: "Herbal refreshing brew leaves" },
          { name: "Milk", required: false, emoji: "🥛", details: "Creamy addition options" },
          { name: "Sugar", required: false, emoji: "🍬", details: "Crystals to sweeten drinks" }
        );
      } else {
        // Broad default shopping list
        ingredientsList.push(
          { name: "Oil", required: true, emoji: "🫗", details: "Core cooking lipid medium" },
          { name: "Salt", required: true, emoji: "🧂", details: "The staple flavor enhancer" },
          { name: "Rice", required: false, emoji: "🌾", details: "Wholesome carbohydrate grain" },
          { name: "Butter", required: false, emoji: "🧈", details: "Cream richness infusion option" }
        );
      }
    }

    foundRecipe = {
      id: `custom_${Date.now()}`,
      name: dishName.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      emoji: lowerInput.includes("biry") || lowerInput.includes("rice") ? "🥘" : "🍽️",
      category: "Personalized Request",
      description: `Delicious custom recipe created specifically for "${dishName}". We mapped matched ingredients to ingredients stocked in this catalog.`,
      prepTime: "25 mins",
      difficulty: "Medium",
      ingredients: ingredientsList
    };
  }

  // 3. Align recipe ingredients to actual catalog availableItems
  const storeMatches: MatchedIngredients["storeMatches"] = [];
  const missingFromInventory: MatchedIngredients["missingFromInventory"] = [];

  foundRecipe.ingredients.forEach(ing => {
    // Look for similarity in availableItems
    let matchedItem = availableItems.find(item => 
      normalize(item).includes(normalize(ing.name)) || 
      normalize(ing.name).includes(normalize(item))
    );

    // Hard fallback mappings to prevent naming issues
    if (!matchedItem && normalize(ing.name) === "cookie") {
      matchedItem = availableItems.find(item => normalize(item).includes("cookie") || normalize(item).includes("biscuit"));
    }

    if (matchedItem) {
      storeMatches.push({
        originalName: ing.name,
        matchedItem,
        emoji: ing.emoji,
        required: ing.required,
        details: ing.details
      });
    } else {
      missingFromInventory.push({
        originalName: ing.name,
        emoji: ing.emoji,
        required: ing.required,
        details: ing.details
      });
    }
  });

  return {
    recipe: foundRecipe,
    storeMatches,
    missingFromInventory
  };
}
