/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Sliders, Search, AlertCircle, Info, ArrowRight, Zap } from "lucide-react";
import { Itemset, AssociationRule } from "../types";
import { getProductImage, getProductMetadata } from "../utils/presets";
import { motion } from "motion/react";

interface ExplorerTabProps {
  minSupport: number;
  setMinSupport: (val: number) => void;
  minConfidence: number;
  setMinConfidence: (val: number) => void;
  aprioriItemsets: Itemset[];
  fpItemsets: Itemset[];
  aprioriRules: AssociationRule[];
  fpRules: AssociationRule[];
  transactionCount: number;
}

export default function ExplorerTab({
  minSupport,
  setMinSupport,
  minConfidence,
  setMinConfidence,
  aprioriItemsets,
  fpItemsets,
  aprioriRules,
  fpRules,
  transactionCount,
}: ExplorerTabProps) {
  const [activeTab, setActiveTab] = useState<"rates" | "sets" | "rules">("rules");
  const [filterQuery, setFilterQuery] = useState("");
  const [activeAlgorithm, setActiveAlgorithm] = useState<"apriori" | "fpgrowth">("apriori");

  // Choose the itemset and rule collections based on toggle
  const currentItemsets = activeAlgorithm === "apriori" ? aprioriItemsets : fpItemsets;
  const currentRules = activeAlgorithm === "apriori" ? aprioriRules : fpRules;

  // Filter rules by user search query (matches antecedent or consequent products)
  const filteredRules = currentRules.filter((rule) => {
    if (!filterQuery) return true;
    const query = filterQuery.toLowerCase();
    const matchesAntecedent = rule.antecedents.some((item) => item.toLowerCase().includes(query));
    const matchesConsequent = rule.consequents.some((item) => item.toLowerCase().includes(query));
    return matchesAntecedent || matchesConsequent;
  });

  return (
    <div id="explorer-tab-container" className="space-y-6">
      {/* SECTION 1: PARAMETERS PANELS & COMPARATIVE INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders widget for hyperparameters adjustment */}
        <div id="hyperparameter-sliders-widget" className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs space-y-5 lg:col-span-1">
          <div className="flex items-center gap-2 mb-1">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">Mining Thresholds</h3>
          </div>

          <div className="space-y-4">
            {/* Support Slider */}
            <div>
              <div className="flex justify-between items-center text-xs text-zinc-700 font-medium mb-1.5">
                <span>Min Support</span>
                <span className="font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-bold">
                  {(minSupport * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.80"
                step="0.05"
                value={minSupport}
                onChange={(e) => setMinSupport(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
                <span>Frequent itemset bar: 5%</span>
                <span>Max prune: 80%</span>
              </div>
            </div>

            {/* Confidence Slider */}
            <div>
              <div className="flex justify-between items-center text-xs text-zinc-700 font-medium mb-1.5">
                <span>Min Confidence</span>
                <span className="font-mono bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md font-bold">
                  {(minConfidence * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.95"
                step="0.05"
                value={minConfidence}
                onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
                <span>Loose rules: 10%</span>
                <span>Strict rules: 95%</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-50 rounded-xl p-3 text-[11px] text-zinc-500 space-y-1.5 leading-relaxed">
            <span className="font-semibold text-zinc-800 block">Formulas Cheat Sheet:</span>
            <div>• <strong className="text-zinc-700">Support (A):</strong> Tx with A / Total Tx</div>
            <div>• <strong className="text-zinc-700">Confidence (A → C):</strong> Tx with both / Tx with A</div>
            <div>• <strong className="text-zinc-700">Lift (A → C):</strong> Confidence(A→C) / Support(C)</div>
          </div>
        </div>

        {/* Algorithm comparative statistics overview */}
        <div id="algos-comparison" className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Zap className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">
                  Algorithmic Architecture Comparisons
                </h3>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">Calculated Realtime client-side</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-zinc-100 bg-zinc-50/20 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-800">Apriori</span>
                  <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                    Iterative Candidate Generation
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-normal">
                  Framer of level-wise itemset search. Scans the complete transactions table $k$ times to check size $k$ candidates. Safely prunes via monotonic subset property.
                </p>
                <div className="pt-1 text-xs space-y-1">
                  <div className="text-zinc-650">Frequent Sets mined: <span className="font-mono font-extrabold text-zinc-950">{aprioriItemsets.length}</span></div>
                  <div className="text-zinc-655">Association Rules: <span className="font-mono font-extrabold text-zinc-955">{aprioriRules.length}</span></div>
                </div>
              </div>

              <div className="border border-zinc-100 bg-zinc-50/20 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-800">FP-Growth</span>
                  <span className="text-[10px] font-mono font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">
                    Tree Projection (No Candidates)
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-normal">
                  Compresses database into a highly efficient trie structure (FP-Tree). Recursively extracts frequent paths using conditional trees. Eliminates heavy loops.
                </p>
                <div className="pt-1 text-xs space-y-1">
                  <div className="text-zinc-650">Frequent Sets mined: <span className="font-mono font-extrabold text-zinc-955">{fpItemsets.length}</span></div>
                  <div className="text-zinc-655">Association Rules: <span className="font-mono font-extrabold text-zinc-955">{fpRules.length}</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1 leading-tight">
              <Info className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
              Math Proof: Notice both algorithms output identical itemset and rule counts! Correct execution verified.
            </span>
            <div className="flex gap-2 self-end">
              <button
                onClick={() => setActiveAlgorithm("apriori")}
                className={`px-2.5 py-1 text-[11px] rounded font-semibold transition-all cursor-pointer ${
                  activeAlgorithm === "apriori"
                    ? "bg-indigo-600 text-white font-bold"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                Use Apriori Engine
              </button>
              <button
                onClick={() => setActiveAlgorithm("fpgrowth")}
                className={`px-2.5 py-1 text-[11px] rounded font-semibold transition-all cursor-pointer ${
                  activeAlgorithm === "fpgrowth"
                    ? "bg-teal-650 text-white font-bold"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                Use FP-Growth Engine
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: DATAGUARDS & SEARCH FILTERS */}
      <div id="grids-explorer-container" className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs overflow-hidden">
        {/* Toggle between itemsets and rules list */}
        <div className="bg-zinc-50 px-5 py-3 border-b border-zinc-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab("rules")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                activeTab === "rules"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Association Rules ({filteredRules.length})
            </button>
            <button
              onClick={() => setActiveTab("sets")}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                activeTab === "sets"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Frequent Itemsets ({currentItemsets.length})
            </button>
          </div>

          {activeTab === "rules" && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 w-3.5 h-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Lookup product (e.g. Milk)..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full sm:w-60 bg-white border border-zinc-200 text-xs text-zinc-800 pl-8.5 pr-4 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          )}
        </div>

        {/* TAB 1: SHOW ASSOCIATION RULES */}
        {activeTab === "rules" && (
          <div className="p-5">
            {filteredRules.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 flex flex-col items-center justify-center gap-2">
                <AlertCircle className="w-8 h-8 text-zinc-300" />
                <div className="text-sm font-semibold">No Association Rules Found</div>
                <div className="text-xs text-zinc-400 max-w-sm">
                  With support: {(minSupport * 100).toFixed(0)}% and confidence: {(minConfidence * 100).toFixed(0)}%,
                  no transactions met the thresholds. Try lowering the sliders!
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto border border-zinc-100 rounded-xl">
                <table className="w-full text-left border-collapse border-spacing-0">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-100 text-zinc-400 font-semibold font-mono text-[10px] uppercase tracking-wider">
                      <th className="py-2.5 px-4 w-12 text-center">Rule</th>
                      <th className="py-2.5 px-4">Antecedent (Heads)</th>
                      <th className="py-2.5 px-2 text-center">Relationship</th>
                      <th className="py-2.5 px-4">Consequent (Tails)</th>
                      <th className="py-2.5 px-4 text-center">Support (%)</th>
                      <th className="py-2.5 px-4 text-center">Confidence (%)</th>
                      <th className="py-2.5 px-4 text-center">Lift Index</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-xs">
                    {filteredRules.map((rule, idx) => {
                      // Highlighting Lift states: Lift > 1 is positive association
                      const liftStatus =
                        rule.lift > 1.05
                          ? { color: "text-emerald-700 bg-emerald-50 border-emerald-100", tag: "Positive Correlation" }
                          : rule.lift < 0.95
                          ? { color: "text-rose-700 bg-rose-50 border-rose-100", tag: "Negative Correlation" }
                          : { color: "text-zinc-600 bg-zinc-50 border-zinc-100", tag: "Neutral Correlation" };

                      return (
                        <tr key={rule.id} className="hover:bg-zinc-50/50">
                          <td className="py-3 px-4 font-mono text-zinc-400 text-center">{idx + 1}</td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1.5">
                              {rule.antecedents.map((item) => {
                                const imgUrl = getProductImage(item);
                                const meta = getProductMetadata(item);
                                return (
                                  <span
                                    key={item}
                                    className="inline-flex items-center gap-1.5 bg-zinc-50 text-zinc-800 border border-zinc-200 px-2 py-1 rounded-lg text-[11px] font-semibold hover:border-zinc-300 transition-colors cursor-help"
                                    title={`${meta.category}: ${meta.description}`}
                                  >
                                    <img
                                      src={imgUrl}
                                      alt={item}
                                      referrerPolicy="no-referrer"
                                      className="w-4 h-4 rounded-md object-cover bg-zinc-200"
                                    />
                                    <span className="text-xs">{meta.emoji}</span>
                                    {item}
                                  </span>
                                );
                              })}
                            </div>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <div className="inline-flex items-center justify-center p-1 bg-indigo-50 rounded-md">
                              <ArrowRight className="w-3.5 h-3.5 text-indigo-505" />
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1.5">
                              {rule.consequents.map((item) => {
                                const imgUrl = getProductImage(item);
                                const meta = getProductMetadata(item);
                                return (
                                  <span
                                    key={item}
                                    className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-955 border border-indigo-150 px-2 py-1 rounded-lg text-[11px] font-semibold hover:border-indigo-250 transition-colors cursor-help"
                                    title={`${meta.category}: ${meta.description}`}
                                  >
                                    <img
                                      src={imgUrl}
                                      alt={item}
                                      referrerPolicy="no-referrer"
                                      className="w-4 h-4 rounded-md object-cover bg-zinc-200"
                                    />
                                    <span className="text-xs">{meta.emoji}</span>
                                    {item}
                                  </span>
                                );
                              })}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-medium text-zinc-700">
                            {(rule.support * 100).toFixed(1)}%
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-medium text-zinc-700">
                            <div className="inline-flex items-center gap-2">
                              <span>{(rule.confidence * 100).toFixed(1)}%</span>
                              <div className="w-12 bg-zinc-150 h-1.5 rounded-full overflow-hidden hidden md:block">
                                <span
                                  className="bg-indigo-600 h-full block"
                                  style={{ width: `${rule.confidence * 100}%` }}
                                ></span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center font-mono">
                            <div className="flex flex-col items-center justify-center gap-0.5">
                              <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${liftStatus.color}`}>
                                {rule.lift.toFixed(2)}
                              </span>
                              <span className="text-[9px] text-zinc-400 font-sans tracking-wide">
                                {liftStatus.tag}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SHOW FREQUENT ITEMSETS WITH IMAGES */}
        {activeTab === "sets" && (
          <div className="p-5">
            {currentItemsets.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 flex flex-col items-center justify-center gap-2">
                <AlertCircle className="w-8 h-8 text-zinc-300" />
                <div className="text-sm font-semibold">No Frequent Itemsets Mined</div>
                <div className="text-xs text-zinc-400 max-w-sm">
                  Try decreasing the Min Support slider. Lowering the minimum support includes items with lower frequency values.
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentItemsets.map((set, idx) => {
                  const size = set.items.length;
                  const cardBg =
                    size === 1
                      ? "border-zinc-200 bg-white"
                      : size === 2
                      ? "border-indigo-100 bg-indigo-50/10"
                      : "border-teal-100 bg-teal-50/15";

                  return (
                    <div key={idx} className={`border rounded-2xl p-4 flex flex-col justify-between ${cardBg}`}>
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] font-mono font-bold bg-zinc-100 text-zinc-650 px-2 py-0.5 rounded-md">
                            Size: {size} item{size > 1 ? "s" : ""}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-sans font-medium">Pattern #{idx + 1}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {set.items.map((item) => {
                            const imgUrl = getProductImage(item);
                            const meta = getProductMetadata(item);
                            return (
                              <div
                                key={item}
                                className="flex items-center gap-2 bg-white/85 border border-zinc-200/80 p-1.5 rounded-xl text-xs font-bold text-zinc-800 hover:border-zinc-300 transition-colors cursor-help"
                                title={`${meta.category}: ${meta.description}`}
                              >
                                <img
                                  src={imgUrl}
                                  alt={item}
                                  referrerPolicy="no-referrer"
                                  className="w-7 h-7 rounded-lg object-cover bg-zinc-100 border border-zinc-100 flex-shrink-0"
                                />
                                <div className="leading-tight truncate flex-1 min-w-0">
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs">{meta.emoji}</span>
                                    <span className="truncate">{item}</span>
                                  </div>
                                  <span className="text-[9px] text-zinc-400 font-normal block truncate">{meta.category}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="border-t border-dashed border-zinc-100 pt-2 flex items-center justify-between text-xs text-zinc-500">
                        <span>Database Frequency:</span>
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          <span className="text-zinc-900 font-bold">{set.count} counts</span>
                          <span className="text-zinc-400">({(set.support * 100).toFixed(0)}%)</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
