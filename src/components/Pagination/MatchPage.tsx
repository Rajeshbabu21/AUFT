import React, { useEffect, useState } from 'react'
import api from '../../api/axios'
import Pagination from './Pagination'
import { Matches } from '../../@types/Matches'

const MatchPage: React.FC = () => {
  const [matches, setMatches] = useState<Matches[]>([])
  const [currentWeek, setCurrentWeek] = useState(1)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await api.get('/matches') 
        setMatches(res.data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchMatches()
  }, [])

  // filter matches by week
  const weekMatches = matches.filter(
    (match) => match.match_week === currentWeek
  )

  const maxWeek = Math.max(...matches.map((m) => m.match_week), 1)

  const handlePrev = () => {
    setCurrentWeek((prev) => Math.max(prev - 1, 1))
  }

  const handleNext = () => {
    setCurrentWeek((prev) => Math.min(prev + 1, maxWeek))
  }

  return (
    <div className="min-h-screen p-2">
      <div className="max-w-2xl mx-auto">
        <Pagination
          currentWeek={currentWeek}
          date={weekMatches[0]?.match_date || ''}
          onPrev={handlePrev}
          onNext={handleNext}
        />

        <div className="mt-8 space-y-5">
          {weekMatches.map((match) => (
            <div
              key={match.id}
              className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6 transition-all duration-300 hover:shadow-lg dark:hover:shadow-xl hover:-translate-y-1 hover:border-blue-400 dark:hover:border-blue-500"

              // className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03] p-6 transition-all duration-300 hover:shadow-lg dark:hover:shadow-xl hover:-translate-y-1 hover:border-blue-400 dark:hover:border-blue-500"
            >
              {/* Match Container */}
            
              <br />
              <hr />

              {/* Footer - Match Date */}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium text-center">
                  Auft
                </p>
              </div>
            </div>
          ))}

          {weekMatches.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-center text-gray-600 dark:text-gray-400 font-medium">
                No matches for this week
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MatchPage
