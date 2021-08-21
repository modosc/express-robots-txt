# express-robots-txt [![npm version](https://badge.fury.io/js/express-robots-txt.svg)](https://badge.fury.io/js/express-robots-txt) ![Node.js CI](https://github.com/modosc/express-robots-txt/workflows/Node.js%20CI/badge.svg)

Express middleware for generating a robots.txt or responding with an existing file.
# Usage
```javascript
// es6 usage requires a version of node which supports esm_conditional_exports, see
// https://nodejs.org/api/esm.html#esm_conditional_exports
import express from 'express'
import robots from 'express-robots-txt'

// commonjs
const express = require('express')
const robots = require('express-robots-txt')

const app = express()
const port = 3000

app.use(robots({
  UserAgent: '*',
  Disallow: '/',
  CrawlDelay: '5',
  Sitemap: 'https://nowhere.com/sitemap.xml',
}))

app.listen(port)
```
## Using a file

```javascript
app.use(robots(__dirname + '/robots.txt'));
```

## Using an object

### Basic object

```javascript
app.use(robots({
  UserAgent: '*',
  Disallow: '/'
}))
```

#### Will produce:
```
User-agent: *
Disallow: /
```

### Crawl Delay
You can optionally pass a CrawlDelay in just like passing in Disallow

```javascript
app.use(robots({
  UserAgent: '*',
  Disallow: '/',
  CrawlDelay: '5'
}))
```

#### Will produce:
```
User-agent: *
Disallow: /
Crawl-delay: 5
```
### Sitemap
You can optionally pass a Sitemap in just like passing in CrawlDelay:


```javascript
app.use(robots({
  UserAgent: '*',
  Disallow: '/',
  CrawlDelay: '5',
  Sitemap: 'https://nowhere.com/sitemap.xml'
}))
```

#### Will produce:
```
User-agent: *
Disallow: /
Crawl-delay: 5
Sitemap: https://nowhere.com/sitemap.xml
```

You can also pass in an array of Sitemaps:

```javascript
app.use(robots({
  UserAgent: '*',
  Disallow: '/',
  CrawlDelay: '5',
  Sitemap: [
    'https://nowhere.com/sitemap.xml',
    'https://nowhere.com/sitemap2.xml'
  ]
}))
```

#### Will produce:
```
User-agent: *
Disallow: /
Crawl-delay: 5
Sitemap: https://nowhere.com/sitemap.xml
Sitemap: https://nowhere.com/sitemap2.xml
```

### Or an array of objects

```javascript
app.use(robots([
  {
    UserAgent: 'Googlebot',
    Disallow: '/no-google'
  },
  {
    UserAgent: 'Bingbot',
    Disallow: '/no-bing'
  }
]));
```

#### Will produce:
```
User-agent: Googlebot
Disallow: /no-google
User-agent: Bingbot
Disallow: /no-bing
```

### Or either property (UserAgent | Disallow) as an array

```javascript
app.use(robots([
  {
    UserAgent: [ 'Googlebot', 'Slurp' ],
    Disallow: [ '/no-google', '/no-yahoo' ]
  },
  {
    UserAgent: '*',
    Disallow: [ '/no-bots', '/still-no-bots' ]
  }
]));
```

#### Will produce:
```
User-agent: Googlebot
User-agent: Slurp
Disallow: /no-google
Disallow: /no-yahoo
User-agent: *
Disallow: /no-bots
Disallow: /still-no-bots
```

### Host
You can optionally pass a Host in just like passing in Disallow. Note that [some
crawlers](https://en.wikipedia.org/wiki/Robots_exclusion_standard#Host) may not
support this drective.

```javascript
app.use(robots({
  UserAgent: '*',
  Disallow: '/',
  CrawlDelay: '5',
  Host: 'foobar.com'
}))
```

#### Will produce:
```
User-agent: *
Disallow: /
Crawl-delay: 5
Host: foobar.com
```

## Thanks
Originally forked from [weo-edu/express-robots](https://github.com/weo-edu/express-robots).
