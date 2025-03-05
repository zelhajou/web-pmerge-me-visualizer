import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, SkipBack, SkipForward, Play, Pause, Code } from 'lucide-react';
import JacobsthalVisualization from './Visualization';

/**
 * Enhanced Ford-Johnson Algorithm Demo
 * A self-contained, simplified visualization that can be embedded anywhere
 */
const FordJohnsonDemo = ({ initialArray = [5, 3, 8, 2, 1, 9, 4] }) => {
  // State
  const [inputArray, setInputArray] = useState(initialArray);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.5);
  const [steps, setSteps] = useState([]);
  const [showJacobsthalDetail, setShowJacobsthalDetail] = useState(false);
  
  // Generate enhanced steps for demo when input array changes
  useEffect(() => {
    setSteps(generateEnhancedSteps(inputArray));
    setCurrentStep(0);
  }, [inputArray]);
  
  // Auto-play functionality
  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 1000 / playbackSpeed);
    } else if (isPlaying && currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length, playbackSpeed]);

  // Navigation functions
  const togglePlayback = () => setIsPlaying(!isPlaying);
  const goToFirstStep = () => setCurrentStep(0);
  const goToLastStep = () => setCurrentStep(steps.length - 1);
  const goToNextStep = () => setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
  const goToPrevStep = () => setCurrentStep(Math.max(currentStep - 1, 0));
  
  // Get current step data
  const currentStepData = steps[currentStep] || {
    title: "Loading...",
    description: "Preparing algorithm steps",
    code: "",
    memoryState: {},
    callStack: ["main()"]
  };
  
  // Check if current step involves Jacobsthal sequence
  const hasJacobsthalData = currentStepData.memoryState && 
                           (currentStepData.memoryState.jacobsthal || 
                            currentStepData.title.includes("Jacobsthal"));
  
  // Handle input change
  const handleInputChange = (e) => {
    const input = e.target.value.split(',').map(num => parseInt(num.trim()));
    if (input.every(num => !isNaN(num))) {
      setInputArray(input);
    }
  };
  
  // Render memory state visualization
  const renderMemoryState = (memoryState) => {
    if (!memoryState) return null;
    
    // Helper function to highlight active elements
    const highlightActive = (array, activeIndices = []) => {
      return array.map((value, idx) => (
        <div key={idx} className="flex flex-col items-center mr-1 mb-1">
          <div className={`${activeIndices.includes(idx) ? 'ring-2 ring-red-500' : ''} 
                        px-3 py-1 rounded-md font-mono
                        bg-purple-100 text-purple-800`}>
            {value}
          </div>
          <div className="text-xs text-gray-500">{idx}</div>
        </div>
      ));
    };
    
    return (
      <div className="space-y-3 p-4">
        {/* Operations */}
        {memoryState.operations && memoryState.operations.length > 0 && (
          <div className="bg-blue-50 p-2 rounded-md border border-blue-100 mb-3">
            <h4 className="text-sm font-semibold text-blue-800 mb-1">Current Operations:</h4>
            <ul className="list-disc list-inside text-xs space-y-1">
              {memoryState.operations.map((op, idx) => (
                <li key={idx} className="text-gray-700">{op}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Variable Changes */}
        {memoryState.changes && memoryState.changes.length > 0 && (
          <div className="bg-green-50 p-2 rounded-md border border-green-100 mb-3">
            <h4 className="text-sm font-semibold text-green-800 mb-1">Variable Changes:</h4>
            {memoryState.changes.map((change, idx) => (
              <div key={idx} className="flex items-center mb-1 text-xs">
                <span className="font-mono font-bold mr-2">{change.variable}:</span>
                <span className="bg-red-100 line-through px-1 py-0.5 rounded mr-1 truncate max-w-[100px]">
                  {change.from}
                </span>
                <span className="text-green-600">→</span>
                <span className="bg-green-100 px-1 py-0.5 rounded ml-1 truncate max-w-[100px]">
                  {change.to}
                </span>
              </div>
            ))}
          </div>
        )}
        
        {/* Main array */}
        {memoryState._vec !== undefined && (
          <div className="flex items-center mb-3">
            <span className="font-mono font-bold mr-2 w-24">_vec:</span>
            <div className="flex flex-wrap">
              {memoryState._vec.length > 0 ? 
                highlightActive(memoryState._vec, memoryState.activeIndices?.vec) :
                <div className="text-gray-500 italic">empty</div>
              }
            </div>
          </div>
        )}
        
        {/* Straggler visualization */}
        {memoryState.straggler !== undefined && (
          <div className="flex items-center mb-3">
            <span className="font-mono font-bold mr-2 w-24">straggler:</span>
            <div className={`${memoryState.activeIndices?.straggler ? 'ring-2 ring-red-500' : ''} 
                            bg-yellow-100 px-3 py-1 rounded-md text-yellow-800 font-mono`}>
              {memoryState.straggler !== null ? memoryState.straggler : 'null'}
            </div>
          </div>
        )}
        
        {/* Pairs visualization */}
        {memoryState.pairs && memoryState.pairs.length > 0 && (
          <div className="flex items-start mb-3">
            <span className="font-mono font-bold mr-2 w-24">pairs:</span>
            <div className="flex flex-wrap">
              {memoryState.pairs.map((pair, idx) => (
                <div key={idx} className="flex flex-col items-center mr-2 mb-2">
                  <div className={`${memoryState.activeIndices?.pairs === idx ? 'ring-2 ring-red-500' : ''} 
                                  bg-blue-100 px-3 py-1 rounded-md text-blue-800 font-mono flex`}>
                    ({pair[0]}, {pair[1]})
                  </div>
                  <div className="text-xs text-gray-500">{idx}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Main chain visualization */}
        {memoryState.mainChain && memoryState.mainChain.length > 0 && (
          <div className="flex items-center mb-3">
            <span className="font-mono font-bold mr-2 w-24">mainChain:</span>
            <div className="flex flex-wrap">
              {memoryState.mainChain.map((value, idx) => (
                <div key={idx} className="flex flex-col items-center mr-1 mb-1">
                  <div className={`${memoryState.activeIndices?.mainChain === idx ? 'ring-2 ring-red-500' : ''} 
                                  bg-green-100 px-3 py-1 rounded-md text-green-800 font-mono`}>
                    {value}
                  </div>
                  <div className="text-xs text-gray-500">{idx}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Jacobsthal sequence visualization (simple version) */}
        {memoryState.jacobsthal && memoryState.jacobsthal.length > 0 && !showJacobsthalDetail && (
          <div className="flex items-center mb-3">
            <span className="font-mono font-bold mr-2 w-24">jacobsthal:</span>
            <div className="flex flex-wrap items-center">
              {memoryState.jacobsthal.map((value, idx) => (
                <div key={idx} className="flex flex-col items-center mr-1 mb-1">
                  <div className={`${memoryState.activeIndices?.jacobsthal === idx ? 'ring-2 ring-red-500' : ''} 
                                  bg-indigo-100 px-3 py-1 rounded-md text-indigo-800 font-mono`}>
                    {value}
                  </div>
                  <div className="text-xs text-gray-500">J({idx})</div>
                </div>
              ))}
              <button 
                className="ml-3 text-xs text-blue-600 underline"
                onClick={() => setShowJacobsthalDetail(true)}
              >
                Show detailed visualization
              </button>
            </div>
          </div>
        )}
        
        {/* Result visualization */}
        {memoryState.result && (
          <div className="flex items-center mb-3">
            <span className="font-mono font-bold mr-2 w-24">result:</span>
            <div className="flex flex-wrap">
              {memoryState.result.map((value, idx) => (
                <div key={idx} className="flex flex-col items-center mr-1 mb-1">
                  <div className={`${memoryState.activeIndices?.result === idx ? 'ring-2 ring-red-500' : ''} 
                                  bg-red-100 px-3 py-1 rounded-md text-red-800 font-mono`}>
                    {value}
                  </div>
                  <div className="text-xs text-gray-500">{idx}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Binary search visualization */}
        {memoryState.binarySearch && (
          <div className="bg-blue-50 p-2 rounded-md border border-blue-100 mb-3">
            <h4 className="text-sm font-semibold text-blue-800 mb-1">Binary Search:</h4>
            <div className="text-xs">
              <div>Searching for: <span className="font-mono bg-blue-100 px-1 rounded">{memoryState.binarySearch.value}</span></div>
              <div className="flex flex-wrap mt-1 mb-1">
                <span className="mr-1">Array:</span>
                {memoryState.binarySearch.array.map((v, i) => (
                  <span key={i} className="bg-gray-100 px-1 mr-1 font-mono rounded">{v}</span>
                ))}
              </div>
              <div>Steps:</div>
              <ul className="list-disc list-inside">
                {memoryState.binarySearch.steps.map((step, i) => (
                  <li key={i} className="text-xs">{step}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {/* Recursion level indicator */}
        {memoryState.level && (
          <div className="mt-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-md font-semibold">
            {memoryState.level}
          </div>
        )}
      </div>
    );
  };
  
  // Render call stack visualization
  const renderCallStack = (callStack) => {
    return (
      <div className="border rounded-md overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 text-sm font-semibold border-b">Call Stack</div>
        <div className="p-2">
          {callStack.slice().reverse().map((call, idx) => (
            <div 
              key={idx} 
              className={`px-3 py-1.5 font-mono text-xs ${idx === 0 ? 'bg-green-100' : ''} ${idx > 0 ? 'border-t' : ''}`}
            >
              {call}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="mx-auto max-w-full p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-2">Ford-Johnson Algorithm Demo</h2>
      <p className="text-gray-600 mb-4 text-sm">Step-by-step visualization of the merge-insert sort algorithm</p>
      
      {/* Input field */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Input Array:</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-md"
          value={inputArray.join(', ')}
          onChange={handleInputChange}
          placeholder="Enter numbers separated by commas"
        />
      </div>
      
      {/* Controls section */}
      <div className="mb-4 p-3 bg-gray-50 rounded-md shadow-sm">
        <div className="flex justify-center items-center gap-2">
          <button 
            onClick={goToFirstStep}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md"
            title="First Step"
          >
            <SkipBack size={16} />
          </button>
          <button 
            onClick={goToPrevStep}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md"
            title="Previous Step"
            disabled={currentStep === 0}
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={togglePlayback}
            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md flex items-center gap-1 px-3"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            <span className="text-sm">{isPlaying ? "Pause" : "Play"}</span>
          </button>
          <button 
            onClick={goToNextStep}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md"
            title="Next Step"
            disabled={currentStep === steps.length - 1}
          >
            <ChevronRight size={16} />
          </button>
          <button 
            onClick={goToLastStep}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md"
            title="Last Step"
          >
            <SkipForward size={16} />
          </button>
          <select
            className="ml-2 px-2 py-1 text-sm border rounded-md"
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
          >
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
          <div className="ml-2 text-sm text-gray-700">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
      </div>
      
      {/* Step info header */}
      <div className="bg-white border rounded-t-md p-3">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-gray-800">{currentStepData.title}</h2>
          <p className="text-gray-600 text-sm">{currentStepData.description}</p>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div 
              className="bg-blue-600 h-1.5 rounded-full" 
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border rounded-md p-2 bg-white">
        {/* Code panel */}
        <div className="md:col-span-1">
          <div className="border rounded-md overflow-hidden h-full">
            <div className="bg-gray-100 px-3 py-2 text-sm font-semibold border-b flex items-center">
              <Code size={16} className="mr-2" /> Current Code
            </div>
            <pre className="bg-gray-50 font-mono text-xs p-3 overflow-x-auto h-48 overflow-y-auto">
              {currentStepData.code}
            </pre>
          </div>
          
          {/* Call stack */}
          <div className="mt-3">
            {renderCallStack(currentStepData.callStack)}
          </div>
        </div>
        
        {/* Memory state panel */}
        <div className="md:col-span-2">
          <div className="border rounded-md overflow-hidden h-full">
            <div className="bg-gray-100 px-3 py-2 text-sm font-semibold border-b">Memory State</div>
            <div className="bg-white overflow-auto h-80">
              {renderMemoryState(currentStepData.memoryState)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Detailed Jacobsthal visualization */}
      {hasJacobsthalData && showJacobsthalDetail && (
        <div className="mt-4">
          <JacobsthalVisualization 
            jacobsthal={currentStepData.memoryState.jacobsthal} 
            insertionOrder={currentStepData.memoryState.insertionOrder}
            activeIndex={currentStepData.memoryState.activeIndices?.insertionOrder}
          />
          <div className="flex justify-end mt-2">
            <button 
              className="text-xs text-gray-600 underline"
              onClick={() => setShowJacobsthalDetail(false)}
            >
              Hide detailed visualization
            </button>
          </div>
        </div>
      )}
      
      {/* Algorithm explanation */}
      <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm">
        <h3 className="font-semibold mb-2">About Ford-Johnson Algorithm</h3>
        <p className="mb-2">
          The Ford-Johnson algorithm (also known as merge-insertion sort) is designed to minimize the number of comparisons
          needed to sort an array. It works by:
        </p>
        <ol className="list-decimal list-inside space-y-1 mb-2">
          <li>Grouping elements into pairs</li>
          <li>Creating a "main chain" of the larger elements from each pair</li>
          <li>Recursively sorting the main chain</li>
          <li>Efficiently inserting the smaller elements using the Jacobsthal sequence</li>
        </ol>
        <p className="text-xs text-gray-600">
          This algorithm approaches the theoretical minimum number of comparisons needed for a
          comparison-based sorting algorithm.
        </p>
      </div>
    </div>
  );
};

/**
 * Generate enhanced steps with more detailed information for each step
 * @param {Array} inputArray - The array to sort
 * @returns {Array} - Algorithm steps with detailed visualization data
 */
function generateEnhancedSteps(inputArray) {
  // Basic steps structure similar to original but with added details
  const hasStraggler = inputArray.length % 2 !== 0;
  const straggler = hasStraggler ? inputArray[inputArray.length - 1] : null;
  const workingArray = hasStraggler ? inputArray.slice(0, inputArray.length - 1) : inputArray.slice();
  
  const steps = [];
  
  // Initial step
  steps.push({
    title: "Initial Input",
    description: "The algorithm starts with an unsorted array.",
    code: `// Ford-Johnson sort begins\nsortVector([${inputArray.join(', ')}]);`,
    memoryState: {
      _vec: inputArray.slice(),
      straggler: null,
      pairs: [],
      mainChain: [],
      operations: [
        "Initialize algorithm with input array",
        `Array has ${inputArray.length} elements`
      ],
      changes: []
    },
    callStack: ["main()", "sortVector() - Main Level"]
  });
  
  // Handle straggler
  steps.push({
    title: "Handle Odd-sized Array",
    description: hasStraggler 
      ? "The array has an odd number of elements, so we remove the last element as a straggler."
      : "The array has an even number of elements, so no straggler is needed.",
    code: hasStraggler
      ? `// Array size is odd (${inputArray.length})\nstraggler = _vec.back(); // ${straggler}\n_vec.pop_back();`
      : `// Array size is even (${inputArray.length})\n// No straggler needed`,
    memoryState: {
      _vec: workingArray,
      straggler: straggler,
      pairs: [],
      mainChain: [],
      activeIndices: hasStraggler ? { straggler: true } : {},
      operations: [
        hasStraggler
          ? `Detect odd-sized array (${inputArray.length} elements)`
          : `Detect even-sized array (${inputArray.length} elements)`,
        hasStraggler
          ? `Extract last element ${straggler} as straggler`
          : `No straggler extraction needed`
      ],
      changes: hasStraggler
        ? [
            { variable: "_vec", from: JSON.stringify(inputArray), to: JSON.stringify(workingArray) },
            { variable: "straggler", from: "null", to: straggler.toString() }
          ]
        : []
    },
    callStack: ["main()", "sortVector() - Main Level", "handleOddSizedArray()"]
  });
  
  // Form pairs
  const rawPairs = [];
  for (let i = 0; i < workingArray.length; i += 2) {
    if (i + 1 < workingArray.length) {
      rawPairs.push([workingArray[i], workingArray[i + 1]]);
    }
  }
  
  steps.push({
    title: "Form Pairs",
    description: "Group elements into pairs from consecutive positions in the array.",
    code: `// Form pairs from consecutive elements\nfor (size_t i = 0; i < _vec.size(); i += 2) {\n  pair<int, int> p = make_pair(_vec[i], _vec[i+1]);\n  pairs.push_back(p);\n}`,
    memoryState: {
      _vec: workingArray,
      straggler: straggler,
      pairs: rawPairs,
      mainChain: [],
      activeIndices: { vec: Array.from({ length: workingArray.length }, (_, i) => i) },
      operations: [
        `Divide array into ${rawPairs.length} pairs`,
        `Each pair contains consecutive elements from the array`
      ],
      changes: [
        { variable: "pairs", from: "[]", to: JSON.stringify(rawPairs) }
      ]
    },
    callStack: ["main()", "sortVector() - Main Level", "formPairs()"]
  });
  
  // Sort within pairs
  const sortedPairs = rawPairs.map(pair => 
    pair[0] > pair[1] ? [pair[0], pair[1]] : [pair[1], pair[0]]
  );
  
  steps.push({
    title: "Sort Within Pairs",
    description: "For each pair, ensure the larger element is first.",
    code: `// Sort elements within each pair\nfor (auto& pair : pairs) {\n  if (pair.first < pair.second)\n    swap(pair.first, pair.second);\n}`,
    memoryState: {
      _vec: workingArray,
      straggler: straggler,
      pairs: sortedPairs,
      mainChain: [],
      activeIndices: { pairs: 0 },
      operations: [
        `Sort elements within each pair, placing larger element first`,
        `This ensures the main chain will contain the larger elements`
      ],
      changes: [
        { variable: "pairs", from: JSON.stringify(rawPairs), to: JSON.stringify(sortedPairs) }
      ]
    },
    callStack: ["main()", "sortVector() - Main Level", "sortPairsInternally()"]
  });
  
  // Extract main chain
  const mainChain = sortedPairs.map(pair => pair[0]);
  
  steps.push({
    title: "Extract Main Chain",
    description: "Create the main chain from the larger elements of each pair.",
    code: `// Extract larger elements to form the main chain\nfor (const auto& pair : pairs) {\n  mainChain.push_back(pair.first);\n}`,
    memoryState: {
      _vec: workingArray,
      straggler: straggler,
      pairs: sortedPairs,
      mainChain: mainChain,
      activeIndices: { 
        pairs: Array.from({ length: sortedPairs.length }, (_, i) => i),
        mainChain: Array.from({ length: mainChain.length }, (_, i) => i)
      },
      operations: [
        `Extract the larger element from each pair to form the main chain`,
        `The main chain will be recursively sorted in the next step`
      ],
      changes: [
        { variable: "mainChain", from: "[]", to: JSON.stringify(mainChain) }
      ]
    },
    callStack: ["main()", "sortVector() - Main Level", "extractMainChain()"]
  });
  
  // Main chain recursively sorted
  const sortedMainChain = [...mainChain].sort((a, b) => a - b);
  
  steps.push({
    title: "Recursively Sort Main Chain",
    description: "The main chain is recursively sorted using the same algorithm.",
    code: `// Recursively sort the main chain\nif (mainChain.size() > 1) {\n  _vec = mainChain;\n  sortVector();\n  mainChain = _vec;\n}\n// After recursion, mainChain = [${sortedMainChain.join(', ')}]`,
    memoryState: {
      _vec: workingArray,
      straggler: straggler,
      pairs: sortedPairs,
      mainChain: sortedMainChain,
      activeIndices: { mainChain: Array.from({ length: sortedMainChain.length }, (_, i) => i) },
      operations: [
        `Recursively apply Ford-Johnson sort to the main chain`,
        `After recursion, main chain is now sorted: [${sortedMainChain.join(', ')}]`
      ],
      changes: [
        { variable: "mainChain", from: JSON.stringify(mainChain), to: JSON.stringify(sortedMainChain) }
      ],
      level: "Recursion summary"
    },
    callStack: ["main()", "sortVector() - Main Level", "sortMainChainRecursively()"]
  });
  
  // Initialize result array
  let result = [];
  if (sortedMainChain.length > 0) {
    result.push(sortedMainChain[0]);
  }
  
  steps.push({
    title: "Initialize Result",
    description: "Initialize the result array with the first element from the sorted main chain.",
    code: `// Initialize result with first element from main chain\nresult.push_back(mainChain[0]); // ${sortedMainChain[0] || ''}`,
    memoryState: {
      _vec: [],
      straggler: straggler,
      pairs: sortedPairs,
      mainChain: sortedMainChain,
      result: result,
      activeIndices: { 
        mainChain: 0,
        result: 0
      },
      operations: [
        `Initialize result array with first element from sorted main chain`,
        `Result array starts with: [${result.join(', ')}]`
      ],
      changes: [
        { variable: "result", from: "[]", to: JSON.stringify(result) }
      ]
    },
    callStack: ["main()", "sortVector() - Main Level", "initializeResult()"]
  });
  
  // Insert first pended element
  if (sortedPairs.length > 0) {
    const oldResult = result.slice();
    result.unshift(sortedPairs[0][1]);
    
    steps.push({
      title: "Insert First Smaller Element",
      description: "Insert the first smaller element at the beginning of the result.",
      code: `// Insert first smaller element at the beginning\nresult.insert(result.begin(), pairs[0].second); // ${sortedPairs[0]?.[1]}`,
      memoryState: {
        _vec: [],
        straggler: straggler,
        pairs: sortedPairs,
        mainChain: sortedMainChain,
        result: result,
        activeIndices: { 
          pairs: 0,
          result: 0
        },
        operations: [
          `Insert first smaller element ${sortedPairs[0]?.[1]} at the beginning of result`,
          `Result array now contains: [${result.join(', ')}]`
        ],
        changes: [
          { variable: "result", from: JSON.stringify(oldResult), to: JSON.stringify(result) }
        ]
      },
      callStack: ["main()", "sortVector() - Main Level", "insertFirstSmaller()"]
    });
  }
  
  // Generate Jacobsthal sequence
  if (sortedPairs.length > 1) {
    // Calculate Jacobsthal sequence
    const jacobsthal = [0, 1];
    for (let i = 2; i <= 10; i++) { // Generate up to J(10)
      jacobsthal.push(jacobsthal[i-1] + 2 * jacobsthal[i-2]);
    }
    
    steps.push({
      title: "Generate Jacobsthal Sequence",
      description: "Generate the Jacobsthal sequence to determine the optimal insertion order.",
      code: `// Generate Jacobsthal sequence for optimal insertion order\n// J(0) = 0\n// J(1) = 1\n// J(n) = J(n-1) + 2*J(n-2) for n ≥ 2\n// Sequence: 0, 1, 1, 3, 5, 11, 21, 43, 85, 171, ...`,
      memoryState: {
        _vec: [],
        straggler: straggler,
        pairs: sortedPairs,
        mainChain: sortedMainChain,
        result: result,
        jacobsthal: jacobsthal,
        operations: [
          `Generate Jacobsthal sequence for optimal insertion order`,
          `This sequence minimizes comparisons during insertion`,
          `Formula: J(n) = J(n-1) + 2*J(n-2) where J(0)=0, J(1)=1`
        ],
        changes: [
          { variable: "jacobsthal", from: "undefined", to: JSON.stringify(jacobsthal) }
        ]
      },
      callStack: ["main()", "sortVector() - Main Level", "generateJacobsthalSequence()"]
    });
    
    // Calculate insertion order using Jacobsthal numbers
    const insertionOrder = [];
    const used = new Array(sortedPairs.length).fill(false);
    used[0] = true; // Mark first pair as already processed
    
    for (let i = 1; i < jacobsthal.length; i++) {
      const idx = jacobsthal[i];
      if (idx < sortedPairs.length && !used[idx]) {
        insertionOrder.push(idx);
        used[idx] = true;
      }
      
      // Fill in between Jacobsthal numbers in descending order
      for (let j = idx - 1; j > jacobsthal[i-1]; j--) {
        if (j > 0 && j < sortedPairs.length && !used[j]) {
          insertionOrder.push(j);
          used[j] = true;
        }
      }
    }
    
    // Add any remaining indices
    for (let i = 1; i < sortedPairs.length; i++) {
      if (!used[i]) {
        insertionOrder.push(i);
      }
    }
    
    steps.push({
      title: "Determine Insertion Order",
      description: "Calculate the optimal order to insert remaining elements using the Jacobsthal sequence.",
      code: `// Use Jacobsthal numbers to determine insertion order\n// First insert elements at Jacobsthal indices\n// Then fill in between in descending order\ninsertionOrder = [${insertionOrder.join(', ')}];`,
      memoryState: {
        _vec: [],
        straggler: straggler,
        pairs: sortedPairs,
        mainChain: sortedMainChain,
        result: result,
        jacobsthal: jacobsthal,
        insertionOrder: insertionOrder,
        operations: [
          `Use Jacobsthal sequence to determine insertion order`,
          `First insert elements at indices from Jacobsthal sequence`,
          `Then fill gaps in descending order`,
          `Final insertion order: [${insertionOrder.join(', ')}]`
        ],
        changes: [
          { variable: "insertionOrder", from: "[]", to: JSON.stringify(insertionOrder) }
        ]
      },
      callStack: ["main()", "sortVector() - Main Level", "determineInsertionOrder()"]
    });
    
    // Insert remaining elements according to Jacobsthal sequence
    let currentResult = result.slice();
    
    // Create individual steps for inserting each element
    for (let i = 0; i < insertionOrder.length; i++) {
      const idx = insertionOrder[i];
      const mainElement = sortedMainChain[idx];
      const smallerElement = sortedPairs[idx][1];
      
      // Find position for main chain element (if not already in result)
      if (!currentResult.includes(mainElement)) {
        let mainPos = 0;
        while (mainPos < currentResult.length && currentResult[mainPos] < mainElement) {
          mainPos++;
        }
        
        const beforeMainInsert = currentResult.slice();
        currentResult.splice(mainPos, 0, mainElement);
        
        steps.push({
          title: `Insert Main Chain Element (${mainElement})`,
          description: `Insert main chain element ${mainElement} from pair at index ${idx}.`,
          code: `// Binary search to find position for mainChain[${idx}]\npos = std::lower_bound(result.begin(), result.end(), ${mainElement});\nresult.insert(pos, ${mainElement});`,
          memoryState: {
            _vec: [],
            straggler: straggler,
            pairs: sortedPairs,
            mainChain: sortedMainChain,
            result: currentResult,
            jacobsthal: jacobsthal,
            insertionOrder: insertionOrder,
            activeIndices: { 
              mainChain: idx,
              result: mainPos,
              insertionOrder: i
            },
            operations: [
              `Insert main chain element ${mainElement} from pair at index ${idx}`,
              `Binary search finds insertion position at index ${mainPos}`,
              `Result array: [${currentResult.join(', ')}]`
            ],
            changes: [
              { 
                variable: "result", 
                from: JSON.stringify(beforeMainInsert), 
                to: JSON.stringify(currentResult) 
              }
            ],
            binarySearch: {
              value: mainElement,
              array: beforeMainInsert,
              steps: [
                `Search for position to insert ${mainElement}`,
                `Final position: ${mainPos}`
              ]
            }
          },
          callStack: ["main()", "sortVector() - Main Level", "insertElementsUsingFordJohnson()"]
        });
      }
      
      // Find position for smaller element
      let smallerPos = 0;
      while (smallerPos < currentResult.length && currentResult[smallerPos] < smallerElement) {
        smallerPos++;
      }
      
      const beforeSmallerInsert = currentResult.slice();
      currentResult.splice(smallerPos, 0, smallerElement);
      
      steps.push({
        title: `Insert Smaller Element (${smallerElement})`,
        description: `Insert smaller element ${smallerElement} from pair at index ${idx}.`,
        code: `// Binary search to find position for pairs[${idx}].second\npos = std::lower_bound(result.begin(), result.end(), ${smallerElement});\nresult.insert(pos, ${smallerElement});`,
        memoryState: {
          _vec: [],
          straggler: straggler,
          pairs: sortedPairs,
          mainChain: sortedMainChain,
          result: currentResult,
          jacobsthal: jacobsthal,
          insertionOrder: insertionOrder,
          activeIndices: { 
            pairs: idx,
            result: smallerPos,
            insertionOrder: i
          },
          operations: [
            `Insert smaller element ${smallerElement} from pair at index ${idx}`,
            `Binary search finds insertion position at index ${smallerPos}`,
            `Result array: [${currentResult.join(', ')}]`
          ],
          changes: [
            { 
              variable: "result", 
              from: JSON.stringify(beforeSmallerInsert), 
              to: JSON.stringify(currentResult) 
            }
          ],
          binarySearch: {
            value: smallerElement,
            array: beforeSmallerInsert,
            steps: [
              `Search for position to insert ${smallerElement}`,
              `Final position: ${smallerPos}`
            ]
          }
        },
        callStack: ["main()", "sortVector() - Main Level", "insertElementsUsingFordJohnson()"]
      });
    }
    
    result = currentResult;
  }
  
  // Insert straggler if needed
  let finalResult = result.slice();
  
  if (hasStraggler) {
    const resultBeforeStraggler = finalResult.slice();
    
    // Find position for straggler
    let pos = 0;
    while (pos < finalResult.length && finalResult[pos] < straggler) {
      pos++;
    }
    
    finalResult.splice(pos, 0, straggler);
    
    steps.push({
      title: "Insert Straggler",
      description: "Insert the straggler element (if any) at the correct position.",
      code: `// Insert straggler element using binary search\nif (straggler != nullptr) {\n  auto pos = lower_bound(result.begin(), result.end(), *straggler);\n  result.insert(pos, *straggler); // ${straggler}\n}`,
      memoryState: {
        _vec: [],
        straggler: straggler,
        pairs: sortedPairs,
        mainChain: sortedMainChain,
        result: finalResult,
        activeIndices: { 
          straggler: true,
          result: pos
        },
        operations: [
          `Insert straggler element ${straggler} using binary search`,
          `Find correct position in the result array`,
          `Final result contains all elements in sorted order`
        ],
        changes: [
          { 
            variable: "result", 
            from: JSON.stringify(resultBeforeStraggler), 
            to: JSON.stringify(finalResult) 
          }
        ],
        binarySearch: {
          value: straggler,
          array: resultBeforeStraggler,
          steps: [
            `Search for position to insert ${straggler}`,
            `Final position: ${pos}`
          ]
        }
      },
      callStack: ["main()", "sortVector() - Main Level", "insertStraggler()"]
    });
  }
  
  // Final result
  steps.push({
    title: "Final Result",
    description: "The array is now fully sorted using the Ford-Johnson algorithm.",
    code: `// Set final result and return\n_vec = result;\nreturn; // [${finalResult.join(', ')}]`,
    memoryState: {
      _vec: finalResult,
      straggler: null,
      pairs: [],
      mainChain: [],
      result: finalResult,
      operations: [
        `Set the final sorted result as the output array`,
        `Ford-Johnson sort completed successfully`,
        `Original array: [${inputArray.join(', ')}]`,
        `Sorted array: [${finalResult.join(', ')}]`
      ],
      changes: [
        { variable: "_vec", from: "[]", to: JSON.stringify(finalResult) },
        { variable: "straggler", from: hasStraggler ? straggler.toString() : "null", to: "null" }
      ]
    },
    callStack: ["main()"]
  });
  
  return steps;
}