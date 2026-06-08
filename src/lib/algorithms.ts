/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Itemset, AssociationRule, MissingItemSuggestion } from "../types";

/**
 * Utility functions for subset generation
 */
function getSubsets<T>(array: T[]): T[][] {
  const result: T[][] = [[]];
  for (const element of array) {
    const length = result.length;
    for (let i = 0; i < length; i++) {
        result.push([...result[i], element]);
    }
  }
  return result;
}

/**
 * Generate all non-empty proper subsets of an itemset
 */
function getProperSubsets<T>(array: T[]): T[][] {
  const subsets = getSubsets(array);
  return subsets.filter(
    (subset) => subset.length > 0 && subset.length < array.length
  );
}

/**
 * Returns a sorted unique representation of an array of strings
 */
function toSortedKey(items: string[]): string {
  return [...items].sort().join(",");
}

/**
 * Converts a sorted comma-separated string back to array of items
 */
function fromKey(key: string): string[] {
  return key ? key.split(",") : [];
}

/**
 * APRIORI ALGORITHM
 */
export function runApriori(
  transactions: string[][],
  minSupport: number
): Itemset[] {
  const numTransactions = transactions.length;
  if (numTransactions === 0) return [];

  const supportThreshold = minSupport * numTransactions;
  const frequentItemsets: Itemset[] = [];

  // 1. Generate L1 (Frequent 1-itemsets)
  const itemCounts: Record<string, number> = {};
  for (const t of transactions) {
    const uniqueItemsInTx = Array.from(new Set(t));
    for (const item of uniqueItemsInTx) {
      itemCounts[item] = (itemCounts[item] || 0) + 1;
    }
  }

  let Lk: Itemset[] = [];
  for (const [item, count] of Object.entries(itemCounts)) {
    if (count >= supportThreshold) {
      const itemset: Itemset = {
        items: [item],
        count,
        support: count / numTransactions,
      };
      Lk.push(itemset);
      frequentItemsets.push(itemset);
    }
  }

  let k = 2;
  while (Lk.length > 0) {
    // Generate candidates Ck from L(k-1)
    const candidates: string[][] = [];
    const n = Lk.length;

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const itemset1 = Lk[i].items;
        const itemset2 = Lk[j].items;

        // Try to join itemsets that share the first k-2 elements
        let canJoin = true;
        for (let idx = 0; idx < k - 2; idx++) {
          if (itemset1[idx] !== itemset2[idx]) {
            canJoin = false;
            break;
          }
        }

        if (canJoin) {
          const newItem = itemset2[k - 2];
          const candidate = [...itemset1, newItem].sort();
          
          // Prune: All sub-itemsets of size k-1 must be frequent
          let allSubsetsFrequent = true;
          const kMinus1Subsets = getProperSubsets(candidate).filter(
            (s) => s.length === k - 1
          );

          // Build a set of frequent keys for easy lookup
          const frequentKeys = new Set(Lk.map((fs) => toSortedKey(fs.items)));

          for (const sub of kMinus1Subsets) {
            if (!frequentKeys.has(toSortedKey(sub))) {
              allSubsetsFrequent = false;
              break;
            }
          }

          if (allSubsetsFrequent) {
            // Check if candidate is already added
            const candKey = toSortedKey(candidate);
            if (!candidates.map(toSortedKey).includes(candKey)) {
              candidates.push(candidate);
            }
          }
        }
      }
    }

    if (candidates.length === 0) {
      break;
    }

    // Count supports of candidates
    const candidateCounts: Record<string, number> = {};
    for (const tx of transactions) {
      const txSet = new Set(tx);
      for (const cand of candidates) {
        const isTxSubset = cand.every((item) => txSet.has(item));
        if (isTxSubset) {
          const key = toSortedKey(cand);
          candidateCounts[key] = (candidateCounts[key] || 0) + 1;
        }
      }
    }

    // Filter by minSupport to create Lk
    Lk = [];
    for (const cand of candidates) {
      const key = toSortedKey(cand);
      const count = candidateCounts[key] || 0;
      if (count >= supportThreshold) {
        const itemset: Itemset = {
          items: cand,
          count,
          support: count / numTransactions,
        };
        Lk.push(itemset);
        frequentItemsets.push(itemset);
      }
    }

    k++;
  }

  // Sort by itemset length and then descending support
  return frequentItemsets.sort((a, b) => {
    if (a.items.length !== b.items.length) {
      return a.items.length - b.items.length;
    }
    return b.support - a.support;
  });
}

/**
 * FP-GROWTH ALGORITHM
 */

class FPTreeNode {
  name: string;
  count: number;
  parent: FPTreeNode | null = null;
  children: Map<string, FPTreeNode> = new Map();
  nodeLink: FPTreeNode | null = null;

