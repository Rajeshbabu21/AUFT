import api from './axios'
import { PlayerStat } from '../@types/PlayerStats'

export const getPlayerStats = async (): Promise<PlayerStat[]> => {
  try {
    const response = await api.get('/player-stats')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch player stats')
  }
}
