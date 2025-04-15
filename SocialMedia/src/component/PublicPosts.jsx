import React, { useEffect, useState, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MoonLoader } from 'react-spinners';
import Postcard from './Postcard';
import { Query } from 'appwrite';
import appwritePostConfig from '../appwrite/postConfig';
import appwriteUserProfileService from '../appwrite/UserProfile';
import getFile from '../appwrite/getFiles';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../store/LodingState';
import Cookies from 'universal-cookie';

const LIMIT = 5;

export default function PublicPosts({ userId }) {
  const dispatch = useDispatch();
  const cookies = new Cookies();

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState(new Map());
  const [lastCreatedAt, setLastCreatedAt] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async () => {
    dispatch(showLoading());

    try {
      const queries = [
        Query.equal("userId", userId),
        Query.orderDesc('$createdAt'),
        Query.limit(LIMIT),
      ];

      if (lastCreatedAt) {
        queries.push(Query.lessThan('$createdAt', lastCreatedAt));
      }

      const res = await appwritePostConfig.getPosts(queries);
      const newPosts = res?.documents || [];

      if (!newPosts.length) {
        setHasMore(false);
        return;
      }

      // Remove duplicates based on $id
      const existingIds = new Set(posts.map(p => p.$id));
      const uniquePosts = newPosts.filter(p => !existingIds.has(p.$id));

      // Prepare updated user map
      const updatedUsers = new Map(users);
      const newUserIds = [...new Set(
        uniquePosts.map(p => p.userId).filter(id => !users.has(id))
      )];

      if (newUserIds.length) {
        const userProfiles = await Promise.allSettled(
          newUserIds.map(id => appwriteUserProfileService.getUserProfile(id))
        );

        userProfiles.forEach((res, i) => {
          if (res.status === 'fulfilled') {
            const userData = res.value;
            updatedUsers.set(newUserIds[i], {
              ...userData,
              profilePic: getFile(userData),
            });
          }
        });

        setUsers(updatedUsers);
      }

      const newPostList = [...posts, ...uniquePosts];
      setPosts(newPostList);

      // Update cursor
      if (uniquePosts.length > 0) {
        setLastCreatedAt(uniquePosts[uniquePosts.length - 1].$createdAt);
      }

      if (uniquePosts.length < LIMIT) {
        setHasMore(false);
      }

      // Save to cookies with expiration
      cookies.set(`posts_${userId}`, newPostList, { path: '/', maxAge: 86400 });
      cookies.set(`users_${userId}`, Object.fromEntries(updatedUsers), { path: '/', maxAge: 86400 });

    } catch (err) {
      console.error('Error fetching posts:', err.message);
    } finally {
      dispatch(hideLoading());
    }
  }, [userId, users, posts, lastCreatedAt, dispatch]);

  useEffect(() => {
    const cachedPosts = cookies.get(`posts_${userId}`) || [];
    const cachedUsers = cookies.get(`users_${userId}`) || {};

    // De-duplicate just in case
    const uniqueCachedPosts = Array.from(
      new Map(cachedPosts.map(post => [post.$id, post])).values()
    );

    setPosts(uniqueCachedPosts);
    setUsers(new Map(Object.entries(cachedUsers)));

    // Start background fetch
    fetchPosts();
  }, [userId]);

  return (
    <div className="items-center">
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchPosts}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center items-center w-full h-50">
            <MoonLoader size={40} speedMultiplier={2} color="red" />
          </div>
        }
        endMessage={<p style={{ textAlign: 'center' }}>Nothing to Show</p>}
      >
        {posts.map(post => (
          <Postcard
            key={post.$id}
            userId={post.userId}
            userInfo={users.get(post.userId)}
            imageUrl={post.mediaUrl}
            caption={post.content}
            time={post.$createdAt}
            title={post.title}
            postId={post.$id}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
}