  constructor(name: string, count = 0, parent: FPTreeNode | null = null) {
    this.name = name;
    this.count = count;
    this.parent = parent;
  }
}

export function runFPGrowth(
  transactions: string[][],
  minSupport: number
): Itemset[] {
  const numTransactions = transactions.length;
  if (numTransactions === 0) return [];

  const supportThreshold = Math.ceil(minSupport * numTransactions);

  // 1. Count support of each item and find frequent itemsets of size 1
  const itemCounts: Record<string, number> = {};
  for (const tx of transactions) {
    const uniqueTx = Array.from(new Set(tx));
    for (const item of uniqueTx) {
      itemCounts[item] = (itemCounts[item] || 0) + 1;
    }
  }

  // Extract frequent 1-itemsets
  const frequent1Items = Object.keys(itemCounts)
    .filter((item) => itemCounts[item] >= supportThreshold)
    .sort((a, b) => {
      if (itemCounts[b] !== itemCounts[a]) {
        return itemCounts[b] - itemCounts[a]; // Sort by support count descending
      }
      return a.localeCompare(b); // Alphabetical tie breaker
    });

  // Keep a map of support for quick lookup
  const frequentSupportMap = new Map<string, number>();
  for (const item of frequent1Items) {
    frequentSupportMap.set(item, itemCounts[item]);
  }

  // 2. Filter and sort transactions so they only contain frequent items in order
  const cleanedTransactions: string[][] = [];
  for (const tx of transactions) {
    const sortedTx = tx
      .filter((item) => frequentSupportMap.has(item))
      .sort((a, b) => {
        const countA = frequentSupportMap.get(a) || 0;
        const countB = frequentSupportMap.get(b) || 0;
        if (countB !== countA) return countB - countA;
        return a.localeCompare(b);
      });
    
    // Remove duplicates within the transaction
    const uniqueSortedTx: string[] = [];
    const seen = new Set<string>();
    for (const item of sortedTx) {
      if (!seen.has(item)) {
        seen.add(item);
        uniqueSortedTx.push(item);
      }
    }
    if (uniqueSortedTx.length > 0) {
      cleanedTransactions.push(uniqueSortedTx);
    }
  }

  // 3. Build FP-Tree
  const root = new FPTreeNode("Null Root", 0, null);
  const headerTable = new Map<string, FPTreeNode | null>();
  for (const item of frequent1Items) {
    headerTable.set(item, null);
  }

  // Helper to link node to the header table sequence
  const updateHeaderLink = (item: string, node: FPTreeNode) => {
    const currentLink = headerTable.get(item);
    if (currentLink === null) {
      headerTable.set(item, node);
    } else {
      let temp = currentLink;
      while (temp.nodeLink !== null && temp !== node) {
        temp = temp.nodeLink;
      }
      if (temp !== node) {
        temp.nodeLink = node;
      }
    }
  };

  // Insert transactions into FP-Tree
  for (const tx of cleanedTransactions) {
    let currentNode = root;
    for (const item of tx) {
      if (currentNode.children.has(item)) {
        const child = currentNode.children.get(item)!;
        child.count += 1;
        currentNode = child;
      } else {
        const newNode = new FPTreeNode(item, 1, currentNode);
        currentNode.children.set(item, newNode);
        currentNode = newNode;
        updateHeaderLink(item, newNode);
      }
    }
  }

  // 4. Recursively mine FP-Tree
  const frequentPatterns: Itemset[] = [];

  const mineTree = (
    treeRoot: FPTreeNode,
    treeHeaderTable: Map<string, FPTreeNode | null>,
    prefix: string[]
  ) => {
    // Sort table items by frequency ascending (bottom of the tree first)
    const sortedItems = Array.from(treeHeaderTable.keys()).sort((a, b) => {
      // Find sum of count of nodes in the link chain
      let countA = 0;
      let currA = treeHeaderTable.get(a);
      while (currA !== null && currA !== undefined) {
        countA += currA.count;
        currA = currA.nodeLink;
      }

      let countB = 0;
      let currB = treeHeaderTable.get(b);
      while (currB !== null && currB !== undefined) {
        countB += currB.count;
        currB = currB.nodeLink;
      }

      if (countA !== countB) return countA - countB;
      return b.localeCompare(a); // Reverse alphabetical for ascending
    });

    for (const item of sortedItems) {
      const newPrefix = [...prefix, item];
      
      // Compute support count for this pattern
      let supportCount = 0;
      let nodeInHeader = treeHeaderTable.get(item);
      while (nodeInHeader !== null && nodeInHeader !== undefined) {
        supportCount += nodeInHeader.count;
        nodeInHeader = nodeInHeader.nodeLink;
      }

      // Add to frequent patterns if it meets min support threshold
      if (supportCount >= supportThreshold) {
        frequentPatterns.push({
          items: [...newPrefix].sort(),
          count: supportCount,
          support: supportCount / numTransactions,
        });

        // Collect conditional prefix paths for the item
        const conditionalPrefixPaths: { path: string[]; count: number }[] = [];
        let currNode = treeHeaderTable.get(item);

        while (currNode !== null && currNode !== undefined) {
          const path: string[] = [];
          let pNode = currNode.parent;
          while (pNode !== null && pNode.name !== "Null Root") {
            path.push(pNode.name);
            pNode = pNode.parent;
          }
          if (path.length > 0) {
            conditionalPrefixPaths.push({
              path: path.reverse(), // Top-down
              count: currNode.count,
            });
          }
          currNode = currNode.nodeLink;
        }

        // Build Conditional FP-Tree
        const condTreeRoot = new FPTreeNode("Null Root", 0, null);
        const condHeaderTable = new Map<string, FPTreeNode | null>();
        const condItemCounts: Record<string, number> = {};

        // In conditional tree, count frequent items from path lists first
        for (const cpp of conditionalPrefixPaths) {
          for (const pathItem of cpp.path) {
            condItemCounts[pathItem] = (condItemCounts[pathItem] || 0) + cpp.count;
          }
        }

        // Keep items that meet support threshold in the conditional environment
        const condFrequentItems = Object.keys(condItemCounts)
          .filter((key) => condItemCounts[key] >= supportThreshold)
          .sort((a, b) => condItemCounts[b] - condItemCounts[a]);

        if (condFrequentItems.length > 0) {
          for (const fi of condFrequentItems) {
            condHeaderTable.set(fi, null);
          }

          const updateCondHeaderLink = (condItem: string, condNode: FPTreeNode) => {
            const currentC = condHeaderTable.get(condItem);
            if (currentC === null) {
              condHeaderTable.set(condItem, condNode);
            } else {
              let temp = currentC;
              while (temp.nodeLink !== null && temp !== condNode) {
                temp = temp.nodeLink;
              }
              if (temp !== condNode) {
                temp.nodeLink = condNode;
              }
            }
          };

          // Insert paths into the conditional FP-tree
          for (const cpp of conditionalPrefixPaths) {
            const filteredPath = cpp.path.filter((pi) => condHeaderTable.has(pi));
            let currentCNode = condTreeRoot;
            for (const pathItem of filteredPath) {
              if (currentCNode.children.has(pathItem)) {
                const child = currentCNode.children.get(pathItem)!;
                child.count += cpp.count;
                currentCNode = child;
              } else {
                const newNode = new FPTreeNode(pathItem, cpp.count, currentCNode);
                currentCNode.children.set(pathItem, newNode);
                currentCNode = newNode;
                updateCondHeaderLink(pathItem, newNode);
              }
            }
          }

          // Recursive call
          mineTree(condTreeRoot, condHeaderTable, newPrefix);
        }
      }
    }
  };

  mineTree(root, headerTable, []);

  // Remove duplicates resulting from combinations
  const finalPatternsMap = new Map<string, Itemset>();
  for (const pat of frequentPatterns) {
    const key = toSortedKey(pat.items);
    if (!finalPatternsMap.has(key)) {
      finalPatternsMap.set(key, pat);
    }
  }

  const result = Array.from(finalPatternsMap.values());

  // Sort by itemset length and then descending support
  return result.sort((a, b) => {
    if (a.items.length !== b.items.length) {
      return a.items.length - b.items.length;
    }
    return b.support - a.support;
  });
}

