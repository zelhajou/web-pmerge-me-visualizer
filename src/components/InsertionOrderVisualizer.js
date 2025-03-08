// src/components/InsertionOrderVisualizer.js
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  SkipBack, 
  SkipForward, 
  Play, 
  Pause, 
  Info, 
  Code, 
  List, 
  CheckSquare,
  ChevronUp,
  ChevronDown
} from 'lucide-react';


// Import the JacobsthalGenerator component
const JacobsthalGenerator = ({
  pairsSize,
  jacobsthalSequence,
  className = "",
}) => {
  const [expanded, setExpanded] = useState(false);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Generate calculation steps
  useEffect(() => {
    if (!jacobsthalSequence || jacobsthalSequence.length === 0) return;

    const generationSteps = [];
    // Add base cases
    generationSteps.push({
      index: 0,
      value: 0,
      explanation: "Base case: J(0) = 0",
      formula: "J(0) = 0",
    });

    if (jacobsthalSequence.length > 1) {
      generationSteps.push({
        index: 1,
        value: 1,
        explanation: "Base case: J(1) = 1",
        formula: "J(1) = 1",
      });
    }

    // Add computation steps
    for (let i = 2; i < jacobsthalSequence.length; i++) {
      const prev1 = jacobsthalSequence[i - 1];
      const prev2 = jacobsthalSequence[i - 2];
      generationSteps.push({
        index: i,
        value: jacobsthalSequence[i],
        explanation: `Calculate J(${i}) using the recurrence relation`,
        formula: `J(${i}) = J(${i - 1}) + 2×J(${i - 2})`,
        calculation: `J(${i}) = ${prev1} + 2×${prev2} = ${prev1 + 2 * prev2}`,
        prev1Index: i - 1,
        prev2Index: i - 2,
      });
    }

    setSteps(generationSteps);
    setCurrentStep(0);
  }, [jacobsthalSequence]);

  // Autoplay functionality
  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 500);
    } else if (isPlaying && currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length]);

  // Current step data
  const currentStepData = steps[currentStep] || {
    index: 0,
    value: 0,
    explanation: "",
    formula: "",
  };

  // Visible sequence up to current step
  const visibleSequence = jacobsthalSequence.slice(
    0,
    currentStepData.index + 1
  );

  if (!jacobsthalSequence || jacobsthalSequence.length === 0) {
    return null;
  }

  return (
    <div className={`border rounded-lg overflow-hidden shadow-sm ${className}`}>
      <div
        className="bg-indigo-50 px-3 py-2 font-medium border-b flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center text-indigo-800">
          <Info size={16} className="mr-2" />
          <span>Jacobsthal Sequence Generator</span>
        </div>
        <div className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full flex items-center">
          J(n) = J(n-1) + 2×J(n-2)
          {expanded ? (
            <ChevronUp size={16} className="ml-1" />
          ) : (
            <ChevronDown size={16} className="ml-1" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="p-3 bg-white">
          <div className="text-sm text-gray-600 mb-2">
            This visualization shows how the Jacobsthal sequence used for
            insertion order is calculated step by step.
          </div>

          {/* Sequence display */}
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {visibleSequence.map((value, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center ${
                    currentStepData.prev1Index === idx
                      ? "ring-2 ring-blue-400"
                      : currentStepData.prev2Index === idx
                      ? "ring-2 ring-green-400"
                      : idx === currentStepData.index
                      ? "ring-2 ring-purple-400 animate-pulse"
                      : ""
                  }`}
                >
                  <div className="bg-indigo-100 px-2 py-1 rounded-md text-indigo-800 font-mono text-sm">
                    {value}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">J({idx})</div>
                </div>
              ))}

              {currentStepData.index < jacobsthalSequence.length - 1 && (
                <div className="flex flex-col items-center opacity-50">
                  <div className="bg-gray-100 px-2 py-1 rounded-md text-gray-800 font-mono text-sm border border-dashed">
                    ?
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    J({currentStepData.index + 1})
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center mb-3">
            <button
              onClick={() => {
                setIsPlaying(!isPlaying);
                if (currentStep >= steps.length - 1) {
                  setCurrentStep(0);
                }
              }}
              className={`px-2 py-1 rounded text-xs font-medium ${
                isPlaying
                  ? "bg-red-100 text-red-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {isPlaying ? "Pause" : "Play Animation"}
            </button>

            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentStep(0)}
                disabled={currentStep === 0}
                className="p-1 bg-gray-100 rounded disabled:opacity-50"
              >
                ⏮
              </button>
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="p-1 bg-gray-100 rounded disabled:opacity-50"
              >
                ◀
              </button>
              <button
                onClick={() =>
                  setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
                }
                disabled={currentStep >= steps.length - 1}
                className="p-1 bg-gray-100 rounded disabled:opacity-50"
              >
                ▶
              </button>
              <button
                onClick={() => setCurrentStep(steps.length - 1)}
                disabled={currentStep >= steps.length - 1}
                className="p-1 bg-gray-100 rounded disabled:opacity-50"
              >
                ⏭
              </button>
            </div>

            <div className="text-xs text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>

          {/* Current calculation */}
          <div className="bg-indigo-50 rounded-md p-2 mb-3 border border-indigo-100">
            <div className="font-medium text-sm text-indigo-800 mb-1">
              {currentStepData.explanation}
            </div>

            <div className="font-mono text-sm">{currentStepData.formula}</div>

            {currentStepData.calculation && (
              <div className="font-mono text-sm mt-1 bg-white p-1 rounded border border-indigo-100">
                {currentStepData.calculation}
              </div>
            )}
          </div>

          {/* Final sequence */}
          <div className="bg-gray-50 rounded-md p-2 text-sm">
            <div className="font-medium mb-1">
              Final Jacobsthal Sequence (used for insertion order):
            </div>
            <div className="font-mono overflow-x-auto whitespace-nowrap text-xs">
              {jacobsthalSequence.map((value, idx) => (
                <span key={idx} className="mr-1">
                  J({idx})={value}
                  {idx < jacobsthalSequence.length - 1 ? "," : ""}
                </span>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Note: The Jacobsthal sequence grows rapidly and provides an
              optimal insertion order for the Ford-Johnson algorithm.
            </div>
          </div>

          {/* Show relationship to insertion order */}
          {pairsSize && (
            <div className="mt-3 bg-blue-50 p-2 rounded-md border border-blue-100 text-sm">
              <div className="font-medium mb-1">
                Relationship to Insertion Order:
              </div>
              <div>
                For {pairsSize} pairs, we use Jacobsthal numbers that are less
                than {pairsSize}:{" "}
                {jacobsthalSequence
                  .filter((n) => n > 0 && n < pairsSize)
                  .join(", ")}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                These values become the primary indices for insertion, with gaps
                filled in descending order.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const InsertionOrderVisualizer = () => {
  // Example data to visualize
  const [pairsSize, setPairsSize] = useState(8);
  const [currentStep, setCurrentStep] = useState(0);
  const [maxSteps, setMaxSteps] = useState(1);
  const [executionSteps, setExecutionSteps] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [jacobsthalSequence, setJacobsthalSequence] = useState([]);
  const [activeTab, setActiveTab] = useState("visualization"); // 'visualization', 'code', 'explanation'
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  // Track window size for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determine if we're on mobile view
  const isMobile = windowWidth < 768;

  // Generate Jacobsthal sequence
  const generateJacobsthalSequence = (n) => {
    const sequence = [0, 1];
    for (let i = 2; i <= n; i++) {
      sequence.push(sequence[i - 1] + 2 * sequence[i - 2]);
    }
    return sequence;
  };

  // Updated calculate insertion order function to match C++ implementation
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
      highlight: "setup",
    });

    // First loop: Process Jacobsthal numbers - Updated to match C++ implementation
    for (let i = 1; i < jacobSeq.length; i++) {
      const idx = jacobSeq[i];

      steps.push({
        stage: `First Loop - Iteration ${i}`,
        description: `Process Jacobsthal number J(${i}) = ${idx}`,
        code: `for (size_t i = ${i}; i < jacobSeq.size(); i++) {\n    int idx = jacobSeq[i]; // idx = ${idx}`,
        insertionOrder: [...insertionOrder],
        inserted: [...inserted],
        activeJacobIdx: i,
        activeIdx: idx,
        activeJ: null,
        highlight: "jacobsthal",
      });

      // Updated to check idx < pairsSize inside loop body like the C++ version
      steps.push({
        stage: `First Loop - Iteration ${i}`,
        description: `Check if index ${idx} is within range of pairs size (${pairsSize})`,
        code: `if (idx < (int)pairsSize && !inserted[idx]) {`,
        insertionOrder: [...insertionOrder],
        inserted: [...inserted],
        activeJacobIdx: i,
        activeIdx: idx,
        activeJ: null,
        highlight: "range-check",
      });

      if (idx < pairsSize && !inserted[idx]) {
        steps.push({
          stage: `First Loop - Iteration ${i}`,
          description: `Position ${idx} not yet inserted and is within range, add to insertion order`,
          code: `    insertionOrder.push_back(${idx});\n    inserted[${idx}] = true;`,
          insertionOrder: [...insertionOrder],
          inserted: [...inserted],
          activeJacobIdx: i,
          activeIdx: idx,
          activeJ: null,
          highlight: "condition-check",
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
          highlight: "add-element",
        });
      } else if (idx >= pairsSize) {
        steps.push({
          stage: `First Loop - Iteration ${i}`,
          description: `Position ${idx} exceeds pairs size (${pairsSize}), skipping but continuing loop`,
          code: `// Position ${idx} > ${
            pairsSize - 1
          }, out of range, skip this index`,
          insertionOrder: [...insertionOrder],
          inserted: [...inserted],
          activeJacobIdx: i,
          activeIdx: idx,
          activeJ: null,
          highlight: "out-of-range",
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
          highlight: "already-inserted",
        });
      }

      // Second nested loop: Fill in between Jacobsthal numbers
      const prev = jacobSeq[i - 1];

      steps.push({
        stage: `First Loop - Iteration ${i}`,
        description: `Prepare to fill in between J(${
          i - 1
        })=${prev} and J(${i})=${idx}`,
        code: `// Fill in between Jacobsthal numbers in descending order\nfor (int j = ${idx} - 1; j > ${prev}; j--) {`,
        insertionOrder: [...insertionOrder],
        inserted: [...inserted],
        activeJacobIdx: i,
        activeIdx: idx,
        activeJ: null,
        highlight: "prepare-fill",
      });

      for (let j = idx - 1; j > prev; j--) {
        steps.push({
          stage: `First Loop - Iteration ${i}, Nested Loop - j=${j}`,
          description: `Check position ${j} between J(${
            i - 1
          })=${prev} and J(${i})=${idx}`,
          code: `for (int j = ${j}; j > ${prev}; j--) {\n    if (j >= 0 && j < pairsSize && !inserted[j]) {`,
          insertionOrder: [...insertionOrder],
          inserted: [...inserted],
          activeJacobIdx: i,
          activeIdx: idx,
          activeJ: j,
          highlight: "check-between",
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
            highlight: "nested-check",
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
            highlight: "nested-add",
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
            highlight: "nested-skip",
          });
        }
      }

      steps.push({
        stage: `First Loop - Iteration ${i}`,
        description: `Completed filling between J(${
          i - 1
        })=${prev} and J(${i})=${idx}`,
        code: `} // End of nested loop\n} // Continue with next Jacobsthal number`,
        insertionOrder: [...insertionOrder],
        inserted: [...inserted],
        activeJacobIdx: i,
        activeIdx: idx,
        activeJ: null,
        highlight: "end-fill",
      });
    }

    // Final loop: Add any remaining indices
    steps.push({
      stage: "Final Loop",
      description:
        "Check for any remaining positions that haven't been inserted",
      code: "// Add any remaining indices\nfor (size_t i = 1; i < pairsSize; i++) {",
      insertionOrder: [...insertionOrder],
      inserted: [...inserted],
      activeJacobIdx: null,
      activeIdx: null,
      activeJ: null,
      highlight: "final-loop",
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
        highlight: "check-remaining",
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
          highlight: "final-check",
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
          highlight: "final-add",
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
          highlight: "final-skip",
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
      highlight: "return",
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
      jacobSeq.push(jacobSeq[jacobSize - 1] + 2 * jacobSeq[jacobSize - 2]);
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
        setCurrentStep((prev) => prev + 1);
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
    highlight: "",
  };

  // Highlight colors based on step type
  const getHighlightColor = (highlight) => {
    const colors = {
      setup: "bg-blue-100 text-blue-800 border-blue-200",
      jacobsthal: "bg-purple-100 text-purple-800 border-purple-200",
      "range-check": "bg-orange-100 text-orange-800 border-orange-200",
      "condition-check": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "add-element": "bg-green-100 text-green-800 border-green-200",
      "already-inserted": "bg-gray-100 text-gray-600 border-gray-200",
      "out-of-range": "bg-red-50 text-red-600 border-red-100",
      "prepare-fill": "bg-indigo-100 text-indigo-800 border-indigo-200",
      "check-between": "bg-amber-100 text-amber-800 border-amber-200",
      "nested-check": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "nested-add": "bg-green-100 text-green-800 border-green-200",
      "nested-skip": "bg-red-100 text-red-800 border-red-200",
      "end-fill": "bg-gray-100 text-gray-600 border-gray-200",
      "final-loop": "bg-cyan-100 text-cyan-800 border-cyan-200",
      "check-remaining": "bg-teal-100 text-teal-800 border-teal-200",
      "final-check": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "final-add": "bg-green-100 text-green-800 border-green-200",
      "final-skip": "bg-red-100 text-red-800 border-red-200",
      return: "bg-emerald-100 text-emerald-800 border-emerald-200",
    };

    return colors[highlight] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Tab switching for mobile view
  const renderTabContent = () => {
    switch (activeTab) {
      case "code":
        return (
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <div className="bg-gray-100 px-4 py-2 font-medium border-b flex items-center">
              <Code size={16} className="mr-2" />
              Current Code
            </div>
            <pre className="p-4 bg-gray-50 text-sm overflow-x-auto font-mono max-h-[400px]">
              {currentStepData.code}
            </pre>
          </div>
        );
      case "explanation":
        return (
          <>
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 shadow-sm">
              <h3 className="font-bold text-blue-800 mb-3 flex items-center">
                <Info size={18} className="mr-2" />
                How the Insertion Order is Calculated
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li className="text-gray-700">
                  The first index (0) is always pre-marked as inserted
                </li>
                <li className="text-gray-700">
                  We use Jacobsthal numbers as priority indices for insertion
                </li>
                <li className="text-gray-700">
                  After inserting a Jacobsthal index, we fill in all indices
                  between the current and previous Jacobsthal number in
                  descending order
                </li>
                <li className="text-gray-700">
                  Finally, we check for any remaining indices that haven't been
                  inserted yet
                </li>
              </ol>

              <div className="mt-4 pt-3 border-t border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">
                  Jacobsthal Numbers
                </h4>
                <p className="text-sm text-gray-700 mb-2">
                  Formula: J(n) = J(n-1) + 2×J(n-2) where J(0)=0, J(1)=1
                </p>
                <p className="text-sm text-gray-700">
                  The Jacobsthal sequence (0, 1, 1, 3, 5, 11, 21, 43, ...)
                  creates an optimal insertion pattern that minimizes
                  comparisons during the merge-insertion sort algorithm.
                </p>

                <div className="mt-4 bg-white p-3 rounded border border-blue-100">
                  <h5 className="font-medium text-blue-800 mb-1">
                    Why it works:
                  </h5>
                  <p className="text-sm text-gray-700">
                    The Ford-Johnson algorithm needs to insert elements
                    efficiently. The Jacobsthal sequence provides a
                    mathematically optimal order for these insertions by
                    choosing positions that maximize the benefit of previous
                    comparisons.
                  </p>
                </div>
              </div>
            </div>

            {/* Add Jacobsthal Generator in explanation tab for mobile view */}
            <JacobsthalGenerator
              pairsSize={pairsSize}
              jacobsthalSequence={jacobsthalSequence}
              className="mt-4"
            />
          </>
        );
      default: // 'visualization'
        return (
          <>
            {/* Main visualization components */}
            <div
              className={`p-4 rounded-lg border ${getHighlightColor(
                currentStepData.highlight
              )} shadow-sm`}
            >
              <h3 className="font-bold text-lg">{currentStepData.stage}</h3>
              <p className="mt-1 text-sm md:text-base">
                {currentStepData.description}
              </p>
            </div>

            {/* Current state visualization */}
            <div className="mt-4 grid grid-cols-1 gap-4">
              {/* Insertion Order Array */}
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-100 px-4 py-2 font-medium border-b flex items-center">
                  <List size={16} className="mr-2" />
                  Insertion Order
                </div>
                <div className="p-4 bg-white">
                  {currentStepData.insertionOrder.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {currentStepData.insertionOrder.map((value, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <div className="bg-green-100 px-3 py-1.5 rounded-md text-green-800 font-mono shadow-sm">
                            {value}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {idx}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      Empty - Not yet populated
                    </p>
                  )}
                </div>
              </div>

              {/* Inserted State Array */}
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-100 px-4 py-2 font-medium border-b flex items-center">
                  <CheckSquare size={16} className="mr-2" />
                  Inserted State
                </div>
                <div className="p-4 bg-white">
                  <div className="flex flex-wrap gap-1.5">
                    {currentStepData.inserted.map((value, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <div
                          className={`
                          w-8 h-8 flex items-center justify-center rounded-md font-mono shadow-sm
                          ${
                            currentStepData.activeIdx === idx
                              ? "ring-2 ring-red-500 font-bold"
                              : ""
                          }
                          ${
                            currentStepData.activeJ === idx
                              ? "ring-2 ring-yellow-500 font-bold"
                              : ""
                          }
                          ${
                            value
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {value ? "T" : "F"}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {idx}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    <span className="bg-blue-100 text-blue-800 px-1 rounded mr-1">
                      T
                    </span>{" "}
                    = inserted,
                    <span className="bg-gray-100 text-gray-800 px-1 rounded ml-1 mr-1">
                      F
                    </span>{" "}
                    = not yet inserted
                  </p>
                </div>
              </div>
            </div>

            {/* Jacobsthal Sequence Visualization */}
            <div className="mt-4 border rounded-lg overflow-hidden shadow-sm">
              <div className="bg-gray-100 px-4 py-2 font-medium border-b flex justify-between items-center">
                <div className="flex items-center">
                  <svg
                    className="mr-2 h-4 w-4 text-purple-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 6H21M3 12H21M3 18H21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Jacobsthal Sequence
                </div>
                <div className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                  J(n) = J(n-1) + 2×J(n-2)
                </div>
              </div>
              <div className="p-4 bg-white overflow-x-auto">
                <div className="flex flex-wrap gap-2 mb-2 min-w-max">
                  {jacobsthalSequence.map((num, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div
                        className={`
                        px-2.5 py-1 rounded-md font-mono transition-all
                        ${
                          currentStepData.activeJacobIdx === idx
                            ? "bg-purple-500 text-white font-bold shadow-md transform scale-110"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {num}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        J({idx})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Add Jacobsthal Generator in visualization tab */}
            <JacobsthalGenerator
              pairsSize={pairsSize}
              jacobsthalSequence={jacobsthalSequence}
              className="mt-4"
            />
          </>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3 text-white">
        <h2 className="text-xl font-bold">Insertion Order Calculation</h2>
        <p className="text-sm text-blue-100 mt-0.5">
          Visualizing the Ford-Johnson algorithm's insertion order calculation
        </p>
      </div>

      {/* Controls Section */}
      <div className="p-3 bg-gray-50 border-b">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex items-center">
            <label className="block text-sm font-medium text-gray-700 mr-2">
              Pairs Size:
            </label>
            <select
              value={pairsSize}
              onChange={(e) => setPairsSize(parseInt(e.target.value))}
              className="p-1.5 border rounded-md text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {[4, 5, 6, 7, 8, 9, 10, 12, 15].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1.5 md:ml-auto">
            <button
              className="p-1.5 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 disabled:opacity-40"
              onClick={() => setCurrentStep(0)}
              disabled={currentStep === 0}
              title="First Step"
            >
              <SkipBack size={16} />
            </button>

            <button
              className="p-1.5 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 disabled:opacity-40"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              title="Previous Step"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              className={`p-1.5 flex items-center gap-1 px-3 rounded-md text-sm font-medium
                ${
                  isPlaying
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              <span className="hidden sm:inline">
                {isPlaying ? "Pause" : "Play"}
              </span>
            </button>

            <button
              className="p-1.5 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 disabled:opacity-40"
              onClick={() =>
                setCurrentStep(Math.min(maxSteps - 1, currentStep + 1))
              }
              disabled={currentStep === maxSteps - 1}
              title="Next Step"
            >
              <ChevronRight size={16} />
            </button>

            <button
              className="p-1.5 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 disabled:opacity-40"
              onClick={() => setCurrentStep(maxSteps - 1)}
              disabled={currentStep === maxSteps - 1}
              title="Last Step"
            >
              <SkipForward size={16} />
            </button>

            <select
              className="ml-1 p-1.5 border rounded-md text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
              title="Playback Speed"
            >
              <option value="0.5">0.5×</option>
              <option value="1">1×</option>
              <option value="1.5">1.5×</option>
              <option value="2">2×</option>
            </select>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-200 rounded-full mt-3">
          <div
            className="h-1.5 bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / maxSteps) * 100}%` }}
          ></div>
        </div>

        <div className="mt-1 flex justify-between">
          <div className="text-xs font-medium text-gray-500">
            Step {currentStep + 1} of {maxSteps}
          </div>
          <div className="text-xs font-medium text-gray-500">
            {Math.round(((currentStep + 1) / maxSteps) * 100)}% complete
          </div>
        </div>
      </div>

      {/* Mobile tabs */}
      {isMobile && (
        <div className="bg-gray-100 border-b">
          <div className="flex">
            <button
              className={`flex-1 py-2 px-2 text-sm font-medium ${
                activeTab === "visualization"
                  ? "text-blue-700 border-b-2 border-blue-500"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("visualization")}
            >
              Visualization
            </button>
            <button
              className={`flex-1 py-2 px-2 text-sm font-medium ${
                activeTab === "code"
                  ? "text-blue-700 border-b-2 border-blue-500"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("code")}
            >
              Code
            </button>
            <button
              className={`flex-1 py-2 px-2 text-sm font-medium ${
                activeTab === "explanation"
                  ? "text-blue-700 border-b-2 border-blue-500"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("explanation")}
            >
              Explanation
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="p-4">
        {/* Mobile view shows tabs */}
        {isMobile ? (
          <div className="space-y-4">{renderTabContent()}</div>
        ) : (
          /* Desktop view shows all sections in a grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column: Visualization */}
            <div className="space-y-4">
              {/* Step Information */}
              <div
                className={`p-4 rounded-lg border ${getHighlightColor(
                  currentStepData.highlight
                )} shadow-sm`}
              >
                <h3 className="font-bold text-lg">{currentStepData.stage}</h3>
                <p className="mt-1">{currentStepData.description}</p>
              </div>

              {/* Jacobsthal Sequence Visualization */}
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-100 px-4 py-2 font-medium border-b flex justify-between items-center">
                  <div className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-purple-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 6H21M3 12H21M3 18H21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Jacobsthal Sequence
                  </div>
                  <div className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                    J(n) = J(n-1) + 2×J(n-2)
                  </div>
                </div>
                <div className="p-4 bg-white overflow-x-auto">
                  <div className="flex flex-wrap gap-2 mb-2 min-w-max">
                    {jacobsthalSequence.map((num, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <div
                          className={`
                          px-2.5 py-1 rounded-md font-mono transition-all
                          ${
                            currentStepData.activeJacobIdx === idx
                              ? "bg-purple-500 text-white font-bold shadow-md transform scale-110"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {num}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          J({idx})
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Code Visualization */}
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-100 px-4 py-2 font-medium border-b flex items-center">
                  <Code size={16} className="mr-2" />
                  Current Code
                </div>
                <pre className="p-4 bg-gray-50 text-sm overflow-x-auto font-mono max-h-[250px]">
                  {currentStepData.code}
                </pre>
              </div>

              {/* Add Jacobsthal Generator in desktop view */}
              <JacobsthalGenerator
                pairsSize={pairsSize}
                jacobsthalSequence={jacobsthalSequence}
              />
            </div>

            {/* Right column: State tracking */}
            <div className="space-y-4">
              {/* Insertion Order Array */}
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-100 px-4 py-2 font-medium border-b flex items-center">
                  <List size={16} className="mr-2" />
                  Insertion Order
                </div>
                <div className="p-4 bg-white">
                  {currentStepData.insertionOrder.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {currentStepData.insertionOrder.map((value, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <div className="bg-green-100 px-3 py-1.5 rounded-md text-green-800 font-mono shadow-sm">
                            {value}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {idx}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      Empty - Not yet populated
                    </p>
                  )}
                </div>
              </div>

              {/* Inserted State Array */}
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-100 px-4 py-2 font-medium border-b flex items-center">
                  <CheckSquare size={16} className="mr-2" />
                  Inserted State
                </div>
                <div className="p-4 bg-white">
                  <div className="flex flex-wrap gap-1.5">
                    {currentStepData.inserted.map((value, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <div
                          className={`
                          w-8 h-8 flex items-center justify-center rounded-md font-mono shadow-sm
                          ${
                            currentStepData.activeIdx === idx
                              ? "ring-2 ring-red-500 font-bold"
                              : ""
                          }
                          ${
                            currentStepData.activeJ === idx
                              ? "ring-2 ring-yellow-500 font-bold"
                              : ""
                          }
                          ${
                            value
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {value ? "T" : "F"}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {idx}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    <span className="bg-blue-100 text-blue-800 px-1 rounded mr-1">
                      T
                    </span>{" "}
                    = inserted,
                    <span className="bg-gray-100 text-gray-800 px-1 rounded ml-1 mr-1">
                      F
                    </span>{" "}
                    = not yet inserted
                  </p>
                </div>
              </div>

              {/* Active Variables */}
              <div className="border rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-100 px-4 py-2 font-medium border-b">
                  Active Variables
                </div>
                <div className="p-4 bg-white grid grid-cols-2 gap-3">
                  <div>
                    <span className="font-mono font-bold text-sm">i:</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded-md ${
                        currentStepData.activeJacobIdx !== null
                          ? "bg-purple-100 text-purple-800 font-mono"
                          : "text-gray-500"
                      }`}
                    >
                      {currentStepData.activeJacobIdx !== null
                        ? currentStepData.activeJacobIdx
                        : "Not active"}
                    </span>
                  </div>

                  <div>
                    <span className="font-mono font-bold text-sm">idx:</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded-md ${
                        currentStepData.activeIdx !== null
                          ? "bg-red-100 text-red-800 font-mono"
                          : "text-gray-500"
                      }`}
                    >
                      {currentStepData.activeIdx !== null
                        ? currentStepData.activeIdx
                        : "Not active"}
                    </span>
                  </div>

                  <div>
                    <span className="font-mono font-bold text-sm">j:</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded-md ${
                        currentStepData.activeJ !== null
                          ? "bg-yellow-100 text-yellow-800 font-mono"
                          : "text-gray-500"
                      }`}
                    >
                      {currentStepData.activeJ !== null
                        ? currentStepData.activeJ
                        : "Not active"}
                    </span>
                  </div>

                  <div>
                    <span className="font-mono font-bold text-sm">
                      pairsSize:
                    </span>
                    <span className="ml-2 px-2 py-1 bg-gray-100 rounded-md font-mono">
                      {pairsSize}
                    </span>
                  </div>
                </div>
              </div>

              {/* Explanation */}
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 shadow-sm">
                <h3 className="font-bold text-blue-800 mb-2 flex items-center">
                  <Info size={18} className="mr-2" />
                  How the Insertion Order is Calculated
                </h3>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li className="text-gray-700">
                    The first index (0) is always pre-marked as inserted
                  </li>
                  <li className="text-gray-700">
                    We use Jacobsthal numbers as priority indices for insertion
                  </li>
                  <li className="text-gray-700">
                    After inserting a Jacobsthal index, we fill in all indices
                    between the current and previous Jacobsthal number in
                    descending order
                  </li>
                  <li className="text-gray-700">
                    Finally, we check for any remaining indices that haven't
                    been inserted yet
                  </li>
                </ol>
                <p className="text-xs text-gray-600 mt-2">
                  The Jacobsthal sequence creates an optimal insertion pattern
                  that minimizes comparisons during the merge-insertion sort
                  algorithm.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer with extra information */}
      <div className="bg-gray-50 border-t px-4 py-3 text-xs text-gray-500">
        <p>
          The Ford-Johnson algorithm (also known as merge-insertion sort) is
          designed to minimize the number of comparisons needed to sort an
          array.
        </p>
      </div>
    </div>
  );
};

export default InsertionOrderVisualizer;
