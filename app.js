const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const compression = require('compression');
const authRoutes = require('./routes/auth');
const treeRoutes = require('./routes/tree');
const treeDocsRoutes = require('./routes/tree-docs');
const descriptionRoutes = require('./routes/description');
const procDataRoutes = require('./routes/proc-data');
const lookTableRoutes = require('./routes/look-table');
const ownersRoutes = require('./routes/owner');
const fileRoutes = require('./routes/file-data');
const updateTableRoutes = require('./routes/update-table');
const fieldsRoutes = require('./routes/fields');

const database = require('./services/database');

const app = express();

//app.set('query parser', 'simple');
app.use(compression());
app.use(express.static('public'));
app.use(require('morgan')('dev'));
app.use(require('cors')());
app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/tree', treeRoutes);
app.use('/api/tree-docs', treeDocsRoutes);
app.use('/api/desc', descriptionRoutes);
app.use('/api/proc', procDataRoutes);
app.use('/api/look-table', lookTableRoutes);
app.use('/api/owners', ownersRoutes);
app.use('/api/file', fileRoutes);
app.use('/api/update-table', updateTableRoutes);
app.use('/api/fields', fieldsRoutes);

app.get('/test', async (req, res) => {
  const result = await database.simpleExecute(
    'select user, systimestamp from dual'
  );
  const user = result.rows[0].USER;
  const date = result.rows[0].SYSTIMESTAMP;

  res.end(`DB user: ${user}\nDate: ${date}`);
});

module.exports = app;
