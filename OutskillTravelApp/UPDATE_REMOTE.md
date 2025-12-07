# Update Git Remote After Repository Rename

## If you renamed the repository on GitHub to `OutskillTravelAppPrepSite`

Run this command to update your local repository's remote URL:

```powershell
git remote set-url origin https://github.com/rwfraser/OutskillTravelAppPrepSite.git
```

## Verify the change:

```powershell
git remote -v
```

Should show:
```
origin  https://github.com/rwfraser/OutskillTravelAppPrepSite.git (fetch)
origin  https://github.com/rwfraser/OutskillTravelAppPrepSite.git (push)
```

## Then you can push/pull as normal:

```powershell
git push origin main
git pull origin main
```
