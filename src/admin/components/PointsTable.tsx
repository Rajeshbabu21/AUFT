import React from 'react'
import { PointsTableItem } from '../../@types/Points'

interface PointsTableProps {
  pointsTable: PointsTableItem[]
  loading: boolean
  onEdit?: (item: PointsTableItem) => void
  onAdd?: () => void
}

const PointsTable: React.FC<PointsTableProps> = ({ 
  pointsTable, 
  loading,
  onEdit,
  
}) => {

  return (
    <div className='points-table-full-container '>
      <div className='table-header-full'>
        <div>
          <h2>Points Table</h2>
        </div>
        
      </div>

      <div className='points-table-wrapper-full'>
        <table className='points-table-full'>
          <thead>
            <tr>
              <th className='pos'>Position</th>
              <th className='team'>Team</th>
              <th className='stat'>Played</th>
              <th className='stat'>Wins</th>
              <th className='stat'>Draws</th>
              <th className='stat'>Losses</th>
              <th className='stat'>GD</th>
              <th className='pts'>Points</th>
              <th className='actions'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className='loading-cell'>
                  Loading standings...
                </td>
              </tr>
            ) : pointsTable.length > 0 ? (
              pointsTable.map((item) => (
                <tr key={item.id} className={item.qualified ? 'qualified' : ''}>
                  <td className='pos-cell'>{item.position}</td>
                  <td className='team-cell'>
                    <div className='team-name-cell-full'>
                      <img
                        src={item.teams.images.image_url}
                        alt={item.teams.team_name}
                        className='team-flag-full'
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src =
                            '/images/logo/logo.png'
                        }}
                      />
                      <span>{item.teams.team_name}</span>
                    </div>
                  </td>
                  <td className='stat'>{item.matches_played}</td>
                  <td className='stat'>{item.wins}</td>
                  <td className='stat'>{item.draws}</td>
                  <td className='stat'>{item.losses}</td>
                  <td className='stat'>
                    {item.goal_Diif > 0 ? '+' : ''}
                    {item.goal_Diif}
                  </td>
                  <td className='pts-cell'>
                    <strong>{item.points}</strong>
                  </td>
                  <td className='actions-cell'>
                    <button
                      className='action-btn edit-btn'
                      title='Update Team Stats'
                      onClick={() => onEdit?.(item)}
                    >
                      ✏️ Update
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className='no-data-cell'>
                  No standings data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className='table-legend-full'>
        <div className='legend-item qualified-box'>
          <span>✓ Qualified for next round</span>
        </div>
      </div>
    </div>
  )
}

export default PointsTable
