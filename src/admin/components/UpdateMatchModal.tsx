import React, { useState, useEffect } from 'react'
import { Matches } from '../../@types/Matches'

interface Team {
  id: string
  team_name: string
  team_code: string
}

interface UpdateMatchModalProps {
  match: Matches | null
  teams: Team[]
  onClose: () => void
  onSave: (data: UpdateMatchData) => Promise<void>
}

export interface UpdateMatchData {
  match_week?: number
  conduction_date?: string
  match_time?: string
  home_team_name?: string
  away_team_name?: string
}

const UpdateMatchModal: React.FC<UpdateMatchModalProps> = ({
  match,
  teams,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<UpdateMatchData>({
    match_week: 0,
    conduction_date: '',
    match_time: '',
    home_team_name: '',
    away_team_name: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (match) {
      setFormData({
        match_week: match.match_week,
        conduction_date: match.conduction_date || '',
        match_time: match.match_time || '',
        home_team_name: match.home_team.team_name || '',
        away_team_name: match.away_team.team_name || ''
      })
    }
  }, [match])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
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
      setError(err.message || 'Failed to update match')
    } finally {
      setLoading(false)
    }
  }

  if (!match) return null

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <h2>Update Match</h2>
          <button className='modal-close' onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className='modal-form'>
          <div className='form-group'>
            <label>Match</label>
            <div className='match-info'>
              <div className='team-info-match'>
                <img
                  src={match.home_team.badge.image_url}
                  alt={match.home_team.team_name}
                  className='team-flag-small'
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src =
                      '/images/logo/logo.png'
                  }}
                />
                <span>{match.home_team.team_name}</span>
              </div>
              <span className='vs-text'>vs</span>
              <div className='team-info-match'>
                <span>{match.away_team.team_name}</span>
                <img
                  src={match.away_team.badge.image_url}
                  alt={match.away_team.team_name}
                  className='team-flag-small'
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src =
                      '/images/logo/logo.png'
                  }}
                />
              </div>
            </div>
          </div>

          <div className='form-row'>
            <div className='form-group'>
              <label htmlFor='match_week'>Match Week</label>
              <input
                type='number'
                id='match_week'
                name='match_week'
                value={formData.match_week}
                onChange={handleChange}
                min='1'
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='conduction_date'>Match Date (Optional)</label>
              <input
                type='date'
                id='conduction_date'
                name='conduction_date'
                value={formData.conduction_date}
                onChange={handleChange}
              />
              <small style={{ color: '#888', fontSize: '0.85em' }}>Leave empty if TBD</small>
            </div>
          </div>

          <div className='form-group'>
            <label htmlFor='match_time'>Match Time (Optional)</label>
            <input
              type='time'
              id='match_time'
              name='match_time'
              value={formData.match_time}
              onChange={handleChange}
            />
            <small style={{ color: '#888', fontSize: '0.85em' }}>Leave empty if TBD</small>
          </div>

          <div className='form-row'>
            <div className='form-group'>
              <label htmlFor='home_team_name'>Home Team</label>
              <select
                id='home_team_name'
                name='home_team_name'
                value={formData.home_team_name}
                onChange={handleChange}
                required
              >
                <option value=''>Select Home Team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.team_name}>
                    {team.team_name}
                  </option>
                ))}
              </select>
            </div>

            <div className='form-group'>
              <label htmlFor='away_team_name'>Away Team</label>
              <select
                id='away_team_name'
                name='away_team_name'
                value={formData.away_team_name}
                onChange={handleChange}
                required
              >
                <option value=''>Select Away Team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.team_name}>
                    {team.team_name}
                  </option>
                ))}
              </select>
            </div>
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
              {loading ? 'Updating...' : 'Update Match'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateMatchModal
