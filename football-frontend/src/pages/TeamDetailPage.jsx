import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosClient';

const TeamDetailPage = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await api.get(`/api/Team/${id}`);
        const t = response.data;
        if (!t) {
          setError('Team not found.');
          return;
        }
        setTeam({
          id: t.id ?? t.Id,
          name: t.name ?? t.Name,
          logoUrl: t.logoUrl ?? t.LogoUrl,
          points: t.points ?? t.Points,
          won: t.won ?? t.Won,
          drawn: t.drawn ?? t.Drawn,
          lost: t.lost ?? t.Lost,
          matchesPlayed: t.matchesPlayed ?? t.MatchesPlayed,
          goalsFor: t.goalsFor ?? t.GoalsFor,
          goalsAgainst: t.goalsAgainst ?? t.GoalsAgainst,
        });
      } catch (err) {
        setError('Failed to load team.');
      } finally {
        setLoadingTeam(false);
      }
    };

    const fetchPlayers = async () => {
      try {
        const response = await api.get('/api/Player');
        const data = Array.isArray(response.data) ? response.data : [];
        const filtered = data.filter((p) => {
          const teamId = p.teamId ?? p.TeamId;
          return String(teamId) === String(id);
        });
        setPlayers(
          filtered.map((p) => ({
            id: p.id ?? p.Id,
            name: p.name ?? p.Name,
            position: p.position ?? p.Position,
            jerseyNumber: p.jerseyNumber ?? p.JerseyNumber,
          }))
        );
      } catch (err) {
        // We still show team even if players fail
      } finally {
        setLoadingPlayers(false);
      }
    };

    fetchTeam();
    fetchPlayers();
  }, [id]);

  if (loadingTeam) {
    return (
      <div className="page">
        <p>Loading team details...</p>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="page">
        <p className="error-text">{error || 'Team not found.'}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>{team.name}</h1>

      <div className="card" style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
        {team.logoUrl && (
          <img src={team.logoUrl} alt={team.name} className="card-image" />
        )}
        <div className="card-body">
          <p className="card-text">
            Matches played: {team.matchesPlayed}
            <br />
            W / D / L: {team.won} / {team.drawn} / {team.lost}
          </p>
          <p className="card-meta">
            Points: {team.points} | Goals: {team.goalsFor} for, {team.goalsAgainst} against
          </p>
        </div>
      </div>

      <h2>Players</h2>
      {loadingPlayers && <p>Loading players...</p>}
      {!loadingPlayers && players.length === 0 && (
        <p className="page-subtitle">No players found for this team.</p>
      )}
      {!loadingPlayers && players.length > 0 && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Position</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p) => (
                <tr key={p.id}>
                  <td>{p.jerseyNumber}</td>
                  <td>{p.name}</td>
                  <td>{p.position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeamDetailPage;