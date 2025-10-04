import React from 'react';

const Hero = () => {
  return (
    <section className="absolute w-full h-full bg-primary/10">
      {/* Top Heading Section */}
      <div className="relative z-10 px-[50px] md:px-[150px] pt-[150px] pb-[100px]">
        <div className="flex flex-col gap-4 max-w-[660px]">
          <h1 className="text-primary text-[24px] sm:text-[36px] md:text-[48px] font-bold">
            Empower Your Future
          </h1>
          <h3 className="text-primary/60 text-[18px] sm:text-[24px] md:text-[36px] font-bold">
            Expert Guidance, Skill Development, and Guaranteed Success
          </h3>
        </div>
      </div>

      {/* Bottom Content on SVG */}
      <div className='absolute w-full z-10 lg:pt-[-400px] xl:pt-[100px]'>
        <div className="absolute w-full z-10 px-[50px] md:px-[150px] pb-[100px] flex flex-col xl:flex-row gap-[40px] mt-[150px] sm:mt-[150px] md:mt-[150px] lg:mt-[150px] xl:mt-[50px]">
            <div className="text-white max-w-[400px]">
            <h1 className="text-[20px] md:text-[24px] font-medium mb-4">
                Connect with Our Experts and Take the Next Step Toward Your Career Success!
            </h1>
            <button className="bg-white text-primary rounded-full font-bold text-xs md:text-sm px-6 py-3 shadow-md">
                Schedule a Consultation Today
            </button>
            </div>

            <div className='flex flex-col sm:flex-row gap-8 sm:gap-2 justify-center items-center'>
                <div className="border border-white rounded-[20px] p-[30px] text-white max-w-[300px] bg-primary/10 backdrop-blur-md">
                    <h2 className="font-semibold text-lg mb-2">Personalized Career Guidance</h2>
                    <p className="text-sm">
                        Structured training, mock interviews, and certifications to boost your career.
                    </p>
                </div>

                <div className="bg-white rounded-[20px] p-[30px] text-primary max-w-[300px] bg-primary/10 backdrop-blur-md">
                    <h2 className="font-semibold text-lg mb-2">Personalized Career Guidance</h2>
                    <p className="text-sm">
                        Structured training, mock interviews, and certifications to boost your career.
                    </p>
                </div>

                <div className="border border-white rounded-[20px] p-[30px] text-white max-w-[300px] bg-primary/10 backdrop-blur-md">
                    <h2 className="font-semibold text-lg mb-2">Personalized Career Guidance</h2>
                    <p className="text-sm">
                        Structured training, mock interviews, and certifications to boost your career.
                    </p>
                </div>
            </div>
        </div>

        {/* SVG Background */}
        <svg
            className="hidden sm:block absolute w-full sm:h-[1100px] md:h-[1200px] lg:h-[1100px] xl:h-[800px] -z-10 mt-[-700px] sm:mt-[-500px] md:mt-[-550px] lg:mt-[-500px] xl:mt-[-450px]"
            viewBox="50 -50 700 600"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
        >
            <path
            d="M 50 250 C 200 50 150 350 300 250 C 400 200 400 350 500 250 C 600 150 650 400 750 200 L 750 550 L 50 550 L 50 250"
            className="fill-primary"
            />
        </svg>

        <svg
            className="sm:hidden absolute w-full h-[2000px] -z-10 mt-[-1000px]"
            viewBox="200 -50 400 600"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
        >
            <path
            d="M 50 250 C 200 50 150 350 300 250 C 400 200 400 350 500 250 C 600 150 650 400 750 200 L 750 550 L 50 550 L 50 250"
            className="fill-primary"
            />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
