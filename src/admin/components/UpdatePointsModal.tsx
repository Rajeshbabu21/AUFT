import React, { useState, useEffect } from 'react'
import { PointsTableItem } from '../../@types/Points'

interface UpdatePointsModalProps {
  team: PointsTableItem | null
  onClose: () => void
  onSave: (data: UpdatePointsData) => Promise<void>
}

export interface UpdatePointsData {
  matches_played: number
  wins: number
  draws: number
  losses: number
  points: number
  position: number
  goal_Diif: number
  qualified: boolean
}

const UpdatePointsModal: React.FC<UpdatePointsModalProps> = ({
  team,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<UpdatePointsData>({
    matches_played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    points: 0,
    position: 0,
    goal_Diif: 0,
    qualified: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (team) {
      setFormData({
        matches_played: team.matches_played,
        wins: team.wins,
        draws: team.draws,
        losses: team.losses,
        points: team.points,
        position: team.position,
        goal_Diif: team.goal_Diif,
        qualified: team.qualified
      })
    }
  }, [team])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
          ? parseInt(value) || 0
          : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await onSave(formData)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to update team stats')
    } finally {
      setLoading(false)
    }
  }

  if (!team) return null

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <h2>Update Team Stats</h2>
          <button className='modal-close' onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className='modal-form'>
          <div className='form-group'>
            <label>Team</label>
            <div className='team-info'>
              <img
                src={team.teams.images.image_url}
                alt={team.teams.team_name}
                className='team-flag-small'
              />
              <span>{team.teams.team_name}</span>
            </div>
          </div>

          <div className='form-row'>
            <div className='form-group'>
              <label htmlFor='position'>Position</label>
              <input
                type='number'
                id='position'
                name='position'
                value={formData.position}
                onChange={handleChange}
                min='1'
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='matches_played'>Matches Played</label>
              <input
                type='number'
                id='matches_played'
                name='matches_played'
                value={formData.matches_played}
                onChange={handleChange}
                min='0'
                required
              />
            </div>
          </div>

          <div className='form-row'>
            <div className='form-group'>
              <label htmlFor='wins'>Wins</label>
              <input
                type='number'
                id='wins'
                name='wins'
                value={formData.wins}
                onChange={handleChange}
                min='0'
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='draws'>Draws</label>
              <input
                type='number'
                id='draws'
                name='draws'
                value={formData.draws}
                onChange={handleChange}
                min='0'
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='losses'>Losses</label>
              <input
                type='number'
                id='losses'
                name='losses'
                value={formData.losses}
                onChange={handleChange}
                min='0'
                required
              />
            </div>
          </div>

          <div className='form-row'>
            <div className='form-group'>
              <label htmlFor='goal_Diif'>Goal Difference</label>
              <input
                type='number'
                id='goal_Diif'
                name='goal_Diif'
                value={formData.goal_Diif}
                onChange={handleChange}
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='points'>Points</label>
              <input
                type='number'
                id='points'
                name='points'
                value={formData.points}
                onChange={handleChange}
                min='0'
                required
              />
            </div>
          </div>

          <div className='form-group'>
            <label className='checkbox-label'>
              <input
                type='checkbox'
                name='qualified'
                checked={formData.qualified}
                onChange={handleChange}
              />
              <span>Qualified for next round</span>
            </label>
          </div>

          {error && <div className='error-message'>{error}</div>}

          <div className='modal-actions'>
            <button
              type='button'
              className='btn-cancel'
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button type='submit' className='btn-save' disabled={loading}>
              {loading ? 'Updating...' : 'Update Stats'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdatePointsModal
