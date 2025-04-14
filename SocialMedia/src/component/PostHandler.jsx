import React, { useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ImageIcon } from "lucide-react";
import { Button } from ".";

const visibilityOptions = ["public", "friends", "private"];

export default function PostHandler({
  initialtitle="",
  initialContent = "",
  initialVisibility = "public",
  initialMedia = null,
  onSubmit
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: initialtitle,
      content: initialContent,
      visibility: initialVisibility,
      media: initialMedia
    }
  });

  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleFile = (file) => {
    if (!file || !["image/jpeg","image/jpg", "image/png"].includes(file.type)) {
      setValue("media", null);
      setPreview(null);
      return;
    }

    setValue("media", file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e) => {
    if (e.target.files.length) {
      handleFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (initialMedia && typeof initialMedia === "string") {
      setPreview(initialMedia);
    }
  }, [initialMedia]);

  const onFormSubmit = (data) => {
    if (onSubmit) onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="space-y-5 max-w-md mx-auto p-6 border rounded-2xl shadow bg-bground-100 border-fground-200"
    >
      <h2 className="text-xl font-semibold text-center text-fground-200">
        Create a Post
      </h2>

      {/* Image Upload */}
      <div
        onClick={handleClick}
        className="border-2 border-dashed border-[--color-bground-200] bg-[--color-bground-200] rounded-lg p-4 cursor-pointer text-center"
      >
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
        ) : (
          <div className="flex flex-col items-center text-[--color-mground-100]">
            <ImageIcon className="w-10 h-10 mb-2" />
            <p className="text-sm">Click to upload (.jpg .jpeg .png)</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpg,image/jpeg,image/png"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {/* Visibility */}
      <select
        {...register("visibility")}
        className="w-full p-3 border rounded-lg text-[--color-fground-100] bg-[--color-bground-100] border-[--color-bground-200]"
      >
        <option value="" disabled>
          Select visibility
        </option>
        {visibilityOptions.map((option) => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>

      {/* Title */}
      <input
        type="text"
        placeholder="Title"
        {...register("title", { required: true })}
        className="w-full p-3 border rounded-lg text-[--color-fground-100] bg-[--color-bground-100] border-[--color-bground-200]"
      />
      {errors.title && <p className="text-red-500 text-sm">Title is required.</p>}

      {/* Content */}
      <textarea
        placeholder="What's on your mind? (Optional)"
        {...register("content")}
        className="w-full p-3 border rounded-lg min-h-[100px] text-[--color-fground-100] bg-[--color-bground-100] border-[--color-bground-200]"
      />

      <Button type="submit" classNameActive="w-full">
        {initialContent ? "Update Post" : "Create Post"}
      </Button>
    </form>
  );
}
