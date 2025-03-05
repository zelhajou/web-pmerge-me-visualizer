import React from 'react';
import { Code } from 'lucide-react';

const CodeVisualization = ({ code }) => {
  // Parse the code to add line numbers and highlight important parts
  const codeWithLineNumbers = () => {
    if (!code) return [];
    
    const lines = code.split('\n');
    
    return lines.map((line, idx) => {
      // Check for special comments or important statements
      const isComment = line.trim().startsWith('//');
      const isImportant = line.includes('mainChain') || 
                          line.includes('result') || 
                          line.includes('straggler') ||
                          line.includes('return');
      
      // Handle different parts of the code with special highlighting
      const lineClass = isComment 
                      ? 'text-gray-500 italic' 
                      : isImportant
                      ? 'text-blue-600 font-semibold'
                      : '';
      
      return (
        <div key={idx} className="flex">
          <div className="w-8 flex-shrink-0 text-gray-400 select-none text-right pr-2">
            {idx + 1}
          </div>
          <pre className={`${lineClass}`}>
            {line}
          </pre>
        </div>
      );
    });
  };
  
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 font-semibold border-b flex items-center justify-between">
        <div className="flex items-center">
          <Code size={18} className="mr-2" /> Current Code
        </div>
        <div className="text-xs text-gray-500">
          <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-600 rounded-md">
            Blue = important operations
          </span>
        </div>
      </div>
      <div className="bg-gray-50 font-mono text-sm p-4 overflow-x-auto max-h-[300px] overflow-y-auto">
        {codeWithLineNumbers()}
      </div>
    </div>
  );
};

export default CodeVisualization;