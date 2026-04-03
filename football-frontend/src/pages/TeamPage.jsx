import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosClient';

const TeamPage = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await api.get('/api/Team');
        const data = Array.isArray(response.data) ? response.data : [];
        const normalized = data.map((t) => ({
          id: t.id ?? t.Id,
          name: t.name ?? t.Name,
          points: t.points ?? t.Points,
          won: t.won ?? t.Won,
          drawn: t.drawn ?? t.Drawn,
          lost: t.lost ?? t.Lost,
        }));
        normalized.sort((a, b) => b.points - a.points);
        setTeams(normalized);
      } catch (err) {
        setError('Failed to load teams.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleRowClick = (id) => {
    navigate(`/teams/${id}`);
  };

  return (
    <div className="page">
      <h1>League Table</h1>
      <p className="page-subtitle">
        Click on a team to view full details and squad list.
      </p>

      {loading && <p>Loading teams...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Team</th>
                <th>W / D / L</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, index) => (
                <tr
                  key={team.id}
                  className="table-row--clickable"
                  onClick={() => handleRowClick(team.id)}
                >
                  <td>{index + 1}</td>
                  <td>{team.name}</td>
                  <td>
                    {team.won} / {team.drawn} / {team.lost}
                  </td>
                  <td>{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeamPage;