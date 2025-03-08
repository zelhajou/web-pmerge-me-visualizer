/**
 * Calculate the Jacobsthal sequence
 * Jacobsthal numbers: 0, 1, 1, 3, 5, 11, 21, 43, 85, 171, ...
 * Formula: J(n) = J(n-1) + 2*J(n-2) with J(0)=0, J(1)=1
 * Used in merge-insertion sort to optimize insertion order
 */
export function getJacobsthalSequence(n) {
  if (n <= 0) return [0];
  if (n === 1) return [0, 1];

  // Initialize with first two elements
  const sequence = [0, 1];

  // Calculate subsequent elements
  for (let i = 2; i <= n; i++) {
    const nextValue = sequence[i - 1] + 2 * sequence[i - 2];
    sequence.push(nextValue);
  }

  return sequence;
}

/**
 * Calculate insertion order using Jacobsthal sequence to match C++ implementation
 * @param {Array} jacobSeq - Jacobsthal sequence
 * @param {number} pairsSize - Number of pairs
 * @returns {Array} - The calculated insertion order
 */
export function calculateInsertionOrder(jacobSeq, pairsSize) {
  // Set up tracking variables
  const insertionOrder = [];
  const inserted = new Array(pairsSize).fill(false);
  inserted[0] = true; // Mark first pair as already processed
  
  // First loop processes Jacobsthal numbers
  for (let i = 1; i < jacobSeq.length; i++) {
    const idx = jacobSeq[i];
    
    // Check if index is within range and not yet inserted
    if (idx < pairsSize && !inserted[idx]) {
      insertionOrder.push(idx);
      inserted[idx] = true;
    }
    
    // Fill in between current and previous Jacobsthal numbers
    const prev = jacobSeq[i-1];
    for (let j = idx - 1; j > prev; j--) {
      if (j >= 0 && j < pairsSize && !inserted[j]) {
        insertionOrder.push(j);
        inserted[j] = true;
      }
    }
  }
  
  // Add any remaining indices that weren't processed
  for (let i = 1; i < pairsSize; i++) {
    if (!inserted[i]) {
      insertionOrder.push(i);
    }
  }
  
  return insertionOrder;
}
