import React from 'react';

const StepperControl = ({ handleNext, handleBack, currentStep, steps }) => {
  return (
    <div className='flex flex-row gap-4 items-center justify-end'>
      {/* Back Button */}
      <button
        onClick={handleBack}
        disabled={currentStep === 1}
        className={`px-6 py-2 rounded-full text-xs font-bold cursor-pointer border transition-all duration-200
          ${currentStep === 1
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-white text-primary border-primary hover:bg-primary hover:text-white'}
        `}
      >
        Back
      </button>

      {/* Next / Submit Button */}
      <button
        onClick={handleNext}
        className='bg-primary text-white px-6 py-2 rounded-full text-xs font-bold cursor-pointer transition-all duration-200 hover:bg-primary/80'
      >
        {currentStep === steps.length ? 'Submit' : 'Next'}
      </button>
    </div>
  );
};

export default StepperControl;
