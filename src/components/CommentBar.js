const CommentBar = ({ comments, newComment, setNewComment, handleAddComment, isCommentBarVisible, toggleCommentBar, handleDeleteComment, theme, }) => {
  
  return (
    <div
      className={`w-64 p-5 fixed right-0 top-0 h-full shadow-lg transition-transform ${
        isCommentBarVisible ? 'transform-none' : 'transform translate-x-full'
      } ${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-black'}`}
    >
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={toggleCommentBar}
          className={`py-1 px-4 rounded ${
            theme === 'dark' ? 'bg-black text-white' : 'bg-blue-500 text-white'
          }`}
        >
          {isCommentBarVisible ? 'Hide Comments' : 'Show Comments'}
        </button>
      </div>
      {isCommentBarVisible && (
        <>
          <h3 className="font-bold mb-4">Comments</h3>
          <div className="mb-4">
            {comments.length > 0 ? (
              [...comments].reverse().map((comment) => (
                <div
                  key={comment.id}
                  className={`mb-2 pb-2 flex justify-between items-center ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                  } border-b`}
                >
                  <div>
                    <p className="text-sm">{comment.content}</p>
                    <p
                      className={`text-xs ${
                        theme === 'dark' ? 'text-white' : 'text-gray-500'
                      }`}
                    >
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteComment(comment.id)} 
                    className="text-red-500 font-bold text-lg ml-2"
                  >
                    X
                  </button>
                </div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
          </div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className={`w-full p-2 rounded mb-2 ${
              theme === 'dark'
                ? 'bg-gray-700 text-white border-gray-600'
                : 'bg-white text-black border-gray-300'
            }`}
            placeholder="Type your comment..."
          />
          <button
            onClick={handleAddComment}
            className={`py-1 px-4 rounded w-full ${
              theme === 'dark' ? 'bg-black text-white' : 'bg-blue-500 text-white'
            }`}
          >
            Submit
          </button>
        </>
      )}
    </div>
  );
};

export default CommentBar;
