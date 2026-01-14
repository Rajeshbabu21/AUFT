import api from './axios'
import { PointsTableItem } from '../@types/Points'

interface UpdatePointsData {
  matches_played?: number
  wins?: number
  draws?: number
  losses?: number
  points?: number
  position?: number
  qualified?: boolean
  goal_Diif?: number
}

export const updatePointsTable = async (
  id: string,
  data: UpdatePointsData
): Promise<PointsTableItem> => {
  try {
    const response = await api.put(`/points-table/${id}`, data)
    return response.data.data
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to update points table'
    )
  }
}

export const getPointsTable = async (): Promise<PointsTableItem[]> => {
  try {
    const response = await api.get('/points-table')
    return response.data
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch points table'
    )
  }
}
