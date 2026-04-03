import { useEffect, useState } from 'react';
import api from '../api/axiosClient';

const PlayerPage = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await api.get('/api/Player');
        const data = response.data || [];
        setPlayers(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to load players.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <p>Loading players...</p>
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
      <h1>Players</h1>
      <div className="card-grid">
        {players.map((player) => {
          const id = player.id ?? player.Id;
          const name = player.name ?? player.Name;
          const position = player.position ?? player.Position;
          const jerseyNumber = player.jerseyNumber ?? player.JerseyNumber;
          const teamId = player.teamId ?? player.TeamId;

          return (
            <article key={id} className="card">
              <div className="card-body">
                <h2 className="card-title">
                  #{jerseyNumber} {name}
                </h2>
                <p className="card-text">Position: {position}</p>
                <p className="card-meta">Team ID: {teamId}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerPage;