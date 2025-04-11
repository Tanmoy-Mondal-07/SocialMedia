import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Image } from 'lucide-react';

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-6 bg-bground-100 border border-fground-200 rounded-xl space-y-6"
    >
      <div className="flex flex-col items-center space-y-2">
        <label htmlFor="profilePic" className="cursor-pointer">
          {preview ? (
            <img
              src={preview}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full object-cover border border-fground-200"
            />
          ) : (
            <div className="w-24 h-24 flex items-center justify-center rounded-full border border-fground-200">
              <Image className="text-fground-200" />
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
        <label className="block text-sm font-medium text-fground-200">Name:</label>
        <input
          type="text"
          {...register('name', { required: true })}
          placeholder="Name"
          className="w-full border border-fground-200 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-fground-200"
        />
        {errors.name && <p className="text-sm text-red-600">Name is required</p>}
      </div>

      <div className="space-y-1 text-left">
        <label className="block text-sm font-medium text-fground-200">Bio:</label>
        <textarea
          rows="4"
          {...register('bio')}
          placeholder="Share a little about who you are, your passions, or what drives you."
          className="w-full border border-fground-200 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-fground-200"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-fground-200 text-bground-100 py-2 rounded hover:opacity-90 transition"
      >
        Save Changes
      </button>
    </form>
  );
}