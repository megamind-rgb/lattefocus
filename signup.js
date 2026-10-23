// The launch list: the sign-up form on index.html (form[data-signup]).
// This is the one place with the form's settings: fill in SIGNUP below.
//
// Each sign-up goes straight from the visitor's browser to a Google Form
// (Google Sheets keeps the answers), as one POST, without cookies. The `app`
// field says which site the sign-up came from.
// privacy.html#launch-list says what is stored and why; keep the two in step.
//
// To fill in SIGNUP (README.md, "The launch list"):
//   action          the form's address, ending in /formResponse instead of /viewform
//   fields.email    the entry.<number> of the question "Email"
//   fields.app      the entry.<number> of the question "App"
//   fields.consent  the entry.<number> of the question "Consent"
// While any of them is still a placeholder (FORM_ID, entry.EMAIL, ...), the form
// says the list isn't open yet and sends nothing.
//
// consentVersion: change it (and privacy.html's Changes) whenever the consent
// sentence on index.html changes. What's sent is the sentence the visitor saw,
// plus " (v<consentVersion>)".
const SIGNUP = {
  action: 'https://docs.google.com/forms/d/e/1FAIpQLSfWOHGM95NK3SGGOb0Od_glWgn_wQjyVRoC81pYh3K2kAuKfw/formResponse',
  fields: { email: 'entry.2101905724', app: 'entry.1520007500', consent: 'entry.1642047029' },
  app: 'lattefocus',
  consentVersion: '2026-10-23'
};

(() => {
  'use strict';
  const MESSAGES = {
    closed: 'The launch list isn’t open yet. Please check back soon.',
    email: 'Enter your email address, like you@gmail.com.',
    consent: 'Tick the box so we may email you about the launch.',
    sending: 'Sending…',
    done: 'You’re on the list. We’ll email you in November with your 80% off.',
    failed: 'That didn’t go through. Check your connection and try again.'
  };
  const TIMEOUT = 20000;  // ms: a send that hangs this long counts as failed

  // Ready when every setting is filled in: a real formResponse address (or, for
  // testing, one on this Mac) and entry.<number> fields.
  function ready(config) {
    if (!config || typeof config.action !== 'string' || /FORM_ID/.test(config.action)) return false;
    let url;
    try { url = new URL(config.action); } catch (error) { return false; }
    const local = url.protocol === 'http:' && ['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname);
    if (url.protocol !== 'https:' && !local) return false;
    const fields = config.fields || {};
    return ['email', 'app', 'consent'].every(key => /^entry\.\d+$/.test(fields[key] || '')) &&
      typeof config.app === 'string' && config.app !== '' &&
      /^\d{4}-\d{2}-\d{2}$/.test(config.consentVersion || '');
  }

  // The browser's own check (type=email), plus a dot in the domain: "you@gmail" is a typo.
  const looksLikeEmail = input => input.value !== '' && input.value.length <= 254 &&
    input.checkValidity() && /^[^\s@]+@[^\s@]+\.[^\s@.]{2,}$/.test(input.value);

  // The GoatCounter event, when the counter is on the page and counting
  // (analytics.js): one "signup", never the address.
  function countSignup() {
    const counter = window.goatcounter;
    if (!counter || typeof counter.count !== 'function') return;
    try { counter.count({ path: 'signup', title: 'Launch list signup', referrer: '', event: true }); } catch (error) {}
  }

  function setUp(form) {
    const fieldset = form.querySelector('fieldset');
    const email = form.querySelector('input[type=email]');
    const consent = form.querySelector('input[type=checkbox]');
    const sentence = form.querySelector('[data-signup-consent]');
    const trap = form.querySelector('[data-signup-trap] input');
    const button = form.querySelector('button[type=submit]');
    const status = form.querySelector('[data-signup-status]');
    if (!fieldset || !email || !consent || !sentence || !button || !status) return;

    const say = (text, kind = '') => {
      status.textContent = text;
      status.dataset.state = kind;
    };
    // The HTML ships disabled with "needs JavaScript" in the status line, so
    // nothing pretends to work without this file.
    if (!ready(SIGNUP)) { say(MESSAGES.closed, 'closed'); return; }
    form.noValidate = true;  // the status line says what's missing, in the page's words
    fieldset.disabled = false;
    say('');

    [email, consent].forEach(input => input.addEventListener('input', () => {
      input.removeAttribute('aria-invalid');
      if (status.dataset.state === 'error') say('');
    }));

    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (button.disabled) return;
      email.value = email.value.trim();
      if (!looksLikeEmail(email)) {
        email.setAttribute('aria-invalid', 'true');
        say(MESSAGES.email, 'error');
        email.focus();
        return;
      }
      if (!consent.checked) {
        consent.setAttribute('aria-invalid', 'true');
        say(MESSAGES.consent, 'error');
        consent.focus();
        return;
      }
      const done = () => {
        say(MESSAGES.done, 'done');
        form.reset();
      };
      // A bot filled in the hidden field: say the usual thing, send nothing.
      if (trap && trap.value !== '') { done(); return; }

      const body = new URLSearchParams();
      body.append(SIGNUP.fields.email, email.value);
      body.append(SIGNUP.fields.app, SIGNUP.app);
      body.append(SIGNUP.fields.consent, `${sentence.textContent.replace(/\s+/g, ' ').trim()} (v${SIGNUP.consentVersion})`);

      button.disabled = true;
      form.setAttribute('aria-busy', 'true');
      say(MESSAGES.sending, 'sending');
      const abort = new AbortController();
      const timer = setTimeout(() => abort.abort(), TIMEOUT);
      try {
        // Google's answer is opaque (no-cors): a fetch that resolves counts as sent.
        // No cookies go with it, so it isn't tied to a Google account.
        await fetch(SIGNUP.action, { method: 'POST', mode: 'no-cors', credentials: 'omit', body, signal: abort.signal });
        done();
        countSignup();
      } catch (error) {
        say(MESSAGES.failed, 'error');
      } finally {
        clearTimeout(timer);
        button.disabled = false;
        form.removeAttribute('aria-busy');
      }
    });
  }

  document.querySelectorAll('form[data-signup]').forEach(setUp);
})();
