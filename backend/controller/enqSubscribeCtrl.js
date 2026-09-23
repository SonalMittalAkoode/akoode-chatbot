const EnquirySubscribe = require("../models/enqSubscribeModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createEnquirySubscribe = asyncHandler(async (req, res) => {
    const email = String(req.body.email || "").toLowerCase().trim();
    try {
        const existing = await EnquirySubscribe.findOne({ email });
        if (existing) {
            return res.status(400).json({
                status: "fail",
                message: "This email is already subscribed.",
            });
        }
        const newEnquiry = await EnquirySubscribe.create(req.body);
        res.json({
            status: "success",
            message: "Subscribed successfully.",
            data: newEnquiry,
        });
    } catch (error) {
        throw new Error(error);
    }
});

const updateEnquirySubscribe = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatedEnquirySubscribe = await EnquirySubscribe.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
            }
        );
        res.json(updatedEnquirySubscribe);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteEnquirySubscribe = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedEnquirySubscribe = await EnquirySubscribe.findByIdAndDelete(id);
        res.json(deletedEnquirySubscribe);
    } catch (error) {
        throw new Error(error);
    }
});

const getEnquirySubscribe = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getaEnquirySubscribe = await EnquirySubscribe.findById(id);
        res.json(getaEnquirySubscribe);
    } catch (error) {
        throw new Error(error);
    }
});

const getallEnquirySubscribe = asyncHandler(async (req, res) => {
    try {
        const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const skip = (page - 1) * limit;

        const [allSubscribers, totalCount] = await Promise.all([
            EnquirySubscribe.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            EnquirySubscribe.countDocuments(),
        ]);

        res.json({
            status: "success",
            data: allSubscribers,
            totalCount,
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit) || 1,
        });
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createEnquirySubscribe,
    updateEnquirySubscribe,
    deleteEnquirySubscribe,
    getEnquirySubscribe,
    getallEnquirySubscribe,
};
