import Layout from '../components/Layout.jsx';
import { useAuth } from '../hooks/useAuth.js';

const Settings = () => {
  const { user } = useAuth();

  return (
    <Layout title="Settings">
      <div className="card">
        <h2>Account Settings</h2>
        <p className="text-muted">Manage your account preferences and security.</p>

        <dl className="info-list settings-list">
          <div>
            <dt>Username</dt>
            <dd>{user?.username}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{user?.email}</dd>
          </div>
          <div>
            <dt>Authentication</dt>
            <dd>JWT Bearer Token</dd>
          </div>
          <div>
            <dt>Session</dt>
            <dd>Persistent (stored securely in browser)</dd>
          </div>
        </dl>

        <div className="settings-note">
          <p>
            Password changes and advanced security settings can be extended here as your
            application grows.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
