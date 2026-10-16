# lattefocus website

The public download site for lattefocus, hosted on GitHub Pages from the
`main` branch of [megamind-rgb/lattefocus](https://github.com/megamind-rgb/lattefocus):
https://megamind-rgb.github.io/lattefocus/

## What's here

| | |
| --- | --- |
| `index.html`, `style.css`, `app.js`, `assets/` | The page: blush, silk, frosted glass, with a light and a dark preview |
| `release.js` | The latest release (version, size, download link, release notes link) |
| `404.html` | Shown by GitHub Pages for any missing address. Self-contained: inline style, a full link home |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are |

No build step, no packages, no external fonts, no analytics. The dashboard on
the page is a browser demo with sample activity: it never touches the Mac.

Links between site files are relative, so the site works under `/lattefocus/`
on GitHub Pages, from a local server and straight from the disk (`file://`).
Full addresses appear only where they must: `404.html` (GitHub Pages shows it
at whatever address was missing) and the `canonical` and Open Graph tags,
which point at the live page and at `assets/social-preview.jpg` (the
1200 × 630 picture shown when someone shares the link). That picture is a
screenshot of the page; retake it if the page's look changes.

## The download and the release details

Every download button points at the newest release's zip:

    https://github.com/megamind-rgb/lattefocus/releases/latest/download/lattefocus.zip

GitHub sends that to the newest release's `lattefocus.zip`, so the buttons
never need editing. The site itself never holds the zip.

`release.js` is one line, `window.LATTEFOCUS_RELEASE = {...}`, with
`version`, `size` (bytes; `0` means unknown and hides the size), `published`,
`minimum_macos`, `download` and `notes_url`. It is a script rather than a JSON
file so it also loads from `file://`. The page loads it before `app.js`, and
`app.js` fills in these elements:

| Marked with | Gets |
| --- | --- |
| `data-release-link` | `href` = `download` (and shows a short note that the download started) |
| `data-release="version"` | `v0.3.0` |
| `data-release="size"` | `38.9 MB` |
| `data-release-if="size"` | shown only when the size is known (holds the size and its `·`) |
| `data-release="minimum"` | `macOS 13+` |
| `data-release="notes"` | `href` = `notes_url` (the "What's new" link) |

Without `release.js` (or without JavaScript) the page keeps the words written
in the HTML, such as "Latest version · macOS 13+ · Apple silicon & Intel", and
the buttons still download the latest zip.

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
  it and publishes the site.

Both scripts live in the app's project, next to this folder (not in the
public repository); its `docs/RELEASING.md` describes the whole release.
