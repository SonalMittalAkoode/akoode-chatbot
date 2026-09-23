"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getLifeAtAkoodeByID, updateLifeAtAkoodeAPI } from "@/api/lifeAtAkoode";
import { toast } from 'react-toastify';

const CreateList = () => {
    const params = useParams();
    const id = params?.id;
    const router = useRouter();
    const [title, setTitle] = useState("");
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
        const fetchImage = async () => {
            try {
                const data = await getLifeAtAkoodeByID(id);
                if (data) {
                    setTitle(data.title || "Life at Akoode");
                    setStatus(data.status !== undefined ? data.status : true);
                    if (data.image) {
                        setImagePreview(process.env.NEXT_PUBLIC_API_URL + data.image);
                    }
                }
            } catch (error) {
                console.error("Error fetching image:", error);
                setError("Failed to load image data");
                toast.error("Failed to load image data");
            } finally {
                setLoading(false);
            }
        };

        fetchImage();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        try {
            const formData = new FormData();
            if (title.trim()) {
                formData.append("title", title.trim());
            }
            formData.append("status", status.toString());
            if (image) {
                formData.append("image", image);
            }

            const data = await updateLifeAtAkoodeAPI(id, formData);

            if (data.status === 'success') {
                toast.success(data.message || "Image updated successfully!");
                setTimeout(() => {
                    router.push("/thebusinesshub/life");
                }, 1500);
            } else {
                toast.error(data.message || "Failed to update image.");
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to update image.";
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
                    <p>*Optional - Update image if needed</p>
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
                            onClick={() => router.push('/thebusinesshub/life')}
                        >
                            Back
                        </button>
                        <button className="btn btn2 float-end">Update</button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default CreateList;
