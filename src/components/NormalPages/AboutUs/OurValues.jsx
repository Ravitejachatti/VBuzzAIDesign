import React from 'react'

import ourmission from '../../../assets/our mission.png'

const OurValues = () => {
  return (
    <div className='bg-white mx-[50px] md:mx-[150px] mt-[50px] text-center grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-2 justify-items-center'>
        <div className='bg-white shadow-custom-nav p-[24px] sm:p-[50px] xl:p-[30px] rounded-[20px] min-w-[200px] max-w-[350px] lg:max-w-[500px]'>
            <div className="flex items-center justify-center">
                <img
                    src={ourmission}
                    className='w-[70px] h-[70px]'
                    alt="Our Mission"
                />
            </div>
            <h1 className='text-[16px] font-bold text-black mt-[15px]'>Our Mission</h1>
            <p className='text-[16px] font-medium text-black mt-[10px]'>
                Analyzes recruiter feedback to uncover skill gaps and optimize training.
            </p>
        </div>

        <div className='bg-white shadow-custom-nav p-[24px] sm:p-[50px] xl:p-[30px] rounded-[20px] min-w-[200px] max-w-[350px] lg:max-w-[500px]'>
            <div className="flex items-center justify-center">
                <img
                    src={ourmission}
                    className='w-[70px] h-[70px]'
                    alt="Our Mission"
                />
            </div>
            <h1 className='text-[16px] font-bold text-black mt-[15px]'>Our Mission</h1>
            <p className='text-[16px] font-medium text-black mt-[10px]'>
                Analyzes recruiter feedback to uncover skill gaps and optimize training.
            </p>
        </div>

        <div className='bg-white shadow-custom-nav p-[24px] sm:p-[50px] xl:p-[30px] rounded-[20px] min-w-[200px] max-w-[350px] lg:max-w-[500px]'>
            <div className="flex items-center justify-center">
                <img
                    src={ourmission}
                    className='w-[70px] h-[70px]'
                    alt="Our Mission"
                />
            </div>
            <h1 className='text-[16px] font-bold text-black mt-[15px]'>Our Mission</h1>
            <p className='text-[16px] font-medium text-black mt-[10px]'>
                Analyzes recruiter feedback to uncover skill gaps and optimize training.
            </p>
        </div>

        <div className='bg-white shadow-custom-nav p-[24px] sm:p-[50px] xl:p-[30px] rounded-[20px] min-w-[200px] max-w-[350px] lg:max-w-[500px]'>
            <div className="flex items-center justify-center">
                <img
                    src={ourmission}
                    className='w-[70px] h-[70px]'
                    alt="Our Mission"
                />
            </div>
            <h1 className='text-[16px] font-bold text-black mt-[15px]'>Our Mission</h1>
            <p className='text-[16px] font-medium text-black mt-[10px]'>
                Analyzes recruiter feedback to uncover skill gaps and optimize training.
            </p>
        </div>
    </div>
  )
}

export default OurValues