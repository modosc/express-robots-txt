var fs = require("fs");
var supertest = require("supertest");
var robots = require("../");
var express = require("express");
var app;

describe("express-robots", () => {
  function createSuperTest(robots) {
    var app = express();
    app.use(robots);
    return supertest(app);
  }
  beforeEach(() => {
    app = express();
  });
  test("should work", done => {
    app.use(robots());
    var request = createSuperTest(robots({ UserAgent: "*", Disallow: "/" }));
    request.get("/robots.txt").end(function(err, res) {
      expect(res.status).to.equal(200);
      expect(res.headers["content-type"]).to.equal("text/plain; charset=utf-8");
      expect(res.text).to.equal("User-agent: *\nDisallow: /");
      done();
    });
  });

  test("should work with a crawl delay", done => {
    var request = createSuperTest(robots({ UserAgent: "*", CrawlDelay: "5" }));
    request.get("/robots.txt").end(function(err, res) {
      expect(res.status).to.equal(200);
      expect(res.headers["content-type"]).to.equal("text/plain; charset=utf-8");
      expect(res.text).to.equal("User-agent: *\nCrawl-delay: 5");
      done();
    });
  });

  test("should work with multiple crawl delays", done => {
    var request = createSuperTest(
      robots([
        { UserAgent: "*", CrawlDelay: "5" },
        { UserAgent: "Foo", CrawlDelay: "10" }
      ])
    );
    request.get("/robots.txt").end(function(err, res) {
      expect(res.status).to.equal(200);
      expect(res.headers["content-type"]).to.equal("text/plain; charset=utf-8");
      expect(res.text).to.equal(
        "User-agent: *\nCrawl-delay: 5\nUser-agent: Foo\nCrawl-delay: 10"
      );
      done();
    });
  });

  test("should work with a sitemap", done => {
    var Sitemap = "https://nowhere.com/sitemap.xml";
    var request = createSuperTest(robots({ UserAgent: "*", Sitemap: Sitemap }));
    request.get("/robots.txt").end(function(err, res) {
      expect(res.status).to.equal(200);
      expect(res.headers["content-type"]).to.equal("text/plain; charset=utf-8");
      expect(res.text).to.equal("User-agent: *\nSitemap: " + Sitemap);
      done();
    });
  });

  test("should work with multiple sitemaps", done => {
    var Sitemaps = [
      "https://nowhere.com/sitemap.xml",
      "https://nowhere.com/sitemap2.xml"
    ];

    var request = createSuperTest(
      robots({ UserAgent: "*", Sitemap: Sitemaps })
    );
    request.get("/robots.txt").end(function(err, res) {
      expect(res.status).to.equal(200);
      expect(res.headers["content-type"]).to.equal("text/plain; charset=utf-8");
      expect(res.text).to.equal(
        "User-agent: *\nSitemap: " + Sitemaps[0] + "\nSitemap: " + Sitemaps[1]
      );
      done();
    });
  });

  test("should work with sitemaps in multiple configs", done => {
    var Sitemaps = [
      "https://nowhere.com/sitemap.xml",
      "https://nowhere.com/sitemap2.xml"
    ];

    var request = createSuperTest(
      robots([
        { UserAgent: "*", Sitemap: Sitemaps[0] },
        { UserAgent: "Foo", Sitemap: Sitemaps[1] }
      ])
    );
    request.get("/robots.txt").end(function(err, res) {
      expect(res.status).to.equal(200);
      expect(res.headers["content-type"]).to.equal("text/plain; charset=utf-8");
      expect(res.text).to.equal(
        "User-agent: *\nUser-agent: Foo\nSitemap: " +
          Sitemaps[0] +
          "\nSitemap: " +
          Sitemaps[1]
      );
      done();
    });
  });

  test("should work with multiple sitemaps in multiple configs", done => {
    var Sitemaps = [
      "https://nowhere.com/sitemap.xml",
      "https://nowhere.com/sitemap2.xml"
    ];

    var request = createSuperTest(
      robots([
        { UserAgent: "*", Sitemap: Sitemaps },
        { UserAgent: "Foo", Sitemap: Sitemaps }
      ])
    );
    request.get("/robots.txt").end(function(err, res) {
      expect(res.status).to.equal(200);
      expect(res.headers["content-type"]).to.equal("text/plain; charset=utf-8");
      expect(res.text).to.equal(
        "User-agent: *\nUser-agent: Foo\nSitemap: " +
          Sitemaps[0] +
          "\nSitemap: " +
          Sitemaps[1] +
          "\nSitemap: " +
          Sitemaps[0] +
          "\nSitemap: " +
          Sitemaps[1]
      );
      done();
    });
  });

  test("should work with files", () => {
    var request = createSuperTest(robots(__dirname + "/fixtures/robots.txt"));
    request.get("/robots.txt").end(function(err, res) {
      expect(res.status).to.equal(200);
      expect(res.text).to.equal(
        fs.readFileSync(__dirname + "/fixtures/robots.txt", "utf8")
      );
    });
  });

  test("should respond with an empty file if nothing is specified", () => {
    var request = createSuperTest(robots());
    request.get("/robots.txt").end(function(err, res) {
      expect(res.status).to.equal(200);
      expect(res.text).to.equal("");
    });
  });
});
