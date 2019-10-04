const config = require('./utils/config');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');

mongoose
	.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log('connected to MongoDB');
	})
	.catch(error => {
		console.log('error connection to MongoDB:', error.message);
	});

app.use(cors());
app.use(bodyParser.json());
app.use('/api/blogs', blogsRouter);

module.exports = app;
