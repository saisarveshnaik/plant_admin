import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface VersionData {
  _id: string;
  android_version_code: string;
  android_update_url: string;
  android_test_version_code: string;
  is_test_android: boolean;
  ios_version_code: string;
  ios_update_url: string;
  ios_test_version_code: string;
  is_test_ios: boolean;
}

const GameVersion: React.FC = () => {
  const [version, setVersion] = useState<VersionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);

  const token = localStorage.getItem('authToken');

  // GET API call to fetch version data.
  const getVersion = async () => {
    try {
      const response = await axios.get(
        'http://ec2-34-230-39-240.compute-1.amazonaws.com/api/admin/version/get-version',
        {
          headers: { token: token || '' },
        }
      );
      if (response.data.status) {
        setVersion(response.data.data);
        toast.success('Fetched version successfully!');
      } else {
        toast.error('Failed to fetch version');
      }
    } catch (error) {
      toast.error('Error fetching version');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch version data on component mount.
  useEffect(() => {
    getVersion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle input changes for text or checkbox fields.
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!version) return;
    const { name, value, type, checked } = e.target;
    setVersion({
      ...version,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle form submission to update version details.
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!version) return;

    setUpdating(true);

    const updateUrl = `http://ec2-34-230-39-240.compute-1.amazonaws.com/api/admin/version/update-version/${version._id}`;
    // Only include the relevant fields in the payload.
    const payload = {
      android_version_code: version.android_version_code,
      android_update_url: version.android_update_url,
      android_test_version_code: version.android_test_version_code,
      is_test_android: version.is_test_android,
      ios_version_code: version.ios_version_code,
      ios_update_url: version.ios_update_url,
      ios_test_version_code: version.ios_test_version_code,
      is_test_ios: version.is_test_ios,
    };

    try {
      const response = await axios.post(updateUrl, payload, {
        headers: { token: token || '' },
      });
      if (response.data.status) {
        toast.success('Version updated successfully!');
        // Re-fetch version data after a successful update.
        getVersion();
      } else {
        toast.error('Failed to update version');
      }
    } catch (error) {
      toast.error('Error updating version');
      console.error(error);
    } finally {
      // Show the "Updating..." text for 1.5 seconds before resetting.
      setTimeout(() => {
        setUpdating(false);
      }, 1500);
    }
  };

  return (
    <div className="cards-outer">
      <ToastContainer />
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-4">Game Version</h5>
          {loading ? (
            <p>Loading...</p>
          ) : version ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="android_version_code" className="form-label">
                  Android Version Code
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="android_version_code"
                  name="android_version_code"
                  value={version.android_version_code}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="android_update_url" className="form-label">
                  Android Update URL
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="android_update_url"
                  name="android_update_url"
                  value={version.android_update_url}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="android_test_version_code" className="form-label">
                  Android Test Version Code
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="android_test_version_code"
                  name="android_test_version_code"
                  value={version.android_test_version_code}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="is_test_android"
                  name="is_test_android"
                  checked={version.is_test_android}
                  onChange={handleInputChange}
                />
                <label className="form-check-label" htmlFor="is_test_android">
                  Is Test Android
                </label>
              </div>
              <div className="mb-3">
                <label htmlFor="ios_version_code" className="form-label">
                  iOS Version Code
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="ios_version_code"
                  name="ios_version_code"
                  value={version.ios_version_code}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="ios_update_url" className="form-label">
                  iOS Update URL
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="ios_update_url"
                  name="ios_update_url"
                  value={version.ios_update_url}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="ios_test_version_code" className="form-label">
                  iOS Test Version Code
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="ios_test_version_code"
                  name="ios_test_version_code"
                  value={version.ios_test_version_code}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="is_test_ios"
                  name="is_test_ios"
                  checked={version.is_test_ios}
                  onChange={handleInputChange}
                />
                <label className="form-check-label" htmlFor="is_test_ios">
                  Is Test iOS
                </label>
              </div>
              <button type="submit" className="btn btn-primary" disabled={updating}>
                {updating ? 'Updating...' : 'Update Version'}
              </button>
            </form>
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameVersion;
