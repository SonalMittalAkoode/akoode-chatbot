"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getEmployeeById, updateEmployeeAPI } from "@/api/employee";
import { toast } from 'react-toastify';
import Image from 'next/image';
import resolveImageUrl from "@/utils/resolveImageUrl";

const toPreviewSrc = (value) => {
  if (!value) return null;
  if (/^(blob:|data:)/i.test(value)) return value;
  return resolveImageUrl(value);
};

// LinkedIn is optional; accept "linkedin.com/in/x" as well as a full URL.
const normalizeLinkedin = (value = "") => {
  // Strip every space, not just the ends — pasted profile URLs often carry one
  // in the middle, which URL() would happily encode as %20 into a dead link.
  const cleaned = value.replace(/\s+/g, "");
  if (!cleaned) return "";
  return /^https?:\/\//i.test(cleaned) ? cleaned : `https://${cleaned}`;
};

const isValidLinkedin = (value = "") => {
  if (!value) return true;
  try {
    return Boolean(new URL(normalizeLinkedin(value)).hostname);
  } catch {
    return false;
  }
};


const CreateList = () => {
  const params = useParams();

  const id = params?.id;

  const router = useRouter();
  const [employee, setEmployee] = useState({
    name: "",
    designation: "",
    email: "",
    linkedin: "",
    bio: "",
    quote: "",
    showOnTeam: true,
    status: true,
    priority: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchEmployee = async () => {
      try {
        const data = await getEmployeeById(id);
        if (data.status === 'success' && data.data) {
          setEmployee({
            name: data.data.name || "",
            designation: data.data.designation || "",
            email: data.data.email || "",
            linkedin: data.data.linkedin || "",
            bio: data.data.bio || "",
            quote: data.data.quote || "",
            showOnTeam: data.data.showOnTeam !== false,
            status: data.data.status !== undefined ? data.data.status : true,
            priority: data.data.priority !== undefined ? data.data.priority : 0
          });
          // show existing image if backend returns image URL/path as `image` or `imageUrl`
          if (data.data.image) setImagePreview(data.data.image);
          if (data.data.imageUrl) setImagePreview(data.data.imageUrl);
        }
      } catch (error) {
        console.error("Error fetching Employee:", error);
        setError("Failed to load employee data");
        toast.error("Failed to load employee data");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setImageFile(f);
    setImagePreview(f ? URL.createObjectURL(f) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all required fields
    if (!employee.name.trim()) {
      setError("Name is required");
      toast.error("Name is required");
      return;
    }
    if (!employee.designation.trim()) {
      setError("Designation is required");
      toast.error("Designation is required");
      return;
    }
    if (!employee.email.trim()) {
      setError("Email is required");
      toast.error("Email is required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(employee.email)) {
      setError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return;
    }

    if (!isValidLinkedin(employee.linkedin)) {
      setError("Please enter a valid LinkedIn URL");
      toast.error("Please enter a valid LinkedIn URL");
      return;
    }

    setError("");

    try {
      const fd = new FormData();
      fd.append("name", employee.name.trim());
      fd.append("designation", employee.designation.trim());
      fd.append("email", employee.email.trim().toLowerCase());
      fd.append("linkedin", normalizeLinkedin(employee.linkedin));
      fd.append("quote", employee.quote.trim());
      fd.append("bio", employee.bio.trim());
      fd.append("showOnTeam", employee.showOnTeam ? "true" : "false");
      fd.append("status", employee.status ? "true" : "false");
      fd.append("priority", (employee.priority || 0).toString());
      if (imageFile) fd.append("image", imageFile);

      const data = await updateEmployeeAPI(id, fd); // ensure updateEmployeeAPI accepts FormData

      if (data.status === 'success' || data._id) {
        toast.success(data.message || "Employee updated successfully!");
        setTimeout(() => {
          router.push("/thebusinesshub/employees");
        }, 1500);
      } else {
        toast.error(data.message || "Failed to update Employee.");
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message || "Failed to update Employee.");
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setEmployee((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleStatusChange = () => {
    setEmployee((prev) => ({ ...prev, status: !prev.status }));
  };

  if (loading) return <div className="text-center p-4"><p>Loading...</p></div>;

  return (
    <>
      <form onSubmit={handleSubmit} className="row">
        {error && <div className="col-12"><p className="text-danger">{error}</p></div>}
        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="employeeName">Employee Name</label>
            <input
              type="text"
              className="form-control"
              id="employeeName"
              name="name"
              value={employee.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="employeeDesignation">Employee Designation</label>
            <input
              type="text"
              className="form-control"
              id="employeeDesignation"
              name="designation"
              value={employee.designation}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="employeeEmail">Employee Email</label>
            <input
              type="email"
              className="form-control"
              id="employeeEmail"
              name="email"
              value={employee.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="employeeLinkedin">LinkedIn URL</label>
            {/* type="text": type="url" makes the browser block submit on a
                scheme-less value before normalizeLinkedin ever runs. */}
            <input
              type="text"
              inputMode="url"
              className="form-control"
              id="employeeLinkedin"
              name="linkedin"
              value={employee.linkedin}
              onChange={handleChange}
              placeholder="https://www.linkedin.com/in/username"
            />
            <small className="form-text text-muted">Optional — shown on the blog author card. Falls back to the Akoode company page.</small>
          </div>
        </div>
        {/* End .col */}

        <div className="col-xl-12">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="employeeQuote">Author Quote</label>
            <textarea
              className="form-control"
              id="employeeQuote"
              name="quote"
              rows={2}
              value={employee.quote}
              onChange={handleChange}
              placeholder="A one-line philosophy shown in the quote card on the author page."
            />
          </div>
        </div>
        {/* End .col */}

        <div className="col-xl-12">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="employeeBio">Author Bio</label>
            <textarea
              className="form-control"
              id="employeeBio"
              name="bio"
              rows={5}
              value={employee.bio}
              onChange={handleChange}
              placeholder="Long-form bio for the author page. Leave a blank line between paragraphs."
            />
            <small className="form-text text-muted">Each new line becomes its own paragraph on /author/[name].</small>
          </div>
        </div>
        {/* End .col */}

        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="employeePriority">Priority</label>
            <input
              type="number"
              className="form-control"
              id="employeePriority"
              name="priority"
              value={employee.priority || 0}
              onChange={handleChange}
              min="0"
              placeholder="0"
            />
            <small className="form-text text-muted">Lower numbers appear first (0 = highest priority)</small>
          </div>
        </div>
        {/* End .col */}

        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input ui_kit_select_search form-group">
            <label>Show on About Us page</label>
            <select
              className="selectpicker form-select"
              data-width="100%"
              value={employee.showOnTeam ? "yes" : "no"}
              onChange={(e) =>
                setEmployee((prev) => ({
                  ...prev,
                  showOnTeam: e.target.value === "yes",
                }))
              }
            >
              <option value="yes">Yes — show in the team carousel</option>
              <option value="no">No — hide from the team carousel</option>
            </select>
            <small className="form-text text-muted">Hiding here does not affect their author page or blog credits.</small>
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
              value={employee.status ? "active" : "deactive"}
              onChange={(e) =>
                setEmployee((prev) => ({
                  ...prev,
                  status: e.target.value === "active",
                }))
              }
            >
              <option value="active">Active</option>
              <option value="deactive">Deactive</option>
            </select>
          </div>
        </div>
        {/* End .col */}

        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label>Employee Image</label>
            <input type="file" accept="image/*" className="form-control" onChange={handleFileChange} />
            {toPreviewSrc(imagePreview) &&
              <Image
                src={toPreviewSrc(imagePreview)}
                alt="preview"
                width={120}
                height={80}
                unoptimized
                className="max-w-[120px] mt-2 h-auto"
              />
            }
          </div>
        </div>
        {/* End .col */}

        <div className="col-xl-12">
          <div className="my_profile_setting_input">
            <button className="btn btn1 float-start" type="button" onClick={() => window.location.href = '/thebusinesshub/employees'}>Back</button>
            <button className="btn btn2 float-end">Submit</button>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateList;
