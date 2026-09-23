"use client";

import { useEffect, useState } from "react";
import { addBlogCategoryGroupAPI } from "@/api/blogcategorygroup";
import { getBlogcategoryTableData } from "@/api/blogcategory";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import CategoryMultiSelect from "../../_components/CategoryMultiSelect";

const slugify = (value) =>
  (value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const CreateList = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    label: "",
    slug: "",
    heading: "",
    headingAccent: "",
    subtitle: "",
    order: 0,
    categoryIds: [],
  });

  useEffect(() => {
    getBlogcategoryTableData().then((data) => setCategories(Array.isArray(data) ? data : []));
  }, []);

  const handleLabelChange = (e) => {
    const label = e.target.value;
    setForm((prev) => ({
      ...prev,
      label,
      slug: slugTouched ? prev.slug : slugify(label),
    }));
    if (label.trim()) setErrors((prev) => ({ ...prev, label: undefined }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (value.trim()) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.label.trim()) nextErrors.label = "Label is required";
    if (!form.slug.trim()) nextErrors.slug = "Slug is required";
    if (!form.heading.trim()) nextErrors.heading = "Heading is required";
    if (!form.headingAccent.trim()) nextErrors.headingAccent = "Heading accent is required";
    if (!form.subtitle.trim()) nextErrors.subtitle = "Subtitle is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const data = await addBlogCategoryGroupAPI({
        ...form,
        slug: slugify(form.slug),
        order: Number(form.order) || 0,
      });
      toast.success(data.message);
      if (data.status === "success") {
        setTimeout(() => {
          router.push("/thebusinesshub/blogs/categorygroups");
        }, 1500);
      }
    } catch (error) {
      toast.error(error.message || "Failed to add category group.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="row">
      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="groupLabel">Pill Label</label>
          <input
            type="text"
            className="form-control"
            id="groupLabel"
            value={form.label}
            onChange={handleLabelChange}
          />
          {errors.label && <p className="text-red-500 text-sm mt-1">{errors.label}</p>}
        </div>
      </div>

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="groupSlug">Slug (used in /blog/category/[slug] URLs)</label>
          <input
            type="text"
            className="form-control"
            id="groupSlug"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              handleChange(e);
            }}
            name="slug"
          />
          {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
        </div>
      </div>

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="groupHeading">Section Heading (first line)</label>
          <input
            type="text"
            className="form-control"
            id="groupHeading"
            name="heading"
            value={form.heading}
            onChange={handleChange}
          />
          {errors.heading && <p className="text-red-500 text-sm mt-1">{errors.heading}</p>}
        </div>
      </div>

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="groupHeadingAccent">Section Heading (accent line)</label>
          <input
            type="text"
            className="form-control"
            id="groupHeadingAccent"
            name="headingAccent"
            value={form.headingAccent}
            onChange={handleChange}
          />
          {errors.headingAccent && <p className="text-red-500 text-sm mt-1">{errors.headingAccent}</p>}
        </div>
      </div>

      <div className="col-lg-8 col-xl-8">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="groupSubtitle">Section Subtitle</label>
          <input
            type="text"
            className="form-control"
            id="groupSubtitle"
            name="subtitle"
            value={form.subtitle}
            onChange={handleChange}
          />
          {errors.subtitle && <p className="text-red-500 text-sm mt-1">{errors.subtitle}</p>}
        </div>
      </div>

      <div className="col-lg-4 col-xl-4">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="groupOrder">Display Order</label>
          <input
            type="number"
            className="form-control"
            id="groupOrder"
            name="order"
            value={form.order}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="col-lg-12">
        <div className="my_profile_setting_input form-group">
          <label>Blog Categories Included In This Group</label>
          <CategoryMultiSelect
            categories={categories}
            selectedIds={form.categoryIds}
            onChange={(categoryIds) => setForm((prev) => ({ ...prev, categoryIds }))}
          />
        </div>
      </div>

      <div className="col-xl-12">
        <div className="my_profile_setting_input">
          <button
            className="btn btn1 float-start"
            type="button"
            onClick={() => (window.location.href = "/thebusinesshub/blogs/categorygroups")}
          >
            Back
          </button>
          <button type="submit" className="btn btn2 float-end" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateList;
