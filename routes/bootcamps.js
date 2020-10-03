const express = require('express');
const router = express.Router();

router.get('', (req, res) => {
    res.status(200).json({success: true, msg: 'Show All Bootcamps'})
})
router.post('', (req, res) => {
    res.status(200).json({success: true, msg: 'Create New Bootcamp'})
})
router.get('/:id', (req, res) => {
    res.status(200).json({success: true, msg: `Display Bootcamp ${req.params.id}`})
})
router.put('/:id', (req, res) => {
    res.status(200).json({success: true, msg: `Update Bootcamp ${req.params.id}`})
})
router.delete('/:id', (req, res) => {
    res.status(200).json({success: true, msg: `Delete Bootcamp ${req.params.id}`})
})

module.exports = router;