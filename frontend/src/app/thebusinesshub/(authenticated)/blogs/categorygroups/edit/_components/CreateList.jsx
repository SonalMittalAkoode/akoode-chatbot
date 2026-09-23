"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getBlogCategoryGroupById, updateBlogCategoryGroupAPI } from "@/api/blogcategorygroup";
import { getBlogcategoryTableData } from "@/api/blogcategory";
import { toast } from "react-toastify";
import CategoryMultiSelect from "../../_components/CategoryMultiSelect";

const slugify = (value) =>
  (value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const CreateList = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    label: "",
    slug: "",
    heading: "",
    headingAccent: "",
    subtitle: "",
    order: 0,
    categoryIds: [],
    status: true,
  });

  useEffect(() => {
    getBlogcategoryTableData().then((data) => setCategories(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchGroup = async () => {
      try {
        const res = await getBlogCategoryGroupById(id);
        const group = res.data;
        setForm({
          label: group.label || "",
          slug: group.slug || "",
          heading: group.heading || "",
          headingAccent: group.headingAccent || "",
          subtitle: group.subtitle || "",
          order: group.order ?? 0,
          categoryIds: (group.categoryIds || []).map((c) => (typeof c === "string" ? c : c._id)),
          status: group.status,
        });
      } catch (error) {
        console.error("Error fetching category group:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [id]);

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

    try {
      const data = await updateBlogCategoryGroupAPI(id, {
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
      toast.error(error.message || "Failed to update category group.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="row">
      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input form-group">
          <label htmlFor="groupLabel">Pill Label</label>
          <input
            type="text"
            className="form-control"
            id="groupLabel"
            name="label"
            value={form.label}
            onChange={handleChange}
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
            name="slug"
            value={form.slug}
            onChange={handleChange}
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

      <div className="col-lg-6 col-xl-6">
        <div className="my_profile_setting_input ui_kit_select_search form-group">
          <label>Status</label>
          <select
            className="selectpicker form-select"
            data-live-search="true"
            data-width="100%"
            value={form.status ? "active" : "deactive"}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, status: e.target.value === "active" }))
            }
          >
            <option value="active">Active</option>
            <option value="deactive">Deactive</option>
          </select>
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
          <button className="btn btn2 float-end" type="submit">
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateList;
