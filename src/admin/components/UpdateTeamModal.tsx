import React, { useEffect, useState } from 'react'
import { Team } from '../../@types/Team'

interface UpdateTeamModalProps {
  team: Team | null
  onClose: () => void
  onSave: (data: { team_code?: string; team_name?: string }) => Promise<void>
}

const UpdateTeamModal: React.FC<UpdateTeamModalProps> = ({ team, onClose, onSave }) => {
  const [teamCode, setTeamCode] = useState('')
  const [teamName, setTeamName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (team) {
      setTeamCode(team.team_code || '')
      setTeamName(team.team_name || '')
    }
  }, [team])

  if (!team) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const payload: { team_code?: string; team_name?: string } = {}
    if (teamCode.trim() && teamCode.trim() !== team.team_code) payload.team_code = teamCode.trim()
    if (teamName.trim() && teamName.trim() !== team.team_name) payload.team_name = teamName.trim()

    if (Object.keys(payload).length === 0) {
      setError('Please change team code or team name before saving.')
      return
    }

    try {
      setLoading(true)
      await onSave(payload)
      onClose()
    } catch (err: any) {
      setError(err?.message || 'Failed to update team')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <h2>Update Team</h2>
          <button className='modal-close' onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className='modal-form'>
          <div className='form-group'>
            <label htmlFor='team_code'>Team Code</label>
            <input
              id='team_code'
              type='text'
              value={teamCode}
              onChange={(e) => setTeamCode(e.target.value)}
              placeholder='Enter team code'
            />
          </div>

          <div className='form-group'>
            <label htmlFor='team_name'>Team Name</label>
            <input
              id='team_name'
              type='text'
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder='Enter team name'
            />
          </div>

          {error && <div className='error-message'>{error}</div>}

          <div className='modal-actions'>
            <button type='button' className='modal-secondary' onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type='submit' className='modal-primary' disabled={loading}>
              {loading ? 'Saving...' : 'Save Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateTeamModal