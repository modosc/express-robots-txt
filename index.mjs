import fs from 'fs'
import { Router } from 'express'

if (!Array.isArray) {
  Array.isArray = function isArray(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
}

const asArray = function asArray(value) {
  if (value === undefined) return []
  if (Array.isArray(value)) return value
  return [value]
}

function robots(robots) {
  const router = Router()

  if (robots) {
    robots = typeof robots === 'string'
      ? fs.readFileSync(robots, 'utf8')
      : render(robots)
  } else robots = ''

  router.get('/robots.txt', (req, res) => {
    res.header('Content-Type', 'text/plain')
    res.send(robots)
  })

  return router
}

function render(robots) {
  let SitemapArray = []
  let HostArray = []
  var robots = asArray(robots).map((robot) => {
    let userAgentArray = []
    if (Array.isArray(robot.UserAgent)) {
      userAgentArray = robot.UserAgent.map((userAgent) => `User-agent: ${userAgent}`)
    } else {
      userAgentArray.push(`User-agent: ${robot.UserAgent}`)
    }
    if (robot.CrawlDelay) {
      userAgentArray.push(`Crawl-delay: ${robot.CrawlDelay}`)
    }

    if (robot.Sitemap) {
      SitemapArray = SitemapArray.concat(robot.Sitemap)
    }
    if (robot.Host) {
      HostArray = HostArray.concat(robot.Host)
    }

    return userAgentArray.concat(asArray(robot.Disallow).map((disallow) => {
      if (Array.isArray(disallow)) {
        return disallow.map((line) => `Disallow: ${line}`).join('\n')
      }
      return `Disallow: ${disallow}`
    })).join('\n')
  }).join('\n')

  if (SitemapArray.length > 0) {
    robots += `\n${SitemapArray.map((sitemap) => `Sitemap: ${sitemap}`).join('\n')}`
  }
  if (HostArray.length > 0) {
    robots += `\n${HostArray.map((host) => `Host: ${host}`).join('\n')}`
  }

  return robots
}

export default robots
