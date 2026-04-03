import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axiosClient';

const MatchDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [match, setMatch] = useState(null);
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMatchAndTeams = async () => {
      try {
        const matchRes = await api.get(`/api/Match/${id}`);
        const m = matchRes.data;
        if (!m) {
          setError('Match not found.');
          return;
        }

        const homeTeamId = m.homeTeamId ?? m.HomeTeamId;
        const awayTeamId = m.awayTeamId ?? m.AwayTeamId;

        setMatch(m);

        // Fetch team details for clickable names/logos
        const [homeRes, awayRes] = await Promise.all([
          api.get(`/api/Team/${homeTeamId}`),
          api.get(`/api/Team/${awayTeamId}`),
        ]);

        setHomeTeam(homeRes.data);
        setAwayTeam(awayRes.data);
      } catch (err) {
        setError('Failed to load match details.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatchAndTeams();
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <p>Loading match...</p>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="page">
        <p className="error-text">{error || 'Match not found.'}</p>
      </div>
    );
  }

  const homeTeamId = match.homeTeamId ?? match.HomeTeamId;
  const awayTeamId = match.awayTeamId ?? match.AwayTeamId;
  const homeScore = match.homeScore ?? match.HomeScore;
  const awayScore = match.awayScore ?? match.AwayScore;
  const matchDate = match.matchDate ?? match.MatchDate;

  const getTeamName = (t, fallbackId) =>
    t ? t.name ?? t.Name ?? `Team ${fallbackId}` : `Team ${fallbackId}`;

  const getTeamLogo = (t) => (t ? t.logoUrl ?? t.LogoUrl : null);

  const handleTeamClick = (teamId) => {
    navigate(`/teams/${teamId}`);
  };

  return (
    <div className="page">
      <h1>Match Details</h1>
      <p className="page-subtitle">
        {matchDate ? new Date(matchDate).toLocaleString() : ''}
      </p>

      <div className="card">
        <div className="card-body" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          {/* Home team */}
          <div
            style={{ cursor: 'pointer', textAlign: 'center' }}
            onClick={() => handleTeamClick(homeTeamId)}
          >
            {getTeamLogo(homeTeam) && (
              <img
                src={getTeamLogo(homeTeam)}
                alt={getTeamName(homeTeam, homeTeamId)}
                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '999px', marginBottom: '0.5rem' }}
              />
            )}
            <div className="card-text">
              {getTeamName(homeTeam, homeTeamId)}
            </div>
          </div>

          {/* Score */}
          <div style={{ textAlign: 'center', minWidth: 80 }}>
            <div className="card-title" style={{ fontSize: '1.6rem' }}>
              {homeScore} : {awayScore}
            </div>
          </div>

          {/* Away team */}
          <div
            style={{ cursor: 'pointer', textAlign: 'center' }}
            onClick={() => handleTeamClick(awayTeamId)}
          >
            {getTeamLogo(awayTeam) && (
              <img
                src={getTeamLogo(awayTeam)}
                alt={getTeamName(awayTeam, awayTeamId)}
                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '999px', marginBottom: '0.5rem' }}
              />
            )}
            <div className="card-text">
              {getTeamName(awayTeam, awayTeamId)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetailPage;