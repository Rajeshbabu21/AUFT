import axios from './axios'
import { MatchResponse } from '../@types/Results'

export interface Event {
  team_id: string
  player_name: string
  event_minute: number
  event_type: 'goal' | 'yellow_card' | 'red_card'
  is_yellow: number
  is_red: number
}

export interface CreateMatchResult {
  match_id: string
  home_score: number
  away_score: number
  events: Event[]
  home_yellow_cards?: number
  home_red_cards?: number
  away_yellow_cards?: number
  away_red_cards?: number
}

/**
 * Get all match results
 */
export const getAllMatchResults = async (): Promise<MatchResponse[]> => {
  const response = await axios.get('/match-details')
  return response.data
}

/**
 * Create or update match result with events
 */
export const createMatchResult = async (data: CreateMatchResult) => {
  const response = await axios.post('/update_match-details', data)
  return response.data
}

/**
 * Get specific match details
 */
export const getMatchDetails = async (matchId: string) => {
  const response = await axios.get(`/match-details/${matchId}`)
  return response.data
}

/**
 * Delete match result and all events
 */
export const deleteMatchResult = async (matchId: string) => {
  const response = await axios.delete(`/match-details/${matchId}`)
  return response.data
}

/**
 * Helper: Create goal event
 */
export const createGoalEvent = (
  teamId: string,
  playerName: string,
  minute: number
): Event => ({
  team_id: teamId,
  player_name: playerName,
  event_minute: minute,
  event_type: 'goal',
  is_yellow: 0,
  is_red: 0,
})

/**
 * Helper: Create yellow card event
 */
export const createYellowCardEvent = (
  teamId: string,
  playerName: string,
  minute: number
): Event => ({
  team_id: teamId,
  player_name: playerName,
  event_minute: minute,
  event_type: 'yellow_card',
  is_yellow: 1,
  is_red: 0,
})

/**
 * Helper: Create red card event
 */
export const createRedCardEvent = (
  teamId: string,
  playerName: string,
  minute: number
): Event => ({
  team_id: teamId,
  player_name: playerName,
  event_minute: minute,
  event_type: 'red_card',
  is_yellow: 0,
  is_red: 1,
})
