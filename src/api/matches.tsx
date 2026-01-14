import api from './axios'
import { Matches } from '../@types/Matches'

interface CreateMatchData {
  match_week: number
  conduction_date: string
  match_time: string
  home_team_name: string
  away_team_name: string
}

interface UpdateMatchData {
  match_week?: number
  conduction_date?: string
  match_time?: string
  home_team_name?: string
  away_team_name?: string
}

interface Team {
  id: string
  team_name: string
  team_code: string
}

export const createMatch = async (data: CreateMatchData): Promise<Matches> => {
  try {
    const response = await api.post('/create_matches', data)
    return response.data
  } catch (error: any) {
    throw new Error(
      error.response?.data?.detail || 'Failed to create match'
    )
  }
}

export const getMatches = async (): Promise<Matches[]> => {
  try {
    const response = await api.get('/matches')
    return response.data
  } catch (error: any) {
    throw new Error(
      error.response?.data?.detail || 'Failed to fetch matches'
    )
  }
}

export const getTeams = async (): Promise<Team[]> => {
  try {
    const response = await api.get('/home-away-teams')
    return response.data
  } catch (error: any) {
    throw new Error(
      error.response?.data?.detail || 'Failed to fetch teams'
    )
  }
}

export const updateMatch = async (
  id: string,
  data: UpdateMatchData
): Promise<Matches> => {
  try {
    const response = await api.put(`/update_points/${id}`, data)
    return response.data.data
  } catch (error: any) {
    throw new Error(
      error.response?.data?.detail || 'Failed to update match'
    )
  }
}

export const deleteMatch = async (id: string): Promise<void> => {
  try {
    await api.delete(`/delete_match/${id}`)
  } catch (error: any) {
    throw new Error(
      error.response?.data?.detail || 'Failed to delete match'
    )
  }
}
