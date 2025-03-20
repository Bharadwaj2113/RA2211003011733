import React, { useEffect, useState, useRef } from "react";
import { getUsers, getPostsByUser } from "../services/api";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  // Utility: get random image based on post id
  const getRandomImage = (seed) =>
    `https://source.unsplash.com/collection/190727/200x200?sig=${seed}`;

  const fetchFeed = async () => {
    try {
      const usersRes = await getUsers();
      const users = usersRes.data.users;
      const userIds = Object.keys(users);
      let allPosts = [];
      // Fetch posts for each user
      for (const userId of userIds) {
        try {
          const postsRes = await getPostsByUser(userId);
          const userPosts = postsRes.data.posts || [];
          // Attach username
          userPosts.forEach((post) => (post.username = users[userId]));
          allPosts = [...allPosts, ...userPosts];
        } catch (err) {
          console.error(`Error fetching posts for user ${userId}`, err);
        }
      }
      // Sort posts descending (assuming higher id means newer post)
      allPosts.sort((a, b) => b.id - a.id);
      setPosts(allPosts);
    } catch (error) {
      console.error("Error fetching feed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchFeed();
    // Set up polling every 10 seconds
    intervalRef.current = setInterval(fetchFeed, 10000);
    return () => clearInterval(intervalRef.current);
  }, []);

  if (loading) return <div>Loading Feed...</div>;

  return (
    <div>
      <h2>Real-time Feed</h2>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          <div className="card mb-3" key={post.id}>
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  src={getRandomImage(post.id)}
                  className="img-fluid rounded-start"
                  alt="Post"
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">{post.username}</h5>
                  <p className="card-text">{post.content}</p>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Feed;
