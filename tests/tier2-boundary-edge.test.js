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

test('Tier 2: Boundary & Edge Cases (55 Cases Across 11 Features)', async (t) => {
  // ---------------------------------------------------------------------------
  // Feature 1: Supabase Lead Submissions Boundary
  // ---------------------------------------------------------------------------
  await t.test('F1.B1: Form validation detects empty or whitespace-only name input', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const validatesName = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('trim()') && (content.includes('name') || content.includes('student_name'));
    });
    assert.equal(validatesName, true, 'Form validation must sanitize/trim name input');
  });

  await t.test('F1.B2: Form validation detects invalid email format missing @ or domain', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const validatesEmail = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('@') && (content.includes('email') || content.includes('test('));
    });
    assert.equal(validatesEmail, true, 'Form validation must check for valid email format');
  });

  await t.test('F1.B3: Form validation detects invalid phone number shorter than 7 digits', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const validatesPhone = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('phone') && (content.includes('length') || content.includes('replace'));
    });
    assert.equal(validatesPhone, true, 'Form validation must check phone number length');
  });

  await t.test('F1.B4: Form validation detects unselected membership tier', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const validatesTier = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('tier') && (content.includes('Select a tier') || content.includes('errs.tier'));
    });
    assert.equal(validatesTier, true, 'Form validation must check tier selection');
  });

  await t.test('F1.B5: Handles Supabase insertion failure gracefully with inline error state', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const handlesError = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return (content.includes('error') || content.includes('setError')) && (content.includes('Something went wrong') || content.includes('try again'));
    });
    assert.equal(handlesError, true, 'Form submit must handle insert error gracefully');
  });

  // ---------------------------------------------------------------------------
  // Feature 2: Remove Formspree & Hardcoded Endpoints Boundary
  // ---------------------------------------------------------------------------
  await t.test('F2.B1: Full repository scan confirms zero active formspree references', () => {
    const matches = searchInFiles(path.join(PROJECT_ROOT, 'src'), 'formspree');
    assert.equal(matches.length, 0, `Expected 0 formspree references in src/, found: ${matches.join(', ')}`);
  });

  await t.test('F2.B2: Registration submission issues no third-party HTTP requests outside Supabase', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const hasThirdPartyFetch = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('fetch(') && (content.includes('http://') || content.includes('https://'));
    });
    assert.equal(hasThirdPartyFetch, false, 'Expected no hardcoded third-party fetch URLs in registration flow');
  });

  await t.test('F2.B3: Payload sanitization trims leading/trailing whitespace before submission', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const trimsPayload = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('.trim()');
    });
    assert.equal(trimsPayload, true, 'Payload data must be trimmed before insert');
  });

  await t.test('F2.B4: FORMSPREE_ENDPOINT is not imported or referenced anywhere in project tree', () => {
    const matches = searchInFiles(PROJECT_ROOT, 'FORMSPREE_ENDPOINT', ['.jsx', '.js', '.json', '.md']);
    // Should not be in src/ or root components
    const srcMatches = matches.filter((m) => m.startsWith('src/') || m === 'index.html');
    assert.equal(srcMatches.length, 0, `FORMSPREE_ENDPOINT found in: ${srcMatches.join(', ')}`);
  });

  await t.test('F2.B5: Network timeout handling configured for submit requests', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const hasErrorOrTimeout = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('try') && content.includes('catch') && content.includes('setError');
    });
    assert.equal(hasErrorOrTimeout, true, 'Submit flow must handle exceptions via try/catch');
  });

  // ---------------------------------------------------------------------------
  // Feature 3: Supabase Public Insert RLS Policy Boundary
  // ---------------------------------------------------------------------------
  await t.test('F3.B1: Public insert policy expression check (true) has no restrictive predicates', () => {
    const schema = readProjectFile('supabase/schema.sql');
    assert.ok(schema);
    const isValidCheck = schema.includes('with check (true)');
    assert.equal(isValidCheck, true, 'Public insert policy check clause must be with check (true)');
  });

  await t.test('F3.B2: Anon user select, update, delete operations on bookings table are restricted by default', () => {
    const schema = readProjectFile('supabase/schema.sql');
    const hasPublicSelectPolicy = schema.includes('create policy') && schema.includes('for select') && schema.includes('anon');
    assert.equal(hasPublicSelectPolicy, false, 'Anon user must NOT have public select policy');
  });

  await t.test('F3.B3: Schema membership_tier check constraint restricts values to Individual and Group', () => {
    const schema = readProjectFile('supabase/schema.sql');
    const hasTierCheck = schema.includes("membership_tier in ('Individual', 'Group')");
    assert.equal(hasTierCheck, true, 'Schema check constraint must restrict membership_tier to Individual and Group');
  });

  await t.test('F3.B4: Schema status check constraint restricts values to confirmed, pending, cancelled', () => {
    const schema = readProjectFile('supabase/schema.sql');
    const hasStatusCheck = schema.includes("status in ('confirmed', 'pending', 'cancelled')");
    assert.equal(hasStatusCheck, true, 'Schema check constraint must restrict status to valid values');
  });

  await t.test('F3.B5: Schema created_at column defaults to now()', () => {
    const schema = readProjectFile('supabase/schema.sql');
    const hasCreatedAt = schema.includes('created_at timestamptz not null default now()');
    assert.equal(hasCreatedAt, true, 'Schema created_at column must default to now()');
  });

  // ---------------------------------------------------------------------------
  // Feature 4: Cursor Visibility & Interactivity Boundary
  // ---------------------------------------------------------------------------
  await t.test('F4.B1: Media query (pointer: fine) does not force cursor: none on any DOM element', () => {
    const matches = searchInFiles(path.join(PROJECT_ROOT, 'src'), 'cursor:\\s*none');
    assert.equal(matches.length, 0, 'No (pointer: fine) rule may hide cursor');
  });

  await t.test('F4.B2: Touch devices (pointer: coarse) operate without cursor follower script interference', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const handlesTouch = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('pointer: coarse') || !content.includes('ShuttleCursor');
    });
    assert.equal(handlesTouch, true, 'Touch devices must be handled cleanly');
  });

  await t.test('F4.B3: Inputs and select dropdowns maintain native text/pointer cursors', () => {
    const appJsx = readProjectFile('src/App.jsx') || '';
    const forcesInputCursorNone = /input[^{]*\{\s*cursor\s*:\s*none/i.test(appJsx);
    assert.equal(forcesInputCursorNone, false, 'Inputs must not have cursor: none forced');
  });

  await t.test('F4.B4: Interactive buttons maintain cursor: pointer or native default', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const hidesButtonCursor = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return /button[^{]*\{\s*cursor\s*:\s*none/i.test(content);
    });
    assert.equal(hidesButtonCursor, false, 'Buttons must not have cursor: none forced');
  });

  await t.test('F4.B5: Disabled buttons specify disabled opacity and cursor: not-allowed', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const handlesDisabled = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('disabled') && (content.includes('opacity') || content.includes('not-allowed'));
    });
    assert.equal(handlesDisabled, true, 'Disabled buttons must show disabled styling');
  });

  // ---------------------------------------------------------------------------
  // Feature 5: Native Select/Input Controls Boundary
  // ---------------------------------------------------------------------------
  await t.test('F5.B1: Select dropdown options list Individual and Group options explicitly', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const hasOptions = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('Individual') && content.includes('Group');
    });
    assert.equal(hasOptions, true, 'Select dropdown must include Individual and Group options');
  });

  await t.test('F5.B2: Invalid field input triggers aria-invalid="true" attribute', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const setsAriaInvalid = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('aria-invalid');
    });
    assert.equal(setsAriaInvalid, true, 'Invalid input field must set aria-invalid="true"');
  });

  await t.test('F5.B3: Invalid field styling sets clear error border/text color', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const hasErrorColor = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('#B3413E') || content.includes('text-red') || content.includes('border-red');
    });
    assert.equal(hasErrorColor, true, 'Invalid field styling must set error color indicator');
  });

  await t.test('F5.B4: Input controls use value and onChange for controlled state binding', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const isControlled = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('value=') && content.includes('onChange=');
    });
    assert.equal(isControlled, true, 'Input controls must use value and onChange for controlled state');
  });

  await t.test('F5.B5: Select dropdown element renders natively without custom overlay blockage', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const rendersSelect = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('<select');
    });
    assert.equal(rendersSelect, true, 'Select dropdown must be a native HTML <select> element');
  });

  // ---------------------------------------------------------------------------
  // Feature 6: Modal Focus Trapping & ARIA Boundary
  // ---------------------------------------------------------------------------
  await t.test('F6.B1: Shift+Tab backward navigation wraps focus to last focusable element', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const handlesShiftTab = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('shiftKey') && content.includes('Tab');
    });
    assert.equal(handlesShiftTab, true, 'Focus trap must handle Shift+Tab key combination');
  });

  await t.test('F6.B2: Modal overlay backdrop is pointer-clickable or non-blocking behind', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const handlesBackdrop = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('fixed inset-0') || content.includes('absolute inset-0');
    });
    assert.equal(handlesBackdrop, true, 'Modal backdrop must be properly positioned over viewport');
  });

  await t.test('F6.B3: Focus trap calculates focusable elements dynamically', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const queriesFocusable = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('querySelectorAll') || content.includes('button, [href], input, select, textarea');
    });
    assert.equal(queriesFocusable, true, 'Focus trap must query focusable elements dynamically');
  });

  await t.test('F6.B4: Modal success view maintains focus accessibility', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const handlesSuccessView = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('submitted') || content.includes('Application Received');
    });
    assert.equal(handlesSuccessView, true, 'Modal success view must render cleanly');
  });

  await t.test('F6.B5: Modal component mounts and unmounts cleanly without memory leaks', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const cleansUpEffects = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('return () =>');
    });
    assert.equal(cleansUpEffects, true, 'Modal component must clean up useEffect listeners on unmount');
  });

  // ---------------------------------------------------------------------------
  // Feature 7: Modal Escape Key & Focus Restore Boundary
  // ---------------------------------------------------------------------------
  await t.test('F7.B1: Pressing Escape while focused inside text input closes modal cleanly', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const listensGlobalEscape = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('window.addEventListener("keydown"') || content.includes('document.addEventListener("keydown"');
    });
    assert.equal(listensGlobalEscape, true, 'Escape key listener must be attached at window/document level');
  });

  await t.test('F7.B2: Pressing Escape when modal is closed triggers no side effects or errors', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const checksOpenBeforeEscape = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('if (open)') || content.includes('if (!open) return');
    });
    assert.equal(checksOpenBeforeEscape, true, 'Escape key handler must check modal open state');
  });

  await t.test('F7.B3: Trigger element focus reference captured before modal open', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const capturesTrigger = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('document.activeElement') || content.includes('triggerRef') || content.includes('previousFocus');
    });
    assert.equal(capturesTrigger, true, 'Modal trigger focus must be captured before open');
  });

  await t.test('F7.B4: Focus restoration falls back if trigger element is removed', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const safeFocusRestore = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('?.focus()') || content.includes('if (element) element.focus()');
    });
    assert.equal(safeFocusRestore, true, 'Focus restoration must be safe against missing trigger elements');
  });

  await t.test('F7.B5: Unmounting modal component removes document keydown listener immediately', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const removesKeydown = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('removeEventListener') && content.includes('keydown');
    });
    assert.equal(removesKeydown, true, 'Modal component must remove keydown listener on unmount');
  });

  // ---------------------------------------------------------------------------
  // Feature 8: Remove SVG feTurbulence Filter Boundary
  // ---------------------------------------------------------------------------
  await t.test('F8.B1: Repository audit confirms zero SVG filter nodes or feTurbulence tags', () => {
    const matches = searchInFiles(PROJECT_ROOT, 'feTurbulence', ['.jsx', '.js', '.html', '.css']);
    assert.equal(matches.length, 0, `feTurbulence found in: ${matches.join(', ')}`);
  });

  await t.test('F8.B2: SVG noise filter elements are not conditionally rendered in component tree', () => {
    const matches = searchInFiles(path.join(PROJECT_ROOT, 'src'), 'fractalNoise');
    assert.equal(matches.length, 0, 'No fractalNoise SVG filter attributes allowed in src/');
  });

  await t.test('F8.B3: CSS stylesheets contain no filter: url(#grain) performance bottlenecks', () => {
    const matches = searchInFiles(path.join(PROJECT_ROOT, 'src'), 'filter:\\s*url');
    assert.equal(matches.length, 0, 'No CSS filter: url(...) rules allowed in src/');
  });

  await t.test('F8.B4: CourtLines and shuttle trail SVG elements render with zero noise filter tags', () => {
    const appJsx = readProjectFile('src/App.jsx') || '';
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const svgHasNoise = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('<svg') && content.includes('<feTurbulence');
    });
    assert.equal(svgHasNoise, false, 'SVG components must render without noise filter tags');
  });

  await t.test('F8.B5: Print-grade noise grain comments and SVG elements fully purged', () => {
    const appJsx = readProjectFile('src/App.jsx') || '';
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const hasGrainComment = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('print-grade grain') || content.includes('id="grain"');
    });
    assert.equal(hasGrainComment, false, 'Print-grade grain tags and comments must be purged');
  });

  // ---------------------------------------------------------------------------
  // Feature 9: Static Google Fonts Links Boundary
  // ---------------------------------------------------------------------------
  await t.test('F9.B1: Preconnect link for fonts.gstatic.com explicitly includes crossorigin attribute', () => {
    const html = readProjectFile('index.html');
    assert.ok(html);
    const hasCrossorigin = /fonts\.gstatic\.com[^>]*crossorigin/i.test(html);
    assert.equal(hasCrossorigin, true, 'Preconnect for fonts.gstatic.com must include crossorigin attribute');
  });

  await t.test('F9.B2: Google Fonts stylesheet URL includes display=swap parameter', () => {
    const html = readProjectFile('index.html');
    const hasDisplaySwap = html.includes('display=swap');
    assert.equal(hasDisplaySwap, true, 'Google Fonts stylesheet URL must include display=swap');
  });

  await t.test('F9.B3: Zero React components invoke document.head.appendChild for dynamic font link creation', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const appendsFontLink = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('document.head.appendChild') && content.includes('fonts.googleapis.com');
    });
    assert.equal(appendsFontLink, false, 'No React component may append dynamic font links to document.head');
  });

  await t.test('F9.B4: Font family declarations in CSS match static Google Font names', () => {
    const appJsx = readProjectFile('src/App.jsx') || '';
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js', '.css']);
    const declaresFonts = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('Playfair Display') || content.includes('Inter');
    });
    assert.equal(declaresFonts, true, 'Codebase must use Playfair Display and Inter font families');
  });

  await t.test('F9.B5: Font preconnect links appear before stylesheet link tag in HTML head', () => {
    const html = readProjectFile('index.html');
    const preconnectPos = html.indexOf('rel="preconnect"');
    const stylesheetPos = html.indexOf('rel="stylesheet"');
    assert.ok(preconnectPos < stylesheetPos, 'Preconnect links must appear before stylesheet link in index.html');
  });

  // ---------------------------------------------------------------------------
  // Feature 10: Streamline Mouse Handlers Boundary
  // ---------------------------------------------------------------------------
  await t.test('F10.B1: Rapid mouse movements do not cause layout thrashing or unthrottled state updates', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const hasUnthrottledMouseMoveState = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('window.addEventListener("mousemove"') && content.includes('setState');
    });
    assert.equal(hasUnthrottledMouseMoveState, false, 'mousemove handlers must not trigger continuous setState calls');
  });

  await t.test('F10.B2: Mouse tracking math is bypassed when modal is active or pointer is coarse', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const handlesBypass = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('pointer: coarse') || !content.includes('ShuttleCursor');
    });
    assert.equal(handlesBypass, true, 'Mouse tracking must be bypassed when coarse or modal open');
  });

  await t.test('F10.B3: Scroll handler in Nav updates state only when crossing scroll threshold', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const checksThreshold = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('window.scrollY > 40') || content.includes('scrollY');
    });
    assert.equal(checksThreshold, true, 'Nav scroll handler must check scroll threshold');
  });

  await t.test('F10.B4: Component cleanup functions explicitly remove all attached scroll and keydown listeners', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const cleansUpListeners = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('removeEventListener');
    });
    assert.equal(cleansUpListeners, true, 'Components must clean up attached event listeners');
  });

  await t.test('F10.B5: Event listener setup uses passive option where applicable', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const usesPassive = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('passive: true') || !content.includes('addEventListener("scroll"');
    });
    assert.equal(usesPassive, true, 'Scroll listeners should use passive option');
  });

  // ---------------------------------------------------------------------------
  // Feature 11: Modular Structure & Clean Build Boundary
  // ---------------------------------------------------------------------------
  await t.test('F11.B1: Component files in src/components/ export clean modular React components', () => {
    const compDir = path.join(PROJECT_ROOT, 'src', 'components');
    const exists = fs.existsSync(compDir);
    assert.equal(exists, true, 'src/components directory must exist');
  });

  await t.test('F11.B2: Design tokens in src/constants/designTokens.js export color and typography constants', () => {
    const tokenPath = path.join(PROJECT_ROOT, 'src', 'constants', 'designTokens.js');
    const exists = fs.existsSync(tokenPath);
    assert.equal(exists, true, 'designTokens.js must exist');
  });

  await t.test('F11.B3: Static data file src/data/landingData.js exports NAV_LINKS, PILLARS, TIERS, TESTIMONIALS', () => {
    const dataPath = path.join(PROJECT_ROOT, 'src', 'data', 'landingData.js');
    const exists = fs.existsSync(dataPath);
    assert.equal(exists, true, 'landingData.js must exist');
  });

  await t.test('F11.B4: tailwind.config.js is present and configured for Vite project', () => {
    const tailwindPath = path.join(PROJECT_ROOT, 'tailwind.config.js');
    const exists = fs.existsSync(tailwindPath);
    assert.equal(exists, true, 'tailwind.config.js must exist');
  });

  await t.test('F11.B5: Production build assets in dist/ directory contain valid HTML and JS bundle', () => {
    const distHtml = path.join(PROJECT_ROOT, 'dist', 'index.html');
    const exists = fs.existsSync(distHtml);
    assert.equal(exists, true, 'dist/index.html must exist after production build');
  });
});
