import React, { useState } from 'react';
import MusicSidebar from './MusicSidebar';

const MainContent = ({ note, handleNoteChange, handleTitleChange, selectedNote, searchTerm, searchResults = [], setSearchTerm, setSelectedNoteId, isSearching, performSearch, setIsSearching, setIsSettingsPage, theme, toggleCommentBar: parentToggleCommentBar, isCommentBarVisible, }) => {
  const [isMusicSidebarVisible, setIsMusicSidebarVisible] = useState(false);

  const toggleMusicSidebar = () => {
    if (isCommentBarVisible) {
      parentToggleCommentBar(); 
    }
    setIsMusicSidebarVisible((prev) => !prev); 
  };

  const toggleCommentBar = () => {
    if (isMusicSidebarVisible) {
      setIsMusicSidebarVisible(false); 
    }
    parentToggleCommentBar();
  };

  
  return (
    <div
      className={`flex-1 flex justify-center items-start ${
        theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'
      }`}
      style={{
        padding: theme === 'dark' ? '15rem 2rem' : '15rem 2rem', 
        minHeight: '100vh',
      }}
    >
      <div
        className={`absolute top-4 right-4 flex items-center gap-4 transition-all ${
          isCommentBarVisible ? 'mr-64' : isMusicSidebarVisible ? 'mr-72' : 'mr-0'
        }`}
      >
        <button
          onClick={toggleCommentBar}
          className={`p-2 rounded-full shadow-md transition-all ${
            theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
          aria-label="Toggle Comments"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill={theme === 'dark' ? '#d1d5db' : '#5f6368'}
          >
            <path d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720ZM160-320h594l46 45v-525H160v480Zm0 0v-480 480Z" />
          </svg>
        </button>

        <button
          onClick={toggleMusicSidebar}
          className={`p-2 rounded-full shadow-md transition-all ${
            theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
          aria-label="Music"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill={theme === 'dark' ? '#d1d5db' : '#5f6368'}
          >
            <path d="M400-120q-66 0-113-47t-47-113q0-66 47-113t113-47q23 0 42.5 5.5T480-418v-422h240v160H560v400q0 66-47 113t-113 47Z" />
          </svg>
        </button>

        <button
          onClick={() => setIsSettingsPage(true)}
          className={`p-2 rounded-full shadow-md transition-all ${
            theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
          aria-label="Settings"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill={theme === 'dark' ? '#d1d5db' : '#5f6368'}
          >
            <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
          </svg>
        </button>
      </div>

      <div className="w-full max-w-3xl">
        {isSearching ? (
          <div
            className={`p-4 rounded mt-4 ${
              theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'
            }`}
          >
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full py-2 px-4 rounded-md mb-4 ${
                theme === 'dark' ? 'bg-gray-600 text-white border-gray-500' : 'border border-gray-300'
              }`}
            />
            <button
              onClick={() => {
                setIsSearching(true);
                performSearch();
              }}
              className={`py-2 px-4 rounded ${
                theme === 'dark' ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white'
              }`}
            >
              Search
            </button>
            {searchTerm === '' ? (
              <p>No results found for ""</p>
            ) : searchResults.length > 0 ? (
              <>
                <h3 className="font-bold mb-2">Search Word : "{searchTerm}":</h3>
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className={`cursor-pointer p-2 rounded mb-2 ${
                      theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                    }`}
                    onClick={() => {
                      setSelectedNoteId(result.id);
                      setIsSearching(false);
                    }}
                  >
                    <strong>{result.title}</strong>: Matched "{searchTerm}"
                  </div>
                ))}
              </>
            ) : (
              <p>No results found for "{searchTerm}"</p>
            )}
          </div>
        ) : (
          <>
            <input
              type="text"
              value={selectedNote !== null ? selectedNote : ''} 
              onChange={handleTitleChange}
              className={`text-4xl font-bold mb-8 w-full border-none focus:outline-none ${
                theme === 'dark' ? 'bg-gray-700 text-white border-white' : 'bg-white text-black'
              }`}
              placeholder="" 
              aria-label="Note title"
            />

            <textarea
              value={note || ''} 
              onChange={handleNoteChange}
              className={`w-full h-64 text-base py-2 px-4 rounded-md resize-none focus:outline-none ${
                theme === 'dark' ? 'bg-gray-700 text-white' : 'border border-gray-300'
              }`}
              placeholder=""
              aria-label="Note content"
            />
          </>
        )}
      </div>
      {isMusicSidebarVisible && <MusicSidebar onClose={toggleMusicSidebar} theme={theme} />}
    </div>
  );
};

export default MainContent;