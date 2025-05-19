const prisma = require('../config/db');
const AppError = require('../utils/appError');
const { PAGINATION } = require('../config/constants');

// Get all investment calculations
exports.getAllCalculations = async (req, res, next) => {
  try {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      contactId,
      propertyType,
      marketArea,
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
    if (propertyType) {
      where.propertyType = propertyType;
    }
    if (marketArea) {
      where.marketArea = marketArea;
    }

    // Count total calculations matching query
    const total = await prisma.investmentCalculation.count({ where });

    // Determine sort order
    const orderBy = {};
    orderBy[sortBy] = order === 'asc' ? 'asc' : 'desc';

    // Get calculations with pagination
    const calculations = await prisma.investmentCalculation.findMany({
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
      data: calculations,
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

// Get investment calculation by ID
exports.getCalculationById = async (req, res, next) => {
  try {
    let where = {
      id: req.params.id,
    };

    if (req.user.role === 'USER') {
      where.createdBy = req.user.id;
    }

    const calculation = await prisma.investmentCalculation.findFirst({
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

    if (!calculation) {
      return next(new AppError('Investment calculation not found', 404));
    }

    res.status(200).json({
      success: true,
      data: calculation
    });
  } catch (error) {
    next(error);
  }
};

// Create a new investment calculation
exports.createCalculation = async (req, res, next) => {
  try {
    const calculationData = {
      ...req.body,
      createdBy: req.user.id
    };

    // Validate required fields
    const requiredFields = [
      'propertyType', 
      'marketArea', 
      'investmentAmount', 
      'holdPeriod', 
      'annualReturnRate', 
      'propertyManagementFee', 
      'vacancyRate', 
      'monthlyCashFlow', 
      'annualCashFlow', 
      'totalReturn', 
      'roi', 
      'contactId'
    ];

    for (const field of requiredFields) {
      if (calculationData[field] === undefined) {
        return next(new AppError(`${field} is required`, 400));
      }
    }

    // Validate contact exists and belongs to user
    const contactExists = await prisma.contact.findFirst({
      where: {
        id: calculationData.contactId,
        createdBy: req.user.id
      }
    });

    if (!contactExists) {
      return next(new AppError('Contact not found or access denied', 404));
    }

    const calculation = await prisma.investmentCalculation.create({
      data: calculationData,
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
      data: calculation,
      message: 'Investment calculation created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Update an investment calculation
exports.updateCalculation = async (req, res, next) => {
  try {
    const calculationExists = await prisma.investmentCalculation.findFirst({
      where: {
        id: req.params.id,
        createdBy: req.user.id
      }
    });

    if (!calculationExists) {
      return next(new AppError('Investment calculation not found', 404));
    }

    const calculation = await prisma.investmentCalculation.update({
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
      data: calculation,
      message: 'Investment calculation updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete an investment calculation
exports.deleteCalculation = async (req, res, next) => {
  try {
    const calculationExists = await prisma.investmentCalculation.findFirst({
      where: {
        id: req.params.id,
        createdBy: req.user.id
      }
    });

    if (!calculationExists) {
      return next(new AppError('Investment calculation not found', 404));
    }

    await prisma.investmentCalculation.delete({
      where: { id: req.params.id }
    });

    res.status(200).json({
      success: true,
      message: 'Investment calculation deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get all calculations for a specific contact
exports.getContactCalculations = async (req, res, next) => {
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

    // Count total calculations for this contact
    const total = await prisma.investmentCalculation.count({ where });

    // Determine sort order
    const orderBy = {};
    orderBy[sortBy] = order === 'asc' ? 'asc' : 'desc';

    // Get calculations with pagination
    const calculations = await prisma.investmentCalculation.findMany({
      where,
      orderBy,
      skip,
      take: Number(limit)
    });

    res.status(200).json({
      success: true,
      data: calculations,
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
