// Add this component to your project:
// src/components/AlgorithmExplanation.js

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

const AlgorithmExplanation = () => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-4">
      <div 
        className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center font-medium text-blue-800">
          <BookOpen size={18} className="mr-2" />
          Ford-Johnson (Merge-Insert) Algorithm Explanation
        </div>
        
        <button className="text-blue-600 hover:bg-blue-100 p-1 rounded-full">
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      
      {expanded && (
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">Understanding the Ford-Johnson Algorithm</h3>
          <p className="mb-3">
            The Ford-Johnson algorithm (also known as merge-insertion sort) is an efficient 
            comparison-based sorting algorithm designed to minimize the number of comparisons, 
            particularly for small to medium-sized arrays.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <h4 className="font-bold text-blue-700 mb-2">Key Steps:</h4>
              <ol className="list-decimal list-outside ml-5 space-y-2">
                <li>
                  <strong>Handle Base Cases:</strong> Arrays of size 0 or 1 are already sorted.
                </li>
                <li>
                  <strong>Handle Odd-sized Arrays:</strong> If the array has an odd number of elements, 
                  remove the last element as a "straggler".
                </li>
                <li>
                  <strong>Form Sorted Pairs:</strong> Group consecutive elements into pairs and sort within 
                  each pair (larger element first).
                </li>
                <li>
                  <strong>Create Main Chain:</strong> Extract the larger elements from each pair.
                </li>
                <li>
                  <strong>Recursively Sort:</strong> Sort the main chain recursively.
                </li>
                <li>
                  <strong>Create Pending Chain:</strong> Collect the smaller elements from each pair.
                </li>
                <li>
                  <strong>Insert First Pending Element:</strong> Insert the first element from the pending chain 
                  into the sorted main chain.
                </li>
                <li>
                  <strong>Calculate Insertion Order:</strong> Use the Jacobsthal sequence to determine an optimal 
                  insertion order for the remaining pending elements.
                </li>
                <li>
                  <strong>Insert Remaining Elements:</strong> Insert the remaining pending elements using binary 
                  search according to the calculated insertion order.
                </li>
                <li>
                  <strong>Insert Straggler:</strong> If there was a straggler, insert it into its correct position.
                </li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-bold text-blue-700 mb-2">What Makes It Special:</h4>
              <ul className="list-disc list-outside ml-5 space-y-2">
                <li>
                  <strong>Minimizes Comparisons:</strong> Approaching the theoretical minimum of ~n log n - n comparisons
                </li>
                <li>
                  <strong>Jacobsthal Sequence:</strong> A key innovation that optimizes insertion order
                </li>
                <li>
                  <strong>Binary Search:</strong> Used for efficient insertions
                </li>
                <li>
                  <strong>Recursive Structure:</strong> Divides the problem elegantly
                </li>
              </ul>
              
              <div className="mt-4 bg-blue-50 p-3 rounded-md">
                <h5 className="font-bold text-sm mb-1">Jacobsthal Sequence</h5>
                <p className="text-sm">
                  Defined by the recurrence relation: J(n) = J(n-1) + 2×J(n-2) with J(0)=0 and J(1)=1.
                  The sequence (0, 1, 1, 3, 5, 11, 21, 43, 85, ...) is specifically useful for determining
                  an efficient insertion order to minimize comparisons.
                </p>
              </div>
              
              <div className="mt-4 p-3 rounded-md bg-green-50">
                <h5 className="font-bold text-sm mb-1">Time Complexity</h5>
                <p className="text-sm">
                  Average: O(n log n) <br />
                  Worst case: O(n log n) <br />
                  Best case for comparisons: ~n log n - n + 1 <br />
                </p>
              </div>
            </div>
          </div>
          
          <hr className="my-3 border-gray-200" />
          

          
          <div className="mt-4 text-sm text-gray-600">
            This visualization steps through each part of the algorithm so you can see exactly how the 
            Ford-Johnson algorithm sorts data with minimal comparisons.
          </div>
        </div>
      )}
    </div>
  );
};

export default AlgorithmExplanation;