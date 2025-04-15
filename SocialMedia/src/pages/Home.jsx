import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Query } from 'appwrite';
import InfiniteScroll from 'react-infinite-scroll-component';
import appwritePostConfig from '../appwrite/postConfig.js';
import appwriteUserProfileService from '../appwrite/UserProfile.js';
import getFile from '../appwrite/getFiles.js';

import { showLoading, hideLoading } from '../store/LodingState.js';
import {
  setPosts,
  incrementPage,
  setHasMore,
  setUser,
} from '../store/postSlice.js';

import { Postcard } from '../component';
import { getPostPic } from '../appwrite/getFiles.js';
import { MoonLoader } from 'react-spinners';

function Home() {
  const dispatch = useDispatch();

  //redux states
  const posts = useSelector(state => state.posts.data);
  const page = useSelector(state => state.posts.page);
  const hasMore = useSelector(state => state.posts.hasMore);
  const users = useSelector(state => state.posts.users);
  const limit = 2;

  const fetchPosts = async () => {
    dispatch(showLoading());

    try {
      const response = await appwritePostConfig.getPosts([
        Query.orderDesc("$createdAt"),
        Query.limit(limit),
        Query.offset(page * limit),
      ]);

      if (response?.documents?.length) {
        dispatch(setPosts(response.documents));
        dispatch(incrementPage());

        const newUserIds = [...new Set(
          response.documents.map(post => post.userId)
        )].filter(userId => !users[userId]);

        for (const userId of newUserIds) {
          try {
            const userData = await appwriteUserProfileService.getUserProfile(userId);
            const profilePic = getFile(userData);
            dispatch(setUser({ userId, userData: { ...userData, profilePic } }));
          } catch (err) {
            console.error(`Failed to fetch user ${userId}:`, err.message);
          }
        }

        if (response.documents.length < limit) {
          dispatch(setHasMore(false));
        }
      } else {
        dispatch(setHasMore(false));
      }
    } catch (err) {
      console.error('Error fetching posts:', err.message);
      dispatch(setHasMore(false));
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts();
    }
  }, []);

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
        {posts.map(post => {
          const userInfo = users[post.userId];
          return (
            <Postcard
              key={post.$id}
              userId={post.userId}
              userInfo={userInfo}
              imageUrl={post?.mediaUrl}
              caption={post.content}
              time={post.$createdAt}
              title={post.title}
            />
          );
        })}
      </InfiniteScroll>
    </div>
  );
}

export default Home;