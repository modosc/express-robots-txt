import express from 'express'
import robots from 'express-robots-txt'

const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))
app.use(robots({
  UserAgent: '*', Disallow: '/', CrawlDelay: '5', Sitemap: 'https://nowhere.com/sitemap.xml',
}))

/* eslint-disable no-console */
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
