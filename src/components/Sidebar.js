import React, { useEffect, useState } from 'react';

const Sidebar = ({ notes, setSelectedNoteId, selectedNoteId, createNewNote, handleDeleteNote, handleSearch, handleProfilePage, theme, }) => {
  const [username, setUsername] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('/profile.jpg'); 
  const [favoriteNotes, setFavoriteNotes] = useState(() => {
    const storedFavorites = localStorage.getItem('favoriteNotes');
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });
  const [hoveredNoteId, setHoveredNoteId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setUsername(storedUsername);
    }

    const storedProfileImageUrl = localStorage.getItem('profileImageUrl');
    if (storedProfileImageUrl) {
      setProfileImageUrl(storedProfileImageUrl);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('profileImageUrl');
    window.location.href = '/';
  };

  const toggleFavorite = (noteId) => {
    setFavoriteNotes((prevFavorites) => {
      let updatedFavorites;
      if (prevFavorites.includes(noteId)) {
        updatedFavorites = prevFavorites.filter((id) => id !== noteId);
      } else {
        updatedFavorites = [...prevFavorites, noteId];
      }
      localStorage.setItem('favoriteNotes', JSON.stringify(updatedFavorites)); 
      return updatedFavorites;
    });
  };

  return (
    <div className={`w-64 p-5 ${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-gray-100'}`}>
      <div className="flex items-center font-bold mb-4 -my-1 cursor-pointer" onClick={handleProfilePage}>
        <img src={profileImageUrl} alt="Profile" className="w-8 h-8 rounded-lg mr-2" />
        <p>{username}</p>
        <button
          className="ml-auto text-red-500 hover:text-red-700"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div className={`flex flex-col font-bold space-y-4 mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-500'}`}>
        <div className="flex items-center space-x-2 cursor-pointer" onClick={handleSearch}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill={theme === 'dark' ? '#d1d5db' : '#5f6368'}
          >
            <path d="M765-144 526-383q-30 22-65.79 34.5-35.79 12.5-76.18 12.5Q284-336 214-406t-70-170q0-100 70-170t170-70q100 0 170 70t70 170.03q0 40.39-12.5 76.18Q599-464 577-434l239 239-51 51ZM384-408q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Z" />
          </svg>
          <p>Search</p>
        </div>
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.location.reload()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill={theme === 'dark' ? '#d1d5db' : '#5f6368'}
          >
            <path d="M264-216h96v-240h240v240h96v-348L480-726 264-564v348Zm-72 72v-456l288-216 288 216v456H528v-240h-96v240H192Zm288-327Z" />
          </svg>
          <p>Home</p>
        </div>
      </div>

      <div className="mt-5">
        <p className={`text-xs font-bold mb-2 -ml-3 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-400'}`}>Private</p>
        {[...favoriteNotes.map(noteId => notes.find(note => note.id === noteId)).filter(note => note !== undefined), ...notes.filter(note => !favoriteNotes.includes(note.id))].map((note) => (
          <div
            key={note.id}
            className={`flex items-center font-bold gap-1 my-1 -mx-2 py-2 px-2 cursor-pointer rounded-md ${
              theme === 'dark'
                ? 'hover:bg-gray-600 text-white'
                : 'hover:bg-gray-300 text-gray-500'
            } ${selectedNoteId === note.id ? (theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300') : ''}`}
            onMouseEnter={() => setHoveredNoteId(note.id)} 
            onMouseLeave={() => setHoveredNoteId(null)}
            onClick={() => setSelectedNoteId(note.id)}
          >
            <svg
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(note.id);
              }}
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill={favoriteNotes.includes(note.id) ? '#FFD700' : theme === 'dark' ? '#d1d5db' : '#5f6368'}
              style={{
                marginRight: '0.5rem',
                opacity: favoriteNotes.includes(note.id) || hoveredNoteId === note.id ? 1 : 0, 
                transition: 'opacity 0.3s ease', 
              }}
            >
              <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill={theme === 'dark' ? '#d1d5db' : '#5f6368'}
            >
              <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
            </svg>
            <span className="flex-grow">{note.title}</span>
            <button
              className="text-red-500 hover:text-red-700"
              style={{
                opacity: hoveredNoteId === note.id ? 1 : 0, 
                transition: 'opacity 0.3s ease',
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteNote(note.id);
              }}
            >
              x
            </button>
          </div>
        ))}


        <div
          className={`flex items-center font-bold gap-1 cursor-pointer rounded-md px-10 py-2 mt-1 -mx-2 ${
            theme === 'dark' ? 'hover:bg-gray-600 text-white' : 'hover:bg-gray-300 text-gray-500'
          }`}
          onClick={createNewNote}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill={theme === 'dark' ? '#d1d5db' : '#5f6368'}
          >
            <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
          </svg>
          New Page
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
