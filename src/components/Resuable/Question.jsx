import React from 'react'

const Question = ({data, onClick, isOpen}) => {
  return (
    <div className='flex flex-col my-[15px] border border-primary rounded-[10px] p-[24px] gap-[15px] text-primary text-[16px] overflow-hidden'>
        <div onClick={onClick} className='flex justify-between font-bold cusor-pointer'>
            <h6>{data.question}</h6>
            <span>{isOpen ? "-" : "+"}</span>
        </div>
        <p className={`font-medium transition-all ease-in-out duration-300 overflow-hidden ${isOpen ? "max-h-96" : "max-h-0"}`}>
            {data.answer}
        </p>
    </div>
  )
}

export default Question