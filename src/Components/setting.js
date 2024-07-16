import React, { useEffect } from 'react';

import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import authStore from '../Store/authStore'; // Assuming 'authStore' is imported correctly
import useThemeStore from '../Store/themeStore'; // Zustand store for theme
import './settings.css'; // Import CSS file for common settings styles
import { Link } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material/';

function Settings() {
  const userId = authStore((state) => state.userId);
  const { setTheme, theme } = useThemeStore(); // Zustand store for theme

  const getUserThemeColor = async () => {
    const { data } = await axios.get(`/theme-color/${userId}`);
    return data.theme_color;
  };

  const updateThemeColor = async (theme_color) => {
    await axios.put(`/theme-color/${userId}`, { theme_color });
  };

  const queryClient = useQueryClient();
  const { data: themeColor} = useQuery(['themeColor', userId], getUserThemeColor);
  const mutation = useMutation(updateThemeColor, {
    onSuccess: () => {
      queryClient.invalidateQueries(['themeColor', userId]);
    },
  });

  useEffect(() => {
    if (themeColor) {
      setTheme(themeColor);
    }
  }, [themeColor, setTheme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    mutation.mutate(newTheme);
  };

  return (
    <div className={`chatroom ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      <div className="header">
        <Link to='/chat' className='back-link'>
          <ArrowBack />
        </Link>
        <h1>Settings:</h1>
      </div>
      <div className={`settings-container ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
        <div className="settings">
          <h1>Current Theme: {theme}</h1>
          <button onClick={() => handleThemeChange('light')}>Light</button>
          <button onClick={() => handleThemeChange('dark')}>Dark</button>
        </div>
      </div>
    </div>
  );
}
    
export default Settings;
