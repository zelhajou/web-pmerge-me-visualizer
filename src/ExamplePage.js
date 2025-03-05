import React, { useState } from 'react';
import FordJohnsonVisualizer from './components/FordJohnsonVisualizer';
import FordJohnsonDemo from './components/FordJohnsonDemo';

/**
 * Example page that showcases both the full visualizer and simplified demo
 */
const ExamplePage = () => {
  const [view, setView] = useState('demo'); // 'visualizer' or 'demo'
  const [array, setArray] = useState([5, 3, 8, 2, 1, 9, 4]);
  
  // Handle array input change
  const handleArrayChange = (e) => {
    try {
      const inputArray = e.target.value.split(',').map(num => parseInt(num.trim()));
      if (inputArray.every(num => !isNaN(num))) {
        setArray(inputArray);
      }
    } catch (error) {
      console.error("Invalid array input:", error);
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Ford-Johnson Algorithm Visualization</h1>
      
      {/* Array input for both views */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Test Array:
        </label>
        <div className="flex">
          <input
            type="text"
            className="flex-1 px-3 py-2 border rounded-l-md"
            value={array.join(', ')}
            onChange={handleArrayChange}
            placeholder="Enter numbers separated by commas"
          />
          <button
            onClick={() => setArray([...array].sort(() => Math.random() - 0.5))}
            className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-r-md hover:bg-indigo-200"
            title="Randomize array"
          >
            Shuffle
          </button>
        </div>
      </div>
      
      {/* View selector */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-md ${view === 'demo' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setView('demo')}
          >
            Simple Demo
          </button>
          <button
            className={`px-4 py-2 rounded-md ${view === 'visualizer' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setView('visualizer')}
          >
            Full Visualizer
          </button>
        </div>
      </div>
      
      {/* View description */}
      <div className="mb-4 p-4 bg-gray-50 rounded-md">
        {view === 'demo' ? (
          <div>
            <h2 className="text-xl font-bold mb-2">Simple Demo Mode</h2>
            <p>
              This is a simplified demonstration of the Ford-Johnson algorithm, designed to show the key 
              steps without overwhelming detail. Perfect for getting a quick understanding of how the 
              algorithm works.
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-2">Full Visualizer Mode</h2>
            <p>
              This is the comprehensive Ford-Johnson Algorithm Visualizer that shows every step in detail, 
              including memory state, call stack, and all operations. Ideal for in-depth learning and 
              algorithm analysis.
            </p>
          </div>
        )}
      </div>
      
      {/* Render the selected component */}
      {view === 'demo' ? (
        <FordJohnsonDemo initialArray={array} />
      ) : (
        <FordJohnsonVisualizer initialArray={array} />
      )}
      
      {/* Additional information */}
      <div className="mt-8 p-4 bg-blue-50 rounded-md">
        <h2 className="text-xl font-bold mb-2">About Ford-Johnson Algorithm</h2>
        <p className="mb-4">
          The Ford-Johnson algorithm, also known as merge-insertion sort, is a comparison sorting algorithm 
          designed to minimize the number of comparisons required to sort an array. It was first described 
          by L. Ford and S. Johnson in 1959.
        </p>
        <p>
          This algorithm is notable for approaching the information-theoretic lower bound on the number of 
          comparisons needed, making it theoretically more efficient than many common sorting algorithms in 
          terms of comparison count (though not necessarily in terms of overall performance due to other factors).
        </p>
      </div>
    </div>
  );
};

export default ExamplePage;