/**
 * Generate the Jacobsthal sequence up to a certain size
 * Matches the getJacob function in PmergeMe.cpp
 * @param {number} size - Size to generate sequence up to
 * @returns {Array} - The Jacobsthal sequence
 */
export function getJacobsthalSequence(size) {
  const jacobsthal = [0, 1];
  
  while (jacobsthal[jacobsthal.length - 1] < size) {
    const lastNum = jacobsthal[jacobsthal.length - 1];
    const secondLastNum = jacobsthal[jacobsthal.length - 2];
    
    const next = lastNum + 2 * secondLastNum;
    jacobsthal.push(next);
  }
  
  return jacobsthal;
}

/**
 * Calculate insertion order using Jacobsthal sequence
 * Matches the getInsertPos function in PmergeMe.cpp
 * @param {Array} jacobSeq - Jacobsthal sequence
 * @param {number} size - Number of elements
 * @returns {Array} - The calculated insertion order
 */
export function generateInsertionOrder(jacobSeq, size) {
  const order = [];
  const used = new Array(size).fill(false);
  used[0] = true; // Mark first position as used
  
  // Process Jacobsthal numbers
  for (let i = 1; i < jacobSeq.length && jacobSeq[i] < size; i++) {
    if (!used[jacobSeq[i]]) {
      order.push(jacobSeq[i]);
      used[jacobSeq[i]] = true;
    }
    
    // Fill in between current and previous Jacobsthal numbers
    for (let j = jacobSeq[i] - 1; j > jacobSeq[i-1]; j--) {
      if (j < size && !used[j]) {
        order.push(j);
        used[j] = true;
      }
    }
  }
  
  // Add any remaining indices
  for (let i = 1; i < size; i++) {
    if (!used[i]) {
      order.push(i);
    }
  }
  
  return order;
}

/**
 * Binary search to find insertion position
 * @param {Array} arr - Sorted array to search in
 * @param {number} value - Value to insert
 * @returns {Object} - Position and binary search steps
 */
export function binarySearch(arr, value) {
  let left = 0;
  let right = arr.length - 1;
  const steps = [];
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    steps.push(`mid=${mid}, arr[${mid}]=${arr[mid]}, ${value}${value > arr[mid] ? ">" : "<"}${arr[mid]}, go ${value > arr[mid] ? "right" : "left"}`);
    
    if (arr[mid] === value) {
      steps.push(`Found at position = ${mid}`);
      return { position: mid, steps };
    }
    
    if (arr[mid] < value) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  steps.push(`position = ${left}`);
  return { position: left, steps };
}

/**
 * Ford-Johnson sort implementation
 * Matches the sortVector function in PmergeMe.cpp
 * @param {Array} arr - Array to sort
 * @param {Function} recordStep - Function to record each algorithm step
 * @param {number} recursionLevel - Current recursion level
 * @returns {Array} - Sorted array
 */
