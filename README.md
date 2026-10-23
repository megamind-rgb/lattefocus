# lattefocus website

The public site for lattefocus, hosted on GitHub Pages from the
`main` branch of [megamind-rgb/lattefocus](https://github.com/megamind-rgb/lattefocus):
https://megamind-rgb.github.io/lattefocus/

lattefocus launches in November 2026. Until then the site offers no download:
it collects emails for the launch list instead (80% off for life, and one
email at launch). People who already have the free preview keep it; from version
0.3.0 on it updates itself from GitHub releases, as before.

## What's here

| | |
| --- | --- |
| `index.html`, `style.css`, `app.js`, `assets/` | The page: blush, silk, frosted glass, with a light and a dark preview |
| `signup.js` | The launch list form: the one place with its settings (see The launch list) |
| `release.js` | The latest release, written by `scripts/publish_release.sh`. The page doesn't load it until there are downloads again |
| `analytics.js` | The visit counter (GoatCounter, no cookies): the one place that names this site's counter |
| `assets/count.js` | GoatCounter's counting script, a copy kept here (see Visit counting) |
| `privacy.html`, `terms.html`, `licenses.html` | Privacy, Terms of use, and the open-source licences inside the app |
| `404.html` | Shown by GitHub Pages for any missing address. Self-contained: inline style, a full link home |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are |

No build step, no packages, no external fonts. One cookie-free visit counter
(GoatCounter); the privacy page explains it. The dashboard on the page is a
browser demo with sample activity: it never touches the Mac.

Links between site files are relative, so the site works under `/lattefocus/`
on GitHub Pages, from a local server and straight from the disk (`file://`).
Full addresses appear only where they must: `404.html` (GitHub Pages shows it
at whatever address was missing, so its links and its `analytics.js` are full addresses) and the `canonical` and Open Graph tags,
which point at the live page and at `assets/social-preview.jpg` (the
1200 × 630 picture shown when someone shares the link). That picture is a
screenshot of the page; retake it if the page's look changes.

## The launch list

The main call to action is the form in `#join` on `index.html` (the header,
the hero and the footer link there). Whoever joins gets 80% off for life and
one email at launch; `terms.html#launch-offer` has the offer and
`privacy.html#launch-list` what is stored and why.

`signup.js` holds the settings, in `SIGNUP` at its top, and runs every
`form[data-signup]`:

    const SIGNUP = {
      action: 'https://docs.google.com/forms/d/e/FORM_ID/formResponse',
      fields: { email: 'entry.EMAIL', app: 'entry.APP', consent: 'entry.CONSENT' },
      app: 'lattefocus',
      consentVersion: '2026-10-23'
    };

While any of these is still a placeholder (`FORM_ID`, `entry.EMAIL`, ...),
the form stays disabled and says "The launch list isn't open yet". Without
JavaScript it stays disabled and says it needs JavaScript; it never sends
anything without `signup.js`.

On submit it checks the address (any address, not only Gmail) and the
consent box, then sends one `application/x-www-form-urlencoded` POST to
`action` with `fetch(..., {mode: 'no-cors', credentials: 'omit'})`: the
email, `app` (`lattefocus`) and the consent sentence exactly as shown next to
the box plus ` (v2026-10-23)`. Google's answer can't be read (no-cors), so a
fetch that resolves counts as sent and one that fails (or takes over 20
seconds) asks to try again. A hidden field catches bots: when it's filled
in, the form says the usual thing and sends nothing. When GoatCounter is
counting, a sign-up counts one `signup` event, never the address.

### Setting up the Google Form

1. Make a Google Form, in a Google Workspace account with Google's Cloud
   Data Processing Addendum accepted (`privacy.html` says Google keeps the
   list for us), with three **Short answer** questions: Email, App and
   Consent (the consent text is long: a Paragraph question works too). No
   response validation that could turn a sign-up away: the page can't see a
   refusal. In Settings → Responses: **Collect email addresses: Do not
   collect**, and no sign-in or "Limit to 1 response".
2. Responses → Link to Sheets. Google adds the time of each answer
   (Timestamp).
3. The form's ⋮ menu → Get pre-filled link: fill in each question, Get link,
   and copy the `entry.<number>` of each into `fields`.
4. `action` is the form's address (Send → link, the long
   `https://docs.google.com/forms/d/e/<id>/viewform`) with `viewform`
   changed to `formResponse`.
