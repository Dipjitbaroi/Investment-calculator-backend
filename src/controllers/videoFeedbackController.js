const prisma = require('../config/db');
const AppError = require('../utils/appError');
const { PAGINATION } = require('../config/constants');

// Get all video feedbacks
exports.getAllFeedbacks = async (req, res, next) => {
  try {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      videoId,
      contactId,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Build where clause
    let where = {};
    if (videoId) {
      where.videoId = videoId;
    }
    if (contactId) {
      where.contactId = contactId;
    }

    // Count total feedbacks matching query
    const total = await prisma.videoFeedback.count({ where });

    // Determine sort order
    const orderBy = {};
    orderBy[sortBy] = order === 'asc' ? 'asc' : 'desc';

    // Get feedbacks with pagination
    const feedbacks = await prisma.videoFeedback.findMany({
      where,
      orderBy,
      skip,
      take: Number(limit),
      include: {
        video: {
          select: {
            id: true,
            title: true,
            videoUrl: true,
            thumbnailUrl: true
          }
        },
        contact: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
            email: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: feedbacks,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get video feedback by ID
exports.getFeedbackById = async (req, res, next) => {
  try {
    const feedback = await prisma.videoFeedback.findUnique({
      where: {
        id: req.params.id
      },
      include: {
        video: {
          select: {
            id: true,
            title: true,
            videoUrl: true,
            thumbnailUrl: true
          }
        },
        contact: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
            email: true
          }
        }
      }
    });

    if (!feedback) {
      return next(new AppError('Video feedback not found', 404));
    }

    res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};

// Create a new video feedback
exports.createFeedback = async (req, res, next) => {
  try {
    const { videoId, responses, contactId } = req.body;

    // Validate required fields
    if (!videoId || !responses) {
      return next(new AppError('videoId and responses are required', 400));
    }

    // Validate responses is a valid JSON object
    if (typeof responses !== 'object' || responses === null) {
      return next(new AppError('responses must be a valid JSON object', 400));
    }

    // Validate video exists
    const videoExists = await prisma.video.findUnique({
      where: { id: videoId }
    });

    if (!videoExists) {
      return next(new AppError('Video not found', 404));
    }

    // If contactId is provided, validate it exists
    if (contactId) {
      const contactExists = await prisma.contact.findUnique({
        where: { id: contactId }
      });

      if (!contactExists) {
        return next(new AppError('Contact not found', 404));
      }
    }

    const feedback = await prisma.videoFeedback.create({
      data: {
        videoId,
        responses,
        contactId
      },
      include: {
        video: {
          select: {
            id: true,
            title: true,
            videoUrl: true,
            thumbnailUrl: true
          }
        },
        contact: contactId ? {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
            email: true
          }
        } : undefined
      }
    });

    res.status(201).json({
      success: true,
      data: feedback,
      message: 'Video feedback created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Update a video feedback
exports.updateFeedback = async (req, res, next) => {
  try {
    // Check if feedback exists
    const feedbackExists = await prisma.videoFeedback.findUnique({
      where: { id: req.params.id }
    });

    if (!feedbackExists) {
      return next(new AppError('Video feedback not found', 404));
    }

    // If videoId is provided, validate it exists
    if (req.body.videoId) {
      const videoExists = await prisma.video.findUnique({
        where: { id: req.body.videoId }
      });

      if (!videoExists) {
        return next(new AppError('Video not found', 404));
      }
    }

    // If contactId is provided, validate it exists
    if (req.body.contactId) {
      const contactExists = await prisma.contact.findUnique({
        where: { id: req.body.contactId }
      });

      if (!contactExists) {
        return next(new AppError('Contact not found', 404));
      }
    }

    // Validate responses is a valid JSON object if provided
    if (req.body.responses && (typeof req.body.responses !== 'object' || req.body.responses === null)) {
      return next(new AppError('responses must be a valid JSON object', 400));
    }

    const feedback = await prisma.videoFeedback.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        video: {
          select: {
            id: true,
            title: true,
            videoUrl: true,
            thumbnailUrl: true
          }
        },
        contact: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
            email: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: feedback,
      message: 'Video feedback updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete a video feedback
exports.deleteFeedback = async (req, res, next) => {
  try {
    // Check if feedback exists
    const feedbackExists = await prisma.videoFeedback.findUnique({
      where: { id: req.params.id }
    });

    if (!feedbackExists) {
      return next(new AppError('Video feedback not found', 404));
    }

    await prisma.videoFeedback.delete({
      where: { id: req.params.id }
    });

    res.status(200).json({
      success: true,
      message: 'Video feedback deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get all feedbacks for a specific video
exports.getVideoFeedbacks = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    // Validate video exists
    const videoExists = await prisma.video.findUnique({
      where: { id: videoId }
    });

    if (!videoExists) {
      return next(new AppError('Video not found', 404));
    }

    const skip = (Number(page) - 1) * Number(limit);

    // Build where clause
    const where = { videoId };

    // Count total feedbacks for this video
    const total = await prisma.videoFeedback.count({ where });

    // Determine sort order
    const orderBy = {};
    orderBy[sortBy] = order === 'asc' ? 'asc' : 'desc';

    // Get feedbacks with pagination
    const feedbacks = await prisma.videoFeedback.findMany({
      where,
      orderBy,
      skip,
      take: Number(limit),
      include: {
        video: {
          select: {
            id: true,
            title: true,
            videoUrl: true,
            thumbnailUrl: true
          }
        },
        contact: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
            email: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: feedbacks,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all feedbacks for a specific contact
exports.getContactFeedbacks = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    // Validate contact exists
    const contactExists = await prisma.contact.findUnique({
      where: { id: contactId }
    });

    if (!contactExists) {
      return next(new AppError('Contact not found', 404));
    }

    const skip = (Number(page) - 1) * Number(limit);

    // Build where clause
    const where = { contactId };

    // Count total feedbacks for this contact
    const total = await prisma.videoFeedback.count({ where });

    // Determine sort order
    const orderBy = {};
    orderBy[sortBy] = order === 'asc' ? 'asc' : 'desc';

    // Get feedbacks with pagination
    const feedbacks = await prisma.videoFeedback.findMany({
      where,
      orderBy,
      skip,
      take: Number(limit),
      include: {
        video: {
          select: {
            id: true,
            title: true,
            videoUrl: true,
            thumbnailUrl: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: feedbacks,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};
