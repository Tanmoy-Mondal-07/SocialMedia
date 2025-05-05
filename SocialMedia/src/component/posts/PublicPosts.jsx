import React, { useEffect, useState, useCallback, Suspense } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MoonLoader } from 'react-spinners';
import { Query } from 'appwrite';
import appwritePostConfig from '../../appwrite/postConfig';
import appwriteUserProfileService from '../../appwrite/UserProfile';
import getFile from '../../appwrite/getFiles';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../store/LodingState';

const Postcard = React.lazy(() => import('./Postcard'));

const LIMIT = 5;

export default function PublicPosts({ userId }) {
  const dispatch = useDispatch();

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState(new Map());
  const [lastCreatedAt, setLastCreatedAt] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async () => {
    if (!userId) return;

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

      const existingIds = new Set(posts.map(p => p.$id));
      const uniquePosts = newPosts.filter(p => !existingIds.has(p.$id));

      const updatedUsers = new Map(users);
      const newUserIds = [...new Set(
        uniquePosts.map(p => p.userId).filter(id => !users.has(id))
      )];

      const userProfiles = await Promise.all(
        newUserIds.map(id => appwriteUserProfileService.getUserProfile(id))
      );

      userProfiles.forEach((userData, i) => {
        if (userData) {
          updatedUsers.set(newUserIds[i], {
            ...userData,
            profilePic: getFile(userData),
          });
        }
      });

      setUsers(updatedUsers);
      setPosts(prev => [...prev, ...uniquePosts]);

      if (uniquePosts.length > 0) {
        setLastCreatedAt(uniquePosts[uniquePosts.length - 1].$createdAt);
      }

      if (uniquePosts.length < LIMIT) {
        setHasMore(false);
      }

    } catch (err) {
      console.error('Error fetching posts:', err.message);
    } finally {
      dispatch(hideLoading());
    }
  }, [userId, users, posts, lastCreatedAt, dispatch]);

  useEffect(() => {
    if (userId) {
      fetchPosts();
    }
  }, [userId, fetchPosts]);

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
        <Suspense fallback={<div className="text-center">Loading posts...</div>}>
          {posts.map(post => (
            <Postcard
              key={post.$id}
              userId={post.userId}
              imageUrl={post.mediaUrl}
              caption={post.content}
              time={post.$createdAt}
              title={post.title}
              postId={post.$id}
              commentCount={post.commentsCount}
            />
          ))}
        </Suspense>
      </InfiniteScroll>
    </div>
  );
}