/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import {
  ShoppingBasket,
  Sliders,
  Database,
  BarChart3,
  HelpCircle,
} from "lucide-react";
import { DATASET_PRESETS } from "./utils/presets";
import { runApriori, runFPGrowth, generateRules } from "./lib/algorithms";
import RecommendationTab from "./components/RecommendationTab";
import ExplorerTab from "./components/ExplorerTab";
import DatasetTab from "./components/DatasetTab";

export default function App() {
  const [currentPreset, setCurrentPreset] = useState(DATASET_PRESETS[0]);
  const [transactions, setTransactions] = useState<string[][]>(DATASET_PRESETS[0].transactions);
  const [availableItems, setAvailableItems] = useState<string[]>(DATASET_PRESETS[0].items);

  // Mining thresholds state
  const [minSupport, setMinSupport] = useState(0.20); // 20% default support (matching Streamlit code)
  const [minConfidence, setMinConfidence] = useState(0.50); // 50% default confidence (matching Streamlit)

  // Current sub-navigation tab inside the dashboard (maintain a single viewport profile)
  const [activeTab, setActiveTab] = useState<"recommend" | "explorer" | "dataset">("recommend");

  // Reset/switch preset database helper
  const handlePresetChange = (preset: typeof DATASET_PRESETS[0]) => {
    setCurrentPreset(preset);
    setTransactions(preset.transactions);
    setAvailableItems(preset.items);
  };

  // RE-COMPUTE APRIORI FREQUENT ITEMSETS AND RULES ON EVERY SLIDER / DATABASE CHANGE (Instantly reactive!)
  const aprioriItemsets = useMemo(() => {
    return runApriori(transactions, minSupport);
  }, [transactions, minSupport]);

  const aprioriRules = useMemo(() => {
    return generateRules(aprioriItemsets, transactions.length, minConfidence);
  }, [aprioriItemsets, transactions.length, minConfidence]);

  // RE-COMPUTE FP-GROWTH FREQUENT ITEMSETS AND RULES
  const fpItemsets = useMemo(() => {
    return runFPGrowth(transactions, minSupport);
  }, [transactions, minSupport]);

  const fpRules = useMemo(() => {
    return generateRules(fpItemsets, transactions.length, minConfidence);
  }, [fpItemsets, transactions.length, minConfidence]);

  return (
    <div id="application-root-container" className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-indigo-600 selection:text-white pb-12">
      {/* GLAMOUR FLOATING TOP NAV BAR */}
      <header className="border-b border-zinc-200/80 bg-white sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-600/10">
              <ShoppingBasket className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black text-zinc-950 tracking-tight flex items-center gap-2">
                Product Recommendation System
              </h1>
              <p className="text-xs text-zinc-500 font-medium">Frequent Pattern Mining Analytics — Apriori + FP-Growth</p>
            </div>
          </div>

          {/* Quick Segment Controls */}
          <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200">
            <button
              onClick={() => setActiveTab("recommend")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all duration-150 ${
                activeTab === "recommend"
                  ? "bg-white text-zinc-950 shadow-xs border border-zinc-200/60"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              <ShoppingBasket className="w-3.5 h-3.5" />
              Recommendations
            </button>
            <button
              onClick={() => setActiveTab("explorer")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all duration-150 ${
                activeTab === "explorer"
                  ? "bg-white text-zinc-950 shadow-xs border border-zinc-200/60"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Mining Explorer
            </button>
            <button
              onClick={() => setActiveTab("dataset")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all duration-150 ${
                activeTab === "dataset"
                  ? "bg-white text-zinc-950 shadow-xs border border-zinc-200/60"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              Dataset Settings
            </button>
          </div>
        </div>
      </header>

      {/* METRICS HUB OVERLAY BOARD */}
      <section className="bg-white border-b border-zinc-200/65 py-5 px-4 sm:px-6 lg:px-8 shadow-[0_1px_2px_0_rgba(10,10,12,0.02)]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-zinc-50/50 rounded-xl border border-zinc-150/80">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Store Database</span>
            <strong className="text-sm font-bold text-zinc-900 mt-0.5 block truncate">{currentPreset.name}</strong>
          </div>
          <div className="p-3 bg-zinc-50/50 rounded-xl border border-zinc-150/80">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Total Transactions</span>
            <strong className="text-sm font-bold text-zinc-900 mt-0.5 block font-mono">{transactions.length} lists</strong>
          </div>
          <div className="p-3 bg-zinc-50/50 rounded-xl border border-zinc-150/80">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Frequent Patterns (Sets)</span>
            <strong className="text-sm font-bold text-indigo-700 mt-0.5 block font-mono">{aprioriItemsets.length} mined</strong>
          </div>
          <div className="p-3 bg-zinc-50/50 rounded-xl border border-zinc-150/80">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Association Rules</span>
            <strong className="text-sm font-bold text-teal-700 mt-0.5 block font-mono">{aprioriRules.length} pathways</strong>
          </div>
        </div>
      </section>

      {/* MAIN VIEWPORT FRAMEWORK */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {activeTab === "recommend" && (
          <RecommendationTab
            transactions={transactions}
            availableItems={availableItems}
            aprioriRules={aprioriRules}
            fpRules={fpRules}
            aprioriItemsets={aprioriItemsets}
            fpItemsets={fpItemsets}
          />
        )}

        {activeTab === "explorer" && (
          <ExplorerTab
            minSupport={minSupport}
            setMinSupport={setMinSupport}
            minConfidence={minConfidence}
            setMinConfidence={setMinConfidence}
            aprioriItemsets={aprioriItemsets}
            fpItemsets={fpItemsets}
            aprioriRules={aprioriRules}
            fpRules={fpRules}
            transactionCount={transactions.length}
          />
        )}

        {activeTab === "dataset" && (
          <DatasetTab
            currentPreset={currentPreset}
            onPresetChange={handlePresetChange}
            transactions={transactions}
            setTransactions={setTransactions}
            availableItems={availableItems}
            setAvailableItems={setAvailableItems}
          />
        )}

        {/* EDUCATIONAL COMPASS FOR USERS */}
        <div id="educational-compass-card" className="bg-indigo-900/5 text-indigo-950 border border-indigo-200/50 p-6 rounded-2xl mt-10">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <h4 className="text-sm font-black uppercase tracking-wider">How Frequent Pattern Mining Recommends</h4>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed max-w-4xl">
            Frequent Pattern Mining helps stores match products purchased together.
            When a customer adds <strong className="text-indigo-900">Bread</strong> to their cart, our engines identify rules like <code className="bg-white/80 border border-zinc-100 p-0.5 px-1 rounded text-indigo-600">{"{Bread} → {Butter}"}</code> that met the minimum thresholds. It then suggests <strong>Butter</strong>. 
            Because <strong>FP-Growth</strong> mines using a conditional prefix Tree instead of creating candidates level-by-level, it scales to larger datasets faster than <strong>Apriori</strong>, but produces identical patterns.
          </p>
        </div>
      </main>

      {/* COMPLIANT SYSTEM FOOTER */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-5 border-t border-zinc-200 text-center space-y-1">
        <p className="text-xs text-zinc-400 font-medium">
          Product Recommendation System Using Frequent Pattern Mining Analytics
        </p>
        <p className="text-[10px] text-zinc-400 font-mono">
          Powered by React 19, Tailwind CSS v4, and Lucide Vectors
        </p>
      </footer>
    </div>
  );
}
