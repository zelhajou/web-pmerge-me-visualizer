import React from 'react';

const BinarySearchVisualization = ({ binarySearch }) => {
  if (!binarySearch) return null;

  // Extract data from the binary search object
  const { value, array, steps } = binarySearch;

  // Determine the most recent step to highlight
  const lastStep = steps[steps.length - 1];
  const isFound = lastStep.includes("Found at position");
  
  // Parse the last position value
  const positionMatch = lastStep.match(/position = (\d+)/);
  const position = positionMatch ? parseInt(positionMatch[1]) : null;

  // Create a visualization of the array with the search space highlighted
  const renderSearchSpace = () => {
    return (
      <div className="flex flex-col mb-4">
        <div className="text-sm font-semibold mb-2">Search space:</div>
        <div className="flex flex-wrap mb-2">
          {array.map((num, idx) => {
            // Determine the appropriate styling for this cell
            const isTarget = position === idx;
            const cellStyle = isTarget
              ? "bg-green-200 border-green-400" 
              : "bg-gray-100 border-gray-300";
            
            return (
              <div key={idx} className="flex flex-col items-center mr-1 mb-1">
                <div className={`${cellStyle} px-3 py-1 rounded-md border font-mono relative`}>
                  {num}
                  {isTarget && (
                    <div className="absolute -bottom-5 left-0 right-0 flex justify-center">
                      <div className="text-xs text-green-700">
                        {isFound ? "Found!" : "Insert here"}
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-2">{idx}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Create a visualization of the binary search steps
  const renderSteps = () => {
    return (
      <div className="mt-4">
        <div className="text-sm font-semibold mb-2">Search steps:</div>
        <div className="bg-gray-50 border border-gray-200 rounded-md p-2">
          <div className="text-sm mb-2">
            Searching for value: <span className="font-mono bg-blue-100 px-2 py-0.5 rounded-md">{value}</span>
          </div>
          <ol className="list-decimal pl-5 space-y-1">
            {steps.map((step, idx) => (
              <li key={idx} className={`font-mono text-xs ${idx === steps.length - 1 ? 'text-green-700 font-bold' : ''}`}>
                {step}
              </li>
            ))}
          </ol>
          <div className="text-sm mt-3 pt-2 border-t border-gray-200">
            Final position: <span className="font-mono bg-green-100 px-2 py-0.5 rounded-md">{position}</span>
          </div>
        </div>
      </div>
    );
  };

  // Create a visual animation of the binary search process
  const renderSearchAnimation = () => {
    // This function generates a visual representation of how binary search
    // divides the search space in each step

    // Parse the steps to extract left, right, and mid indices
    const searchAnimations = steps.map(step => {
      const midMatch = step.match(/mid=(\d+)/);
      if (midMatch) {
        return {
          mid: parseInt(midMatch[1]),
          goLeft: step.includes("go left"),
          goRight: step.includes("go right"),
          found: step.includes("Found")
        };
      }
      return null;
    }).filter(Boolean);

    return (
      <div className="mt-4">
        <div className="text-sm font-semibold mb-2">Search animation:</div>
        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
          <div className="flex items-center w-full h-10 relative">
            {/* Base bar representing the full array */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gray-200 rounded-full"></div>
            
            {/* Animated search divisions */}
            {searchAnimations.map((anim, idx) => {
              // Calculate position as percentage
              const position = (anim.mid / (array.length - 1)) * 100;
              const color = anim.found ? "bg-green-500" : "bg-blue-500";
              
              return (
                <React.Fragment key={idx}>
                  {/* Division marker */}
                  <div 
                    className={`absolute top-0 h-8 border-l-2 ${color} z-10`} 
                    style={{ left: `${position}%` }}
                  >
                    <div className="absolute -top-6 -ml-3 text-xs font-mono bg-white px-1 rounded-md border">
                      {anim.mid}
                    </div>
                  </div>
                  
                  {/* Direction indicator */}
                  {(anim.goLeft || anim.goRight) && (
                    <div 
                      className={`absolute top-3 text-xs font-semibold text-${anim.goLeft ? 'blue' : 'purple'}-600`}
                      style={{ 
                        left: `${position + (anim.goLeft ? -10 : 5)}%`,
                        transform: anim.goLeft ? 'rotate(-45deg)' : 'rotate(45deg)'
                      }}
                    >
                      {anim.goLeft ? '← left' : 'right →'}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-6 p-3 bg-blue-50 rounded-md border border-blue-200">
      <div className="font-bold text-md mb-1">Binary Search for {value}</div>
      
      {/* Search space visualization */}
      {renderSearchSpace()}
      
      {/* Steps explanation */}
      {renderSteps()}
      
      {/* Visual animation of the search */}
      {array.length > 3 && renderSearchAnimation()}
    </div>
  );
};

export default BinarySearchVisualization;