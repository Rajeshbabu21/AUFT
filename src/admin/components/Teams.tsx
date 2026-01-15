import React from 'react';
import { Team } from '../../@types/Team';
import './teams.css';

interface TeamsProps {
    teams: Team[];
    onEdit: (team: Team) => void;
}
const Teams: React.FC<TeamsProps> = ({ teams, onEdit }) => {
    return (
        <div className="teams-container">
            <h2 className="teams-title">Teams</h2>
            <table className="teams-table">
                <thead>
                    <tr>    
                        {/* <th>ID</th> */}
                        <th>Team Code</th>
                        <th>Team Name</th>
                        {/* <th>Badge Image ID</th> */}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {teams.map((team) => (
                        <tr key={team.id}>
                            <td>{team.team_code}</td>
                            <td>{team.team_name}</td>
                            <td className="actions-cell">
                                <button className="btn-update" onClick={() => onEdit(team)}>Update</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default Teams;