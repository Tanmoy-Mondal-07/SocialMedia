import { Query } from 'appwrite'
import appwriteLikeService from '../appwrite/likeService'
import { deletePostLikeInfo, getPostLikeInfo, setPostLikeInfo } from './likeInfoCache'

// TODO : too meny server hits, need to do somthing about it
// temporaryly reduced server hit

export async function postsTotalLikes({ postId, currentUserId }) {
    let LikeInfo = []
    const CachedLikeInfo = await getPostLikeInfo(postId)

    if (CachedLikeInfo) LikeInfo = await CachedLikeInfo?.filter((info) => info.commentId == null)

    if (!CachedLikeInfo) {
        const queries = [
            Query.equal("postId", postId)
        ]
        const responce = await appwriteLikeService.getLikes(queries)
        if (responce) {
            setPostLikeInfo(postId, responce.documents)
            LikeInfo = await responce.documents?.filter((info) => info.commentId == null)
        }
    }

    // console.log(currentUserId);
    const result = await {
        responceResived: true,
        likeCount: LikeInfo.length,
        userLiked: LikeInfo?.filter((info) => info.userId == currentUserId)
    }

    return result
}

export async function ifNotLikedThenLike({ postId, currentUserId, commentId = null }) {
    //clear the cache first
    deletePostLikeInfo(postId)

    let queries = [
        Query.equal("postId", postId),
        Query.equal("userId", currentUserId),
        Query.isNull("commentId")
    ]

    if (commentId) {
        queries = [
            Query.equal("postId", postId),
            Query.equal("userId", currentUserId),
            Query.equal("commentId", commentId)
        ]
    }

    try {
        const responce = await appwriteLikeService.getLikes(queries)

        if (responce?.total == 0) {
            await appwriteLikeService.createLike({ postId, userId: currentUserId, commentId })
            return true
        }

        if (responce?.total >= 1) {
            await appwriteLikeService.deleteLike(responce?.documents[0].$id)
            return true
        }
    } catch (error) {
        console.log(error);
        return true
    }
}

export async function singlePostTotalLikes({ postId, currentUserId }) {
    const result = await postsTotalLikes({ postId, currentUserId })
    return result
}

export async function commentLikes({ postId, commentIdProvided, currentUserId }) {
    //likes on the comments
    let LikeInfo = []
    const CachedLikeInfo = await getPostLikeInfo(postId)

    if (CachedLikeInfo) LikeInfo = await CachedLikeInfo

    if (!CachedLikeInfo) {
        const queries = [
            Query.equal("postId", postId)
        ]
        const responce = await appwriteLikeService.getLikes(queries)
        if (responce) {
            setPostLikeInfo(postId, responce.documents)
            LikeInfo = await responce.documents
        }
    }

    if (LikeInfo) {
        const result = LikeInfo?.filter((like) => like.commentId == commentIdProvided)
        return {
            responceResived: true,
            likesCount: result.length,
            userLiked: result?.filter((e) => e.userId == currentUserId && e.commentId == commentIdProvided) || null
        }
    }

}