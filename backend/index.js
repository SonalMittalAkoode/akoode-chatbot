const bodyParser = require("body-parser");
const express = require("express");
const dbConnect = require("./config/dbConnect");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT;
// const rateLimit = require('express-rate-limit');

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 min
//   max: 100, // limit per IP
// });
// app.use(limiter);


const authRouter = require("./routes/authRoute");

// const countryRouter = require("./routes/countryRouter");
// const stateRouter = require("./routes/stateRouter");
// const cityRouter = require("./routes/cityRoute");
// const locationRouter = require("./routes/locationRouter");
// const amenityRouter = require("./routes/amenityRouter");
const categoryRouter = require("./routes/categoryRoute");
// const propertytypeRouter = require("./routes/propertytypeRoute");
// const builderRouter = require("./routes/builderRouter");
const employeeRouter = require("./routes/employeeRouter");
const ratingRouter = require("./routes/ratingRouter");
// const propertyRouter = require("./routes/propertyRouter");
// const propertyImagesRouter = require("./routes/propertyImagesRouter");
// const propertyPlanRouter = require("./routes/propertyPlanRouter");
// const furnishingstatusRouter = require("./routes/furnishingstatusRouter");
// const constructionstatusRouter = require("./routes/constructionstatusRouter");
const blogcategoryRouter = require("./routes/blogcategoryRoute");
const blogCategoryGroupRouter = require("./routes/blogCategoryGroupRoute");
const blogRouter = require("./routes/blogRouter");
const casestudyRouter = require("./routes/casestudyRouter");
const casestudyProcessRouter = require("./routes/casestudyProcessRouter");
const casestudyChallengeRouter = require("./routes/casestudyChallengeRouter");


const servicesRouter = require("./routes/servicesRouter");

const servicesStepRouter = require("./routes/servicesStepRouter");
const servicesProcessRouter = require("./routes/servicesProcessRouter");
const servicesChallengeRouter = require("./routes/servicesChallengeRouter");


const testimonialRouter = require("./routes/testimonialRouter");
const videoRouter = require("./routes/videoRouter");
// const propertypageRouter = require("./routes/propertypageRouter");
const faqRouter = require("./routes/faqRouter");

// const landingpageRouter = require("./routes/landingpageRouter");
// const landingImagesRouter = require("./routes/landingImagesRouter");
// const landingPlanRouter = require("./routes/landingPlanRouter");
// const landingPaymentRouter = require("./routes/landingPaymentRouter");
const enqRouter = require("./routes/enqRoute");
// const enqPropertyRouter = require("./routes/enqPropertyRoute");
// const enqLandingRouter = require("./routes/enqLandingRoute");
// const cityGlimpseRouter = require("./routes/cityGlimpseRouter");
// const sellerRouter = require("./routes/sellerRouter");
const enqSubscribeRouter = require("./routes/enqSubscribeRoute");
const jobEnquiryRouter = require("./routes/enqJobRoute");
const jobPostingRouter = require("./routes/jobPostingRouter");
const careerRouter = require("./routes/careerRouter");
const jobApplicationRouter = require("./routes/jobApplication");
const lifeAtAkoodeImageRouter = require("./routes/lifeAtAkoodeImageRouter");
const uploadRouter = require("./routes/uploadRoute");
const serviceByCountryRouter = require("./routes/serviceByCountryRouter");
const caseStudyLatestRouter = require("./routes/caseStudyLatestRouter");
const updatedServiceRouter = require("./routes/updatedServiceRouter");
const serviceByCityRouter = require("./routes/serviceByCityRouter");
const sbcSeoSuggestionRouter = require("./routes/sbcSeoSuggestionRouter");
const docxImportRouter = require("./routes/docxImportRouter");
const industryRouter = require("./routes/industryRoutes");



// Frontend API route
// const cityFrontendRoute = require("./routes/frontend/cityFrontendRoute");
// const propertytypeFrontendRouter = require("./routes/frontend/propertytypeFrontendRouter");
const serviceFrontendRouter = require("./routes/frontend/servicesFrontendRouter");
const testimonialFrontendRouter = require("./routes/frontend/testimonialFrontendRouter");
const employeeFrontendRouter = require("./routes/frontend/employeeFrontendRouter");
const ratingFrontendRouter = require("./routes/frontend/ratingFrontendRouter");
const videoFrontendRouter = require("./routes/frontend/videoFrntRouter");
const blogFrontendRouter = require("./routes/frontend/blogRouter");
const casestudyFrontendRouter = require("./routes/frontend/casestudyRouter");
const faqFrontendRouter = require("./routes/frontend/faqRouter");
const enqFrontendRouter = require("./routes/frontend/enqRoute");
const SideBarFrntCtrl = require("./routes/frontend/SideBarFrntRoute");
// const enqPropertyFrontendRouter = require("./routes/frontend/enqPropertyRouter");
// const propertypageFrontendRoute = require("./routes/frontend/propertypageRouter");
// const landingpageFrontendRoute = require("./routes/frontend/landingpageFrontendRoute");

