"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";

/**
 * Searchable multi-select dropdown for picking blog categories. Selected items render
 * as removable chips in the trigger; the panel supports type-to-filter plus select-all /
 * clear-all so picking a handful out of a long category list stays fast.
 */
export default function CategoryMultiSelect({ categories, selectedIds, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const selectedCategories = useMemo(
    () => categories.filter((c) => selectedSet.has(c._id)),
    [categories, selectedSet]
  );
  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.title.toLowerCase().includes(q));
  }, [categories, query]);

  const toggle = (id) => {
    onChange(selectedSet.has(id) ? selectedIds.filter((c) => c !== id) : [...selectedIds, id]);
  };

  const removeChip = (e, id) => {
    e.stopPropagation();
    onChange(selectedIds.filter((c) => c !== id));
  };

  const selectAllFiltered = () => {
    const ids = new Set(selectedIds);
    filteredCategories.forEach((c) => ids.add(c._id));
    onChange(Array.from(ids));
  };

  const clearAll = () => onChange([]);

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-[46px] w-full flex-wrap items-center gap-1.5 rounded-[4px] border border-gray-200 bg-white px-3 py-2 text-left focus:outline-none focus:border-[#474972]"
      >
        {selectedCategories.length === 0 && (
          <span className="text-[14px] text-gray-400">Select categories...</span>
        )}
        {selectedCategories.map((c) => (
          <span
            key={c._id}
            className="inline-flex items-center gap-1 rounded-full bg-[#474972]/10 px-2.5 py-1 text-[13px] font-medium text-[#474972]"
          >
            {c.title}
            <X
              size={13}
              className="cursor-pointer text-[#474972]/70 hover:text-[#474972]"
              onClick={(e) => removeChip(e, c._id)}
            />
          </span>
        ))}
        <ChevronDown
          size={16}
          className={`ml-auto shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-[6px] border border-gray-200 bg-white shadow-lg">
          <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2">
            <Search size={15} className="shrink-0 text-gray-400" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search categories..."
              className="w-full text-[14px] outline-none"
            />
          </div>

          <div className="flex items-center justify-between border-b border-gray-100 px-3 py-1.5 text-[12px]">
            <button
              type="button"
              onClick={selectAllFiltered}
              className="font-medium text-[#474972] hover:underline"
            >
              Select all{query.trim() ? " (filtered)" : ""}
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="font-medium text-gray-400 hover:text-gray-600 hover:underline"
            >
              Clear all
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto py-1">
            {filteredCategories.length === 0 && (
              <p className="px-3 py-3 text-[13px] text-gray-400">No categories match.</p>
            )}
            {filteredCategories.map((c) => {
              const checked = selectedSet.has(c._id);
              return (
                <label
                  key={c._id}
                  className={`flex cursor-pointer items-center gap-2.5 px-3 py-2 text-[14px] hover:bg-gray-50 ${
                    checked ? "bg-[#474972]/5" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(c._id)}
                    className="h-4 w-4 shrink-0 accent-[#474972]"
                  />
                  <span className={checked ? "font-medium text-[#474972]" : "text-[#1a1a1a]"}>
                    {c.title}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
