const app = require('./app');
const http = require('http');
const config = require('config');
const database = require('./services/database');

const defaultThreadPoolSize = 4;

// Increase thread pool size by poolMax
process.env.UV_THREADPOOL_SIZE =
  config.get('dbRootPool.poolMax') + defaultThreadPoolSize;

const httpServer = http.createServer(app);

function init() {
  return new Promise((resolve, reject) => {
    httpServer
      .listen(config.get('port'))
      .on('listening', () => {
        console.log(
          `Express server listening on localhost:${config.get('port')}`
        );
        resolve();
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

function close() {
  return new Promise((resolve, reject) => {
    httpServer.close((err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

async function startup() {
  try {
    console.log('Initialization express server');
    await init();
    let wait = true;
    while (wait) {
      try {
        console.log('Initializing database module');
        await database.initialize();
        wait = false;
      } catch (e) {
        console.log('db error:', e);
        await delay(5000);
      }
    }
  } catch (e) {
    console.error('error', e);
    process.exit(1);
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function shutdown(e) {
  let err = e;

  console.log('Shutting down');

  try {
    console.log('Closing database module');

    //    await database.close();
    console.log('Closing web server module');

    await close();
  } catch (e) {
    console.log('Encountered error', e);

    err = err || e;
  }

  console.log('Exiting process', err);

  if (err) {
    process.exit(1); // Non-zero failure code
  } else {
    process.exit(0);
  }
}

startup();

let running = true;

process.on('SIGTERM', () => {
  console.log('Received SIGTERM');
  shutdown();
});

process.on('SIGINT', () => {
  if (running) {
    console.log('Received SIGINT');

    shutdown();
    running = false;
  }
});

process.on('uncaughtException', (err) => {
  console.log('Uncaught exception');
  console.error(err);

  shutdown(err);
});
