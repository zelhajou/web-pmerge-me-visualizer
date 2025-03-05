import React from 'react';

/**
 * Component to visualize the Jacobsthal sequence and how it's used
 * for determining insertion order in the Ford-Johnson algorithm
 */
const JacobsthalVisualization = ({ jacobsthal, insertionOrder, activeIndex }) => {
  if (!jacobsthal || jacobsthal.length === 0) return null;

  // Generate Jacobsthal sequence formula steps
  const generateFormulaSteps = (sequence, limit = 6) => {
    const steps = [];
    for (let i = 2; i < Math.min(sequence.length, limit); i++) {
      steps.push(
        <div key={i} className="text-xs font-mono">
          J({i}) = J({i-1}) + 2·J({i-2}) = {sequence[i-1]} + 2·{sequence[i-2]} = {sequence[i]}
        </div>
      );
    }
    return steps;
  };

  // Visualize how insertion order is derived from Jacobsthal sequence
  const renderInsertionOrderDerivation = () => {
    if (!insertionOrder || insertionOrder.length === 0) return null;
    
    return (
      <div className="mt-3 pb-3 border-b border-gray-200">
        <h4 className="text-sm font-semibold mb-2">Insertion Order Derivation:</h4>
        <div className="flex flex-col space-y-2">
          <div className="text-xs">
            1. Start with the Jacobsthal numbers that are within range: 
            <span className="font-mono bg-yellow-100 px-1 ml-1">
              {jacobsthal.filter(n => n > 0 && n < 20).join(', ')}...
            </span>
          </div>
          <div className="text-xs">
            2. Use these numbers as indices for insertion, filling gaps in descending order
          </div>
          <div className="text-xs flex items-center">
            3. Final insertion order: 
            <div className="flex flex-wrap ml-1">
              {insertionOrder.map((idx, i) => (
                <span 
                  key={i}
                  className={`inline-flex items-center justify-center w-6 h-6 m-0.5 rounded-full text-xs
                    ${i === activeIndex 
                      ? 'bg-red-500 text-white ring-2 ring-red-300' 
                      : 'bg-blue-100 text-blue-800'}`
                  }
                >
                  {idx}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Visualize the sequence pattern graphically
  const renderSequencePattern = () => {
    return (
      <div className="mt-3">
        <h4 className="text-sm font-semibold mb-2">Sequence Pattern:</h4>
        <div className="relative h-24 w-full bg-gray-50 rounded-md p-2 overflow-hidden">
          {/* Draw dots for each number */}
          {jacobsthal.map((num, idx) => {
            // Skip J(0) since it's 0
            if (idx === 0) return null;
            
            // Calculate position (exponential scale for better visualization)
            const xPos = (Math.log(idx + 1) / Math.log(jacobsthal.length)) * 90;
            const yPos = 100 - (num / Math.max(...jacobsthal)) * 80;
            
            return (
              <div 
                key={idx}
                className={`absolute w-4 h-4 rounded-full flex items-center justify-center
                  ${jacobsthal[idx] === activeIndex ? 'bg-red-500 text-white' : 'bg-blue-400 text-white'}`}
                style={{ 
                  left: `${xPos}%`, 
                  top: `${yPos}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                title={`J(${idx})=${num}`}
              >
                <span className="text-xs">{idx}</span>
              </div>
            );
          })}
          
          {/* Draw connecting lines */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
            <path 
              d={jacobsthal.slice(1).map((num, idx) => {
                const realIdx = idx + 1;
                const xPos = (Math.log(realIdx + 1) / Math.log(jacobsthal.length)) * 90;
                const yPos = 100 - (num / Math.max(...jacobsthal)) * 80;
                return `${idx === 0 ? 'M' : 'L'} ${xPos}% ${yPos}%`;
              }).join(' ')}
              stroke="rgba(59, 130, 246, 0.5)"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          
          {/* Y-axis label */}
          <div className="absolute left-0 top-0 h-full flex items-center">
            <div className="transform -rotate-90 text-xs text-gray-500 whitespace-nowrap">
              Value
            </div>
          </div>
          
          {/* X-axis label */}
          <div className="absolute bottom-0 left-0 w-full text-center">
            <div className="text-xs text-gray-500">
              Index
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border rounded-md overflow-hidden mt-4">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 font-semibold border-b flex items-center justify-between">
        <span>Jacobsthal Sequence Visualization</span>
        <span className="text-xs text-purple-600 font-normal">
          Optimizing insertion order
        </span>
      </div>
      
      <div className="p-4">
        <div className="flex flex-wrap gap-1 mb-2">
          {jacobsthal.map((num, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col items-center ${idx === activeIndex ? 'scale-110 transform' : ''}`}
            >
              <div className={`
                px-2 py-1 rounded-md font-mono text-sm
                ${jacobsthal[idx] === activeIndex 
                  ? 'bg-red-100 text-red-800 font-bold' 
                  : 'bg-indigo-100 text-indigo-800'}
              `}>
                {num}
              </div>
              <div className="text-xs text-gray-500">J({idx})</div>
            </div>
          ))}
        </div>
        
        <div className="mt-3 pb-3 border-b border-gray-200">
          <h4 className="text-sm font-semibold mb-2">Sequence Formula:</h4>
          <div className="bg-gray-50 p-2 rounded-md">
            <div className="text-xs font-mono mb-1">J(0) = 0</div>
            <div className="text-xs font-mono mb-1">J(1) = 1</div>
            <div className="text-xs font-mono mb-2">J(n) = J(n-1) + 2·J(n-2) for n ≥ 2</div>
            {generateFormulaSteps(jacobsthal)}
          </div>
        </div>
        
        {renderInsertionOrderDerivation()}
        
        {renderSequencePattern()}
        
        <div className="mt-4 bg-yellow-50 p-3 rounded-md text-sm border border-yellow-100">
          <h4 className="font-semibold text-yellow-800 mb-1">Why Jacobsthal?</h4>
          <p className="text-yellow-800 text-xs">
            The Jacobsthal sequence provides an optimal order for inserting elements in the Ford-Johnson algorithm.
            It minimizes the number of comparisons needed by strategically choosing insertion positions that
            take advantage of previously inserted elements.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JacobsthalVisualization;