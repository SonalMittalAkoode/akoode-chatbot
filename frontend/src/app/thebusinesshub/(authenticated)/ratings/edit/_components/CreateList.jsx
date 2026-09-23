"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getRatingById, updateRatingAPI } from "@/api/rating";
import { toast } from 'react-toastify';

const CreateList = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [rating, setRating] = useState({
    title: "",
    value: "",
    suffix: "",
    order: 0,
    status: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchRating = async () => {
      try {
        const data = await getRatingById(id);
        if (data.status === 'success' && data.data) {
          setRating({
            title: data.data.title || "",
            value: data.data.value || "",
            suffix: data.data.suffix || "",
            order: data.data.order !== undefined ? data.data.order : 0,
            status: data.data.status !== undefined ? data.data.status : true
          });
        }
      } catch (error) {
        console.error("Error fetching Rating:", error);
        setError("Failed to load rating data");
        toast.error("Failed to load rating data");
      } finally {
        setLoading(false);
      }
    };
    fetchRating();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating.title.trim()) {
      setError("Title is required");
      toast.error("Title is required");
      return;
    }
    if (!rating.value.trim()) {
      setError("Value is required");
      toast.error("Value is required");
      return;
    }

    setError("");

    try {
      const ratingData = {
        title: rating.title.trim(),
        value: rating.value.trim(),
        suffix: rating.suffix.trim(),
        order: Number(rating.order),
        status: rating.status
      };
      const data = await updateRatingAPI(id, ratingData);

      if (data.status === 'success') {
        toast.success(data.message || 'Rating updated successfully!');
        setTimeout(() => {
          router.push("/thebusinesshub/ratings");
        }, 1500);
      } else {
        toast.error(data.message || 'Failed to update rating');
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message || "Failed to update Rating.");
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRating((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) return <div className="text-center p-4"><p>Loading...</p></div>;

  return (
    <>
      <form onSubmit={handleSubmit} className="row">
        {error && <div className="col-12"><p className="text-danger">{error}</p></div>}
        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="ratingTitle">Title</label>
            <input type="text" className="form-control" id="ratingTitle" name="title" value={rating.title} onChange={handleChange} />
          </div>
        </div>
        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="ratingValue">Value</label>
            <input type="text" className="form-control" id="ratingValue" name="value" value={rating.value} onChange={handleChange} />
          </div>
        </div>
        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="ratingSuffix">Suffix (e.g., /5, %, +)</label>
            <input type="text" className="form-control" id="ratingSuffix" name="suffix" value={rating.suffix} onChange={handleChange} />
          </div>
        </div>
        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="ratingOrder">Order</label>
            <input type="number" className="form-control" id="ratingOrder" name="order" value={rating.order} onChange={handleChange} />
          </div>
        </div>
        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input ui_kit_select_search form-group">
            <label>Status</label>
            <select
              className="selectpicker form-select"
              data-live-search="true"
              data-width="100%"
              name="status"
              value={rating.status}
              onChange={handleChange}
            >
              <option value="true">Active</option>
              <option value="false">Deactive</option>
            </select>
          </div>
        </div>
        <div className="col-xl-12">
          <div className="my_profile_setting_input">
            <button className="btn btn1 float-start" type="button" onClick={() => router.push('/thebusinesshub/ratings')}>Back</button>
            <button type="submit" className="btn btn2 float-end">Submit</button>
          </div>
        </div>
      </form>
    </>
  );
};
export default CreateList;

