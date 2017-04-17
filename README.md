# express-robots-txt

Express middleware for generating a robots.txt or responding with an existing file. Forked from [weo-edu/express-robots](https://github.com/weo-edu/express-robots). 

## Using a file

```javascript
app.use(robots(__dirname + '/robots.txt'));
```

## Using an object

### Basic object

```javascript
app.use(robots({UserAgent: '*', Disallow: '/'}))
```

#### Will produce:
```
UserAgent: *
Disallow: /
```

### Crawl Delay
You can optionally pass a CrawlDelay in just like passing in Disallow

```javascript
app.use(robots({UserAgent: '*', Disallow: '/', CrawlDelay: '5'}))
```

#### Will produce:
```
UserAgent: *
Disallow: /
Crawl-delay: 5
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
UserAgent: Googlebot
Disallow: /no-google
UserAgent: Bingbot
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
UserAgent: Googlebot
UserAgent: Slurp
Disallow: /no-google
Disallow: /no-yahoo
UserAgent: *
Disallow: /no-bots
Disallow: /still-no-bots
```
