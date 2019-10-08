const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

// Get all blogs
blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({});
	response.json(blogs.map(blog => blog.toJSON()));
});

// Post a blog
blogsRouter.post('/', async (request, response) => {
	const blog = new Blog(request.body);

	try {
		const savedBlog = await blog.save();
		response.json(savedBlog.toJSON());
	} catch (e) {
		console.log(e);
	}
});

module.exports = blogsRouter;
