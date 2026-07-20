# Rakib GitHub License Bookmarklet

## What it does

1. The bookmark loads `update.js` from jsDelivr/GitHub.
2. A license modal appears on the current page.
3. The entered key is SHA-256 hashed locally.
4. The hash is matched against `licenses.json`.
5. If valid and unexpired, `main.js` runs.
6. The page displays `Rakib (Demo)` and changes the selected icon.
7. The page URL is not changed.

## One-time setup

On Windows, open PowerShell in this folder and run:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\setup.ps1
```

Press Enter to accept the defaults:

```text
GitHub username: seyam901
Repository: free
Branch: main
```

The script creates:

```text
bookmarklet-ready.txt
```

Copy that one-line code into the URL field of a browser bookmark.

## Upload to GitHub

Upload these files to the repository root:

```text
config.js
licenses.json
main.js
update.js
index.html
README.md
```

You do not need GitHub Pages for the bookmarklet itself because jsDelivr reads the public repository. The repository must be public.

After changing a file, jsDelivr can briefly cache it. The bookmarklet and loader add a timestamp query to reduce stale caching.

## First private license

The package was generated with one license hash already in `licenses.json`. The plain-text key is delivered separately and must not be uploaded.

## Add another license

Run:

```powershell
.\New-License.ps1
```

It generates a strong key, adds only its SHA-256 hash to `licenses.json`, and prints the key once.

You can also provide your own:

```powershell
.\New-License.ps1 -LicenseKey "RAKIB-YOUR-LONG-PRIVATE-KEY" -Id "customer-2" -Expires "2027-12-31T23:59:59Z"
```

Upload the updated `licenses.json`.

## Disable a license

In `licenses.json`, change:

```json
"active": true
```

to:

```json
"active": false
```

## Important limitation

This is client-side/static access control. It is convenient, but not secure licensing. Anyone with developer tools can inspect JavaScript, copy the payload, or bypass the check. Do not place the LicenseAuth application secret or any private API secret in these files.

For real revocation, device limits, anti-sharing, and hidden code, use a server-side API.