/**
 * GENERIC ASSOCIATION RULES MINER
 */
export function generateRules(
  frequentItemsets: Itemset[],
  transactionsCount: number,
  minConfidence: number
): AssociationRule[] {
  const rules: AssociationRule[] = [];
  
  // Quick support lookup dictionary
  const itemsetSupportMap = new Map<string, number>();
  for (const itemset of frequentItemsets) {
    itemsetSupportMap.set(toSortedKey(itemset.items), itemset.support);
  }

  let ruleIdCounter = 1;

  for (const itemset of frequentItemsets) {
    const Y = itemset.items;
    if (Y.length < 2) continue;

    const subsets = getProperSubsets(Y);
    for (const X of subsets) {
      const A = X; // Antecedent
      const C = Y.filter((item) => !X.includes(item)); // Consequent (Y \ X)

      const supportY = itemset.support;
      const supportA = itemsetSupportMap.get(toSortedKey(A)) || 0;
      const supportC = itemsetSupportMap.get(toSortedKey(C)) || 0;

      if (supportA > 0) {
        const confidence = supportY / supportA;
        if (confidence >= minConfidence) {
          const lift = supportC > 0 ? supportY / (supportA * supportC) : 0;
          
          rules.push({
            id: `rule_${ruleIdCounter++}`,
            antecedents: [...A].sort(),
            consequents: [...C].sort(),
            support: supportY,
            confidence,
            lift,
          });
        }
      }
    }
  }

  // Sort by descending lift first, then descending confidence, then support
  return rules.sort((a, b) => {
    if (Math.abs(b.lift - a.lift) > 0.0001) return b.lift - a.lift;
    if (Math.abs(b.confidence - a.confidence) > 0.0001) return b.confidence - a.confidence;
    return b.support - a.support;
  });
}

