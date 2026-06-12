import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { useAuth } from '../hooks/useAuth.js';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Layout title="Dashboard">
      <div className="dashboard-grid">
        <section className="card">
          <h2>Welcome, {user?.username}</h2>
          <p className="text-muted">You are successfully authenticated.</p>
          <dl className="info-list">
            <div>
              <dt>Email</dt>
              <dd>{user?.email}</dd>
            </div>
            <div>
              <dt>User ID</dt>
              <dd>{user?.id}</dd>
            </div>
            <div>
              <dt>Member Since</dt>
              <dd>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</dd>
            </div>
          </dl>
        </section>

        <section className="card">
          <h2>Quick Actions</h2>
          <div className="action-links">
            <Link to="/profile" className="action-link">
              View Profile
            </Link>
            <Link to="/settings" className="action-link">
              Account Settings
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
