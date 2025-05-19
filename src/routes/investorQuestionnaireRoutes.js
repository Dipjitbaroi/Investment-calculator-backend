const express = require('express');
const { 
  getAllQuestionnaires, 
  getQuestionnaireById, 
  createQuestionnaire, 
  updateQuestionnaire, 
  deleteQuestionnaire,
  getContactQuestionnaires
} = require('../controllers/investorQuestionnaireController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes need authentication
router.use(protect);

/**
 * @swagger
 * /api/questionnaires:
 *   get:
 *     summary: Get all investor questionnaires
 *     tags: [Investor Questionnaires]
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
 *                     $ref: '#/components/schemas/InvestorQuestionnaire'
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
 *     summary: Create a new investor questionnaire
 *     tags: [Investor Questionnaires]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isAccreditedInvestor
 *               - hasInvestedBefore
 *               - lookingTimeframe
 *               - primaryInvestmentGoal
 *               - investmentTimeline
 *               - capitalToInvest
 *               - useFinancing
 *               - marketsInterested
 *               - propertyTypesInterested
 *               - investmentTimeframe
 *               - contactId
 *             properties:
 *               isAccreditedInvestor:
 *                 type: boolean
 *                 description: Whether the investor is accredited
 *               hasInvestedBefore:
 *                 type: boolean
 *                 description: Whether the investor has invested in real estate before
 *               lookingTimeframe:
 *                 type: string
 *                 description: How long they have been looking to invest in real estate
 *               primaryInvestmentGoal:
 *                 type: string
 *                 description: Primary investment goal
 *               investmentTimeline:
 *                 type: string
 *                 description: Investment timeline
 *               capitalToInvest:
 *                 type: string
 *                 description: How much capital they are looking to invest
 *               useFinancing:
 *                 type: string
 *                 description: Whether they plan to use financing
 *               marketsInterested:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Markets they are interested in investing in
 *               propertyTypesInterested:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Property types they are interested in
 *               investmentTimeframe:
 *                 type: string
 *                 description: When they plan to make their first/next investment
 *               notes:
 *                 type: string
 *                 description: Additional notes
 *               contactId:
 *                 type: string
 *                 description: ID of the contact this questionnaire is for
 *     responses:
 *       201:
 *         description: Investor questionnaire created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/InvestorQuestionnaire'
 *                 message:
 *                   type: string
 */
router.route('/')
  .get(getAllQuestionnaires)
  .post(createQuestionnaire);

/**
 * @swagger
 * /api/questionnaires/{id}:
 *   get:
 *     summary: Get investor questionnaire by ID
 *     tags: [Investor Questionnaires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Investor questionnaire ID
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
 *                   $ref: '#/components/schemas/InvestorQuestionnaire'
 *       404:
 *         description: Investor questionnaire not found
 *   put:
 *     summary: Update investor questionnaire by ID
 *     tags: [Investor Questionnaires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Investor questionnaire ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isAccreditedInvestor:
 *                 type: boolean
 *               hasInvestedBefore:
 *                 type: boolean
 *               lookingTimeframe:
 *                 type: string
 *               primaryInvestmentGoal:
 *                 type: string
 *               investmentTimeline:
 *                 type: string
 *               capitalToInvest:
 *                 type: string
 *               useFinancing:
 *                 type: string
 *               marketsInterested:
 *                 type: array
 *                 items:
 *                   type: string
 *               propertyTypesInterested:
 *                 type: array
 *                 items:
 *                   type: string
 *               investmentTimeframe:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Investor questionnaire updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/InvestorQuestionnaire'
 *                 message:
 *                   type: string
 *       404:
 *         description: Investor questionnaire not found
 *   delete:
 *     summary: Delete investor questionnaire by ID
 *     tags: [Investor Questionnaires]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Investor questionnaire ID
 *     responses:
 *       200:
 *         description: Investor questionnaire deleted successfully
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
 *         description: Investor questionnaire not found
 */
router.route('/:id')
  .get(getQuestionnaireById)
  .put(updateQuestionnaire)
  .delete(deleteQuestionnaire);

/**
 * @swagger
 * /api/contacts/{contactId}/questionnaires:
 *   get:
 *     summary: Get all investor questionnaires for a specific contact
 *     tags: [Investor Questionnaires]
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
 *                     $ref: '#/components/schemas/InvestorQuestionnaire'
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
// router.get('/contacts/:contactId/questionnaires', getContactQuestionnaires);

module.exports = router;