/**
 * CORE RECOMMENDATION GENERATOR BASED ON CART
 * Evaluates which rules trigger and returns consequent items.
 */
export function recommendProducts(
  cart: string[],
  rules: AssociationRule[]
): { item: string; confidence: number; lift: number; ruleId: string; triggerRule: AssociationRule }[] {
  if (cart.length === 0) return [];

  const cartSet = new Set(cart.map((i) => i.trim().toLowerCase()));
  const recommendationsMap = new Map<
    string,
    { confidence: number; lift: number; ruleId: string; triggerRule: AssociationRule }
  >();

  for (const rule of rules) {
    const antecedentSet = rule.antecedents;
    const meetsAntecedent = antecedentSet.every((item) =>
      cartSet.has(item.trim().toLowerCase())
    );

    if (meetsAntecedent) {
      for (const item of rule.consequents) {
        // Find existing recommendation or check if this has higher confidence/lift
        const existing = recommendationsMap.get(item);
        if (!existing || rule.confidence > existing.confidence) {
          recommendationsMap.set(item, {
            confidence: rule.confidence,
            lift: rule.lift,
            ruleId: rule.id,
            triggerRule: rule,
          });
        }
      }
    }
  }

  return Array.from(recommendationsMap.entries()).map(([item, details]) => ({
    item,
    confidence: details.confidence,
    lift: details.lift,
    ruleId: details.ruleId,
    triggerRule: details.triggerRule,
  }));
}

/**
 * COMPARES CART AGAINST FREQUENT ITEMSETS AND SUGGESTS MISSING HIGHLY LIKELY ITEMS
 * If user buys some items in a frequent set but is missing other items from that frequent itemset,
 * this function captures them, scores them based on overlap ratio and support, and highlights them as missing.
 */
export function findMissingHighlyLikelyItems(
  cart: string[],
  itemsets: Itemset[]
): MissingItemSuggestion[] {
  if (cart.length === 0 || itemsets.length === 0) return [];

  const cartSet = new Set(cart.map((item) => item.trim().toLowerCase()));
  const suggestionsMap = new Map<string, MissingItemSuggestion>();

  // Gather frequent itemsets of size 2 or larger
  const multiItemsets = itemsets.filter((s) => s.items.length >= 2);

  for (const set of multiItemsets) {
    const itemsInSet = set.items;
    const intersection: string[] = [];
    const missing: string[] = [];

    for (const item of itemsInSet) {
      if (cartSet.has(item.trim().toLowerCase())) {
        intersection.push(item);
      } else {
        missing.push(item);
      }
    }

    // Recommend missing items only if we have some overlap but also missing items
    if (intersection.length > 0 && missing.length > 0) {
      const matchRatio = intersection.length / itemsInSet.length;
      
      for (const missingItem of missing) {
        // Find custom casing from original items array instead of lowercasing
        const originalName = itemsInSet.find((i) => i.toLowerCase() === missingItem.toLowerCase()) || missingItem;
        const itemKey = originalName.trim();
        
        // Prevent recommending things currently in cart
        if (cartSet.has(itemKey.toLowerCase())) continue;

        const existing = suggestionsMap.get(itemKey);

        const itemsetDetail = {
          items: itemsInSet,
          count: set.count,
          support: set.support,
          matchRatio,
          missingItems: missing,
        };

        // Score formulation: matchRatio * support of itemset
        const score = matchRatio * set.support;

        if (existing) {
          existing.matchingItemsets.push(itemsetDetail);
          // Retain highest score logic
          if (score > existing.score) {
            existing.score = score;
          }
        } else {
          suggestionsMap.set(itemKey, {
            item: itemKey,
            score,
            matchingItemsets: [itemsetDetail],
          });
        }
      }
    }
  }

  // Filter out any suggestion that is already inside the cart array (safety guard)
  const finalSuggestions = Array.from(suggestionsMap.values()).filter(
    (s) => !cartSet.has(s.item.toLowerCase())
  );

  // Return sorted suggestions by score descending, then by number of supporting itemsets descending
  return finalSuggestions.sort((a, b) => {
    if (Math.abs(b.score - a.score) > 0.0001) {
      return b.score - a.score;
    }
    return b.matchingItemsets.length - a.matchingItemsets.length;
  });
}
