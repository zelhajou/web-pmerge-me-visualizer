import React from 'react';
import AlgorithmProgress from './AlgorithmProgress';

const AlgorithmStepInfo = ({ title, description, currentStep, totalSteps }) => {
  return (
    <div className="bg-white border rounded-t-md p-4 flex flex-col md:flex-row gap-4 shadow-sm">
      <div className="flex-1">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="md:w-1/3 lg:w-1/4 flex items-center">
        <AlgorithmProgress currentStep={currentStep} totalSteps={totalSteps} />
      </div>
    </div>
  );
};

export default AlgorithmStepInfo;