import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ProfileComponent, PublicPosts } from '../component';
import { showLoading, hideLoading } from '../store/LodingState';
import appwriteFollowStatesService from '../appwrite/followState';
import appwriteFunction from '../appwrite/functions';
import getFile from '../appwrite/getFiles';
import profileRecommendationSystem from '../utils/profileRecoSystem';
import { deleteUserProfile, getUserProfile as getUserProfileGlobalCache } from '../utils/userProfileCache';
import getProfilesByCache from '../utils/getProfilesThroughache';

function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [followCount, setFollowCount] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [error, setError] = useState(null);

  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  const loadUserProfile = async () => {
    dispatch(showLoading());
    try {
      getUserProfileGlobalCache(slug)
        .then((e) => setUserProfile(e))
      await deleteUserProfile(slug)
      getProfilesByCache(slug)
        .then((e) => setUserProfile(e))

      const followState = await appwriteFollowStatesService.getFollowState(slug);

      if (userData && userData.$id !== slug) {
        const followConnection = await appwriteFollowStatesService.getFollowConnection({
          followerId: userData.$id,
          followeeId: slug,
        });
        setIsFollowing(followConnection?.total > 0);
      }

      setFollowCount(followState || { followersCount: 0, followingCount: 0 });
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
  };

  if (error) return <h1>{error}</h1>;

  if (userProfile && userData && userData.$id !== slug && !isFollowing) {
    profileRecommendationSystem(slug);
  }

  return userProfile && userData ? (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <ProfileComponent
        followersCount={followCount?.followersCount}
        followingCount={followCount?.followingCount}
        isOwnProfile={userData?.$id === slug}
        username={userProfile.username}
        bio={userProfile.bio}
        imageUrl={userProfile.profilePic}
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