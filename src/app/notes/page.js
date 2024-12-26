'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import MainContent from '../../components/MainContent';
import ProfilePage from '../../components/ProfilePage';
import CommentBar from '../../components/CommentBar';
import SettingsPage from '../../components/SettingsPage';

const NotesPage = () => {
  const [selectedNoteId, setSelectedNoteId] = useState(null); 
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null); 
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isProfilePage, setIsProfilePage] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState('/profile.jpg'); 
  const [comments, setComments] = useState([]); 
  const [isCommentBarVisible, setIsCommentBarVisible] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSettingsPage, setIsSettingsPage] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('User is not authenticated');
        }

        const response = await fetch('/api/notes', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch notes');
        const data = await response.json();

        setNotes(data);

        if (data.length > 0) {
          setSelectedNoteId(data[0].id); 
          fetchComments(data[0].id);
        }
      } catch (error) {
        setError(error.message);
        console.error('Failed to fetch notes:', error);
      }
    };

    fetchNotes();
  }, []);


  const handleSearch = () => {
    setSearchResults([]);
    setIsSearching(true);
  };

  const performSearch = () => {
    const results = notes.filter(note =>
      note.contents.some(content =>
        content.value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setSearchResults(results);
  };


  const createNewNote = async (folderId = null) => {
    const newNoteTitle = `Untitled ${notes.length + 1}`;
    const defaultContent = 'Start writing your note here...';

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User is not authenticated');
      }

      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newNoteTitle, content: defaultContent }),
      });

      if (!response.ok) throw new Error('Failed to create note');
      const newNote = await response.json();

      const noteWithFolder = { ...newNote, contents: [{ type: 'text', value: defaultContent }], folderId };
      setNotes([...notes, noteWithFolder]);
      setSelectedNoteId(newNote.id); 
    } catch (error) {
      setError(error.message);
      console.error('Failed to create a new note:', error);
    }
  };
  
  let timeoutId;

  const handleTitleChange = (event) => {
    const newTitle = event.target.value;
  
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === selectedNoteId ? { ...note, title: newTitle } : note
      )
    );
  
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(async () => {
      const currentNote = notes.find((note) => note.id === selectedNoteId);
      if (!currentNote) return;
  
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('User is not authenticated');
        }

        const response = await fetch('/api/notes', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: selectedNoteId,
            title: newTitle,
            content: currentNote.contents.map((content) => content.value).join('\n') || '',
          }),
        });
  
        if (!response.ok) throw new Error('Failed to update note title');
      } catch (error) {
        setError(error.message);
        console.error('Failed to update the note title:', error);
      }
    }, 500);
  };

  const handleNoteChange = async (event) => {
    const updatedContent = event.target.value;
  
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === selectedNoteId
          ? { ...note, contents: [{ type: 'text', value: updatedContent }] }
          : note
      )
    );
  
    try {
      const currentNote = notes.find((note) => note.id === selectedNoteId);
      if (!currentNote) return;
  
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User is not authenticated');
      }

      const response = await fetch('/api/notes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: selectedNoteId,
          title: currentNote.title,
          content: updatedContent,
        }),
      });
  
      if (!response.ok) throw new Error('Failed to update note content');
    } catch (error) {
      setError(error.message);
      console.error('Failed to update the note content:', error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User is not authenticated');
      }
  
      const response = await fetch(`/api/notes?id=${noteId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) throw new Error('Failed to delete note');
  
      const remainingNotes = notes.filter((note) => note.id !== noteId);
      setNotes(remainingNotes);
  
      if (remainingNotes.length > 0) {
        setSelectedNoteId(remainingNotes[0].id); 
        fetchComments(remainingNotes[0].id); 
      } else {
        setSelectedNoteId(null); 
      }
    } catch (error) {
      setError(error.message);
      console.error('Failed to delete the note:', error);
    }
  };

  const handleProfilePage = () => {
    setIsProfilePage(true);
    setIsSearching(false);
  };

  const updateProfileImageUrl = (url) => {
    setProfileImageUrl(url);
    localStorage.setItem('profileImageUrl', url); 
  };

  const handleNoteSelection = (noteId) => {
    setSelectedNoteId(noteId);
    setIsSearching(false); 
    setIsProfilePage(false);
    fetchComments(noteId);
  };

  const fetchComments = async (noteId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User is not authenticated');
      }

      const response = await fetch(`/api/comments?noteId=${noteId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments(data);

      setIsCommentBarVisible(data.length > 0);
    } catch (error) {
      setError(error.message);
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User is not authenticated');
      }

      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment, noteId: selectedNoteId }),
      });

      if (!response.ok) throw new Error('Failed to add comment');
      const newCommentData = await response.json();

      setComments([...comments, newCommentData]);
      setNewComment('');
    } catch (error) {
      setError(error.message);
      console.error('Failed to add comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User is not authenticated');
      }

      const response = await fetch(`/api/comments?id=${commentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete comment');

      setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      setError(error.message);
      console.error('Failed to delete comment:', error);
    }
  };

  const toggleCommentBar = () => {
    setIsCommentBarVisible(!isCommentBarVisible);
  };
  

  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  const [font, setFont] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('font') || 'fontA'; 
    }
    return 'fontA';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('font', font); 
    }
  }, [font]);

  return isSettingsPage ? (
    <div
      className={`h-screen flex justify-center items-center ${
        theme === 'dark' ? 'bg-black text-white' : 'bg-gray-100 text-black'
      }`}
    >
      <SettingsPage
        setIsSettingsPage={setIsSettingsPage}
        setTheme={setTheme}
        setFont={setFont}
      />
    </div>
  ) : (
    <div
      className={`flex h-screen ${
        font === 'fontA' ? 'font-sans' : font === 'fontB' ? 'font-serif' : 'font-mono'
      }`}
    >
      {error && <div className="text-red-500">{error}</div>}
      <Sidebar
        notes={notes}
        setSelectedNoteId={handleNoteSelection}
        selectedNoteId={selectedNoteId}
        createNewNote={createNewNote}
        handleDeleteNote={handleDeleteNote}
        handleSearch={handleSearch}
        handleProfilePage={handleProfilePage}
        profileImageUrl={profileImageUrl}
        theme={theme} 
      />
      {isProfilePage ? (
        <ProfilePage setProfileImageUrl={updateProfileImageUrl} theme={theme} />
      ) : (
        <MainContent
          note={
            isSearching
              ? ''
              : notes.find((note) => note.id === selectedNoteId)?.contents[0]?.value || ''
          }
          handleNoteChange={handleNoteChange}
          handleTitleChange={handleTitleChange}
          selectedNote={
            isSearching
              ? ''
              : notes.find((note) => note.id === selectedNoteId)?.title || ''
          }
          searchResults={isSearching ? searchResults : []}
          searchTerm={isSearching ? searchTerm : ''}
          setSearchTerm={setSearchTerm}
          setSelectedNoteId={handleNoteSelection}
          isSearching={isSearching}
          performSearch={performSearch}
          setIsSearching={setIsSearching}
          setIsSettingsPage={setIsSettingsPage}
          theme={theme} 
          toggleCommentBar={toggleCommentBar}
          isCommentBarVisible={isCommentBarVisible}
        />
      )}
      <CommentBar
        comments={comments}
        newComment={newComment}
        setNewComment={setNewComment}
        handleAddComment={handleAddComment}
        isCommentBarVisible={isCommentBarVisible}
        toggleCommentBar={toggleCommentBar}
        handleDeleteComment={handleDeleteComment}
        theme={theme} 
      />
    </div>
  );
};

export default NotesPage;