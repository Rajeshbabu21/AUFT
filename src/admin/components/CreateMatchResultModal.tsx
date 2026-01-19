import React, { useEffect, useMemo, useState } from 'react'
import {
  createMatchResult,
  createGoalEvent,
  createRedCardEvent,
  createYellowCardEvent,
  Event,
} from '../../api/results'
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
}

const CreateMatchResultModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
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

  // Away event form
  const [awayEventType, setAwayEventType] =
    useState<'goal' | 'yellow_card' | 'red_card'>('goal')
  const [awayEventPlayer, setAwayEventPlayer] = useState('')
  const [awayEventMinute, setAwayEventMinute] = useState(0)

  // Team card totals
  const [homeYellowCount, setHomeYellowCount] = useState(0)
  const [homeRedCount, setHomeRedCount] = useState(0)
  const [awayYellowCount, setAwayYellowCount] = useState(0)
  const [awayRedCount, setAwayRedCount] = useState(0)

  useEffect(() => {
    if (isOpen) {
      axios.get('/matches').then((res) => setMatches(res.data))
      axios.get('/home-away-teams').then((res) => setTeams(res.data))
    }
  }, [isOpen])

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

    const event =
      homeEventType === 'goal'
        ? createGoalEvent(homeTeamId, homeEventPlayer, homeEventMinute)
        : homeEventType === 'yellow_card'
          ? createYellowCardEvent(homeTeamId, homeEventPlayer, homeEventMinute)
          : createRedCardEvent(homeTeamId, homeEventPlayer, homeEventMinute)

    setEvents((prev) => [...prev, event])
    setHomeEventPlayer('')
    setHomeEventMinute(0)
  }

  const addAwayEvent = () => {
    if (!awayEventPlayer || !awayTeamId) return

    const event =
      awayEventType === 'goal'
        ? createGoalEvent(awayTeamId, awayEventPlayer, awayEventMinute)
        : awayEventType === 'yellow_card'
          ? createYellowCardEvent(awayTeamId, awayEventPlayer, awayEventMinute)
          : createRedCardEvent(awayTeamId, awayEventPlayer, awayEventMinute)

    setEvents((prev) => [...prev, event])
    setAwayEventPlayer('')
    setAwayEventMinute(0)
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
    setAwayEventPlayer('')
    setAwayEventMinute(0)
    setAwayEventType('goal')
    setHomeYellowCount(0)
    setHomeRedCount(0)
    setAwayYellowCount(0)
    setAwayRedCount(0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMatchId) return

    setLoading(true)
    try {
      // Only send real player events (no empty card events)
      await createMatchResult({
        match_id: selectedMatchId,
        home_score: homeScore,
        away_score: awayScore,
        events: events, // Only real player-based events
        home_yellow_cards: homeYellowCount,
        home_red_cards: homeRedCount,
        away_yellow_cards: awayYellowCount,
        away_red_cards: awayRedCount,
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
                      
                    <div className='card-counts'>
                      <h5>Team Cards (Total)</h5>
                      <p className='card-counts-note'>
                        💡 Enter total card counts. These are added automatically on submit (not shown in events list below).
                      </p>
                      <div className='card-inputs'>
                        <div className='form-group'>
                          <label>🟨 Yellow Cards</label>
                          <input
                            type='number'
                            min='0'
                            value={homeYellowCount}
                            onChange={(e) => setHomeYellowCount(+e.target.value)}
                            placeholder='0'
                          />
                        </div>
                        <div className='form-group'>
                          <label>🟥 Red Cards</label>
                          <input
                            type='number'
                            min='0'
                            value={homeRedCount}
                            onChange={(e) => setHomeRedCount(+e.target.value)}
                            placeholder='0'
                          />
                        </div>
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
                      <div className='card-counts'>
                      <h5>Team Cards (Total)</h5>
                      <p className='card-counts-note'>
                        💡 Enter total card counts. These are added automatically on submit (not shown in events list below).
                      </p>
                      <div className='card-inputs'>
                        <div className='form-group'>
                          <label>🟨 Yellow Cards</label>
                          <input
                            type='number'
                            min='0'
                            value={awayYellowCount}
                            onChange={(e) => setAwayYellowCount(+e.target.value)}
                            placeholder='0'
                          />
                        </div>
                        <div className='form-group'>
                          <label>🟥 Red Cards</label>
                          <input
                            type='number'
                            min='0'
                            value={awayRedCount}
                            onChange={(e) => setAwayRedCount(+e.target.value)}
                            placeholder='0'
                          />
                        </div>
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
