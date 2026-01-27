import api from './axios'
import { TeamStat } from '../@types/TeamStats'

export const getTeamStats = async (): Promise<TeamStat[]> => {
  try {
    const response = await api.get('/teamstats')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch team stats')
  }
}
