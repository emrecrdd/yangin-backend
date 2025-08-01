// routes/alertRoutes.js
const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

// GET /api/alerts
router.get('/', alertController.getAllAlerts);

// GET /api/alerts/:id
router.get('/:id', alertController.getAlertById);

// PUT /api/alerts/:id
router.put('/:id', alertController.updateAlertStatus);

module.exports = router;
