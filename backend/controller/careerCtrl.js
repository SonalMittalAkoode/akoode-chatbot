

const CareerPage = require('../models/careerModel');

exports.createCareerPage = async (req, res) => {
  try {
    const { aboutTag, aboutTitle, aboutDescription, aboutImage } = req.body;

    if (!aboutTitle || !aboutDescription) {
      return res.status(400).json({
        success: false,
        message: "aboutTitle and aboutDescription are required.",
      });
    }

    const careerPage = await CareerPage.create({
      aboutTag,
      aboutTitle,
      aboutDescription,
      aboutImage,
    });

    return res.status(201).json({
      success: true,
      data: careerPage,
    });
  } catch (error) {
    console.error("Error creating CareerPage:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

exports.getAllCareerPages = async (req, res) => {
  try {
    const pages = await CareerPage.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: pages,
    });
  } catch (error) {
    console.error("Error fetching CareerPages:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

exports.getCareerPageById = async (req, res) => {
  try {
    const { id } = req.params;

    const page = await CareerPage.findById(id);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Career page not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: page,
    });
  } catch (error) {
    console.error("Error fetching CareerPage:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

exports.updateCareerPage = async (req, res) => {
  try {
    const { id } = req.params;
    const { aboutTag, aboutTitle, aboutDescription, aboutImage } = req.body;

    const page = await CareerPage.findById(id);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Career page not found.",
      });
    }

    if (aboutTag !== undefined) page.aboutTag = aboutTag;
    if (aboutTitle !== undefined) page.aboutTitle = aboutTitle;
    if (aboutDescription !== undefined) page.aboutDescription = aboutDescription;
    if (aboutImage !== undefined) page.aboutImage = aboutImage;

    const updatedPage = await page.save();

    return res.status(200).json({
      success: true,
      data: updatedPage,
    });
  } catch (error) {
    console.error("Error updating CareerPage:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

exports.deleteCareerPage = async (req, res) => {
  try {
    const { id } = req.params;

    const page = await CareerPage.findById(id);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Career page not found.",
      });
    }

    await page.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Career page deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting CareerPage:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
