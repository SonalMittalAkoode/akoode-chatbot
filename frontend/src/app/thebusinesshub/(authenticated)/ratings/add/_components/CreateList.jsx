"use client";
import { useState } from "react";
import { addRatingAPI } from "@/api/rating.ts";
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";

const CreateList = () => {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [suffix, setSuffix] = useState("");
  const [order, setOrder] = useState(0);
  const [status, setStatus] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      toast.error("Title is required");
      return;
    }
    if (!value.trim()) {
      setError("Value is required");
      toast.error("Value is required");
      return;
    }

    setError("");

    try {
      const ratingData = { title, value, suffix, order: Number(order), status };
      const data = await addRatingAPI(ratingData);

      if (data.status === 'success') {
        toast.success(data.message || 'Rating added successfully!');
        setTitle("");
        setValue("");
        setSuffix("");
        setOrder(0);
        setStatus(true);
        setTimeout(() => {
          router.push("/thebusinesshub/ratings");
        }, 1500);
      } else {
        toast.error(data.message || 'Failed to add rating');
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message || 'Failed to add rating');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="row">
        {error && <div className="col-12"><p className="text-danger">{error}</p></div>}
        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="ratingTitle">Title</label>
            <input type="text" className="form-control" id="ratingTitle" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
        </div>
        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="ratingValue">Value</label>
            <input type="text" className="form-control" id="ratingValue" value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
        </div>
        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="ratingSuffix">Suffix (e.g., /5, %, +)</label>
            <input type="text" className="form-control" id="ratingSuffix" value={suffix} onChange={(e) => setSuffix(e.target.value)} />
          </div>
        </div>
        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="ratingOrder">Order</label>
            <input type="number" className="form-control" id="ratingOrder" value={order} onChange={(e) => setOrder(e.target.value)} />
          </div>
        </div>
        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input ui_kit_select_search form-group">
            <label>Status</label>
            <select
              className="selectpicker form-select"
              data-live-search="true"
              data-width="100%"
              value={status}
              onChange={(e) => setStatus(e.target.value === "true")}
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

