import React, { useState, useEffect } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

const JacobsthalGenerator = ({ pairsSize, jacobsthalSequence, className = "" }) => {
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
      formula: "J(0) = 0"
    });
    
    if (jacobsthalSequence.length > 1) {
      generationSteps.push({
        index: 1,
        value: 1,
        explanation: "Base case: J(1) = 1",
        formula: "J(1) = 1"
      });
    }
    
    // Add computation steps
    for (let i = 2; i < jacobsthalSequence.length; i++) {
      const prev1 = jacobsthalSequence[i-1];
      const prev2 = jacobsthalSequence[i-2];
      generationSteps.push({
        index: i,
        value: jacobsthalSequence[i],
        explanation: `Calculate J(${i}) using the recurrence relation`,
        formula: `J(${i}) = J(${i-1}) + 2×J(${i-2})`,
        calculation: `J(${i}) = ${prev1} + 2×${prev2} = ${prev1 + 2*prev2}`,
        prev1Index: i-1,
        prev2Index: i-2
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
        setCurrentStep(prev => prev + 1);
      }, 500);
    } else if (isPlaying && currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
    
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length]);
  
  // Current step data
  const currentStepData = steps[currentStep] || { index: 0, value: 0, explanation: "", formula: "" };
  
  // Visible sequence up to current step
  const visibleSequence = jacobsthalSequence.slice(0, currentStepData.index + 1);
  
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
            This visualization shows how the Jacobsthal sequence used for insertion order is calculated step by step.
          </div>
          
          {/* Sequence display */}
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {visibleSequence.map((value, idx) => (
                <div 
                  key={idx} 
                  className={`flex flex-col items-center ${
                    currentStepData.prev1Index === idx 
                      ? 'ring-2 ring-blue-400' 
                      : currentStepData.prev2Index === idx 
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
              
              {currentStepData.index < jacobsthalSequence.length - 1 && (
                <div className="flex flex-col items-center opacity-50">
                  <div className="bg-gray-100 px-2 py-1 rounded-md text-gray-800 font-mono text-sm border border-dashed">
                    ?
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">J({currentStepData.index + 1})</div>
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
              {isPlaying ? 'Pause' : 'Play Animation'}
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
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
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
            
            <div className="font-mono text-sm">
              {currentStepData.formula}
            </div>
            
            {currentStepData.calculation && (
              <div className="font-mono text-sm mt-1 bg-white p-1 rounded border border-indigo-100">
                {currentStepData.calculation}
              </div>
            )}
          </div>
          
          {/* Final sequence */}
          <div className="bg-gray-50 rounded-md p-2 text-sm">
            <div className="font-medium mb-1">Final Jacobsthal Sequence (used for insertion order):</div>
            <div className="font-mono overflow-x-auto whitespace-nowrap text-xs">
              {jacobsthalSequence.map((value, idx) => (
                <span key={idx} className="mr-1">
                  J({idx})={value}{idx < jacobsthalSequence.length - 1 ? "," : ""}
                </span>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Note: The Jacobsthal sequence grows rapidly and provides an optimal insertion order for the Ford-Johnson algorithm.
            </div>
          </div>
          
          {/* Show relationship to insertion order */}
          {pairsSize && (
            <div className="mt-3 bg-blue-50 p-2 rounded-md border border-blue-100 text-sm">
              <div className="font-medium mb-1">Relationship to Insertion Order:</div>
              <div>
                For {pairsSize} pairs, we use Jacobsthal numbers that are less than {pairsSize}:
                {' '}{jacobsthalSequence.filter(n => n > 0 && n < pairsSize).join(', ')}
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