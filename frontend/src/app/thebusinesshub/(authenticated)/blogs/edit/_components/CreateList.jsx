"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { getBlogById, updateBlogAPI } from "@/api/blog";
import { revalidatePublic } from "@/utils/revalidatePublic";
import { getBlogcategoryTableData } from "@/api/blogcategory";
import { getEmployeeTableData } from "@/api/employee";
import { toast } from 'react-toastify';
import HtmlEditor from "@/components/HtmlEditor";
import UploadWithAlt from "@/components/admin/UploadWithAlt";
import { fileNameToAlt } from "@/utils/imageAlt";
import { FiEye, FiSave, FiSend } from 'react-icons/fi';
// BlogPreviewModal removed — Preview now saves as draft and opens the live page in a new tab

const CreateList = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [source, setSource] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState({});
  const [logo, setLogo] = useState(null);
  const [logoimage, setLogoImage] = useState(null);
  const [logoimagealt, setLogoimagealt] = useState("");
  const [metatitle, setMetatitle] = useState("");
  const [metadescription, setMetaDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [blogcategories, setBlogcategories] = useState([]);
  const [selectedBlogcategory, setSelectedBlogcategory] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [customAuthorName, setCustomAuthorName] = useState("");
  const OTHER_AUTHOR_VALUE = "__other__";
  const customAuthorInputRef = useRef(null);

  const slugify = (text) =>
    text.toString().toLowerCase().trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setSlug(slugify(e.target.value));
  };

  const uploadLogo = (e) => {
    const file = e.target.files[0];
    setLogoImage("");
    setLogo(file || null);
    if (file && !logoimagealt) setLogoimagealt(fileNameToAlt(file.name));
  };

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const data = await getBlogById(id);
        setTitle(data.data.title);
        setSlug(data.data.slug);
        setStatus(data.data.status !== false);
        setDescription(data.data.description);
        setSource(data.data.source);
        setDate(data.data.date ? data.data.date.slice(0, 10) : "");
        setMetatitle(data.data.metatitle || "");
        setMetaDescription(data.data.metadescription || "");

        const blogcategoryId = typeof data.data.blogcategory === 'object'
          ? data.data.blogcategory._id
          : data.data.blogcategory;
        setSelectedBlogcategory(blogcategoryId);

        if (data.data.author) {
          const authorId = typeof data.data.author === 'object'
            ? data.data.author._id
            : data.data.author;
          setSelectedAuthor(authorId);
        }
        if (data.data.authorName) {
          setCustomAuthorName(data.data.authorName);
          setSelectedAuthor(OTHER_AUTHOR_VALUE);
        }
        if (data.data.logoimage) {
          setLogoImage(process.env.NEXT_PUBLIC_API_URL + data.data.logoimage);
        }
        setLogoimagealt(data.data.logoimagealt || "");
        if (Array.isArray(data.data.tags)) setTags(data.data.tags.filter(Boolean));
      } catch (err) {
        console.error("Error fetching Blog:", err);
      } finally {
        setLoading(false);
      }
    };

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

    fetchBlog();
    fetchBlogcategories();
    fetchEmployees();
  }, [id]);

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

  // Build FormData and submit — statusValue forces the status; redirects unless openPreview=true
  const buildAndSubmit = async (statusValue, { openPreview = false } = {}) => {
    if (!title.trim()) {
      setError(prev => ({ ...prev, title: "Title is required" }));
      return;
    }
    setError({});
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", slug);
      formData.append("description", description);
      formData.append("blogcategory", selectedBlogcategory);
      formData.append("source", source);
      formData.append("date", date);
      formData.append("status", statusValue);
      formData.append("metatitle", metatitle);
      formData.append("metadescription", metadescription);
      formData.append("logoimagealt", logoimagealt);
      formData.append("tags", tags.join(','));

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

      const res = await updateBlogAPI(id, formData);

      if (openPreview) {
        toast.success("Saved as draft. Opening preview...");
        if (res.status === "success") {
          // Preview must open on the SAME origin as the admin — drafts only
          // exist in the database the admin is connected to. Using
          // NEXT_PUBLIC_SITE_URL would send local-admin previews to prod.
          const siteUrl = typeof window !== "undefined"
            ? window.location.origin
            : process.env.NEXT_PUBLIC_SITE_URL || "";
          const previewSecret = process.env.NEXT_PUBLIC_PREVIEW_SECRET;
          // Enable draft mode (sets the preview cookie) then redirect to the
          // post. The blog page is now statically cached, so preview drafts
          // are only served through draft mode — not a ?preview= query param.
          const target = encodeURIComponent(`/blog/${slug}`);
          window.open(
            `${siteUrl}/api/preview/enable?secret=${encodeURIComponent(previewSecret || "")}&redirect=${target}`,
            "_blank"
          );
        }
      } else {
        toast.success(statusValue === "false" ? "Blog saved as draft!" : res.message);
        if (res.status === "success") {
          // Refresh the live post immediately instead of waiting out the 1h ISR window.
          if (slug) revalidatePublic(`/blog/${slug}`);
          setTimeout(() => router.push("/thebusinesshub/blogs"), 1500);
        }
      }
    } catch (err) {
      toast.error("Failed to update blog.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = (e) => { e.preventDefault(); buildAndSubmit(status ? "true" : "false"); };
  const handleSaveDraft = (e) => { e.preventDefault(); buildAndSubmit("false"); };
  const handlePreview = (e) => { e.preventDefault(); buildAndSubmit("false", { openPreview: true }); };


  if (loading) return <p>Loading...</p>;

  return (
    <>

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
            hasFile={!!(logoimage || logo)}
            onRemove={() => {
              setLogo(null); setLogoImage(null);
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
                htmlFor="blogImage1"
                style={
                  logoimage
                    ? { backgroundImage: `url(${logoimage})` }
                    : logo
                      ? { backgroundImage: `url(${URL.createObjectURL(logo)})` }
                      : undefined
                }
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
            <label htmlFor="BlogTitle">Blog Title</label>
            <input
              type="text" className="form-control" id="BlogTitle"
              name="title" value={title} onChange={handleTitleChange}
            />
            {error?.title && <p className="text-red-500 text-sm mt-1">{error.title}</p>}
          </div>
        </div>

        <div className="col-lg-6 col-xl-6">
          <div className="my_profile_setting_input form-group">
            <label htmlFor="BlogSlug">Blog Slug (SEO URL)</label>
            <input
              type="text" className="form-control" id="BlogSlug"
              name="slug" value={slug} onChange={(e) => setSlug(e.target.value)}
            />
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
              type="text" className="form-control" id="CustomAuthor"
              value={customAuthorName} ref={customAuthorInputRef}
              onChange={handleCustomAuthorChange}
              placeholder="Enter author name (not from employee list)"
            />
          </div>
        </div>

        <div className="col-lg-12">
          <div className="my_profile_setting_textarea form-group">
            <label htmlFor="BlogDescription">Description</label>
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
              type="text" className="form-control" id="blogTags"
              value={tagInput} onChange={(e) => setTagInput(e.target.value)}
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

        {/* Action buttons */}
        <div className="col-xl-12">
          <div className="my_profile_setting_input" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
            <button
              className="btn btn1"
              type="button"
              onClick={() => window.location.href = '/thebusinesshub/blogs'}
            >
              Back
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {/* Preview — saves as draft then opens frontend blog page in new tab */}
              <button
                type="button"
                onClick={handlePreview}
                disabled={isSubmitting}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  background: '#fff', border: '1.5px solid #474972',
                  borderRadius: 8, padding: '8px 18px',
                  color: '#474972', fontWeight: 600, fontSize: 14,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.6 : 1,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.background = '#edeafd'; }}
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

              {/* Publish / Update */}
              <button
                type="submit"
                className="btn btn2"
                disabled={isSubmitting}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}
              >
                <FiSend size={14} /> {isSubmitting ? 'Saving...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateList;
