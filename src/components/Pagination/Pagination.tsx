import React from 'react'

interface PaginationProps {
  currentWeek: number
  date: string
  onPrev: () => void
  onNext: () => void
}

const Pagination: React.FC<PaginationProps> = ({
  currentWeek,
  onPrev,
  onNext,
  date,
}) => {
  return (
    <div className='flex flex-col items-center gap-3 sm:gap-4 my-4 sm:my-6 md:my-8 px-2 sm:px-4'>
      {/* Matchweek Heading */}
      <div className='flex items-center justify-center gap-3 sm:gap-4 md:gap-6 w-full'>
        {/* Previous Button */}
        <button
          onClick={onPrev}
          className='group relative rounded-full bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-600 dark:to-blue-700 text-white p-2 sm:p-2.5 md:p-3 transition-all duration-300 hover:shadow-lg dark:hover:shadow-blue-500/50 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900 shrink-0'
          aria-label="Previous week"
          title="Previous week"
        >
          <span className='text-base sm:text-lg md:text-xl font-bold group-hover:animate-pulse'>←</span>
        </button>

        {/* Matchweek Title */}
        <div className='text-center flex-1 min-w-0'>
          <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-300 tracking-wide whitespace-nowrap overflow-hidden text-ellipsis px-2'>
            Matchweek {currentWeek}
          </h2>
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          className='group relative rounded-full bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-600 dark:to-blue-700 text-white p-2 sm:p-2.5 md:p-3 transition-all duration-300 hover:shadow-lg dark:hover:shadow-blue-500/50 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900 shrink-0'
          aria-label="Next week"
          title="Next week"
        >
          <span className='text-base sm:text-lg md:text-xl font-bold group-hover:animate-pulse'>→</span>
        </button>
      </div>

      {/* Date Display */}
      {date && (
        <div className="mt-2 sm:mt-3 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-gray-800 max-w-full overflow-hidden">
  <p className="flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base md:text-lg font-semibold text-gray-700 dark:text-white/80">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-white/70 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>

    <span className="truncate">
      {new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })}
    </span>
  </p>
</div>

      )}
    </div>
  )
}

export default Pagination
