import React, { useState, useEffect } from 'react';
import { Info, ChevronDown, ChevronUp, Play, Pause, SkipBack, SkipForward, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * JacobsthalGenerator component that visualizes the Jacobsthal sequence generation
 * Matches the implementation in PmergeMe.cpp getJacob function
 */
const JacobsthalGenerator = ({ pairsSize, jacobsthalSequence, className = "" }) => {
  const [expanded, setExpanded] = useState(false);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Generate calculation steps - based on getJacob implementation
  useEffect(() => {
    if (!jacobsthalSequence || jacobsthalSequence.length === 0) return;
    
    const generationSteps = [];
    
    // Initial setup - add the first two elements
    generationSteps.push({
      index: 0,
      value: 0,
      explanation: "Initial setup: Add first element to sequence",
      formula: "jacobsthal.push_back(0);",
      isBaseCase: true
    });
    
    if (jacobsthalSequence.length > 1) {
      generationSteps.push({
        index: 1,
        value: 1,
        explanation: "Initial setup: Add second element to sequence",
        formula: "jacobsthal.push_back(1);",
        isBaseCase: true
      });
    }
    
    // Generate additional elements using the recurrence relation
    for (let i = 2; i < jacobsthalSequence.length; i++) {
      const lastNum = jacobsthalSequence[i-1];
      const secondLastNum = jacobsthalSequence[i-2];
      
      // Step to get values
      generationSteps.push({
        index: i,
        phase: "access",
        value: jacobsthalSequence[i],
        explanation: `Access previous elements for calculation`,
        formula: `int lastNum = jacobsthal.back(); // ${lastNum}\nint secondLastNum = jacobsthal[jacobsthal.size() - 2]; // ${secondLastNum}`,
        lastNumIndex: i-1,
        secondLastNumIndex: i-2,
        isCalculation: true
      });
      
      // Step to calculate new value
      generationSteps.push({
        index: i,
        phase: "calculate",
        value: jacobsthalSequence[i],
        explanation: `Calculate next element using recurrence relation`,
        formula: `int next = lastNum + 2 * secondLastNum;`,
        calculation: `next = ${lastNum} + 2 * ${secondLastNum} = ${lastNum + 2 * secondLastNum}`,
        lastNumIndex: i-1,
        secondLastNumIndex: i-2,
        isCalculation: true
      });
      
      // Step to add the new value
      generationSteps.push({
        index: i,
        phase: "push",
        value: jacobsthalSequence[i],
        explanation: `Add new element to the sequence`,
        formula: `jacobsthal.push_back(next); // ${jacobsthalSequence[i]}`,
        lastNumIndex: i-1,
        secondLastNumIndex: i-2,
        isAddition: true
      });
      
      // Step to check if we should continue
      if (i < jacobsthalSequence.length - 1) {
        generationSteps.push({
          index: i,
          phase: "check",
          value: jacobsthalSequence[i],
          explanation: `Check if we need to continue: ${jacobsthalSequence[i]} < ${pairsSize}`,
          formula: `while (jacobsthal.back() < static_cast<int>(size))`,
          condition: `${jacobsthalSequence[i]} < ${pairsSize} → continue`,
          isCheck: true
        });
      } else {
        generationSteps.push({
          index: i,
          phase: "final",
          value: jacobsthalSequence[i],
          explanation: `Jacobsthal sequence generation complete`,
          formula: `return jacobsthal; // Sequence: [${jacobsthalSequence.join(", ")}]`,
          isComplete: true
        });
      }
    }
    
    setSteps(generationSteps);
    setCurrentStep(0);
  }, [jacobsthalSequence, pairsSize]);
  
  // Autoplay functionality
  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
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
    formula: "" 
  };
  
  // Visible sequence up to current step
  const visibleSequence = jacobsthalSequence.slice(0, 
    currentStepData.phase === "push" || currentStepData.phase === "check" || currentStepData.phase === "final" 
      ? currentStepData.index + 1 
      : currentStepData.index
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
          {expanded ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
        </div>
      </div>
      
      {expanded && (
        <div className="p-3 bg-white">
          <div className="text-sm text-gray-600 mb-2">
            This visualization shows how the Jacobsthal sequence is calculated using the same algorithm as in PmergeMe.cpp.
          </div>
          
          {/* Sequence display */}
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {visibleSequence.map((value, idx) => (
                <div 
                  key={idx} 
                  className={`flex flex-col items-center ${
                    currentStepData.lastNumIndex === idx 
                      ? 'ring-2 ring-blue-400' 
                      : currentStepData.secondLastNumIndex === idx 
                      ? 'ring-2 ring-green-400' 
                      : idx === currentStepData.index 
                      ? 'ring-2 ring-purple-400 animate-pulse' 
                      : ''
                  }`}
                >
                  <div className="bg-indigo-100 px-2 py-1 rounded-md text-indigo-800 font-mono text-sm">
                    {value}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">J({idx})</div>
                </div>
              ))}
              
              {currentStepData.phase !== "push" && currentStepData.phase !== "check" && currentStepData.phase !== "final" && 
               currentStepData.index >= visibleSequence.length && (
                <div className="flex flex-col items-center opacity-50">
                  <div className="bg-gray-100 px-2 py-1 rounded-md text-gray-800 font-mono text-sm border border-dashed">
                    ?
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">J({currentStepData.index})</div>
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
                isPlaying ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}
            >
              {isPlaying ? <Pause size={14} className="inline mr-1" /> : <Play size={14} className="inline mr-1" />}
              {isPlaying ? 'Pause' : 'Play Animation'}
            </button>
            
            <div className="flex space-x-1">
              <button 
                onClick={() => setCurrentStep(0)}
                disabled={currentStep === 0}
                className="p-1 bg-gray-100 rounded disabled:opacity-50"
              >
                <SkipBack size={14} />
              </button>
              <button 
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="p-1 bg-gray-100 rounded disabled:opacity-50"
              >
                <ChevronLeft size={14} />
              </button>
              <button 
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                disabled={currentStep >= steps.length - 1}
                className="p-1 bg-gray-100 rounded disabled:opacity-50"
              >
                <ChevronRight size={14} />
              </button>
              <button 
                onClick={() => setCurrentStep(steps.length - 1)}
                disabled={currentStep >= steps.length - 1}
                className="p-1 bg-gray-100 rounded disabled:opacity-50"
              >
                <SkipForward size={14} />
              </button>
            </div>
            
            <div className="text-xs text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          
          {/* Current step explanation */}
          <div className={`rounded-md p-2 mb-3 border ${
            currentStepData.isBaseCase ? 'bg-blue-50 border-blue-100' : 
            currentStepData.isCalculation ? 'bg-indigo-50 border-indigo-100' :
            currentStepData.isAddition ? 'bg-green-50 border-green-100' :
            currentStepData.isCheck ? 'bg-yellow-50 border-yellow-100' :
            currentStepData.isComplete ? 'bg-purple-50 border-purple-100' :
            'bg-gray-50 border-gray-200'
          }`}>
            <div className="font-medium text-sm mb-1">
              {currentStepData.explanation}
            </div>
            
            <div className="font-mono text-xs mb-1 p-1 bg-white bg-opacity-70 rounded border border-gray-100">
              {currentStepData.formula.split('\n').map((line, idx) => 
                <div key={idx}>{line}</div>
              )}
            </div>
            
            {currentStepData.calculation && (
              <div className="font-mono text-xs mt-1 bg-white p-1 rounded border border-indigo-100">
                {currentStepData.calculation}
              </div>
            )}
            
            {currentStepData.condition && (
              <div className="font-mono text-xs mt-1 bg-white p-1 rounded border border-yellow-100">
                {currentStepData.condition}
              </div>
            )}
          </div>
          
          {/* C++ Code */}
          <div className="mb-3">
            <div className="font-medium text-sm mb-1">C++ Implementation:</div>
            <pre className="text-xs bg-gray-50 p-2 rounded-md border overflow-x-auto font-mono">
{`std::vector<int> PmergeMe::getJacob(size_t size)
{
    std::vector<int> jacobsthal;
    jacobsthal.push_back(0);
    jacobsthal.push_back(1);
    
    while (jacobsthal.back() < static_cast<int>(size))
    {
        int lastNum = jacobsthal.back();
        int secondLastNum = jacobsthal[jacobsthal.size() - 2];
        
        int next = lastNum + 2 * secondLastNum;
        jacobsthal.push_back(next);
    }
    
    return jacobsthal;
}`}</pre>
          </div>
          
          {/* Final sequence */}
          <div className="bg-gray-50 rounded-md p-2 text-sm">
            <div className="font-medium mb-1">
              Final Jacobsthal Sequence (used for insertion order):
            </div>
            <div className="font-mono overflow-x-auto whitespace-nowrap text-xs">
              {jacobsthalSequence.map((value, idx) => (
                <span key={idx} className="mr-1">
                  J({idx})={value}{idx < jacobsthalSequence.length - 1 ? "," : ""}
                </span>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Note: The sequence is used to determine the optimal insertion order for the PmergeMe algorithm.
            </div>
          </div>
          
          {/* Show relationship to insertion order */}
          {pairsSize && (
            <div className="mt-3 bg-blue-50 p-2 rounded-md border border-blue-100 text-sm">
              <div className="font-medium mb-1">Relationship to Insertion Order:</div>
              <div>
                For {pairsSize} pairs, we use Jacobsthal numbers that are less than {pairsSize}:{' '}
                {jacobsthalSequence.filter(n => n > 0 && n < pairsSize).join(', ')}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                These values become the primary indices for insertion, with gaps filled in descending order.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JacobsthalGenerator;