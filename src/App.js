import React, { useState } from 'react';
import { useAlgorithm } from './hooks/useAlgorithm';
import { usePlayback } from './hooks/usePlayback';
import { AlgorithmControls } from './components/Algorithm';
import AlgorithmStepDetail from './components/Algorithm/AlgorithmStepDetail';
import AlgorithmComparison from './components/AlgorithmComparison';
import CppImplementation from './components/CppImplementation';
import { 
  CodeVisualization, 
  MemoryStateVisualization, 
  CallStackVisualization 
} from './components/Visualization';

const App = () => {
  // Get the initial input array from the URL or use default
  const urlParams = new URLSearchParams(window.location.search);
  const urlArray = urlParams.get('array');
  const initialArray = urlArray 
    ? urlArray.split(',').map(num => parseInt(num.trim())) 
    : [5, 3, 8, 2, 1, 9, 4];
  
  // State
  const [showCppImplementation, setShowCppImplementation] = useState(false);
  
  // Use the custom hooks
  const { 
    inputArray,
    setInputArray,
    currentStep, 
    currentStepData, 
    executionSteps, 
    setCurrentStep,
    processNewInput 
  } = useAlgorithm(initialArray);
  
  const { 
    isPlaying, 
    playbackSpeed, 
    setPlaybackSpeed, 
    togglePlayback, 
    goToFirstStep, 
    goToLastStep, 
    goToNextStep, 
    goToPrevStep 
  } = usePlayback(currentStep, setCurrentStep, executionSteps.length);

  // Handle input change
  const handleInputChange = (e) => {
    const input = e.target.value.split(',').map(num => parseInt(num.trim()));
    if (input.every(num => !isNaN(num))) {
      setInputArray(input);
      processNewInput(input);
      
      // Update URL for sharing
      const url = new URL(window.location);
      url.searchParams.set('array', input.join(','));
      window.history.pushState({}, '', url);
    }
  };

  // Random array generator
  const generateRandomArray = () => {
    const length = Math.floor(Math.random() * 6) + 5; // 5-10 elements
    const randomArray = Array.from({ length }, () => Math.floor(Math.random() * 100));
    setInputArray(randomArray);
    processNewInput(randomArray);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Ford-Johnson Algorithm Visualizer
          </h1>
          <p className="text-gray-600 mt-2">
            A step-by-step visualization of the merge-insert sort algorithm
          </p>
        </div>

        {/* Action buttons - simple and functional */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={generateRandomArray}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
            title="Generate random array for testing"
          >
            Random Array
          </button>
          <button
            onClick={() => setShowCppImplementation(!showCppImplementation)}
            className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded hover:bg-gray-300"
          >
            {showCppImplementation ? "Hide C++ Code" : "View C++ Code"}
          </button>
        </div>

        {/* C++ Implementation Component (conditionally rendered) */}
        {showCppImplementation && <CppImplementation />}
        
        {/* Algorithm Controls */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <AlgorithmControls 
            inputArray={inputArray}
            handleInputChange={handleInputChange}
            playbackSpeed={playbackSpeed}
            setPlaybackSpeed={setPlaybackSpeed}
            isPlaying={isPlaying}
            togglePlayback={togglePlayback}
            goToFirstStep={goToFirstStep}
            goToLastStep={goToLastStep}
            goToNextStep={goToNextStep}
            goToPrevStep={goToPrevStep}
            currentStep={currentStep}
            totalSteps={executionSteps.length}
          />
        </div>
        
        {/* Step Information Header */}
        <AlgorithmStepDetail 
          step={currentStepData}
          currentStep={currentStep}
          totalSteps={executionSteps.length}
        />
        
        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8 mt-4">
          {/* Left Column: Code and Call Stack Panel */}
          <div className="lg:col-span-1 order-2 lg:order-1 space-y-4">
            {/* Code Visualization */}
            <CodeVisualization code={currentStepData.code} />
            
            {/* Call Stack Visualization */}
            <CallStackVisualization callStack={currentStepData.callStack} />
            
            {/* Algorithm Information Panel */}
            <div id="algo-info" className="border rounded-lg overflow-hidden shadow bg-white">
              <div className="bg-gray-100 px-4 py-3 font-semibold border-b">
                Algorithm Documentation
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-3">Ford-Johnson (Merge-Insert Sort)</h3>
                <p className="text-gray-700 mb-4">
                  This algorithm combines merge sort and insertion sort techniques to achieve optimal
                  comparison efficiency, using the Jacobsthal sequence for insertion order.
                </p>
                
                <h4 className="font-semibold text-gray-700 mt-4 mb-2">Key Phases:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Pair formation from consecutive elements</li>
                  <li>Recursively sort the main chain (larger elements)</li>
                  <li>Insert remaining elements using binary search</li>
                  <li>Use Jacobsthal numbers to optimize insertion sequence</li>
                </ul>
                
                <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
                  <span className="font-semibold">Time Complexity:</span> O(n log n)
                </div>
              </div>
            </div>
            
            {/* Algorithm Comparison */}
            {/* <AlgorithmComparison /> */}
          </div>
          
          {/* Right Column: Memory State Visualization */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <MemoryStateVisualization memoryState={currentStepData.memoryState} />
          </div>
        </div>
      </main>

      {/* Simple footer */}
      <footer className="bg-gray-800 text-white py-4 text-center text-sm">
        <p>PmergeMe Visualizer - Ford-Johnson Algorithm Implementation</p>
      </footer>
    </div>
  );
};

export default App;