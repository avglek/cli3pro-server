
module.exports.update = async function (req, res) {
  console.log(req.params);
  console.log(req.body);

  res.status(200).json({ message: 'ok' });
};