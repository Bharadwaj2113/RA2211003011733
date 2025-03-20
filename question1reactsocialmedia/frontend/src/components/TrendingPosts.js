import React, { useEffect, useState } from "react";
import { getUsers, getPostsByUser, getCommentsByPost } from "../services/api";

const TrendingPosts = () => {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        const usersRes = await getUsers();
        const users = usersRes.data.users;
        const userIds = Object.keys(users);
        let allPosts = [];
        // Fetch posts for each user
        for (const userId of userIds) {
          try {
            const postsRes = await getPostsByUser(userId);
            const posts = postsRes.data.posts || [];
            // Add username to each post for display
            posts.forEach((post) => (post.username = users[userId]));
            allPosts = [...allPosts, ...posts];
          } catch (err) {
            console.error(`Error fetching posts for user ${userId}`, err);
          }
        }
        // For each post, get comment count
        const postsWithComments = await Promise.all(
          allPosts.map(async (post) => {
            try {
              const commentsRes = await getCommentsByPost(post.id);
              const comments = commentsRes.data.comments || [];
              return { ...post, commentCount: comments.length };
            } catch (err) {
              return { ...post, commentCount: 0 };
            }
          })
        );
        // Determine maximum comment count
        const maxCount = Math.max(
          ...postsWithComments.map((post) => post.commentCount)
        );
        // Filter posts that match max comment count
        const trending = postsWithComments.filter(
          (post) => post.commentCount === maxCount
        );
        setTrendingPosts(trending);
      } catch (error) {
        console.error("Error fetching trending posts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingPosts();
  }, []);

  const getRandomImage = (seed) =>
    `https://source.unsplash.com/collection/190727/200x200?sig=${seed}`;

  if (loading) return <div>Loading Trending Posts...</div>;

  return (
    <div>
      <h2>Trending Post{trendingPosts.length > 1 ? "s" : ""}</h2>
      {trendingPosts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        trendingPosts.map((post) => (
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
                  <p className="card-text">
                    <small className="text-muted">
                      Comments: {post.commentCount}
                    </small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TrendingPosts;
