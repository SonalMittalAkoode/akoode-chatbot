// Maps a blog category's Mongo _id to its matching /services/[slug] page, so category
// labels on blog cards can link straight to the relevant service. Industry-vertical
// categories (Healthcare, Real Estate, etc.) have no service-page equivalent and are
// intentionally omitted — their labels stay plain text.
export const CATEGORY_TO_SERVICE_SLUG = {
  '6981d1104867561ce35d29e3': 'artificial-intelligence', // Artificial Intelligence
  '6981d1174867561ce35d29e8': 'software-development', // Custom Software Development
  '698c5c5b22ce889af740680c': 'mobile-app-development', // Mobile App Development
  '69c25d97af400b8e461ee93b': 'web-development', // Web Development
  '69c25dc3af400b8e461ee9de': '360-digital-marketing', // Digital Marketing
  '69d36b031e7a1cc5c151f576': 'cloud-and-devops-solutions', // Cloud & DevOps
  '69d634eb1e7a1cc5c15288d5': 'ecommerce-development', // E-commerce Development
  '69f20a3b61ea7f1cb289a00d': 'software-development', // Software Development
  '69f305fb61ea7f1cb289b9b5': 'staff-augmentation', // Staff Augmentation
  '69fc290fc4934d211ed24dab': 'mobile-app-development', // iOS App Development
  '69fc65f5c4934d211ed25b28': 'ecommerce-development', // Shopify Development
  '69fd8b6cc4934d211ed28a92': 'software-development', // MVP Development
  '6a02d96bc4934d211ed34240': 'software-development', // SaaS Product Development
  '6a02db06c4934d211ed3426d': 'mobile-app-development', // Android App Development
};

export function getServiceHrefForCategory(blogcategory) {
  const id = blogcategory?._id;
  const slug = id && CATEGORY_TO_SERVICE_SLUG[id];
  return slug ? `/services/${slug}` : null;
}
