import React, { useState, useEffect } from "react";
import {
  CodeSquare,
  Code,
  GitBranch,
  Github,
  ExternalLink,
} from "lucide-react";
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

import AlgorithmExplanation from "./components/AlgorithmExplanation";

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

  // Repository URLs
  const cppRepoUrl = "https://github.com/zelhajou/ft_cpp_modules";
  const projectRepoUrl = "https://github.com/zelhajou/web-pmerge-me-visualizer";

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
              {/* No repository links in mobile menu */}
            </ul>
          </nav>
        </div>
      )}

      <main className="flex-1 overflow-y-auto container mx-auto px-4 py-4 flex flex-col">
        {/* Main Content Area - Changes based on active view */}
        <div className="flex-1">
          {activeView === "algorithm" && (
            <div className="h-full flex flex-col">
              {/* Algorithm explanation */}
              {activeView === "algorithm" && (
                <div className="mb-4">
                  <AlgorithmExplanation />
                </div>
              )}

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

      {/* Enhanced footer with description and repository links */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h3 className="text-lg font-bold">PmergeMe Visualizer</h3>
              <p className="text-sm text-gray-300 mt-1">
                An interactive visualization of the Ford-Johnson algorithm
                (merge-insertion sort)
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              <a
                href={cppRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
              >
                <Github size={16} className="mr-2" />
                <span>C++ Exercise Repository</span>
              </a>

              <a
                href={projectRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-md transition-colors"
              >
                <Github size={16} className="mr-2" />
                <span>Visualizer Project Repository</span>
              </a>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-4 pt-4 text-center text-xs text-gray-400">
            <p>
              This visualizer demonstrates the PmergeMe implementation using the
              Ford-Johnson algorithm, also known as merge-insertion sort.
            </p>
            <p className="mt-1">
              The algorithm optimizes comparisons using the Jacobsthal sequence
              for insertion order, providing efficient sorting.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
