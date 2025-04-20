import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Query } from 'appwrite';
import appwriteCommentsConfig from '../../appwrite/commentsConfig';
import { useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import CommentCard from './CommentCard';

function Comments({ postId, userId, onSubmit }) {
  const [comments, setComments] = useState([]);
  const [groupedReplies, setGroupedReplies] = useState({});
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const currentUser = useSelector(state => state.auth.userData);
  const subscribedRef = useRef(false);
  const COMMENTS_LIMIT = 50;

  const sortComments = useCallback((list) => {
    const unique = Array.from(
      list.reduce((map, c) => map.set(c.$id, c), new Map()).values()
    );

    const mine = unique.filter(c => c.authorId === userId);
    const me = unique.filter(c => c.authorId === currentUser?.$id && c.authorId !== userId);
    const everyone = unique.filter(c => c.authorId !== userId && c.authorId !== currentUser?.$id);

    return [...mine, ...me, ...everyone];
  }, [userId, currentUser]);

  const groupReplies = useCallback((list) => {
    const replies = {};
    list.filter(c => c.commentId).forEach(reply => {
      const parentId = reply.commentId;
      if (!replies[parentId]) replies[parentId] = [];
      replies[parentId].push(reply);
    });
    Object.values(replies).forEach(arr => arr.sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)));
    return replies;
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await appwriteCommentsConfig.getPostComments([
          Query.equal('postId', postId),
          Query.orderDesc('$createdAt'),
          Query.limit(COMMENTS_LIMIT),
          Query.offset(page * COMMENTS_LIMIT),
        ]);
        if (!res.documents) return;

        const newReplies = groupReplies(res.documents);
        setGroupedReplies(prev => ({ ...prev, ...newReplies }));
        setComments(prev => sortComments([...prev, ...res.documents]));

        if (res.documents.length < COMMENTS_LIMIT) setHasMore(false);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };

    fetchComments();
  }, [postId, page, sortComments, groupReplies]);

  useEffect(() => {
    if (subscribedRef.current) return;
    subscribedRef.current = true;

    const unsubscribe = appwriteCommentsConfig.subscribeToComments(({ payload, events }) => {
      if (payload.postId !== postId) return;

      setComments(prev => {
        let updated = [...prev];
        if (events.includes('databases.*.collections.*.documents.*.create')) {
          // Avoid adding duplicates
          if (!updated.find(c => c.$id === payload.$id)) {
            updated.push(payload);
          }
        } else if (events.includes('databases.*.collections.*.documents.*.update')) {
          updated = updated.map(c => (c.$id === payload.$id ? payload : c));
        } else if (events.includes('databases.*.collections.*.documents.*.delete')) {
          updated = updated.filter(c => c.$id !== payload.$id);
        }

        const newGrouped = groupReplies(updated);
        setGroupedReplies(newGrouped);
        return sortComments(updated);
      });
    });

    return () => {
      if (unsubscribe && unsubscribe.unsubscribe) {
        unsubscribe.unsubscribe();
      }
      subscribedRef.current = false;
    };
  }, [postId, sortComments, groupReplies]);

  const topComments = comments.filter(c => !c.commentId);

  return (
    <div className='max-w-xl mx-auto'>
      <h3 className='pb-5'>Comments</h3>

      <InfiniteScroll
        dataLength={topComments.length}
        next={() => setPage(p => p + 1)}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p style={{ textAlign: 'center' }}><b>No more comments</b></p>}
      >
        {topComments.map(comment => (
          <CommentCard
            key={comment.$id}
            userId={comment.authorId}
            content={comment.content}
            time={comment.$createdAt}
            commentId={comment.$id}
            subComments={(groupedReplies[comment.$id] || []).map(reply => ({ ...reply, key: reply.$id }))}
            onSubmit={onSubmit}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default Comments;