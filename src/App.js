import React, { useState, useEffect } from "react";
import { CodeSquare, Code, GitBranch } from "lucide-react";
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

// Custom hook imports
import { usePlayback } from "./hooks/usePlayback";
import { generateAlgorithmSteps } from "./utils/algorithmSteps";

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
  const [inputArray, setInputArray] = useState(initialArray);
  const [currentStep, setCurrentStep] = useState(0);
  const [executionSteps, setExecutionSteps] = useState([]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Generate algorithm steps when input array changes
  useEffect(() => {
    const steps = generateAlgorithmSteps(inputArray);
    setExecutionSteps(steps);
    setCurrentStep(0);
  }, [inputArray]);

  const isMobile = windowWidth < 768;

  // Get current step data
  const currentStepData = executionSteps[currentStep] || {
    title: "Loading...",
    description: "Preparing algorithm steps",
    code: "",
    memoryState: {},
    callStack: ["main()"],
  };

  // Use the playback hook
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
            PmergeMe Visualizer
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
        {/* Main Content Area - Changes based on active view */}
        <div className="flex-1 overflow-hidden">
          {activeView === "algorithm" && (
            <div className="h-full flex flex-col">
              <div className="mb-4 bg-white p-3 rounded-lg shadow-sm border">
                <AlgorithmControls
                  inputArray={inputArray}
                  handleInputChange={handleInputChange}
                  generateRandomArray={generateRandomArray}
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

              {/* Step Information with improved visual design */}
              <div className="mb-4 bg-white border rounded-lg overflow-hidden shadow-sm">
                <AlgorithmStepDetail
                  step={currentStepData}
                  currentStep={currentStep}
                  totalSteps={executionSteps.length}
                />
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
          Updated to match the C++ implementation in PmergeMe.cpp
        </p>
      </footer>
    </div>
  );
};

export default App;