const mcache = require('memory-cache');

module.exports = (req, res, next) => {
  const key = `__get_cursor__${req.query.uid}`;
  console.log('cache', key);

  let cachedBody = mcache.get(key);
  if (cachedBody) {
    res.status(200).json(JSON.parse(cachedBody));
    return;
  } else {
    res.sendResponse = res.send;
    res.send = (body) => {
      mcache.put(key, body, 10 * 60 * 1000);
      res.sendResponse(body);
    };
    next();
  }
};
