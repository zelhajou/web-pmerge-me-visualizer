import { fordJohnsonSort } from './fordJohnson';

/**
 * Generate all steps for the Ford-Johnson algorithm
 * Customized to support the PmergeMe.cpp implementation
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
    code: `// Ford-Johnson sort begins\nsortVector([${inputArray.join(", ")}]);`,
    memoryState: {
      _vec: inputArray.slice(),
      straggler: null,
      pairs: [],
      mainChain: [],
      pendChain: [],
      operations: [
        "Initialize algorithm with input array",
        `Array has ${inputArray.length} elements`,
      ],
      changes: [],
    },
    callStack: ["main()", "sortVector() - Main Level"],
  });
  
  // Execute algorithm and record all steps
  fordJohnsonSort(inputArray, recordStep);
  
  return steps;
}