import React, { useState, useEffect } from 'react'
import { Matches } from '../@types/Matches'
import { PointsTableItem } from '../@types/Points'
import { MatchResponse } from '../@types/Results'
import MatchSchedule from './components/MatchSchedule'
import MatchResults from './components/MatchResults'
import PointsTableComponent from './components/PointsTable'
import UpdatePointsModal from './components/UpdatePointsModal'
import UpdateMatchModal from './components/UpdateMatchModal'
import CreateMatchModal from './components/CreateMatchModal'
import { getPointsTable, updatePointsTable } from '../api/points'
import { getMatches, updateMatch, deleteMatch, createMatch, getTeams } from '../api/matches'
import './dashboard.css'

interface Team {
  id: string
  team_name: string
  team_code: string
}

const Dashboard: React.FC = () => {
  const [matches, setMatches] = useState<Matches[]>([])
  const [pointsTable, setPointsTable] = useState<PointsTableItem[]>([])
  const [matchResults, setMatchResults] = useState<MatchResponse[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [activeMenu, setActiveMenu] = useState<'schedule' | 'points' | 'results'>('schedule')
  const [selectedTeam, setSelectedTeam] = useState<PointsTableItem | null>(null)
  const [selectedMatch, setSelectedMatch] = useState<Matches | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

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
        const teamsData = await getTeams()
        console.log('Teams data received:', teamsData)
        setTeams(teamsData)

        // Fetch points table from backend
        const pointsData = await getPointsTable()
        console.log('Points data received:', pointsData)
        setPointsTable(pointsData)

        // Mock data for match results - replace with backend API call when ready
        const mockResults: MatchResponse[] = [
          {
            match_id: '1',
            match_week: 1,
            home_team: {
              name: 'Team A',
              image: '/images/country/flag-1.png'
            },
            away_team: {
              name: 'Team B',
              image: '/images/country/flag-2.png'
            },
            score: {
              home: 2,
              away: 1
            },
            events: [
              {
                minute: 15,
                player: 'Player 1',
                type: 'goal',
                team: 'Team A',
                is_yellow: 0,
                is_red: 0
              },
              {
                minute: 35,
                player: 'Player 2',
                type: 'goal',
                team: 'Team B',
                is_yellow: 0,
                is_red: 0
              },
              {
                minute: 67,
                player: 'Player 3',
                type: 'goal',
                team: 'Team A',
                is_yellow: 0,
                is_red: 0
              },
              {
                minute: 45,
                player: 'Player 4',
                type: 'yellow',
                team: 'Team B',
                is_yellow: 1,
                is_red: 0
              }
            ]
          },
          {
            match_id: '2',
            match_week: 1,
            home_team: {
              name: 'Team C',
              image: '/images/country/flag-3.png'
            },
            away_team: {
              name: 'Team D',
              image: '/images/country/flag-4.png'
            },
            score: {
              home: 1,
              away: 1
            },
            events: [
              {
                minute: 22,
                player: 'Player 5',
                type: 'goal',
                team: 'Team C',
                is_yellow: 0,
                is_red: 0
              },
              {
                minute: 58,
                player: 'Player 6',
                type: 'goal',
                team: 'Team D',
                is_yellow: 0,
                is_red: 0
              }
            ]
          },
          {
            match_id: '3',
            match_week: 2,
            home_team: {
              name: 'Team E',
              image: '/images/country/flag-5.png'
            },
            away_team: {
              name: 'Team F',
              image: '/images/country/flag-6.png'
            },
            score: {
              home: 3,
              away: 0
            },
            events: [
              {
                minute: 10,
                player: 'Player 7',
                type: 'goal',
                team: 'Team E',
                is_yellow: 0,
                is_red: 0
              },
              {
                minute: 32,
                player: 'Player 8',
                type: 'goal',
                team: 'Team E',
                is_yellow: 0,
                is_red: 0
              },
              {
                minute: 78,
                player: 'Player 9',
                type: 'goal',
                team: 'Team E',
                is_yellow: 0,
                is_red: 0
              },
              {
                minute: 55,
                player: 'Player 10',
                type: 'red',
                team: 'Team F',
                is_yellow: 0,
                is_red: 1
              }
            ]
          }
        ]

        setMatchResults(mockResults)
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
          <div className='navbar-center'>
            <div className='nav-search'>
              <input type='text' placeholder='Search matches...' />
            </div>
          </div>
          <div className='navbar-right'>
            <button className='nav-btn'>Notifications</button>
            <button className='nav-btn'>Settings</button>
            <div className='user-profile'>
              <img src='/images/user/user-default.png' alt='Admin' />
            </div>
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
            <MatchResults 
              matchResults={matchResults} 
              loading={loading}
              onEdit={(result) => {
                console.log('Edit result:', result)
                // TODO: Implement edit functionality
              }}
              onDelete={(resultId) => {
                console.log('Delete result:', resultId)
                // TODO: Implement delete functionality
              }}
              onAdd={() => {
                console.log('Add new result')
                // TODO: Implement add functionality
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
