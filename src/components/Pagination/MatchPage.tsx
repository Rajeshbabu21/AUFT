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
              <div className="flex items-center justify-between gap-6 ">
                
                {/* Home Team */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 transition-transform duration-300 group-hover:translate-x-2">
                    <div className="relative">
                      <img
                        className="w-14 h-14 rounded-xl object-cover shadow-md dark:shadow-lg"
                        src={match.home_team.badge.image_url}
                        alt={match.home_team.team_name}
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">HOME</p>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white/90 truncate">
                        {match.home_team.team_name}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Center - Time & Divider */}
                <div className="flex flex-col items-center gap-2">
                  <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-600 dark:to-blue-700 text-white font-bold text-sm shadow-md">
                    {match.match_time.slice(0, 5)}
                  </div>
                  <div className="h-px w-8 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">WEEK {currentWeek}</span>
                </div>

                {/* Away Team */}
                <div className="flex-1">
                  <div className="flex items-center justify-end gap-3 transition-transform duration-300 group-hover:-translate-x-2">
                    <div className="text-right min-w-0">
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">AWAY</p>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white/90 truncate">
                        {match.away_team.team_name}
                      </h4>
                    </div>
                    <div className="relative">
                      <img
                        className="w-14 h-14 rounded-xl object-cover shadow-md dark:shadow-lg"
                        src={match.away_team.badge.image_url}
                        alt={match.away_team.team_name}
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-tl from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                </div>
              </div>
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
