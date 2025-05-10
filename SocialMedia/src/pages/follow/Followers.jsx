import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import appwriteFollowConfig from '../../appwrite/followState'
import { Query } from 'appwrite'
import { useDispatch } from 'react-redux'
import { hideLoading, showLoading } from '../../store/LodingState'
import ProfileList from '../../component/ProfileList'

function Followers() {
    const [followers, setfollowers] = useState(null)
    const dispatch = useDispatch()
    const { userId } = useParams()

    useEffect(() => {
        dispatch(showLoading())
        appwriteFollowConfig.getFollowLists([Query.equal("followeeId", userId)])
            .then((res) => setfollowers(res))
            .catch((err) => console.log(err))
            .finally(() => dispatch(hideLoading()))
    }, [userId])

    return (
        <div className="max-w-xl mx-auto p-6 bg-body-0 rounded-lg text-text-color-600 space-y-6 shadow-lg">
            <h2>Followers</h2>
            {followers?.documents.map((accounts) => (
                <ProfileList
                    key={accounts.$id}
                    userId={accounts.followerId}
                />
            ))}
        </div>
    )
}

export default Followers