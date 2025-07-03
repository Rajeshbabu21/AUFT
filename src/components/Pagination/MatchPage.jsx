import React, { useState } from 'react'
import Pagination from "./Pagination"

const matchWeeks = [
  {
    week: 1,
    date: 'Sat 6 Sep',
    matches: [
      {
        home: 'Arsenal',
        away: 'Manchester City',
        time: '19:30',
        image1: '/images/user/user-21.jpg',
        image2: '/images/user/user-21.jpg',
      },
      {
        home: 'Bournemouth',
        away: 'Newcastle United',
        time: '19:30',
        image1: '/images/user/user-21.jpg',
        image2: '/images/user/user-21.jpg',
      },
      {
        home: 'Bournemouth',
        away: 'Newcastle United',
        time: '19:30',
        image1: '/images/user/user-21.jpg',
        image2: '/images/user/user-21.jpg',
      },
    ],
  },
  {
    week: 2,
    date: 'Sat 13 Sep',
    matches: [
      {
        home: 'Brighton',
        away: 'Tottenham',
        time: '19:30',
        image1: '/images/user/user-21.jpg',
        image2: '/images/user/user-21.jpg',
      },
      {
        home: 'Burnley',
        away: 'Nottingham Forest',
        time: '19:30',
        image1: '/images/user/user-21.jpg',
        image2: '/images/user/user-21.jpg',
      },
    ],
  },
  {
    week: 3,
    date: 'Sat 20 Sep',
    matches: [
      {
        home: 'Fulham',
        away: 'Brentford',
        time: '19:30',
        image1: '/images/user/user-21.jpg',
        image2: '/images/user/user-21.jpg',
      },
      {
        home: 'Chelsea',
        away: 'Liverpool',
        time: '19:30',
        image1: '/images/user/user-21.jpg',
        image2: '/images/user/user-21.jpg',
      },
    ],
  },
  {
    week: 4,
    date: 'Sat 13 Sep',
    matches: [
      {
        home: 'Brighton',
        away: 'Tottenham',
        time: '19:30',
        image1: '/images/user/user-21.jpg',
        image2: '/images/user/user-21.jpg',
        // image: '/images/user/user-21.jpg',
      },
      {
        home: 'Burnley',
        away: 'Nottingham Forest',
        time: '19:30',
        image1: '/images/user/user-21.jpg',
        image2: '/images/user/user-21.jpg',
        // image: '/images/user/user-21.jpg',
      },
    ],
  },
  {
    week: 5,
    date: 'Sat 13 Sep',
    matches: [
      {
        home: 'Brighton',
        away: 'Tottenham',
        time: '19:30',
        image1: '/images/user/user-21.jpg',
        image2: '/images/user/user-21.jpg',
        // image: '/images/user/user-21.jpg',
      },
      {
        home: 'Burnley',
        away: 'Nottingham Forest',
        time: '19:30',
        image1: '/images/user/user-21.jpg',
        image2: '/images/user/user-21.jpg',
        // image: '/images/user/user-21.jpg',
      },
    ],
  },

  {
    week: 6,
    date: 'Sat 13 Sep',
    matches: [
      {
        home: 'Brighton',
        away: 'Tottenham',
        time: '19:30',
        image1: '/images/user/user-21.jpg',
        image2: '/images/user/user-21.jpg',
        // image: '/images/user/user-21.jpg',
      },
      {
        home: 'Burnley',
        away: 'Nottingham Forest',
        time: '19:30',
        image1: '/images/user/user-21.jpg',
        image2: '/images/user/user-21.jpg',
        // image: '/images/user/user-21.jpg',
      },
    ],
  },

  {
    week: 7,
    date: 'Sat 13 Sep',
    matches: [
      {
        home: 'Brighton',
        away: 'Tottenham',
        time: '19:30',
        image1: '/images/user/user-21.jpg',
        image2: '/images/user/user-21.jpg',
        // image: '/images/user/user-21.jpg',
      },
      {
        home: 'Burnley',
        away: 'Nottingham Forest',
        time: '19:30',
        image1: '/images/user/user-21.jpg',
        image2: '/images/user/user-21.jpg',
        // image: '/images/user/user-21.jpg',
      },
    ],
  },

  {
    week: 8,
    date: 'Sat 13 Sep',
    matches: [
      {
        home: 'Brighton',
        away: 'Tottenham',
        time: '19:30',
        image1: '/images/user/user-21.jpg',
        image2: '/images/user/user-21.jpg',
        // image: '/images/user/user-21.jpg',
      },
      {
        home: 'Burnley',
        away: 'Nottingham Forest',
        time: '19:30',
        image1: '/images/user/user-21.jpg',
        image2: '/images/user/user-21.jpg',
        // image: '/images/user/user-21.jpg',
      },
    ],
  },

  {
    week: 9,
    date: 'Sat 13 Sep',
    matches: [
      {
        home: 'Brighton',
        away: 'Tottenham',
        time: '19:30',
        image1: '/images/user/user-21.jpg',
        image2: '/images/user/user-21.jpg',
        // image: '/images/user/user-21.jpg',
      },
      {
        home: 'Burnley',
        away: 'Nottingham Forest',
        time: '19:30',
        image1: '/images/user/user-21.jpg',
        image2: '/images/user/user-21.jpg',
        // image: '/images/user/user-21.jpg',
      },
    ],
  },

  {
    week: 10,
    date: 'Sat 13 Sep',
    matches: [
      {
        home: 'Brighton',
        away: 'Tottenham',
        time: '19:30',
        image1: '/images/user/user-21.jpg',
        image2: '/images/user/user-21.jpg',
        // image: '/images/user/user-21.jpg',
      },
      {
        home: 'Burnley',
        away: 'Nottingham Forest',
        time: '19:30',
        image1: '/images/user/user-21.jpg',
        image2: '/images/user/user-21.jpg',
        // image: '/images/user/user-21.jpg',
      },
    ],
  },
]

const MatchPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, matchWeeks.length - 1))
  }

  const currentWeek = matchWeeks[currentIndex]

  return (
    <div className=' w-[500px]  p-6  mx-65 '>
      <Pagination
        currentWeek={currentWeek.week}
        date={currentWeek.date}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      {/* <div className='mt-6 space-y-4'>
        
        {currentWeek.matches.map((match, index) => (

          <div
            key={index}
            className='flex justify-between items-center   p-4 rounded-md'
          >
            <img className='w-10 h-10' src={match.image1} alt='' />
            <span>{match.home}</span>
            <span className='font-bold'>{match.time}</span>
            <span>{match.away}</span>
            <img className='w-10 h-10' src={match.image2} alt='' />
            
          
          </div>
          
          
        ))}
        
      </div> */}

      <div className='mt-6 space-y-4'>
        {currentWeek.matches.map((match, index) => (
          <div key={index}>
            <div className='flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-4 rounded-md shadow-sm'>
              <img
                className='w-10 h-10 rounded-full'
                src={match.image1}
                alt={match.home}
              />
              <span className='font-medium  dark:text-white/90'>
                {match.home}
              </span>
              <span className='font-bold text-gray-700 dark:text-white'>
                {match.time}
              </span>
              <span className='font-medium  dark:text-white/90'>
                {match.away}
              </span>
              <img
                className='w-10 h-10 rounded-full'
                src={match.image2}
                alt={match.away}
              />
            </div>
            <hr className='border-gray-500  dark:border-gray-600' />
          </div>
        ))}
      </div>
    </div>
  )
}

export default MatchPage
