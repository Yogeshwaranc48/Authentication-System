import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const Layout = ({ children, title }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-content">
          <Link to={isAuthenticated ? '/dashboard' : '/login'} className="brand">
            AuthSystem
          </Link>

          {isAuthenticated && (
            <nav className="nav-links">
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/profile">Profile</Link>
              <Link to="/settings">Settings</Link>
              <span className="nav-user">{user?.username}</span>
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </nav>
          )}
        </div>
      </header>

      <main className="app-main">
        {title && <h1 className="page-title">{title}</h1>}
        {children}
      </main>
    </div>
  );
};

export default Layout;
