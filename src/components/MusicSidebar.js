import React, { useState, useEffect } from 'react';

const MusicSidebar = ({ onClose, theme }) => {
  const [uploadedMusic, setUploadedMusic] = useState([]);
  const [currentMusicId, setCurrentMusicId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const fetchUploadedMusic = async () => {
    try {
      const response = await fetch('/api/uploadMusic'); 
      if (!response.ok) throw new Error('Failed to fetch uploaded music');
      const data = await response.json();
      setUploadedMusic(data); 
    } catch (error) {
      console.error('Error fetching uploaded music:', error);
    }
  };

  useEffect(() => {
    fetchUploadedMusic(); 
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('musicFile', file);

        const response = await fetch('/api/uploadMusic', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Failed to upload music');
        const data = await response.json();

        const newMusic = {
          id: Date.now(),
          name: file.name,
          url: data.filePath,
        };
        setUploadedMusic([newMusic, ...uploadedMusic]);
      } catch (error) {
        console.error('Failed to upload file:', error);
      }
    }
  };

  const playMusic = (musicId) => {
    const selectedMusic = uploadedMusic.find((music) => music.id === musicId);
    if (!selectedMusic) return;
  
    if (currentMusicId && currentMusicId !== musicId) {
      const currentMusic = uploadedMusic.find((music) => music.id === currentMusicId);
      currentMusic?.audio?.pause();
    }
  
    if (!selectedMusic.audio) {
      const audio = new Audio(selectedMusic.url);
      selectedMusic.audio = audio;
  
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentMusicId(null);
      };
    }
  
    selectedMusic.audio.play();
    setCurrentMusicId(musicId);
    setIsPlaying(true);
  };
  
  const pauseMusic = (musicId) => {
    const selectedMusic = uploadedMusic.find((music) => music.id === musicId);
    if (!selectedMusic?.audio) return;
  
    selectedMusic.audio.pause(); 
    setIsPlaying(false);
  };

  const resetMusic = (musicId) => {
    const selectedMusic = uploadedMusic.find((music) => music.id === musicId);
    if (!selectedMusic?.audio) return;
  
    if (currentMusicId && currentMusicId !== musicId) {
      const currentMusic = uploadedMusic.find((music) => music.id === currentMusicId);
      if (currentMusic?.audio) {
        currentMusic.audio.pause();
        currentMusic.audio.currentTime = 0;
      }
    }
  
    selectedMusic.audio.currentTime = 0;
    selectedMusic.audio.play();
    setCurrentMusicId(musicId);
    setIsPlaying(true);
  
    selectedMusic.audio.onended = () => {
      setIsPlaying(false);
      setCurrentMusicId(null);
    };
  };

  return (
    <div
      className={`fixed top-0 right-0 w-64 h-full shadow-lg p-4 transition-transform ${
        theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-black'
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Music Control</h2>
        <button
          onClick={onClose}
          className={`text-gray-600 hover:text-gray-900 p-1 rounded ${
            theme === 'dark' ? 'text-white hover:text-white' : ''
          }`}
          aria-label="Close Sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="currentColor"
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>

      <div className="mb-4 text-center">
        <label className="block text-sm font-medium mb-2">Upload Music</label>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          className={`block w-full text-sm ${
            theme === 'dark' ? 'bg-gray-700 text-white' : ''
          }`}
        />
      </div>

      {uploadedMusic.map((music) => (
        <div
          key={music.id}
          className={`mb-4 p-2 border-t border-b ${
            theme === 'dark' ? 'border-gray-600' : 'border-gray-400'
          }`}
        >
          <h3 className="text-sm font-medium text-center mb-2">{music.name}</h3>
          <div className="flex justify-center items-center space-x-4">
            {currentMusicId === music.id && isPlaying ? (
              <button
                onClick={() => pauseMusic(music.id)}
                className="w-8 h-8 bg-purple-700 text-white rounded flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#fff"
                >
                  <path d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z" />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => playMusic(music.id)}
                className="w-8 h-8 bg-purple-700 text-white rounded flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#fff"
                >
                  <path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z" />
                </svg>
              </button>
            )}
            <button
              onClick={() => resetMusic(music.id)}
              className="w-8 h-8 bg-purple-700 text-white rounded flex items-center justify-center"
            >
              R
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MusicSidebar;