export function fordJohnsonSort(arr, recordStep, recursionLevel = 0) {
  // Function to create appropriate call stack
  const generateCallStack = (level, currentFunction = "") => {
    const callStack = ["main()"];
    callStack.push("sortVector() - Main Level");
    
    for (let i = 1; i <= level; i++) {
      callStack.push(`sortVector() - Recursive Level ${i}`);
    }
    
    if (currentFunction) {
      callStack.push(currentFunction);
    }
    
    return callStack;
  };
  
  // Function to create memory state prefix based on recursion level
  const memoryPrefix = recursionLevel > 0 
    ? { level: `Recursion Level ${recursionLevel}` } 
    : {};
  
  // Base case - array is size 0 or 1
  if (arr.length <= 1) {
    recordStep({
      title: `${recursionLevel > 0 ? "Recursive " : ""}Base Case`,
      description: "Array has 0 or 1 elements, already sorted.",
      code: `// Array size <= 1, already sorted\nreturn ${JSON.stringify(arr)};`,
      memoryState: {
        ...memoryPrefix,
        _vec: arr.slice(),
        straggler: null,
        pairs: [],
        mainChain: [],
        pendChain: [],
        operations: [
          "Check if array size is 0 or 1",
          "Since array is already sorted, return it immediately"
        ],
        changes: []
      },
      callStack: generateCallStack(recursionLevel)
    });
    return arr.slice();
  }
  
  // Initial state recording
  recordStep({
    title: `${recursionLevel > 0 ? "Recursive " : ""}Initial Input`,
    description: `The algorithm starts with ${arr.length} elements to sort.`,
    code: `// Start sorting array of size ${arr.length}\nsortVector(${JSON.stringify(arr)})`,
    memoryState: {
      ...memoryPrefix,
      _vec: arr.slice(),
      straggler: null,
      pairs: [],
      mainChain: [],
      pendChain: [],
      operations: [
        "Initialize algorithm with input array",
        "Check array size and determine next steps"
      ],
      changes: []
    },
    callStack: generateCallStack(recursionLevel)
  });
  
  // Handle odd-sized array
  let hasStraggler = false;
  let straggler = null;
  let workingArr = arr.slice();
  
  if (workingArr.length % 2 !== 0) {
    hasStraggler = true;
    straggler = workingArr[workingArr.length - 1];
    const oldArr = workingArr.slice();
    workingArr = workingArr.slice(0, workingArr.length - 1);
    
    recordStep({
      title: `${recursionLevel > 0 ? "Recursive " : ""}Handle Odd-sized Array`,
      description: "If the array has an odd number of elements, remove the last element and save it as a straggler.",
      code: `// Size is odd (${arr.length} elements)\nbool hasStraggler = true;\nint straggler = _vec.back(); // ${straggler}\n_vec.pop_back();`,
      memoryState: {
        ...memoryPrefix,
        _vec: workingArr.slice(),
        straggler: straggler,
        pairs: [],
        mainChain: [],
        pendChain: [],
        activeIndices: { straggler: true },
        operations: [
          `Detect that array size (${arr.length}) is odd`,
          `Remove last element (${straggler}) as straggler`,
          `Remaining array has ${workingArr.length} elements`
        ],
        changes: [
          { variable: "straggler", from: "null", to: straggler.toString() },
          { variable: "_vec", from: JSON.stringify(oldArr), to: JSON.stringify(workingArr) }
        ]
      },
      callStack: generateCallStack(recursionLevel, "handleStragglerElement()")
    });
  } else {
    recordStep({
      title: `${recursionLevel > 0 ? "Recursive " : ""}Check Array Size`,
      description: "The array has an even number of elements, so we can directly form pairs.",
      code: `// Size is even (${arr.length} elements)\nbool hasStraggler = false;\nint straggler = 0;`,
      memoryState: {
        ...memoryPrefix,
        _vec: workingArr.slice(),
        straggler: null,
        pairs: [],
        mainChain: [],
        pendChain: [],
        operations: [
          `Detect that array size (${arr.length}) is even`,
          "No need to extract straggler element"
        ],
        changes: []
      },
      callStack: generateCallStack(recursionLevel, "checkArraySize()")
    });
  }
  
  // Form pairs and sort them
  const pairs = [];
  
  for (let i = 0; i < workingArr.length; i += 2) {
    let first = workingArr[i];
    let second = workingArr[i + 1];
    
    // Sort within pairs - larger element first
    if (first < second) {
      [first, second] = [second, first];
    }
    
    pairs.push([first, second]);
  }
  
  recordStep({
    title: `${recursionLevel > 0 ? "Recursive " : ""}Form Sorted Pairs`,
    description: "Group elements into pairs and ensure larger element comes first in each pair.",
    code: `// Form pairs from consecutive elements and sort them\nstd::vector<std::pair<int, int>> pairs;\nfor (size_t i = 0; i < _vec.size(); i += 2) {\n  int first = _vec[i];\n  int second = _vec[i + 1];\n  if (first < second)\n    std::swap(first, second);\n  pairs.push_back(std::make_pair(first, second));\n}`,
    memoryState: {
      ...memoryPrefix,
      _vec: workingArr.slice(),
      straggler: straggler,
      pairs: pairs.map(pair => pair.slice()),
      mainChain: [],
      pendChain: [],
      activeIndices: { vec: Array.from(Array(workingArr.length).keys()) },
      operations: [
        "Form pairs from consecutive elements",
        "Sort within each pair so larger element comes first",
        `Created ${pairs.length} sorted pairs`
      ],
      changes: [
        { variable: "pairs", from: "[]", to: JSON.stringify(pairs) }
      ]
    },
    callStack: generateCallStack(recursionLevel, "formSortedPairs()")
  });
  
  // Extract main chain (larger elements from each pair)
  const mainChain = [];
  
  for (let i = 0; i < pairs.length; i++) {
    mainChain.push(pairs[i][0]);
  }
  
  recordStep({
    title: `${recursionLevel > 0 ? "Recursive " : ""}Extract Main Chain`,
    description: "Create the main chain from the larger elements of each pair.",
    code: `// Extract main chain from first (larger) elements of pairs\nstd::vector<int> mainChain;\nfor (size_t i = 0; i < pairs.size(); i++) {\n  mainChain.push_back(pairs[i].first);\n}`,
    memoryState: {
      ...memoryPrefix,
      _vec: workingArr.slice(),
      straggler: straggler,
      pairs: pairs.map(pair => pair.slice()),
      mainChain: mainChain.slice(),
      pendChain: [],
      activeIndices: {
        mainChain: null,
        pairs: Array.from(Array(pairs.length).keys())
      },
      operations: [
        "Extract larger element from each pair to form main chain",
        `Main chain has ${mainChain.length} elements`
      ],
      changes: [
        { variable: "mainChain", from: "[]", to: JSON.stringify(mainChain) }
      ]
    },
    callStack: generateCallStack(recursionLevel, "extractMainChain()")
  });
  
  // Recursively sort main chain
  let sortedMainChain = mainChain.slice();
  
  if (mainChain.length > 1) {
    recordStep({
      title: `${recursionLevel > 0 ? "Recursive " : ""}Prepare Recursive Call`,
      description: "Recursively sort the main chain by calling sortVector again.",
      code: `// Recursively sort main chain\nif (mainChain.size() > 1) {\n  _vec = mainChain;\n  sortVector();\n  mainChain = _vec;\n}`,
      memoryState: {
        ...memoryPrefix,
        _vec: mainChain.slice(),
        straggler: straggler,
        pairs: pairs.map(pair => pair.slice()),
        mainChain: mainChain.slice(),
        pendChain: [],
        activeIndices: {
          mainChain: Array.from(Array(mainChain.length).keys())
        },
        operations: [
          `Main chain has ${mainChain.length} elements and needs to be sorted`,
          "Prepare for recursive sorting of main chain"
        ],
        changes: [
          { variable: "_vec", from: JSON.stringify(workingArr), to: JSON.stringify(mainChain) }
        ]
      },
      callStack: generateCallStack(recursionLevel, "sortMainChainRecursively()")
    });
    
    // Recursive call
    sortedMainChain = fordJohnsonSort(mainChain, recordStep, recursionLevel + 1);
    
    recordStep({
      title: `${recursionLevel > 0 ? "Recursive " : ""}Main Chain Sorted`,
      description: "Received sorted main chain from recursive call.",
      code: `// Main chain sorted by recursive call\nmainChain = ${JSON.stringify(sortedMainChain)};`,
      memoryState: {
        ...memoryPrefix,
        _vec: [],
        straggler: straggler,
        pairs: pairs.map(pair => pair.slice()),
        mainChain: sortedMainChain.slice(),
        pendChain: [],
        activeIndices: {
          mainChain: Array.from(Array(sortedMainChain.length).keys())
        },
        operations: [
          "Recursive call completed",
          "Main chain is now sorted"
        ],
        changes: [
          { variable: "mainChain", from: JSON.stringify(mainChain), to: JSON.stringify(sortedMainChain) }
        ]
      },
      callStack: generateCallStack(recursionLevel)
    });
  } else if (mainChain.length === 1) {
    recordStep({
      title: `${recursionLevel > 0 ? "Recursive " : ""}Skip Recursive Call`,
      description: "Main chain has only one element, so it's already sorted.",
      code: `// Main chain has only one element, already sorted`,
      memoryState: {
        ...memoryPrefix,
        _vec: workingArr.slice(),
        straggler: straggler,
        pairs: pairs.map(pair => pair.slice()),
        mainChain: sortedMainChain.slice(),
        pendChain: [],
        activeIndices: { mainChain: 0 },
        operations: [
          "Main chain has only 1 element, already sorted",
          "No need for recursive sorting"
        ],
        changes: []
      },
      callStack: generateCallStack(recursionLevel, "checkMainChainSize()")
    });
  }
  
  // Initialize result array with sorted main chain
  let result = sortedMainChain.slice();
  
  recordStep({
    title: `${recursionLevel > 0 ? "Recursive " : ""}Initialize Result`,
    description: "Initialize the result array with the sorted main chain.",
    code: `// Initialize result array with sorted main chain\nstd::vector<int> result = mainChain;`,
    memoryState: {
      ...memoryPrefix,
      _vec: [],
      straggler: straggler,
      pairs: pairs.map(pair => pair.slice()),
      mainChain: sortedMainChain.slice(),
      pendChain: [],
      result: result.slice(),
      operations: [
        "Initialize result array with the sorted main chain"
      ],
      changes: [
        { variable: "result", from: "[]", to: JSON.stringify(result) }
      ]
    },
    callStack: generateCallStack(recursionLevel, "initializeResultArray()")
  });
  
  // Create pending chain with smaller elements from pairs
  const pendChain = [];
  
  for (let i = 0; i < pairs.length; i++) {
    pendChain.push(pairs[i][1]);
  }
  
  recordStep({
    title: `${recursionLevel > 0 ? "Recursive " : ""}Create Pending Chain`,
    description: "Create a pending chain with the smaller elements from each pair.",
    code: `// Create pending chain with smaller elements\nstd::vector<int> pendChain;\nfor (size_t i = 0; i < pairs.size(); i++) {\n  pendChain.push_back(pairs[i].second);\n}`,
    memoryState: {
      ...memoryPrefix,
      _vec: [],
      straggler: straggler,
      pairs: pairs.map(pair => pair.slice()),
      mainChain: sortedMainChain.slice(),
      pendChain: pendChain.slice(),
      result: result.slice(),
      activeIndices: {
        pairs: Array.from(Array(pairs.length).keys()),
        pendChain: Array.from(Array(pendChain.length).keys())
      },
      operations: [
        "Create pending chain with smaller elements from each pair",
        `Pending chain has ${pendChain.length} elements to be inserted`
      ],
      changes: [
        { variable: "pendChain", from: "[]", to: JSON.stringify(pendChain) }
      ]
    },
    callStack: generateCallStack(recursionLevel, "createPendingChain()")
  });
  
  // Insert first element from pending chain
  if (pendChain.length > 0) {
    const firstPending = pendChain[0];
    const oldResult = result.slice();
    const searchResult = binarySearch(result, firstPending);
    const insertPos = searchResult.position;
    
    result.splice(insertPos, 0, firstPending);
    
    recordStep({
      title: `${recursionLevel > 0 ? "Recursive " : ""}Insert First Pending Element`,
      description: "Insert the first pending element into the sorted result array.",
      code: `// Insert first pending element\nif (!pendChain.empty()) {\n  std::vector<int>::iterator pos = std::lower_bound(result.begin(), result.end(), pendChain[0]);\n  result.insert(pos, pendChain[0]);\n}`,
      memoryState: {
        ...memoryPrefix,
        _vec: [],
        straggler: straggler,
        pairs: pairs.map(pair => pair.slice()),
        mainChain: sortedMainChain.slice(),
        pendChain: pendChain.slice(),
        result: result.slice(),
        activeIndices: {
          pendChain: 0,
          result: insertPos
        },
        operations: [
          `Insert first pending element ${firstPending} using binary search`,
          `Insert at position ${insertPos} in result array`
        ],
        changes: [
          { variable: "result", from: JSON.stringify(oldResult), to: JSON.stringify(result) }
        ],
        binarySearch: {
          value: firstPending,
          array: oldResult,
          steps: searchResult.steps
        }
      },
      callStack: generateCallStack(recursionLevel, "insertFirstPendingElement()")
    });
  }
  
  // For remaining elements, use Jacobsthal sequence for insertion order
  if (pendChain.length > 1) {
    // Generate Jacobsthal sequence
    const jacobSeq = getJacobsthalSequence(pendChain.length);
    
    recordStep({
      title: `${recursionLevel > 0 ? "Recursive " : ""}Generate Jacobsthal Sequence`,
      description: "Generate the Jacobsthal sequence to determine the optimal insertion order.",
      code: `// Generate Jacobsthal sequence\nstd::vector<int> jacobSeq = getJacob(pendChain.size());`,
      memoryState: {
        ...memoryPrefix,
        _vec: [],
        straggler: straggler,
        pairs: pairs.map(pair => pair.slice()),
        mainChain: sortedMainChain.slice(),
        pendChain: pendChain.slice(),
        result: result.slice(),
        jacobsthal: jacobSeq.slice(),
        operations: [
          "Generate Jacobsthal sequence for optimal insertion order",
          `Sequence: ${jacobSeq.join(", ")}`
        ],
        changes: [
          { variable: "jacobSeq", from: "[]", to: JSON.stringify(jacobSeq) }
        ]
      },
      callStack: generateCallStack(recursionLevel, "generateJacobsthalSequence()")
    });
    
    // Calculate insertion order based on Jacobsthal sequence
    const insertionOrder = generateInsertionOrder(jacobSeq, pendChain.length);
    
    recordStep({
      title: `${recursionLevel > 0 ? "Recursive " : ""}Determine Insertion Order`,
      description: "Calculate the insertion order for pending elements using the Jacobsthal sequence.",
      code: `// Calculate insertion order\nstd::vector<int> insertionOrder = getInsertPos(jacobSeq, pendChain.size());`,
      memoryState: {
        ...memoryPrefix,
        _vec: [],
        straggler: straggler,
        pairs: pairs.map(pair => pair.slice()),
        mainChain: sortedMainChain.slice(),
        pendChain: pendChain.slice(),
        result: result.slice(),
        jacobsthal: jacobSeq.slice(),
        insertionOrder: insertionOrder.slice(),
        operations: [
          "Calculate insertion order based on Jacobsthal sequence",
          `Insertion order: ${insertionOrder.join(", ")}`
        ],
        changes: [
          { variable: "insertionOrder", from: "[]", to: JSON.stringify(insertionOrder) }
        ]
      },
      callStack: generateCallStack(recursionLevel, "calculateInsertionOrder()")
    });
    
    // Insert remaining elements according to the insertion order
    for (let i = 0; i < insertionOrder.length; i++) {
      const idx = insertionOrder[i];
      
      // Skip if out of range or it's the first element (already inserted)
      if (idx <= 0 || idx >= pendChain.length) {
        continue;
      }
      
      const elementToInsert = pendChain[idx];
      const oldResult = result.slice();
      const searchResult = binarySearch(result, elementToInsert);
      const insertPos = searchResult.position;
      
      result.splice(insertPos, 0, elementToInsert);
      
      recordStep({
        title: `${recursionLevel > 0 ? "Recursive " : ""}Insert Pending Element (${elementToInsert})`,
        description: `Insert pending element from index ${idx} according to calculated insertion order.`,
        code: `// Insert element ${elementToInsert} from pending chain\nint idx = insertionOrder[${i}]; // ${idx}\nif (idx > 0 && idx < pendChain.size()) {\n  std::vector<int>::iterator pos = std::lower_bound(result.begin(), result.end(), pendChain[idx]);\n  result.insert(pos, pendChain[idx]);\n}`,
        memoryState: {
          ...memoryPrefix,
          _vec: [],
          straggler: straggler,
          pairs: pairs.map(pair => pair.slice()),
          mainChain: sortedMainChain.slice(),
          pendChain: pendChain.slice(),
          result: result.slice(),
          jacobsthal: jacobSeq.slice(),
          insertionOrder: insertionOrder.slice(),
          activeIndices: {
            pendChain: idx,
            result: insertPos,
            insertionOrder: i
          },
          operations: [
            `Insert pending element ${elementToInsert} from index ${idx}`,
            `Binary search to find position ${insertPos} in result array`
          ],
          changes: [
            { variable: "result", from: JSON.stringify(oldResult), to: JSON.stringify(result) }
          ],
          binarySearch: {
            value: elementToInsert,
            array: oldResult,
            steps: searchResult.steps
          }
        },
        callStack: generateCallStack(recursionLevel, "insertPendingElements()")
      });
    }
  }
  
  // Insert straggler if exists
  if (hasStraggler) {
    const oldResult = result.slice();
    const searchResult = binarySearch(result, straggler);
    const insertPos = searchResult.position;
    
    result.splice(insertPos, 0, straggler);
    
    recordStep({
      title: `${recursionLevel > 0 ? "Recursive " : ""}Insert Straggler`,
      description: "Insert the straggler element at the correct position in the result array.",
      code: `// Insert straggler element\nif (hasStraggler) {\n  std::vector<int>::iterator pos = std::lower_bound(result.begin(), result.end(), straggler);\n  result.insert(pos, straggler);\n}`,
      memoryState: {
        ...memoryPrefix,
        _vec: [],
        straggler: straggler,
        pairs: pairs.map(pair => pair.slice()),
        mainChain: sortedMainChain.slice(),
        pendChain: pendChain.slice(),
        result: result.slice(),
        activeIndices: {
          straggler: true,
          result: insertPos
        },
        operations: [
          `Insert straggler element ${straggler} into result array`,
          `Binary search finds insertion position at index ${insertPos}`
        ],
        changes: [
          { variable: "result", from: JSON.stringify(oldResult), to: JSON.stringify(result) }
        ],
        binarySearch: {
          value: straggler,
          array: oldResult,
          steps: searchResult.steps
        }
      },
      callStack: generateCallStack(recursionLevel, "insertStragglerElement()")
    });
  }
  
  // Return sorted result
  recordStep({
    title: `${recursionLevel > 0 ? "Return From Recursion Level " + recursionLevel : "Return Final Result"}`,
    description: `Set _vec to the final sorted result${recursionLevel > 0 ? " and return to previous recursion level" : " and return"}.`,
    code: `// Set _vec to final result and return\n_vec = result;`,
    memoryState: {
      ...memoryPrefix,
      _vec: result.slice(),
      straggler: null,
      pairs: [],
      mainChain: [],
      pendChain: [],
      result: result.slice(),
      operations: [
        "Set final result as the output array",
        "Ford-Johnson sort completed successfully"
      ],
      changes: [
        { variable: "_vec", from: "[]", to: JSON.stringify(result) }
      ]
    },
    callStack: recursionLevel > 0 ? generateCallStack(recursionLevel - 1) : ["main()"]
  });
  
  return result;
}