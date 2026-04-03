import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosClient';

const MatchPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await api.get('/api/Match');
        const data = response.data || [];
        setMatches(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError('You must be logged in to view matches.');
        } else {
          setError('Failed to load matches.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handleClick = (id) => {
    navigate(`/matches/${id}`);
  };

  if (loading) {
    return (
      <div className="page">
        <p>Loading matches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <p className="error-text">{error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Matches</h1>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Fixture</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((m) => {
              const id = m.id ?? m.Id;
              const homeTeamId = m.homeTeamId ?? m.HomeTeamId;
              const awayTeamId = m.awayTeamId ?? m.AwayTeamId;
              const homeScore = m.homeScore ?? m.HomeScore;
              const awayScore = m.awayScore ?? m.AwayScore;
              const matchDate = m.matchDate ?? m.MatchDate;

              return (
                <tr
                  key={id}
                  className="table-row--clickable"
                  onClick={() => handleClick(id)}
                >
                  <td>
                    Team {homeTeamId} vs Team {awayTeamId}
                  </td>
                  <td>
                    {homeScore} : {awayScore}
                  </td>
                  <td>
                    {matchDate ? new Date(matchDate).toLocaleString() : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MatchPage;