import React from 'react';

const CallStackVisualization = ({ callStack }) => {
  if (!callStack || callStack.length === 0) {
    return null;
  }

  // Reverse the call stack for display (newest on top)
  const reversedStack = [...callStack].reverse();
  
  // Determine the function level depth for indentation
  const getFunctionDepth = (funcName) => {
    if (funcName === 'main()') return 0;
    
    const recursiveMatch = funcName.match(/Level (\d+)/);
    if (recursiveMatch) {
      return parseInt(recursiveMatch[1]) + 1;
    }
    
    // Regular functions are one level deep from their parent
    return 1;
  };
  
  // Get function type for coloring
  const getFunctionType = (funcName) => {
    if (funcName === 'main()') return 'main';
    if (funcName.includes('sortVector()')) return 'sort';
    if (funcName.includes('sortMainChain()')) return 'chain';
    if (funcName.includes('insertElementsUsingFordJohnson()')) return 'insert';
    if (funcName.includes('handleStragglerElement()')) return 'straggler';
    if (funcName.includes('formSortedPairs()')) return 'pairs';
    if (funcName.includes('extractMainChain()')) return 'extract';
    if (funcName.includes('Binary')) return 'binary';
    return 'other';
  };
  
  // Get style for function type
  const getFunctionStyle = (type) => {
    const styles = {
      main: 'bg-gray-100 text-gray-800',
      sort: 'bg-blue-100 text-blue-800',
      chain: 'bg-green-100 text-green-800',
      insert: 'bg-purple-100 text-purple-800',
      straggler: 'bg-yellow-100 text-yellow-800',
      pairs: 'bg-indigo-100 text-indigo-800',
      extract: 'bg-red-100 text-red-800',
      binary: 'bg-teal-100 text-teal-800',
      other: 'bg-gray-50 text-gray-700'
    };
    
    return styles[type] || styles.other;
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 font-semibold border-b flex items-center justify-between">
        <span>Call Stack</span>
        <span className="text-xs text-gray-500">Top → Bottom</span>
      </div>
      
      <div className="bg-white p-1 max-h-[300px] overflow-auto">
        {reversedStack.map((call, idx) => {
          const functionType = getFunctionType(call);
          const depth = getFunctionDepth(call);
          const style = getFunctionStyle(functionType);
          
          return (
            <div 
              key={idx} 
              className={`px-3 py-1.5 font-mono text-sm rounded-md mb-1 flex items-center ${idx === 0 ? 'border-l-4 border-green-500' : ''}`}
              style={{ marginLeft: `${depth * 12}px` }}
            >
              {/* Function indicator icon */}
              <div className={`mr-2 w-4 h-4 flex-shrink-0 rounded-full ${style.replace('bg-', 'bg-')}`}>
                {idx === 0 && (
                  <div className="w-full h-full flex items-center justify-center text-xs">⚡</div>
                )}
              </div>
              
              {/* Arrow for showing depth */}
              {depth > 0 && (
                <div className="text-gray-400 mr-1">
                  {'→'.repeat(depth)}
                </div>
              )}
              
              {/* Function name */}
              <div className={`py-0.5 px-2 rounded-md ${style}`}>
                {call}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend for call stack colors */}
      <div className="p-2 bg-gray-50 border-t text-xs flex flex-wrap gap-2">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-100 mr-1"></div>
          <span>Sort</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-100 mr-1"></div>
          <span>Chain</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-purple-100 mr-1"></div>
          <span>Insert</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-100 mr-1"></div>
          <span>Straggler</span>
        </div>
      </div>
    </div>
  );
};

export default CallStackVisualization;