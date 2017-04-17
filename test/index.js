var fs = require('fs');
var expect = require('chai').expect;
var supertest = require('supertest');
var robots = require('../');

describe('express-robots', function() {
  it('should work', function(done) {
    var request = supertest(robots({UserAgent: '*', Disallow: '/'}));
    request
      .get('/robots.txt')
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        expect(res.headers['content-type']).to.equal('text/plain; charset=utf-8');
        expect(res.text).to.equal('User-agent: *\nDisallow: /');
        done();
      });
  });

  it('should work with a crawl delay', function(done) {
    var request = supertest(robots({UserAgent: '*', CrawlDelay: '5'}));
    request
      .get('/robots.txt')
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        expect(res.headers['content-type']).to.equal('text/plain; charset=utf-8');
        expect(res.text).to.equal('User-agent: *\nCrawl-delay: 5');
        done();
      });
  });

  it('should work with multiple crawl delays', function(done) {
    var request = supertest(robots([
      {UserAgent: '*', CrawlDelay: '5'},
      {UserAgent: 'Foo', CrawlDelay: '10'}
    ]));
    request
      .get('/robots.txt')
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        expect(res.headers['content-type']).to.equal('text/plain; charset=utf-8');
        expect(res.text).to.equal('User-agent: *\nCrawl-delay: 5\nUser-agent: Foo\nCrawl-delay: 10');
        done();
      });
  });


  it('should work with a sitemap', function(done) {
    var Sitemap = 'https://nowhere.com/sitemap.xml';
    var request = supertest(robots({UserAgent: '*', Sitemap: Sitemap}));
    request
      .get('/robots.txt')
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        expect(res.headers['content-type']).to.equal('text/plain; charset=utf-8');
        expect(res.text).to.equal('User-agent: *\nSitemap: ' + Sitemap);
        done();
      });
  });

  it('should work with multiple sitemaps', function(done) {
    var Sitemaps = ['https://nowhere.com/sitemap.xml', 'https://nowhere.com/sitemap2.xml'];

    var request = supertest(robots({UserAgent: '*', Sitemap: Sitemaps}));
    request
      .get('/robots.txt')
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        expect(res.headers['content-type']).to.equal('text/plain; charset=utf-8');
        expect(res.text).to.equal('User-agent: *\nSitemap: ' + Sitemaps[0] + '\nSitemap: ' + Sitemaps[1]);
        done();
      });
  });

  it('should work with sitemaps in multiple configs', function(done) {
    var Sitemaps = ['https://nowhere.com/sitemap.xml', 'https://nowhere.com/sitemap2.xml'];

    var request = supertest(robots([{UserAgent: '*', Sitemap: Sitemaps[0]}, {UserAgent: 'Foo', Sitemap: Sitemaps[1]}]));
    request
      .get('/robots.txt')
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        expect(res.headers['content-type']).to.equal('text/plain; charset=utf-8');
        expect(res.text).to.equal('User-agent: *\nUser-agent: Foo\nSitemap: ' + Sitemaps[0] + '\nSitemap: ' + Sitemaps[1]);
        done();
      });
  });

  it('should work with multiple sitemaps in multiple configs', function(done) {
    var Sitemaps = ['https://nowhere.com/sitemap.xml', 'https://nowhere.com/sitemap2.xml'];

    var request = supertest(robots([{UserAgent: '*', Sitemap: Sitemaps}, {UserAgent: 'Foo', Sitemap: Sitemaps}]));
    request
      .get('/robots.txt')
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        expect(res.headers['content-type']).to.equal('text/plain; charset=utf-8');
        expect(res.text).to.equal('User-agent: *\nUser-agent: Foo\nSitemap: ' + Sitemaps[0] + '\nSitemap: ' + Sitemaps[1] + '\nSitemap: ' + Sitemaps[0] + '\nSitemap: ' + Sitemaps[1]);
        done();
      });
  });

  it('should work with files', function() {
    var request = supertest(robots(__dirname + '/fixtures/robots.txt'));
    request
      .get('/robots.txt')
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        expect(res.text).to.equal(fs.readFileSync(__dirname + '/fixtures/robots.txt', 'utf8'));
      });
  });

  it('should respond with an empty file if nothing is specified', function() {
    var request = supertest(robots());
    request
      .get('/robots.txt')
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        expect(res.text).to.equal('');
      });
  });

});
