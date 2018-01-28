const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);


describe('BlogPost', function() {
	before(function() {
		return runServer();
	});

	after(function() {
		return closeServer();
	});

	it('should list posts on GET', function() {
		return chai.request(app)
			.get('/blog-post')
			.then(function(res) {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.a('array');
				expect(res.body.length).to.be.at.least(1);

				const expectedKeys = ['title', 'content', 'author', 'publishDate'];
				res.body.forEach(function(item) {
					expect(item).to.be.a('object');
					expect(item).to.include.keys(expectedKeys);
				});
			});
	});

	it('should add a post on POST', function() {
		const newPost = {
			title: 'First Post',
			content: 'This is my first post!',
			author: 'Liz Zitnik',
			publishDate: '2017'
		};
		return chai.request(app)
			.post('/blog-post')
			.send(newPost)
			.then(function(res) {
				expect(res).to.have.status(201);
				expect(res).to.be.json;
				expect(res.body).to.be.a('object');
				expect(res.body).toinclude.keys('title', 'content', 'author', 'publishDate');
				expect(res.body.id).to.not.equal(null);
				expect(res.body).to.deep.equal(Object.assign(newPost, {id: res.body.id}));
			});
	});

	it('should update posts on PUT', function() {
    
    const updateData = {
      	id: req.params.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: req.body.publishDate
    };

    return chai.request(app)
      
      .get('/blog-post')
      .then(function(res) {
        updateData.id = res.body[0].id;
        
        return chai.request(app)
          .put(`/blog-post/${updateData.id}`)
          .send(updateData);
      })

      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.deep.equal(updateData);
      });
  });

  it('should delete items on DELETE', function() {
    return chai.request(app)

      .get('/blog-post')
      .then(function(res) {
        return chai.request(app)
          .delete(`/blog-post/${res.body[0].id}`);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
});

})