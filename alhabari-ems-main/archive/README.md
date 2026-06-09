# Archive

Old versions of `index.html` for emergency rollback.

Git history already keeps every version of `index.html`, but this folder is for **human-friendly** access — you can browse old versions directly without using Git commands.

## Naming convention

`v<NUMBER>-index.html` — for example: `v40-index.html`, `v34-index.html`

## When to add to archive

Add a file here whenever you ship a major version (every 5–10 commits, or after major features). Skip for tiny bug fixes.

## To restore an old version

1. Open the file in this folder
2. Copy contents
3. Replace root `index.html` with it
4. Commit "Rollback to vXX"
5. Netlify auto-deploys

## Current archive

(empty — populate as you ship versions)
