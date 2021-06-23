#!/usr/bin/env node

process.env['TS_NODE_PROJECT'] = 'tsconfig.test.json';

require('ts-node/register');
require('regenerator-runtime/runtime');

const NYC = require('nyc');
const Mocha = require('mocha');
const fs = require('fs');
const path = require('path');

const createServer = require('./testrunner/server');
const chromeRun = require('./testrunner/chrome');
const phantomjsRun = require('./testrunner/phantomjs');

const mocha = new Mocha({
  ui: 'bdd',
  timeout: 10000,
  reporter: 'spec'
});

const testDir = path.resolve(__dirname, '../tests');

fs.readdirSync(testDir).filter(f => f.startsWith('test.')).forEach(f =>
  mocha.addFile(path.join(testDir, f)));

const nyc = global.nyc = new NYC({produceSourceMap: true});
nyc.reset();
nyc.wrap();

function mochaRun() {
  return new Promise((resolve, reject) => {
    try {
      mocha.run(failures => resolve(failures));
    } catch (err) {
      reject(err);
    }
  });
}

function getCoverageFilename(suffix) {
  const id = nyc.processInfo.uuid;
  return path.resolve(nyc.tempDirectory(), `${id}-${suffix}.json`);
  
}

function writeCoverage(coverage, suffix) {
  coverage = nyc.sourceMaps.remapCoverage(coverage);
  const coverageFilename = getCoverageFilename(suffix);
  fs.writeFileSync(coverageFilename, JSON.stringify(coverage), 'utf-8');
}

(async function() {
  const failures = await mochaRun();
  if (failures) {
    process.exitCode = 1;
    return;
  }

  writeCoverage(global.__coverage__, 'node');


  const server = await createServer();
  const address = `http://localhost:${server.address().port}/tests/`;

  let data;

  try {
    data = await chromeRun(address, {});
    await phantomjsRun(address, {
      coverageFile: getCoverageFilename('phantomjs'),
    });
  } catch (err) {
    server.close();
    console.error(err);
    process.exitCode = 1;
    return;
  }
  server.close();

  writeCoverage(data.coverage, 'chrome');

  nyc.writeCoverageFile();
  nyc.report();
}());
