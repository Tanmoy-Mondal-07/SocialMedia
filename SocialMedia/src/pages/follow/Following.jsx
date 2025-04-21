import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import appwriteFollowConfig from '../../appwrite/followState'
import { Query } from 'appwrite'
import { useDispatch } from 'react-redux'
import { hideLoading, showLoading } from '../../store/LodingState'
import ProfileList from '../../component/ProfileList'

function Following() {
    const [followers, setfollowers] = useState(null)
    const dispatch = useDispatch()
    const { userId } = useParams()

    useEffect(() => {
        dispatch(showLoading())
        appwriteFollowConfig.getFollowLists([Query.equal("followerId", userId)])
            .then((res) => setfollowers(res))
            .catch((err) => console.log(err))
            .finally(() => dispatch(hideLoading()))
    }, [userId])

    return (
        <div className="max-w-xl mx-auto p-6 bg-bground-100 rounded-lg text-fground-200 space-y-6 shadow-lg">
            <h2>Following</h2>
            {followers?.documents.map((accounts) => (
                <ProfileList
                    key={accounts.$id}
                    userId={accounts.followeeId}
                />
            ))}
        </div>
    )
}

export default Following