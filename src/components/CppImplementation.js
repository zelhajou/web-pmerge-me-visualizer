import React, { useState, useEffect } from "react";
import { Code, Copy, Check, ExternalLink } from "lucide-react";

const CppImplementation = () => {
  const [copied, setCopied] = useState(false);
  const [showFullCode, setShowFullCode] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // The C++ implementation code from PmergeMe.cpp
  const cppCode = `#include "PmergeMe.hpp"

PmergeMe::PmergeMe() {}

PmergeMe::PmergeMe(const PmergeMe &other) : _vec(other._vec), _deq(other._deq) {}

PmergeMe &PmergeMe::operator=(const PmergeMe &other)
{
    if (this != &other)
    {
        _vec = other._vec;
        _deq = other._deq;
    }
    return *this;
}

PmergeMe::~PmergeMe() {}

bool PmergeMe::isValidNumber(const char *str)
{
    if (!str || str[0] == '\\0')
        return false;

    for (int i = 0; str[i] != '\\0'; i++)
    {
        if (str[i] < '0' || str[i] > '9')
            return false;
    }

    char *ptr;
    long num = strtol(str, &ptr, 10);

    if (*ptr != '\\0' || num <= 0 || num > INT_MAX)
        return false;

    return true;
}

bool PmergeMe::parseArgs(int argc, char **argv)
{
    if (argc < 2)
        return false;

    for (int i = 1; i < argc; i++)
    {
        if (!isValidNumber(argv[i]))
            return (false);

        int num = atoi(argv[i]);
        _vec.push_back(num);
        _deq.push_back(num);
    }

    return true;
}

std::vector<int> PmergeMe::getJacob(size_t size)
{
    std::vector<int> jacobsthal;
    jacobsthal.push_back(0);
    jacobsthal.push_back(1);
    
    while (jacobsthal.back() < static_cast<int>(size))
    {
        int lastNum = jacobsthal.back();
        int secondLastNum = jacobsthal[jacobsthal.size() - 2];
        
        int next = lastNum + 2 * secondLastNum;
        jacobsthal.push_back(next);
    }
    
    return jacobsthal;
}


std::vector<int> PmergeMe::getInsertPos(std::vector<int> &jacobSeq, size_t size)
{
    std::vector<int> order;
    std::vector<bool> used(size, false);
    used[0] = true;

    for (size_t i = 1; i < jacobSeq.size() && jacobSeq[i] < static_cast<int>(size); i++)
    {
        if (!used[jacobSeq[i]]) {
            order.push_back(jacobSeq[i]);
            used[jacobSeq[i]] = true;
        }
        
        for (int j = jacobSeq[i] - 1; j > jacobSeq[i-1]; j--) {
            if (j < (int)size && !used[j]) {
                order.push_back(j);
                used[j] = true;
            }
        }
    }

    for (size_t i = 1; i < size; i++) {
        if (!used[i]) {
            order.push_back(i);
        }
    }

    return order;
}

void PmergeMe::sortVector()
{
    if (_vec.size() <= 1)
        return;

    bool hasStraggler = false;
    int straggler = 0;

    if (_vec.size() % 2 != 0)
    {
        hasStraggler = true;
        straggler = _vec.back();
        _vec.pop_back();
    }

    std::vector<std::pair<int, int> > pairs;
    for (size_t i = 0; i < _vec.size(); i += 2)
    {
        int first = _vec[i];
        int second = _vec[i + 1];
        if (first < second)
            std::swap(first, second);
        pairs.push_back(std::make_pair(first, second));
    }

    std::vector<int> mainChain;
    for (size_t i = 0; i < pairs.size(); i++)
    {
        mainChain.push_back(pairs[i].first);
    }

    if (mainChain.size() > 1)
    {
        _vec = mainChain;
        sortVector();
        mainChain = _vec;
    }

    std::vector<int> result = mainChain;

    std::vector<int> pendChain;
    for (size_t i = 0; i < pairs.size(); i++)
    {
        pendChain.push_back(pairs[i].second);
    }

    if (!pendChain.empty())
    {
        std::vector<int>::iterator pos = std::lower_bound(result.begin(), result.end(), pendChain[0]);
        result.insert(pos, pendChain[0]);
    }

    if (pendChain.size() > 1)
    {
        std::vector<int> jacobSeq = getJacob(pendChain.size());
        std::vector<int> insertionOrder = getInsertPos(jacobSeq, pendChain.size());

        for (size_t i = 0; i < insertionOrder.size(); i++)
        {
            int idx = insertionOrder[i];
            if (idx > 0 && idx < (int)pendChain.size())
            {
                std::vector<int>::iterator pos = std::lower_bound(result.begin(), result.end(),  pendChain[idx]);
                result.insert(pos,  pendChain[idx]);
            }
        }
    }

    if (hasStraggler)
    {
        std::vector<int>::iterator pos = std::lower_bound(result.begin(), result.end(), straggler);
        result.insert(pos, straggler);
    }

    _vec = result;
}

void PmergeMe::sortDeque()
{
    if (_deq.size() <= 1)
        return;

    bool hasStraggler = false;
    int straggler = 0;

    if (_deq.size() % 2 != 0)
    {
        hasStraggler = true;
        straggler = _deq.back();
        _deq.pop_back();
    }

    std::deque<std::pair<int, int> > pairs;
    for (size_t i = 0; i < _deq.size(); i += 2)
    {
        int first = _deq[i];
        int second = _deq[i + 1];
        if (first < second)
            std::swap(first, second);
        pairs.push_back(std::make_pair(first, second));
    }

    std::deque<int> mainChain;
    for (size_t i = 0; i < pairs.size(); i++)
    {
        mainChain.push_back(pairs[i].first);
    }

    if (mainChain.size() > 1)
    {
        _deq = mainChain;
        sortDeque();
        mainChain = _deq;
    }

    std::deque<int> result = mainChain;

    std::deque<int> pendChain;
    for (size_t i = 0; i < pairs.size(); i++)
    {
        pendChain.push_back(pairs[i].second);
    }

    if (!pendChain.empty())
    {
        std::deque<int>::iterator pos = std::lower_bound(result.begin(), result.end(), pendChain[0]);
        result.insert(pos, pendChain[0]);
    }

    if (pendChain.size() > 1)
    {
        std::vector<int> jacobSeq = getJacob(pendChain.size());
        std::vector<int> insertionOrder = getInsertPos(jacobSeq, pendChain.size());

        for (size_t i = 0; i < insertionOrder.size(); i++)
        {
            int idx = insertionOrder[i];
            if (idx > 0 && idx < (int)pendChain.size())
            {
                int elementToInsert = pendChain[idx];
                std::deque<int>::iterator pos = std::lower_bound(result.begin(), result.end(), elementToInsert);
                result.insert(pos, elementToInsert);
            }
        }
    }

    if (hasStraggler)
    {
        std::deque<int>::iterator pos = std::lower_bound(result.begin(), result.end(), straggler);
        result.insert(pos, straggler);
    }

    _deq = result;
}

void PmergeMe::sort()
{
    std::vector<int> original = _vec;

    clock_t vecStart = clock();
    sortVector();
    clock_t vecEnd = clock();
    double vecTime = static_cast<double>(vecEnd - vecStart) / CLOCKS_PER_SEC * 1000000;

    clock_t deqStart = clock();
    sortDeque();
    clock_t deqEnd = clock();
    double deqTime = static_cast<double>(deqEnd - deqStart) / CLOCKS_PER_SEC * 1000000;

    printSeq(original, "Before");
    printSeq(_vec, "After");

    std::cout << "Time to process a range of " << _vec.size()
              << " elements with std::vector : " << std::fixed << std::setprecision(5)
              << vecTime << " us" << std::endl;

    std::cout << "Time to process a range of " << _deq.size()
              << " elements with std::deque : " << std::fixed << std::setprecision(5)
              << deqTime << " us" << std::endl;
}`;
  
  // Simplified code for "Show Less" view - just the sortVector function
  const simplifiedCode = `void PmergeMe::sortVector()
{
    if (_vec.size() <= 1)
        return;

    bool hasStraggler = false;
    int straggler = 0;

    if (_vec.size() % 2 != 0)
    {
        hasStraggler = true;
        straggler = _vec.back();
        _vec.pop_back();
    }

    std::vector<std::pair<int, int> > pairs;
    for (size_t i = 0; i < _vec.size(); i += 2)
    {
        int first = _vec[i];
        int second = _vec[i + 1];
        if (first < second)
            std::swap(first, second);
        pairs.push_back(std::make_pair(first, second));
    }

    std::vector<int> mainChain;
    for (size_t i = 0; i < pairs.size(); i++)
    {
        mainChain.push_back(pairs[i].first);
    }

    if (mainChain.size() > 1)
    {
        _vec = mainChain;
        sortVector();
        mainChain = _vec;
    }

    std::vector<int> result = mainChain;

    std::vector<int> pendChain;
    for (size_t i = 0; i < pairs.size(); i++)
    {
        pendChain.push_back(pairs[i].second);
    }

    if (!pendChain.empty())
    {
        std::vector<int>::iterator pos = std::lower_bound(result.begin(), result.end(), pendChain[0]);
        result.insert(pos, pendChain[0]);
    }

    if (pendChain.size() > 1)
    {
        std::vector<int> jacobSeq = getJacob(pendChain.size());
        std::vector<int> insertionOrder = getInsertPos(jacobSeq, pendChain.size());

        for (size_t i = 0; i < insertionOrder.size(); i++)
        {
            int idx = insertionOrder[i];
            if (idx > 0 && idx < (int)pendChain.size())
            {
                std::vector<int>::iterator pos = std::lower_bound(result.begin(), result.end(),  pendChain[idx]);
                result.insert(pos,  pendChain[idx]);
            }
        }
    }

    if (hasStraggler)
    {
        std::vector<int>::iterator pos = std::lower_bound(result.begin(), result.end(), straggler);
        result.insert(pos, straggler);
    }

    _vec = result;
}

// ... additional implementation for deque and other methods`;

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
        const hljs = await import("highlight.js/lib/core");
        const cpp = await import("highlight.js/lib/languages/cpp");
        await import("highlight.js/styles/github.css");

        // Register the language
        hljs.default.registerLanguage("cpp", cpp.default);

        // Highlight both the full and simplified code
        const fullHighlighted = hljs.default.highlight(cppCode, {
          language: "cpp",
          ignoreIllegals: true,
        }).value;
        
        const simpleHighlighted = hljs.default.highlight(simplifiedCode, {
          language: "cpp",
          ignoreIllegals: true,
        }).value;

        // Store the full highlighted code
        setHighlightedCode({
          full: fullHighlighted,
          simple: simpleHighlighted
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load syntax highlighting:", error);
        // Fallback: use the raw code without highlighting
        setHighlightedCode({
          full: cppCode.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>"),
          simple: simplifiedCode.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>")
        });
        setIsLoading(false);
      }
    };

    loadHighlightJs();
  }, []);

  return (
    <div className="flex flex-col h-full bg-white border rounded-md overflow-hidden shadow-md">
      <div className="flex-none bg-gray-100 px-4 py-2 flex items-center justify-between border-b">
        <div className="flex items-center">
          <Code size={20} className="mr-2 text-gray-700" />
          <span className="font-semibold text-gray-800">
            PmergeMe C++ Implementation
          </span>
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
            {copied ? (
              <Check size={14} className="mr-1" />
            ) : (
              <Copy size={14} className="mr-1" />
            )}
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
            dangerouslySetInnerHTML={{ 
              __html: showFullCode 
                ? highlightedCode.full
                : highlightedCode.simple
            }}
          />
        )}
      </div>

      <div className="flex-none bg-gray-100 px-4 py-2 border-t">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-600">
            <span className="font-semibold">Exercise 02:</span> PmergeMe -
            Ford-Johnson Algorithm C++98 Implementation
          </div>
          <a
            href="#"
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
            onClick={(e) => {
              e.preventDefault();
              setShowFullCode(true);
            }}
          >
            {!showFullCode && (
              <>
                View full implementation{" "}
                <ExternalLink size={12} className="ml-1" />
              </>
            )}
          </a>
        </div>
      </div>
    </div>
  );
};

export default CppImplementation;