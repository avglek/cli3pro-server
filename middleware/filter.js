module.exports = (req, res, next) => {
  const paramsQuery = JSON.parse(req.query.params);
  if (paramsQuery) {
    paramsQuery.forEach((param) => {
      if (param.start) {
        range(res, param.name, param.start, param.end);
      }
    });
  }

  next();
};

function range(res, param, start, end) {
  const originalSend = res.send;
  res.send = function () {
    const resJson = JSON.parse(arguments[0]);
    if (resJson.data) {
      resJson.data[param].rows = end
        ? resJson.data[param].rows.slice(start, end)
        : resJson.data[param].rows.slice(start);
      arguments[0] = JSON.stringify(resJson);
    }
    originalSend.apply(res, arguments);
  };
}
