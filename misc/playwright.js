// Temporary commented before migration to playwright-test framework.
const waitOn = require('wait-on');

async function start() {
  const url = 'http://localhost:4200';

  console.log(`Wait for ${url}`);
  await waitOn({
    resources: [url]
  });

  return true;
}

start();
