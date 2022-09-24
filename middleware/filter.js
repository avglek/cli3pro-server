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
          param['filter'],
          resJson.data[param.name].rows
        );
        resJson.data[param.name].count = resJson.data[param.name].rows.length;
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
  console.log('filter:', filterParam);

  return filterParam.reduce((acc, filterElement) => {
    acc = acc.filter((row) => {
      let res;
      if (filterElement.type === 0) {
        res = row[filterElement.colId] === filterElement.value;
      } else if (filterElement.type === 1) {
        let temp = row[filterElement.colId];
        let value = filterElement.value;
        if (typeof temp === 'string') temp = temp.toUpperCase();
        if (typeof value === 'string') value = value.toUpperCase();

        res = temp.includes(value);
      }
      return res;
    });
    return acc;
  }, rows);

}
