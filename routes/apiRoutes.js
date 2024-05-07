const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');


// Routes
router.get("/getBlogPosts", apiController.getBlogPosts);

router.post("/createBlogPost", apiController.createBlogPost);


module.exports = router;