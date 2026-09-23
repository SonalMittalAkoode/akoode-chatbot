"use client";

import { useEffect, useState, useRef } from "react";
import { addBlogAPI } from "@/api/blog";
import { useRouter } from "next/navigation";
import { getBlogcategoryTableData } from "@/api/blogcategory";
import { getEmployeeTableData } from "@/api/employee";
import { toast } from 'react-toastify';
import HtmlEditor from "@/components/HtmlEditor";
import UploadWithAlt from "@/components/admin/UploadWithAlt";
import { fileNameToAlt } from "@/utils/imageAlt";
import { FiEye, FiSave, FiSend } from 'react-icons/fi';
import BlogPreviewModal from "../../_components/BlogPreviewModal";

const CreateList = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState({});
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [logoimagealt, setLogoimagealt] = useState("");
  const [blogcategories, setBlogcategories] = useState([]);
  const [selectedBlogcategory, setSelectedBlogcategory] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [customAuthorName, setCustomAuthorName] = useState("");
  const OTHER_AUTHOR_VALUE = "__other__";
  const customAuthorInputRef = useRef(null);
  const [metatitle, setMetatitle] = useState("");
  const [metadescription, setMetaDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchBlogcategories = async () => {
      try {
        const response = await getBlogcategoryTableData();
        setBlogcategories(response || []);
      } catch (err) {
        console.error("Error fetching Blogcategory:", err);
      }
    };
    const fetchEmployees = async () => {
      try {
        const response = await getEmployeeTableData();
        setEmployees(Array.isArray(response) ? response : []);
      } catch (err) {
        console.error("Error fetching Employees:", err);
      }
    };
    fetchBlogcategories();
    fetchEmployees();
  }, []);

  const uploadLogo = (e) => {
    const file = e.target.files[0];
    setLogo(file || null);
    setLogoPreview(file ? URL.createObjectURL(file) : "");
    if (file && !logoimagealt) setLogoimagealt(fileNameToAlt(file.name));
  };

  const [isSlugEdited, setIsSlugEdited] = useState(false);

  const slugify = (text) =>
    text.toString().toLowerCase().trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!isSlugEdited) {
      setSlug(slugify(newTitle));
      if (newTitle.trim()) setError(prev => ({ ...prev, slug: "" }));
    }
    if (newTitle.trim()) setError(prev => ({ ...prev, title: "" }));
  };

  const handleSlugChange = (e) => {
    setSlug(e.target.value);
    setIsSlugEdited(true);
    if (e.target.value.trim()) setError(prev => ({ ...prev, slug: "" }));
  };

  const handleBlogcategoryChange = (e) => setSelectedBlogcategory(e.target.value);

  const handleAuthorChange = (e) => {
    const value = e.target.value;
    setSelectedAuthor(value);
    if (value !== OTHER_AUTHOR_VALUE) setCustomAuthorName("");
  };

  const handleCustomAuthorChange = (e) => {
    const value = e.target.value;
    setCustomAuthorName(value);
    if (value.trim()) setSelectedAuthor(OTHER_AUTHOR_VALUE);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,+$/, '');
      if (newTag && !tags.includes(newTag)) setTags(prev => [...prev, newTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => setTags(prev => prev.filter(t => t !== tagToRemove));

  // Build FormData and submit — statusValue forces the status regardless of dropdown
  const buildAndSubmit = async (statusValue) => {
    if (!title.trim()) {
      setError(prev => ({ ...prev, title: "Title is required" }));
      return;
    }
    if (!slug.trim()) {
      setError(prev => ({ ...prev, slug: "Slug is required" }));
      return;
    }
    setError({});
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", slug);
      formData.append("description", description);
      formData.append("source", source);
      formData.append("date", date);
      formData.append("metatitle", metatitle);
      formData.append("metadescription", metadescription);
      formData.append("logoimagealt", logoimagealt);
      formData.append("blogcategory", selectedBlogcategory);
      formData.append("tags", tags.join(','));
      formData.append("status", statusValue);

      const rawCustomAuthor = (
        customAuthorInputRef.current?.value ?? customAuthorName
      ).trim();
      const isOther = selectedAuthor === OTHER_AUTHOR_VALUE;
      if (rawCustomAuthor) {
        formData.append("authorName", rawCustomAuthor);
      } else if (selectedAuthor && !isOther) {
        formData.append("author", selectedAuthor);
      }
      if (logo) formData.append("logo", logo);

      const data = await addBlogAPI(formData);
      toast.success(statusValue === "false" ? "Blog saved as draft!" : data.message);

      if (data.status === "success") {
        setTimeout(() => router.push("/thebusinesshub/blogs"), 1500);
      }
      setTitle(""); setDescription(""); setSlug("");
      setLogo(null); setLogoPreview(""); setLogoimagealt("");
    } catch (err) {
      setError(prev => ({ ...prev, general: err.message || "Failed to save blog" }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = (e) => { e.preventDefault(); buildAndSubmit("true"); };
  const handleSaveDraft = (e) => { e.preventDefault(); buildAndSubmit("false"); };

  // Data for preview modal
  const previewAuthor = selectedAuthor === OTHER_AUTHOR_VALUE
    ? customAuthorName
    : employees.find(e => e._id === selectedAuthor)?.name || '';
  const previewCategory = blogcategories.find(c => c._id === selectedBlogcategory)?.title || '';

  return (
    <>
      <BlogPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        data={{
          title,
          slug,
          description,
          date,
          imageUrl: logoPreview,
          author: previewAuthor,
          category: previewCategory,
          tags,
        }}
      />

      <form onSubmit={handlePublish} className="row">
        <div className="col-lg-12">
          <div style={{ fontWeight: 600, marginBottom: 6, color: "#484848" }}>Blog Featured Image</div>
          <UploadWithAlt
            altId="logoimagealt"
            altLabel="Image Alt Text"
            altValue={logoimagealt}
            altOnChange={setLogoimagealt}
            altPlaceholder="Describe the blog image"
            note="*minimum 260px x 260px"
            hasFile={!!(logoPreview || logo)}
            onRemove={() => {
              setLogo(null); setLogoPreview("");
              const inp = document.getElementById("blogImage1");
              if (inp) inp.value = "";
            }}
          >
            <div className="wrap-custom-file">
              <input
                type="file"
                id="blogImage1"
                accept="image/png, image/gif, image/jpeg, image/svg+xml, image/svg, image/webp, image/avif"
                onChange={uploadLogo}
              />
              <label
                style={logoPreview ? { backgroundImage: `url(${logoPreview})` } : undefined}
                htmlFor="blogImage1"
              >
                <span><i className="flaticon-download"></i> Upload Photo</span>
              </label>
            </div>
          </UploadWithAlt>
        </div>

        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input ui_kit_select_search form-group">
            <label htmlFor="BlogcategorySelect">Select Blog category</label>
            <select
              id="BlogcategorySelect"
              className="selectpicker form-select"
              value={selectedBlogcategory}
              onChange={handleBlogcategoryChange}
              data-live-search="true"
              data-width="100%"
            >
              <option value="">-- Select Blog category --</option>
              {blogcategories.map(c => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="blogTitle">Blog Title</label>
            <input type="text" className="form-control" id="blogTitle" value={title} onChange={handleTitleChange} />
            {error?.title && <p className="text-red-500 text-sm mt-1">{error.title}</p>}
          </div>
        </div>

        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="blogSlug">Blog Slug (SEO URL)</label>
            <input type="text" className="form-control" id="blogSlug" value={slug} onChange={handleSlugChange} />
            {error?.slug && <p className="text-red-500 text-sm mt-1">{error.slug}</p>}
          </div>
        </div>

        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="blogSource">Blog Source</label>
            <input type="text" className="form-control" id="blogSource" value={source} onChange={(e) => setSource(e.target.value)} />
          </div>
        </div>

        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="blogDate">Blog Date</label>
            <input type="date" className="form-control" id="blogDate" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>

        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input ui_kit_select_search form-group">
            <label htmlFor="Author">Select Author</label>
            <select
              id="Author"
              className="selectpicker form-select"
              value={selectedAuthor}
              onChange={handleAuthorChange}
              data-live-search="true"
              data-width="100%"
            >
              <option value="">-- Select Author --</option>
              <option value={OTHER_AUTHOR_VALUE}>Other</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>{emp.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={`col-lg-6 col-xl-6 ${selectedAuthor === OTHER_AUTHOR_VALUE ? "" : "d-none"}`}>
          <div className="my_profile_setting_input form-group">
            <label htmlFor="CustomAuthor">Custom Author Name</label>
            <input
              type="text"
              className="form-control"
              id="CustomAuthor"
              value={customAuthorName}
              ref={customAuthorInputRef}
              onChange={handleCustomAuthorChange}
              placeholder="Enter author name (not from employee list)"
            />
          </div>
        </div>

        <div className="col-lg-12">
          <div className="my_profile_setting_textarea form-group">
            <label htmlFor="blogDescription">Description</label>
            <HtmlEditor
              id="blogdescription"
              value={description}
              onChange={(value) => {
                setDescription(value);
                if (error?.description) setError(prev => ({ ...prev, description: "" }));
              }}
              placeholder="Enter blog description"
              height="300px"
            />
            {error.description && <span className="text-danger">{error.description}</span>}
          </div>
        </div>

        <div className="col-lg-12">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="blogTags">Blog Tags</label>
            <p style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Press Enter or comma to add a tag</p>
            {tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                {tags.map(tag => (
                  <span key={tag} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    background: '#eff1ff', border: '1px solid #d0d3ee',
                    borderRadius: 20, padding: '4px 10px', fontSize: 13, color: '#474972', fontWeight: 500,
                  }}>
                    #{tag}
                    <button type="button" onClick={() => removeTag(tag)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#474972', padding: '0 0 0 2px', fontSize: 16, lineHeight: 1, opacity: 0.6,
                    }}>×</button>
                  </span>
                ))}
              </div>
            )}
            <input
              type="text"
              className="form-control"
              id="blogTags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="e.g. React, Next.js, Web Development..."
            />
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

        <div className="mt30">
          <div className="col-lg-12">
            <h3 className="mb30">Meta Information</h3>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="my_profile_setting_input form-group">
                <label htmlFor="blogMetatitle">Meta Title</label>
                <input type="text" className="form-control" id="blogMetatitle" value={metatitle} onChange={(e) => setMetatitle(e.target.value)} />
              </div>
            </div>
            <div className="col-lg-12">
              <div className="my_profile_setting_textarea form-group">
                <label htmlFor="blogMetaDescription">Meta Description</label>
                <textarea id="blogMetaDescription" className="form-control" rows="7" value={metadescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="Enter meta description"></textarea>
                {error.metadescription && <span className="text-danger">{error.metadescription}</span>}
              </div>
            </div>
          </div>
        </div>

        {error.general && (
          <div className="col-lg-12">
            <p className="text-red-500 text-sm mt-2">{error.general}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="col-xl-12">
          <div className="my_profile_setting_input" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
            <button
              className="btn btn1"
              type="button"
              onClick={() => window.location.href = '/thebusinesshub/dashboard'}
            >
              Back
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {/* Preview */}
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  background: '#fff', border: '1.5px solid #474972',
                  borderRadius: 8, padding: '8px 18px',
                  color: '#474972', fontWeight: 600, fontSize: 14, cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#edeafd'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
              >
                <FiEye size={15} /> Preview
              </button>

              {/* Save Draft */}
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  background: '#fff', border: '1.5px solid #f59e0b',
                  borderRadius: 8, padding: '8px 18px',
                  color: '#b45309', fontWeight: 600, fontSize: 14,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.6 : 1,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.background = '#fef3c7'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
              >
                <FiSave size={15} /> {isSubmitting ? 'Saving...' : 'Save Draft'}
              </button>

              {/* Publish */}
              <button
                type="submit"
                className="btn btn2"
                disabled={isSubmitting}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}
              >
                <FiSend size={14} /> {isSubmitting ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateList;
