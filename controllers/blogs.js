const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Get all blogs
blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
	response.json(blogs.map(blog => blog.toJSON()));
});

// Post a blog
blogsRouter.post('/', async (request, response, next) => {
	const body = request.body;
	const token = request.token;
	console.log('token', token);

	try {
		const decodedToken = jwt.verify(token, process.env.SECRET);
		console.log('decodedToken', decodedToken);

		if (!token || !decodedToken.id) {
			return response.status(401).json({ error: 'token missing or invalid' });
		}

		const user = await User.findById(decodedToken.id);

		const blog = new Blog({
			title: body.title,
			author: body.author,
			url: body.url,
			likes: body.likes,
			date: new Date(),
			user: decodedToken.id // user._id
		});

		const savedBlog = await blog.save();
		user.blogs = user.blogs.concat(savedBlog._id);
		await user.save();
		response.json(savedBlog.toJSON());
	} catch (err) {
		next(err);
	}
});

blogsRouter.delete('/', async (request, response, next) => {
	const body = request.body;
	const token = request.token;

	try {
		const decodedToken = jwt.verify(token, process.env.SECRET);

		if (!token || !decodedToken.id) {
			return response.status(401).json({ error: 'token missing or invalid' });
		}

		const blog = await Blog.findById(body.id);

		if (!blog) {
			return response.status(401).json({ error: 'blog does not exist' });
		}

		if (blog.user.toString() === decodedToken.id.toString()) {
			blog.delete();
		} else {
			response.status(401).json({ error: 'cannot delete blog you did not create' });
		}

		response.status(204).end();
	} catch (err) {
		next(err);
	}
});

module.exports = blogsRouter;
