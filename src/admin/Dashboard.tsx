import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Matches } from '../@types/Matches'
import { PointsTableItem } from '../@types/Points'
// import { MatchResponse } from '../@types/Results'
import { Team } from '../@types/Team'
import MatchSchedule from './components/MatchSchedule'
import MatchResultsContainer from './components/MatchResultsContainer'
import PointsTableComponent from './components/PointsTable'
import Teams from './components/Teams'
import UpdatePointsModal from './components/UpdatePointsModal'
import UpdateMatchModal from './components/UpdateMatchModal'
import UpdateTeamModal from './components/UpdateTeamModal'
import CreateMatchModal from './components/CreateMatchModal'
import { getPointsTable, updatePointsTable } from '../api/points'
import { getMatches, updateMatch, deleteMatch, createMatch, getTeamscode, updateTeam } from '../api/matches'
// import { getAllMatchResults } from '../api/results'
import './dashboard.css'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const [matches, setMatches] = useState<Matches[]>([])
  const [pointsTable, setPointsTable] = useState<PointsTableItem[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [activeMenu, setActiveMenu] = useState<'schedule' | 'points' | 'results' | 'teams'>('schedule')
  const [selectedTeam, setSelectedTeam] = useState<PointsTableItem | null>(null)
  const [selectedTeamEdit, setSelectedTeamEdit] = useState<Team | null>(null)
  const [selectedMatch, setSelectedMatch] = useState<Matches | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('admin_access_token')
      localStorage.removeItem('admin_token_type')
      navigate('/admin')
    }
  }

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch matches from backend
        const matchesData = await getMatches()
        console.log('Matches data received:', matchesData)
        setMatches(matchesData)

        // Fetch teams from backend
        const teamsData = await getTeamscode()
        console.log('Teams data received:', teamsData)
        setTeams(teamsData)

        // Fetch points table from backend
        const pointsData = await getPointsTable()
        console.log('Points data received:', pointsData)
        setPointsTable(pointsData)

        // Match results are now fetched in MatchResultsContainer
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className='admin-dashboard'>
      {/* Navbar */}
      <nav className='admin-navbar'>
        <div className='navbar-content'>
          <div className='navbar-left'>
            <h1 className='navbar-title'>Admin Dashboard</h1>
          </div>
          
          <div className='navbar-right'>
            {/* <button className='nav-btn'>Notifications</button> */}
            <button className='nav-btn' onClick={handleLogout}>Logout</button>
            
          </div>
        </div>
      </nav>

      <div className='dashboard-wrapper'>
        {/* Left Sidebar Menu */}
        <aside className='admin-sidebar-menu'>
          <div className='sidebar-menu-header'>
            <h3>Menu</h3>
          </div>
          <nav className='sidebar-menu-nav'>
            <button
              className={`menu-item ${activeMenu === 'schedule' ? 'active' : ''}`}
              onClick={() => setActiveMenu('schedule')}
            >
              <span className='menu-icon'>📅</span>
              <span className='menu-label'>Match Schedule</span>
            </button>
            <button
              className={`menu-item ${activeMenu === 'results' ? 'active' : ''}`}
              onClick={() => setActiveMenu('results')}
            >
              <span className='menu-icon'>📊</span>
              <span className='menu-label'>Match Results</span>
            </button>
            <button
              className={`menu-item ${activeMenu === 'points' ? 'active' : ''}`}
              onClick={() => setActiveMenu('points')}
            >
              <span className='menu-icon'>🏆</span>
              <span className='menu-label'>Points Table</span>
            </button>
            <button
              className={`menu-item ${activeMenu === 'teams' ? 'active' : ''}`}
              onClick={() => setActiveMenu('teams')}
            >
              <span className='menu-icon'>🏆</span>
              <span className='menu-label'>Teams</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <div className='dashboard-container'>
          {/* Schedule View */}
          {activeMenu === 'schedule' && (
            <MatchSchedule
              matches={matches}
              loading={loading}
              onEdit={(match) => {
                setSelectedMatch(match)
              }}
              onDelete={async (matchId) => {
                try {
                  if (window.confirm('Are you sure you want to delete this match?')) {
                    await deleteMatch(matchId)
                    // Refresh matches list
                    const updatedMatches = matches.filter(m => m.id !== matchId)
                    setMatches(updatedMatches)
                  }
                } catch (error: any) {
                  console.error('Error deleting match:', error)
                  alert(error.message || 'Failed to delete match')
                }
              }}
              onAdd={() => {
                setIsCreateModalOpen(true)
              }}
            />
          )}

          {/* Points Table Full View */}
          {activeMenu === 'points' && (
            <PointsTableComponent 
              pointsTable={pointsTable} 
              loading={loading}
              onEdit={(item) => {
                setSelectedTeam(item)
              }}
              onAdd={() => {
                console.log('Add new team')
                // TODO: Implement add functionality
              }}
            />
          )}

          {/* Match Results View */}
          {activeMenu === 'results' && (
            <MatchResultsContainer />
          )}

          {/* Teams View */}
          {activeMenu === 'teams' && (
            <Teams
              teams={teams}
              onEdit={(team) => {
                setSelectedTeamEdit(team)
              }}
            />
          )}

        
        </div>
      </div>

      {/* Update Points Modal */}
      {selectedTeam && (
        <UpdatePointsModal
          team={selectedTeam}
          onClose={() => setSelectedTeam(null)}
          onSave={async (data) => {
            try {
              await updatePointsTable(String(selectedTeam.id), data)
              // Refresh points table data
              const pointsData = await getPointsTable()
              setPointsTable(pointsData)
              setSelectedTeam(null)
            } catch (error: any) {
              console.error('Error updating team:', error)
              throw error
            }
          }}
        />
      )}

      {/* Update Team Modal */}
      {selectedTeamEdit && (
        <UpdateTeamModal
          team={selectedTeamEdit}
          onClose={() => setSelectedTeamEdit(null)}
          onSave={async (data) => {
            try {
              await updateTeam(selectedTeamEdit.id, data)
              const refreshed = await getTeamscode()
              setTeams(refreshed)
              setSelectedTeamEdit(null)
            } catch (error: any) {
              console.error('Error updating team:', error)
              throw error
            }
          }}
        />
      )}

      {/* Update Match Modal */}
      {selectedMatch && (
        <UpdateMatchModal
          match={selectedMatch}
          teams={teams}
          onClose={() => setSelectedMatch(null)}
          onSave={async (data) => {
            try {
              await updateMatch(selectedMatch.id, data)
              // Refresh matches list
              const updatedMatches = matches.map(m =>
                m.id === selectedMatch.id
                  ? { ...m, ...data }
                  : m
              )
              setMatches(updatedMatches)
              setSelectedMatch(null)
            } catch (error: any) {
              console.error('Error updating match:', error)
              throw error
            }
          }}
        />
      )}

      {/* Create Match Modal */}
      <CreateMatchModal
        isOpen={isCreateModalOpen}
        teams={teams}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={async (data) => {
          try {
            const newMatch = await createMatch(data)
            setMatches([...matches, newMatch])
            setIsCreateModalOpen(false)
          } catch (error: any) {
            console.error('Error creating match:', error)
            throw error
          }
        }}
      />
    </div>
  )
}

export default Dashboard
