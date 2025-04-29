import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Query } from 'appwrite';
import InfiniteScroll from 'react-infinite-scroll-component';
import appwritePostConfig from '../appwrite/postConfig';
import appwriteUserProfileService from '../appwrite/UserProfile';
import getFile from '../appwrite/getFiles';
import { showLoading, hideLoading } from '../store/LodingState';
import { appendPosts, setCursor, setHasMore } from '../store/postSlice';
import { Postcard } from '../component';
import { MoonLoader } from 'react-spinners';
import { getUserProfile as getCachedProfile, setUserProfile } from '../utils/userProfileCache';

const LIMIT = 5;

function Home() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.data);
  const cursor = useSelector((state) => state.posts.cursor);
  const hasMore = useSelector((state) => state.posts.hasMore);

  const [users, setUsers] = useState({});
  const usersRef = useRef(users); // mutable ref for latest users

  // Keep usersRef always updated
  useEffect(() => {
    usersRef.current = users;
  }, [users]);

  const fetchUserData = useCallback(async (userId) => {
    if (usersRef.current[userId]) return;
    try {
      let userData = await getCachedProfile(userId);
      if (!userData) {
        userData = await appwriteUserProfileService.getUserProfile(userId);
        const profilePic = getFile(userData);
        userData = { ...userData, profilePic };
        await setUserProfile(userId, userData);
      }
      setUsers(prev => ({ ...prev, [userId]: userData }));
    } catch (err) {
      console.error(`Failed to fetch user ${userId}:`, err.message);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    dispatch(showLoading());
    try {
      const queries = [Query.orderDesc('$createdAt'), Query.limit(LIMIT)];
      if (cursor) queries.push(Query.cursorAfter(cursor));

      const { documents = [] } = await appwritePostConfig.getPosts(queries);

      if (documents.length) {
        dispatch(appendPosts(documents));
        dispatch(setCursor(documents[documents.length - 1].$id));
      } else {
        dispatch(setHasMore(false));
      }
    } catch (err) {
      console.error('Error fetching posts:', err.message);
      dispatch(setHasMore(false));
    } finally {
      dispatch(hideLoading());
    }
  }, [cursor, dispatch]);

  useEffect(() => {
    if (!posts.length) fetchPosts();
  }, [posts.length, fetchPosts]);

  useEffect(() => {
    posts.forEach(post => fetchUserData(post.userId));
  }, [posts, fetchUserData]);

  return (
    <div className="flex flex-col items-center">
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchPosts}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center items-center min-w-50 w-full h-25">
            <MoonLoader size={30} speedMultiplier={1.5} color="red" />
          </div>
        }
        endMessage={<p className="text-center text-gray-500 py-4">Nothing to Show</p>}
      >
        {posts.map((post) => {
          const userInfo = users[post.userId];
          return (
            <Postcard
              key={post.$id}
              userId={post.userId}
              userInfo={userInfo}
              imageUrl={post.mediaUrl}
              caption={post.content}
              time={post.$createdAt}
              title={post.title}
              postId={post.$id}
              commentCount={post.commentsCount}
            />
          );
        })}
      </InfiniteScroll>
    </div>
  );
}

export default Home;