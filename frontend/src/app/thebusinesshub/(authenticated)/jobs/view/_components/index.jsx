"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getJobPostingById } from "@/api/jobPosting";
import { toast } from 'react-toastify';

const JobView = () => {
    const params = useParams();
    const id = params?.id;
    const router = useRouter();
    const [job, setJob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                const data = await getJobPostingById(id);
                setJob(data);
            } catch (err) {
                toast.error(err.message || "Failed to load job details");
            } finally {
                setIsLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    if (isLoading) return <div className="text-center py-5"><p>Loading job details...</p></div>;
    if (!job) return <div className="text-center py-5"><p>Job not found.</p></div>;

    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="my_profile_setting_input form-group">
                    <label><strong>Job Title:</strong></label>
                    <p className="form-control-static">{job.title}</p>
                </div>
            </div>
            <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                    <label><strong>Tag:</strong></label>
                    <p className="form-control-static">{job.tag || "-"}</p>
                </div>
            </div>
            <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                    <label><strong>Location:</strong></label>
                    <p className="form-control-static">{job.location || "-"}</p>
                </div>
            </div>
            <div className="col-lg-12">
                <div className="my_profile_setting_input form-group">
                    <label><strong>Short Description:</strong></label>
                    <p className="form-control-static">{job.shortDescription || "-"}</p>
                </div>
            </div>
            <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                    <label><strong>Experience:</strong></label>
                    <p className="form-control-static">{job.experience || "-"}</p>
                </div>
            </div>
            <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                    <label><strong>Salary:</strong></label>
                    <p className="form-control-static">{job.salary || "-"}</p>
                </div>
            </div>
            <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                    <label><strong>Deadline:</strong></label>
                    <p className="form-control-static">{job.deadline ? new Date(job.deadline).toLocaleDateString() : "-"}</p>
                </div>
            </div>
            <div className="col-lg-6">
                <div className="my_profile_setting_input form-group">
                    <label><strong>Status:</strong></label>
                    <p className="form-control-static">{job.isActive ? "Active" : "Inactive"}</p>
                </div>
            </div>
            <div className="col-lg-12">
                <div className="my_profile_setting_input form-group">
                    <label><strong>Full Description:</strong></label>
                    <div className="form-control-static" dangerouslySetInnerHTML={{ __html: job.description }} />
                </div>
            </div>
            <div className="col-lg-12 mt-4">
                <button onClick={() => router.back()} className="btn btn-thm">Back to List</button>
            </div>
        </div>
    );
};

export default JobView;
