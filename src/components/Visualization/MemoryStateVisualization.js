import React from 'react';
import ArrayVisualization from './ArrayVisualization';
import BinarySearchVisualization from './BinarySearchVisualization';

const MemoryStateVisualization = ({ memoryState }) => {
  if (!memoryState) return null;

  // Highlight the current active elements in the arrays
  const highlightActiveElements = (array, activeIndices = []) => {
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

  // Variable explanations
  const getVariableExplanations = () => {
    const explanations = {
      _vec: "The current working array",
      straggler: "Element removed from odd-sized array",
      pairs: "Pairs formed from consecutive elements",
      mainChain: "Larger elements from each pair (to be sorted)",
      result: "The array being built during insertion phase",
      jacobsthal: "Sequence used to optimize insertion order",
      insertionOrder: "Order for inserting remaining elements"
    };

    return (
      <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 mb-4">
        <h3 className="font-semibold text-sm mb-2">Variable Explanations:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {Object.entries(explanations).map(([key, explanation]) => (
            <div key={key} className="flex">
              <span className="font-mono font-bold mr-2">{key}:</span>
              <span>{explanation}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Get operation description
  const getOperationDescription = () => {
    const operations = memoryState.operations || [];
    
    if (operations.length === 0) return null;
    
    return (
      <div className="bg-blue-50 p-3 rounded-md border border-blue-200 mb-4">
        <h3 className="font-semibold text-sm mb-2">Current Operations:</h3>
        <ol className="list-decimal list-inside text-sm">
          {operations.map((op, idx) => (
            <li key={idx} className="mb-1">{op}</li>
          ))}
        </ol>
      </div>
    );
  };

  // Visualization for variable changes
  const getVariableChanges = () => {
    const changes = memoryState.changes || [];
    
    if (changes.length === 0) return null;
    
    return (
      <div className="bg-green-50 p-3 rounded-md border border-green-200 mb-4">
        <h3 className="font-semibold text-sm mb-2">Variable Changes:</h3>
        {changes.map((change, idx) => (
          <div key={idx} className="flex items-center mb-1 text-sm">
            <span className="font-mono font-bold mr-2">{change.variable}:</span>
            <span className="bg-red-100 line-through px-2 py-0.5 rounded mr-2">{change.from}</span>
            <span className="text-green-600">→</span>
            <span className="bg-green-100 px-2 py-0.5 rounded ml-2">{change.to}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="border rounded-md overflow-hidden h-full">
      <div className="bg-gray-100 px-4 py-2 font-semibold border-b">Memory State</div>
      <div className="p-4 bg-white space-y-3 overflow-auto max-h-[500px]">
        {/* Variable Explanations */}
        {getVariableExplanations()}
        
        {/* Current Operations */}
        {getOperationDescription()}
        
        {/* Variable Changes */}
        {getVariableChanges()}
        
        {/* _vec array */}
        {memoryState._vec !== undefined && (
          <div className="flex items-start">
            <span className="font-mono font-bold mr-2 w-24">_vec:</span>
            <div className="flex flex-wrap">
              {memoryState._vec.length > 0 ? 
                highlightActiveElements(memoryState._vec, memoryState.activeIndices?.vec) :
                <div className="text-gray-500 italic">empty</div>
              }
            </div>
          </div>
        )}
        
        {/* Straggler */}
        {memoryState.straggler !== undefined && (
          <div className="flex items-center">
            <span className="font-mono font-bold mr-2 w-24">straggler:</span>
            <div className={`${memoryState.activeIndices?.straggler ? 'ring-2 ring-red-500' : ''} 
                            bg-yellow-100 px-3 py-1 rounded-md text-yellow-800 font-mono`}>
              {memoryState.straggler !== null ? memoryState.straggler : 'null'}
            </div>
          </div>
        )}
        
        {/* Pairs */}
        {memoryState.pairs && memoryState.pairs.length > 0 && (
          <div className="flex items-start">
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
        
        {/* Main Chain */}
        {memoryState.mainChain && memoryState.mainChain.length > 0 && (
          <div className="flex items-start">
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
        
        {/* Result */}
        {memoryState.result && (
          <div className="flex items-start">
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
        
        {/* Jacobsthal Sequence */}
        {memoryState.jacobsthal && (
          <div className="flex items-start">
            <span className="font-mono font-bold mr-2 w-24">jacobsthal:</span>
            <div className="flex flex-wrap">
              {memoryState.jacobsthal.map((value, idx) => (
                <div key={idx} className="flex flex-col items-center mr-1 mb-1">
                  <div className={`${memoryState.activeIndices?.jacobsthal === idx ? 'ring-2 ring-red-500' : ''} 
                                  bg-indigo-100 px-3 py-1 rounded-md text-indigo-800 font-mono`}>
                    {value}
                  </div>
                  <div className="text-xs text-gray-500">J({idx})</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Insertion Order */}
        {memoryState.insertionOrder && (
          <div className="flex items-start">
            <span className="font-mono font-bold mr-2 w-24">insertion:</span>
            <div className="flex flex-wrap">
              {memoryState.insertionOrder.map((value, idx) => (
                <div key={idx} className="flex flex-col items-center mr-1 mb-1">
                  <div className={`${memoryState.activeIndices?.insertionOrder === idx ? 'ring-2 ring-red-500' : ''} 
                                  bg-pink-100 px-3 py-1 rounded-md text-pink-800 font-mono`}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Binary Search Visualization */}
        {memoryState.binarySearch && (
          <BinarySearchVisualization binarySearch={memoryState.binarySearch} />
        )}
        
        {/* Recursion Level */}
        {memoryState.level && (
          <div className="mt-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-md font-semibold">
            {memoryState.level}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryStateVisualization;