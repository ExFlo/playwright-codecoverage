import { QuickstartPage } from './app.po';
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { promisify } from 'util'
import rimraf from 'rimraf'
const fsAsync = fs.promises

import NYC from 'nyc';

const v8toIstanbul = require('v8-to-istanbul')
const NYC_DIR = '.nyc_output';
const COV_MERGE_DIR = path.join(NYC_DIR, 'merge');

const cleanMergeFiles = async (): Promise<void> => {
  await promisify(rimraf)(COV_MERGE_DIR)
}

export const setupCoverage = async (): Promise<void> => {
  if (!fs.existsSync(NYC_DIR)) {
    await fsAsync.mkdir(NYC_DIR)
  }
  await cleanMergeFiles()
  await fsAsync.mkdir(COV_MERGE_DIR)
}

// Playwright only attempt
export const saveCoverageToFile = async (coverage: unknown): Promise<void> => {
  await fsAsync.writeFile(
    path.join(COV_MERGE_DIR, `${uuidv4()}.json`),
    JSON.stringify(coverage)
  )
}

export const mergeCoverage = async (): Promise<void> => {
  const nycInstance = new NYC({
    _: ['merge'],
  })
 try {
  const map = await nycInstance.getCoverageMapFromAllCoverageFiles(COV_MERGE_DIR)
  const outputFile = path.join(NYC_DIR, 'coverage.json')
  const content = JSON.stringify(map, null, 2)
  await fsAsync.writeFile(outputFile, content)
  console.log(
    `Coverage file (${content.length} bytes) written to ${outputFile}`,
  )

  // After merging the files we can generate the reports.
  // const nycInstanceR = new NYC({
  //   reportDir: `coverage-e2e`,
  //   reporter: ['lcov', 'json', 'text-summary']
  // });
  // nycInstanceR.report();
  // nycInstanceR.cleanup();
 } catch (error) {
      console.log('Error in onComplete:', error);
      process.exit(1);
  }
  // await cleanMergeFiles()
}

// Playwright only attempt
test.afterAll(async () => {
  await mergeCoverage();
});

test.beforeAll(async () => {
  await setupCoverage();
});

// Playwright only attempt
test.beforeEach(async ({ page}) => {
  await page.coverage.startJSCoverage();
});

var index = 0;

test.afterEach(async ({ page, browser }) => {
  // Playwright only attempt
  const coverage = await page.coverage.stopJSCoverage();
  if (coverage) {
    await saveCoverageToFile(coverage);
    for (const entry of coverage) {
      const converter = new v8toIstanbul('', 0, { source: entry.source });
      await converter.load();
      converter.applyCoverage(entry.functions);
      //   console.log(JSON.stringify(converter.toIstanbul()));
      await saveCoverageToFile(converter.toIstanbul());
    }
  }
});

test.describe('Quickstart App', () => {
  test('should display welcome message', async ({ page }) => {
    const po = new QuickstartPage(page);
    await po.openThePage();
    await po.waitLoaded();

    // Test the feature module
    expect(await page.innerText('h2') as string).toBe(`Resources`);
  });

  test('should display lazy module', async ({ page }) => {
    const po = new QuickstartPage(page);
    await po.openThePage();
    await po.waitLoaded();

    // Test the lazy feature module
    expect(await page.innerText(':nth-match(h2, 2)')).toBe('Next Steps');
  });
});
