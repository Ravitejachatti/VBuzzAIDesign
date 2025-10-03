import React from 'react'

import aboutus from '../../../assets/aboutus.png'
import aboutus2 from '../../../assets/aboutus2.png'

const Hero = () => {
  return (
    <>
    <section className='bg-primary/90 font-poppins px-[50px] md:px-[150px] items-center text-center'>
        <div className="absolute inset-0 z-0 rounded-full w-[10px] h-[10px] bg-white/5 top-[180px] left-[60px] md:left-[100px]"></div>
        <div className="absolute inset-0 z-0 rounded-full w-[10px] h-[10px] border border-2 border-white/5 top-[190px] left-[100px] md:left-[150px]"></div>
        <div className="absolute inset-0 z-0 rounded-full w-[10px] h-[10px] bg-white/5 top-[250px] left-[50px] md:left-[100px]"></div>
        <svg
            viewBox="0 0 400 400"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-[5px] left-[-50px] z-0 w-[200px] h-[250px] md:w-[350px] md:h-[400px] md:top-[-60px] md:left-[-100px]"
            >
            <path
                d="M 100 150 C 100 50 200 100 200 100 C 200 100 300 150 250 250 C 200 300 150 200 200 150 C 200 150 300 100 350 300"
                stroke="#ffffff1a"
                strokeWidth="1"
                fill="none"
            />
        </svg>


        <div className="absolute z-0 rounded-full w-[10px] h-[10px] bg-white/5 top-[150px] right-[90px] md:right-[150px]"></div>
        <div className="absolute z-0 rounded-full w-[10px] h-[10px] border border-2 border-white/5 top-[130px] right-[60px] md:right-[100px]"></div>
        <div className="absolute z-0 rounded-full w-[10px] h-[10px] border border-2 border-white/5 top-[190px] right-[80px] md:right-[150px]"></div>
        <svg
            viewBox="0 0 400 400"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-[160px] right-[10px] z-0 w-[200px] h-[250px] md:w-[300px] md:h-[400px] md:right-[50px] md:top-[100px]"
            >
            <path
                d="M 100 150 C 100 50 200 100 200 100 C 200 100 300 150 250 250 C 200 300 150 200 200 150 C 200 150 300 100 350 300"
                stroke="#ffffff1a"
                strokeWidth="1"
                fill="none"
            />
        </svg>

        <h1 className='text-white font-bold text-[24px] pt-[150px] mb-4'>About Us</h1>
        <p className='text-white/60 font-medium text-[16px] pb-[100px] lg:pb-[150px]'>An award-winning organization specializing in career development, virtual mentoring, and overseas education consultancy.</p>
    </section>

    <div className='mx-[50px] md:mx-[150px] flex gap-4 items-center justify-center lg:mt-[-30px] mb-[50px] md:mb-[150px]'>
        <img
            src={aboutus}
            className='min-w-[100px] max-w-[150px] md:max-w-[250px] h-full object-cover mt-[-50px]'
        />
        <img
            src={aboutus2}
            className='min-w-[80px] max-w-[130px] md:max-w-[280px] min-h-[80px] object-cover mt-[-50px]'
        />
        <img
            src={aboutus}
            className='hidden sm:block min-w-[100px] max-w-[150px] md:max-w-[250px] h-full object-cover mt-[-50px]'
        />
        <img
            src={aboutus2}
            className='hidden sm:block min-w-[80px] max-w-[130px] md:max-w-[280px] min-h-[80px] object-cover mt-[-50px]'
        />
    </div>

    <div className='mx-[50px] md:mx-[150px]'>
        <h1 className='text-black font-bold text-[24px] mb-4'>Revolutionizing Careers with AI Innovation & Expert Guidance for a Brighter Future</h1>
        <div className='md:flex md:gap-12 md:text-justify'>
            <p className='text-black/60 font-medium text-[16px] mb-4 md:max-w-[545px]'>V Corporate Buzz International Pvt. Ltd. (VCBIL) redefines career development and educational consulting. We provide a one-stop solution for professional growth using AI innovation and industry expertise.</p>
            <p className='text-black/60 font-medium text-[16px] md:max-w-[545px]'>With a team of seasoned professionals, we empower individuals with the right tools. We help them prepare for high-stakes interviews and navigate industry trends. Securing global education opportunities is made seamless with our guidance.</p>
        </div>
    </div>
    </>
  )
}

export default Hero

