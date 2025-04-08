import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface GameSettingData {
  _id: string;
  terms_condition: string;
  privacy_policy: string;
  whatsapp_url: string;
  instagram_url: string;
  facebook_url: string;
  telegram_url: string;
  isMaintence: boolean;
  maintence_txt: string;
}

const GameSettings: React.FC = () => {
  const [settings, setSettings] = useState<GameSettingData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);

  // Get the token from localStorage
  const token = localStorage.getItem('authToken');

  // GET API: Fetch game settings
  const getGameSettings = async () => {
    try {
      const response = await axios.get(
        'http://ec2-34-230-39-240.compute-1.amazonaws.com/api/admin/game-setting/get-game-setting',
        { headers: { token: token || '' } }
      );
      if (response.data.status) {
        setSettings(response.data.data);
        toast.success('Game settings fetched successfully!');
      } else {
        toast.error('Failed to fetch game settings.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching game settings.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch game settings when component mounts
  useEffect(() => {
    getGameSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle form changes for both text and checkbox fields.
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!settings) return;
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Form submission to update game settings.
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setUpdating(true);
    // Use the _id from settings for the update URL.
    const updateUrl = `http://ec2-34-230-39-240.compute-1.amazonaws.com/api/admin/game-setting/update-game-setting/${settings._id}`;
    const payload = {
      terms_condition: settings.terms_condition,
      privacy_policy: settings.privacy_policy,
      whatsapp_url: settings.whatsapp_url,
      instagram_url: settings.instagram_url,
      facebook_url: settings.facebook_url,
      telegram_url: settings.telegram_url,
      isMaintence: settings.isMaintence,
      maintence_txt: settings.maintence_txt,
    };

    try {
      const response = await axios.post(updateUrl, payload, {
        headers: { token: token || '' },
      });
      if (response.data.status) {
        toast.success('Game settings updated successfully!');
        // Re-fetch the latest game settings after successful update.
        getGameSettings();
      } else {
        toast.error('Failed to update game settings.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error updating game settings.');
    } finally {
      // Keep "Updating..." text for 1.5 sec before resetting
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
          <h5 className="card-title mb-4">Game Settings</h5>
          {loading ? (
            <p>Loading...</p>
          ) : settings ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="terms_condition" className="form-label">
                  Terms & Conditions URL
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="terms_condition"
                  name="terms_condition"
                  value={settings.terms_condition}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="privacy_policy" className="form-label">
                  Privacy Policy URL
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="privacy_policy"
                  name="privacy_policy"
                  value={settings.privacy_policy}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="whatsapp_url" className="form-label">
                  WhatsApp URL
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="whatsapp_url"
                  name="whatsapp_url"
                  value={settings.whatsapp_url}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="instagram_url" className="form-label">
                  Instagram URL
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="instagram_url"
                  name="instagram_url"
                  value={settings.instagram_url}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="facebook_url" className="form-label">
                  Facebook URL
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="facebook_url"
                  name="facebook_url"
                  value={settings.facebook_url}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="telegram_url" className="form-label">
                  Telegram URL
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="telegram_url"
                  name="telegram_url"
                  value={settings.telegram_url}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="isMaintence"
                  name="isMaintence"
                  checked={settings.isMaintence}
                  onChange={handleInputChange}
                />
                <label className="form-check-label" htmlFor="isMaintence">
                  Is Maintenance Mode
                </label>
              </div>
              <div className="mb-3">
                <label htmlFor="maintence_txt" className="form-label">
                  Maintenance Text
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="maintence_txt"
                  name="maintence_txt"
                  value={settings.maintence_txt}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={updating}>
                {updating ? 'Updating...' : 'Update Settings'}
              </button>
            </form>
          ) : (
            <p>No settings available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameSettings;
