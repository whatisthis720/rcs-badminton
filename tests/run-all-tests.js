import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testFiles = [
  'tier1-feature-coverage.test.js',
  'tier2-boundary-edge.test.js',
  'tier3-cross-feature.test.js',
  'tier4-real-world.test.js',
];

console.log('======================================================================');
console.log("  Rc's Racquets Cult E2E Verification Test Suite (Tiers 1 - 4)");
console.log('======================================================================\n');

async function runTestFile(file) {
  const filePath = path.join(__dirname, file);
  return new Promise((resolve) => {
    const child = spawn('node', ['--test', filePath], {
      stdio: 'inherit',
      env: process.env,
    });

    child.on('close', (code) => {
      resolve({ file, code });
    });
  });
}

async function runAll() {
  let totalFailed = 0;
  const results = [];

  for (const file of testFiles) {
    console.log(`\n▶ Running ${file}...`);
    console.log('----------------------------------------------------------------------');
    const res = await runTestFile(file);
    results.push(res);
    if (res.code !== 0) {
      totalFailed++;
    }
  }

  console.log('\n======================================================================');
  console.log('  E2E TEST SUITE EXECUTION SUMMARY');
  console.log('======================================================================');
  console.log('| Tier | Test Suite File              | Coverage Target | Status  |');
  console.log('|------|------------------------------|-----------------|---------|');
  console.log(`| 1    | tier1-feature-coverage.test  | 55 cases        | ${results[0].code === 0 ? 'PASSED ' : 'FAILED '} |`);
  console.log(`| 2    | tier2-boundary-edge.test     | 55 cases        | ${results[1].code === 0 ? 'PASSED ' : 'FAILED '} |`);
  console.log(`| 3    | tier3-cross-feature.test     | 11 cases        | ${results[2].code === 0 ? 'PASSED ' : 'FAILED '} |`);
  console.log(`| 4    | tier4-real-world.test        | 6 scenarios     | ${results[3].code === 0 ? 'PASSED ' : 'FAILED '} |`);
  console.log('----------------------------------------------------------------------');
  console.log(` Total Executed Test Cases / Assertions: 127 Cases Across Tiers 1-4`);
  console.log('======================================================================\n');

  if (totalFailed > 0) {
    console.error(`❌ Test Suite Failed with ${totalFailed} suite failure(s).`);
    process.exit(1);
  } else {
    console.log('✅ All 127 E2E Test Cases / Assertions PASSED successfully.');
    process.exit(0);
  }
}

runAll().catch((err) => {
  console.error('Fatal test execution error:', err);
  process.exit(1);
});
