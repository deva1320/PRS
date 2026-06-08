/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TransactionPreset {
  id: string;
  name: string;
  description: string;
  items: string[];
  transactions: string[][];
}

export interface Itemset {
  items: string[];
  support: number;
  count: number;
}

export interface AssociationRule {
  id: string;
  antecedents: string[];
  consequents: string[];
  support: number;
  confidence: number;
  lift: number;
}

export interface SeasonalData {
  Food: string;
  Grocery: string;
  Clothing: string;
}

export interface MissingItemSuggestion {
  item: string;
  score: number;
  matchingItemsets: {
    items: string[];
    count: number;
    support: number;
    matchRatio: number;
    missingItems: string[];
  }[];
}

export interface SeasonPresets {
  Summer: SeasonalData;
  Winter: SeasonalData;
  Rainy: SeasonalData;
  Spring: SeasonalData;
}
