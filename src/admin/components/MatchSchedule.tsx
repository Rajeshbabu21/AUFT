import React  from 'react'
import { Matches } from '../../@types/Matches'

interface MatchScheduleProps {
  matches: Matches[]
  loading: boolean
  onEdit: (match: Matches) => void
  onDelete: (matchId: string) => void
  onAdd: () => void
}

const MatchSchedule: React.FC<MatchScheduleProps> = ({
  matches,
  loading,
  onEdit,
  onDelete,
  onAdd
}) => {
  const handleDelete = (matchId: string) => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      onDelete(matchId)
    }
  }

  return (
    <div className='schedule-full-container'>
      <div className='schedule-header-section'>
        <div>
          <h2>Match Schedule</h2>
          <p>Manage all match schedules</p>
        </div>
        <button className='btn-add-match' onClick={onAdd}>
          + Add New Match
        </button>
      </div>

      <div className='schedule-table-wrapper'>
        <table className='schedule-table'>
          <thead>
            <tr>
              <th>Week</th>
              <th>Date</th>
              <th>Time</th>
              <th>Home Team</th>
              <th>Away Team</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className='loading-cell'>
                  Loading matches...
                </td>
              </tr>
            ) : matches.length > 0 ? (
              matches.map((match) => (
                <tr key={match.id} className='schedule-row'>
                  <td className='week-cell'>{match.match_week}</td>
                  <td className='date-cell'>
                    {match.conduction_date
                      ? new Date(match.conduction_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: '2-digit'
                        })
                      : 'TBD'}
                  </td>
                  <td className='time-cell'>
                    {match.match_time
                      ? new Date(`2000-01-01T${match.match_time}`).toLocaleTimeString(
                          'en-US',
                          {
                            hour: '2-digit',
                            minute: '2-digit'
                          }
                        )
                      : 'TBD'}
                  </td>
                  <td className='team-cell'>
                    <div className='team-badge-inline'>
                      <img
                        src={match.home_team.badge.image_url}
                        alt={match.home_team.team_name}
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = '/images/logo/logo.png'
                        }}
                      />
                      <span>{match.home_team.team_name}</span>
                    </div>
                  </td>
                  <td className='team-cell'>
                    <div className='team-badge-inline'>
                      <img
                        src={match.away_team.badge.image_url}
                        alt={match.away_team.team_name}
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = '/images/logo/logo.png'
                        }}
                      />
                      <span>{match.away_team.team_name}</span>
                    </div>
                  </td>
                  <td className='status-cell'>
                    {match.conduction_date ? (
                      <span className='status-badge scheduled'>Scheduled</span>
                    ) : (
                      <span className='status-badge upcoming'>Upcoming</span>
                    )}
                  </td>
                  <td className='actions-cell'>
                    <button
                      className='action-btn edit-btn'
                      title='Edit Match'
                      onClick={() => onEdit(match)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className='action-btn delete-btn'
                      title='Delete Match'
                      onClick={() => handleDelete(match.id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className='no-data-cell'>
                  No matches found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MatchSchedule
