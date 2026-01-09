import React, { useEffect, useState } from 'react'
import api from '../../api/axios'
import { MatchResponse } from '../../@types/Results'

const MatchResults: React.FC = () => {
  const [matches, setMatches] = useState<MatchResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get<MatchResponse[]>('/match-details')
      .then(res => {
        setMatches(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading)
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading match results...
          </p>
        </div>
      </div>
    )

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      {matches.map(match => {
        const homeEvents = match.events.filter(
          e => e.team === match.home_team.name
        )

        const awayEvents = match.events.filter(
          e => e.team === match.away_team.name
        )

        // 🔹 Card counts per team
        const homeYellow = homeEvents.reduce(
          (sum, e) => sum + (e.is_yellow || 0),
          0
        )
        const homeRed = homeEvents.reduce(
          (sum, e) => sum + (e.is_red || 0),
          0
        )

        const awayYellow = awayEvents.reduce(
          (sum, e) => sum + (e.is_yellow || 0),
          0
        )
        const awayRed = awayEvents.reduce(
          (sum, e) => sum + (e.is_red || 0),
          0
        )

        return (
          <div
            key={match.match_id}
            className="rounded-xl overflow-hidden border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] shadow-lg"
          >
            {/* MATCH HEADER */}
            <div
              className="p-6 border-b border-gray-200 dark:border-gray-700"
              style={{ backgroundColor: '#131d31' }}
            >
              <div className="flex items-center justify-between gap-6 group">
                {/* HOME TEAM */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <img
                      className="w-14 h-14 rounded-xl object-cover border border-gray-200 dark:border-gray-700"
                      src={match.home_team.image}
                      alt={match.home_team.name}
                    />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-400 uppercase">HOME</p>
                      <h3 className="text-lg font-bold text-white truncate">
                        {match.home_team.name}
                      </h3>

                      {(homeYellow > 0 || homeRed > 0) && (
                        <div className="flex items-center gap-1 mt-1">
                          {Array(homeYellow)
                            .fill(0)
                            .map((_, i) => (
                              <span key={`hy-${i}`}>🟨</span>
                            ))}
                          {Array(homeRed)
                            .fill(0)
                            .map((_, i) => (
                              <span key={`hr-${i}`}>🟥</span>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* SCORE */}
                <div className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-3xl">
                  {match.score.home} - {match.score.away}
                </div>

                {/* AWAY TEAM */}
                <div className="flex-1">
                  <div className="flex items-center justify-end gap-3">
                    <div className="text-right min-w-0">
                      <p className="text-sm text-gray-400 uppercase">AWAY</p>
                      <h3 className="text-lg font-bold text-white truncate">
                        {match.away_team.name}
                      </h3>

                      {(awayYellow > 0 || awayRed > 0) && (
                        <div className="flex items-center justify-end gap-1 mt-1">
                          {Array(awayYellow)
                            .fill(0)
                            .map((_, i) => (
                              <span key={`ay-${i}`}>🟨</span>
                            ))}
                          {Array(awayRed)
                            .fill(0)
                            .map((_, i) => (
                              <span key={`ar-${i}`}>🟥</span>
                            ))}
                        </div>
                      )}
                    </div>
                    <img
                      className="w-14 h-14 rounded-xl object-cover border border-gray-200 dark:border-gray-700"
                      src={match.away_team.image}
                      alt={match.away_team.name}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* MATCH EVENTS */}
            {match.events.length > 0 && (
              <div className="p-6">
                <div className="grid grid-cols-3 gap-6">
                  {/* HOME EVENTS */}
                  <div className="space-y-3">
                    {homeEvents.map((event, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-blue-600">
                            {event.minute}'
                          </span>
                          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                            {event.player}
                          </span>
                        </div>
                        <hr className='mt-3' />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="w-px h-full bg-gray-300 dark:bg-gray-700" />
                  </div>

                  {/* AWAY EVENTS */}
                  <div className="space-y-3">
                    {awayEvents.map((event, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg"
                      >
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                            {event.player}
                          </span>
                          <span className="text-xs font-bold text-blue-600">
                            {event.minute}'
                          </span>
                        </div>
                        <hr className='mt-3' />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default MatchResults
