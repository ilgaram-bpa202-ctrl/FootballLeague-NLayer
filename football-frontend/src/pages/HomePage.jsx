const HomePage = () => {
    return (
      <div className="page">
        <h1>Welcome to Football League</h1>
        <p className="page-subtitle">
          Stay up to date with the latest news, fixtures, and shop for your favorite
          club’s merchandise.
        </p>
  
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <div className="card-body">
            <h2 className="card-title">Explore the League</h2>
            <p className="card-text">
              Use the navigation bar above to browse league standings, match results,
              news, and products. Log in to unlock admin features and manage your
              data directly from the dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default HomePage;