const dayjs = require('dayjs');

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
  //console.log('filter:', filterParam);

  return filterParam.reduce((acc, filterElement) => {
    acc = acc.filter((row) => {
      switch (filterElement.filterType) {
        case 'number':
          return numberTypeFilter(row[filterElement.colId], filterElement);
        case 'date':
          return dateTypeFilter(row[filterElement.colId], filterElement);
        case 'text':
          return textTypeFilter(row[filterElement.colId], filterElement);

        default:
          return true;
      }
    });
    return acc;
  }, rows);
}

/************* Filter type check *******
 *
 * 'empty' - Фильтр не определен(используется в настраиваемых фильтрах)
 * 'equals' - Равно
 * 'notEqual' - Не равно
 * 'lessThan' - Меньше чем
 * 'lessThanOrEqual' - Меньше или равно
 * 'greaterThan' - Больше чем
 * 'greaterThanOrEqual' - Больше или равно
 * 'inRange' - В промежутке
 * 'contains' - Содержит
 * 'notContains' - Не содержит
 * 'startsWith' - Начинается с
 * 'endsWith' - Заканчивается
 * 'blank' - Пустой
 * 'notBlank' - Не пустой
 */

function textTypeFilter(rowValue, filter) {
  // делаем регистронезависимым
  let value,
    filterValue = '';

  if (rowValue) value = rowValue.toUpperCase();
  if (filter.value) filterValue = filter.value.toUpperCase();

  switch (filter.type) {
    case 'equals':
      return value === filterValue;
    case 'notEqual':
      return value !== filterValue;
    case 'contains':
      return value.includes(filterValue);
    case 'notContains':
      return !value.includes(filterValue);
    case 'startsWith':
      return value.startsWith(filterValue);
    case 'endsWith':
      return value.endsWith(filterValue);
    case 'blank':
      return !value || value.trim() === '';
    case 'notBlank':
      return !(!value || value.trim() === '');
    case 'empty':
      return true;
    default:
      return true;
  }
}

function numberTypeFilter(rowValue, filter) {
  switch (filter.type) {
    case 'equals':
      return rowValue === filter.value;
    case 'notEqual':
      return rowValue !== filter.value;
    case 'lessThan':
      return rowValue < filter.value;
    case 'lessThanOrEqual':
      return rowValue <= filter.value;
    case 'greaterThan':
      return rowValue > filter.value;
    case 'greaterThanOrEqual':
      return rowValue >= filter.value;
    case 'inRange':
      return rowValue >= filter.value && rowValue <= filter.valueTo;
    case 'blank':
      return rowValue === 0;
    case 'notBlank':
      return rowValue !== 0;
    case 'empty':
      return true;
    default:
      return true;
  }
}

function dateTypeFilter(rowValue, filter) {
  let rowData,
    fromData,
    toData = null;
  let isBlank = false;

  // Проверка валидности даты
  if (rowValue === '') {
    isBlank = true;
  } else if (dayjs(rowValue).isValid()) {
    rowData = dayjs(rowValue).toDate();
  } else {
    return true;
  }

  if (dayjs(filter.dateFrom).isValid()) {
    fromData = dayjs(filter.dateFrom).toDate();
  }

  if (dayjs(filter.dateTo).isValid()) {
    toData = dayjs(filter.dateTo).toDate();
  }

  const equalsData =
    !isBlank &&
    rowData.getFullYear() === fromData.getFullYear() &&
    rowData.getMonth() === fromData.getMonth() &&
    rowData.getDate() === fromData.getDate();

  switch (filter.type) {
    case 'equals':
      return equalsData;
    case 'notEqual':
      return !equalsData;
    case 'lessThan':
      return rowData < fromData;
    case 'greaterThan':
      return rowData > fromData;
    case 'inRange':
      return rowData > fromData && rowData < toData;
    case 'blank':
      return isBlank;
    case 'notBlank':
      return !isBlank;
    case 'empty':
      return true;
    default:
      return true;
  }
}
