import React, { useEffect, useState } from "react";
import { getUsers, getPostsByUser } from "../services/api";

const TopUsers = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const usersRes = await getUsers();
        const users = usersRes.data.users; // Assuming response format: { "users": { "1": "John Doe", ... } }
        const userIds = Object.keys(users);
        const counts = await Promise.all(
          userIds.map(async (userId) => {
            try {
              const postsRes = await getPostsByUser(userId);
              const posts = postsRes.data.posts || [];
              return { userId, name: users[userId], count: posts.length };
            } catch (err) {
              return { userId, name: users[userId], count: 0 };
            }
          })
        );
        // Sort descending and get top 5
        const sorted = counts.sort((a, b) => b.count - a.count).slice(0, 5);
        setTopUsers(sorted);
      } catch (error) {
        console.error("Error fetching top users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, []);

  const getRandomImage = (seed) =>
    `https://source.unsplash.com/collection/190727/200x200?sig=${seed}`;

  if (loading) return <div>Loading Top Users...</div>;

  return (
    <div>
      <h2>Top 5 Users by Post Count</h2>
      <div className="row">
        {topUsers.map((user) => (
          <div className="col-md-4 my-2" key={user.userId}>
            <div className="card">
              <img
                src={getRandomImage(user.userId)}
                className="card-img-top"
                alt={user.name}
              />
              <div className="card-body">
                <h5 className="card-title">{user.name}</h5>
                <p className="card-text">
                  Posts: <strong>{user.count}</strong>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopUsers;
