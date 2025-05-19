const express = require('express');
const { 
  getAllCalculations, 
  getCalculationById, 
  createCalculation, 
  updateCalculation, 
  deleteCalculation,
  getContactCalculations
} = require('../controllers/investmentCalculationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes need authentication
router.use(protect);

/**
 * @swagger
 * /api/calculations:
 *   get:
 *     summary: Get all investment calculations
 *     tags: [Investment Calculations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: contactId
 *         schema:
 *           type: string
 *         description: Filter by contact ID
 *       - in: query
 *         name: propertyType
 *         schema:
 *           type: string
 *         description: Filter by property type
 *       - in: query
 *         name: marketArea
 *         schema:
 *           type: string
 *         description: Filter by market area
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/InvestmentCalculation'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *   post:
 *     summary: Create a new investment calculation
 *     tags: [Investment Calculations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - propertyType
 *               - marketArea
 *               - investmentAmount
 *               - holdPeriod
 *               - annualReturnRate
 *               - propertyManagementFee
 *               - vacancyRate
 *               - monthlyCashFlow
 *               - annualCashFlow
 *               - totalReturn
 *               - roi
 *               - contactId
 *             properties:
 *               propertyType:
 *                 type: string
 *                 description: Type of property (e.g., "Single Family Residence")
 *               marketArea:
 *                 type: string
 *                 description: Market area (e.g., "Indianapolis, IN")
 *               investmentAmount:
 *                 type: number
 *                 format: float
 *                 description: Investment amount (e.g., 100000)
 *               holdPeriod:
 *                 type: integer
 *                 description: Hold period in years (e.g., 5)
 *               annualReturnRate:
 *                 type: number
 *                 format: float
 *                 description: Annual return rate as percentage (e.g., 10.0)
 *               propertyManagementFee:
 *                 type: number
 *                 format: float
 *                 description: Property management fee as percentage (e.g., 8.0)
 *               vacancyRate:
 *                 type: number
 *                 format: float
 *                 description: Vacancy rate as percentage (e.g., 5.0)
 *               monthlyCashFlow:
 *                 type: number
 *                 format: float
 *                 description: Monthly cash flow (e.g., 725)
 *               annualCashFlow:
 *                 type: number
 *                 format: float
 *                 description: Annual cash flow (e.g., 8700)
 *               totalReturn:
 *                 type: number
 *                 format: float
 *                 description: Total return (e.g., 43500)
 *               roi:
 *                 type: number
 *                 format: float
 *                 description: ROI as percentage (e.g., 43.5)
 *               notes:
 *                 type: string
 *                 description: Additional notes
 *               contactId:
 *                 type: string
 *                 description: ID of the contact this calculation is for
 *     responses:
 *       201:
 *         description: Investment calculation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/InvestmentCalculation'
 *                 message:
 *                   type: string
 */
router.route('/')
  .get(getAllCalculations)
  .post(createCalculation);

/**
 * @swagger
 * /api/calculations/{id}:
 *   get:
 *     summary: Get investment calculation by ID
 *     tags: [Investment Calculations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Investment calculation ID
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/InvestmentCalculation'
 *       404:
 *         description: Investment calculation not found
 *   put:
 *     summary: Update investment calculation by ID
 *     tags: [Investment Calculations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Investment calculation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyType:
 *                 type: string
 *               marketArea:
 *                 type: string
 *               investmentAmount:
 *                 type: number
 *                 format: float
 *               holdPeriod:
 *                 type: integer
 *               annualReturnRate:
 *                 type: number
 *                 format: float
 *               propertyManagementFee:
 *                 type: number
 *                 format: float
 *               vacancyRate:
 *                 type: number
 *                 format: float
 *               monthlyCashFlow:
 *                 type: number
 *                 format: float
 *               annualCashFlow:
 *                 type: number
 *                 format: float
 *               totalReturn:
 *                 type: number
 *                 format: float
 *               roi:
 *                 type: number
 *                 format: float
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Investment calculation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/InvestmentCalculation'
 *                 message:
 *                   type: string
 *       404:
 *         description: Investment calculation not found
 *   delete:
 *     summary: Delete investment calculation by ID
 *     tags: [Investment Calculations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Investment calculation ID
 *     responses:
 *       200:
 *         description: Investment calculation deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Investment calculation not found
 */
router.route('/:id')
  .get(getCalculationById)
  .put(updateCalculation)
  .delete(deleteCalculation);

/**
 * @swagger
 * /api/contacts/{contactId}/calculations:
 *   get:
 *     summary: Get all investment calculations for a specific contact
 *     tags: [Investment Calculations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/InvestmentCalculation'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       404:
 *         description: Contact not found or access denied
 */
// This route is defined in contactRoutes.js
// router.get('/contacts/:contactId/calculations', getContactCalculations);

module.exports = router;
