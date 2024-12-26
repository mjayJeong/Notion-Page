import React, { useState } from 'react';

const SettingsPage = ({ setIsSettingsPage, setTheme, setFont }) => {
  const [selectedTheme, setSelectedTheme] = useState(localStorage.getItem('appTheme') || 'light');
  const [selectedFont, setSelectedFont] = useState(localStorage.getItem('appFont') || 'fontA');

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    setTheme(theme);
    localStorage.setItem('appTheme', theme);
  };

  const handleFontChange = (font) => {
    setSelectedFont(font);
    setFont(font);
    localStorage.setItem('appFont', font);
  };

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center ${
        selectedTheme === 'dark' ? 'bg-black text-white' : 'bg-gray-200 text-black'
      }`}
    >
      <div
        className={`w-96 p-6 rounded-md shadow-lg ${
          selectedTheme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'
        }`}
        style={{
          fontFamily:
            selectedFont === 'fontA'
              ? 'Arial, sans-serif'
              : selectedFont === 'fontB'
              ? 'Georgia, serif'
              : 'Courier New, monospace',
        }}
      >
        <h2 className="text-2xl font-bold mb-6">Settings</h2>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-4">Theme</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => handleThemeChange('light')}
              className={`py-2 px-4 rounded ${
                selectedTheme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-400 text-black'
              }`}
            >
              Light
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`py-2 px-4 rounded ${
                selectedTheme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-400 text-black'
              }`}
            >
              Dark
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-4">Font</h3>
          <select
            value={selectedFont}
            onChange={(e) => handleFontChange(e.target.value)}
            className={`py-2 px-4 w-full rounded border ${
              selectedTheme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'
            }`}
            style={{
              fontFamily:
                selectedFont === 'fontA'
                  ? 'Arial, sans-serif'
                  : selectedFont === 'fontB'
                  ? 'Georgia, serif'
                  : 'Courier New, monospace',
            }}
          >
            <option value="fontA" style={{ fontFamily: 'Arial, sans-serif' }}>
              Font A (Sans-serif)
            </option>
            <option value="fontB" style={{ fontFamily: 'Georgia, serif' }}>
              Font B (Serif)
            </option>
            <option value="fontC" style={{ fontFamily: 'Courier New, monospace' }}>
              Font C (Monospace)
            </option>
          </select>
        </div>

        <button
          onClick={() => setIsSettingsPage(false)}
          className="py-2 px-6 bg-red-500 text-white rounded"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
