const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPost} = require('./models');

BlogPost.create(
	'First Post', 'This is my first blog post!', 'Liz Zitnik', '2017');
BlogPost.create(
	'Second Post', 'This is my second blog post', 'Liz Zitnik', '2017');

router.get('/', (req, res) => {
	res.json(BlogPost.get());
});

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author', 'publishDate'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}
	const item = BlogPost.create(req.body.title, req.body.title, req.body.content, req.body.author, req.body.publishDate);
	res.status(201).json(item);
});

router.delete('/:id', (req, res) => {
	BlogPost.delete(req.params.id);
	console.log(`Deleted blog post \`${req.params.id}\``);
	res.status(204).end();
});

router.put('/:id', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author', 'publishDate'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}
	if (req.params.id !== req.body.id) {
		const message = (
			`Request path id (${req.params.id}) and request body id (${req.body.id}) must match`);
		console.log(message);
		return res.status(400).send(message);
	}
	console.log(`Updating blog post \`${req.params.id}\``);
	const updatedItem = BlogPost.update({
		id: req.params.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: req.body.publishDate
	});
	res.status(204).end();
});

module.exports = router;

