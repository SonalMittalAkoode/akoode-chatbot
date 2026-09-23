function validateCityDocument(data) {
  const errors = [];
  if (!data.title) errors.push("Page Title is required.");
  if (!data.city) errors.push("City Name is required.");
  return errors;
}

function validateCountryDocument(data) {
  const errors = [];
  if (!data.title) errors.push("Page Title is required.");
  if (!data.country) errors.push("Country Name is required.");
  return errors;
}

function validateCaseStudyDocument(data) {
  const errors = [];
  if (!data.title) errors.push("Title is required.");
  if (!data.slug) errors.push("Slug is required.");
  return errors;
}

module.exports = {
  validateCityDocument,
  validateCountryDocument,
  validateCaseStudyDocument,
};
