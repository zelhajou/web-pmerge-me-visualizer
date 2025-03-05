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
      const nextValue = sequence[i-1] + 2 * sequence[i-2];
      sequence.push(nextValue);
    }
    
    return sequence;
  }
  
  /**
   * Calculate the insertion order for merge-insert sort based on Jacobsthal sequence
   * @param {number} size - The number of elements to create insertion order for
   * @returns {Array} - Optimal insertion order based on Jacobsthal sequence
   */
  export function calculateInsertionOrder(size) {
    // If size is 0 or 1, no insertion needed
    if (size <= 1) return [];
    
    // Generate Jacobsthal sequence large enough to cover size
    let jacobsthalSize = 3;
    while (getJacobsthalSequence(jacobsthalSize).slice(-1)[0] < size) {
      jacobsthalSize++;
    }
    
    const jacobSeq = getJacobsthalSequence(jacobsthalSize);
    const insertionOrder = [];
    const inserted = new Array(size).fill(false);
    inserted[0] = true; // First element already in result
    
    // Use Jacobsthal numbers to determine insertion order
    for (let i = 1; i < jacobSeq.length && jacobSeq[i] < size; i++) {
      const idx = jacobSeq[i];
      if (!inserted[idx]) {
        insertionOrder.push(idx);
        inserted[idx] = true;
      }
      
      // Fill in intermediate values in descending order
      for (let j = idx - 1; j > jacobSeq[i-1]; j--) {
        if (j >= 0 && j < size && !inserted[j]) {
          insertionOrder.push(j);
          inserted[j] = true;
        }
      }
    }
    
    // Add any remaining uninserted indices
    for (let i = 1; i < size; i++) {
      if (!inserted[i]) {
        insertionOrder.push(i);
      }
    }
    
    return insertionOrder;
  }