const prisma = require('../config/db');
const AppError = require('../utils/appError');
const { PAGINATION } = require('../config/constants');

// Get all investor questionnaires
exports.getAllQuestionnaires = async (req, res, next) => {
  try {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      contactId,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Build where clause
    let where = {};
    if (req.user.role === 'USER') {
      where.createdBy = req.user.id;
    }
    if (contactId) {
      where.contactId = contactId;
    }

    // Count total questionnaires matching query
    const total = await prisma.investorQuestionnaire.count({ where });

    // Determine sort order
    const orderBy = {};
    orderBy[sortBy] = order === 'asc' ? 'asc' : 'desc';

    // Get questionnaires with pagination
    const questionnaires = await prisma.investorQuestionnaire.findMany({
      where,
      orderBy,
      skip,
      take: Number(limit),
      include: {
        contact: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
            email: true
          }
        },
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
      data: questionnaires,
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

// Get investor questionnaire by ID
exports.getQuestionnaireById = async (req, res, next) => {
  try {
    let where = {
      id: req.params.id,
    };

    if (req.user.role === 'USER') {
      where.createdBy = req.user.id;
    }

    const questionnaire = await prisma.investorQuestionnaire.findFirst({
      where: where,
      include: {
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

    if (!questionnaire) {
      return next(new AppError('Investor questionnaire not found', 404));
    }

    res.status(200).json({
      success: true,
      data: questionnaire
    });
  } catch (error) {
    next(error);
  }
};

// Create a new investor questionnaire
exports.createQuestionnaire = async (req, res, next) => {
  try {
    const questionnaireData = {
      ...req.body,
      createdBy: req.user.id
    };

    // Validate required fields
    const requiredFields = [
      'isAccreditedInvestor',
      'hasInvestedBefore',
      'lookingTimeframe',
      'primaryInvestmentGoal',
      'investmentTimeline',
      'capitalToInvest',
      'useFinancing',
      'marketsInterested',
      'propertyTypesInterested',
      'investmentTimeframe',
      'contactId'
    ];

    for (const field of requiredFields) {
      if (questionnaireData[field] === undefined) {
        return next(new AppError(`${field} is required`, 400));
      }
    }

    // Validate contact exists and belongs to user
    const contactExists = await prisma.contact.findFirst({
      where: {
        id: questionnaireData.contactId,
        createdBy: req.user.id
      }
    });

    if (!contactExists) {
      return next(new AppError('Contact not found or access denied', 404));
    }

    // Ensure arrays are properly formatted
    if (!Array.isArray(questionnaireData.marketsInterested)) {
      questionnaireData.marketsInterested = [];
    }
    if (!Array.isArray(questionnaireData.propertyTypesInterested)) {
      questionnaireData.propertyTypesInterested = [];
    }

    const questionnaire = await prisma.investorQuestionnaire.create({
      data: questionnaireData,
      include: {
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

    res.status(201).json({
      success: true,
      data: questionnaire,
      message: 'Investor questionnaire created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Update an investor questionnaire
exports.updateQuestionnaire = async (req, res, next) => {
  try {
    const questionnaireExists = await prisma.investorQuestionnaire.findFirst({
      where: {
        id: req.params.id,
        createdBy: req.user.id
      }
    });

    if (!questionnaireExists) {
      return next(new AppError('Investor questionnaire not found', 404));
    }

    // Ensure arrays are properly formatted if provided
    if (req.body.marketsInterested && !Array.isArray(req.body.marketsInterested)) {
      req.body.marketsInterested = [];
    }
    if (req.body.propertyTypesInterested && !Array.isArray(req.body.propertyTypesInterested)) {
      req.body.propertyTypesInterested = [];
    }

    const questionnaire = await prisma.investorQuestionnaire.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
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
      data: questionnaire,
      message: 'Investor questionnaire updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete an investor questionnaire
exports.deleteQuestionnaire = async (req, res, next) => {
  try {
    const questionnaireExists = await prisma.investorQuestionnaire.findFirst({
      where: {
        id: req.params.id,
        createdBy: req.user.id
      }
    });

    if (!questionnaireExists) {
      return next(new AppError('Investor questionnaire not found', 404));
    }

    await prisma.investorQuestionnaire.delete({
      where: { id: req.params.id }
    });

    res.status(200).json({
      success: true,
      message: 'Investor questionnaire deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get all questionnaires for a specific contact
exports.getContactQuestionnaires = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    // Validate contact exists and belongs to user
    const contactExists = await prisma.contact.findFirst({
      where: {
        id: contactId,
        createdBy: req.user.id
      }
    });

    if (!contactExists) {
      return next(new AppError('Contact not found or access denied', 404));
    }

    const skip = (Number(page) - 1) * Number(limit);

    // Build where clause
    const where = {
      contactId,
      createdBy: req.user.id
    };

    // Count total questionnaires for this contact
    const total = await prisma.investorQuestionnaire.count({ where });

    // Determine sort order
    const orderBy = {};
    orderBy[sortBy] = order === 'asc' ? 'asc' : 'desc';

    // Get questionnaires with pagination
    const questionnaires = await prisma.investorQuestionnaire.findMany({
      where,
      orderBy,
      skip,
      take: Number(limit)
    });

    res.status(200).json({
      success: true,
      data: questionnaires,
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
