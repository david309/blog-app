const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

// Get all blogs
blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
	response.json(blogs.map(blog => blog.toJSON()));
});

// Post a blog
blogsRouter.post('/', async (request, response, next) => {
	const body = request.body;

	const user = await User.findById(body.userId);

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
		date: new Date(),
		user: user._id
	});

	try {
		const savedBlog = await blog.save();
		user.blogs = user.blogs.concat(savedBlog._id);
		await user.save();
		response.json(savedBlog.toJSON());
	} catch (err) {
		next(err);
	}
});

module.exports = blogsRouter;
