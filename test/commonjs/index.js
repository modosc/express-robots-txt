const supertest = require('supertest')
const express = require('express')
const path = require('path')
const fs = require('fs')

const robots = require('../../commonjs')

const robotsTxt = path.resolve(__dirname, '../fixtures/robots.txt')

function createSuperTest(robotsMw) {
  const app = express()
  app.use(robotsMw)
  return supertest(app)
}

describe('express-robots', () => {
  let app

  beforeEach(() => {
    app = express()
  })
  test('should work', (done) => {
    app.use(robots())
    const request = createSuperTest(robots({ UserAgent: '*', Disallow: '/' }))
    request.get('/robots.txt').end((err, res) => {
      expect(res.status).to.equal(200)
      expect(res.headers['content-type']).to.equal('text/plain; charset=utf-8')
      expect(res.text).to.equal('User-agent: *\nDisallow: /')
      done()
    })
  })

  test('should work with a crawl delay', (done) => {
    const request = createSuperTest(robots({ UserAgent: '*', CrawlDelay: '5' }))
    request.get('/robots.txt').end((err, res) => {
      expect(res.status).to.equal(200)
      expect(res.headers['content-type']).to.equal('text/plain; charset=utf-8')
      expect(res.text).to.equal('User-agent: *\nCrawl-delay: 5')
      done()
    })
  })

  test('should work with multiple crawl delays', (done) => {
    const request = createSuperTest(
      robots([
        { UserAgent: '*', CrawlDelay: '5' },
        { UserAgent: 'Foo', CrawlDelay: '10' },
      ]),
    )
    request.get('/robots.txt').end((err, res) => {
      expect(res.status).to.equal(200)
      expect(res.headers['content-type']).to.equal('text/plain; charset=utf-8')
      expect(res.text).to.equal(
        'User-agent: *\nCrawl-delay: 5\nUser-agent: Foo\nCrawl-delay: 10',
      )
      done()
    })
  })

  test('should work with a sitemap', (done) => {
    const Sitemap = 'https://nowhere.com/sitemap.xml'
    const request = createSuperTest(robots({ UserAgent: '*', Sitemap }))
    request.get('/robots.txt').end((err, res) => {
      expect(res.status).to.equal(200)
      expect(res.headers['content-type']).to.equal('text/plain; charset=utf-8')
      expect(res.text).to.equal(`User-agent: *\nSitemap: ${Sitemap}`)
      done()
    })
  })

  test('should work with multiple sitemaps', (done) => {
    const Sitemaps = [
      'https://nowhere.com/sitemap.xml',
      'https://nowhere.com/sitemap2.xml',
    ]

    const request = createSuperTest(
      robots({ UserAgent: '*', Sitemap: Sitemaps }),
    )
    request.get('/robots.txt').end((err, res) => {
      expect(res.status).to.equal(200)
      expect(res.headers['content-type']).to.equal('text/plain; charset=utf-8')
      expect(res.text).to.equal(
        `User-agent: *\nSitemap: ${Sitemaps[0]}\nSitemap: ${Sitemaps[1]}`,
      )
      done()
    })
  })

  test('should work with sitemaps in multiple configs', (done) => {
    const Sitemaps = [
      'https://nowhere.com/sitemap.xml',
      'https://nowhere.com/sitemap2.xml',
    ]

    const request = createSuperTest(
      robots([
        { UserAgent: '*', Sitemap: Sitemaps[0] },
        { UserAgent: 'Foo', Sitemap: Sitemaps[1] },
      ]),
    )
    request.get('/robots.txt').end((err, res) => {
      expect(res.status).to.equal(200)
      expect(res.headers['content-type']).to.equal('text/plain; charset=utf-8')
      expect(res.text).to.equal(
        `User-agent: *\nUser-agent: Foo\nSitemap: ${
          Sitemaps[0]
        }\nSitemap: ${
          Sitemaps[1]}`,
      )
      done()
    })
  })

  test('should work with multiple sitemaps in multiple configs', (done) => {
    const Sitemaps = [
      'https://nowhere.com/sitemap.xml',
      'https://nowhere.com/sitemap2.xml',
    ]

    const request = createSuperTest(
      robots([
        { UserAgent: '*', Sitemap: Sitemaps },
        { UserAgent: 'Foo', Sitemap: Sitemaps },
      ]),
    )
    request.get('/robots.txt').end((err, res) => {
      expect(res.status).to.equal(200)
      expect(res.headers['content-type']).to.equal('text/plain; charset=utf-8')
      expect(res.text).to.equal(
        `User-agent: *\nUser-agent: Foo\nSitemap: ${
          Sitemaps[0]
        }\nSitemap: ${
          Sitemaps[1]
        }\nSitemap: ${
          Sitemaps[0]
        }\nSitemap: ${
          Sitemaps[1]}`,
      )
      done()
    })
  })

  test('should work with files', () => {
    const request = createSuperTest(robots(robotsTxt))
    request.get('/robots.txt').end((err, res) => {
      expect(res.status).to.equal(200)
      expect(res.text).to.equal(
        fs.readFileSync(robotsTxt, 'utf8'),
      )
    })
  })

  test('should respond with an empty file if nothing is specified', () => {
    const request = createSuperTest(robots())
    request.get('/robots.txt').end((err, res) => {
      expect(res.status).to.equal(200)
      expect(res.text).to.equal('')
    })
  })

  test('should work with host', (done) => {
    app.use(robots())
    const request = createSuperTest(robots({ UserAgent: '*', Disallow: '/', Host: 'some host' }))
    request.get('/robots.txt').end((err, res) => {
      expect(res.status).to.equal(200)
      expect(res.headers['content-type']).to.equal('text/plain; charset=utf-8')
      expect(res.text).to.equal('User-agent: *\nDisallow: /\nHost: some host')
      done()
    })
  })
})
