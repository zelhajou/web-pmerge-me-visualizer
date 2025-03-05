import { useState, useEffect } from 'react';

export function usePlayback(currentStep, setCurrentStep, totalSteps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.5);
  
  // Handle automatic playback
  useEffect(() => {
    let timer;
    if (isPlaying && currentStep < totalSteps - 1) {
      timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 1000 / playbackSpeed);
    } else if (isPlaying && currentStep >= totalSteps - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, totalSteps, playbackSpeed, setCurrentStep]);

  // Toggle play/pause
  const togglePlayback = () => setIsPlaying(!isPlaying);
  
  // Navigation functions
  const goToFirstStep = () => setCurrentStep(0);
  const goToLastStep = () => setCurrentStep(totalSteps - 1);
  const goToNextStep = () => setCurrentStep(Math.min(currentStep + 1, totalSteps - 1));
  const goToPrevStep = () => setCurrentStep(Math.max(currentStep - 1, 0));
  
  return {
    isPlaying,
    playbackSpeed,
    setPlaybackSpeed,
    togglePlayback,
    goToFirstStep,
    goToLastStep,
    goToNextStep,
    goToPrevStep
  };
}