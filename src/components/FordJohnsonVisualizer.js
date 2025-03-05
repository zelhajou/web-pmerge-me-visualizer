import React from 'react';
import { useAlgorithm } from '../hooks/useAlgorithm';
import { usePlayback } from '../hooks/usePlayback';
import { AlgorithmControls, AlgorithmStepInfo } from '../components/Algorithm';
import { 
  CodeVisualization, 
  MemoryStateVisualization, 
  CallStackVisualization 
} from './Visualization';

/**
 * Ford-Johnson Algorithm Visualizer Component
 * Can be used independently of the main App
 */
const FordJohnsonVisualizer = ({ initialArray = [5, 3, 8, 2, 1, 9, 4] }) => {
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
    }
  };

  return (
    <div className="mx-auto max-w-full p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-2">Ford-Johnson Algorithm Visualizer</h2>
      <p className="text-gray-600 mb-4">Step through the execution of the merge-insert sort algorithm</p>
      
      {/* Algorithm Controls */}
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
      
      {/* Step Information Header */}
      <AlgorithmStepInfo 
        title={currentStepData.title}
        description={currentStepData.description}
        currentStep={currentStep}
        totalSteps={executionSteps.length}
      />
      
      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-l border-r border-b rounded-b-md p-4 bg-white">
        {/* Code and Call Stack Panel */}
        <div className="md:col-span-1 order-2 md:order-1">
          <CodeVisualization code={currentStepData.code} />
          
          <div className="mt-4">
            <CallStackVisualization callStack={currentStepData.callStack} />
          </div>
        </div>
        
        {/* Memory State Panel */}
        <div className="md:col-span-2 order-1 md:order-2">
          <MemoryStateVisualization memoryState={currentStepData.memoryState} />
        </div>
      </div>
    </div>
  );
};

export default FordJohnsonVisualizer;