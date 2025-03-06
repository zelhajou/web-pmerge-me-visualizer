import React, { useState, useEffect } from "react";
import { useAlgorithm } from "./hooks/useAlgorithm";
import { usePlayback } from "./hooks/usePlayback";
import { AlgorithmControls } from "./components/Algorithm";
import AlgorithmStepDetail from "./components/Algorithm/AlgorithmStepDetail";
import AlgorithmComparison from "./components/AlgorithmComparison";
import CppImplementation from "./components/CppImplementation";
import {
  CodeVisualization,
  MemoryStateVisualization,
  CallStackVisualization,
} from "./components/Visualization";
import InsertionOrderVisualizer from "./components/InsertionOrderVisualizer";
import {
  ChevronLeft,
  ChevronRight,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  RefreshCw,
  Code,
  GitBranch,
  CodeSquare,
} from "lucide-react";

const App = () => {
  // Get the initial input array from the URL or use default
  const urlParams = new URLSearchParams(window.location.search);
  const urlArray = urlParams.get("array");
  const initialArray = urlArray
    ? urlArray.split(",").map((num) => parseInt(num.trim()))
    : [5, 3, 8, 2, 1, 9, 4];

  // State
  const [activeView, setActiveView] = useState("algorithm"); // 'algorithm', 'code', 'insertionOrder'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  // Use the custom hooks
  const {
    inputArray,
    setInputArray,
    currentStep,
    currentStepData,
    executionSteps,
    setCurrentStep,
    processNewInput,
  } = useAlgorithm(initialArray);

  const {
    isPlaying,
    playbackSpeed,
    setPlaybackSpeed,
    togglePlayback,
    goToFirstStep,
    goToLastStep,
    goToNextStep,
    goToPrevStep,
  } = usePlayback(currentStep, setCurrentStep, executionSteps.length);

  // Handle input change
  const handleInputChange = (e) => {
    const input = e.target.value.split(",").map((num) => parseInt(num.trim()));
    if (input.every((num) => !isNaN(num))) {
      setInputArray(input);
      processNewInput(input);

      // Update URL for sharing
      const url = new URL(window.location);
      url.searchParams.set("array", input.join(","));
      window.history.pushState({}, "", url);
    }
  };

  // Random array generator
  const generateRandomArray = () => {
    const length = Math.floor(Math.random() * 6) + 5; // 5-10 elements
    const randomArray = Array.from({ length }, () =>
      Math.floor(Math.random() * 100)
    );
    setInputArray(randomArray);
    processNewInput(randomArray);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Navigation items
  const navItems = [
    { id: "algorithm", label: "Algorithm", icon: <CodeSquare size={16} /> },
    { id: "code", label: "C++ Code", icon: <Code size={16} /> },
    {
      id: "insertionOrder",
      label: "Insertion Order",
      icon: <GitBranch size={16} />,
    },
  ];

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-gray-50">
      {/* Header with responsive design */}
      <header className="bg-white border-b shadow-sm py-3 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
            <CodeSquare className="mr-2 text-blue-600" />
            Ford-Johnson Visualizer
          </h1>

          {/* Mobile menu button */}
          {isMobile && (
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}

          {/* Desktop navigation */}
          {!isMobile && (
            <nav>
              <ul className="flex space-x-1">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveView(item.id)}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                        ${
                          activeView === item.id
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      <span className="mr-1.5">{item.icon}</span>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </header>

      {/* Mobile menu */}
      {isMobile && isMobileMenuOpen && (
        <div className="bg-white shadow-md border-b py-2">
          <nav className="container mx-auto px-4">
            <ul className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveView(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium
                      ${
                        activeView === item.id
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      <main className="flex-1 overflow-hidden container mx-auto px-4 py-4 flex flex-col">
        {/* Controls Section with improved visual hierarchy */}


        {/* Main Content Area - Changes based on active view */}
        <div className="flex-1 overflow-hidden">
          {activeView === "algorithm" && (
            <div className="h-full flex flex-col">
        <div className="mb-4 bg-white p-3 rounded-lg shadow-sm border">
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
                  ${
                    isPlaying
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                <span>{isPlaying ? "Pause" : "Play"}</span>
              </button>
              <button
                onClick={goToNextStep}
                className="p-1.5 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={currentStep === executionSteps.length - 1}
                title="Next Step"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={goToLastStep}
                className="p-1.5 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={currentStep === executionSteps.length - 1}
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
                Step {currentStep + 1}/{executionSteps.length}
              </span>
            </div>
          </div>
        </div>

              {/* Step Information with improved visual design */}
              <div className="mb-4 bg-white border rounded-lg overflow-hidden shadow-sm">
                <div className="border-b p-3 ">
                  <h2 className="text-lg font-bold text-gray-800">
                    {currentStepData.title}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {currentStepData.description}
                  </p>

                  {/* Progress indicators */}
                  <div className="flex justify-between text-xs text-gray-500 mt-2 mb-1">
                    <span>Start</span>
                    <span>Pair Formation</span>
                    <span>Main Chain</span>
                    <span>Insertion</span>
                    <span>Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${
                          ((currentStep + 1) / executionSteps.length) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Operations summary for better context */}
                {currentStepData.memoryState?.operations && (
                  <div className="p-3 bg-gray-50 border-b text-sm">
                    <h3 className="font-semibold mb-1">Current Operations:</h3>
                    <ul className="list-disc list-inside space-y-0.5 text-gray-700">
                      {currentStepData.memoryState.operations.map((op, idx) => (
                        <li key={idx}>{op}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {/* Main visualization area */}
              <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Left: Code and Call Stack */}
                <div className="md:col-span-1 flex flex-col space-y-4 overflow-auto order-2 md:order-1">
                  <CodeVisualization code={currentStepData.code} />
                  <CallStackVisualization
                    callStack={currentStepData.callStack}
                  />
                </div>

                {/* Right: Memory State */}
                <div className="md:col-span-2 overflow-auto order-1 md:order-2">
                  <MemoryStateVisualization
                    memoryState={currentStepData.memoryState}
                  />
                </div>
              </div>
            </div>
          )}

          {activeView === "code" && (
            <div className="h-full overflow-auto bg-white rounded-lg shadow border">
              <CppImplementation />
            </div>
          )}

          {activeView === "insertionOrder" && (
            <div className="h-full overflow-auto bg-white rounded-lg shadow border p-4">
              <InsertionOrderVisualizer />
            </div>
          )}
        </div>
      </main>

      {/* Footer with clearer attribution */}
      <footer className="bg-gray-800 text-white py-3 text-center">
        <p className="text-sm">
          PmergeMe Visualizer — Ford-Johnson Algorithm Implementation
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Designed for understanding merge-insert sort (<a href="https://github.com/zelhajou/ft_cpp_modules/tree/main/module 09/ex02" target="_blank" rel="noopener noreferrer">Module 09 - Exercise 02</a>)
        </p>
      </footer>
    </div>
  );
};

export default App;
