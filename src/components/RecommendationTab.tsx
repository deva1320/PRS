/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  User,
  CloudSun,
  ShoppingBag,
  ArrowRight,
  TrendingUp,
  Utensils,
  ShoppingBasket,
  Shirt,
  Sparkles,
  Info,
  CalendarDays,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  BookOpen,
  ChefHat,
  Clock,
} from "lucide-react";
import { AssociationRule, SeasonalData, Itemset, MissingItemSuggestion } from "../types";
import { recommendProducts, findMissingHighlyLikelyItems } from "../lib/algorithms";
import { SEASONAL_RECOMMENDATIONS, getProductImage, getProductMetadata } from "../utils/presets";
import { recommendIngredientsForDish } from "../utils/recipes";
import { motion, AnimatePresence } from "motion/react";

interface RecommendationTabProps {
  transactions: string[][];
  availableItems: string[];
  aprioriRules: AssociationRule[];
  fpRules: AssociationRule[];
  aprioriItemsets: Itemset[];
  fpItemsets: Itemset[];
}

export default function RecommendationTab({
  transactions,
  availableItems,
  aprioriRules,
  fpRules,
  aprioriItemsets,
  fpItemsets,
}: RecommendationTabProps) {
  const [userName, setUserName] = useState("Jane Doe");
  const [selectedSeason, setSelectedSeason] = useState<"Summer" | "Winter" | "Rainy" | "Spring">("Summer");
  const [productsInput, setProductsInput] = useState("Bread, Milk");
  const [activeCart, setActiveCart] = useState<string[]>(["Bread", "Milk"]);

  // Recipe planner feature state
  const [dishInput, setDishInput] = useState("biryani");

  const matchedRecipeResult = useMemo(() => {
    if (!dishInput.trim()) return null;
    return recommendIngredientsForDish(dishInput, availableItems);
  }, [dishInput, availableItems]);

  const handleLoadRecipeIngredients = (itemsToLoad: string[]) => {
    const updatedCart = [...activeCart];
    itemsToLoad.forEach(item => {
      if (!updatedCart.some(i => i.toLowerCase().trim() === item.toLowerCase().trim())) {
        updatedCart.push(item);
      }
    });
    setActiveCart(updatedCart);
    setProductsInput(updatedCart.join(", "));
    
    // Automatically trigger recommendations simulation
    const aprioriRec = recommendProducts(updatedCart, aprioriRules);
    const fpRec = recommendProducts(updatedCart, fpRules);
    setComputedApriori(aprioriRec);
    setComputedFp(fpRec);
    
    const missing = findMissingHighlyLikelyItems(updatedCart, fpItemsets);
    setMissingSuggestions(missing);
    setHasGenerated(true);
  };

  // Set default recommendation logs state
  const [hasGenerated, setHasGenerated] = useState(false);
  const [computedApriori, setComputedApriori] = useState<{
    item: string;
    confidence: number;
    lift: number;
    ruleId: string;
    triggerRule: AssociationRule;
  }[]>([]);
  const [computedFp, setComputedFp] = useState<{
    item: string;
    confidence: number;
    lift: number;
    ruleId: string;
    triggerRule: AssociationRule;
  }[]>([]);
  const [missingSuggestions, setMissingSuggestions] = useState<MissingItemSuggestion[]>([]);

  // Keep live calculations in sync with cart additions/subtractions once recommended is unlocked
  useEffect(() => {
    if (hasGenerated) {
      const aprioriRec = recommendProducts(activeCart, aprioriRules);
      const fpRec = recommendProducts(activeCart, fpRules);

      setComputedApriori(aprioriRec);
      setComputedFp(fpRec);

      const missing = findMissingHighlyLikelyItems(activeCart, fpItemsets);
      setMissingSuggestions(missing);
    }
  }, [activeCart, aprioriRules, fpRules, fpItemsets, hasGenerated]);

  // Synchronize comma-separated text input with actual activeCart array
  useEffect(() => {
    const items = productsInput
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i.length > 0);
    
    // Low footprint check to prevent recursion/looping
    const itemsJoined = items.map((i) => i.toLowerCase()).sort().join(",");
    const activeCartJoined = activeCart.map((i) => i.toLowerCase()).sort().join(",");
    if (itemsJoined !== activeCartJoined) {
      setActiveCart(items);
    }
  }, [productsInput]);

  // Handle visual toggle clicks from the Available Items tray
  const handleItemToggleInCart = (item: string) => {
    let newCart: string[];
    if (activeCart.some((i) => i.trim().toLowerCase() === item.trim().toLowerCase())) {
      newCart = activeCart.filter((i) => i.trim().toLowerCase() !== item.trim().toLowerCase());
    } else {
      newCart = [...activeCart, item];
    }
    setActiveCart(newCart);
    setProductsInput(newCart.join(", "));
  };

  /**
   * Helper to instantly trigger the user's specific scenario:
   * "for example last i buyed rice, salt, chocolates, biscuits, milk, bread, jam, butter...
   * next same items but i forget to add jam, butter so it should recommend them"
   */
  const triggerUserDemoScenario = () => {
    setUserName("Dev Acharya");
    const demoCart = ["Rice", "Salt", "Chocolates", "Biscuits", "Milk", "Bread"];
    setActiveCart(demoCart);
    setProductsInput("Rice, Salt, Chocolates, Biscuits, Milk, Bread");

    // Compute recommendations on the spot using both models
    const aprioriRec = recommendProducts(demoCart, aprioriRules);
    const fpRec = recommendProducts(demoCart, fpRules);

    setComputedApriori(aprioriRec);
    setComputedFp(fpRec);

    const missing = findMissingHighlyLikelyItems(demoCart, fpItemsets);
    setMissingSuggestions(missing);

    setSelectedSeason("Winter"); // Autumn/Winter cozy vibe suits chocolates & biscuits
    setHasGenerated(true);
  };

  const handleGenerate = () => {
    // Run the matching engines
    const aprioriRec = recommendProducts(activeCart, aprioriRules);
    const fpRec = recommendProducts(activeCart, fpRules);

    setComputedApriori(aprioriRec);
    setComputedFp(fpRec);

    const missing = findMissingHighlyLikelyItems(activeCart, fpItemsets);
    setMissingSuggestions(missing);

    setHasGenerated(true);
  };

  const activeSeasonData: SeasonalData = SEASONAL_RECOMMENDATIONS[selectedSeason];

  return (
    <div id="recommendation-workspace" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* LEFT FORM COLUMN: PARAMS CONFIGURATION */}
      <div className="lg:col-span-4 space-y-6">

        {/* INTERACTIVE USER SCENARIO DIRECT LINK */}
        <div 
          id="user-scenario-banner" 
          className="bg-indigo-950 text-white rounded-2xl p-5 border border-indigo-800 shadow-lg relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 -mr-6 -mt-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-start gap-3">
            <span className="p-2 bg-indigo-800 rounded-xl text-amber-300 mt-0.5">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </span>
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase tracking-widest text-indigo-300">Quick Test Scenario</h4>
              <p className="text-sm font-bold text-white">"Forgot Jam or Butter?"</p>
              <p className="text-[11px] text-zinc-300 leading-normal">
                Test your specific case: Simulate purchasing your custom items <span className="font-mono text-amber-200">Rice, Salt, Chocolates, Biscuits, Milk, and Bread</span> and watch the models suggest <strong>Jam and Butter</strong> automatically!
              </p>
            </div>
          </div>
          <button
            onClick={triggerUserDemoScenario}
            className="w-full mt-4 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Run Test Scenario</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* RECIPE SUGGESTION CHECKLIST COMPONENT */}
        <div id="recipe-suggestion-planner" className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">Recipe Suggestion Checklist</h3>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] text-zinc-500 leading-normal">
              Select a target recipe below to see stocking checklists, acquired statuses, and missing items to complete your dish.
            </p>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              <button
                id="preset-btn-biryani"
                onClick={() => setDishInput("biryani")}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1 ${
                  dishInput.toLowerCase().includes("biry")
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-zinc-100 text-zinc-650 hover:bg-zinc-200"
                }`}
              >
                <span>🥘</span> Biryani
              </button>
              <button
                id="preset-btn-cake"
                onClick={() => setDishInput("cake")}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1 ${
                  dishInput.toLowerCase().includes("cake")
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-zinc-100 text-zinc-650 hover:bg-zinc-200"
                }`}
              >
                <span>🎂</span> Chocolate Cake
              </button>
              <button
                id="preset-btn-garlic"
                onClick={() => setDishInput("garlic bread")}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1 ${
                  dishInput.toLowerCase() === "garlic bread"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-zinc-100 text-zinc-650 hover:bg-zinc-200"
                }`}
              >
                <span>🧄</span> Garlic Bread
              </button>
              <button
                id="preset-btn-toast"
                onClick={() => setDishInput("sweet toast")}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1 ${
                  dishInput.toLowerCase().includes("toast")
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-zinc-100 text-zinc-650 hover:bg-zinc-200"
                }`}
              >
                <span>🥞</span> Sweet Toast
              </button>
              <button
                id="preset-btn-cafe"
                onClick={() => setDishInput("bistro coffee cookie")}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1 ${
                  dishInput.toLowerCase().includes("coffee") || dishInput.toLowerCase().includes("cookie") || dishInput.toLowerCase().includes("bistro")
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-zinc-100 text-zinc-650 hover:bg-zinc-200"
                }`}
              >
                <span>🍪</span> Cafe Special
              </button>
            </div>
            
            <div className="relative">
              <input
                id="dish-search-input"
                type="text"
                value={dishInput}
                onChange={(e) => setDishInput(e.target.value)}
                placeholder="Or seek custom recipe ingredients..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-800 font-medium"
              />
              <div className="absolute left-3 top-2.5 text-zinc-400">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Matched Recipe Result Display */}
          <AnimatePresence mode="wait">
            {matchedRecipeResult && (
              <motion.div
                key={matchedRecipeResult.recipe.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-3 pt-1"
              >
                <div id="recipe-suggestion-card" className="bg-zinc-50 border border-zinc-150 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                      {matchedRecipeResult.recipe.category}
                    </span>
                    <div className="flex items-center gap-2 text-zinc-550 text-[10px] font-mono">
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        {matchedRecipeResult.recipe.prepTime}
                      </span>
                      <span className={`font-bold ${
                        matchedRecipeResult.recipe.difficulty === "Easy" ? "text-emerald-600" :
                        matchedRecipeResult.recipe.difficulty === "Medium" ? "text-amber-600" : "text-rose-600"
                      }`}>
                        {matchedRecipeResult.recipe.difficulty}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-extrabold text-zinc-900 flex items-center gap-1.5">
                      <span className="text-sm">{matchedRecipeResult.recipe.emoji}</span>
                      {matchedRecipeResult.recipe.name}
                    </h4>
                    <p className="text-[10px] text-zinc-550 leading-relaxed italic mt-1">
                      {matchedRecipeResult.recipe.description}
                    </p>
                  </div>

                  {/* HIGH-RES INGREDIENT SOURCING SHOWCASE */}
                  <div className="space-y-1.5 pt-0.5">
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-indigo-650 block">
                      🛒 Sourcing Visualizer (Tap to Add/Remove)
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {matchedRecipeResult.storeMatches.map(m => {
                        const imgUrl = getProductImage(m.matchedItem);
                        const isInCart = activeCart.some(c => c.toLowerCase() === m.matchedItem.toLowerCase());
                        return (
                          <div 
                            key={m.matchedItem} 
                            onClick={() => handleItemToggleInCart(m.matchedItem)}
                            className={`relative overflow-hidden rounded-xl border transition-all h-[64px] group cursor-pointer active:scale-95 ${
                              isInCart 
                                ? "border-emerald-500 shadow-xs shadow-emerald-500/10 ring-2 ring-emerald-500/10" 
                                : "border-zinc-200/80 bg-white hover:border-zinc-350"
                            }`}
                          >
                            <img 
                              src={imgUrl} 
                              alt={m.matchedItem} 
                              referrerPolicy="no-referrer"
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-zinc-950/40 to-transparent flex flex-col justify-end p-1.5">
                              <span className="text-[9px] font-black text-white truncate flex items-center gap-0.5">
                                <span className="text-[11px] shrink-0 leading-none">{m.emoji}</span>
                                <span className="truncate leading-none font-bold">{m.matchedItem}</span>
                              </span>
                              <div className="flex justify-between items-center mt-0.5 leading-none">
                                <span className="text-[7px] text-zinc-300 truncate max-w-[65%] font-medium">{m.details}</span>
                                {isInCart ? (
                                  <span className="text-[7.5px] font-black text-emerald-400">In Cart</span>
                                ) : (
                                  <span className="text-[7.5px] font-bold text-amber-400">Missing</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  {(() => {
                    const totalStocked = matchedRecipeResult.storeMatches.length;
                    const acquiredCount = matchedRecipeResult.storeMatches.filter(m => activeCart.some(c => c.toLowerCase() === m.matchedItem.toLowerCase())).length;
                    const percentAcquired = totalStocked > 0 ? Math.round((acquiredCount / totalStocked) * 100) : 0;
                    return (
                      <div className="space-y-1 bg-white/70 border border-zinc-100 p-2 rounded-lg">
                        <div className="flex justify-between text-[9px] text-zinc-500 font-bold">
                          <span>Ingredients Acquired</span>
                          <span className="font-mono text-indigo-600">{acquiredCount} / {totalStocked} ({percentAcquired}%)</span>
                        </div>
                        <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-555 h-full transition-all duration-300" 
                            style={{ width: `${percentAcquired}%`, backgroundColor: "#10b981" }}
                          />
                        </div>
                      </div>
                    );
                  })()}

                  {/* Checklist Elements */}
                  <div className="space-y-2">
                    {/* Missing Checklist Section */}
                    {(() => {
                      const missingItems = matchedRecipeResult.storeMatches.filter(
                        m => !activeCart.some(c => c.toLowerCase() === m.matchedItem.toLowerCase())
                      );
                      
                      return (
                        <div className="space-y-1.5">
                          <div className="text-[9px] uppercase tracking-wider font-extrabold text-amber-655 flex items-center justify-between" style={{ color: "#d97706" }}>
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full inline-block animate-pulse"></span>
                              Missing ingredients Checklist ({missingItems.length})
                            </span>
                            {missingItems.length > 0 && (
                              <button
                                onClick={() => handleLoadRecipeIngredients(missingItems.map(m => m.matchedItem))}
                                className="text-[8px] bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded font-bold cursor-pointer transition-colors"
                              >
                                Add All Missing
                              </button>
                            )}
                          </div>
                          
                          {missingItems.length === 0 ? (
                            <div className="bg-emerald-50 border border-dashed border-emerald-150 p-2 text-center rounded-lg">
                              <span className="text-[9px] uppercase tracking-wide text-emerald-700 font-extrabold">🎉 All stocked ingredients are in your basket!</span>
                            </div>
                          ) : (
                            <div className="space-y-1 max-h-[160px] overflow-y-auto pr-1">
                              {missingItems.map((m) => (
                                <div 
                                  key={m.matchedItem}
                                  onClick={() => handleItemToggleInCart(m.matchedItem)}
                                  className="flex items-center gap-2.5 p-1.5 bg-white hover:bg-zinc-50 border border-zinc-150 rounded-lg cursor-pointer transition-all group active:scale-[0.99]"
                                >
                                  <input
                                    type="checkbox"
                                    checked={false}
                                    onChange={() => {}} // handled by click container
                                    className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 border-zinc-300 cursor-pointer"
                                  />
                                  <div className="flex items-center gap-1 px-1 py-0.5 rounded bg-amber-50 text-amber-800 text-[9px] font-bold">
                                    <span>{m.emoji}</span>
                                    <span>{m.matchedItem}</span>
                                  </div>
                                  <span className="text-[10px] text-zinc-500 truncate flex-1">{m.details}</span>
                                  <span className="text-[8px] opacity-0 group-hover:opacity-100 transition-opacity font-bold text-indigo-600">Add to basket</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Acquired in Cart Section */}
                    {(() => {
                      const inCartItems = matchedRecipeResult.storeMatches.filter(
                        m => activeCart.some(c => c.toLowerCase() === m.matchedItem.toLowerCase())
                      );
                      
                      if (inCartItems.length === 0) return null;
                      
                      return (
                        <div className="space-y-1.5 pt-1.5 border-t border-zinc-150/50">
                          <div className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-700 flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block"></span>
                              In basket ({inCartItems.length})
                            </span>
                          </div>
                          
                          <div className="space-y-1 max-h-[120px] overflow-y-auto pr-1 opacity-90">
                            {inCartItems.map((m) => (
                              <div 
                                key={m.matchedItem}
                                onClick={() => handleItemToggleInCart(m.matchedItem)}
                                className="flex items-center justify-between p-1.5 bg-emerald-50/20 hover:bg-emerald-50/60 border border-emerald-100/60 rounded-lg cursor-pointer transition-all group"
                              >
                                <div className="flex items-center gap-2.5">
                                  <input
                                    type="checkbox"
                                    checked={true}
                                    onChange={() => {}} // handled by click container
                                    className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 border-emerald-300 cursor-pointer"
                                  />
                                  <span className="text-xs line-through text-zinc-400 flex items-center gap-1">
                                    <span>{m.emoji}</span>
                                    <span className="font-bold text-zinc-650">{m.matchedItem}</span>
                                  </span>
                                  <span className="text-[9px] text-zinc-400 font-normal">({m.details})</span>
                                </div>
                                <span className="text-[8px] text-zinc-400 group-hover:text-rose-600 group-hover:font-bold transition-all pr-1">Remove</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Non-stocked Culinary notes */}
                    {matchedRecipeResult.missingFromInventory.length > 0 && (
                      <div className="space-y-1 pt-1.5 border-t border-zinc-150/50">
                        <div className="text-[9px] uppercase tracking-wider font-extrabold text-zinc-400">
                          Non-Catalogued Culinary Extras
                        </div>
                        <div className="grid grid-cols-2 gap-1 pb-1">
                          {matchedRecipeResult.missingFromInventory.map((m) => (
                            <div key={m.originalName} className="flex items-center gap-1 border border-dashed border-zinc-200 p-1 px-1.5 rounded-lg text-[9px] text-zinc-500 bg-zinc-50/50" title={m.details}>
                              <span className="text-[10px]">{m.emoji}</span>
                              <span className="truncate">{m.originalName}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CHECKOUT SIMULATOR SETTINGS */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-1 border-b border-zinc-100">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">Cart Simulator</h3>
          </div>

          {/* User Name input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-400" />
              Customer Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g. Jane Doe..."
              className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-800 font-medium"
            />
          </div>

          {/* Select Season dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
              <CloudSun className="w-3.5 h-3.5 text-zinc-400" />
              Select Season context
            </label>
            <div className="relative">
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-800 font-medium appearance-none cursor-pointer"
              >
                <option value="Summer">☀️ Summer</option>
                <option value="Winter">❄️ Winter</option>
                <option value="Rainy">🌧️ Rainy</option>
                <option value="Spring">🌸 Spring</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-zinc-500">
                <CalendarDays className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Products Comma Separated textbox */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 flex items-center justify-between">
              <span>Checkout Basket (Comma Separated)</span>
              <span className="text-[10px] text-zinc-400 font-mono">Count: {activeCart.length}</span>
            </label>
            <input
              type="text"
              value={productsInput}
              onChange={(e) => setProductsInput(e.target.value)}
              placeholder="e.g. Milk, Bread"
              className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-zinc-800 font-mono"
            />
          </div>

          {/* Graphical Quick Item Toggler */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Quick Catalog Selection</div>
            <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto border border-zinc-100 p-2 rounded-xl bg-zinc-50/50 pr-1">
              {availableItems.length === 0 ? (
                <div className="text-[10px] text-zinc-400 py-1 text-center col-span-2">Empty catalog inventory</div>
              ) : (
                availableItems.map((item) => {
                  const isInCart = activeCart.some((i) => i.trim().toLowerCase() === item.trim().toLowerCase());
                  const imgUrl = getProductImage(item);
                  const meta = getProductMetadata(item);
                  return (
                    <button
                      key={item}
                      onClick={() => handleItemToggleInCart(item)}
                      className={`flex items-center gap-2 p-1.5 rounded-xl border text-left cursor-pointer transition-all ${
                        isInCart
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-white text-zinc-700 border-zinc-200/80 hover:bg-zinc-50 hover:border-zinc-300"
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={item}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-lg object-cover bg-zinc-100 flex-shrink-0"
                      />
                      <div className="leading-tight truncate flex-1 min-w-0">
                        <div className="text-[11px] font-bold truncate">
                          <span className="mr-1 text-xs">{meta.emoji}</span>
                          {item}
                        </div>
                        <div className={`text-[9px] ${isInCart ? "text-indigo-200" : "text-zinc-400"} truncate`}>
                          {isInCart ? "Selected" : meta.category}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* CTA: RECOMMEND */}
          <button
            onClick={handleGenerate}
            disabled={activeCart.length === 0}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs py-3 rounded-xl shadow-xs transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            Generate Recommendation
          </button>
        </div>
      </div>

      {/* RIGHT REPORT COLUMN: VISUAL RECOMMENDATIONS */}
      <div className="lg:col-span-8">
        <AnimatePresence mode="wait">
          {!hasGenerated ? (
            <div className="min-h-[460px] bg-white rounded-2xl border border-zinc-200/80 shadow-xs flex flex-col items-center justify-center text-center p-8">
              <ShoppingBasket className="w-16 h-16 text-zinc-300 mb-4" />
              <h4 className="text-sm font-bold text-zinc-800">Visual Recommendation Workspace</h4>
              <p className="text-xs text-zinc-400 max-w-sm mt-1.5 leading-relaxed">
                Add products into the shopping basket manually, or press <strong className="text-indigo-600">Run Test Scenario</strong> above to simulate forgetting Jam & Butter and view direct product recomendations instantly!
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Personal Welcome Banner */}
              <div id="welcome-alert" className="bg-gradient-to-r from-indigo-100/60 via-indigo-50/40 to-emerald-50/30 rounded-2xl p-5 border border-indigo-150 flex items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest font-mono">Simulating Client Experience</div>
                  <h4 className="text-base font-extrabold text-zinc-900 mt-0.5">Welcome back, {userName}!</h4>
                  <p className="text-xs text-zinc-500 mt-1">
                    Your shopping cart is monitored by live Apriori and FP-Growth pattern miners.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-2xl shadow-xs border border-indigo-100 text-center flex-shrink-0">
                  <div className="text-[10px] text-zinc-400 font-medium">Inside Checkout Cart</div>
                  <div className="text-sm font-extrabold text-indigo-700 font-mono mt-0.5">{activeCart.length} item{activeCart.length > 1 ? "s" : ""}</div>
                </div>
              </div>

              {/* CURRENT BASKET ITEMS VISUAL GRID */}
              <div id="active-basket-preview" className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs">
                <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
                  Products in Active Basket
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {activeCart.map((item, idx) => {
                    const imgUrl = getProductImage(item);
                    const meta = getProductMetadata(item);
                    return (
                      <div 
                        key={`${item}-${idx}`} 
                        className="bg-zinc-50 rounded-xl p-2.5 border border-zinc-200/60 flex flex-col items-center text-center space-y-1.5"
                      >
                        <img 
                          src={imgUrl} 
                          alt={item} 
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-lg object-cover bg-zinc-200 shadow-2xs"
                        />
                        <span className="text-[11px] font-bold text-zinc-900 truncate w-full px-0.5">
                          <span className="mr-1">{meta.emoji}</span>
                          {item}
                        </span>
                        <span className="text-[9px] text-zinc-400 font-mono">{meta.category}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FORGOT SOMETHING? PATTERN-BASED MISSING ITEMS IDENTIFIED */}
              <div id="missing-items-workspace" className="relative group overflow-hidden bg-gradient-to-br from-amber-50/70 via-rose-50/30 to-emerald-50/30 border border-amber-200/70 rounded-2xl p-5 shadow-sm transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-200/20 transition-all duration-300" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-amber-200/40 gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                    </span>
                    <div>
                      <h4 className="text-xs font-black text-amber-955 tracking-widest uppercase flex items-center gap-1.5">
                        🔍 Omission Scanner • Frequently Bought Together
                      </h4>
                      <p className="text-[10px] text-amber-800 font-medium mt-0.5">Mined pattern matches absent from your basket</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-amber-100/80 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full font-black self-start sm:self-auto">
                    {missingSuggestions.length > 0 ? `${missingSuggestions.length} Omission${missingSuggestions.length > 1 ? "s" : ""} Caught` : "Active Live Scan"}
                  </span>
                </div>

                {missingSuggestions.length === 0 ? (
                  <div className="py-8 px-4 text-center text-zinc-505 text-xs flex flex-col items-center justify-center gap-2 min-h-[140px]">
                    <div className="p-3 bg-amber-100/40 rounded-full text-amber-600 animate-pulse border border-amber-150">
                      <ShoppingBasket className="w-5 h-5" />
                    </div>
                    <span className="font-extrabold text-zinc-800">Your basket looks highly complete!</span>
                    <p className="text-[10px] text-zinc-400 max-w-md leading-relaxed">
                      Our live association engine hasn't detected any standard omitted pairs. <br />
                      Try clicking <span className="text-indigo-600 font-bold bg-indigo-50/80 px-1 py-0.5 rounded">Run Test Scenario</span> above or add items like <span className="text-amber-800 font-bold">Tomato</span>, <span className="text-amber-800 font-bold">Apple</span>, or <span className="text-amber-800 font-bold">Bread</span> to trigger predictive recipe/staple omissions!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 pt-3">
                    <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                      Based on transactional basket histories, customers buying elements of your active cart also checkout with the following items. We highly suggest adding them to save an extra trip:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {missingSuggestions.slice(0, 4).map((suggestion) => {
                        const imgUrl = getProductImage(suggestion.item);
                        const bestMatch = suggestion.matchingItemsets[0];
                        const meta = getProductMetadata(suggestion.item);
                        const isProduce = meta.category === "Fruits" || meta.category === "Vegetables";

                        return (
                          <div 
                            key={suggestion.item} 
                            style={{ contentVisibility: "auto" }}
                            className="bg-white/90 border border-amber-100 hover:border-amber-300 rounded-xl p-3 flex items-center justify-between gap-3.5 transition-all hover:shadow-xs relative group/card"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="relative overflow-hidden w-12 h-12 rounded-lg flex-shrink-0 bg-amber-100">
                                <img
                                  src={imgUrl}
                                  alt={suggestion.item}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                                />
                                <span className="absolute bottom-0 right-0 bg-white/90 px-0.5 py-0.2 rounded-tl text-[10px]">
                                  {meta.emoji}
                                </span>
                              </div>
                              <div className="leading-tight min-w-0">
                                <span className={isProduce ? "text-[8px] tracking-wider uppercase font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded" : "text-[8px] tracking-wider uppercase font-extrabold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded"}>
                                  {isProduce ? "🥗 Fresh Produce" : "🥛 Pantry Staple"}
                                </span>
                                <span className="text-xs font-black text-zinc-950 block mt-1 truncate">
                                  {suggestion.item}
                                </span>
                                <span className="text-[10px] text-zinc-500 block truncate mt-0.5 font-medium">
                                  {meta.description}
                                </span>
                                <span className="text-[9px] text-indigo-650 font-semibold block mt-1 font-mono">
                                  Frequently paired with: {bestMatch.items.filter(x => x.toLowerCase() !== suggestion.item.toLowerCase()).slice(0, 2).join(", ")}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleItemToggleInCart(suggestion.item)}
                              className="bg-zinc-900 border border-zinc-950 hover:bg-indigo-650 hover:border-indigo-700 active:scale-95 text-white font-extrabold text-[10px] px-3.5 py-2.5 rounded-xl transition-all duration-150 flex items-center gap-1 cursor-pointer flex-shrink-0 shadow-2xs"
                            >
                              Add +
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* APRIORI vs FP-GROWTH RECOMMENDATIONS SIDE BY SIDE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Apriori Recommendations card */}
                <div id="apriori-rec-card" className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-4">
                      <h4 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider">Apriori Outcomes</h4>
                      <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                        Candidate scan
                      </span>
                    </div>

                    {computedApriori.length === 0 ? (
                      <div className="py-8 text-center text-zinc-400 text-xs flex flex-col items-center justify-center gap-1.5 bg-zinc-50/30 rounded-xl border border-zinc-100">
                        <AlertCircle className="w-5 h-5 text-zinc-300" />
                        <span>No Recommendations Found</span>
                        <span className="text-[10px] text-zinc-400 max-w-[200px]">No rules met thresholds. Use "Run Test Scenario" above to see matching outcomes!</span>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                        {computedApriori.map((rec) => {
                          const imgUrl = getProductImage(rec.item);
                          const meta = getProductMetadata(rec.item);
                          return (
                            <div 
                              key={rec.item} 
                              className="flex items-center justify-between p-2.5 bg-zinc-50/50 hover:bg-zinc-50 border border-zinc-200/80 rounded-xl transition-all"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={imgUrl}
                                  alt={rec.item}
                                  referrerPolicy="no-referrer"
                                  className="w-10 h-10 rounded-lg object-cover bg-zinc-100 flex-shrink-0"
                                />
                                <div className="leading-tight truncate min-w-0">
                                  <span className="text-xs font-bold text-zinc-955 block">
                                    <span className="mr-1">{meta.emoji}</span>
                                    {rec.item}
                                  </span>
                                  <span className="text-[10px] text-zinc-400 block truncate">{meta.description}</span>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <div className="text-[9px] font-mono text-zinc-400">
                                  Conf: {(rec.confidence * 100).toFixed(0)}%
                                </div>
                                <span className="inline-block mt-0.5 text-[9px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded">
                                  Lift: {rec.lift.toFixed(1)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div className="pt-3 border-t border-dashed border-zinc-100 mt-4 text-[10px] text-zinc-400">
                    Based on {aprioriRules.length} mined association parameters
                  </div>
                </div>

                {/* FP-Growth Recommendations card */}
                <div id="fp-rec-card" className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-4">
                      <h4 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider">FP-Growth Outcomes</h4>
                      <span className="text-[10px] font-mono bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-bold">
                        FP-Tree Projection
                      </span>
                    </div>

                    {computedFp.length === 0 ? (
                      <div className="py-8 text-center text-zinc-400 text-xs flex flex-col items-center justify-center gap-1.5 bg-zinc-50/30 rounded-xl border border-zinc-100">
                        <AlertCircle className="w-5 h-5 text-zinc-300" />
                        <span>No Recommendations Found</span>
                        <span className="text-[10px] text-zinc-400 max-w-[200px]">No tree projection patterns met limits. Try the "Run Test Scenario" helper!</span>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                        {computedFp.map((rec) => {
                          const imgUrl = getProductImage(rec.item);
                          const meta = getProductMetadata(rec.item);
                          return (
                            <div 
                              key={rec.item} 
                              className="flex items-center justify-between p-2.5 bg-zinc-50/50 hover:bg-zinc-50 border border-zinc-200/80 rounded-xl transition-all"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={imgUrl}
                                  alt={rec.item}
                                  referrerPolicy="no-referrer"
                                  className="w-10 h-10 rounded-lg object-cover bg-zinc-100 flex-shrink-0"
                                />
                                <div className="leading-tight truncate min-w-0">
                                  <span className="text-xs font-bold text-zinc-950 block">
                                    <span className="mr-1">{meta.emoji}</span>
                                    {rec.item}
                                  </span>
                                  <span className="text-[10px] text-zinc-400 block truncate">{meta.description}</span>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <div className="text-[9px] font-mono text-zinc-400">
                                  Conf: {(rec.confidence * 100).toFixed(0)}%
                                </div>
                                <span className="inline-block mt-0.5 text-[9px] font-bold bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded">
                                  Lift: {rec.lift.toFixed(1)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div className="pt-3 border-t border-dashed border-zinc-100 mt-4 text-[10px] text-zinc-400">
                    Based on {fpRules.length} conditional tree paths
                  </div>
                </div>
              </div>

              {/* SEASONAL RECOMMENDATIONS GRID WITH IMAGES */}
              <div id="seasonal-rec-box" className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs">
                <div className="flex items-center gap-2 pb-2.5 border-b border-zinc-100 mb-4">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-black text-zinc-900 uppercase tracking-widest">
                    Seasonal Recommendations for {selectedSeason}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Category 1: Food */}
                  <div className="p-3 bg-orange-50/40 border border-orange-100 rounded-xl flex items-center gap-3.5">
                    <img
                      src={getProductImage(activeSeasonData.Food)}
                      alt={activeSeasonData.Food}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover bg-orange-100 shadow-2xs"
                    />
                    <div>
                      <div className="text-[10px] uppercase font-bold text-orange-500 tracking-wider">
                        <span className="mr-1">{getProductMetadata(activeSeasonData.Food).emoji}</span>
                        Food Context
                      </div>
                      <div className="text-sm font-extrabold text-zinc-900 mt-0.5">{activeSeasonData.Food}</div>
                    </div>
                  </div>

                  {/* Category 2: Grocery */}
                  <div className="p-3 bg-emerald-50/40 border border-emerald-100 rounded-xl flex items-center gap-3.5">
                    <img
                      src={getProductImage(activeSeasonData.Grocery)}
                      alt={activeSeasonData.Grocery}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover bg-emerald-100 shadow-2xs"
                    />
                    <div>
                      <div className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">
                        <span className="mr-1">{getProductMetadata(activeSeasonData.Grocery).emoji}</span>
                        Grocery Context
                      </div>
                      <div className="text-sm font-extrabold text-zinc-900 mt-0.5">{activeSeasonData.Grocery}</div>
                    </div>
                  </div>

                  {/* Category 3: Clothing */}
                  <div className="p-3 bg-indigo-50/40 border border-indigo-100 rounded-xl flex items-center gap-3.5">
                    <img
                      src={getProductImage(activeSeasonData.Clothing)}
                      alt={activeSeasonData.Clothing}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover bg-indigo-100 shadow-2xs"
                    />
                    <div>
                      <div className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider">
                        <span className="mr-1">{getProductMetadata(activeSeasonData.Clothing).emoji}</span>
                        Clothing Context
                      </div>
                      <div className="text-sm font-extrabold text-zinc-900 mt-0.5">{activeSeasonData.Clothing}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* REPORT SUMMARY CARD */}
              <div id="analytics-record-summary" className="bg-zinc-50 border border-zinc-200 p-5 rounded-2xl">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 uppercase tracking-widest mb-3.5">
                  <FileSpreadsheet className="w-4 h-4 text-zinc-500" />
                  Simulation Report Summary
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 text-xs text-zinc-600">
                  <div>
                    <span className="text-zinc-400 font-medium block">Simulated User Profile:</span>
                    <strong className="text-zinc-800 font-semibold">{userName}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-400 font-medium block">Checkout Cart items:</span>
                    <strong className="text-zinc-800 font-semibold">{activeCart.join(", ") || "None"}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-400 font-medium block">Active Weather / Seasonal context:</span>
                    <strong className="text-zinc-855 font-bold text-indigo-700">{selectedSeason} Pattern</strong>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
