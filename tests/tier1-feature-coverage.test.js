import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  readProjectFile,
  getAllFiles,
  searchInFiles,
  countOccurrencesInFile,
  PROJECT_ROOT,
} from './helpers/testUtils.js';

test('Tier 1: Feature Coverage (55 Cases Across 11 Features)', async (t) => {
  // ---------------------------------------------------------------------------
  // Feature 1: Supabase Lead Submissions (R1)
  // ---------------------------------------------------------------------------
  await t.test('F1.1: Registration modal submit handler calls Supabase client insert', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const hasSupabaseInsert = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('supabase.from') && content.includes('bookings') && content.includes('insert');
    });
    assert.equal(
      hasSupabaseInsert,
      true,
      'Expected modal/component submit handler to insert records into Supabase bookings table'
    );
  });

  await t.test('F1.2: Registration submission includes student_name, student_phone, student_email, membership_tier', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const payloadHasFields = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return (
        content.includes('student_name') &&
        content.includes('student_phone') &&
        (content.includes('student_email') || content.includes('email')) &&
        (content.includes('membership_tier') || content.includes('tier'))
      );
    });
    assert.equal(payloadHasFields, true, 'Expected submission payload to map student and membership tier fields');
  });

  await t.test('F1.3: Registration submission includes default session_date in YYYY-MM-DD format', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const handlesDate = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('session_date') || content.includes('toISOString') || content.includes('getFullYear');
    });
    assert.equal(handlesDate, true, 'Expected submission payload to include session_date formatting');
  });

  await t.test('F1.4: Registration submission includes default session_time', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const handlesTime = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('session_time') || content.includes('09:00');
    });
    assert.equal(handlesTime, true, 'Expected submission payload to include session_time');
  });

  await t.test('F1.5: Submission sets status to pending and displays application received feedback', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const handlesStatus = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('pending') && (content.includes('submitted') || content.includes('Application Received') || content.includes('on the list'));
    });
    assert.equal(handlesStatus, true, 'Expected submission to set pending status and display confirmation feedback');
  });

  // ---------------------------------------------------------------------------
  // Feature 2: Remove Formspree & Hardcoded Endpoints (R1)
  // ---------------------------------------------------------------------------
  await t.test('F2.1: Zero FORMSPREE_ENDPOINT constant declarations exist in src/', () => {
    const count = countOccurrencesInFile('src/App.jsx', 'FORMSPREE_ENDPOINT');
    const allFormspreeConsts = searchInFiles(path.join(PROJECT_ROOT, 'src'), 'FORMSPREE_ENDPOINT');
    assert.equal(allFormspreeConsts.length, 0, `Expected 0 FORMSPREE_ENDPOINT constants, found in: ${allFormspreeConsts.join(', ')}`);
  });

  await t.test('F2.2: Zero fetch calls to https://formspree.io exist in codebase', () => {
    const matches = searchInFiles(path.join(PROJECT_ROOT, 'src'), 'formspree.io');
    assert.equal(matches.length, 0, `Expected 0 formspree.io endpoints in src/, found: ${matches.join(', ')}`);
  });

  await t.test('F2.3: README.md has no active setup instructions referencing Formspree endpoints', () => {
    const readme = readProjectFile('README.md');
    const mentionsActiveFormspree = readme ? /FORMSPREE_ENDPOINT|formspree\.io\/f\//.test(readme) : false;
    assert.equal(mentionsActiveFormspree, false, 'Expected README.md to be free of Formspree active endpoints');
  });

  await t.test('F2.4: Registration modal submit handler contains no Formspree fallback fetch', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const hasFormspreeFetch = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('fetch') && content.includes('formspree');
    });
    assert.equal(hasFormspreeFetch, false, 'Expected modal submit handler to have no Formspree fetch fallback');
  });

  await t.test('F2.5: Supabase client gracefully handles missing env configuration', () => {
    const clientCode = readProjectFile('src/lib/supabaseClient.js');
    assert.ok(clientCode, 'src/lib/supabaseClient.js must exist');
    const handlesUnconfigured = clientCode.includes('supabaseConfigured') && clientCode.includes('VITE_SUPABASE_URL');
    assert.equal(handlesUnconfigured, true, 'Expected supabaseClient to safely check configuration state');
  });

  // ---------------------------------------------------------------------------
  // Feature 3: Supabase Public Insert RLS Policy (R1)
  // ---------------------------------------------------------------------------
  await t.test('F3.1: supabase/schema.sql contains Public insert access policy', () => {
    const schema = readProjectFile('supabase/schema.sql');
    assert.ok(schema, 'supabase/schema.sql must exist');
    const hasPublicInsert = schema.includes('Public insert access') || schema.includes('for insert');
    assert.equal(hasPublicInsert, true, 'Expected schema.sql to define public insert RLS policy');
  });

  await t.test('F3.2: Row Level Security is enabled on bookings table in schema.sql', () => {
    const schema = readProjectFile('supabase/schema.sql');
    const hasRLSEnabled = schema.includes('alter table bookings enable row level security;');
    assert.equal(hasRLSEnabled, true, 'Expected schema.sql to enable RLS on bookings table');
  });

  await t.test('F3.3: Schema defines bookings table columns matching lead submission fields', () => {
    const schema = readProjectFile('supabase/schema.sql');
    const hasColumns =
      schema.includes('student_name') &&
      schema.includes('student_phone') &&
      schema.includes('student_email') &&
      schema.includes('membership_tier') &&
      schema.includes('session_date') &&
      schema.includes('session_time') &&
      schema.includes('status');
    assert.equal(hasColumns, true, 'Expected schema.sql to define all booking columns');
  });

  await t.test('F3.4: Public insert RLS policy check clause specifies with check (true)', () => {
    const schema = readProjectFile('supabase/schema.sql');
    const hasCheckTrue = /create\s+policy\s+"Public insert access"[\s\S]*?with\s+check\s*\(\s*true\s*\)/i.test(schema);
    assert.equal(hasCheckTrue, true, 'Expected Public insert access policy to specify with check (true)');
  });

  await t.test('F3.5: Admin full access policy coexists in schema.sql for rcsbadminton@gmail.com', () => {
    const schema = readProjectFile('supabase/schema.sql');
    const hasAdminPolicy = schema.includes('Admin full access') && schema.includes('rcsbadminton@gmail.com');
    assert.equal(hasAdminPolicy, true, 'Expected Admin full access policy in schema.sql');
  });

  // ---------------------------------------------------------------------------
  // Feature 4: Cursor Visibility & Interactivity (R2)
  // ---------------------------------------------------------------------------
  await t.test('F4.1: Zero cursor: none !important rules exist in CSS or style blocks', () => {
    const matches = searchInFiles(path.join(PROJECT_ROOT, 'src'), 'cursor:\\s*none');
    assert.equal(matches.length, 0, `Expected 0 cursor: none rules in src/, found in: ${matches.join(', ')}`);
  });

  await t.test('F4.2: Standard page body defaults to native browser cursor', () => {
    const indexCss = readProjectFile('src/index.css') || '';
    const appJsx = readProjectFile('src/App.jsx') || '';
    const forcesGlobalHide = /body\s*:\s*not\([^)]*\)\s*\*?\s*\{\s*cursor\s*:\s*none/i.test(appJsx + indexCss);
    assert.equal(forcesGlobalHide, false, 'Expected no global body rule forcing cursor: none');
  });

  await t.test('F4.3: Interactive controls preserve native hover cursor styles', () => {
    const appJsx = readProjectFile('src/App.jsx') || '';
    const hidesInputCursor = /input,\s*textarea,\s*select\s*\{\s*cursor\s*:\s*none/i.test(appJsx);
    assert.equal(hidesInputCursor, false, 'Expected inputs/selects to not have cursor hidden');
  });

  await t.test('F4.4: ShuttleCursor component is removed or non-blocking (pointer-events: none without cursor: none)', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const hasCursorHidingFollower = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('ShuttleCursor') && content.includes('cursor: none !important');
    });
    assert.equal(hasCursorHidingFollower, false, 'ShuttleCursor must not inject global cursor: none !important');
  });

  await t.test('F4.5: Body class modal-open does not trigger global cursor hiding', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const hidesModalCursor = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('modal-open') && content.includes('cursor: none');
    });
    assert.equal(hidesModalCursor, false, 'modal-open class must not trigger cursor hiding');
  });

  // ---------------------------------------------------------------------------
  // Feature 5: Native Select/Input Controls (R2)
  // ---------------------------------------------------------------------------
  await t.test('F5.1: Registration modal uses standard HTML select with option tags', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const hasNativeSelect = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('<select') && content.includes('<option');
    });
    assert.equal(hasNativeSelect, true, 'Expected registration modal to use standard HTML <select> and <option>');
  });

  await t.test('F5.2: Form fields use native HTML input elements with text, email, tel types', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const hasNativeInputs = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('type="email"') && content.includes('type="tel"');
    });
    assert.equal(hasNativeInputs, true, 'Expected form fields to use native input elements with email and tel types');
  });

  await t.test('F5.3: Form controls have associated label elements with htmlFor or wrapping id', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const hasLabels = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('<label') && (content.includes('htmlFor') || content.includes('for='));
    });
    assert.equal(hasLabels, true, 'Expected form controls to have associated label elements with htmlFor');
  });

  await t.test('F5.4: Input controls preserve visible focus styling on keyboard focus', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const hasFocusStyles = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('focus:outline') || content.includes('focus-visible') || content.includes(':focus');
    });
    assert.equal(hasFocusStyles, true, 'Expected input controls to maintain focus indicator styling');
  });

  await t.test('F5.5: Tier select dropdown includes disabled placeholder option', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const hasDisabledPlaceholder = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('disabled') && (content.includes('Select a tier') || content.includes('Select a standing'));
    });
    assert.equal(hasDisabledPlaceholder, true, 'Expected select dropdown to contain a disabled placeholder option');
  });

  // ---------------------------------------------------------------------------
  // Feature 6: Modal Focus Trapping & ARIA (R2)
  // ---------------------------------------------------------------------------
  await t.test('F6.1: Modal container includes role="dialog"', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const hasRoleDialog = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('role="dialog"');
    });
    assert.equal(hasRoleDialog, true, 'Expected modal container to include role="dialog"');
  });

  await t.test('F6.2: Modal container includes aria-modal="true"', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const hasAriaModal = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('aria-modal="true"');
    });
    assert.equal(hasAriaModal, true, 'Expected modal container to include aria-modal="true"');
  });

  await t.test('F6.3: Modal container includes aria-labelledby referencing modal title ID', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const hasAriaLabelledBy = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('aria-labelledby') && (content.includes('modal-title') || content.includes('title'));
    });
    assert.equal(hasAriaLabelledBy, true, 'Expected modal container to include aria-labelledby matching title id');
  });

  await t.test('F6.4: Modal component implements initial focus management on open', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const managesFocus = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('.focus()') || content.includes('autoFocus') || content.includes('focusRef');
    });
    assert.equal(managesFocus, true, 'Expected modal to manage focus on open');
  });

  await t.test('F6.5: Modal component implements keyboard focus trapping logic', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const trapsFocus = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('Tab') && (content.includes('shiftKey') || content.includes('querySelectorAll'));
    });
    assert.equal(trapsFocus, true, 'Expected modal component to implement focus trapping logic for Tab navigation');
  });

  // ---------------------------------------------------------------------------
  // Feature 7: Modal Escape Key & Focus Restore (R2)
  // ---------------------------------------------------------------------------
  await t.test('F7.1: Pressing Escape key closes the registration modal', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const handlesEscape = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('Escape') && (content.includes('onClose') || content.includes('closeModal') || content.includes('setModalOpen'));
    });
    assert.equal(handlesEscape, true, 'Expected modal keydown listener to handle Escape key');
  });

  await t.test('F7.2: Closing modal restores focus to the trigger element', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const restoresFocus = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('previousFocus') || content.includes('activeElement') || content.includes('triggerRef');
    });
    assert.equal(restoresFocus, true, 'Expected modal to capture and restore previous active element focus');
  });

  await t.test('F7.3: keydown event listener for Escape key is attached and cleaned up', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const managesEventListener = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('addEventListener') && content.includes('removeEventListener') && content.includes('keydown');
    });
    assert.equal(managesEventListener, true, 'Expected Escape keydown event listener to be added and removed correctly');
  });

  await t.test('F7.4: Modal overlay backdrop click closes modal and restores focus', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const handlesBackdropClick = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('onClick={onClose}') || content.includes('onClick={closeModal}');
    });
    assert.equal(handlesBackdropClick, true, 'Expected backdrop click to invoke modal close handler');
  });

  await t.test('F7.5: Close button includes explicit aria-label="Close"', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const hasCloseAriaLabel = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('aria-label="Close"');
    });
    assert.equal(hasCloseAriaLabel, true, 'Expected modal close button to have aria-label="Close"');
  });

  // ---------------------------------------------------------------------------
  // Feature 8: Remove SVG feTurbulence Filter (R3)
  // ---------------------------------------------------------------------------
  await t.test('F8.1: Zero feTurbulence tags exist in JSX or HTML files', () => {
    const matches = searchInFiles(path.join(PROJECT_ROOT, 'src'), 'feTurbulence');
    assert.equal(matches.length, 0, `Expected 0 feTurbulence tags in src/, found in: ${matches.join(', ')}`);
  });

  await t.test('F8.2: Zero filter id="grain" elements exist in codebase', () => {
    const matches = searchInFiles(path.join(PROJECT_ROOT, 'src'), 'id="grain"');
    assert.equal(matches.length, 0, `Expected 0 filter id="grain" in src/, found in: ${matches.join(', ')}`);
  });

  await t.test('F8.3: Zero DOM elements apply filter="url(#grain)"', () => {
    const matches = searchInFiles(path.join(PROJECT_ROOT, 'src'), 'url\\(#grain\\)');
    assert.equal(matches.length, 0, `Expected 0 filter="url(#grain)" references, found in: ${matches.join(', ')}`);
  });

  await t.test('F8.4: Landing page background uses clean performant CSS without SVG filter overhead', () => {
    const appJsx = readProjectFile('src/App.jsx') || '';
    const hasHeavyNoiseFilter = appJsx.includes('<feTurbulence');
    assert.equal(hasHeavyNoiseFilter, false, 'Landing page must not render feTurbulence noise SVG element');
  });

  await t.test('F8.5: Zero fractalNoise type attributes exist in SVG definitions', () => {
    const matches = searchInFiles(path.join(PROJECT_ROOT, 'src'), 'fractalNoise');
    assert.equal(matches.length, 0, `Expected 0 fractalNoise attributes in src/, found in: ${matches.join(', ')}`);
  });

  // ---------------------------------------------------------------------------
  // Feature 9: Static Google Fonts Links (R3)
  // ---------------------------------------------------------------------------
  await t.test('F9.1: index.html contains static preconnect link for fonts.googleapis.com', () => {
    const html = readProjectFile('index.html');
    assert.ok(html, 'index.html must exist');
    const hasPreconnectGoogle = html.includes('rel="preconnect"') && html.includes('fonts.googleapis.com');
    assert.equal(hasPreconnectGoogle, true, 'index.html must statically declare preconnect to fonts.googleapis.com');
  });

  await t.test('F9.2: index.html contains static preconnect link for fonts.gstatic.com with crossorigin', () => {
    const html = readProjectFile('index.html');
    const hasPreconnectGstatic = html.includes('fonts.gstatic.com') && html.includes('crossorigin');
    assert.equal(hasPreconnectGstatic, true, 'index.html must statically declare preconnect to fonts.gstatic.com with crossorigin');
  });

  await t.test('F9.3: index.html contains static stylesheet link for Playfair Display and Inter', () => {
    const html = readProjectFile('index.html');
    const hasStylesheet = html.includes('fonts.googleapis.com/css2') && html.includes('Playfair+Display') && html.includes('Inter');
    assert.equal(hasStylesheet, true, 'index.html must statically link the Google Fonts stylesheet');
  });

  await t.test('F9.4: Dynamic runtime font preconnect useEffect hook removed from App.jsx', () => {
    const appJsx = readProjectFile('src/App.jsx') || '';
    const hasDynamicFontHook = appJsx.includes('fonts.googleapis.com') && appJsx.includes('appendChild');
    assert.equal(hasDynamicFontHook, false, 'Expected dynamic Google Fonts appendChild hook to be removed from App.jsx');
  });

  await t.test('F9.5: index.html places font preconnect links in head before body render', () => {
    const html = readProjectFile('index.html');
    const headIndex = html.indexOf('<head>');
    const fontIndex = html.indexOf('fonts.googleapis.com');
    const bodyIndex = html.indexOf('<body>');
    assert.ok(fontIndex > headIndex && fontIndex < bodyIndex, 'Font preconnect links must be inside <head>');
  });

  // ---------------------------------------------------------------------------
  // Feature 10: Streamline Mouse Handlers (R3)
  // ---------------------------------------------------------------------------
  await t.test('F10.1: Window mousemove handler in ShuttleCursor removed or optimized', () => {
    const appJsx = readProjectFile('src/App.jsx') || '';
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const hasUnoptimizedMousemove = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('addEventListener("mousemove"') && content.includes('ShuttleCursor');
    });
    assert.equal(hasUnoptimizedMousemove, false, 'Unoptimized mousemove in ShuttleCursor must be removed or streamlined');
  });

  await t.test('F10.2: Continuous requestAnimationFrame lerp loop in ShuttleCursor removed or idle-paused', () => {
    const appJsx = readProjectFile('src/App.jsx') || '';
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const hasContinuousRafLoop = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('requestAnimationFrame') && content.includes('ShuttleCursor') && content.includes('pos.current.x +=');
    });
    assert.equal(hasContinuousRafLoop, false, 'Continuous rAF lerp loop in ShuttleCursor must be removed or optimized');
  });

  await t.test('F10.3: High-frequency document mouseout event listener removed or simplified', () => {
    const appJsx = readProjectFile('src/App.jsx') || '';
    const hasUnoptimizedMouseout = appJsx.includes('addEventListener("mouseout"') && appJsx.includes('relatedTarget');
    assert.equal(hasUnoptimizedMouseout, false, 'High-frequency mouseout listener in App.jsx must be streamlined');
  });

  await t.test('F10.4: Nav scroll listener uses passive event listener option', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const usesPassiveScroll = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('addEventListener("scroll"') && content.includes('passive: true');
    });
    assert.equal(usesPassiveScroll, true, 'Expected scroll event listener to use passive: true');
  });

  await t.test('F10.5: Window scroll and mouse event listeners cleaned up on unmount', () => {
    const srcFiles = getAllFiles(path.join(PROJECT_ROOT, 'src'), ['.jsx', '.js']);
    const cleansUpScroll = srcFiles.some((f) => {
      const content = fs.readFileSync(f, 'utf8');
      return content.includes('removeEventListener("scroll"');
    });
    assert.equal(cleansUpScroll, true, 'Expected scroll event listener to be cleaned up on unmount');
  });

  // ---------------------------------------------------------------------------
  // Feature 11: Modular Structure & Clean Build (R4)
  // ---------------------------------------------------------------------------
  await t.test('F11.1: Landing page components extracted under src/components/ directory', () => {
    const componentsDir = path.join(PROJECT_ROOT, 'src', 'components');
    const exists = fs.existsSync(componentsDir);
    assert.equal(exists, true, 'src/components/ directory must exist for modularized components');
  });

  await t.test('F11.2: Admin components extracted under src/components/admin/', () => {
    const adminDir = path.join(PROJECT_ROOT, 'src', 'components', 'admin');
    const exists = fs.existsSync(adminDir);
    assert.equal(exists, true, 'src/components/admin/ directory must exist for modular admin components');
  });

  await t.test('F11.3: Centralized design tokens defined in src/constants/designTokens.js', () => {
    const tokensFile = path.join(PROJECT_ROOT, 'src', 'constants', 'designTokens.js');
    const exists = fs.existsSync(tokensFile);
    assert.equal(exists, true, 'src/constants/designTokens.js must exist for centralized design tokens');
    if (exists) {
      const content = fs.readFileSync(tokensFile, 'utf8');
      assert.ok(content.includes('COLORS') || content.includes('INK'), 'designTokens.js must define color constants');
    }
  });

  await t.test('F11.4: Static landing data extracted in src/data/landingData.js', () => {
    const dataFile = path.join(PROJECT_ROOT, 'src', 'data', 'landingData.js');
    const exists = fs.existsSync(dataFile);
    assert.equal(exists, true, 'src/data/landingData.js must exist for static landing page data');
  });

  await t.test('F11.5: Production build (npm run build) executes cleanly and generates dist/', () => {
    const distExists = fs.existsSync(path.join(PROJECT_ROOT, 'dist'));
    assert.equal(distExists, true, 'dist/ output folder should exist after clean production build');
  });
});