// const enqLandingFrontendRouter = require("./routes/frontend/enqLandingRoute");
const categoryFrontendRoute = require("./routes/frontend/categoryRoute");
const builderFrontendRoute = require("./routes/frontend/builderRoute");


// const locationFrontendRoute = require("./routes/frontend/locationRoute");

const enqSubscribeFrontendRouter = require("./routes/frontend/enqSubscribeRoute");
const enqJobFrontendRouter = require("./routes/frontend/enqJobRoute");
const jobApplicationFrontendRoute = require("./routes/frontend/jobApplicationFrntRoute");

const jobFrontendRouter = require("./routes/frontend/jobFrntRouter");
const lifeAtAkoodeImageFrontendRouter = require("./routes/frontend/lifeAtAkoodeImageRouter");
const serviceByCountryFrontendRouter = require("./routes/frontend/serviceByCountryRouter");
const caseStudyLatestFrontendRouter = require("./routes/frontend/caseStudyLatestRouter");
const updatedServiceFrontendRouter = require("./routes/frontend/updatedServiceRouter");
const serviceByCityFrontendRouter = require("./routes/frontend/serviceByCityRouter");
const industryFrontendRouter = require("./routes/frontend/industryFrontendRoutes");




const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");

app.use(morgan("dev"));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Private-Network", "true");
  next();
});
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:9000",
  "https://akoode.com",
  "https://www.akoode.com",
  "https://akoode.in",
  // "https://www.akoode.in",
  process.env.SITE_URL,
].filter(Boolean);
// Also allow any akoode.com / akoode.in subdomain (www, staging, etc.) and any
// localhost port, so we never have to chase exact-origin CORS misses again.
const allowedOriginPatterns = [
  /^http:\/\/localhost(:\d+)?$/,
  /^https:\/\/([a-z0-9-]+\.)*akoode\.com$/,
  /^https:\/\/([a-z0-9-]+\.)*akoode\.in$/,
];
const isAllowedOrigin = (origin) =>
  allowedOrigins.includes(origin) ||
  allowedOriginPatterns.some((re) => re.test(origin));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (isAllowedOrigin(origin)) return callback(null, true);
      return callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));

// const bodyParser = require('body-parser');

// app.use(bodyParser.json({ limit: '10mb' })); // or more
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(cookieParser());
// code done by sonal: isolated chatbot API and persistent email retry worker.
app.use('/chatbot', require('./chatbot/router'));
app.use("/admin/api/user", authRouter);

// app.use("/admin/api/country", countryRouter);
// app.use("/admin/api/state", stateRouter);
// app.use("/admin/api/city", cityRouter);
// app.use("/admin/api/location", locationRouter);
// app.use("/admin/api/amenity", amenityRouter);
app.use("/admin/api/category", categoryRouter);
// app.use("/admin/api/propertytype", propertytypeRouter);
// app.use("/admin/api/builder", builderRouter);
app.use("/admin/api/employee", employeeRouter);
app.use("/admin/api/rating", ratingRouter);
// app.use("/admin/api/property", propertyRouter);
// app.use("/admin/api/furnishingstatus", furnishingstatusRouter);
// app.use("/admin/api/constructionstatus", constructionstatusRouter);
app.use("/admin/api/blogcategory", blogcategoryRouter);
app.use("/admin/api/blogcategorygroup", blogCategoryGroupRouter);
app.use("/admin/api/blog", blogRouter);
app.use("/admin/api/casestudy", casestudyRouter);
app.use("/admin/api/casestudyprocess", casestudyProcessRouter);
app.use("/admin/api/casestudychallenge", casestudyChallengeRouter);
app.use("/admin/api/testimonial", testimonialRouter);
app.use("/admin/api/video", videoRouter);
// app.use("/admin/api/propertypage", propertypageRouter);
app.use("/admin/api/faq", faqRouter);
// app.use("/admin/api/propertyimages", propertyImagesRouter);
// app.use("/admin/api/propertyplan", propertyPlanRouter);
app.use("/admin/api/services", servicesRouter);
app.use("/admin/api/servicesstep", servicesStepRouter);
app.use("/admin/api/servicesprocess", servicesProcessRouter);
app.use("/admin/api/serviceschallenge", servicesChallengeRouter);
// app.use("/admin/api/landingpage", landingpageRouter);
// app.use("/admin/api/landingimages", landingImagesRouter);
// app.use("/admin/api/landingplan", landingPlanRouter);
// app.use("/admin/api/landingpayment", landingPaymentRouter);
app.use("/admin/api/enquiry", enqRouter);
// app.use("/admin/api/propertyenquiry", enqPropertyRouter);
// app.use("/admin/api/landingenquiry", enqLandingRouter);
// app.use("/admin/api/cityglimpse", cityGlimpseRouter);

