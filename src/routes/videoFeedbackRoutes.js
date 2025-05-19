const express = require('express');
const { 
  getAllFeedbacks, 
  getFeedbackById, 
  createFeedback, 
  updateFeedback, 
  deleteFeedback,
  getVideoFeedbacks,
  getContactFeedbacks
} = require('../controllers/videoFeedbackController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/feedbacks:
 *   get:
 *     summary: Get all video feedbacks
 *     tags: [Video Feedbacks]
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
 *         name: videoId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by video ID
 *       - in: query
 *         name: contactId
 *         schema:
 *           type: string
 *           format: uuid
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
 *                     $ref: '#/components/schemas/VideoFeedback'
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
 *     summary: Create a new video feedback
 *     tags: [Video Feedbacks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - videoId
 *               - responses
 *             properties:
 *               videoId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the video this feedback is for
 *               responses:
 *                 type: object
 *                 description: JSON object containing question/answer pairs
 *               contactId:
 *                 type: string
 *                 format: uuid
 *                 description: Optional ID of the contact this feedback is for
 *     responses:
 *       201:
 *         description: Video feedback created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/VideoFeedback'
 *                 message:
 *                   type: string
 */
// Public route for creating feedback, admin-only for getting all feedbacks
router.route('/')
  .post(createFeedback)
  .get(protect, authorize('ADMIN'), getAllFeedbacks);

/**
 * @swagger
 * /api/feedbacks/{id}:
 *   get:
 *     summary: Get video feedback by ID
 *     tags: [Video Feedbacks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Video feedback ID
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
 *                   $ref: '#/components/schemas/VideoFeedback'
 *       404:
 *         description: Video feedback not found
 *   put:
 *     summary: Update video feedback by ID
 *     tags: [Video Feedbacks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Video feedback ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               videoId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the video this feedback is for
 *               responses:
 *                 type: object
 *                 description: JSON object containing question/answer pairs
 *               contactId:
 *                 type: string
 *                 format: uuid
 *                 description: Optional ID of the contact this feedback is for
 *     responses:
 *       200:
 *         description: Video feedback updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/VideoFeedback'
 *                 message:
 *                   type: string
 *       404:
 *         description: Video feedback not found
 *   delete:
 *     summary: Delete video feedback by ID
 *     tags: [Video Feedbacks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Video feedback ID
 *     responses:
 *       200:
 *         description: Video feedback deleted successfully
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
 *         description: Video feedback not found
 */
// Admin-only routes for getting, updating, and deleting specific feedback
router.route('/:id')
  .get(protect, authorize('ADMIN'), getFeedbackById)
  .put(protect, authorize('ADMIN'), updateFeedback)
  .delete(protect, authorize('ADMIN'), deleteFeedback);

/**
 * @swagger
 * /api/feedbacks/videos/{videoId}:
 *   get:
 *     summary: Get all feedbacks for a specific video
 *     tags: [Video Feedbacks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Video ID
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
 *                     $ref: '#/components/schemas/VideoFeedback'
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
 *         description: Video not found
 */
// Admin-only route for getting all feedbacks for a specific video
router.get('/videos/:videoId', protect, authorize('ADMIN'), getVideoFeedbacks);

/**
 * @swagger
 * /api/feedbacks/contacts/{contactId}:
 *   get:
 *     summary: Get all feedbacks from a specific contact
 *     tags: [Video Feedbacks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
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
 *                     $ref: '#/components/schemas/VideoFeedback'
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
 *         description: Contact not found
 */
// Admin-only route for getting all feedbacks from a specific contact
router.get('/contacts/:contactId', protect, authorize('ADMIN'), getContactFeedbacks);

module.exports = router;
