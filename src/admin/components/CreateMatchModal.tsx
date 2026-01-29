import React, { useState, useEffect } from 'react'

interface Team {
  id: string
  team_name: string
  team_code: string
}

interface CreateMatchFormData {
  match_week: number
  conduction_date: string
  match_time: string
  home_team_name: string
  away_team_name: string
}

interface CreateMatchSubmitData {
  match_week: number
  conduction_date: string | null
  match_time: string | null
  home_team_name: string
  away_team_name: string
}

interface CreateMatchModalProps {
  isOpen: boolean
  teams: Team[]
  onClose: () => void
  onSave: (data: CreateMatchSubmitData) => Promise<void>
}

const CreateMatchModal: React.FC<CreateMatchModalProps> = ({
  isOpen,
  teams,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<CreateMatchFormData>({
    match_week: 1,
    conduction_date: '',
    match_time: '',
    home_team_name: '',
    away_team_name: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        match_week: 1,
        conduction_date: '',
        match_time: '',
        home_team_name: '',
        away_team_name: ''
      })
      setError(null)
    }
  }, [isOpen])

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

    // Validation
    if (!formData.home_team_name || !formData.away_team_name) {
      setError('Please select both home and away teams')
      setLoading(false)
      return
    }

    if (formData.home_team_name === formData.away_team_name) {
      setError('Home and away teams must be different')
      setLoading(false)
      return
    }

    // Date and time are now optional - can be updated later
    // Send null instead of empty string for optional fields
    const submitData = {
      ...formData,
      conduction_date: formData.conduction_date || null,
      match_time: formData.match_time || null
    }

    try {
      await onSave(submitData)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to create match')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <h2>Create New Match</h2>
          <button className='modal-close' onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className='modal-form'>
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
              {loading ? 'Creating...' : 'Create Match'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateMatchModal
