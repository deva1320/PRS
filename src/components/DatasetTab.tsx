/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Plus, Trash2, RotateCcw, Sparkles, CheckSquare, PlusCircle } from "lucide-react";
import { TransactionPreset } from "../types";
import { DATASET_PRESETS, getProductImage, getProductMetadata } from "../utils/presets";
import { motion } from "motion/react";

interface DatasetTabProps {
  currentPreset: TransactionPreset;
  onPresetChange: (preset: TransactionPreset) => void;
  transactions: string[][];
  setTransactions: React.Dispatch<React.SetStateAction<string[][]>>;
  availableItems: string[];
  setAvailableItems: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function DatasetTab({
  currentPreset,
  onPresetChange,
  transactions,
  setTransactions,
  availableItems,
  setAvailableItems,
}: DatasetTabProps) {
  const [newItemInput, setNewItemInput] = useState("");
  const [selectedTxItems, setSelectedTxItems] = useState<Record<string, boolean>>({});

  // Add a brand new item to the inventory of the active set
  const handleAddItemToInventory = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = newItemInput.trim();
    if (!formatted) return;

    // Check if duplicate (case insensitive)
    const exists = availableItems.some((i) => i.toLowerCase() === formatted.toLowerCase());
    if (exists) {
      alert(`"${formatted}" is already in the product inventory.`);
      return;
    }

    setAvailableItems((prev) => [...prev, formatted].sort());
    setNewItemInput("");
  };

  // Toggle item selection during direct "Add Transaction" wizard
  const toggleTxItemSelect = (item: string) => {
    setSelectedTxItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  // Add the composed transaction to the store
  const handleAddTransaction = () => {
    const chosen = Object.entries(selectedTxItems)
      .filter(([_, isChecked]) => isChecked)
      .map(([item]) => item);

    if (chosen.length === 0) {
      alert("Please select at least one item to form a transaction.");
      return;
    }

    setTransactions((prev) => [chosen, ...prev]);
    // Reset selections
    setSelectedTxItems({});
  };

  // Remove a transaction from the active dataset
  const handleDeleteTransaction = (index: number) => {
    setTransactions((prev) => prev.filter((_, i) => i !== index));
  };

  // Reset to current preset defaults
  const handleResetToPreset = () => {
    setTransactions(currentPreset.transactions);
    setAvailableItems(currentPreset.items);
    setSelectedTxItems({});
  };

  return (
    <div id="dataset-tab-container" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT COLUMN: PRESETS & PRODUCT INVENTORY */}
      <div className="lg:col-span-1 space-y-6">
        {/* Dataset selector preset */}
        <div id="dataset-presets-widget" className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">Select Preset Store</h3>
          </div>
          <div className="space-y-3">
            {DATASET_PRESETS.map((p) => {
              const isActive = p.id === currentPreset.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onPresetChange(p)}
                   className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-indigo-50/60 border-indigo-200 ring-2 ring-indigo-500/25"
                      : "bg-zinc-50/50 border-zinc-200/70 hover:bg-zinc-50 hover:border-zinc-300"
                  }`}
                >
                  <div className="font-semibold text-zinc-900 text-sm">{p.name}</div>
                  <div className="text-xs text-zinc-500 mt-1 leading-relaxed">{p.description}</div>
                  <div className="flex gap-2 mt-2.5 text-[10px] font-mono text-zinc-400">
                    <span>{p.items.length} items available</span>
                    <span>•</span>
                    <span>{p.transactions.length} orders log</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Inventory Administration */}
        <div id="product-inventory-widget" className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">Store Catalog</h3>
            <span className="text-xs font-mono bg-zinc-100 text-zinc-650 px-2 py-0.5 rounded-md">
              Total: {availableItems.length}
            </span>
          </div>

          {/* Add custom product form */}
          <form onSubmit={handleAddItemToInventory} className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="e.g. Avocado, Soda..."
              value={newItemInput}
              onChange={(e) => setNewItemInput(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs text-zinc-805 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg cursor-pointer transition-colors duration-200 flex items-center justify-center-shrink-0"
              title="Add product to inventory"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>

          {/* Visual product inventory tag list */}
          <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
            {availableItems.map((item) => {
              const imgUrl = getProductImage(item);
              const meta = getProductMetadata(item);
              return (
                <div
                  key={item}
                  className="flex items-center gap-2 p-1.5 bg-zinc-50 border border-zinc-150 rounded-xl hover:border-zinc-300 transition-colors cursor-help"
                  title={`${meta.category}: ${meta.description}`}
                >
                  <img
                    src={imgUrl}
                    alt={item}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-md object-cover bg-zinc-100 flex-shrink-0 border border-zinc-100"
                  />
                  <div className="leading-tight truncate flex-1">
                    <span className="text-[11px] font-bold text-zinc-800 block truncate">
                      <span className="mr-1 text-xs">{meta.emoji}</span>
                      {item}
                    </span>
                    <span className="text-[9px] text-zinc-400 font-normal block truncate">{meta.category}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MIDDLE & RIGHT COMBINED COLUMN: TRANSACTION MANAGER & WIZARD */}
      <div className="lg:col-span-2 space-y-6">
        {/* Form to log a transaction */}
        <div id="create-transaction-card" className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-emerald-650" />
              <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">Log Custom Handout</h3>
            </div>
            <button
              onClick={handleResetToPreset}
              className="text-xs text-indigo-600 hover:text-indigo-850 flex items-center gap-1 cursor-pointer font-bold"
              title="Reset default preset values"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Database
            </button>
          </div>

          <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
            Form a customer basket by ticking products below. This custom basket will instantly feed into the Apriori
            and FP-Growth algorithms to recalculate frequent itemsets and recommended pathways.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4 max-h-[190px] overflow-y-auto border border-zinc-100 p-2 rounded-xl bg-zinc-50/30 pr-1">
            {availableItems.map((item) => {
              const isSelected = !!selectedTxItems[item];
              const imgUrl = getProductImage(item);
              const meta = getProductMetadata(item);
              return (
                <button
                  key={item}
                  onClick={() => toggleTxItemSelect(item)}
                  className={`p-1.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-bold shadow-2xs animate-fade-in"
                      : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300"
                  }`}
                  title={`${meta.category}: ${meta.description}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    readOnly
                    className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500/20 pointer-events-none w-3 h-3 flex-shrink-0"
                  />
                  <img
                    src={imgUrl}
                    alt={item}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-md object-cover bg-zinc-100 flex-shrink-0 border border-zinc-100"
                  />
                  <div className="leading-none truncate flex-1 min-w-0">
                    <span className="text-[11px] truncate block font-bold text-zinc-800">
                      <span className="mr-1 text-xs">{meta.emoji}</span>
                      {item}
                    </span>
                    <span className="text-[9px] font-normal text-zinc-400 block truncate mt-0.5">{meta.category}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAddTransaction}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow-xs transition-all duration-200 flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              Record Checkout
            </button>
          </div>
        </div>

        {/* Transaction History table list */}
        <div id="transactions-list-card" className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">
                Active Transactions Database
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">Showing compiled database records used in model mining</p>
            </div>
            <span className="text-xs font-mono font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100">
              Total Records: {transactions.length}
            </span>
          </div>

          <div className="overflow-x-auto max-h-[300px] border border-zinc-100 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100 text-zinc-400 font-semibold font-mono text-[10px] uppercase tracking-wider">
                  <th className="py-2.5 px-4 w-12 text-center">ID</th>
                  <th className="py-2.5 px-4">Customer Basket Items (with images)</th>
                  <th className="py-2.5 px-4 w-16 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs text-zinc-700">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-zinc-400">
                      Empty Database. Log some transactions or select a preset to begin.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx, idx) => (
                    <motion.tr
                      key={`${idx}-${tx.join("-")}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-zinc-50/50 group"
                    >
                      <td className="py-2.5 px-4 font-mono text-zinc-400 text-center">{transactions.length - idx}</td>
                      <td className="py-2.5 px-4">
                        <div className="flex flex-wrap gap-2">
                          {tx.map((item, i) => {
                            const imgUrl = getProductImage(item);
                            const meta = getProductMetadata(item);
                            return (
                              <span
                                key={`${item}-${i}`}
                                className="inline-flex items-center gap-1.5 bg-indigo-50/45 text-indigo-900 border border-indigo-100 px-2 py-1 rounded-lg text-[10px] font-semibold hover:border-indigo-200 transition-colors cursor-help"
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
                      <td className="py-2.5 px-4 text-center">
                        <button
                          onClick={() => handleDeleteTransaction(idx)}
                          className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-md hover:bg-rose-50 cursor-pointer transition-colors"
                          title="Delete transaction record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
