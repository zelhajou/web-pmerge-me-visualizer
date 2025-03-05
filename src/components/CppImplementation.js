 

import React, { useState, useEffect } from 'react';
import { Code, Copy, Check, ExternalLink } from 'lucide-react';

const CppImplementation = () => {
  const [copied, setCopied] = useState(false);
  const [showFullCode, setShowFullCode] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // The C++ implementation code
  const cppCode = `
// Ford-Johnson (Merge-Insert) Sort Implementation
std::vector<int> PmergeMe::getJacobsthalSequence(int n) {
    std::vector<int> jacobsthal;
    
    jacobsthal.push_back(0);
    if (n > 0)
        jacobsthal.push_back(1);
    
    for (int i = 2; i <= n; i++) {
        int next = jacobsthal[i-1] + 2 * jacobsthal[i-2];
        jacobsthal.push_back(next);
    }
    
    return jacobsthal;
}

void PmergeMe::sortVector() {
    if (_vec.size() <= 1)
        return;
    
    // Step 1: Handle odd-sized array
    bool hasStraggler = false;
    int straggler = 0;
    
    if (_vec.size() % 2 != 0) {
        hasStraggler = true;
        straggler = _vec.back();
        _vec.pop_back();
    }
    
    // Step 2: Form pairs from consecutive elements
    std::vector<std::pair<int, int> > pairs;
    for (size_t i = 0; i < _vec.size(); i += 2) {
        int first = _vec[i];
        int second = _vec[i + 1];
        pairs.push_back(std::make_pair(first, second));
    }
    
    // Step 3: Sort elements within pairs (larger element first)
    for (size_t i = 0; i < pairs.size(); i++) {
        if (pairs[i].first < pairs[i].second)
            std::swap(pairs[i].first, pairs[i].second);
    }
    
    // Step 4: Extract main chain (larger elements)
    std::vector<int> mainChain;
    for (size_t i = 0; i < pairs.size(); i++) {
        mainChain.push_back(pairs[i].first);
    }
    
    // Step 5: Recursively sort main chain
    if (mainChain.size() > 1) {
        _vec = mainChain;
        sortVector();
        mainChain = _vec;
    }
    
    // Step 6: Initialize result with the first element from main chain
    std::vector<int> result;
    if (!mainChain.empty())
        result.push_back(mainChain[0]);
    
    // Step 7: Insert first smaller element
    if (!pairs.empty())
        result.insert(result.begin(), pairs[0].second);
    
    // Step 8: For remaining elements, use Jacobsthal sequence
    if (pairs.size() > 1) {
        // Generate Jacobsthal sequence
        int jacobsthalSize = 3;
        while (getJacobsthalSequence(jacobsthalSize).back() < (int)pairs.size())
            jacobsthalSize++;
        
        std::vector<int> jacobSeq = getJacobsthalSequence(jacobsthalSize);
        
        // Calculate insertion order
        std::vector<int> insertionOrder;
        std::vector<bool> inserted(pairs.size(), false);
        inserted[0] = true; // Mark first pair as already processed
        
        for (size_t i = 1; i < jacobSeq.size() && jacobSeq[i] < (int)pairs.size(); i++) {
            int idx = jacobSeq[i];
            if (!inserted[idx]) {
                insertionOrder.push_back(idx);
                inserted[idx] = true;
            }
            
            // Fill in between Jacobsthal numbers in descending order
            for (int j = idx - 1; j > jacobSeq[i-1]; j--) {
                if (j >= 0 && j < (int)pairs.size() && !inserted[j]) {
                    insertionOrder.push_back(j);
                    inserted[j] = true;
                }
            }
        }
        
        // Add any remaining indices
        for (size_t i = 1; i < pairs.size(); i++) {
            if (!inserted[i])
                insertionOrder.push_back(i);
        }
        
        // Insert elements according to determined order
        for (size_t i = 0; i < insertionOrder.size(); i++) {
            int idx = insertionOrder[i];
            
            // Insert main chain element if not already in result
            if (std::find(result.begin(), result.end(), mainChain[idx]) == result.end()) {
                std::vector<int>::iterator pos = std::lower_bound(result.begin(), result.end(), mainChain[idx]);
                result.insert(pos, mainChain[idx]);
            }
            
            // Insert smaller element
            std::vector<int>::iterator pos = std::lower_bound(result.begin(), result.end(), pairs[idx].second);
            result.insert(pos, pairs[idx].second);
        }
    }
    
    // Step 9: Insert straggler if exists
    if (hasStraggler) {
        std::vector<int>::iterator pos = std::lower_bound(result.begin(), result.end(), straggler);
        result.insert(pos, straggler);
    }
    
    // Step 10: Set final result
    _vec = result;
}

`;

  // Function to handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(cppCode.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Load highlight.js dynamically to avoid increasing initial bundle size
  useEffect(() => {
    setIsLoading(true);
    
    // Function to load highlight.js and its cpp language module
    const loadHighlightJs = async () => {
      try {
        // Import highlight.js and its CSS
        const hljs = await import('highlight.js/lib/core');
        const cpp = await import('highlight.js/lib/languages/cpp');
        const css = await import('highlight.js/styles/github.css');
        
        // Register the language
        hljs.default.registerLanguage('cpp', cpp.default);
        
        // Highlight the code
        const highlighted = hljs.default.highlight(cppCode, {
          language: 'cpp',
          ignoreIllegals: true
        }).value;
        
        setHighlightedCode(highlighted);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load syntax highlighting:', error);
        // Fallback: use the raw code without highlighting
        setHighlightedCode(
          cppCode.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>')
        );
        setIsLoading(false);
      }
    };
    
    loadHighlightJs();
  }, [cppCode]);

  // Determine what part of the code to show
  const displayCode = isLoading 
    ? 'Loading code...' 
    : (showFullCode 
        ? highlightedCode 
        : highlightedCode.split('// Step 8:')[0] + "<br/><br/>// ... (more code)");

  return (
    <div className="flex flex-col h-full bg-white border rounded-md overflow-hidden shadow-md">
      <div className="flex-none bg-gray-100 px-4 py-2 flex items-center justify-between border-b">
        <div className="flex items-center">
          <Code size={20} className="mr-2 text-gray-700" />
          <span className="font-semibold text-gray-800">C++ Implementation (PmergeMe.cpp)</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFullCode(!showFullCode)}
            className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded-md flex items-center"
          >
            {showFullCode ? "Show Less" : "Show Full Code"}
          </button>
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md flex items-center"
          >
            {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
            {copied ? "Copied!" : "Copy Code"}
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative overflow-hidden">
        {isLoading ? (
          <div className="p-4 text-sm bg-gray-50 h-full flex items-center justify-center">
            <div className="animate-pulse">Loading syntax highlighting...</div>
          </div>
        ) : (
          <pre 
            className="p-4 text-sm bg-gray-50 h-full overflow-auto font-mono leading-relaxed hljs"
            dangerouslySetInnerHTML={{ __html: displayCode }}
          />
        )}
      </div>
      
      <div className="flex-none bg-gray-100 px-4 py-2 border-t">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-600">
            <span className="font-semibold">Exercise 02:</span> PmergeMe - Ford-Johnson Algorithm C++98 Implementation
          </div>
          <a 
            href="#" 
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
            onClick={(e) => {
              e.preventDefault();
              setShowFullCode(true);
            }}
          >
            {!showFullCode && <>View full implementation <ExternalLink size={12} className="ml-1" /></>}
          </a>
        </div>
      </div>
    </div>
  );
};

export default CppImplementation;