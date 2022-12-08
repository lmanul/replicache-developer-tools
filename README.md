# replicache-developer-tools
Repository for the developer tools for Replicache (browser extension)

# Terminology

* **Panel**: the "Replicache" tab in the developer tools

# Structure

Because of the way the various Javascript execution contexts are sandboxed,
the architecture here is a little tricky.



| Piece | Execution context | Loaded by | Executed before dev tools tab gets activated | Role |
| ----- | ----------------- | ----------- | -------------------------------------------- | ---- |
| `content_script.js` | Host page | Extension framework | Yes | Catch messages about changes in the data |
| `background.js` | Service worker in host page | Extension framework | Yes | TODO |
| `devtools.js` | Developer tools | From dev tools HTML | Yes | Add the Replicache panel |
| `install_hook.js` | Host page | From `background.js` | No | Listen to changes from Replicache |
| `panel.js` | Panel | From panel HTML | No | Coordinate between panel UI and data messages |
