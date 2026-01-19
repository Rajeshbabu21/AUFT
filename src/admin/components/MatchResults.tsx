import React from 'react'
import { MatchResponse } from '../../@types/Results'

interface MatchResultsProps {
  matchResults: MatchResponse[]
  loading: boolean
  onEdit?: (result: MatchResponse) => void
  onDelete?: (resultId: string) => void
  onAdd?: () => void
}

const MatchResults: React.FC<MatchResultsProps> = ({ 
  matchResults, 
  loading,
  onEdit,
  onDelete,
  onAdd
}) => {
  const handleDelete = (resultId: string) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      onDelete?.(resultId)
    }
  }

  return (
    <div className='results-full-container'>
      <div className='results-header-section'>
        <div>
          <h2>Match Results</h2>
          <p>View and manage all match results</p>
        </div>
        <button className='btn-add-match' onClick={onAdd}>
          + Add New Result
        </button>
      </div>

      <div className='results-table-wrapper'>
        <table className='results-table'>
          <thead>
            <tr>
              <th>Week</th>
              <th>Home Team</th>
              <th>Score</th>
              <th>Away Team</th>
              <th>Goals</th>
              <th>Cards</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className='loading-cell'>
                  Loading results...
                </td>
              </tr>
            ) : matchResults.length > 0 ? (
              matchResults.map((result) => {
                const goalEvents = result.events.filter(e => e.type === 'goal').length
                const yellowCards = result.events.filter(e => e.is_yellow === 1).length
                const redCards = result.events.filter(e => e.is_red === 1).length

                return (
                  <tr key={result.match_id} className='result-row'>
                    <td className='week-cell'>{result.matchweek}</td>
                    <td className='team-cell'>
                      <div className='team-badge-inline'>
                        <img
                          src={result.home_team.image}
                          alt={result.home_team.name}
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = '/images/logo/logo.png'
                          }}
                        />
                        <span>{result.home_team.name}</span>
                      </div>
                    </td>
                    <td className='score-cell'>
                      <div className='score-display'>
                        <span className='score-home'>{result.score.home}</span>
                        <span className='score-separator'>-</span>
                        <span className='score-away'>{result.score.away}</span>
                      </div>
                    </td>
                    <td className='team-cell'>
                      <div className='team-badge-inline'>
                        <img
                          src={result.away_team.image}
                          alt={result.away_team.name}
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = '/images/logo/logo.png'
                          }}
                        />
                        <span>{result.away_team.name}</span>
                      </div>
                    </td>
                    <td className='stats-cell'>
                      <span className='stat-badge'>⚽ {goalEvents}</span>
                    </td>
                    <td className='stats-cell'>
                      <div className='cards-display'>
                        {yellowCards > 0 && <span className='stat-badge yellow'>🟨 {yellowCards}</span>}
                        {redCards > 0 && <span className='stat-badge red'>🟥 {redCards}</span>}
                        {yellowCards === 0 && redCards === 0 && <span className='stat-badge'>-</span>}
                      </div>
                    </td>
                    <td className='status-cell'>
                      <span className='status-badge completed'>Completed</span>
                    </td>
                    <td className='actions-cell'>
                      <button
                        className='action-btn edit-btn'
                        title='Edit Result'
                        onClick={() => onEdit?.(result)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className='action-btn delete-btn'
                        title='Delete Result'
                        onClick={() => handleDelete(result.match_id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={8} className='no-data-cell'>
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MatchResults
