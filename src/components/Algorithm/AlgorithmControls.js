import React from 'react';
import { ChevronLeft, ChevronRight, SkipBack, SkipForward, Play, Pause } from 'lucide-react';

const AlgorithmControls = ({
  inputArray,
  handleInputChange,
  playbackSpeed,
  setPlaybackSpeed,
  isPlaying,
  togglePlayback,
  goToFirstStep,
  goToLastStep,
  goToNextStep,
  goToPrevStep,
  currentStep,
  totalSteps
}) => {
  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-md shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Input Array:</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            value={inputArray.join(', ')}
            onChange={handleInputChange}
            placeholder="Enter numbers separated by commas"
          />
          <p className="text-xs text-gray-500 mt-1">Example: 5, 3, 8, 2, 1, 9, 4</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Playback Speed:</label>
          <select
            className="px-3 py-2 border rounded-md"
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
          >
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
            <option value="3">3x</option>
          </select>
        </div>
      </div>
      
      {/* Navigation controls */}
      <div className="flex justify-center items-center mt-4 gap-2">
        <button 
          onClick={goToFirstStep}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md"
          title="First Step"
        >
          <SkipBack size={18} />
        </button>
        <button 
          onClick={goToPrevStep}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md"
          title="Previous Step"
          disabled={currentStep === 0}
        >
          <ChevronLeft size={18} />
        </button>
        <button 
          onClick={togglePlayback}
          className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md flex items-center gap-1 px-3"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          <span>{isPlaying ? "Pause" : "Play"}</span>
        </button>
        <button 
          onClick={goToNextStep}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md"
          title="Next Step"
          disabled={currentStep === totalSteps - 1}
        >
          <ChevronRight size={18} />
        </button>
        <button 
          onClick={goToLastStep}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md"
          title="Last Step"
        >
          <SkipForward size={18} />
        </button>
        <div className="ml-4 text-sm text-gray-700">
          Step {currentStep + 1} of {totalSteps}
        </div>
      </div>
    </div>
  );
};

export default AlgorithmControls;