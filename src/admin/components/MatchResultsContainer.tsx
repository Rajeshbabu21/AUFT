import React, { useState, useEffect } from 'react'
import MatchResults from './MatchResults'
import CreateMatchResultModal from './CreateMatchResultModal'
import { MatchResponse } from '../../@types/Results'
import { getAllMatchResults, deleteMatchResult } from '../../api/results'

const MatchResultsContainer: React.FC = () => {
  const [matchResults, setMatchResults] = useState<MatchResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  // const [selectedResult, setSelectedResult] = useState<MatchResponse | null>(null)

  useEffect(() => {
    fetchMatchResults()
  }, [])

  const fetchMatchResults = async () => {
    setLoading(true)
    try {
      const data = await getAllMatchResults()
      setMatchResults(data)
    } catch (error) {
      console.error('Error fetching match results:', error)
      alert('Failed to fetch match results')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setIsCreateModalOpen(true)
  }

  const handleEdit = (result: MatchResponse) => {
    setSelectedResult(result)
    setIsEditModalOpen(true)
  }

  const handleDelete = async (matchId: string) => {
    try {
      await deleteMatchResult(matchId)
      alert('Match result deleted successfully')
      fetchMatchResults() // Refresh the list
    } catch (error) {
      console.error('Error deleting match result:', error)
      alert('Failed to delete match result')
    }
  }

  const handleSuccess = () => {
    fetchMatchResults() // Refresh the list after create/update
  }

  return (
    <>
      <MatchResults
        matchResults={matchResults}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CreateMatchResultModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleSuccess}
      />

      {/* Edit modal would be similar - you can reuse CreateMatchResultModal with edit mode */}
    </>
  )
}

export default MatchResultsContainer