// app.use("/admin/api/seller", sellerRouter);
app.use("/admin/api/subscribeenquiry", enqSubscribeRouter);
app.use("/admin/api/brochureenquiry", jobEnquiryRouter);
app.use("/admin/api/jobenquiry", jobEnquiryRouter);
app.use("/admin/api/jobposting", jobPostingRouter);
app.use("/admin/api/careerpage", careerRouter);
app.use("/admin/api/jobapplication", jobApplicationRouter);
app.use("/admin/api/life-at-akoode-image", lifeAtAkoodeImageRouter);
app.use("/admin/api/upload", uploadRouter);
app.use("/admin/api/service-by-country", serviceByCountryRouter);
app.use("/admin/api/case-study-latest", caseStudyLatestRouter);
app.use("/admin/api/updated-services", updatedServiceRouter);
app.use("/admin/api/service-by-city", serviceByCityRouter);
app.use("/admin/api/ai-suggestions", sbcSeoSuggestionRouter);
app.use("/admin/api/docx-import", docxImportRouter);
app.use("/admin/api/industry", industryRouter);



// Frontend API
// Register more specific route first to avoid conflicts
app.use("/frontend/api/service/list", require("./routes/frontend/SideBarFrntRoute"));
app.use("/frontend/api/service", serviceFrontendRouter);
// app.use("/frontend/api/propertytype", propertytypeFrontendRouter);
// app.use("/frontend/api/city", cityFrontendRoute);


app.use("/frontend/api/testimonial", testimonialFrontendRouter);
app.use("/frontend/api/employee", employeeFrontendRouter);
app.use("/frontend/api/rating", ratingFrontendRouter);
app.use("/frontend/api/video", videoFrontendRouter);
app.use("/frontend/api/blog", blogFrontendRouter);
app.use("/frontend/api/casestudy", casestudyFrontendRouter);
app.use("/frontend/api/faq", faqFrontendRouter);
app.use("/frontend/api/enquiry", enqFrontendRouter);
// app.use("/frontend/api/propertyenquiry", enqPropertyFrontendRouter);
// app.use("/frontend/api/propertypage", propertypageFrontendRoute);
// app.use("/frontend/api/landingpage", landingpageFrontendRoute);
// app.use("/frontend/api/landingenquiry", enqLandingFrontendRouter);

app.use("/frontend/api/subscribeenquiry", enqSubscribeFrontendRouter);
app.use("/frontend/api/jobenquiry", enqJobFrontendRouter);
app.use("/frontend/api/jobapplication", jobApplicationFrontendRoute);
app.use("/frontend/api/category", categoryFrontendRoute);
app.use("/frontend/api/builder", builderFrontendRoute);
// app.use("/frontend/api/location", locationFrontendRoute);
app.use("/frontend/api/job", jobFrontendRouter);
app.use("/frontend/api/life-at-akoode-images", lifeAtAkoodeImageFrontendRouter);
app.use("/frontend/api/service-by-country", serviceByCountryFrontendRouter);
app.use("/frontend/api/case-study-latest", caseStudyLatestFrontendRouter);
app.use("/frontend/api/updated-services", updatedServiceFrontendRouter);
app.use("/frontend/api/service-by-city", serviceByCityFrontendRouter);
app.use("/frontend/api/industry", industryFrontendRouter);




const path = require("path");
// app.use("/public", express.static(path.join(__dirname, "public")));
// app.use(express.static("public"));
// app.use('/images', express.static('path_to_images_directory'));
app.use('/public', express.static(path.join(__dirname, 'public')));
console.log("testimage")
app.use(notFound);
app.use(errorHandler);

dbConnect().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
    require('./chatbot/email').startEmailWorker();
  });
  server.on('error', (error) => {
    console.error(`Backend failed to listen on port ${PORT}: ${error.code}`);
    process.exit(1);
  });
}).catch((error) => {
  const message = String(error.message).replace(/mongodb(?:\+srv)?:\/\/[^\s]+/gi, '[redacted MongoDB URI]');
  console.error(`Backend startup failed: ${message}`);
  console.error('Check MONGODB_URL and that MongoDB is running and reachable, then restart the backend.');
  process.exit(1);
});
