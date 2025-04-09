import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './EditProfile.css';
import { profilePicSvg } from '../../assets/iconSvg';

export default function EditProfile({ username, avatarUrl, bio, onSubmit }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: username || '',
      bio: bio || '',
    },
  });

  const [preview, setPreview] = useState(avatarUrl || '');

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setValue('profilePic', [file]); 
    }
  };

  return (
    <form className="edit-profile" onSubmit={handleSubmit(onSubmit)}>
      <div className="image-upload">
        <label htmlFor="profilePic">
          {preview ? (
            <img src={preview} alt="Profile Preview" className="profile-pic" />
          ) : (
            <div className="svg-placeholder">{profilePicSvg}</div>
          )}
        </label>
        <input
          type="file"
          id="profilePic"
          accept="image/*"
          name="profilePic"
          onChange={handleImageChange}
        />
      </div>

      <div className="input-group">
        <label>Name</label>
        <input
          type="text"
          {...register('name', { required: true })}
          placeholder="Name"
        />
        {errors.name && <p className="error">Name is required</p>}
      </div>

      <div className="input-group">
        <label>Bio</label>
        <textarea
          rows="4"
          {...register('bio')}
          placeholder="Tell us about yourself"
        />
      </div>

      <button type="submit" className="save-button">
        Save Changes
      </button>
    </form>
  );
}
