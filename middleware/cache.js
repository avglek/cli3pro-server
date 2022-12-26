const mcache = require('memory-cache');

module.exports = (req, res, next) => {
  if (req.query.isCache !== 'false') {
    const key = `__get_cursor__${req.query.uid}`;

    let cachedBody = mcache.get(key);
    if (cachedBody) {
      res.status(200).json(JSON.parse(cachedBody));
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        mcache.put(key, body, 10 * 60 * 1000);
        res.sendResponse(body);
      };
      next();
    }
  } else {
    next();
  }
};
