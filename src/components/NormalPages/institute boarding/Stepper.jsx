import React, { useEffect, useState, useRef } from 'react';

const Stepper = ({ steps, currentStep }) => {
  const [newStep, setNewStep] = useState([]);
  const stepRef = useRef();

  const updateStep = (stepNumber, steps) => {
    const newSteps = steps.map((step, index) => ({
      ...step,
      completed: index < stepNumber,
      highlighted: index === stepNumber,
    }));
    return newSteps;
  };

  useEffect(() => {
    const stepState = steps.map((step, index) => ({
      description: step,
      completed: false,
      highlighted: index === 0,
      selected: false,
    }));
    stepRef.current = stepState;
    const current = updateStep(currentStep - 1, stepRef.current);
    setNewStep(current);
  }, [steps, currentStep]);

  return (
    <div className='relative flex justify-between items-center w-full'>
      {newStep.map((step, index) => (
        <div key={index} className='flex items-center w-full'>
          <div className='flex flex-col items-center gap-2 relative'>
            <div
              className={`w-[30px] h-[30px] rounded-full flex justify-center items-center font-bold text-white transition-all duration-300
                ${step.completed ? 'bg-primary' : 'bg-primary/40'}
              `}
            >
                {step.completed ? (<span className='text-[12px]'>✔</span>) : (index + 1)}
            </div>
            {/* <h1
              className={`hidden lg:block text-[12px] font-semibold text-center transition-all duration-300 ${
                step.highlighted ? 'text-primary/40' : 'text-primary'
              }`}
            >
              {step.description}
            </h1> */}
          </div>

          {index !== newStep.length - 1 && (
            <div
              className={`flex-auto min-w-[24px] h-[2px] sm:h-[4px] transition-all duration-300 ${
                step.completed ? 'bg-primary' : 'bg-primary/40'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
