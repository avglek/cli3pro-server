const errorHandler = require('../utils/errorHandler');
const tools = require('../utils/data-tools');

module.exports.get = async function (req, res) {
  const schema = req.params['schema'];
  try {
    const docId = req.query.docId;
    const fields = req.query.fields;
    const fl = fields.toString().trim().split(';');

    const fieldResult = await tools.getFields(schema, fl, docId);

    res.status(200).json(fieldResult);
  } catch (e) {
    console.log('Error:', e);
    errorHandler(res, e);
  } finally {
    console.log('finally get fields');
  }
};
