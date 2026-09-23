"use client";
import Image from 'next/image';
import { useState } from "react";
import { addEmployeeAPI } from "@/api/employee.ts";
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";

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
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [quote, setQuote] = useState("");
  const [bio, setBio] = useState("");
  const [showOnTeam, setShowOnTeam] = useState(true);
  const [priority, setPriority] = useState(0);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const router = useRouter();

  const handleNameChange = (e) => {
    setName(e.target.value);

    // ✅ Clear the error when user starts typing
    if (e.target.value.trim() !== "") {
      setError("");
    }
  };
  const handleDesignationChange = (e) => {
    setDesignation(e.target.value);

    // ✅ Clear the error when user starts typing
    if (e.target.value.trim() !== "") {
      setError("");
    }
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);

    // ✅ Clear the error when user starts typing
    if (e.target.value.trim() !== "") {
      setError("");
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setImageFile(f);
    setImagePreview(f ? URL.createObjectURL(f) : null);
  };

  const addEmployee = async (e) => {
    e.preventDefault();

    // Validate all required fields
    if (!name.trim()) {
      setError("Name is required");
      toast.error("Name is required");
      return;
    }
    if (!designation.trim()) {
      setError("Designation is required");
      toast.error("Designation is required");
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      toast.error("Email is required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      return;
    }

    if (!isValidLinkedin(linkedin)) {
      setError("Please enter a valid LinkedIn URL");
      toast.error("Please enter a valid LinkedIn URL");
      return;
    }

    setError("");

    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("designation", designation.trim());
      fd.append("email", email.trim().toLowerCase());
      fd.append("linkedin", normalizeLinkedin(linkedin));
      fd.append("quote", quote.trim());
      fd.append("bio", bio.trim());
      fd.append("showOnTeam", showOnTeam ? "true" : "false");
      fd.append("status", "true");
      fd.append("priority", priority.toString());
      if (imageFile) fd.append("image", imageFile);

      const data = await addEmployeeAPI(fd); // ensure addEmployeeAPI supports FormData

      if (data.status === 'success') {
        toast.success(data.message || 'Employee added successfully!');
        // Reset all fields
        setName("");
        setDesignation("");
        setEmail("");
        setLinkedin("");
        setQuote("");
        setBio("");
        setShowOnTeam(true);
        setPriority(0);
        setImageFile(null);
        setImagePreview(null);
        // Redirect after showing toast
        setTimeout(() => {
          router.push("/thebusinesshub/employees");
        }, 1500);
      } else {
        toast.error(data.message || 'Failed to add employee');
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message || 'Failed to add employee');
    }
  };
  return (
    <>
      <form onSubmit={addEmployee} className="row">
        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="employeeName">Employee Name</label>
            <input type="text" className="form-control" id="employeeName" value={name} onChange={handleNameChange} />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        </div>
        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="employeeDesignation">Employee Designation</label>
            <input type="text" className="form-control" id="employeeDesignation" value={designation} onChange={handleDesignationChange} />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        </div>
        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="employeeEmail">Employee Email</label>
            <input type="email" className="form-control" id="employeeEmail" value={email} onChange={handleEmailChange} />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
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
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
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
              rows={2}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
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
              rows={5}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Long-form bio for the author page. Leave a blank line between paragraphs."
            />
            <small className="form-text text-muted">Each new line becomes its own paragraph on /author/[name].</small>
          </div>
        </div>
        {/* End .col */}

        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input ui_kit_select_search form-group">
            <label>Show on About Us page</label>
            <select
              className="selectpicker form-select"
              data-width="100%"
              value={showOnTeam ? "yes" : "no"}
              onChange={(e) => setShowOnTeam(e.target.value === "yes")}
            >
              <option value="yes">Yes — show in the team carousel</option>
              <option value="no">No — hide from the team carousel</option>
            </select>
            <small className="form-text text-muted">Hiding here does not affect their author page or blog credits.</small>
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
              value={priority}
              onChange={(e) => setPriority(parseInt(e.target.value) || 0)}
              min="0"
              placeholder="0"
            />
            <small className="form-text text-muted">Lower numbers appear first (0 = highest priority)</small>
          </div>
        </div>
        {/* End .col */}

        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label>Employee Image</label>
            <input type="file" accept="image/*" className="form-control" onChange={handleFileChange} />
            {imagePreview &&
              <Image
                src={imagePreview}
                alt="preview"
                width={120}
                height={80}
                unoptimized
                style={{ maxWidth: 120, marginTop: 8, height: "auto" }}
              />
            }
          </div>
        </div>
        {/* End .col */}

        <div className="col-lg-6 col-xl-6 d-none">
          <div className="my_profile_setting_input ui_kit_select_search form-group">
            <label>Status</label>
            <select
              className="selectpicker form-select"
              data-live-search="true"
              data-width="100%"
            >
              <option data-tokens="1">Active</option>
              <option data-tokens="2">Deactive</option>
            </select>
          </div>
        </div>
        {/* End .col */}




        <div className="col-xl-12">
          <div className="my_profile_setting_input">
            <button className="btn btn1 float-start" type="button" onClick={() => router.push('/thebusinesshub/employees')}>Back</button>
            <button type="submit" className="btn btn2 float-end">Submit</button>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateList;
