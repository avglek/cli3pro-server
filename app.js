const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const treeRoutes = require('./routes/tree');
const treeDocsRoutes = require('./routes/tree-docs');
const descriptionRoutes = require('./routes/description');
const procDataRoutes = require('./routes/proc-data');

const database = require('./services/database');

const app = express();

//app.set('query parser', 'simple');

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

app.get('/test', async (req, res) => {
  const result = await database.simpleExecute(
    'select user, systimestamp from dual'
  );
  const user = result.rows[0].USER;
  const date = result.rows[0].SYSTIMESTAMP;

  res.end(`DB user: ${user}\nDate: ${date}`);
});

module.exports = app;
