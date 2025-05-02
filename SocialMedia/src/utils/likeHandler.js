import { Query } from 'appwrite'
import appwriteLikeService from '../appwrite/likeService'

// TODO : too meny server hits, need to do somthing about it

export async function postsTotalLikes({ postId, currentUserId }) {
    // console.log(currentUserId);
    const queries = [
        Query.equal("postId", postId),
        Query.isNull("commentId")
    ]

    const responce = await appwriteLikeService.getLikes(queries)
    // console.log(responce);

    const result = {
        responceResived: true,
        likeCount: responce.total,
        userLiked: responce.documents?.filter((info) => info.userId == currentUserId)
    }
    // console.log(result);

    return result
}

export async function ifNotLikedThenLike({ postId, currentUserId, commentId = null }) {

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

let singlePostTotalLike = null

export async function singlePostTotalLikes({ postId, currentUserId }) {
    const queries = [
        Query.equal("postId", postId),
    ]

    const responce = await appwriteLikeService.getLikes(queries)
    if (responce) {
        singlePostTotalLike = responce.documents
    }

    const result = {
        responceResived: true,
        likeCount: responce.total,
        userLiked: responce.documents?.filter((info) => info.userId == currentUserId && info.commentId == null) || null
    }
    // console.log(result);

    return result
}

export async function commentLikes({ postId, commentIdProvided, currentUserId }) {

    if (singlePostTotalLike) {
        const result = singlePostTotalLike?.filter((like) => like.commentId == commentIdProvided)
        return {
            responceResived: true,
            likesCount: result.length,
            userLiked: result?.filter((e) => e.userId == currentUserId && e.commentId == commentIdProvided) || null
        }
    }

}