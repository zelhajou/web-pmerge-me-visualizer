import React from 'react';
import { ChevronLeft, ChevronRight, SkipBack, SkipForward, Play, Pause, RefreshCw } from 'lucide-react';

const AlgorithmControls = ({
  inputArray,
  handleInputChange,
  generateRandomArray,
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
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div className="flex flex-col flex-grow">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Input Array:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-grow px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={inputArray.join(", ")}
            onChange={handleInputChange}
            placeholder="Enter numbers separated by commas"
          />
          <button
            onClick={generateRandomArray}
            className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center"
            title="Generate random array for testing"
          >
            <RefreshCw size={16} className="mr-1" />
            <span className="hidden sm:inline">Random</span>
          </button>
        </div>
      </div>

      {/* Playback controls with a better layout */}
      <div className="flex items-center bg-gray-50 p-2 rounded-md border gap-2">
        <button
          onClick={goToFirstStep}
          className="p-1.5 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={currentStep === 0}
          title="First Step"
        >
          <SkipBack size={16} />
        </button>
        <button
          onClick={goToPrevStep}
          className="p-1.5 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={currentStep === 0}
          title="Previous Step"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={togglePlayback}
          className={`p-1.5 flex items-center gap-1 px-3 rounded-md text-sm font-medium
            ${isPlaying ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-blue-100 text-blue-700 hover:bg-blue-200"}`}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          <span>{isPlaying ? "Pause" : "Play"}</span>
        </button>
        <button
          onClick={goToNextStep}
          className="p-1.5 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={currentStep === totalSteps - 1}
          title="Next Step"
        >
          <ChevronRight size={16} />
        </button>
        <button
          onClick={goToLastStep}
          className="p-1.5 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={currentStep === totalSteps - 1}
          title="Last Step"
        >
          <SkipForward size={16} />
        </button>
        <select
          className="text-xs border rounded-md bg-white p-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={playbackSpeed}
          onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
          title="Playback Speed"
        >
          <option value="0.5">0.5×</option>
          <option value="1">1×</option>
          <option value="1.5">1.5×</option>
          <option value="2">2×</option>
        </select>
        <span className="text-xs font-medium text-gray-600 mx-1 whitespace-nowrap">
          Step {currentStep + 1}/{totalSteps}
        </span>
      </div>
    </div>
  );
};

export default AlgorithmControls;