5. Try it on the live site with a test address, check that its row
   appears in the Sheet, then delete that row.

Keep the list as `privacy.html#launch-list` promises: take people off when
they unsubscribe (by email or a reply), send the one launch email, and
delete the list at the latest 6 months after it, or on 31 May 2027 if
lattefocus hasn't launched by then. If the consent sentence on `index.html`
changes, change `consentVersion` and add a line under Changes in
`privacy.html`. If the launch moves out of November 2026, change the
sentence, `consentVersion` and the success message in `signup.js` together,
and the launch month on the other pages.

## Visit counting

Every page loads `analytics.js`, which loads this site's copy of
GoatCounter's script (`assets/count.js`) and sends visits to
`https://lattefocus.goatcounter.com/count`. To use another counter, change
`COUNTER` at the top of `analytics.js`; nothing else names it.

The script is loaded only on the live site (https), and never when the
browser sends Global Privacy Control or Do Not Track, blocks site storage, or
chose "Don't count my visits" on `privacy.html`. It sets no cookies. The
switch on `privacy.html` saves that choice as GoatCounter's own `skipgc` note
in the browser; nothing else is ever stored. Joining the launch list counts
one event, `signup` (`signup.js`), never the address. From `file://` or a local
server nothing is counted, and a content blocker that stops the script costs
nothing but the count.

`assets/count.js` is GoatCounter's own `https://gc.zgo.at/count.js` as of
16 October 2026, under its ISC licence notice (also on `licenses.html`). A
copy here means no other server is asked for the script (GoatCounter serves
gc.zgo.at through a content delivery network; the counts themselves go to
GoatCounter), and what it sends can't change under `privacy.html`. To compare
it with GoatCounter's current one:

    awk 'f; /^\/\/ Unchanged from here on\.$/ {f=1}' assets/count.js | diff - <(curl -s https://gc.zgo.at/count.js)

To take a newer one, put it after the line "Unchanged from here on.", read
what it sends, and change "Counting visits" in `privacy.html` to match (now:
the page's address and title, the address of the page before, the screen's
width and a bot check), and the date here and on `licenses.html`.

`privacy.html` promises this set-up, so the GoatCounter site settings must
match it:

| Setting | Value |
| --- | --- |
| Sessions, referrer, browser and system, country | on |
| Screen size, region, language, individual pageviews | off |
| Data retention | 730 days (the privacy page says 24 months) |
| Dashboard | private |

## Legal pages

`privacy.html`, `terms.html` and `licenses.html` are plain pages in the
site's own style (`style.css`, "Legal pages" at its end). Every page's footer
links to them and to the contact address, and carries the trademark line.

- The contact address, hello@phantfocus.com, is written in one place: the
  Contact block at the end of `privacy.html` (`#contact`). Every other page
  links there. It must be the same as `contact` of lattefocus in `app.json`
  (`scripts/publish_site.sh` checks).
- When a legal page changes, change its "Effective" date and add a line under
  Changes (`privacy.html`).
- `privacy.html` describes what the app and this site really do (the update
  check, what the app stores and where, the counter's settings above, the
  launch list). Change it with them.
- `licenses.html` lists the open-source parts inside the app, with their
  versions and licence texts. Change it when the app's Python, its libraries
  or its icons change.

## Preview it locally

    cd website/lattefocus
    python3 -m http.server 4174 --bind 127.0.0.1

Then open http://127.0.0.1:4174/ and stop the server with Control-C. Opening
`index.html` straight from Finder works too, except that Chrome leaves out the
lattefocus wordmark there (it is a CSS mask, which Chrome loads only over
http).

## Publish it

Don't copy files to GitHub by hand:

- `scripts/publish_site.sh lattefocus` publishes this folder to GitHub Pages,
  for changes to the page itself.
- `scripts/publish_release.sh` publishes a new version of the app: it uploads
  the zip and the update feed to a GitHub release, rewrites `release.js` for
  it and publishes the site. Existing copies of the preview update from that
  release; the page itself offers no download until launch.

Both scripts live in the app's project, next to this folder (not in the
public repository); its `docs/RELEASING.md` describes the whole release.
