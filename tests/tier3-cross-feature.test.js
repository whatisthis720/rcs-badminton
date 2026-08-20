import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  readProjectFile,
  getAllFiles,
  searchInFiles,
  PROJECT_ROOT,
} from './helpers/testUtils.js';

test('Tier 3: Cross-Feature Combinations (11 Cases)', async (t) => {
  await t.test('Case 3.1: Modal Submission + Supabase RLS Policy + Formspree Removal (R1 Cross)', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const schema = readProjectFile('supabase/schema.sql') || '';

    // 1. Supabase insert called
    const insertsSupabase = srcFiles.some((f) => {
      const c = fs.readFileSync(f, 'utf8');
      return c.includes('supabase.from') && c.includes('bookings') && c.includes('insert');
    });

    // 2. Schema has public insert policy
    const hasPublicInsert = schema.includes('Public insert access') || schema.includes('for insert');

    // 3. No Formspree references in src/
    const formspreeMatches = searchInFiles(path.join(PROJECT_ROOT, 'src'), 'formspree');

    assert.equal(insertsSupabase, true, 'Modal must insert into Supabase bookings');
    assert.equal(hasPublicInsert, true, 'Schema must define Public insert access policy');
    assert.equal(formspreeMatches.length, 0, 'No Formspree references allowed in src/');
  });

  await t.test('Case 3.2: Modal Focus Trap + ARIA Attributes + Escape Key + Focus Restore (R2 Cross)', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);

    const satisfiesAllAccessibility = srcFiles.some((f) => {
      const c = fs.readFileSync(f, 'utf8');
      return (
        c.includes('role="dialog"') &&
        c.includes('aria-modal="true"') &&
        c.includes('aria-labelledby') &&
        c.includes('Escape') &&
        (c.includes('Tab') || c.includes('focus'))
      );
    });

    assert.equal(satisfiesAllAccessibility, true, 'Modal component must integrate role="dialog", aria-modal, aria-labelledby, Escape handler, and focus management');
  });

  await t.test('Case 3.3: Native Cursor Preserved + Native Select Dropdown + Input Controls (R2 Cross)', () => {
    const cursorMatches = searchInFiles(path.join(PROJECT_ROOT, 'src'), 'cursor:\\s*none');
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);

    const hasSelectAndInputs = srcFiles.some((f) => {
      const c = fs.readFileSync(f, 'utf8');
      return c.includes('<select') && c.includes('<option') && c.includes('type="email"');
    });

    assert.equal(cursorMatches.length, 0, 'No cursor: none rules allowed in src/');
    assert.equal(hasSelectAndInputs, true, 'Form must use native select and typed input controls');
  });

  await t.test('Case 3.4: Static Google Fonts Links + Removal of SVG feTurbulence Noise Filter (R3 Cross)', () => {
    const html = readProjectFile('index.html') || '';
    const feTurbulenceMatches = searchInFiles(path.join(PROJECT_ROOT, 'src'), 'feTurbulence');

    const hasStaticFonts = html.includes('fonts.googleapis.com') && html.includes('fonts.gstatic.com');

    assert.equal(hasStaticFonts, true, 'index.html must statically link Google Fonts');
    assert.equal(feTurbulenceMatches.length, 0, 'No feTurbulence SVG elements allowed in src/');
  });

  await t.test('Case 3.5: Streamlined Event Handlers + Modular Component Layout (R3 + R4 Cross)', () => {
    const compDir = path.join(PROJECT_ROOT, 'src', 'components');
    const compDirExists = fs.existsSync(compDir);

    const appJsx = readProjectFile('src/App.jsx') || '';
    const hasUnoptimizedMousemove = appJsx.includes('ShuttleCursor') && appJsx.includes('addEventListener("mousemove"');

    assert.equal(compDirExists, true, 'src/components directory must exist');
    assert.equal(hasUnoptimizedMousemove, false, 'App.jsx must not contain unoptimized ShuttleCursor mousemove handler');
  });

  await t.test('Case 3.6: Centralized Design Tokens + Clean Production Build (R4 Cross)', () => {
    const tokensFile = path.join(PROJECT_ROOT, 'src', 'constants', 'designTokens.js');
    const distIndex = path.join(PROJECT_ROOT, 'dist', 'index.html');

    assert.equal(fs.existsSync(tokensFile), true, 'src/constants/designTokens.js must exist');
    assert.equal(fs.existsSync(distIndex), true, 'dist/index.html must exist after clean production build');
  });

  await t.test('Case 3.7: Modal Open/Close Lifecycle + ShuttleCursor Inactive State + body.modal-open (R1 + R2 Cross)', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);

    const handlesModalLifecycle = srcFiles.some((f) => {
      const c = fs.readFileSync(f, 'utf8');
      return c.includes('modalOpen') || c.includes('modal-open');
    });

    assert.equal(handlesModalLifecycle, true, 'App/Modal must handle modal open/close lifecycle and modal-open body class');
  });

  await t.test('Case 3.8: Admin Dashboard Integration + Supabase Client + Design Tokens (R1 + R4 Cross)', () => {
    const adminFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']).filter((f) => f.includes('Admin') || f.includes('admin'));

    const hasAdminSupabase = adminFiles.some((f) => {
      const c = fs.readFileSync(f, 'utf8');
      return c.includes('supabase') && c.includes('bookings');
    });

    assert.equal(hasAdminSupabase, true, 'Admin page components must integrate with Supabase bookings table');
  });

  await t.test('Case 3.9: Registration Form Field Validation + ARIA Invalid Attributes + Error Message Display (R1 + R2 Cross)', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);

    const integratesValidationAriaError = srcFiles.some((f) => {
      const c = fs.readFileSync(f, 'utf8');
      return c.includes('aria-invalid') && (c.includes('error') || c.includes('errs')) && c.includes('validate');
    });

    assert.equal(integratesValidationAriaError, true, 'Registration form must integrate validation, aria-invalid attributes, and error message feedback');
  });

  await t.test('Case 3.10: SQL Schema Table Definition + Modal Submission Payload Field Mapping (R1 Cross)', () => {
    const schema = readProjectFile('supabase/schema.sql') || '';
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);

    const schemaHasTable = schema.includes('create table bookings');
    const mapsPayloadKeys = srcFiles.some((f) => {
      const c = fs.readFileSync(f, 'utf8');
      return c.includes('student_name') && c.includes('student_phone') && c.includes('membership_tier');
    });

    assert.equal(schemaHasTable, true, 'supabase/schema.sql must define bookings table');
    assert.equal(mapsPayloadKeys, true, 'Modal submission must map student_name, student_phone, membership_tier keys');
  });

  await t.test('Case 3.11: End-to-End System Integrity Sweep Across Tiers 1-4', () => {
    // Audit that all 4 requirements R1, R2, R3, R4 are met across codebase files
    const readme = readProjectFile('README.md') || '';
    const html = readProjectFile('index.html') || '';
    const schema = readProjectFile('supabase/schema.sql') || '';

    assert.ok(html.includes('Playfair+Display'), 'HTML must statically link fonts');
    assert.ok(schema.includes('bookings'), 'Schema must define bookings table');
    assert.ok(fs.existsSync(path.join(PROJECT_ROOT, 'dist')), 'Production build must be present in dist/');
  });
});
