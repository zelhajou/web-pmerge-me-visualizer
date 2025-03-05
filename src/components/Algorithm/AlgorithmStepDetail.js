import React from 'react';

const AlgorithmStepDetail = ({ step, currentStep, totalSteps }) => {
  if (!step) return null;
  
  // Calculate progress percentage
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  // Format the step title with algorithm phase indicators
  const formatTitle = (title) => {
    // Check for specific algorithm phases
    const phases = {
      'Initial Input': 'start',
      'Handle Odd-sized': 'straggler',
      'Form Pairs': 'pairs',
      'Sort Within Pairs': 'sort-pairs',
      'Extract Main Chain': 'extract',
      'Recursive': 'recursion',
      'Insert': 'insert',
      'Return': 'return'
    };
    
    // Find matching phase
    let phaseKey = Object.keys(phases).find(key => title.includes(key));
    const phase = phaseKey ? phases[phaseKey] : 'other';
    
    // Apply color based on phase
    const phaseColors = {
      'start': 'blue',
      'straggler': 'yellow',
      'pairs': 'purple',
      'sort-pairs': 'indigo',
      'extract': 'green',
      'recursion': 'red',
      'insert': 'pink',
      'return': 'teal',
      'other': 'gray'
    };
    
    const color = phaseColors[phase];
    
    return (
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full bg-${color}-500 mr-2`}></div>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>
    );
  };
  
  return (
    <div className="bg-white border rounded-t-md p-4 flex flex-col gap-4 shadow-sm">
      <div className="flex-1">
        {formatTitle(step.title)}
        <p className="text-gray-600 mt-1">{step.description}</p>
        
        {/* Algorithm phase indicator */}
        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Start</span>
            <span>Pair Formation</span>
            <span>Main Chain</span>
            <span>Insertion</span>
            <span>Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs font-medium text-blue-600">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-xs font-medium text-gray-500">
              {progress.toFixed(0)}% complete
            </span>
          </div>
        </div>
      </div>
      
      {/* Key operations for this step */}
      {step.memoryState && step.memoryState.operations && step.memoryState.operations.length > 0 && (
        <div className="mt-2 py-2 px-3 bg-blue-50 border border-blue-100 rounded-md">
          <h3 className="text-sm font-semibold text-blue-800 mb-1">Key Operations:</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            {step.memoryState.operations.map((operation, idx) => (
              <li key={idx} className="text-gray-700">{operation}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Variable changes in this step */}
      {step.memoryState && step.memoryState.changes && step.memoryState.changes.length > 0 && (
        <div className="mt-2 py-2 px-3 bg-green-50 border border-green-100 rounded-md">
          <h3 className="text-sm font-semibold text-green-800 mb-1">Variable Changes:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {step.memoryState.changes.map((change, idx) => (
              <div key={idx} className="flex items-center text-sm">
                <span className="font-mono font-bold mr-2">{change.variable}:</span>
                <div className="flex items-center">
                  <span className="bg-red-100 line-through px-2 py-0.5 rounded mr-1 text-xs max-w-xs truncate">
                    {change.from}
                  </span>
                  <span className="text-green-600">→</span>
                  <span className="bg-green-100 px-2 py-0.5 rounded ml-1 text-xs max-w-xs truncate">
                    {change.to}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlgorithmStepDetail;