"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addJobPosting } from "@/api/jobPosting";
import { toast } from 'react-toastify';
import HtmlEditor from "@/components/HtmlEditor";

// Helper function to generate slug from title
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

const CreateList = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [tag, setTag] = useState("");
  const [location, setLocation] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [experience, setExperience] = useState("");
  const [salary, setSalary] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [metatitle, setMetatitle] = useState("");
  const [metadescription, setMetadescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Auto-generate slug when title changes (if not manually edited)
  useEffect(() => {
    if (title && !isSlugManual) {
      setSlug(generateSlug(title));
    }
  }, [title, isSlugManual]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      setIsSubmitting(false);
      return;
    }
    if (!deadline) {
      setError("Deadline is required");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        title,
        slug: slug || generateSlug(title),
        tag,
        location,
        shortDescription,
        description,
        experience,
        salary,
        deadline: new Date(deadline).toISOString(),
        isActive,
        metatitle,
        metadescription,
      };

      const data = await addJobPosting(payload);
      toast.success(data.message || "Job posting created successfully!");
      
      setTimeout(() => {
        router.push("/thebusinesshub/jobs");
      }, 1500);
    } catch (err) {
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Failed to create job posting");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="row">
      {error && (
        <div className="col-lg-12">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      )}

      <div className="col-lg-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="title">Job Title <span className="text-danger">*</span></label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter job title"
            required
          />
        </div>
      </div>

      <div className="col-lg-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="slug">Slug</label>
          <input
            type="text"
            className="form-control"
            id="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setIsSlugManual(true);
            }}
            onBlur={(e) => {
              // Clean up slug on blur
              const cleaned = generateSlug(e.target.value);
              setSlug(cleaned);
            }}
            placeholder="Auto-generated from title"
          />
          {/* <small className="form-text text-muted">
            URL-friendly identifier (auto-generated from title)
          </small> */}
        </div>
      </div>

      <div className="col-lg-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="tag">Tag</label>
          <input
            type="text"
            className="form-control"
            id="tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="e.g., Full Time, Part Time"
          />
        </div>
      </div>

      <div className="col-lg-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            className="form-control"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Gurgaon, Remote"
          />
        </div>
      </div>

      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="shortDescription">Short Description</label>
          <textarea
            className="form-control"
            id="shortDescription"
            rows="3"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Brief summary shown in listings"
          />
        </div>
      </div>

      <div className="col-lg-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="experience">Experience</label>
          <input
            type="text"
            className="form-control"
            id="experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="e.g., 5 Years, 2-4 Years"
          />
        </div>
      </div>

      <div className="col-lg-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="salary">Salary</label>
          <input
            type="text"
            className="form-control"
            id="salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            placeholder="e.g., Not disclosed, 10-15 LPA"
          />
        </div>
      </div>

      <div className="col-lg-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="deadline">Deadline <span className="text-danger">*</span></label>
          <input
            type="date"
            className="form-control"
            id="deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="description">Description</label>
          <HtmlEditor
            value={description}
            onChange={setDescription}
            placeholder="Enter job description"
          />
        </div>
      </div>

      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="isActive">
              Active (Job posting will be visible on career page)
            </label>
          </div>
        </div>
      </div>

      <div className="col-lg-12 mt30">
        <h3 className="mb30">Meta Information</h3>
      </div>

      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="metatitle">Meta Title</label>
          <input
            type="text"
            className="form-control"
            id="metatitle"
            value={metatitle}
            onChange={(e) => setMetatitle(e.target.value)}
            placeholder="SEO title (defaults to job title if empty)"
          />
        </div>
      </div>

      <div className="col-lg-12">
        <div className="my_profile_setting_textarea form-group">
          <label htmlFor="metadescription">Meta Description</label>
          <textarea
            className="form-control"
            id="metadescription"
            rows="4"
            value={metadescription}
            onChange={(e) => setMetadescription(e.target.value)}
            placeholder="SEO description shown in search results (defaults to short description if empty)"
          />
        </div>
      </div>

      <div className="col-lg-12">
        <div className="my_profile_setting_input">
          <button
            type="submit"
            className="btn btn-thm"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Job Posting"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateList;

