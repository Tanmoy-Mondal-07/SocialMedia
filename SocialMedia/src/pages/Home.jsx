// src/pages/Home.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Query } from 'appwrite';
import InfiniteScroll from 'react-infinite-scroll-component';
import appwritePostConfig from '../appwrite/postConfig';
import appwriteUserProfileService from '../appwrite/UserProfile';
import getFile from '../appwrite/getFiles';
import { showLoading, hideLoading } from '../store/LodingState';
import { setPosts, appendPosts, setCursor, setHasMore, setUser } from '../store/postSlice';
import { Postcard } from '../component';
import { MoonLoader } from 'react-spinners';

const LIMIT = 5;

function Home() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.data);
  const cursor = useSelector((state) => state.posts.cursor);
  const hasMore = useSelector((state) => state.posts.hasMore);
  const users = useSelector((state) => state.posts.users);

  const fetchPosts = async () => {
    dispatch(showLoading());

    try {
      const queries = [Query.orderDesc('$createdAt'), Query.limit(LIMIT)];
      if (cursor) {
        queries.push(Query.cursorAfter(cursor));
      }

      const response = await appwritePostConfig.getPosts(queries);
      const newPosts = response?.documents || [];

      if (newPosts.length) {
        dispatch(appendPosts(newPosts));
        dispatch(setCursor(newPosts[newPosts.length - 1].$id));

        const newUserIds = new Set(newPosts.map((post) => post.userId));
        for (const userId of newUserIds) {
          if (!users[userId]) {
            try {
              const userData = await appwriteUserProfileService.getUserProfile(userId);
              const profilePic = getFile(userData);
              dispatch(setUser({ userId, userData: { ...userData, profilePic } }));
            } catch (err) {
              console.error(`Failed to fetch user ${userId}:`, err.message);
            }
          }
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
    if (!posts.length) {
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
        {posts.map((post) => {
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
              postId={post.$id}
            />
          );
        })}
      </InfiniteScroll>
    </div>
  );
}

export default Home;