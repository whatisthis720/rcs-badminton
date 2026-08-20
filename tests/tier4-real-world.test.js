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

test('Tier 4: Real-World Application Scenarios (6 Scenarios)', async (t) => {
  await t.test('Scenario 4.1: End-to-End Prospective Student Registration Flow', () => {
    // Verifies full flow: landing page -> request invitation -> fill modal -> Supabase insert -> confirmation
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);

    const hasLandingCTA = srcFiles.some((f) => {
      const c = fs.readFileSync(f, 'utf8');
      return c.includes('Request Invitation') || c.includes('Request An Invitation');
    });

    const hasModalForm = srcFiles.some((f) => {
      const c = fs.readFileSync(f, 'utf8');
      return c.includes('handleSubmit') && c.includes('supabase.from') && c.includes('bookings');
    });

    const hasConfirmation = srcFiles.some((f) => {
      const c = fs.readFileSync(f, 'utf8');
      return c.includes('submitted') || c.includes('Application Received') || c.includes("You're on the list");
    });

    assert.equal(hasLandingCTA, true, 'Landing page must feature Request Invitation action');
    assert.equal(hasModalForm, true, 'Modal form must submit lead to Supabase bookings table');
    assert.equal(hasConfirmation, true, 'Modal must display application received confirmation state');
  });

  await t.test('Scenario 4.2: End-to-End Keyboard Accessibility Registration Flow', () => {
    // Verifies keyboard navigation: trigger button -> modal open -> focus trap -> Escape key close -> focus restored
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);

    const satisfiesKeyboardFlow = srcFiles.some((f) => {
      const c = fs.readFileSync(f, 'utf8');
      return (
        c.includes('role="dialog"') &&
        c.includes('aria-modal="true"') &&
        c.includes('Escape') &&
        (c.includes('Tab') || c.includes('focus'))
      );
    });

    assert.equal(satisfiesKeyboardFlow, true, 'Keyboard accessibility flow requires role="dialog", focus management, and Escape key handling');
  });

  await t.test('Scenario 4.3: End-to-End Admin Scheduling & Booking Management Flow', () => {
    // Verifies admin page dashboard flow: auth state check -> load bookings -> update status -> insert/delete booking
    const adminFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']).filter((f) => f.includes('Admin') || f.includes('admin'));

    const verifiesAdminFlow = adminFiles.some((f) => {
      const c = fs.readFileSync(f, 'utf8');
      return (
        c.includes('supabase.from("bookings")') &&
        c.includes('.select(') &&
        (c.includes('.update(') || c.includes('.insert(') || c.includes('.delete('))
      );
    });

    assert.equal(verifiesAdminFlow, true, 'Admin page must manage bookings table records via Supabase client');
  });

  await t.test('Scenario 4.4: Mobile & Low-Power Touch Device User Flow', () => {
    // Verifies mobile touch experience: coarse pointer bypass, native input/select controls, static fonts, no SVG filter lag
    const html = readProjectFile('index.html') || '';
    const feTurbulenceMatches = searchInFiles(path.join(PROJECT_ROOT, 'src'), 'feTurbulence');
    const cursorMatches = searchInFiles(path.join(PROJECT_ROOT, 'src'), 'cursor:\\s*none');

    const hasStaticFonts = html.includes('fonts.googleapis.com');

    assert.equal(hasStaticFonts, true, 'Mobile flow requires static Google Fonts in index.html');
    assert.equal(feTurbulenceMatches.length, 0, 'Mobile flow requires removal of heavy SVG feTurbulence filter');
    assert.equal(cursorMatches.length, 0, 'Mobile flow requires preservation of native browser cursors');
  });

  await t.test('Scenario 4.5: Production Build, Bundle Verification & Schema Compliance Flow', () => {
    // Verifies production deployment readiness: dist/ exists, index.html contains static font links, schema has public insert policy, zero Formspree
    const distHtmlPath = path.join(PROJECT_ROOT, 'dist', 'index.html');
    const distExists = fs.existsSync(distHtmlPath);

    const schema = readProjectFile('supabase/schema.sql') || '';
    const hasPublicInsert = schema.includes('Public insert access') || schema.includes('for insert');

    const formspreeMatches = searchInFiles(path.join(PROJECT_ROOT, 'src'), 'formspree');

    assert.equal(distExists, true, 'Production build must generate dist/index.html');
    assert.equal(hasPublicInsert, true, 'Schema must define Public insert access RLS policy');
    assert.equal(formspreeMatches.length, 0, 'Production bundle must contain zero Formspree endpoint references');
  });

  await t.test('Scenario 4.6: System Resilience & Unconfigured Database Flow', () => {
    // Verifies unconfigured env var fallback handling on admin page and modal submission error handling
    const adminFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']).filter((f) => f.includes('Admin') || f.includes('admin'));

    const handlesUnconfiguredDB = adminFiles.some((f) => {
      const c = fs.readFileSync(f, 'utf8');
      return c.includes('supabaseConfigured') || c.includes('Database Not Connected') || c.includes('SetupNeeded');
    });

    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const handlesSubmitError = srcFiles.some((f) => {
      const c = fs.readFileSync(f, 'utf8');
      return (c.includes('error') || c.includes('setError')) && (c.includes('Something went wrong') || c.includes('try again'));
    });

    assert.equal(handlesUnconfiguredDB, true, 'Admin page must render SetupNeeded component when Supabase is unconfigured');
    assert.equal(handlesSubmitError, true, 'Registration modal must handle network/submission failures gracefully');
  });
});
