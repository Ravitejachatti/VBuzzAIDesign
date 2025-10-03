import React from 'react'
import service from '../../../assets/service.png'

const Service = () => {
  return (
    <section className='flex flex-col gap-[50px] px-[50px] md:px-[150px] pb-[25px] md:pb-[75px]'>
        <div className='flex flex-col lg:flex-row gap-[24px] lg:gap-[50px]'>
            <img src={service} className="min-w-[200px] lg:min-w-[350px] rounded-[20px]"/>
            <div className='flex flex-col gap-[15px] lg:max-w-[600px]'>
                <h1 className='text-blacck text-[24px] font-bold'>Sharpen your interview skills with expert-led mock sessions</h1>
                <p>Get personalized feedback, industry-specific preparation, and self-review recordings to boost your confidence.   Receive expert insights on your strengths and improvement areas, refine your responses with tailored coaching, and practice real-world interview scenarios to enhance your performance.</p>
                <button className='border border-primary text-primary rounded-full font-bold text-xs md:text-sm px-6 py-3 shadow-md max-w-[300px]'>Book a Mock Session Today!</button>
            </div>
        </div>

        <div className='flex flex-col lg:flex-row gap-[24px] lg:gap-[50px]'>
            <img src={service} className="lg:hidden min-w-[200px] rounded-[20px]"/>
            <div className='flex flex-col gap-[15px] lg:max-w-[600px]'>
                <h1 className='text-blacck text-[24px] font-bold'>Sharpen your interview skills with expert-led mock sessions</h1>
                <p>Get personalized feedback, industry-specific preparation, and self-review recordings to boost your confidence.   Receive expert insights on your strengths and improvement areas, refine your responses with tailored coaching, and practice real-world interview scenarios to enhance your performance.</p>
                <button className='border border-primary text-primary rounded-full font-bold text-xs md:text-sm px-6 py-3 shadow-md max-w-[300px]'>Book a Mock Session Today!</button>
            </div>
            <img src={service} className="hidden lg:block min-w-[200px] lg:min-w-[350px] rounded-[20px]"/>
        </div>
    </section>
  )
}

export default Service