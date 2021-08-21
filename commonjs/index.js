"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _express = require("express");

var _os = require("os");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const asArray = function asArray(value) {
  if (value === undefined) return [];
  if (Array.isArray(value)) return value;
  return [value];
};

function render(config) {
  let SitemapArray = [];
  let HostArray = [];
  let output = asArray(config).map(robot => {
    let userAgentArray = [];

    if (Array.isArray(robot.UserAgent)) {
      userAgentArray = robot.UserAgent.map(userAgent => `User-agent: ${userAgent}`);
    } else {
      userAgentArray.push(`User-agent: ${robot.UserAgent}`);
    }

    if (robot.CrawlDelay) {
      userAgentArray.push(`Crawl-delay: ${robot.CrawlDelay}`);
    }

    if (robot.Sitemap) {
      SitemapArray = SitemapArray.concat(robot.Sitemap);
    }

    if (robot.Host) {
      HostArray = HostArray.concat(robot.Host);
    }

    return userAgentArray.concat(asArray(robot.Disallow).map(disallow => {
      if (Array.isArray(disallow)) {
        return disallow.map(line => `Disallow: ${line}`).join(_os.EOL);
      }

      return `Disallow: ${disallow}`;
    })).join(_os.EOL);
  }).join(_os.EOL);

  if (SitemapArray.length > 0) {
    output += `${_os.EOL}${SitemapArray.map(sitemap => `Sitemap: ${sitemap}`).join(_os.EOL)}`;
  }

  if (HostArray.length > 0) {
    output += `${_os.EOL}${HostArray.map(host => `Host: ${host}`).join(_os.EOL)}`;
  }

  return output;
}

function buildRobots(config) {
  if (config) {
    if (typeof config === 'string') {
      return _fs.default.readFileSync(config, 'utf8');
    }

    return render(config);
  }

  return '';
}

function robots(config) {
  const router = (0, _express.Router)();
  router.get('/robots.txt', (req, res) => {
    res.header('Content-Type', 'text/plain');
    res.send(buildRobots(config));
  });
  return router;
}

var _default = robots;
exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=index.js.map