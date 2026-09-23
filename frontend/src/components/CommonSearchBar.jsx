"use client";

import { Search } from "lucide-react";

const CommonSearchBar = ({
  value,
  onChange,
  placeholder = "Search",
  onSubmit,
  className = "",
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onSubmit === "function") {
      onSubmit(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="position-relative">
        <input
          type="search"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="form-control border-0 shadow-sm"
          style={{ borderRadius: "999px", height: "56px", padding: "0 70px 0 20px" }}
        />
        <button
          type="submit"
          aria-label="Search"
          className="position-absolute top-50 end-0 translate-middle-y border-0 text-white d-inline-flex align-items-center justify-content-center"
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "999px",
            background: "var(--Main-Color)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
          }}
        >
          <Search size={22} />
        </button>
      </div>
    </form>
  );
};

export default CommonSearchBar;
