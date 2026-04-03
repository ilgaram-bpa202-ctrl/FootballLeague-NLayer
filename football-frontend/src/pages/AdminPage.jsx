import { useEffect, useState } from 'react';
import api from '../api/axiosClient';

const SECTIONS = ['Matches', 'Teams', 'News', 'Products', 'Players'];

const emptyTeam = {
  id: '',
  name: '',
  logoUrl: '',
  managerId: '',
  points: 0,
  won: 0,
  drawn: 0,
  lost: 0,
  matchesPlayed: 0,
  goalsFor: 0,
  goalsAgainst: 0,
};

const emptyPlayer = {
  id: '',
  name: '',
  position: '',
  jerseyNumber: 0,
  teamId: 0,
};

const emptyMatch = {
  id: '',
  homeTeamId: 0,
  awayTeamId: 0,
  homeScore: 0,
  awayScore: 0,
  matchDate: '',
};

const emptyNews = {
  id: '',
  title: '',
  content: '',
  imageUrl: '',
};

const emptyProduct = {
  id: '',
  name: '',
  description: '',
  price: 0,
  imageUrl: '',
  stockQuantity: 0,
};

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState('Products');

  const [products, setProducts] = useState([]);
  const [news, setNews] = useState([]);
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Generic modal state
  const [modal, setModal] = useState({
    isOpen: false,
    entity: null, // 'Products' | 'News' | 'Matches' | 'Teams' | 'Players'
    mode: 'create', // 'create' | 'edit'
    data: null,
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [productsRes, newsRes, matchesRes, teamsRes, playersRes] =
          await Promise.allSettled([
            api.get('/api/Product'),
            api.get('/api/News'),
            api.get('/api/Match'),
            api.get('/api/Team'),
            api.get('/api/Player'),
          ]);

        if (productsRes.status === 'fulfilled') {
          setProducts(
            Array.isArray(productsRes.value.data) ? productsRes.value.data : []
          );
        }
        if (newsRes.status === 'fulfilled') {
          setNews(Array.isArray(newsRes.value.data) ? newsRes.value.data : []);
        }
        if (matchesRes.status === 'fulfilled') {
          setMatches(
            Array.isArray(matchesRes.value.data) ? matchesRes.value.data : []
          );
        }
        if (teamsRes.status === 'fulfilled') {
          setTeams(Array.isArray(teamsRes.value.data) ? teamsRes.value.data : []);
        }
        if (playersRes.status === 'fulfilled') {
          setPlayers(
            Array.isArray(playersRes.value.data) ? playersRes.value.data : []
          );
        }
      } catch {
        setError(
          'Failed to load admin data. Ensure you are logged in with an Admin role.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  /* Refresh helpers */

  const refreshProducts = async () => {
    const res = await api.get('/api/Product');
    setProducts(Array.isArray(res.data) ? res.data : []);
  };

  const refreshNews = async () => {
    const res = await api.get('/api/News');
    setNews(Array.isArray(res.data) ? res.data : []);
  };

  const refreshMatches = async () => {
    const res = await api.get('/api/Match');
    setMatches(Array.isArray(res.data) ? res.data : []);
  };

  const refreshTeams = async () => {
    const res = await api.get('/api/Team');
    setTeams(Array.isArray(res.data) ? res.data : []);
  };

  const refreshPlayers = async () => {
    const res = await api.get('/api/Player');
    setPlayers(Array.isArray(res.data) ? res.data : []);
  };

  /* Modal helpers */

  const openCreateModal = (entity) => {
    let base;
    switch (entity) {
      case 'Products':
        base = emptyProduct;
        break;
      case 'News':
        base = emptyNews;
        break;
      case 'Matches':
        base = emptyMatch;
        break;
      case 'Teams':
        base = emptyTeam;
        break;
      case 'Players':
        base = emptyPlayer;
        break;
      default:
        base = {};
    }
    setModal({
      isOpen: true,
      entity,
      mode: 'create',
      data: { ...base },
    });
  };

  const openEditModal = (entity, item) => {
    // Normalize incoming item into our flat structure
    let normalized;
    switch (entity) {
      case 'Products':
        normalized = {
          id: item.id ?? item.Id,
          name: item.name ?? item.Name ?? '',
          description: item.description ?? item.Description ?? '',
          price: item.price ?? item.Price ?? 0,
          imageUrl: item.imageUrl ?? item.ImageUrl ?? '',
          stockQuantity: item.stockQuantity ?? item.StockQuantity ?? 0,
        };
        break;
      case 'News':
        normalized = {
          id: item.id ?? item.Id,
          title: item.title ?? item.Title ?? '',
          content: item.content ?? item.Content ?? '',
          imageUrl: item.imageUrl ?? item.ImageUrl ?? '',
        };
        break;
      case 'Matches':
        normalized = {
          id: item.id ?? item.Id,
          homeTeamId: item.homeTeamId ?? item.HomeTeamId ?? 0,
          awayTeamId: item.awayTeamId ?? item.AwayTeamId ?? 0,
          homeScore: item.homeScore ?? item.HomeScore ?? 0,
          awayScore: item.awayScore ?? item.AwayScore ?? 0,
          matchDate: item.matchDate ?? item.MatchDate ?? '',
        };
        break;
      case 'Teams':
        normalized = {
          id: item.id ?? item.Id,
          name: item.name ?? item.Name ?? '',
          logoUrl: item.logoUrl ?? item.LogoUrl ?? '',
          managerId: item.managerId ?? item.ManagerId ?? '',
          points: item.points ?? item.Points ?? 0,
          won: item.won ?? item.Won ?? 0,
          drawn: item.drawn ?? item.Drawn ?? 0,
          lost: item.lost ?? item.Lost ?? 0,
          matchesPlayed: item.matchesPlayed ?? item.MatchesPlayed ?? 0,
          goalsFor: item.goalsFor ?? item.GoalsFor ?? 0,
          goalsAgainst: item.goalsAgainst ?? item.GoalsAgainst ?? 0,
        };
        break;
      case 'Players':
        normalized = {
          id: item.id ?? item.Id,
          name: item.name ?? item.Name ?? '',
          position: item.position ?? item.Position ?? '',
          jerseyNumber: item.jerseyNumber ?? item.JerseyNumber ?? 0,
          teamId: item.teamId ?? item.TeamId ?? 0,
        };
        break;
      default:
        normalized = {};
    }
    setModal({
      isOpen: true,
      entity,
      mode: 'edit',
      data: normalized,
    });
  };

  const closeModal = () => {
    setModal({ isOpen: false, entity: null, mode: 'create', data: null });
  };

  const updateModalField = (field, value) => {
    setModal((prev) => ({
      ...prev,
      data: { ...prev.data, [field]: value },
    }));
  };

  /* CRUD submit handlers */

  const handleSubmitModal = async (e) => {
    e.preventDefault();
    if (!modal.entity || !modal.data) return;
    setError('');

    try {
      if (modal.entity === 'Products') {
        if (modal.mode === 'create') {
          await api.post('/api/Product', {
            name: modal.data.name,
            description: modal.data.description,
            price: Number(modal.data.price),
            imageUrl: modal.data.imageUrl,
            stockQuantity: Number(modal.data.stockQuantity),
          });
        } else {
          await api.put('/api/Product', {
            id: modal.data.id,
            name: modal.data.name,
            description: modal.data.description,
            price: Number(modal.data.price),
            imageUrl: modal.data.imageUrl,
            stockQuantity: Number(modal.data.stockQuantity),
          });
        }
        await refreshProducts();
      }

      if (modal.entity === 'News') {
        if (modal.mode === 'create') {
          await api.post('/api/News', {
            title: modal.data.title,
            content: modal.data.content,
            imageUrl: modal.data.imageUrl,
          });
        } else {
          await api.put('/api/News', {
            id: modal.data.id,
            title: modal.data.title,
            content: modal.data.content,
            imageUrl: modal.data.imageUrl,
          });
        }
        await refreshNews();
      }

      if (modal.entity === 'Matches') {
        if (modal.mode === 'create') {
          await api.post('/api/Match', {
            homeTeamId: Number(modal.data.homeTeamId),
            awayTeamId: Number(modal.data.awayTeamId),
            homeScore: Number(modal.data.homeScore),
            awayScore: Number(modal.data.awayScore),
            matchDate: modal.data.matchDate,
          });
        } else {
          await api.put('/api/Match', {
            id: modal.data.id,
            homeTeamId: Number(modal.data.homeTeamId),
            awayTeamId: Number(modal.data.awayTeamId),
            homeScore: Number(modal.data.homeScore),
            awayScore: Number(modal.data.awayScore),
            matchDate: modal.data.matchDate,
          });
        }
        await refreshMatches();
      }

      if (modal.entity === 'Teams') {
        if (modal.mode === 'create') {
          await api.post('/api/Team', {
            name: modal.data.name,
            logoUrl: modal.data.logoUrl,
            managerId: modal.data.managerId,
          });
        } else {
          await api.put('/api/Team', {
            id: modal.data.id,
            name: modal.data.name,
            logoUrl: modal.data.logoUrl,
            managerId: modal.data.managerId,
            points: Number(modal.data.points),
            won: Number(modal.data.won),
            drawn: Number(modal.data.drawn),
            lost: Number(modal.data.lost),
            matchesPlayed: Number(modal.data.matchesPlayed),
            goalsFor: Number(modal.data.goalsFor),
            goalsAgainst: Number(modal.data.goalsAgainst),
          });
        }
        await refreshTeams();
      }

      if (modal.entity === 'Players') {
        if (modal.mode === 'create') {
          await api.post('/api/Player', {
            name: modal.data.name,
            position: modal.data.position,
            jerseyNumber: Number(modal.data.jerseyNumber),
            teamId: Number(modal.data.teamId),
          });
        } else {
          await api.put('/api/Player', {
            id: modal.data.id,
            name: modal.data.name,
            position: modal.data.position,
            jerseyNumber: Number(modal.data.jerseyNumber),
            teamId: Number(modal.data.teamId),
          });
        }
        await refreshPlayers();
      }

      // Close modal and refresh UI
      closeModal();
    } catch (err) {
      setError('Operation failed. Check your API endpoints and try again.');
    }
  };

  const handleDelete = async (entity, id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    setError('');
    try {
      if (entity === 'Products') {
        await api.delete(`/api/Product/${id}`);
        await refreshProducts();
      }
      if (entity === 'News') {
        await api.delete(`/api/News/${id}`);
        await refreshNews();
      }
      if (entity === 'Matches') {
        await api.delete(`/api/Match/${id}`);
        await refreshMatches();
      }
      if (entity === 'Teams') {
        await api.delete(`/api/Team/${id}`);
        await refreshTeams();
      }
      if (entity === 'Players') {
        await api.delete(`/api/Player/${id}`);
        await refreshPlayers();
      }
    } catch {
      setError('Delete failed. Check backend permissions and try again.');
    }
  };

  /* Render helpers */

  const renderSectionTabs = () => (
    <div
      style={{
        marginBottom: '1rem',
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
      }}
    >
      {SECTIONS.map((sec) => (
        <button
          key={sec}
          type="button"
          className={sec === activeSection ? 'button-primary' : 'button-secondary'}
          onClick={() => setActiveSection(sec)}
        >
          {sec}
        </button>
      ))}
    </div>
  );

  const renderProducts = () => (
    <section className="admin-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <h2>Products</h2>
        <button
          type="button"
          className="button-primary"
          onClick={() => openCreateModal('Products')}
        >
          Add New Product
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const id = p.id ?? p.Id;
              const name = p.name ?? p.Name;
              const price = p.price ?? p.Price;
              const stock = p.stockQuantity ?? p.StockQuantity;

              return (
                <tr key={id}>
                  <td>{name}</td>
                  <td>{price}</td>
                  <td>{stock}</td>
                  <td>
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() => openEditModal('Products', p)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() => handleDelete('Products', id)}
                      style={{ marginLeft: '0.4rem' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={4}>No products loaded.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderNews = () => (
    <section className="admin-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <h2>News</h2>
        <button
          type="button"
          className="button-primary"
          onClick={() => openCreateModal('News')}
        >
          Add New News
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Created</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {news.map((n) => {
              const id = n.id ?? n.Id;
              const title = n.title ?? n.Title;
              const created = n.createdDate ?? n.CreatedDate ?? null;

              return (
                <tr key={id}>
                  <td>{title}</td>
                  <td>{created ? new Date(created).toLocaleDateString() : '-'}</td>
                  <td>
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() => openEditModal('News', n)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() => handleDelete('News', id)}
                      style={{ marginLeft: '0.4rem' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {news.length === 0 && (
              <tr>
                <td colSpan={3}>No news loaded.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderMatches = () => (
    <section className="admin-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <h2>Matches</h2>
        <button
          type="button"
          className="button-primary"
          onClick={() => openCreateModal('Matches')}
        >
          Add New Match
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Fixture</th>
              <th>Score</th>
              <th>Date</th>
              <th />
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
                <tr key={id}>
                  <td>
                    Team {homeTeamId} vs Team {awayTeamId}
                  </td>
                  <td>
                    {homeScore} : {awayScore}
                  </td>
                  <td>
                    {matchDate ? new Date(matchDate).toLocaleString() : '-'}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() => openEditModal('Matches', m)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() => handleDelete('Matches', id)}
                      style={{ marginLeft: '0.4rem' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {matches.length === 0 && (
              <tr>
                <td colSpan={4}>No matches loaded.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderTeams = () => (
    <section className="admin-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <h2>Teams</h2>
        <button
          type="button"
          className="button-primary"
          onClick={() => openCreateModal('Teams')}
        >
          Add New Team
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Team</th>
              <th>Points</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {teams.map((t) => {
              const id = t.id ?? t.Id;
              const name = t.name ?? t.Name;
              const points = t.points ?? t.Points;

              return (
                <tr key={id}>
                  <td>{name}</td>
                  <td>{points}</td>
                  <td>
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() => openEditModal('Teams', t)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() => handleDelete('Teams', id)}
                      style={{ marginLeft: '0.4rem' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {teams.length === 0 && (
              <tr>
                <td colSpan={3}>No teams loaded.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderPlayers = () => (
    <section className="admin-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <h2>Players</h2>
        <button
          type="button"
          className="button-primary"
          onClick={() => openCreateModal('Players')}
        >
          Add New Player
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th>Position</th>
              <th>TeamId</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {players.map((p) => {
              const id = p.id ?? p.Id;
              const name = p.name ?? p.Name;
              const position = p.position ?? p.Position;
              const jerseyNumber = p.jerseyNumber ?? p.JerseyNumber;
              const teamId = p.teamId ?? p.TeamId;

              return (
                <tr key={id}>
                  <td>{jerseyNumber}</td>
                  <td>{name}</td>
                  <td>{position}</td>
                  <td>{teamId}</td>
                  <td>
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() => openEditModal('Players', p)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() => handleDelete('Players', id)}
                      style={{ marginLeft: '0.4rem' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {players.length === 0 && (
              <tr>
                <td colSpan={5}>No players loaded.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderModalFormFields = () => {
    if (!modal.entity || !modal.data) return null;

    const d = modal.data;

    switch (modal.entity) {
      case 'Products':
        return (
          <>
            <div className="form-group">
              <label>Name</label>
              <input
                value={d.name}
                onChange={(e) => updateModalField('name', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                value={d.description}
                onChange={(e) => updateModalField('description', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                value={d.price}
                onChange={(e) => updateModalField('price', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Stock Quantity</label>
              <input
                type="number"
                value={d.stockQuantity}
                onChange={(e) => updateModalField('stockQuantity', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input
                value={d.imageUrl}
                onChange={(e) => updateModalField('imageUrl', e.target.value)}
              />
            </div>
          </>
        );

      case 'News':
        return (
          <>
            <div className="form-group">
              <label>Title</label>
              <input
                value={d.title}
                onChange={(e) => updateModalField('title', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea
                rows={4}
                value={d.content}
                onChange={(e) => updateModalField('content', e.target.value)}
                required
                className="modal-textarea"
              />
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input
                value={d.imageUrl}
                onChange={(e) => updateModalField('imageUrl', e.target.value)}
              />
            </div>
          </>
        );

      case 'Matches':
        return (
          <>
            <div className="form-group">
              <label>Home Team Id</label>
              <input
                type="number"
                value={d.homeTeamId}
                onChange={(e) => updateModalField('homeTeamId', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Away Team Id</label>
              <input
                type="number"
                value={d.awayTeamId}
                onChange={(e) => updateModalField('awayTeamId', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Home Score</label>
              <input
                type="number"
                value={d.homeScore}
                onChange={(e) => updateModalField('homeScore', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Away Score</label>
              <input
                type="number"
                value={d.awayScore}
                onChange={(e) => updateModalField('awayScore', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Match Date (ISO)</label>
              <input
                type="datetime-local"
                value={d.matchDate}
                onChange={(e) => updateModalField('matchDate', e.target.value)}
              />
            </div>
          </>
        );

      case 'Teams':
        return (
          <>
            <div className="form-group">
              <label>Name</label>
              <input
                value={d.name}
                onChange={(e) => updateModalField('name', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Logo URL</label>
              <input
                value={d.logoUrl}
                onChange={(e) => updateModalField('logoUrl', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Manager Id</label>
              <input
                value={d.managerId}
                onChange={(e) => updateModalField('managerId', e.target.value)}
              />
            </div>
            {modal.mode === 'edit' && (
              <>
                <div className="form-group">
                  <label>Points</label>
                  <input
                    type="number"
                    value={d.points}
                    onChange={(e) => updateModalField('points', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Won</label>
                  <input
                    type="number"
                    value={d.won}
                    onChange={(e) => updateModalField('won', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Drawn</label>
                  <input
                    type="number"
                    value={d.drawn}
                    onChange={(e) => updateModalField('drawn', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Lost</label>
                  <input
                    type="number"
                    value={d.lost}
                    onChange={(e) => updateModalField('lost', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Matches Played</label>
                  <input
                    type="number"
                    value={d.matchesPlayed}
                    onChange={(e) =>
                      updateModalField('matchesPlayed', e.target.value)
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Goals For</label>
                  <input
                    type="number"
                    value={d.goalsFor}
                    onChange={(e) => updateModalField('goalsFor', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Goals Against</label>
                  <input
                    type="number"
                    value={d.goalsAgainst}
                    onChange={(e) =>
                      updateModalField('goalsAgainst', e.target.value)
                    }
                  />
                </div>
              </>
            )}
          </>
        );

      case 'Players':
        return (
          <>
            <div className="form-group">
              <label>Name</label>
              <input
                value={d.name}
                onChange={(e) => updateModalField('name', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Position</label>
              <input
                value={d.position}
                onChange={(e) => updateModalField('position', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Jersey Number</label>
              <input
                type="number"
                value={d.jerseyNumber}
                onChange={(e) =>
                  updateModalField('jerseyNumber', e.target.value)
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Team Id</label>
              <input
                type="number"
                value={d.teamId}
                onChange={(e) => updateModalField('teamId', e.target.value)}
                required
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const renderModal = () => {
    if (!modal.isOpen || !modal.entity) return null;

    const title =
      modal.mode === 'create'
        ? `Add New ${modal.entity.slice(0, -1)}`
        : `Edit ${modal.entity.slice(0, -1)}`;

    return (
      <div className="modal-backdrop">
        <div className="modal">
          <div className="modal-header">
            <h3>{title}</h3>
            <button
              type="button"
              className="modal-close"
              onClick={closeModal}
            >
              ×
            </button>
          </div>
          <form onSubmit={handleSubmitModal} className="modal-form">
            {renderModalFormFields()}
            <div className="modal-actions">
              <button type="submit" className="button-primary">
                {modal.mode === 'create' ? 'Create' : 'Save Changes'}
              </button>
              <button
                type="button"
                className="button-secondary"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="page">
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Admin Dashboard</h1>
      <p className="page-subtitle">
        Manage league data via your secured API. Use the tabs below to switch
        between sections.
      </p>
      {error && <p className="error-text">{error}</p>}

      {renderSectionTabs()}

      {activeSection === 'Products' && renderProducts()}
      {activeSection === 'News' && renderNews()}
      {activeSection === 'Matches' && renderMatches()}
      {activeSection === 'Teams' && renderTeams()}
      {activeSection === 'Players' && renderPlayers()}

      {renderModal()}
    </div>
  );
};

export default AdminPage;