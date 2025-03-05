// src/components/InsertionOrderVisualizer.js
import React, { useState, useEffect } from 'react';

const InsertionOrderVisualizer = () => {
  // Example data to visualize
  const [pairsSize, setPairsSize] = useState(8);
  const [currentStep, setCurrentStep] = useState(0);
  const [maxSteps, setMaxSteps] = useState(1);
  const [executionSteps, setExecutionSteps] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [jacobsthalSequence, setJacobsthalSequence] = useState([]);

  // Generate Jacobsthal sequence
  const generateJacobsthalSequence = (n) => {
    const sequence = [0, 1];
    for (let i = 2; i <= n; i++) {
      sequence.push(sequence[i-1] + 2 * sequence[i-2]);
    }
    return sequence;
  };

  // Calculate insertion order with step-by-step tracking
  const calculateInsertionOrderWithSteps = (jacobSeq, pairsSize) => {
    const steps = [];
    
    // Initial state
    const insertionOrder = [];
    const inserted = Array(pairsSize).fill(false);
    inserted[0] = true; // Mark first pair as already processed
    
    steps.push({
      stage: "Initial State",
      description: "Set up variables and mark first pair as already processed",
      code: "std::vector<int> insertionOrder;\nstd::vector<bool> inserted(pairsSize, false);\ninserted[0] = true;",
      insertionOrder: [...insertionOrder],
      inserted: [...inserted],
      activeJacobIdx: null,
      activeIdx: null,
      activeJ: null,
      highlight: "setup"
    });
    
    // First loop: Process Jacobsthal numbers
    for (let i = 1; i < jacobSeq.length && jacobSeq[i] < pairsSize; i++) {
      const idx = jacobSeq[i];
      
      steps.push({
        stage: `First Loop - Iteration ${i}`,
        description: `Process Jacobsthal number J(${i}) = ${idx}`,
        code: `for (size_t i = ${i}; i < jacobSeq.size() && jacobSeq[i] < pairsSize; i++) {\n    int idx = jacobSeq[i]; // idx = ${idx}`,
        insertionOrder: [...insertionOrder],
        inserted: [...inserted],
        activeJacobIdx: i,
        activeIdx: idx,
        activeJ: null,
        highlight: "jacobsthal"
      });
      
      if (!inserted[idx]) {
        steps.push({
          stage: `First Loop - Iteration ${i}`,
          description: `Position ${idx} not yet inserted, add to insertion order`,
          code: `if (!inserted[${idx}]) {\n    insertionOrder.push_back(${idx});\n    inserted[${idx}] = true;\n}`,
          insertionOrder: [...insertionOrder],
          inserted: [...inserted],
          activeJacobIdx: i,
          activeIdx: idx,
          activeJ: null,
          highlight: "condition-check"
        });
        
        insertionOrder.push(idx);
        inserted[idx] = true;
        
        steps.push({
          stage: `First Loop - Iteration ${i}`,
          description: `Added ${idx} to insertion order and marked as inserted`,
          code: `insertionOrder.push_back(${idx});\ninserted[${idx}] = true;`,
          insertionOrder: [...insertionOrder],
          inserted: [...inserted],
          activeJacobIdx: i,
          activeIdx: idx,
          activeJ: null,
          highlight: "add-element"
        });
      } else {
        steps.push({
          stage: `First Loop - Iteration ${i}`,
          description: `Position ${idx} already inserted, skipping`,
          code: `// Position ${idx} already marked as inserted, skip`,
          insertionOrder: [...insertionOrder],
          inserted: [...inserted],
          activeJacobIdx: i,
          activeIdx: idx,
          activeJ: null,
          highlight: "already-inserted"
        });
      }
      
      // Second nested loop: Fill in between Jacobsthal numbers
      const prev = jacobSeq[i-1];
      
      steps.push({
        stage: `First Loop - Iteration ${i}`,
        description: `Prepare to fill in between J(${i-1})=${prev} and J(${i})=${idx}`,
        code: `// Fill in between Jacobsthal numbers in descending order\nfor (int j = ${idx} - 1; j > ${prev}; j--) {`,
        insertionOrder: [...insertionOrder],
        inserted: [...inserted],
        activeJacobIdx: i,
        activeIdx: idx,
        activeJ: null,
        highlight: "prepare-fill"
      });
      
      for (let j = idx - 1; j > prev; j--) {
        steps.push({
          stage: `First Loop - Iteration ${i}, Nested Loop - j=${j}`,
          description: `Check position ${j} between J(${i-1})=${prev} and J(${i})=${idx}`,
          code: `for (int j = ${j}; j > ${prev}; j--) {\n    if (j >= 0 && j < pairsSize && !inserted[j]) {`,
          insertionOrder: [...insertionOrder],
          inserted: [...inserted],
          activeJacobIdx: i,
          activeIdx: idx,
          activeJ: j,
          highlight: "check-between"
        });
        
        if (j >= 0 && j < pairsSize && !inserted[j]) {
          steps.push({
            stage: `First Loop - Iteration ${i}, Nested Loop - j=${j}`,
            description: `Position ${j} not yet inserted, add to insertion order`,
            code: `if (${j} >= 0 && ${j} < ${pairsSize} && !inserted[${j}]) {\n    // About to insert`,
            insertionOrder: [...insertionOrder],
            inserted: [...inserted],
            activeJacobIdx: i,
            activeIdx: idx,
            activeJ: j,
            highlight: "nested-check"
          });
          
          insertionOrder.push(j);
          inserted[j] = true;
          
          steps.push({
            stage: `First Loop - Iteration ${i}, Nested Loop - j=${j}`,
            description: `Added ${j} to insertion order and marked as inserted`,
            code: `insertionOrder.push_back(${j});\ninserted[${j}] = true;`,
            insertionOrder: [...insertionOrder],
            inserted: [...inserted],
            activeJacobIdx: i,
            activeIdx: idx,
            activeJ: j,
            highlight: "nested-add"
          });
        } else {
          let skipReason = "";
          if (j < 0) skipReason = "j < 0";
          else if (j >= pairsSize) skipReason = `j >= ${pairsSize}`;
          else if (inserted[j]) skipReason = `inserted[${j}] is true`;
          
          steps.push({
            stage: `First Loop - Iteration ${i}, Nested Loop - j=${j}`,
            description: `Position ${j} skipped: ${skipReason}`,
            code: `// Skip: ${skipReason}`,
            insertionOrder: [...insertionOrder],
            inserted: [...inserted],
            activeJacobIdx: i,
            activeIdx: idx,
            activeJ: j,
            highlight: "nested-skip"
          });
        }
      }
      
      steps.push({
        stage: `First Loop - Iteration ${i}`,
        description: `Completed filling between J(${i-1})=${prev} and J(${i})=${idx}`,
        code: `} // End of nested loop\n} // Continue with next Jacobsthal number`,
        insertionOrder: [...insertionOrder],
        inserted: [...inserted],
        activeJacobIdx: i,
        activeIdx: idx,
        activeJ: null,
        highlight: "end-fill"
      });
    }
    
    // Final loop: Add any remaining indices
    steps.push({
      stage: "Final Loop",
      description: "Check for any remaining positions that haven't been inserted",
      code: "// Add any remaining indices\nfor (size_t i = 1; i < pairsSize; i++) {",
      insertionOrder: [...insertionOrder],
      inserted: [...inserted],
      activeJacobIdx: null,
      activeIdx: null,
      activeJ: null,
      highlight: "final-loop"
    });
    
    for (let i = 1; i < pairsSize; i++) {
      steps.push({
        stage: "Final Loop",
        description: `Check if position ${i} has been inserted`,
        code: `for (size_t i = ${i}; i < ${pairsSize}; i++) {\n    if (!inserted[${i}])`,
        insertionOrder: [...insertionOrder],
        inserted: [...inserted],
        activeJacobIdx: null,
        activeIdx: i,
        activeJ: null,
        highlight: "check-remaining"
      });
      
      if (!inserted[i]) {
        steps.push({
          stage: "Final Loop",
          description: `Position ${i} not yet inserted, add to insertion order`,
          code: `if (!inserted[${i}]) {\n    // About to insert`,
          insertionOrder: [...insertionOrder],
          inserted: [...inserted],
          activeJacobIdx: null,
          activeIdx: i,
          activeJ: null,
          highlight: "final-check"
        });
        
        insertionOrder.push(i);
        inserted[i] = true;
        
        steps.push({
          stage: "Final Loop",
          description: `Added ${i} to insertion order and marked as inserted`,
          code: `insertionOrder.push_back(${i});\n    inserted[${i}] = true;`,
          insertionOrder: [...insertionOrder],
          inserted: [...inserted],
          activeJacobIdx: null,
          activeIdx: i,
          activeJ: null,
          highlight: "final-add"
        });
      } else {
        steps.push({
          stage: "Final Loop",
          description: `Position ${i} already inserted, skipping`,
          code: `// Position ${i} already marked as inserted, skip`,
          insertionOrder: [...insertionOrder],
          inserted: [...inserted],
          activeJacobIdx: null,
          activeIdx: i,
          activeJ: null,
          highlight: "final-skip"
        });
      }
    }
    
    // Return result
    steps.push({
      stage: "Return Result",
      description: "Return the final insertion order",
      code: "return insertionOrder; // " + JSON.stringify(insertionOrder),
      insertionOrder: [...insertionOrder],
      inserted: [...inserted],
      activeJacobIdx: null,
      activeIdx: null,
      activeJ: null,
      highlight: "return"
    });
    
    return steps;
  };

  // Process input changes
  useEffect(() => {
    // Generate Jacobsthal sequence of appropriate size
    let jacobSize = 5; // Start with a reasonable size
    const jacobSeq = generateJacobsthalSequence(jacobSize);
    
    // Make sure the sequence is large enough
    while (jacobSeq[jacobSeq.length - 1] < pairsSize) {
      jacobSize++;
      jacobSeq.push(jacobSeq[jacobSize-1] + 2 * jacobSeq[jacobSize-2]);
    }
    
    setJacobsthalSequence(jacobSeq);
    
    // Generate execution steps
    const steps = calculateInsertionOrderWithSteps(jacobSeq, pairsSize);
    setExecutionSteps(steps);
    setMaxSteps(steps.length);
    setCurrentStep(0);
  }, [pairsSize]);

  // Auto-playback
  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < maxSteps - 1) {
      timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1000 / playbackSpeed);
    } else if (isPlaying && currentStep >= maxSteps - 1) {
      setIsPlaying(false);
    }
    
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, maxSteps, playbackSpeed]);

  // Get current step data
  const currentStepData = executionSteps[currentStep] || {
    stage: "Loading...",
    description: "Generating visualization steps",
    code: "",
    insertionOrder: [],
    inserted: [],
    activeJacobIdx: null,
    activeIdx: null,
    activeJ: null,
    highlight: ""
  };

  // Highlight colors based on step type
  const getHighlightColor = (highlight) => {
    const colors = {
      "setup": "bg-blue-100 text-blue-800",
      "jacobsthal": "bg-purple-100 text-purple-800",
      "condition-check": "bg-yellow-100 text-yellow-800",
      "add-element": "bg-green-100 text-green-800",
      "already-inserted": "bg-gray-100 text-gray-600",
      "prepare-fill": "bg-indigo-100 text-indigo-800",
      "check-between": "bg-amber-100 text-amber-800",
      "nested-check": "bg-yellow-100 text-yellow-800",
      "nested-add": "bg-green-100 text-green-800",
      "nested-skip": "bg-red-100 text-red-800",
      "end-fill": "bg-gray-100 text-gray-600",
      "final-loop": "bg-cyan-100 text-cyan-800",
      "check-remaining": "bg-teal-100 text-teal-800",
      "final-check": "bg-yellow-100 text-yellow-800",
      "final-add": "bg-green-100 text-green-800",
      "final-skip": "bg-red-100 text-red-800",
      "return": "bg-emerald-100 text-emerald-800"
    };
    
    return colors[highlight] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Insertion Order Calculation Visualizer</h2>
      <p className="text-gray-700 mb-4">
        Visualizes the <code className="bg-gray-100 px-1 rounded">calculateInsertionOrder</code> function 
        step by step, showing how the Ford-Johnson algorithm uses Jacobsthal numbers to determine an efficient 
        insertion order.
      </p>
      
      {/* Controls */}
      <div className="bg-gray-50 p-4 rounded-md mb-6 flex flex-wrap items-center gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pairs Size:</label>
          <select 
            value={pairsSize} 
            onChange={(e) => setPairsSize(parseInt(e.target.value))}
            className="p-2 border rounded-md"
          >
            {[4, 5, 6, 7, 8, 9, 10, 12, 15].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <button 
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md"
            onClick={() => setCurrentStep(0)}
            title="First Step"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            title="Previous Step"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md flex items-center gap-1 px-3"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Pause</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Play</span>
              </>
            )}
          </button>
          
          <button 
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md"
            onClick={() => setCurrentStep(Math.min(maxSteps - 1, currentStep + 1))}
            disabled={currentStep === maxSteps - 1}
            title="Next Step"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <button 
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md"
            onClick={() => setCurrentStep(maxSteps - 1)}
            title="Last Step"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
          
          <select
            className="ml-2 p-2 border rounded-md"
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
          >
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
          
          <div className="ml-2 text-sm text-gray-700">
            Step {currentStep + 1} of {maxSteps}
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
        <div 
          className="h-2 bg-blue-600 rounded-full" 
          style={{ width: `${((currentStep + 1) / maxSteps) * 100}%` }}
        ></div>
      </div>
      
      {/* Main content area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Visualization */}
        <div className="space-y-6">
          {/* Step Information */}
          <div className={`p-4 rounded-md ${getHighlightColor(currentStepData.highlight)}`}>
            <h3 className="font-bold text-lg">{currentStepData.stage}</h3>
            <p className="mt-1">{currentStepData.description}</p>
          </div>
          
          {/* Jacobsthal Sequence Visualization */}
          <div className="border rounded-md overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 font-semibold border-b">Jacobsthal Sequence</div>
            <div className="p-4 bg-white">
              <div className="flex flex-wrap gap-2 mb-2">
                {jacobsthalSequence.map((num, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className={`
                      px-2 py-1 rounded-md font-mono
                      ${currentStepData.activeJacobIdx === idx 
                        ? 'bg-purple-500 text-white font-bold' 
                        : 'bg-purple-100 text-purple-800'}`
                    }>
                      {num}
                    </div>
                    <div className="text-xs text-gray-500">J({idx})</div>
                  </div>
                ))}
              </div>
              
              <div className="text-xs text-gray-600">
                <p className="mb-1">Formula: J(n) = J(n-1) + 2×J(n-2) where J(0)=0, J(1)=1</p>
                <p>The Jacobsthal sequence is used to determine an efficient order for inserting elements.</p>
              </div>
            </div>
          </div>
          
          {/* Code Visualization */}
          <div className="border rounded-md overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 font-semibold border-b">Current Code</div>
            <pre className="p-4 bg-gray-50 text-sm overflow-x-auto font-mono">
              {currentStepData.code}
            </pre>
          </div>
        </div>
        
        {/* Right: State Tracking */}
        <div className="space-y-6">
          {/* Insertion Order Array */}
          <div className="border rounded-md overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 font-semibold border-b">Insertion Order</div>
            <div className="p-4 bg-white">
              {currentStepData.insertionOrder.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {currentStepData.insertionOrder.map((value, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="bg-green-100 px-3 py-1.5 rounded-md text-green-800 font-mono">
                        {value}
                      </div>
                      <div className="text-xs text-gray-500">{idx}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">Empty - Not yet populated</p>
              )}
            </div>
          </div>
          
          {/* Inserted State Array */}
          <div className="border rounded-md overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 font-semibold border-b">Inserted State</div>
            <div className="p-4 bg-white">
              <div className="flex flex-wrap gap-1">
                {currentStepData.inserted.map((value, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className={`
                      w-8 h-8 flex items-center justify-center rounded-md font-mono
                      ${currentStepData.activeIdx === idx
                        ? 'ring-2 ring-red-500 font-bold'
                        : ''}
                      ${currentStepData.activeJ === idx
                        ? 'ring-2 ring-yellow-500 font-bold'
                        : ''}
                      ${value 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'}`
                    }>
                      {value ? 'T' : 'F'}
                    </div>
                    <div className="text-xs text-gray-500">{idx}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                This array tracks which positions have already been inserted: 
                <span className="bg-blue-100 text-blue-800 px-1 ml-1 rounded">T</span> = inserted, 
                <span className="bg-gray-100 text-gray-800 px-1 ml-1 rounded">F</span> = not yet inserted
              </p>
            </div>
          </div>
          
          {/* Active Variables */}
          <div className="border rounded-md overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 font-semibold border-b">Active Variables</div>
            <div className="p-4 bg-white grid grid-cols-2 gap-3">
              <div>
                <span className="font-mono font-bold text-sm">i:</span>
                <span className={`ml-2 px-2 py-1 rounded-md ${
                  currentStepData.activeJacobIdx !== null 
                    ? 'bg-purple-100 text-purple-800 font-mono' 
                    : 'text-gray-500'
                }`}>
                  {currentStepData.activeJacobIdx !== null 
                    ? currentStepData.activeJacobIdx 
                    : 'Not active'}
                </span>
              </div>
              
              <div>
                <span className="font-mono font-bold text-sm">idx:</span>
                <span className={`ml-2 px-2 py-1 rounded-md ${
                  currentStepData.activeIdx !== null 
                    ? 'bg-red-100 text-red-800 font-mono' 
                    : 'text-gray-500'
                }`}>
                  {currentStepData.activeIdx !== null 
                    ? currentStepData.activeIdx 
                    : 'Not active'}
                </span>
              </div>
              
              <div>
                <span className="font-mono font-bold text-sm">j:</span>
                <span className={`ml-2 px-2 py-1 rounded-md ${
                  currentStepData.activeJ !== null 
                    ? 'bg-yellow-100 text-yellow-800 font-mono' 
                    : 'text-gray-500'
                }`}>
                  {currentStepData.activeJ !== null 
                    ? currentStepData.activeJ 
                    : 'Not active'}
                </span>
              </div>
              
              <div>
                <span className="font-mono font-bold text-sm">pairsSize:</span>
                <span className="ml-2 px-2 py-1 bg-gray-100 rounded-md font-mono">
                  {pairsSize}
                </span>
              </div>
            </div>
          </div>
          
          {/* Explanation */}
          <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
            <h3 className="font-bold mb-2">How the Insertion Order is Calculated</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>The first index (0) is always pre-marked as inserted</li>
              <li>We use Jacobsthal numbers as priority indices for insertion</li>
              <li>After inserting a Jacobsthal index, we fill in all indices between the current and previous Jacobsthal number in descending order</li>
              <li>Finally, we check for any remaining indices that haven't been inserted yet</li>
            </ol>
            <p className="text-xs text-gray-600 mt-2">
              The Jacobsthal sequence creates an optimal insertion pattern that minimizes comparisons during the merge-insertion sort algorithm.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsertionOrderVisualizer;