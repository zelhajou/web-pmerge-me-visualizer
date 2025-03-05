import { useState, useEffect } from 'react';
import { generateAlgorithmSteps } from '../utils/algorithmSteps';

export function useAlgorithm(initialArray) {
  const [inputArray, setInputArray] = useState(initialArray);
  const [currentStep, setCurrentStep] = useState(0);
  const [executionSteps, setExecutionSteps] = useState([]);
  
  // Generate all algorithm steps when input array changes
  useEffect(() => {
    const steps = generateAlgorithmSteps(inputArray);
    setExecutionSteps(steps);
    setCurrentStep(0);
  }, [inputArray]);
  
  // Get the current step data
  const currentStepData = executionSteps[currentStep] || {
    title: "Loading...",
    description: "Generating algorithm steps",
    code: "",
    memoryState: {},
    callStack: []
  };
  
  // Process a new input array
  const processNewInput = (newArray) => {
    const steps = generateAlgorithmSteps(newArray);
    setExecutionSteps(steps);
    setCurrentStep(0);
  };
  
  return {
    inputArray,
    setInputArray,
    currentStep,
    setCurrentStep,
    currentStepData,
    executionSteps,
    processNewInput
  };
}