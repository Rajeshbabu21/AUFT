import React from 'react'

const Pagination = ({ currentWeek, onPrev, onNext, date }) => {
  return (
    <div className='flex flex-col items-center gap-1 my-6'>
      <div className='flex items-center gap-4'>
        <button
          onClick={onPrev}
          className='rounded-md bg-blue-500 text-white p-3 mx-5 hover:bg-purple-800'
        >
          &#8592;
        </button>
        <h2 className=' text-4xl font-semibold'>
          Matchweek {currentWeek}
        </h2>
        <button
          onClick={onNext}
          className='rounded-md bg-blue-500 text-white p-3 mx-5 hover:bg-purple-800'
        >
          &#8594;
        </button>
      </div>
      <p className='mt-6 mb-5 text-2xl font-bold'>{date}</p>
    </div>
  )
}

export default Pagination
