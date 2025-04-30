import React, { useState, useCallback } from 'react';
import Search from '../component/Search';
import { Query } from 'appwrite';
import appwriteUserProfileService from '../appwrite/UserProfile'
import ProfileList from '../component/ProfileList';
import { setUserProfile as setUserProfileGlobalCache } from '../utils/userProfileCache';
import getFile from '../appwrite/getFiles';
import profileRecommendationSystem from '../utils/profileRecoSystem';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../store/LodingState';

const SerchedTextItems = JSON.parse(localStorage.getItem("SerchedText")) || []
// console.log(SerchedTextItems);
// localStorage.setItem("SerchedText", null)

function SearchPage() {
    const [filteredData, setFilteredData] = useState(null);
    const dispatch = useDispatch()
    let existingUserIds = JSON.parse(localStorage.getItem("recommendedUserIds"))


    function SerchedTextStorageHandler(newSearch) {
        if (!SerchedTextItems.includes(newSearch)) {
            SerchedTextItems.push(newSearch),
                localStorage.setItem("SerchedText", JSON.stringify(SerchedTextItems))
        }
    }

    const handleSearch = useCallback(async (term) => {
        dispatch(showLoading())
        SerchedTextStorageHandler(term)
        const queries = [
            Query.startsWith("username", term),
            Query.limit(25)
        ]
        const responce = await appwriteUserProfileService.getProfiles(queries)
        dispatch(hideLoading())
        if (responce.total > 0) {
            setFilteredData(responce?.documents)
            responce?.documents.map((profile) => {
                const profilePic = getFile(profile);
                const userData = { ...profile, profilePic }
                setUserProfileGlobalCache(profile.$id, userData)
            })
        }
        existingUserIds = JSON.parse(localStorage.getItem("recommendedUserIds"))
    }, []);

    return (
        <div className="w-full max-w-md mx-auto mt-5 p-4 bg-white rounded-lg shadow">
            <Search items={SerchedTextItems} onSearch={handleSearch} />
            <ul className="mt-8 space-y-2 w-full">

                {filteredData ? <h4>Search Result</h4> : <h4>Recommendation</h4>}
                {/* search result */}
                {filteredData ? filteredData.map((item) => (
                    <div key={item.$id} onClick={() => profileRecommendationSystem(item.$id)}>
                        <ProfileList
                            userId={item.$id}
                        /></div>
                )) : existingUserIds?.map((item) => (
                    <ProfileList
                        key={item}
                        userId={item}
                    />
                ))
                }
            </ul>
            <h2></h2>
        </div>
    );
}

export default SearchPage;