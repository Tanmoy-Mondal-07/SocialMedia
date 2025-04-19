import React, { useEffect, useState, useCallback } from 'react';
import { Query } from 'appwrite';
import appwriteCommentsConfig from '../../appwrite/commentsConfig';
import { useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import Postcard from '../posts/Postcard';

function Comments({ postId, userId }) {
    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const currentUser = useSelector((state) => state.auth.userData);

    const COMMENTS_LIMIT = 10;

    const sortComments = useCallback((commentsList) => {
        const uniqueMap = new Map();
        commentsList.forEach((comment) => {
            if (!uniqueMap.has(comment.$id)) uniqueMap.set(comment.$id, comment);
        });
        const uniqueComments = Array.from(uniqueMap.values());

        return [
            ...uniqueComments.filter((c) => c.authorId === userId),
            ...uniqueComments.filter((c) => c.authorId === currentUser?.$id && c.authorId !== userId),
            ...uniqueComments.filter((c) => c.authorId !== userId && c.authorId !== currentUser?.$id),
        ];
    }, [userId, currentUser]);

    const fetchComments = useCallback(async () => {
        const queries = [
            Query.equal("postId", postId),
            Query.orderDesc('$createdAt'),
            Query.limit(COMMENTS_LIMIT),
            Query.offset(page * COMMENTS_LIMIT),
        ];

        try {
            const res = await appwriteCommentsConfig.getPostComments(queries);
            if (res && res.documents) {
                setComments((prev) => {
                    const updatedComments = [...prev, ...res.documents];
                    return sortComments(updatedComments);
                });
                if (res.documents.length < COMMENTS_LIMIT) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }, [page, postId, sortComments]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    useEffect(() => {
        const unsubscribe = appwriteCommentsConfig.subscribeToComments((response) => {
            const { payload, events } = response;
            if (payload.postId !== postId) return;

            setComments((prev) => {
                let updated = [...prev];

                if (events.includes("databases.*.collections.*.documents.*.create")) {
                    updated = [...updated, payload];
                } else if (events.includes("databases.*.collections.*.documents.*.delete")) {
                    updated = updated.filter((comment) => comment.$id !== payload.$id);
                } else if (events.includes("databases.*.collections.*.documents.*.update")) {
                    updated = updated.map((comment) => (comment.$id === payload.$id ? payload : comment));
                }

                return sortComments(updated);
            });
        });

        return () => unsubscribe();
    }, [postId, sortComments]);

    return (
        <div>
            <h3>Comments</h3>
            <InfiniteScroll
                dataLength={comments.length}
                next={() => setPage((p) => p + 1)}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={<p style={{ textAlign: 'center' }}><b>No more comments</b></p>}
            >
                {comments.map((comment) => (
                    <Postcard
                        key={comment.$id}
                        userId={comment.authorId}
                        userInfo="aa"
                        caption={comment.content}
                        time={comment.$createdAt}
                        postId={comment.$id}
                    />
                ))}
            </InfiniteScroll>
        </div>
    );
}

export default Comments;