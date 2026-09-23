"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addLifeAtAkoodeAPI } from "@/api/lifeAtAkoode";
import { toast } from 'react-toastify';

const CreateList = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState("Life at Akoode");
    const [status, setStatus] = useState(true);
    const [error, setError] = useState("");
    const [image, setImage] = useState(null);

    const uploadImage = (e) => {
        setImage(e.target.files[0]);
    };

    const addLifeAtAkoodeImage = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!image) {
            setError("Image is required");
            toast.error("Please select an image");
            setIsSubmitting(false);
            return;
        }

        setError("");

        try {
            const formData = new FormData();
            if (title.trim()) {
                formData.append("title", title.trim());
            }
            formData.append("status", status.toString());
            formData.append("image", image);

            const data = await addLifeAtAkoodeAPI(formData);

            if (data.status === 'success') {
                toast.success(data.message || 'Image added successfully!');
                setTitle("Life at Akoode");
                setImage(null);
                setTimeout(() => {
                    router.push("/thebusinesshub/life");
                }, 1500);
            } else {
                toast.error(data.message || 'Failed to add image');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to add image';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <form onSubmit={addLifeAtAkoodeImage} className="row">
                <div className="col-lg-12 col-xl-12">
                    <div className="wrap-custom-file">
                        <input
                            type="file"
                            id="image"
                            accept="image/png, image/gif, image/jpeg, image/jpg, image/webp"
                            onChange={uploadImage}
                            required
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
                        <label htmlFor="ImageTitle">Image Title (Optional)</label>
                        <input
                            type="text"
                            className="form-control"
                            id="ImageTitle"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Life at Akoode"
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

                <div className="col-xl-12">
                    <div className="my_profile_setting_input">
                        <button
                            className="btn btn1 float-start"
                            type="button"
                            onClick={() => router.push('/thebusinesshub/life')}
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            className="btn btn2 float-end"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default CreateList;
