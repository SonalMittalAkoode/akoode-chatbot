"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getVideoById, updateVideoAPI } from "@/api/video";
import { toast } from 'react-toastify';

const CreateList = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [embedCode, setEmbedCode] = useState("");
  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const uploadImage = (e) => {
    setImagePreview(null);
    setImage(e.target.files[0]);
  };

  useEffect(() => {
    if (!id) return;
    const fetchVideo = async () => {
      try {
        const data = await getVideoById(id);
        if (data.status === 'success' && data.data) {
          setTitle(data.data.title || "");
          setEmbedCode(data.data.embedCode || "");
          setStatus(data.data.status !== undefined ? data.data.status : true);
          if (data.data.image) {
            setImagePreview(process.env.NEXT_PUBLIC_API_URL + data.data.image);
          }
        }
      } catch (error) {
        console.error("Error fetching Video:", error);
        setError("Failed to load video data");
        toast.error("Failed to load video data");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      toast.error("Title is required");
      return;
    }

    if (!embedCode.trim()) {
      setError("Embed Code is required");
      toast.error("Embed Code is required");
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

      const data = await updateVideoAPI(id, formData);

      if (data.status === 'success') {
        toast.success(data.message || "Video updated successfully!");
        setTimeout(() => {
          router.push("/thebusinesshub/testimonials/videos");
        }, 1500);
      } else {
        toast.error(data.message || "Failed to update Video.");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update Video.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(error);
    }
  };

  if (loading) return <div className="text-center p-4"><p>Loading...</p></div>;

  return (
    <>
      <form onSubmit={handleSubmit} className="row">
        {error && <div className="col-12"><p className="text-danger">{error}</p></div>}
        <div className="col-lg-12">
          <div className="wrap-custom-file">
            <input
              type="file"
              id="image"
              accept="image/png, image/gif, image/jpeg, image/jpg, image/webp"
              onChange={uploadImage}
            />
            <label
              htmlFor="image"
              style={
                imagePreview
                  ? { backgroundImage: `url(${imagePreview})` }
                  : image
                  ? { backgroundImage: `url(${URL.createObjectURL(image)})` }
                  : undefined
              }
            >
              <span>
                <i className="flaticon-download"></i> Upload Image{" "}
              </span>
            </label>
          </div>
          <p>*Optional - Recommended size: 1280x720px</p>
        </div>
        {/* End .col */}
        <div className="col-lg-12">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="VideoTitle">Video Title</label>
            <input
              type="text"
              className="form-control"
              id="VideoTitle"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
        </div>
        {/* End .col */}
        <div className="col-lg-12">
          <div className="my_profile_setting_textarea form-group">
            <label htmlFor="VideoEmbedCode">Embed Code (iframe)</label>
            <textarea
              id="VideoEmbedCode"
              className="form-control"
              name="embedCode"
              rows="5"
              value={embedCode}
              onChange={(e) => setEmbedCode(e.target.value)}
              placeholder="Paste your iframe embed code here (e.g., &lt;iframe src=&quot;...&quot;&gt;&lt;/iframe&gt;)"
              required
            />
          </div>
        </div>
        {/* End .col */}
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

        <div className="col-xl-12">
          <div className="my_profile_setting_input">
            <button
              className="btn btn1 float-start"
              type="button"
              onClick={() => router.push('/thebusinesshub/testimonials/videos')}
            >
              Back
            </button>
            <button className="btn btn2 float-end">Submit</button>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateList;
