'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const SidebarMenu = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [userRole, setUserRole] = useState("");

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const pathname = usePathname();
  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("user") || "{}");
    setUserRole(userData?.role || "");
  }, []);
  const isSubAdmin = userRole === "sub-admin";

  const isSinglePageActive = (path, currentPathname) =>
    currentPathname === path || (currentPathname && currentPathname.endsWith(path));
  const isParentPageActive = (items, currentPathname) =>
    Array.isArray(items) && items.some((item) => currentPathname === item.route || (currentPathname && currentPathname.startsWith(item.route + "/")));

  const myCasestudy = [
    { id: 1, name: "Add Casestudy", route: "/thebusinesshub/casestudies/add" },
    { id: 2, name: "Casestudy List", route: "/thebusinesshub/casestudies" }
  ];
  const myServices = [
    { id: 1, name: "Add Services", route: "/thebusinesshub/services/add" },
    { id: 2, name: "Services List", route: "/thebusinesshub/services" }
  ];
  const myLocationPages = [
    { id: 1, name: "Add Country Page", route: "/thebusinesshub/service-by-country/add" },
    { id: 2, name: "Country Pages List", route: "/thebusinesshub/service-by-country" },
    { id: 3, name: "Add City Page", route: "/thebusinesshub/service-by-city/add" },
    { id: 4, name: "City Pages List", route: "/thebusinesshub/service-by-city" },
  ];
  const lifeatakoode = [
    { id: 1, name: "Add Life at Akoode", route: "/thebusinesshub/life/add" },
    { id: 2, name: "Life at Akoode List", route: "/thebusinesshub/life" }
  ];
  const myCity = [
    { id: 1, name: "Add City", route: "/thebusinesshub/add-city" },
    { id: 2, name: "City List", route: "/thebusinesshub/my-cities" }
  ];

  const myLocation = [
    { id: 1, name: "Add Location", route: "/thebusinesshub/add-location" },
    { id: 2, name: "Location List", route: "/thebusinesshub/my-location" }
  ];
  const myAmenity = [
    { id: 1, name: "Add Amenity", route: "/thebusinesshub/add-amenities" },
    { id: 2, name: "Amenity List", route: "/thebusinesshub/my-amenities" }
  ];
  const myCategory = [
    { id: 1, name: "Add Category", route: "/thebusinesshub/add-category" },
    { id: 2, name: "Category List", route: "/thebusinesshub/my-category" }
  ];
  const myPropertytype = [
    { id: 1, name: "Add Property type", route: "/thebusinesshub/add-propertytype" },
    { id: 2, name: "Property type List", route: "/thebusinesshub/my-propertytype" }
  ];
  const myBuilder = [
    { id: 1, name: "Add Builder", route: "/thebusinesshub/add-builder" },
    { id: 2, name: "Builder List", route: "/thebusinesshub/my-builder" }
  ];
  const myEmployee = [
    { id: 1, name: "Add Employee", route: "/thebusinesshub/employees/add" },
    { id: 2, name: "Employee List", route: "/thebusinesshub/employees" }
  ];
  const myRating = [
    { id: 1, name: "Add Rating", route: "/thebusinesshub/ratings/add" },
    { id: 2, name: "Rating List", route: "/thebusinesshub/ratings" }
  ];
  const myJobPosting = [
    { id: 1, name: "Add Job Posting", route: "/thebusinesshub/jobs/add" },
    { id: 2, name: "Job Posting List", route: "/thebusinesshub/jobs" }
  ];
  const mySeller = [
    { id: 1, name: "Add Seller", route: "/thebusinesshub/add-seller" },
    { id: 2, name: "Seller List", route: "/thebusinesshub/my-seller" }
  ];


  const myProperties = [
    { id: 1, name: "Add Property", route: "/thebusinesshub/create-listing" },
    { id: 2, name: "Property List", route: "/thebusinesshub/my-properties" }
  ];
  const myBlog = [
    { id: 1, name: "Add Blog category", route: "/thebusinesshub/blogs/categories/add" },
    { id: 2, name: "Blog category List", route: "/thebusinesshub/blogs/categories" },
    { id: 3, name: "Add Category Group", route: "/thebusinesshub/blogs/categorygroups/add" },
    { id: 4, name: "Category Group List", route: "/thebusinesshub/blogs/categorygroups" },
    { id: 5, name: "Add Blog", route: "/thebusinesshub/blogs/add" },
    { id: 6, name: "Blog List", route: "/thebusinesshub/blogs" },

  ];
  const myPropertypage = [
    { id: 1, name: "Add Property page", route: "/thebusinesshub/add-propertypage" },
    { id: 2, name: "Property page List", route: "/thebusinesshub/my-propertypage" }
  ];
  const myTestimonial = [
    { id: 1, name: "Add Testimonial", route: "/thebusinesshub/testimonials/add" },
    { id: 2, name: "Testimonial List", route: "/thebusinesshub/testimonials" },
    { id: 3, name: "Add Video", route: "/thebusinesshub/testimonials/videos/add" },
    { id: 4, name: "Video List", route: "/thebusinesshub/testimonials/videos" }
  ];

  const myFaq = [
    { id: 1, name: "Add FAQ", route: "/thebusinesshub/faqs/add" },
    { id: 2, name: "FAQ List", route: "/thebusinesshub/faqs" }
  ];
  const myLandingpage = [
    { id: 1, name: "Add Landing page", route: "/thebusinesshub/add-landing" },
    { id: 2, name: "Landing page List", route: "/thebusinesshub/my-landing" }
  ];
  const reviews = [
    { id: 1, name: "My Reviews", route: "/thebusinesshub/my-review" },
    { id: 2, name: "Visitor Reviews", route: "/thebusinesshub/my-review" },
  ];
  const enquerylist = [
    { id: 1, name: "Contact Enquiry", route: "/thebusinesshub/enquiries" },
    { id: 2, name: "Post Requirement", route: "/thebusinesshub/enquiries/requirements" },
    { id: 3, name: "General Enquiry", route: "/thebusinesshub/enquiries/general" },
    { id: 4, name: "Job Application", route: "/thebusinesshub/jobs/applications" },
    { id: 5, name: "Newsletter Subscribers", route: "/thebusinesshub/subscribers" },
  ];
  const manageAccount = [
    {
      id: 1,
      name: "My Package",
      route: "/my-package",
      icon: "flaticon-box",
    },
    {
      id: 2,
      name: "My Profile",
      route: "/thebusinesshub/profile",
      icon: "flaticon-user",
    },
    { id: 3, name: "Logout", route: "/login", icon: "flaticon-logout" },
  ];

  return (
    <>
      <ul className="sidebar-menu">
        <li className="sidebar_header header" >
          <Link href="/thebusinesshub/dashboard" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
            <div style={{
              width: '200px',
              height: '70px',
              // backgroundColor: 'white', 
              // border: '2px solid #3498db', 
              borderRadius: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              position: 'relative'
            }}>

              {/* Try to load the logo image */}
              <Image
                src="/adminImg/logo.svg"
                alt="Akoode Logo"
                width={180}
                height={50}
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallback = e.target.nextSibling;
                  if (fallback) fallback.style.display = 'block';
                }}
                onLoad={() => {
                  const fallback = document.querySelector('.logo-fallback');
                  if (fallback) fallback.style.display = 'none';
                }}
                style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
              />
              {/* Fallback text logo */}

            </div>

          </Link>
        </li>
        {/* End header */}

        <li className="title">
          {/* <span>Main</span> */}
          <ul>
            <li
              className={`treeview ${isSinglePageActive("/dashboard", pathname)
                ? "active"
                : ""
                }`}
            >
              <Link href="/thebusinesshub/dashboard">
                <i className="flaticon-layers"></i>
                <span> Dashboard</span>
              </Link>
            </li>

          </ul>
        </li>
        {/* End Main */}

        <li className="title">
          <span>Manage Listings</span>
          <ul>
            
            {/* lifeatakoode */}
            <li
              className={`treeview ${(isParentPageActive(lifeatakoode, pathname) || openMenu === "lifeatakoode") ? "active" : ""}`}
              onClick={() => toggleMenu("lifeatakoode")}
              style={{ cursor: "pointer" }}
            >
              <a data-bs-toggle="collapse" href="#lifeatakoode" onClick={(e) => e.preventDefault()}>
                <i className="fa fa-image"></i> <span>Life at Akoode</span>
                <i className={`fa fa-angle-${(openMenu === "lifeatakoode" || isParentPageActive(lifeatakoode, pathname)) ? "up" : "down"} pull-right`}></i>
              </a>
              <ul className={`treeview-menu collapse ${(openMenu === "lifeatakoode" || isParentPageActive(lifeatakoode, pathname)) ? "show" : ""}`} id="lifeatakoode">
                {lifeatakoode.map((item) => (
                  <li key={item.id}>
                    <Link href={item.route}>
                      <i className="fa fa-circle"></i> {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {/* end lifeatakoode */}

            {/* myEmployee */}
            <li
              className={`treeview ${isParentPageActive(myEmployee, pathname) ? "active" : ""}`}
              onClick={() => toggleMenu("employee")}
              style={{ cursor: "pointer" }}
            >
              <a data-bs-toggle="collapse" href="#my-employee">
                <i className="fa fa-users"></i> <span>My Employee</span>
                <i className={`fa fa-angle-${(openMenu === "employee" || isParentPageActive(myEmployee, pathname)) ? "up" : "down"} pull-right`}></i>
              </a>
              <ul className={`treeview-menu collapse ${(openMenu === "employee" || isParentPageActive(myEmployee, pathname)) ? "show" : ""}`} id="my-employee">
                {myEmployee.map((item) => (
                  <li key={item.id}>
                    <Link href={item.route}>
                      <i className="fa fa-circle"></i> {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {/* end myEmployee */}

            {/* myRating */}
            <li
              className={`treeview ${isParentPageActive(myRating, pathname) ? "active" : ""}`}
              onClick={() => toggleMenu("rating")}
              style={{ cursor: "pointer" }}
            >
              <a data-bs-toggle="collapse" href="#my-rating">
                <i className="fa fa-star"></i> <span>My Rating</span>
                <i className={`fa fa-angle-${(openMenu === "rating" || isParentPageActive(myRating, pathname)) ? "up" : "down"} pull-right`}></i>
              </a>
              <ul className={`treeview-menu collapse ${(openMenu === "rating" || isParentPageActive(myRating, pathname)) ? "show" : ""}`} id="my-rating">
                {myRating.map((item) => (
                  <li key={item.id}>
                    <Link href={item.route}>
                      <i className="fa fa-circle"></i> {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {/* end myRating */}

            {/* myJobPosting */}
            <li
              className={`treeview ${isParentPageActive(myJobPosting, pathname) ? "active" : ""}`}
              onClick={() => toggleMenu("jobposting")}
              style={{ cursor: "pointer" }}
            >
              <a data-bs-toggle="collapse" href="#my-jobposting">
                <i className="fa fa-briefcase"></i> <span>My Job Posting</span>
                <i className={`fa fa-angle-${(openMenu === "jobposting" || isParentPageActive(myJobPosting, pathname)) ? "up" : "down"} pull-right`}></i>
              </a>
              <ul className={`treeview-menu collapse ${(openMenu === "jobposting" || isParentPageActive(myJobPosting, pathname)) ? "show" : ""}`} id="my-jobposting">
                {myJobPosting.map((item) => (
                  <li key={item.id}>
                    <Link href={item.route}>
                      <i className="fa fa-circle"></i> {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {/* end myJobPosting */}

            {/* myBlog */}
            <li
              className={`treeview ${isParentPageActive(myBlog, pathname) ? "active" : ""}`}
              onClick={() => toggleMenu("blog")}
              style={{ cursor: "pointer" }}
            >
              <a data-bs-toggle="collapse" href="#my-blog">
                <i className="fa fa-file-text"></i> <span>My Blog</span>
                <i className={`fa fa-angle-${(openMenu === "blog" || isParentPageActive(myBlog, pathname)) ? "up" : "down"} pull-right`}></i>
              </a>
              <ul className={`treeview-menu collapse ${(openMenu === "blog" || isParentPageActive(myBlog, pathname)) ? "show" : ""}`} id="my-blog">
                {myBlog.map((item) => (
                  <li key={item.id}>
                    <Link href={item.route}>
                      <i className="fa fa-circle"></i> {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {/* end myBlog */}

            {/* myServices */}
            <li
              className={`treeview ${isParentPageActive(myServices, pathname) ? "active" : ""}`}
              onClick={() => toggleMenu("services")}
              style={{ cursor: "pointer" }}
            >
              <a data-bs-toggle="collapse" href="#my-services">
                <i className="fa fa-briefcase"></i> <span>My Services</span>
                <i className={`fa fa-angle-${(openMenu === "services" || isParentPageActive(myServices, pathname)) ? "up" : "down"} pull-right`}></i>
              </a>
              <ul className={`treeview-menu collapse ${(openMenu === "services" || isParentPageActive(myServices, pathname)) ? "show" : ""}`} id="my-services">
                {myServices.map((item) => (
                  <li key={item.id}>
                    <Link href={item.route}>
                      <i className="fa fa-circle"></i> {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {/* end myServices */}

            {/* myLocationPages */}
            <li
              className={`treeview ${isParentPageActive(myLocationPages, pathname) ? "active" : ""}`}
              onClick={() => toggleMenu("locationpages")}
              style={{ cursor: "pointer" }}
            >
              <a data-bs-toggle="collapse" href="#my-locationpages" onClick={(e) => e.preventDefault()}>
                <i className="fa fa-globe"></i> <span>Location Pages</span>
                <i className={`fa fa-angle-${(openMenu === "locationpages" || isParentPageActive(myLocationPages, pathname)) ? "up" : "down"} pull-right`}></i>
              </a>
              <ul className={`treeview-menu collapse ${(openMenu === "locationpages" || isParentPageActive(myLocationPages, pathname)) ? "show" : ""}`} id="my-locationpages">
                {myLocationPages.map((item) => (
                  <li key={item.id}>
                    <Link href={item.route}>
                      <i className="fa fa-circle"></i> {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {/* end myLocationPages */}

            {/* myCasestudy */}
            <li
              className={`treeview ${isParentPageActive(myCasestudy, pathname) ? "active" : ""}`}
              onClick={() => toggleMenu("casestudy")}
              style={{ cursor: "pointer" }}
            >
              <a data-bs-toggle="collapse" href="#my-casestudy">
                <i className="fa fa-bar-chart"></i> <span>My Casestudy</span>
                <i className={`fa fa-angle-${(openMenu === "casestudy" || isParentPageActive(myCasestudy, pathname)) ? "up" : "down"} pull-right`}></i>
              </a>
              <ul className={`treeview-menu collapse ${(openMenu === "casestudy" || isParentPageActive(myCasestudy, pathname)) ? "show" : ""}`} id="my-casestudy">
                {myCasestudy.map((item) => (
                  <li key={item.id}>
                    <Link href={item.route}>
                      <i className="fa fa-circle"></i> {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {/* end myCasestudy */}

            {/* myTestimonial */}
            <li
              className={`treeview ${isParentPageActive(myTestimonial, pathname) ? "active" : ""}`}
              onClick={() => toggleMenu("testimonial")}
              style={{ cursor: "pointer" }}
            >
              <a data-bs-toggle="collapse" href="#my-testimonial">
                <i className="fa fa-comment"></i> <span>My Testimonial</span>
                <i className={`fa fa-angle-${(openMenu === "testimonial" || isParentPageActive(myTestimonial, pathname)) ? "up" : "down"} pull-right`}></i>
              </a>
              <ul className={`treeview-menu collapse ${(openMenu === "testimonial" || isParentPageActive(myTestimonial, pathname)) ? "show" : ""}`} id="my-testimonial">
                {myTestimonial.map((item) => (
                  <li key={item.id}>
                    <Link href={item.route}>
                      <i className="fa fa-circle"></i> {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {/* end myTestimonial */}

            {/* myFaq */}
            <li
              className={`treeview ${isParentPageActive(myFaq, pathname) ? "active" : ""}`}
              onClick={() => toggleMenu("faq")}
              style={{ cursor: "pointer" }}
            >
              <a data-bs-toggle="collapse" href="#my-faq">
                <i className="fa fa-question-circle"></i> <span>My FAQ</span>
                <i className={`fa fa-angle-${(openMenu === "faq" || isParentPageActive(myFaq, pathname)) ? "up" : "down"} pull-right`}></i>
              </a>
              <ul className={`treeview-menu collapse ${(openMenu === "faq" || isParentPageActive(myFaq, pathname)) ? "show" : ""}`} id="my-faq">
                {myFaq.map((item) => (
                  <li key={item.id}>
                    <Link href={item.route}>
                      <i className="fa fa-circle"></i> {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {/* end myFaq */}

            {/* enquerylist listings */}
            {!isSubAdmin && (
              <li
                className={`treeview ${isParentPageActive(enquerylist, pathname) ? "active" : ""}`}
                onClick={() => toggleMenu("enquiry")}
                style={{ cursor: "pointer" }}
              >
                <a data-bs-toggle="collapse" href="#my-enquerylist">
                  <i className="fa fa-envelope"></i> <span>My enquery</span>
                  <i className={`fa fa-angle-${(openMenu === "enquiry" || isParentPageActive(enquerylist, pathname)) ? "up" : "down"} pull-right`}></i>
                </a>
                <ul className={`treeview-menu collapse ${(openMenu === "enquiry" || isParentPageActive(enquerylist, pathname)) ? "show" : ""}`} id="my-enquerylist">
                  {enquerylist.map((item) => (
                    <li key={item.id}>
                      <Link href={item.route}>
                        <i className="fa fa-circle"></i> {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            )}
            {/* end enquerylist listings */}
          </ul>
        </li>
      </ul>
    </>
  );
};

export default SidebarMenu;
