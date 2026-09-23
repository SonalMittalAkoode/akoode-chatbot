"use client";

import { getLifeAtAkoodeTableData, deleteLifeAtAkoodeAPI } from "@/api/lifeAtAkoode";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import resolveImageUrl from "@/utils/resolveImageUrl";
import Image from 'next/image';

const TableData = () => {
    const [imageList, setImageList] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchImageData = async () => {
        try {
            setLoading(true);
            const data = await getLifeAtAkoodeTableData();
            setImageList(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching images:", error);
            toast.error("Failed to fetch images");
            setImageList([]);
        } finally {
            setLoading(false);
        }
    };

    const deleteImage = async (id, e) => {
        e?.preventDefault();
        const isConfirmed = window.confirm("Are you sure you want to delete this image?");
        if (!isConfirmed) return;

        try {
            const data = await deleteLifeAtAkoodeAPI(id);
            if (data.status === 'success') {
                toast.success(data.message || 'Image deleted successfully');
                setImageList((prevImageList) =>
                    prevImageList.filter((image) => image._id !== id)
                );
            } else {
                toast.error(data.message || 'Failed to delete image');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to delete image');
            console.error("Delete error:", error);
        }
    };

    useEffect(() => {
        fetchImageData();
    }, []);

    let theadContent = [
        "Image",
        "Title",
        "Date Published",
        "Status",
        "Action",
    ];

    let tbodyContent = imageList && imageList.length > 0 ? imageList.map((item) => {
        const imageUrl = item.image
            ? resolveImageUrl(item.image)
            : '/images/default-image.jpg';

        return (
            <tr key={item._id}>
                <td>
                    {item.image ? (
                        <Image
                            src={imageUrl}
                            alt={item.title || "Life at Akoode"}
                            width={120}
                            height={80}
                            className="object-cover rounded-[4px]"
                        />
                    ) : (
                        <span className="text-muted">No image</span>
                    )}
                </td>
                {/* End td */}
                <td scope="row">
                    <div className="feat_property list favorite_page style2">
                        <div className="details">
                            <div className="tc_content">
                                <h4>{item.title || 'Life at Akoode'}</h4>
                            </div>
                        </div>
                    </div>
                </td>
                {/* End td */}
                <td>
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric',
                    })}
                </td>
                {/* End td */}
                <td>
                    <span className={`status_tag ${item.status ? 'badge2' : 'badge'}`}>
                        {item.status ? "Active" : "Deactive"}
                    </span>
                </td>
                {/* End td */}
                <td>
                    <ul className="view_edit_delete_list mb0">
                        <li
                            className="list-inline-item"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Edit"
                        >
                            <button onClick={() => router.push(`/thebusinesshub/life/edit/${item._id}`)}>
                                <span className="flaticon-edit"></span>
                            </button>
                        </li>
                        {/* End li */}
                        <li
                            className="list-inline-item"
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Delete"
                        >
                            <a href="#" onClick={(e) => deleteImage(item._id, e)}>
                                <span className="flaticon-garbage"></span>
                            </a>
                        </li>
                    </ul>
                </td>
                {/* End td */}
            </tr>
        );
    }) : null;

    if (loading) {
        return (
            <div className="text-center p-4">
                <p>Loading images...</p>
            </div>
        );
    }

    return (
        <>
            <table className="table">
                <thead className="thead-light">
                    <tr>
                        {theadContent.map((value, i) => (
                            <th scope="col" key={i}>
                                {value}
                            </th>
                        ))}
                    </tr>
                </thead>
                {/* End thead */}
                <tbody>
                    {imageList && imageList.length > 0 ? (
                        tbodyContent
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center p-4">
                                No images found. <a href="/thebusinesshub/add-lifeatakcode">Add your first image</a>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
};

export default TableData;
