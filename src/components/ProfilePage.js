import React, { useEffect, useState } from 'react';

const ProfilePage = ({ setProfileImageUrl, theme }) => {
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username'); 
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!image) {
      alert("Please select an image first!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("profileImage", image);

      const response = await fetch('/api/uploadProfileImage', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload image');

      const data = await response.json();
      setProfileImageUrl(data.filePath); 
      alert("Profile image updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  };

  return (
    <div
      className={`flex-1 flex justify-center items-start ${
        theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'
      }`}
    >
      <div
        className={`w-full max-w-lg text-left p-6 rounded-lg shadow-lg mt-48 ${
          theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'
        }`}
      >
        <h2 className="text-2xl font-bold mb-4">{username || 'User Name'}</h2>
        <div className="flex items-center gap-4">
          <input
            type="file"
            onChange={handleImageChange}
            className={`border rounded-md p-2 flex-1 ${
              theme === 'dark'
                ? 'bg-gray-600 text-white border-gray-500'
                : 'bg-white text-black border-gray-300'
            }`}
          />
          <button
            onClick={handleImageUpload}
            className={`py-2 px-4 rounded ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Change
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
