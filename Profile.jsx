import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { api } from '../services/api.js';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.getProfile();
        setProfile(response.data.profile);
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Layout title="Profile">
        <LoadingSpinner message="Loading profile..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Profile">
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Profile">
      <div className="card profile-card">
        <dl className="info-list">
          <div>
            <dt>Username</dt>
            <dd>{profile?.username}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{profile?.email}</dd>
          </div>
          <div>
            <dt>User ID</dt>
            <dd>{profile?.id}</dd>
          </div>
          <div>
            <dt>Member Since</dt>
            <dd>
              {profile?.profile?.memberSince
                ? new Date(profile.profile.memberSince).toLocaleString()
                : '—'}
            </dd>
          </div>
          <div>
            <dt>Last Updated</dt>
            <dd>
              {profile?.profile?.lastUpdated
                ? new Date(profile.profile.lastUpdated).toLocaleString()
                : '—'}
            </dd>
          </div>
        </dl>
      </div>
    </Layout>
  );
};

export default Profile;
