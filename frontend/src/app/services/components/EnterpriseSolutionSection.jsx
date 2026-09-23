import React from 'react';
import { processHtmlLinks } from "@/utils/processHtmlLinks";

const buildAssetUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const base =
        (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) ||
        (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_FRONTEND_API_URL) ||
        "";
    if (!base) {
        return path.startsWith("/") ? path : `/${path}`;
    }
    const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${normalizedBase}${normalizedPath}`;
};

const normalizeBoolean = (value, fallback = false) => {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
        if (value.toLowerCase() === "true") return true;
        if (value.toLowerCase() === "false") return false;
    }
    if (typeof value === "number") return value === 1;
    return fallback;
};

const mapSteps = (steps) => {
    if (!Array.isArray(steps)) return [];
    return steps
        .map((step, index) => {
            const title = step?.titlestep ?? step?.title ?? "";
            const description = step?.descriptionstep ?? step?.description ?? "";
            const imagePath = step?.imageurl || step?.imagestep || step?.imageUrl || step?.image || "";
            const iconUrl = imagePath ? buildAssetUrl(imagePath) : "";

            if (!title && !description) {
                return null;
            }

            return {
                id: step?._id ?? step?.id ?? `enterprise-step-${index}`,
                title,
                description,
                icon: iconUrl || "/images/custom-soft-dev/expertise.svg", // Fallback icon
                number: String(index + 1).padStart(2, '0'), // Format as "01", "02", etc.
            };
        })
        .filter(Boolean);
};

const hasHtmlContent = (text) => text && (text.includes('<') || text.includes('&lt;'));

export default function EnterpriseSolution({ service }) {
    // Check if services section is enabled
    const isServicesEnabled = normalizeBoolean(
        service?.serviceshow,
        Array.isArray(service?.servicestep) && service.servicestep.length > 0
    );

    // Map service steps to cards
    const dynamicSteps = mapSteps(service?.servicestep || []);
    const sectionTitle = service?.servicetitle || "Enterprise Solution";

    // Don't render if services section is not enabled or no steps
    if (!isServicesEnabled || !dynamicSteps || dynamicSteps.length === 0) {
        return null;
    }

    return (
        <section id="es" className="min-vh-100 p-5 bg-white">
            {/* <div className="service1-section-area sp1">
        <div className="container-fluid">
          <div className="service-header text-center heading2">
            <h2 className="text-anime-style-3 space-margin30">{sectionTitle}</h2>
          </div>
          <div className="service-widget-inner">
            <div className="service-slider-boxarea">
              <div className="row">
                {dynamicSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className="col-lg-4 col-md-6"
                    data-aos="zoom-in"
                    data-aos-duration={800 + (index * 100)}
                  >
                    <div className="service1-boxarea">
                      <div className="icons">
                        <img
                          src={step.icon}
                          alt={step.title}
                          className="img-fluid"
                        />
                      </div>
                      <div className="space24"></div>
                      <a href="#">{step.title}</a>
                      <div className="space16"></div>
                      {hasHtmlContent(step.description) ? (
                        <div
                          className="ckeditor-content"
                          dangerouslySetInnerHTML={{ __html: processHtmlLinks(step.description) }}
                        />
                      ) : (
                        <p>{step.description}</p>
                      )}
                      <div className="space24"></div>
                      <h5>{step.number}</h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div> */}
        </section>
    );
}

