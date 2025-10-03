import React from 'react'

import Question from '../../Resuable/Question'

const questions = [
  {
    id: 1,
    question: "What are the primary responsibilities",
    answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, quae."
  },
  {
    id: 2,
    question: "What are the primary responsibilities",
    answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, quae."
  },
  {
    id: 3,
    question: "What qualifications are required for this role?",
    answer: "Candidates typically need a high school diploma or equivalent, with a preference for those with a degree in marketing, communications, or a related field."
  }
]

const FAQs = () => {

    const [show, setShow] = React.useState(null)

  const showAnswer = (index) => {
    setShow(index === show ? null : index)
  }

  return (
    <section  className='bg-primary/10 px-[50px] md:px-[150px] py-[25px] md:py-[75px]'>
        <div className='flex flex-col gap-[30px] lg:flex-row lg:gap-[50px] lg:items-center'>
            <div>
                <h6 className='text-primary text-[16px] md:text-[24px] font-bold'>
                    FAQs
                </h6>
                <h1 className='text-primary text-[24px] md:text-[40px] font-bold mt-[15px]'>Here are Some Answer For  Frequntly asked Questions</h1>
                <p className='text-primary text-[16px] font-medium mt-[30px]'>We got alot of Message With the same Questions so here are some fast answer for populare Question</p>
            </div>
            <div>
                {questions.map((question, index) => {
                    return <Question key={question.id} data={question} onClick={() => {showAnswer(index)}} isOpen={show === index}/>
                })}
            </div>
        </div>
    </section>
  )
}

export default FAQs