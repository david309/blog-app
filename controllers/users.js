const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

// Get all blogs
usersRouter.get('/', async (request, response) => {
	const users = await User.find({}).populate('blogs', { title: 1, date: 1 });
	response.json(users.map(user => user.toJSON()));
});

// Post a blog
usersRouter.post('/', async (request, response, next) => {
	if (request.body.password.length < 3) {
		return response.status(400).json({ error: 'password must be at least 3 characters' });
	}
	try {
		const body = request.body;

		const saltRounds = 10;
		const passwordHash = await bcrypt.hash(body.password, saltRounds);

		const user = new User({
			username: body.username,
			name: body.name,
			passwordHash,
			date: new Date()
		});

		const savedUser = await user.save();

		response.json(savedUser);
	} catch (err) {
		next(err);
	}
});

module.exports = usersRouter;
