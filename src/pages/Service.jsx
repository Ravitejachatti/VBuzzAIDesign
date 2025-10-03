import React from 'react'

import Hero from '../components/NormalPages/Service/Hero'
import Service from '../components/NormalPages/Service/Service'
import FAQs from '../components/NormalPages/Service/FAQ\'s'

const Services = () => {
  return (
    <>
        <Hero />
        <div className="h-[1450px] sm:h-[1050px] md:h-[1250px] lg:h-[1100px] xl:h-[950px]"></div>
        <Service />
        <FAQs />
    </>
  )
}

export default Services