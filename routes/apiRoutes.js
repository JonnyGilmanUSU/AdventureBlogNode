const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');


// Routes
router.get("/getBlogPosts", apiController.getBlogPosts);

router.get("/getBlogPostDetails/:id", apiController.getBlogPostDetails);

router.post("/createBlogPost", apiController.createBlogPost);

router.get("/getSearchResults", apiController.getSearchResults);



module.exports = router;