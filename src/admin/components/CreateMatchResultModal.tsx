import React, { useEffect, useMemo, useState } from 'react'
import {
  createMatchResult,
  Event,
} from '../../api/results'
import { MatchResponse } from '../../@types/Results'
import axios from '../../api/axios'
import '../matchResultModal.css'

interface Match {
  id: string
  match_week: number
  home_team: {
    team_name: string
    badge: { image_url: string }
  }
  away_team: {
    team_name: string
    badge: { image_url: string }
  }
}

interface Team {
  id: string
  team_name: string
  team_code: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editingData?: MatchResponse | null
}

const CreateMatchResultModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  editingData,
}) => {
  const [matches, setMatches] = useState<Match[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedMatchId, setSelectedMatchId] = useState('')

  const [homeScore, setHomeScore] = useState(0)
  const [awayScore, setAwayScore] = useState(0)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)

  // Home event form
  const [homeEventType, setHomeEventType] =
    useState<'goal' | 'yellow_card' | 'red_card'>('goal')
  const [homeEventPlayer, setHomeEventPlayer] = useState('')
  const [homeEventMinute, setHomeEventMinute] = useState(0)
  const [homeEventIsYellow, setHomeEventIsYellow] = useState(0)
  const [homeEventIsRed, setHomeEventIsRed] = useState(0)

  // Away event form
  const [awayEventType, setAwayEventType] =
    useState<'goal' | 'yellow_card' | 'red_card'>('goal')
  const [awayEventPlayer, setAwayEventPlayer] = useState('')
  const [awayEventMinute, setAwayEventMinute] = useState(0)
  const [awayEventIsYellow, setAwayEventIsYellow] = useState(0)
  const [awayEventIsRed, setAwayEventIsRed] = useState(0)

  // Team card totals - REMOVED as UI elements were deleted
  // const [homeYellowCount, setHomeYellowCount] = useState(0)
  // const [homeRedCount, setHomeRedCount] = useState(0)
  // const [awayYellowCount, setAwayYellowCount] = useState(0)
  // const [awayRedCount, setAwayRedCount] = useState(0)

  useEffect(() => {
    if (isOpen) {
      axios.get('/matches').then((res) => setMatches(res.data))
      axios.get('/home-away-teams').then((res) => {
        setTeams(res.data)
        // Pre-populate form if editing
        if (editingData) {
          setSelectedMatchId(editingData.match_id)
          setHomeScore(editingData.score.home)
          setAwayScore(editingData.score.away)
          const mappedEvents = editingData.events.map((e) => {
            const team = res.data.find((t: Team) => t.team_name === e.team)
            return {
              team_id: team?.id || '',
              player_name: e.player,
              event_minute: e.minute,
              event_type: e.type as 'goal' | 'yellow_card' | 'red_card',
              is_yellow: e.is_yellow,
              is_red: e.is_red,
            }
          })
          setEvents(mappedEvents)
        }
      })
    }
  }, [isOpen, editingData])

  const selectedMatch = useMemo(
    () => matches.find((m) => m.id === selectedMatchId),
    [matches, selectedMatchId]
  )

  const homeTeamId = useMemo(
    () =>
      teams.find(
        (t) => t.team_name === selectedMatch?.home_team.team_name
      )?.id || '',
    [teams, selectedMatch]
  )

  const awayTeamId = useMemo(
    () =>
      teams.find(
        (t) => t.team_name === selectedMatch?.away_team.team_name
      )?.id || '',
    [teams, selectedMatch]
  )

  const addHomeEvent = () => {
    if (!homeEventPlayer || !homeTeamId) return

    const event: Event = {
      team_id: homeTeamId,
      player_name: homeEventPlayer,
      event_minute: homeEventMinute,
      event_type: homeEventType,
      is_yellow: homeEventIsYellow,
      is_red: homeEventIsRed,
    }

    setEvents((prev) => [...prev, event])
    setHomeEventPlayer('')
    setHomeEventMinute(0)
    setHomeEventIsYellow(0)
    setHomeEventIsRed(0)
  }

  const addAwayEvent = () => {
    if (!awayEventPlayer || !awayTeamId) return

    const event: Event = {
      team_id: awayTeamId,
      player_name: awayEventPlayer,
      event_minute: awayEventMinute,
      event_type: awayEventType,
      is_yellow: awayEventIsYellow,
      is_red: awayEventIsRed,
    }

    setEvents((prev) => [...prev, event])
    setAwayEventPlayer('')
    setAwayEventMinute(0)
    setAwayEventIsYellow(0)
    setAwayEventIsRed(0)
  }

  const removeEvent = (index: number) => {
    setEvents(events.filter((_, i) => i !== index))
  }

  const resetForm = () => {
    setSelectedMatchId('')
    setHomeScore(0)
    setAwayScore(0)
    setEvents([])
    setHomeEventPlayer('')
    setHomeEventMinute(0)
    setHomeEventType('goal')
    setHomeEventIsYellow(0)
    setHomeEventIsRed(0)
    setAwayEventPlayer('')
    setAwayEventMinute(0)
    setAwayEventType('goal')
    setAwayEventIsYellow(0)
    setAwayEventIsRed(0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMatchId) return

    setLoading(true)
    try {
      await createMatchResult({
        match_id: selectedMatchId,
        home_score: homeScore,
        away_score: awayScore,
        events: events,
      })

      alert('Match result created successfully!')
      onSuccess()
      resetForm()
      onClose()
    } catch (err) {
      console.error(err)
      alert('Failed to save result')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content large' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <h2>Create Match Result</h2>
          <button className='modal-close' onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='modal-body'>
            <div className='form-group'>
              <label>Select Match *</label>
              <select
                value={selectedMatchId}
                onChange={(e) => setSelectedMatchId(e.target.value)}
                required
              >
                <option value=''>-- Select Match --</option>
                {matches.map((m) => (
                  <option key={m.id} value={m.id}>
                    Week {m.match_week}: {m.home_team.team_name} vs{' '}
                    {m.away_team.team_name}
                  </option>
                ))}
              </select>
            </div>

            {selectedMatch && (
              <>
                <div className='form-row'>
                  <div className='form-group'>
                    <label>{selectedMatch.home_team.team_name} Score</label>
                    <input
                      type='number'
                      min='0'
                      value={homeScore}
                      onChange={(e) => setHomeScore(+e.target.value)}
                      required
                    />
                  </div>
                  <div className='form-group'>
                    <label>{selectedMatch.away_team.team_name} Score</label>
                    <input
                      type='number'
                      min='0'
                      value={awayScore}
                      onChange={(e) => setAwayScore(+e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className='events-section'>
                  <h3>Match Events</h3>

                  <div className='team-events-container home-team'>
                    <h4>🏠 {selectedMatch.home_team.team_name} Events</h4>
                    
                    <div className='event-form'>
                      <div className='form-row'>
                        <div className='form-group'>
                          <label>Event Type</label>
                          <select
                            value={homeEventType}
                            onChange={(e) => setHomeEventType(e.target.value as any)}
                          >
                            <option value='goal'>⚽ Goal</option>
                            <option value='yellow_card'>🟨 Yellow Card</option>
                            <option value='red_card'>🟥 Red Card</option>
                          </select>
                        </div>
                        <div className='form-group'>
                          <label>Player Name</label>
                          <input
                            type='text'
                            value={homeEventPlayer}
                            onChange={(e) => setHomeEventPlayer(e.target.value)}
                            placeholder='Player name'
                          />
                        </div>
                        <div className='form-group'>
                          <label>Minute</label>
                          <input
                            type='number'
                            min='0'
                            max='120'
                            value={homeEventMinute}
                            onChange={(e) => setHomeEventMinute(+e.target.value)}
                          />
                        </div>
                      </div>
                      <div className='form-row'>
                        <div className='form-group'>
                          <label>Is Yellow (0-8)</label>
                          <input
                            type='number'
                            min='0'
                            max='8'
                            value={homeEventIsYellow}
                            onChange={(e) => setHomeEventIsYellow(+e.target.value)}
                          />
                        </div>
                        <div className='form-group'>
                          <label>Is Red (0-8)</label>
                          <input
                            type='number'
                            min='0'
                            max='8'
                            value={homeEventIsRed}
                            onChange={(e) => setHomeEventIsRed(+e.target.value)}
                          />
                        </div>
                      </div>
                      <button type='button' className='btn-secondary' onClick={addHomeEvent}>
                        + Add {selectedMatch.home_team.team_name} Event
                      </button>
                    </div>
                  </div>

                  <div className='team-events-container away-team'>
                    <h4>✈️ {selectedMatch.away_team.team_name} Events</h4>
                    
                    <div className='event-form'>
                      <div className='form-row'>
                        <div className='form-group'>
                          <label>Event Type</label>
                          <select
                            value={awayEventType}
                            onChange={(e) => setAwayEventType(e.target.value as any)}
                          >
                            <option value='goal'>⚽ Goal</option>
                            <option value='yellow_card'>🟨 Yellow Card</option>
                            <option value='red_card'>🟥 Red Card</option>
                          </select>
                        </div>
                        <div className='form-group'>
                          <label>Player Name</label>
                          <input
                            type='text'
                            value={awayEventPlayer}
                            onChange={(e) => setAwayEventPlayer(e.target.value)}
                            placeholder='Player name'
                          />
                        </div>
                        <div className='form-group'>
                          <label>Minute</label>
                          <input
                            type='number'
                            min='0'
                            max='120'
                            value={awayEventMinute}
                            onChange={(e) => setAwayEventMinute(+e.target.value)}
                          />
                        </div>
                      </div>
                      <div className='form-row'>
                        <div className='form-group'>
                          <label>Is Yellow (0-8)</label>
                          <input
                            type='number'
                            min='0'
                            max='8'
                            value={awayEventIsYellow}
                            onChange={(e) => setAwayEventIsYellow(+e.target.value)}
                          />
                        </div>
                        <div className='form-group'>
                          <label>Is Red (0-8)</label>
                          <input
                            type='number'
                            min='0'
                            max='8'
                            value={awayEventIsRed}
                            onChange={(e) => setAwayEventIsRed(+e.target.value)}
                          />
                        </div>
                      </div>
                      <button type='button' className='btn-secondary' onClick={addAwayEvent}>
                        + Add {selectedMatch.away_team.team_name} Event
                      </button>
                    </div>
                  </div>

                  {events.length > 0 && (
                    <div className='events-list'>
                      <h4>Added Events ({events.length})</h4>
                      <ul>
                        {events.map((e, i) => {
                          const team = teams.find((t) => t.id === e.team_id)
                          const isHome = team?.id === homeTeamId
                          const eventIcon = 
                            e.event_type === 'goal' ? '⚽' :
                            e.event_type === 'yellow_card' ? '🟨' : '🟥'
                          const eventLabel = 
                            e.event_type === 'goal' ? 'Goal' :
                            e.event_type === 'yellow_card' ? 'Yellow' : 'Red'
                          
                          return (
                            <li key={i} className={isHome ? 'home-event' : 'away-event'}>
                              <span>
                                {isHome ? '🏠' : '✈️'} 
                                {e.event_minute > 0 && ` ${e.event_minute}'`}
                                {e.player_name && ` - ${e.player_name}`}
                                {` - ${eventIcon} ${eventLabel}`}
                              </span>
                              <button type='button' className='btn-remove' onClick={() => removeEvent(i)}>
                                Remove
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className='modal-footer'>
            <button type='button' className='btn-cancel' onClick={onClose}>
              Cancel
            </button>
            <button type='submit' className='btn-primary' disabled={loading}>
              {loading ? 'Saving...' : 'Save Result'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateMatchResultModal
