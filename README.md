# 🚀 generate-fake-commit

Welcome to **generate-fake-commit**! 🎉 This is a CLI (Command Line Interface) for generating fake commits in a git repository. It's useful for testing purposes or to spice up your contribution graph. 😜

## 📚 Usage

```bash
npx generate-fake-commit --remoteurl  <URLGIT> --single --date <YYYY/MM/DD>
npx generate-fake-commit --remoteurl <URLGIT> --range --start <YYYY/MM/DD> --stop <YYYY/MM/DD>
```

## ⚙️ Options

| Option        | Alias | Description                                                                    |
|---------------|-------|--------------------------------------------------------------------------------|
| `--remoteurl` | `-u`  | 🌐 Remote URL for the git repository                                            |
| `--single`    | `-s`  | 📌 Create a single commit                                                       |
| `--range`     | `-r`  | 📅 Create commits over a date range                                             |
| `--date`      | `-d`  | 📆 Date for a single commit (format: YYYY/MM/DD)                                |
| `--start`     | `-a`  | 🕒 Start date for range commits (format: YYYY/MM/DD)                            |
| `--stop`      | `-o`  | ⏳ End date for range commits (format: YYYY/MM/DD)                              |

## 📦 to import
After execution, navigate to the repository folder and perform a git push to update the remote repository. 🚀💻
