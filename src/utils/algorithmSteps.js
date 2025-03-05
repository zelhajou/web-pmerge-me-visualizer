import { fordJohnsonSort } from './fordJohnson';

/**
 * Generate all steps for the Ford-Johnson algorithm
 * @param {Array} inputArray - Initial array to sort
 * @returns {Array} - All algorithm execution steps
 */
export function generateAlgorithmSteps(inputArray) {
  const steps = [];
  
  // Function to record each step
  const recordStep = (stepData) => {
    steps.push({
      id: steps.length,
      ...stepData
    });
  };
  
  // Record initial step
  recordStep({
    title: "Initial Input",
    description: "The algorithm starts with an unsorted array.",
    code: `sortVector(${JSON.stringify(inputArray)})`,
    memoryState: {
      _vec: inputArray.slice(),
      straggler: null,
      pairs: [],
      mainChain: []
    },
    callStack: ["main()", "sortVector() - Main Level"]
  });
  
  // Execute algorithm and record all steps
  fordJohnsonSort(inputArray, recordStep);
  
  return steps;
}