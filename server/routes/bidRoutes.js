const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    res.json({ message: 'Bid route' });
});

module.exports = router; 