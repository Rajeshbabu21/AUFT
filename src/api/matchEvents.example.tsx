/**
 * Example: How to call the match events API from your admin frontend
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Update with your backend URL

interface Event {
  team_id: string;
  player_name: string;
  event_minute: number;
  event_type: 'goal' | 'yellow_card' | 'red_card' | 'substitution';
  is_yellow: number;
  is_red: number;
}

interface MatchDetailsRequest {
  match_id: string;
  home_score: number;
  away_score: number;
  events: Event[];
}

/**
 * Create or update match result with events
 */
export const createMatchDetails = async (data: MatchDetailsRequest) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/update_match-details`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating match details:', error);
    throw error;
  }
};

/**
 * Get match details for a specific match
 */
export const getMatchDetails = async (matchId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/match-details/${matchId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching match details:', error);
    throw error;
  }
};

/**
 * Delete match result
 */
export const deleteMatchResult = async (matchId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/match-details/${matchId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting match result:', error);
    throw error;
  }
};

/**
 * Get all teams (needed to get team IDs for events)
 */
export const getTeams = async () => {
  try {
    const response = await axios.get(`/getteams`);
    return response.data;
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

// ============================================
// USAGE EXAMPLE IN REACT COMPONENT
// ============================================

/**
 * Example component showing how to submit match results
 */
export const ExampleUsage = () => {
  const handleSubmitMatchResult = async () => {
    try {
      // 1. Get teams first to find team IDs
      const teams = await getTeams();
      const soccerHooligans = teams.find((t: any) => t.team_name === 'Soccer Hooligans');
      const netbusters = teams.find((t: any) => t.team_name === 'Netbusters');

      // 2. Prepare match data
      const matchData: MatchDetailsRequest = {
        match_id: '071facdf-46c0-497d-bcc6-b00ce0df3edd',
        home_score: 1,
        away_score: 2,
        events: [
          {
            team_id: soccerHooligans.id,
            player_name: 'Diwakar',
            event_minute: 21,
            event_type: 'goal',
            is_yellow: 0,
            is_red: 0,
          },
          {
            team_id: netbusters.id,
            player_name: 'Player A',
            event_minute: 45,
            event_type: 'goal',
            is_yellow: 0,
            is_red: 0,
          },
          {
            team_id: netbusters.id,
            player_name: 'Player B',
            event_minute: 78,
            event_type: 'goal',
            is_yellow: 0,
            is_red: 0,
          },
          {
            team_id: soccerHooligans.id,
            player_name: 'Player C',
            event_minute: 35,
            event_type: 'yellow_card',
            is_yellow: 1,
            is_red: 0,
          },
        ],
      };

      // 3. Submit to API
      const result = await createMatchDetails(matchData);
      console.log('Success:', result);
      alert(`Match details saved! ${result.events_count} events recorded.`);
      
    } catch (error) {
      console.error('Failed to submit match result:', error);
      alert('Failed to save match details. Check console for details.');
    }
  };

  return (
    <button onClick={handleSubmitMatchResult}>
      Submit Match Result
    </button>
  );
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Create a goal event
 */
export const createGoalEvent = (teamId: string, playerName: string, minute: number): Event => ({
  team_id: teamId,
  player_name: playerName,
  event_minute: minute,
  event_type: 'goal',
  is_yellow: 0,
  is_red: 0,
});

/**
 * Create a yellow card event
 */
export const createYellowCardEvent = (teamId: string, playerName: string, minute: number): Event => ({
  team_id: teamId,
  player_name: playerName,
  event_minute: minute,
  event_type: 'yellow_card',
  is_yellow: 1,
  is_red: 0,
});

/**
 * Create a red card event
 */
export const createRedCardEvent = (teamId: string, playerName: string, minute: number): Event => ({
  team_id: teamId,
  player_name: playerName,
  event_minute: minute,
  event_type: 'red_card',
  is_yellow: 0,
  is_red: 1,
});

// ============================================
// REACT HOOK EXAMPLE
// ============================================

import { useState } from 'react';

export const useMatchEvents = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitMatchResult = async (matchData: MatchDetailsRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createMatchDetails(matchData);
      setLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to submit match result');
      setLoading(false);
      throw err;
    }
  };

  const fetchMatchDetails = async (matchId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getMatchDetails(matchId);
      setLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch match details');
      setLoading(false);
      throw err;
    }
  };

  return {
    loading,
    error,
    submitMatchResult,
    fetchMatchDetails,
  };
};
