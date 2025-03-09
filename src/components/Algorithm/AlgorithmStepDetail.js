import React from 'react';

const AlgorithmStepDetail = ({ step, currentStep, totalSteps }) => {
  if (!step) return null;
  
  // Calculate progress percentage
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  // Get indicator color based on the stage of the algorithm
  const getStageColor = (title) => {
    if (title.includes('Initial') || title.includes('Base Case')) return 'blue';
    if (title.includes('Odd-sized') || title.includes('Straggler')) return 'yellow';
    if (title.includes('Pair') || title.includes('Form')) return 'purple';
    if (title.includes('Main Chain')) return 'green';
    if (title.includes('Pendingsert')) return 'pink';
    if (title.includes('Recursive') || title.includes('Level')) return 'red';
    if (title.includes('Jacobsthal') || title.includes('Insertion Order')) return 'indigo';
    if (title.includes('Insert')) return 'orange';
    if (title.includes('Final') || title.includes('Return')) return 'teal';
    return 'gray';
  };
  
  const stageColor = getStageColor(step.title);
  
  return (
    <div className="border-b p-3">
      {/* Title with stage indicator */}
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full bg-${stageColor}-500 mr-2 flex-shrink-0`}></div>
        <h2 className="text-lg font-bold text-gray-800">{step.title}</h2>
      </div>
      
      <p className="text-gray-600 text-sm mt-1">
        {step.description}
      </p>

      {/* Progress indicators */}
      <div className="flex justify-between text-xs text-gray-500 mt-2 mb-1">
        <span>Start</span>
        <span>Pair Formation</span>
        <span>Main Chain</span>
        <span>Insertion</span>
        <span>Complete</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full"
          style={{
            width: `${progress}%`,
          }}
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
      
      {/* Operations section */}
      {step.memoryState?.operations && step.memoryState?.operations.length > 0 && (
        <div className="mt-3 bg-blue-50 border border-blue-100 rounded-md p-2">
          <h3 className="text-sm font-semibold text-blue-800 mb-1">Current Operations:</h3>
          <ul className="list-disc list-inside space-y-0.5 text-sm">
            {step.memoryState.operations.map((op, idx) => (
              <li key={idx} className="text-gray-700">{op}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AlgorithmStepDetail;