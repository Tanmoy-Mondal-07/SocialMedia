import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserProfile as setUserProfileGlobalCache } from '../utils/userProfileCache';
import { ProfileComponent, PublicPosts } from '../component';
import { showLoading, hideLoading } from '../store/LodingState';
import appwriteUserProfileService from '../appwrite/UserProfile';
import appwriteFollowStatesService from '../appwrite/followState';
import appwriteFunction from '../appwrite/functions';
import getFile from '../appwrite/getFiles';

function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [followCount, setFollowCount] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [error, setError] = useState(null);

  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  const getCacheKey = (slug) => `user-profile-${slug}`;

  const cacheUserProfile = async (slug, profileData) => {
    const cache = await caches.open('user-profile-cache');
    const response = new Response(JSON.stringify(profileData), {
      headers: { 'Content-Type': 'application/json' },
    });
    await cache.put(getCacheKey(slug), response);
  };

  const loadProfileFromCache = async (slug) => {
    const cache = await caches.open('user-profile-cache');
    const cachedResponse = await cache.match(getCacheKey(slug));
    if (cachedResponse) {
      const data = await cachedResponse.json();
      return data;
    }
    return null;
  };

  const loadUserProfile = async () => {
    dispatch(showLoading());
    try {
      const profile = await appwriteUserProfileService.getUserProfile(slug);
      const followState = await appwriteFollowStatesService.getFollowState(slug);

      if (userData && userData.$id !== slug) {
        const followConnection = await appwriteFollowStatesService.getFollowConnection({
          followerId: userData.$id,
          followeeId: slug,
        });
        setIsFollowing(followConnection?.total > 0);
      }

      setFollowCount(followState || { followersCount: 0, followingCount: 0 });

      if (profile) {
        setUserProfile(profile);
        await cacheUserProfile(slug, profile);
      } else {
        setError('User not found');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong while fetching the profile.');
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const init = async () => {
      setUserProfile(null);
      if (!slug) return navigate('/');

      const cachedProfile = await loadProfileFromCache(slug);
      if (cachedProfile) setUserProfile(cachedProfile);

      await loadUserProfile();
    };

    init();
  }, [slug]);

  const onFollowClick = async () => {
    const prev = isFollowing;
    setIsFollowing(!prev);

    try {
      await appwriteFunction.callFunction({ followeeId: slug });
      await loadUserProfile();
    } catch (err) {
      console.error('Follow/unfollow failed:', err);
      setIsFollowing(prev);
    }

    if (userProfile) {
      const profilePic = getFile(userProfile);
      const userData = { ...userProfile, profilePic }
      setUserProfileGlobalCache(slug, userData)
    }
  };

  if (error) return <h1>{error}</h1>;

  return userProfile && userData ? (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <ProfileComponent
        followersCount={followCount?.followersCount}
        followingCount={followCount?.followingCount}
        isOwnProfile={userData?.$id === slug}
        username={userProfile.username}
        bio={userProfile.bio}
        imageUrl={getFile(userProfile)}
        onFollowClick={onFollowClick}
        isFollowing={isFollowing}
        userId={slug}
      />
      <div className='pt-5 py-2'>
        <PublicPosts userId={slug} />
      </div>
    </div>
  ) : null;
}

export default Profile;