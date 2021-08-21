import fs from 'fs'
import { Router } from 'express'
import { EOL } from 'os'

const asArray = function asArray(value) {
  if (value === undefined) return []
  if (Array.isArray(value)) return value
  return [value]
}

function render(config) {
  let SitemapArray = []
  let HostArray = []
  let output = asArray(config).map((robot) => {
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
        return disallow.map((line) => `Disallow: ${line}`).join(EOL)
      }
      return `Disallow: ${disallow}`
    })).join(EOL)
  }).join(EOL)

  if (SitemapArray.length > 0) {
    output += `${EOL}${SitemapArray.map((sitemap) => `Sitemap: ${sitemap}`).join(EOL)}`
  }
  if (HostArray.length > 0) {
    output += `${EOL}${HostArray.map((host) => `Host: ${host}`).join(EOL)}`
  }

  return output
}

function buildRobots(config) {
  if (config) {
    if (typeof config === 'string') {
      return fs.readFileSync(config, 'utf8')
    }
    return render(config)
  }
  return ''
}

function robots(config) {
  const router = Router()

  router.get('/robots.txt', (req, res) => {
    res.header('Content-Type', 'text/plain')
    res.send(buildRobots(config))
  })

  return router
}

export default robots
