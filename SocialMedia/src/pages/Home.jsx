import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Query } from 'appwrite';
import InfiniteScroll from 'react-infinite-scroll-component';
import appwritePostConfig from '../appwrite/postConfig';
import { showLoading, hideLoading } from '../store/LodingState';
import { appendPosts, setCursor, setHasMore } from '../store/postSlice';
import { Postcard } from '../component';
import { MoonLoader } from 'react-spinners';

const LIMIT = 5;

function Home() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.data);
  const cursor = useSelector((state) => state.posts.cursor);
  const hasMore = useSelector((state) => state.posts.hasMore);
  let postList = []

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
        endMessage={<p className="text-center text-text-color-200 py-4">Nothing to Show</p>}
      >
        {posts.map((post) => {
          if (!postList.includes(post.$id)) {
            postList.push(post.$id)
            return (
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
            );
          }
        })}
      </InfiniteScroll>
    </div>
  );
}

export default Home;