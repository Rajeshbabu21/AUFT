import React, { useEffect, useState } from 'react'
import api from '../../api/axios'
import { MatchResponse } from '../../@types/Results'

const MatchResults: React.FC = () => {
  const [matches, setMatches] = useState<MatchResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<MatchResponse[]>('/match-details')
      .then(res => {
        setMatches(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      {matches.map(match => (
        <div
          key={match.match_id}
          className="border rounded-xl p-4 shadow"
        >
          {/* Teams */}
          <div className="flex justify-between items-center">
            {/* Home */}
            <div className="flex items-center gap-3">
              <img src={match.home_team.image} className="w-12 h-12" />
              <h3>{match.home_team.name}</h3>
            </div>

            {/* Score */}
            <div className="text-xl font-bold">
              {match.score.home} - {match.score.away}
            </div>

            {/* Away */}
            <div className="flex items-center gap-3">
              <h3>{match.away_team.name}</h3>
              <img src={match.away_team.image} className="w-12 h-12" />
            </div>
          </div>

          {/* Events */}
          {match.events.length > 0 && (
            <div className="mt-3 text-sm text-gray-600 space-y-1">
              {match.events.map((event, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span>
                    {event.minute}' {event.player})
                  </span>

                  {/* Yellow Cards */}
                  {event.is_yellow > 0 && (
                    <span className="flex gap-1">
                      {Array(event.is_yellow)
                        .fill('🟨')
                        .map((y, index) => (
                          <span key={index}>{y}</span>
                        ))}
                    </span>
                  )}

                  {/* Red Cards */}
                  {event.is_red > 0 && (
                    <span className="flex gap-1">
                      {Array(event.is_red)
                        .fill('🟥')
                        .map((r, index) => (
                          <span key={index}>{r}</span>
                        ))}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default MatchResults
