const express = require('express');
const router = express.Router();
const { triggerSOS, resolveSOS, acceptSOS } = require('../controllers/emergencyController');
const { protect } = require('../middleware/auth');

router.post('/sos', protect, triggerSOS);
router.put('/resolve/:id', protect, resolveSOS);
router.put('/accept/:id', protect, acceptSOS);

module.exports = router;
