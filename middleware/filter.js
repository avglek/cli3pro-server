module.exports = (req, res, next) => {
  const paramsQuery = JSON.parse(req.query.params);
  if (paramsQuery) {
    paramsQuery.forEach((param) => {
      if (param.type === 'REF_CURSOR') {
        if (param.start !== undefined) {
          range(res, param, param.start, param.end);
        }
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
      if (param['sorting'] && param['sorting'].length > 0) {
        resJson.data[param.name].rows = sorting(
          param['sorting'][0],
          resJson.data[param.name].rows
        );
      }
      if (param['filter'] && param['filter'].length > 0) {
        resJson.data[param.name].rows = filter(
          param['filter'][0],
          resJson.data[param.name].rows
        );
      }
      resJson.data[param.name].rows = end
        ? resJson.data[param.name].rows.slice(start, end)
        : resJson.data[param.name].rows.slice(start);
      arguments[0] = JSON.stringify(resJson);
    }
    originalSend.apply(res, arguments);
  };
}

function sorting(sortParam, rows) {
  const collator = new Intl.Collator('en');
  return rows.sort((a, b) => {
    let result;
    if (isNaN(a[sortParam['colId']]) && !isNaN(b[sortParam['colId']])) {
      result = -1;
    } else if (!isNaN(a[sortParam['colId']]) && isNaN(b[sortParam['colId']])) {
      result = 1;
    } else {
      result = collator.compare(a[sortParam['colId']], b[sortParam['colId']]);
    }

    return sortParam['sort'] === 'asc' ? result : -result;
  });
}

function filter(filterParam, rows) {
  console.log(filterParam);

  return rows.filter((row) => row[filterParam.colId] === filterParam.value);
}
