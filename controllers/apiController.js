const BlogPost = require('../models/BlogPost');

exports.getBlogPosts = async (req, res, next) => {
    try {
        const category = req.headers['category'];
        const categoryQuery = category ? { category: category } : {};

        const blogPosts = await BlogPost.find(categoryQuery);
        console.log(blogPosts)
        res.json({ blogPosts })
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getBlogPostDetails = async (req, res) => {
    try {
    console.log(req.params.id)
      const post = await BlogPost.findById(req.params.id);
      if (!post) return res.status(404).send('Post not found');
      res.send(post);
    } catch (error) {
      res.status(500).send('Server error');
    }
  };

exports.createBlogPost = async (req, res, next) => {
    try {
        const newPost = new BlogPost({
            title: 'Battles Ship Mountain',
            imageURL: 'http://192.168.1.130:3000/static/media/MobileHeroImage.0ca8bc8dfb1a2159f947.png',
            summary: 'Embark on an exhilarating journey to conquer the majestic Battles Ship Mountain, where every step is a testament to natures grandeur and the human spirits resilience.',
            content: 'Nestled amidst the rugged terrain of the wilderness, Battles Ship Mountain stands as a symbol of challenge and triumph for avid hikers and adventure enthusiasts. As dawn breaks, casting its golden hues over the verdant valleys below, intrepid explorers begin their ascent. The trail, adorned with ancient trees and cascading streams, weaves its way through the heart of the forest, offering glimpses of elusive wildlife and serene landscapes. With each stride, the air grows crisper, and the distant peaks beckon with their untold mysteries. At the summit, a panorama of unparalleled beauty unfolds—a tapestry of rolling hills, pristine lakes, and distant horizons stretching as far as the eye can see. Here, amidst the whispering winds and soaring eagles, one finds solace in natures embrace and inspiration in its boundless wonders.',
            postDate: new Date(), // Use the date from the request or the current date
            category: 'hiking'
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        console.error('Failed to create blog post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getSearchResults = async (req, res, next) => {
    const searchInput = req.query.search;
    console.log("Search Input:  ", searchInput);

    try {
        const searchResults = await BlogPost.find({
            $text: { $search: searchInput }
        }, { score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } });
        
        if (searchResults.length > 0) {
            res.status(200).json({ successMessage: 'Search results fetched successfully', data: searchResults });
        } else {
            res.status(404).json({ message: 'No results found' });
        }

    } catch (error) {
        console.log(error)
        console.error('Search Error:', error);
        res.status(500).json({ errorMessage: "Search Failed" });
    }
}