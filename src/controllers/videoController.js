const prisma = require('../config/db');
const AppError = require('../utils/appError');
const { PAGINATION } = require('../config/constants');

// Get all videos
exports.getAllVideos = async (req, res, next) => {
  try {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      isPublished,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Build where clause
    let where = {};
    if (req.user.role === 'USER') {
      where.createdBy = req.user.id;
    }
    if (isPublished !== undefined) {
      where.isPublished = isPublished === 'true';
    }

    // Count total videos matching query
    const total = await prisma.video.count({ where });

    // Determine sort order
    const orderBy = {};
    orderBy[sortBy] = order === 'asc' ? 'asc' : 'desc';

    // Get videos with pagination
    const videos = await prisma.video.findMany({
      where,
      orderBy,
      skip,
      take: Number(limit),
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            feedbacks: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: videos,
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

// Get video by ID
exports.getVideoById = async (req, res, next) => {
  try {
    let where = {
      id: req.params.id,
    };

    if (req.user.role === 'USER') {
      where.createdBy = req.user.id;
    }

    const video = await prisma.video.findFirst({
      where: where,
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            feedbacks: true
          }
        }
      }
    });

    if (!video) {
      return next(new AppError('Video not found', 404));
    }

    res.status(200).json({
      success: true,
      data: video
    });
  } catch (error) {
    next(error);
  }
};

// Create a new video
exports.createVideo = async (req, res, next) => {
  try {
    const { title, videoUrl, thumbnailUrl, isPublished } = req.body;

    // Validate required fields
    if (!title || !videoUrl) {
      return next(new AppError('title and videoUrl are required', 400));
    }

    const video = await prisma.video.create({
      data: {
        title,
        videoUrl,
        thumbnailUrl,
        isPublished: isPublished !== undefined ? isPublished : true,
        createdBy: req.user.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: video,
      message: 'Video created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Update a video
exports.updateVideo = async (req, res, next) => {
  try {
    // Check if video exists and belongs to user
    const videoExists = await prisma.video.findFirst({
      where: {
        id: req.params.id,
        createdBy: req.user.id
      }
    });

    if (!videoExists) {
      return next(new AppError('Video not found or access denied', 404));
    }

    const video = await prisma.video.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: video,
      message: 'Video updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete a video
exports.deleteVideo = async (req, res, next) => {
  try {
    // Check if video exists and belongs to user
    const videoExists = await prisma.video.findFirst({
      where: {
        id: req.params.id,
        createdBy: req.user.id
      }
    });

    if (!videoExists) {
      return next(new AppError('Video not found or access denied', 404));
    }

    // Check if video has any feedbacks
    const feedbackCount = await prisma.videoFeedback.count({
      where: { videoId: req.params.id }
    });

    if (feedbackCount > 0) {
      return next(new AppError('Cannot delete video with existing feedback', 400));
    }

    await prisma.video.delete({
      where: { id: req.params.id }
    });

    res.status(200).json({
      success: true,
      message: 'Video deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Toggle video publish status
exports.togglePublishStatus = async (req, res, next) => {
  try {
    // Check if video exists and belongs to user
    const video = await prisma.video.findFirst({
      where: {
        id: req.params.id,
        createdBy: req.user.id
      }
    });

    if (!video) {
      return next(new AppError('Video not found or access denied', 404));
    }

    const updatedVideo = await prisma.video.update({
      where: { id: req.params.id },
      data: {
        isPublished: !video.isPublished
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: updatedVideo,
      message: `Video ${updatedVideo.isPublished ? 'published' : 'unpublished'} successfully`
    });
  } catch (error) {
    next(error);
  }
};
