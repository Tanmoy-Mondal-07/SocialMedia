import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Image } from 'lucide-react';
import Button from '../Button';

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
      setValue('profilePic', file); // Changed to directly set the file object
    } else {
      // If no file is selected (e.g., user cancels), reset the preview to the initial avatarUrl
      setPreview(avatarUrl || '');
      setValue('profilePic', null); // Or undefined, depending on your backend expectation
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-6 bg-body-0 border border-body-1000 rounded-xl space-y-6"
    >
      <div className="flex flex-col items-center space-y-2">
        <label htmlFor="profilePic" className="cursor-pointer">
          {preview ? (
            <img
              src={preview}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full object-cover border border-body-1000"
            />
          ) : (
            <div className="w-24 h-24 flex items-center justify-center rounded-full border border-body-1000">
              <Image className="text-text-color-600" />
            </div>
          )}
        </label>
        <input
          type="file"
          id="profilePic"
          accept="image/*"
          name="profilePic"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      <div className="space-y-1 text-left">
        <label className="block text-sm font-medium text-text-color-600">Name:</label>
        <input
          type="text"
          {...register('name', { required: true })}
          placeholder="Name"
          className="w-full border border-body-1000 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-body-1000"
        />
        {errors.name && <p className="text-sm text-text-denger">Name is required</p>}
      </div>

      <div className="space-y-1 text-left">
        <label className="block text-sm font-medium text-text-color-600">Bio:</label>
        <textarea
          rows="4"
          {...register('bio')}
          placeholder="Share a little about who you are, your passions, or what drives you."
          className="w-full border border-body-1000 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-body-1000"
        />
      </div>

      <Button
        type="submit"
        classNameActive="w-full"
      >
        Save Changes
      </Button>
    </form>
  );
}