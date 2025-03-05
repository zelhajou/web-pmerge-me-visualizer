import React, { useState } from "react";
import ArrayVisualization from "./ArrayVisualization";
import BinarySearchVisualization from "./BinarySearchVisualization";
import { ChevronDown, ChevronUp, HelpCircle, AlertCircle } from 'lucide-react';

const MemoryStateVisualization = ({ memoryState }) => {
  // State for collapsible sections - must be at the top level
  const [showExplanations, setShowExplanations] = useState(true);
  const [showOperations, setShowOperations] = useState(true);
  const [showChanges, setShowChanges] = useState(true);
  
  if (!memoryState) return null;

  // Highlight the current active elements in the arrays
  const highlightActiveElements = (array, activeIndices = []) => {
    return array.map((value, idx) => {
      // Check if activeIndices contains the current index - handle different data types
      const isActive = Array.isArray(activeIndices) 
        ? activeIndices.includes(idx)
        : activeIndices === idx;
        
      return (
        <div key={idx} className="flex flex-col items-center mr-1.5 mb-1.5">
          <div
            className={`${
              isActive 
                ? "ring-2 ring-red-500 shadow-sm" 
                : "hover:bg-opacity-80"
            } 
               px-2.5 py-1 rounded-md font-mono text-sm transition-all
               bg-purple-100 text-purple-800`}
          >
            {value}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">{idx}</div>
        </div>
      );
    });
  };

  // Variable explanations - collapsible and improved
  const getVariableExplanations = () => {
    const explanations = {
      _vec: "Current working array",
      straggler: "Element removed from odd-sized array",
      pairs: "Pairs from consecutive elements",
      mainChain: "Larger elements from each pair",
      result: "Array being built during insertion",
      jacobsthal: "Sequence for insertion order",
      insertionOrder: "Order for inserting elements",
    };

    return (
      <div className="bg-yellow-50 rounded-md border border-yellow-200 mb-3 overflow-hidden">
        <div 
          className="flex items-center justify-between px-3 py-1.5 bg-yellow-100 cursor-pointer"
          onClick={() => setShowExplanations(!showExplanations)}
        >
          <h3 className="font-semibold text-sm flex items-center">
            <HelpCircle size={14} className="mr-1.5 text-yellow-700" />
            Variable Explanations
          </h3>
          {showExplanations ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        
        {showExplanations && (
          <div className="p-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              {Object.entries(explanations).map(([key, explanation]) => (
                <div key={key} className="flex">
                  <span className="font-mono font-bold mr-1.5 text-yellow-800">{key}:</span>
                  <span className="text-gray-700">{explanation}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Get operation description - collapsible and improved
  const getOperationDescription = () => {
    const operations = memoryState.operations || [];

    if (operations.length === 0) return null;

    return (
      <div className="bg-blue-50 rounded-md border border-blue-200 mb-3 overflow-hidden">
        <div 
          className="flex items-center justify-between px-3 py-1.5 bg-blue-100 cursor-pointer"
          onClick={() => setShowOperations(!showOperations)}
        >
          <h3 className="font-semibold text-sm flex items-center">
            <AlertCircle size={14} className="mr-1.5 text-blue-700" />
            Current Operations
          </h3>
          {showOperations ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        
        {showOperations && (
          <div className="p-2.5">
            <ul className="list-disc list-inside text-xs space-y-1">
              {operations.map((op, idx) => (
                <li key={idx} className="text-gray-700">{op}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  // Visualization for variable changes - collapsible and improved
  const getVariableChanges = () => {
    const changes = memoryState.changes || [];

    if (changes.length === 0) return null;

    return (
      <div className="bg-green-50 rounded-md border border-green-200 mb-3 overflow-hidden">
        <div 
          className="flex items-center justify-between px-3 py-1.5 bg-green-100 cursor-pointer"
          onClick={() => setShowChanges(!showChanges)}
        >
          <h3 className="font-semibold text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-green-700" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
            </svg>
            Variable Changes
          </h3>
          {showChanges ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        
        {showChanges && (
          <div className="p-2.5">
            <div className="grid grid-cols-1 gap-2 text-xs">
              {changes.map((change, idx) => (
                <div key={idx} className="flex items-center flex-wrap">
                  <span className="font-mono font-bold mr-1.5 text-green-800">{change.variable}:</span>
                  <div className="flex items-center flex-wrap">
                    <span className="bg-red-100 line-through px-1.5 py-0.5 rounded mr-1 text-xs max-w-xs truncate text-red-800">
                      {change.from}
                    </span>
                    <span className="text-green-600 mx-1">→</span>
                    <span className="bg-green-100 px-1.5 py-0.5 rounded text-xs max-w-xs truncate text-green-800">
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

  // Helper to render memory variable and its array values
  const renderMemoryVariable = (name, values, colorClass, activeIndices, specialRenderer = null) => {
    if (values === undefined) return null;
    
    return (
      <div className="flex items-start py-1.5 px-1 hover:bg-gray-50 rounded-md border border-transparent hover:border-gray-200 transition-colors">
        <span className="font-mono font-bold mr-2 w-20 text-sm text-gray-700 flex-shrink-0">{name}:</span>
        <div className="flex flex-wrap">
          {values.length > 0 ? (
            specialRenderer ? specialRenderer(values, activeIndices) : 
            highlightActiveElements(values, activeIndices)
          ) : (
            <div className="text-gray-500 italic text-sm">empty</div>
          )}
        </div>
      </div>
    );
  };

  // Special renderer for pairs
  const renderPairs = (pairs, activeIndex) => {
    return pairs.map((pair, idx) => (
      <div key={idx} className="flex flex-col items-center mr-2 mb-2">
        <div
          className={`${
            activeIndex === idx ? "ring-2 ring-red-500 shadow-sm" : "hover:bg-opacity-80"
          } 
          bg-blue-100 px-2.5 py-1 rounded-md text-blue-800 font-mono text-sm flex transition-all`}
        >
          ({pair[0]}, {pair[1]})
        </div>
        <div className="text-xs text-gray-500 mt-0.5">{idx}</div>
      </div>
    ));
  };

  // Special renderer for Jacobsthal sequences
  const renderJacobsthal = (sequence, activeIndex) => {
    return sequence.map((value, idx) => (
      <div key={idx} className="flex flex-col items-center mr-1.5 mb-1.5">
        <div
          className={`${
            activeIndex === idx ? "ring-2 ring-red-500 shadow-sm" : "hover:bg-opacity-80"
          } 
          bg-indigo-100 px-2.5 py-1 rounded-md text-indigo-800 font-mono text-sm transition-all`}
        >
          {value}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">J({idx})</div>
      </div>
    ));
  };

  // Determine if there are variable changes or operations
  const hasMetadata = (memoryState.operations && memoryState.operations.length > 0) || 
                     (memoryState.changes && memoryState.changes.length > 0);

  return (
    <div className="bg-white rounded-lg border shadow-sm h-full overflow-hidden">
      <div className="bg-gray-100 px-3 py-2 border-b flex justify-between items-center">
        <h2 className="font-semibold text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          Memory State
        </h2>
        {memoryState.level && (
          <div className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded-md text-xs font-medium">
            {memoryState.level}
          </div>
        )}
      </div>

      <div className="p-3 space-y-2 overflow-auto h-full max-h-[calc(100%-40px)]">
        {/* Variable Explanations */}
        {getVariableExplanations()}

        {/* Operations and Changes - Conditional Grid */}
        {hasMetadata && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {memoryState.operations && memoryState.operations.length > 0 && (
              <div className="col-span-1">
                {getOperationDescription()}
              </div>
            )}
            {memoryState.changes && memoryState.changes.length > 0 && (
              <div className="col-span-1">
                {getVariableChanges()}
              </div>
            )}
          </div>
        )}

        {/* Memory variables section */}
        <div className="space-y-0.5 pb-2 divide-y divide-gray-100">
          {/* _vec array */}
          {renderMemoryVariable("_vec", memoryState._vec, "bg-purple-100 text-purple-800", memoryState.activeIndices?.vec)}

          {/* Straggler */}
          {memoryState.straggler !== undefined && (
            <div className="flex items-center py-1.5 px-1 hover:bg-gray-50 rounded-md border border-transparent hover:border-gray-200 transition-colors">
              <span className="font-mono font-bold mr-2 w-20 text-sm text-gray-700">straggler:</span>
              <div
                className={`${
                  memoryState.activeIndices?.straggler ? "ring-2 ring-red-500 shadow-sm" : "hover:bg-opacity-80"
                } 
                bg-yellow-100 px-2.5 py-1 rounded-md text-yellow-800 font-mono text-sm transition-all`}
              >
                {memoryState.straggler !== null ? memoryState.straggler : "null"}
              </div>
            </div>
          )}

          {/* Pairs */}
          {renderMemoryVariable("pairs", memoryState.pairs, "bg-blue-100 text-blue-800", memoryState.activeIndices?.pairs, renderPairs)}

          {/* Main Chain */}
          {renderMemoryVariable("mainChain", memoryState.mainChain, "bg-green-100 text-green-800", memoryState.activeIndices?.mainChain)}

          {/* Result */}
          {renderMemoryVariable("result", memoryState.result, "bg-red-100 text-red-800", memoryState.activeIndices?.result)}

          {/* Jacobsthal Sequence */}
          {renderMemoryVariable("jacobsthal", memoryState.jacobsthal, "bg-indigo-100 text-indigo-800", memoryState.activeIndices?.jacobsthal, renderJacobsthal)}

          {/* Insertion Order */}
          {renderMemoryVariable("insertion", memoryState.insertionOrder, "bg-pink-100 text-pink-800", memoryState.activeIndices?.insertionOrder)}
        </div>

        {/* Binary Search Visualization - Enhanced and more visible */}
        {memoryState.binarySearch && (
          <div className="mt-3 border-t pt-3">
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-3">
              <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Binary Search Visualization
              </h3>
              <BinarySearchVisualization binarySearch={memoryState.binarySearch} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryStateVisualization;