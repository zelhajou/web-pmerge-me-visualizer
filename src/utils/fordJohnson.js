/**
 * Generate the Jacobsthal sequence up to n numbers
 * @param {number} n - Number of terms to generate
 * @returns {Array} - The Jacobsthal sequence
 */
export function getJacobsthalSequence(n) {
  const jacobsthal = [0, 1];

  for (let i = 2; i <= n; i++) {
    const next = jacobsthal[i - 1] + 2 * jacobsthal[i - 2];
    jacobsthal.push(next);
  }

  return jacobsthal;
}

/**
 * Generate the insertion order based on Jacobsthal sequence - Updated version
 * @param {Array} jacobSeq - Jacobsthal sequence
 * @param {number} pairsSize - Number of pairs to process
 * @returns {Array} - Order to process the indices
 */
export function generateInsertionOrder(jacobSeq, pairsSize) {
  const insertionOrder = [];
  const inserted = new Array(pairsSize).fill(false);
  inserted[0] = true; // Mark first pair as already processed

  for (let i = 1; i < jacobSeq.length; i++) {
    const idx = jacobSeq[i];
    if (idx < pairsSize && !inserted[idx]) {
      insertionOrder.push(idx);
      inserted[idx] = true;
    }

    // Fill in between Jacobsthal numbers in descending order
    for (let j = idx - 1; j > jacobSeq[i - 1]; j--) {
      if (j >= 0 && j < pairsSize && !inserted[j]) {
        insertionOrder.push(j);
        inserted[j] = true;
      }
    }
  }

  // Add any remaining indices
  for (let i = 1; i < pairsSize; i++) {
    if (!inserted[i]) insertionOrder.push(i);
  }

  return insertionOrder;
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
    steps.push(
      `mid=${mid}, arr[${mid}]=${arr[mid]}, ${value}${
        value > arr[mid] ? ">" : "<"
      }${arr[mid]}, go ${value > arr[mid] ? "right" : "left"}`
    );

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
 * Ford-Johnson merge-insert sort algorithm implementation - Updated to match your C++ implementation
 * @param {Array} arr - Array to sort
 * @param {Function} recordStep - Function to record each algorithm step
 * @param {number} recursionLevel - Current recursion level
 * @returns {Array} - Sorted array
 */
export function fordJohnsonSort(arr, recordStep, recursionLevel = 0) {
  const prefix =
    recursionLevel > 0 ? `// Recursion Level ${recursionLevel}\n` : "";
  const memoryPrefix =
    recursionLevel > 0 ? { level: `Recursion Level ${recursionLevel}` } : {};

  // Base case for recursion
  if (arr.length <= 1) {
    recordStep({
      title: `${recursionLevel > 0 ? "Recursive " : ""}Base Case`,
      description: "Array has 0 or 1 elements, already sorted.",
      code: `${prefix}// Array size <= 1, already sorted\nreturn ${JSON.stringify(
        arr
      )};`,
      memoryState: {
        ...memoryPrefix,
        _vec: arr.slice(),
        straggler: null,
        pairs: [],
        mainChain: [],
        operations: [
          "Check if array size is 0 or 1",
          "Since array is already sorted, return it immediately",
        ],
        changes: [],
      },
      callStack: generateCallStack(recursionLevel),
    });
    return arr.slice();
  }

  recordStep({
    title: `${recursionLevel > 0 ? "Recursive " : ""}Initial Input`,
    description: `The algorithm starts with ${arr.length} elements to sort.`,
    code: `${prefix}sortVector(${JSON.stringify(arr)})`,
    memoryState: {
      ...memoryPrefix,
      _vec: arr.slice(),
      straggler: null,
      pairs: [],
      mainChain: [],
      operations: [
        "Initialize algorithm with input array",
        "Check array size and determine next steps",
      ],
      changes: [],
    },
    callStack: generateCallStack(recursionLevel),
  });

  // Handle odd-sized array
  let hasStraggler = false;
  let straggler = null;
  let workingArr = arr.slice();
  let operations = [];
  let changes = [];

  if (workingArr.length % 2 !== 0) {
    hasStraggler = true;
    straggler = workingArr[workingArr.length - 1];
    const oldArr = workingArr.slice();
    workingArr = workingArr.slice(0, workingArr.length - 1);

    operations = [
      `Detect that array size (${arr.length}) is odd`,
      `Remove last element (${straggler}) as straggler`,
      `Remaining array has ${workingArr.length} elements`,
    ];

    changes = [
      { variable: "straggler", from: "null", to: straggler.toString() },
      {
        variable: "_vec",
        from: JSON.stringify(oldArr),
        to: JSON.stringify(workingArr),
      },
    ];

    recordStep({
      title: `${recursionLevel > 0 ? "Recursive " : ""}Handle Odd-sized Array`,
      description:
        "If the array has an odd number of elements, remove the last element and save it as a straggler.",
      code: `${prefix}// Size is odd (${arr.length} elements)\nstraggler = _vec.back(); // ${straggler}\n_vec.pop_back();`,
      memoryState: {
        ...memoryPrefix,
        _vec: workingArr.slice(),
        straggler: straggler,
        pairs: [],
        mainChain: [],
        activeIndices: { straggler: true },
        operations,
        changes,
      },
      callStack: generateCallStack(recursionLevel, "handleStragglerElement()"),
    });
  } else {
    operations = [
      `Detect that array size (${arr.length}) is even`,
      `No need to extract straggler element`,
    ];

    recordStep({
      title: `${recursionLevel > 0 ? "Recursive " : ""}Check Array Size`,
      description:
        "The array has an even number of elements, so we can directly form pairs.",
      code: `${prefix}// Size is even (${arr.length} elements)\n// No straggler needed`,
      memoryState: {
        ...memoryPrefix,
        _vec: workingArr.slice(),
        straggler: null,
        pairs: [],
        mainChain: [],
        operations,
        changes: [],
      },
      callStack: generateCallStack(recursionLevel, "checkArraySize()"),
    });
  }

  // Form pairs from consecutive elements
  const pairs = [];
  operations = [];
  changes = [];

  for (let i = 0; i < workingArr.length; i += 2) {
    const first = workingArr[i];
    const second = workingArr[i + 1];

    operations.push(
      `Form pair (${first}, ${second}) from indices ${i} and ${i + 1}`
    );
    pairs.push([first, second]);
  }

  changes = [{ variable: "pairs", from: "[]", to: JSON.stringify(pairs) }];

  recordStep({
    title: `${recursionLevel > 0 ? "Recursive " : ""}Form Pairs`,
    description: "Group elements into pairs from consecutive positions.",
    code: `${prefix}// Form pairs from consecutive elements\nfor (size_t i = 0; i < _vec.size(); i += 2) {\n  int first = _vec[i];\n  int second = _vec[i + 1];\n  pairs.push_back(std::make_pair(first, second));\n}`,
    memoryState: {
      ...memoryPrefix,
      _vec: workingArr.slice(),
      straggler: straggler,
      pairs: pairs.map((pair) => pair.slice()),
      mainChain: [],
      activeIndices: { vec: Array.from(Array(workingArr.length).keys()) },
      operations,
      changes,
    },
    callStack: generateCallStack(recursionLevel, "formSortedPairs()"),
  });

  // Sort elements within each pair
  const sortedPairs = [];
  operations = [];
  changes = [];

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    let sortedPair;

    if (pair[0] > pair[1]) {
      sortedPair = [pair[0], pair[1]];
      operations.push(
        `Pair ${i}: ${pair[0]} > ${pair[1]}, keep order (${pair[0]}, ${pair[1]})`
      );
    } else {
      sortedPair = [pair[1], pair[0]];
      operations.push(
        `Pair ${i}: ${pair[0]} < ${pair[1]}, swap to (${pair[1]}, ${pair[0]})`
      );
    }

    sortedPairs.push(sortedPair);
  }

  changes = [
    {
      variable: "pairs",
      from: JSON.stringify(pairs),
      to: JSON.stringify(sortedPairs),
    },
  ];

  recordStep({
    title: `${recursionLevel > 0 ? "Recursive " : ""}Sort Within Pairs`,
    description: "For each pair, ensure the larger element is first.",
    code: `${prefix}// Sort elements within each pair\nfor (size_t i = 0; i < pairs.size(); i++) {\n  if (pairs[i].first < pairs[i].second)\n    std::swap(pairs[i].first, pairs[i].second);\n}`,
    memoryState: {
      ...memoryPrefix,
      _vec: workingArr.slice(),
      straggler: straggler,
      pairs: sortedPairs.map((pair) => pair.slice()),
      mainChain: [],
      activeIndices: { pairs: 0 },
      operations,
      changes,
    },
    callStack: generateCallStack(recursionLevel, "formSortedPairs()"),
  });

  // Extract main chain (larger elements from each pair)
  const mainChain = [];
  operations = [];
  changes = [];

  for (let i = 0; i < sortedPairs.length; i++) {
    const largerElement = sortedPairs[i][0];
    mainChain.push(largerElement);
    operations.push(`Extract larger element ${largerElement} from pair ${i}`);
  }

  changes = [
    { variable: "mainChain", from: "[]", to: JSON.stringify(mainChain) },
  ];

  recordStep({
    title: `${recursionLevel > 0 ? "Recursive " : ""}Extract Main Chain`,
    description: "Create the main chain from the larger elements of each pair.",
    code: `${prefix}// Extract larger elements to form main chain\nfor (size_t i = 0; i < pairs.size(); i++) {\n  mainChain.push_back(pairs[i].first);\n}`,
    memoryState: {
      ...memoryPrefix,
      _vec: workingArr.slice(),
      straggler: straggler,
      pairs: sortedPairs.map((pair) => pair.slice()),
      mainChain: mainChain.slice(),
      activeIndices: {
        mainChain: null,
        pairs: Array.from(Array(sortedPairs.length).keys()),
      },
      operations,
      changes,
    },
    callStack: generateCallStack(recursionLevel, "extractMainChain()"),
  });

  // Recursively sort main chain
  let sortedMainChain = mainChain.slice();

  if (mainChain.length > 1) {
    operations = [
      `Main chain has ${mainChain.length} elements and needs to be sorted`,
      `Prepare for recursive sorting of main chain`,
    ];

    changes = [
      {
        variable: "_vec",
        from: JSON.stringify(workingArr),
        to: JSON.stringify(mainChain),
      },
    ];

    recordStep({
      title: `${recursionLevel > 0 ? "Recursive " : ""}Prepare Recursive Call`,
      description:
        "Recursively sort the main chain by reassigning it to _vec and calling sortVector again.",
      code: `${prefix}// Recursively sort main chain\nif (mainChain.size() > 1) {\n  _vec = mainChain;\n  sortVector();\n  mainChain = _vec;\n  _vec.clear();\n}`,
      memoryState: {
        ...memoryPrefix,
        _vec: mainChain.slice(),
        straggler: straggler,
        pairs: sortedPairs.map((pair) => pair.slice()),
        mainChain: mainChain.slice(),
        activeIndices: {
          mainChain: Array.from(Array(mainChain.length).keys()),
        },
        operations,
        changes,
      },
      callStack: generateCallStack(recursionLevel, "sortMainChain()"),
    });

    // Recursive call
    sortedMainChain = fordJohnsonSort(
      mainChain,
      recordStep,
      recursionLevel + 1
    );

    operations = [
      `Received sorted main chain from recursive call`,
      `Update main chain with sorted result`,
    ];

    changes = [
      {
        variable: "mainChain",
        from: JSON.stringify(mainChain),
        to: JSON.stringify(sortedMainChain),
      },
    ];

    recordStep({
      title: `${recursionLevel > 0 ? "Recursive " : ""}Main Chain Sorted`,
      description: "Received sorted main chain from recursive call.",
      code: `${prefix}// Main chain sorted by recursive call\nmainChain = ${JSON.stringify(
        sortedMainChain
      )};\n_vec.clear();`,
      memoryState: {
        ...memoryPrefix,
        _vec: [],
        straggler: straggler,
        pairs: sortedPairs.map((pair) => pair.slice()),
        mainChain: sortedMainChain.slice(),
        activeIndices: {
          mainChain: Array.from(Array(sortedMainChain.length).keys()),
        },
        operations,
        changes,
      },
      callStack: generateCallStack(recursionLevel),
    });
  } else if (mainChain.length === 1) {
    operations = [
      `Main chain has only 1 element, already sorted`,
      `No need for recursive sorting`,
    ];

    recordStep({
      title: `${recursionLevel > 0 ? "Recursive " : ""}Skip Recursive Call`,
      description: "Main chain has only one element, so it's already sorted.",
      code: `${prefix}// Main chain has only one element\n// Skip recursive call, already sorted`,
      memoryState: {
        ...memoryPrefix,
        _vec: workingArr.slice(),
        straggler: straggler,
        pairs: sortedPairs.map((pair) => pair.slice()),
        mainChain: sortedMainChain.slice(),
        activeIndices: { mainChain: 0 },
        operations,
        changes: [],
      },
      callStack: generateCallStack(recursionLevel, "checkMainChainSize()"),
    });
  }

  // Initialize result with first element from sorted main chain
  let result = [];
  operations = [];
  changes = [];

  if (sortedMainChain.length > 0) {
    result.push(sortedMainChain[0]);

    operations = [
      `Initialize result array with first element from sorted main chain: ${sortedMainChain[0]}`,
    ];

    changes = [{ variable: "result", from: "[]", to: JSON.stringify(result) }];

    recordStep({
      title: `${recursionLevel > 0 ? "Recursive " : ""}Initialize Result`,
      description:
        "Begin insertion phase by initializing result with first main chain element.",
      code: `${prefix}// Initialize result\nresult.push_back(mainChain[0]); // ${sortedMainChain[0]}`,
      memoryState: {
        ...memoryPrefix,
        _vec: [],
        straggler: straggler,
        pairs: sortedPairs.map((pair) => pair.slice()),
        mainChain: sortedMainChain.slice(),
        result: result.slice(),
        activeIndices: {
          mainChain: 0,
          result: 0,
        },
        operations,
        changes,
      },
      callStack: generateCallStack(
        recursionLevel,
        "insertElementsUsingFordJohnson()"
      ),
    });
  }

  // Insert first smaller element at beginning
  if (sortedPairs.length > 0) {
    const oldResult = result.slice();
    result.unshift(sortedPairs[0][1]);

    operations = [
      `Insert first smaller element (${sortedPairs[0][1]}) at beginning of result`,
    ];

    changes = [
      {
        variable: "result",
        from: JSON.stringify(oldResult),
        to: JSON.stringify(result),
      },
    ];

    recordStep({
      title: `${
        recursionLevel > 0 ? "Recursive " : ""
      }Insert First Smaller Element`,
      description:
        "Insert the first smaller element at the beginning of the result.",
      code: `${prefix}// Insert first smaller element\nresult.insert(result.begin(), pairs[0].second); // ${sortedPairs[0][1]}`,
      memoryState: {
        ...memoryPrefix,
        _vec: [],
        straggler: straggler,
        pairs: sortedPairs.map((pair) => pair.slice()),
        mainChain: sortedMainChain.slice(),
        result: result.slice(),
        activeIndices: {
          pairs: 0,
          result: 0,
        },
        operations,
        changes,
      },
      callStack: generateCallStack(
        recursionLevel,
        "insertElementsUsingFordJohnson()"
      ),
    });
  }

  // For remaining elements, use Jacobsthal sequence for insertion order
  if (sortedPairs.length > 1) {
    // Generate Jacobsthal sequence for insertion order
    let jacobsthalSize = 3;
    const jacobSeq = getJacobsthalSequence(jacobsthalSize);

    while (jacobSeq[jacobSeq.length - 1] < sortedPairs.length) {
      jacobsthalSize++;
      jacobSeq.push(
        jacobSeq[jacobsthalSize - 1] + 2 * jacobSeq[jacobsthalSize - 2]
      );
    }

    operations = [
      `Generate Jacobsthal sequence for optimized insertion order`,
      `Sequence: ${jacobSeq.slice(0, 6).join(", ")}${
        jacobSeq.length > 6 ? "..." : ""
      }`,
    ];

    changes = [
      {
        variable: "jacobsthal",
        from: "undefined",
        to: JSON.stringify(jacobSeq.slice(0, jacobsthalSize)),
      },
    ];

    recordStep({
      title: `${
        recursionLevel > 0 ? "Recursive " : ""
      }Generate Jacobsthal Sequence`,
      description:
        "Generate the Jacobsthal sequence to determine insertion order.",
      code: `${prefix}// Generate Jacobsthal sequence\nint jacobsthalSize = 3;\nwhile (getJacobsthalSequence(jacobsthalSize).back() < (int)pairs.size())\n    jacobsthalSize++;\n\nstd::vector<int> jacobSeq = getJacobsthalSequence(jacobsthalSize);`,
      memoryState: {
        ...memoryPrefix,
        _vec: [],
        straggler: straggler,
        pairs: sortedPairs.map((pair) => pair.slice()),
        mainChain: sortedMainChain.slice(),
        result: result.slice(),
        jacobsthal: jacobSeq.slice(0, jacobsthalSize),
        insertionOrder: [],
        activeIndices: {},
        operations,
        changes,
      },
      callStack: generateCallStack(
        recursionLevel,
        "insertElementsUsingFordJohnson()",
        "generateInsertionOrder()"
      ),
    });

    // Calculate insertion order based on Jacobsthal sequence - Updated to match your C++ implementation
    const insertionOrder = generateInsertionOrder(jacobSeq, sortedPairs.length);

    operations = [
      `Calculate optimal insertion order based on Jacobsthal sequence`,
      `Insertion order: ${insertionOrder.join(", ")}`,
    ];

    changes = [
      {
        variable: "insertionOrder",
        from: "[]",
        to: JSON.stringify(insertionOrder),
      },
    ];

    recordStep({
      title: `${
        recursionLevel > 0 ? "Recursive " : ""
      }Determine Insertion Order`,
      description:
        "Using Jacobsthal sequence to determine the optimal insertion order for efficiency.",
      code: `${prefix}// Determine insertion order\nstd::vector<int> insertionOrder = generateInsertionOrder(jacobSeq, pairs.size());`,
      memoryState: {
        ...memoryPrefix,
        _vec: [],
        straggler: straggler,
        pairs: sortedPairs.map((pair) => pair.slice()),
        mainChain: sortedMainChain.slice(),
        result: result.slice(),
        jacobsthal: jacobSeq.slice(0, jacobsthalSize),
        insertionOrder: insertionOrder.slice(),
        activeIndices: {
          insertionOrder: Array.from(Array(insertionOrder.length).keys()),
        },
        operations,
        changes,
      },
      callStack: generateCallStack(
        recursionLevel,
        "insertElementsUsingFordJohnson()"
      ),
    });

    // Insert elements according to Jacobsthal sequence
    for (let i = 0; i < insertionOrder.length; i++) {
      const idx = insertionOrder[i];

      // Insert main chain element
      const mainChainElement = sortedMainChain[idx];
      const oldResult = result.slice();
      const mainChainSearch = binarySearch(result, mainChainElement);
      const mainChainPos = mainChainSearch.position;
      result.splice(mainChainPos, 0, mainChainElement);

      operations = [
        `Insert main chain element ${mainChainElement} from index ${idx}`,
        `Binary search to find position: ${mainChainSearch.steps.join(" → ")}`,
        `Insert at position ${mainChainPos} in result array`,
      ];

      changes = [
        {
          variable: "result",
          from: JSON.stringify(oldResult),
          to: JSON.stringify(result),
        },
      ];

      recordStep({
        title: `${
          recursionLevel > 0 ? "Recursive " : ""
        }Insert Main Chain Element (Idx ${idx})`,
        description: `Insert main chain element at index ${idx} using binary search.`,
        code: `${prefix}// Binary search for mainChain[${idx}] (${mainChainElement})\nstd::vector<int>::iterator pos = std::lower_bound(result.begin(), result.end(), mainChain[${idx}]);\nresult.insert(pos, mainChain[${idx}]);`,
        memoryState: {
          ...memoryPrefix,
          _vec: [],
          straggler: straggler,
          pairs: sortedPairs.map((pair) => pair.slice()),
          mainChain: sortedMainChain.slice(),
          result: result.slice(),
          insertionOrder: insertionOrder.slice(),
          activeIndices: {
            mainChain: idx,
            result: mainChainPos,
            insertionOrder: i,
          },
          operations,
          changes,
          binarySearch: {
            value: mainChainElement,
            array: oldResult,
            steps: mainChainSearch.steps,
          },
        },
        callStack: generateCallStack(
          recursionLevel,
          "insertElementsUsingFordJohnson()"
        ),
      });

      // Insert smaller element
      const smallerElement = sortedPairs[idx][1];
      const oldResult2 = result.slice();
      const smallerSearch = binarySearch(result, smallerElement);
      const smallerPos = smallerSearch.position;
      result.splice(smallerPos, 0, smallerElement);

      operations = [
        `Insert smaller element ${smallerElement} from pair at index ${idx}`,
        `Binary search to find position: ${smallerSearch.steps.join(" → ")}`,
        `Insert at position ${smallerPos} in result array`,
      ];

      changes = [
        {
          variable: "result",
          from: JSON.stringify(oldResult2),
          to: JSON.stringify(result),
        },
      ];

      recordStep({
        title: `${
          recursionLevel > 0 ? "Recursive " : ""
        }Insert Smaller Element (Idx ${idx})`,
        description: `Insert smaller element from pair at index ${idx} using binary search.`,
        code: `${prefix}// Binary search for pairs[${idx}].second (${smallerElement})\npos = std::lower_bound(result.begin(), result.end(), pairs[${idx}].second);\nresult.insert(pos, pairs[${idx}].second);`,
        memoryState: {
          ...memoryPrefix,
          _vec: [],
          straggler: straggler,
          pairs: sortedPairs.map((pair) => pair.slice()),
          mainChain: sortedMainChain.slice(),
          result: result.slice(),
          insertionOrder: insertionOrder.slice(),
          activeIndices: {
            pairs: idx,
            result: smallerPos,
            insertionOrder: i,
          },
          operations,
          changes,
          binarySearch: {
            value: smallerElement,
            array: oldResult2,
            steps: smallerSearch.steps,
          },
        },
        callStack: generateCallStack(
          recursionLevel,
          "insertElementsUsingFordJohnson()"
        ),
      });
    }
  }

  // Insert straggler if exists
  if (hasStraggler) {
    const oldResult = result.slice();
    const stragglerSearch = binarySearch(result, straggler);
    const stragglerPos = stragglerSearch.position;
    result.splice(stragglerPos, 0, straggler);

    operations = [
      `Insert straggler element ${straggler}`,
      `Binary search to find position: ${stragglerSearch.steps.join(" → ")}`,
      `Insert at position ${stragglerPos} in result array`,
    ];

    changes = [
      {
        variable: "result",
        from: JSON.stringify(oldResult),
        to: JSON.stringify(result),
      },
    ];

    recordStep({
      title: `${recursionLevel > 0 ? "Recursive " : ""}Insert Straggler`,
      description:
        "Insert the straggler element at the correct position using binary search.",
      code: `${prefix}// Insert straggler\nstd::vector<int>::iterator pos = std::lower_bound(result.begin(), result.end(), straggler);\nresult.insert(pos, straggler);`,
      memoryState: {
        ...memoryPrefix,
        _vec: [],
        straggler: straggler,
        pairs: sortedPairs.map((pair) => pair.slice()),
        mainChain: sortedMainChain.slice(),
        result: result.slice(),
        activeIndices: {
          straggler: true,
          result: stragglerPos,
        },
        operations,
        changes,
        binarySearch: {
          value: straggler,
          array: oldResult,
          steps: stragglerSearch.steps,
        },
      },
      callStack: generateCallStack(
        recursionLevel,
        "insertElementsUsingFordJohnson()"
      ),
    });
  }

  // Return sorted result
  operations = [
    `Set final result as the output vector`,
    `Algorithm completed successfully`,
  ];

  changes = [{ variable: "_vec", from: "[]", to: JSON.stringify(result) }];

  recordStep({
    title: `${
      recursionLevel > 0
        ? "Return From Recursion Level " + recursionLevel
        : "Return Final Result"
    }`,
    description: `Set _vec to the final sorted result${
      recursionLevel > 0
        ? " and return to previous recursion level"
        : " and return"
    }.`,
    code: `${prefix}// Set _vec to final result\n_vec = result;\n// Return ${
      recursionLevel > 0 ? "to previous level" : "to main"
    }`,
    memoryState: {
      ...memoryPrefix,
      _vec: result.slice(),
      straggler: null,
      pairs: [],
      mainChain: [],
      result: result.slice(),
      operations,
      changes,
    },
    callStack:
      recursionLevel > 0
        ? generateCallStack(recursionLevel - 1, "sortMainChain()")
        : ["main()"],
  });

  return result;
}

/**
 * Generate the call stack based on recursion level
 * @param {number} recursionLevel - Current recursion level
 * @param {string} currentFunction - Current function being executed
 * @param {string} subFunction - Sub-function being executed if any
 * @returns {Array} - Call stack representation
 */
function generateCallStack(
  recursionLevel,
  currentFunction = "",
  subFunction = ""
) {
  const callStack = ["main()"];

  // Add main level
  callStack.push("sortVector() - Main Level");

  // Add recursive levels
  for (let i = 1; i <= recursionLevel; i++) {
    callStack.push(`sortMainChain() - Level ${i - 1}`);
    callStack.push(`sortVector() - Recursive Level ${i}`);
  }

  // Add current function
  if (currentFunction) {
    callStack.push(currentFunction);

    // Add sub-function if present
    if (subFunction) {
      callStack.push(subFunction);
    }
  }

  return callStack;
}
