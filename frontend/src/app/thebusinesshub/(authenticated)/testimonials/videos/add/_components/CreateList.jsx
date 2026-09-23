"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addVideoAPI } from "@/api/video";
import { toast } from 'react-toastify';

const CreateList = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [embedCode, setEmbedCode] = useState("");
  const [status, setStatus] = useState(true);
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);

  const uploadImage = (e) => {
    setImage(e.target.files[0]);
  };

  const addVideo = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!title.trim()) {
      setError("Title is required");
      toast.error("Title is required");
      setIsSubmitting(false);
      return;
    }

    if (!embedCode.trim()) {
      setError("Embed Code is required");
      toast.error("Embed Code is required");
      setIsSubmitting(false);
      return;
    }

    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("embedCode", embedCode.trim());
      formData.append("status", status.toString());
      if (image) {
        formData.append("image", image);
      }

      const data = await addVideoAPI(formData);

      if (data.status === 'success') {
        toast.success(data.message || 'Video added successfully!');
        setTitle("");
        setEmbedCode("");
        setImage(null);
        setTimeout(() => {
          router.push("/thebusinesshub/testimonials/videos");
        }, 1500);
      } else {
        toast.error(data.message || 'Failed to add video');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add video';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={addVideo} className="row">
        <div className="col-lg-12 col-xl-12">
          <div className="wrap-custom-file">
            <input
              type="file"
              id="image"
              accept="image/png, image/gif, image/jpeg, image/jpg, image/webp"
              onChange={uploadImage}
            />
            <label
              style={
                image !== null
                  ? {
                        backgroundImage: `url(${URL.createObjectURL(image)})`,
                      }
                  : undefined
              }
              htmlFor="image"
            >
              <span>
                <i className="flaticon-download"></i> Upload Image{" "}
              </span>
            </label>
          </div>
        </div>
        {/* End .col */}
        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="VideoTitle">Video Title</label>
            <input
              type="text"
              className="form-control"
              id="VideoTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        </div>
        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input ui_kit_select_search form-group">
            <label>Status</label>
            <select
              className="selectpicker form-select"
              data-live-search="true"
              data-width="100%"
              value={status ? "active" : "deactive"}
              onChange={(e) => setStatus(e.target.value === "active")}
            >
              <option value="active">Active</option>
              <option value="deactive">Deactive</option>
            </select>
          </div>
        </div>
        {/* End .col */}

        {/* End .col */}
        <div className="col-lg-12 col-xl-12">
          <div className="my_profile_setting_textarea form-group">
            <label htmlFor="VideoEmbedCode">Embed Code (iframe)</label>
            <textarea
              id="VideoEmbedCode"
              className="form-control"
              rows="5"
              value={embedCode}
              onChange={(e) => setEmbedCode(e.target.value)}
              placeholder="Paste your iframe embed code here "
              required
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        </div>
        {/* End .col */}

        <div className="col-xl-12">
          <div className="my_profile_setting_input">
            <button
              className="btn btn1 float-start"
              type="button"
              onClick={() => router.push('/thebusinesshub/testimonials/videos')}
            >
              Back
            </button>
            <button
              type="submit"
              className="btn btn2 float-end"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Submit'}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateList;
