# 🚀 generate-fake-commit

Welcome to **generate-fake-commit**! 🎉 This is a CLI (Command Line Interface) for generating fake commits in a git
repository. It's useful for testing purposes or to spice up your contribution graph. 😜

[![npm](https://img.shields.io/npm/v/generate-fake-commit)](https://www.npmjs.com/package/generate-fake-commit)
[![npm](https://img.shields.io/npm/dt/generate-fake-commit)](https://www.npmjs.com/package/generate-fake-commit)
[![GitHub](https://img.shields.io/github/license/rodrigobastosv/generate-fake-commit)]
[![npm version](https://badge.fury.io/js/generate-fake-commit.svg)](https://badge.fury.io/js/generate-fake-commit)


## 📚 Usage

```bash
npx generate-fake-commit --remoteurl  <URLGIT> --single --date <YYYY/MM/DD>
npx generate-fake-commit --remoteurl <URLGIT> --range --start <YYYY/MM/DD> --stop <YYYY/MM/DD>
```

## ⚙️ Options

| Option         | Alias | Description                                          |
|----------------|-------|------------------------------------------------------|
| `--remoteurl`  | `-u`  | 🌐 Remote URL for the git repository                 |
| `--single`     | `-s`  | 📌 Create a single commit                            |
| `--range`      | `-r`  | 📅 Create commits over a date range                  |
| `--date`       | `-d`  | 📆 Date for a single commit (format: YYYY/MM/DD)     |
| `--start`      | `-a`  | 🕒 Start date for range commits (format: YYYY/MM/DD) |
| `--stop`       | `-o`  | ⏳ End date for range commits (format: YYYY/MM/DD)    |
| `--mincommits` | `-m`  | Minimum number of commits to generate (default: 1)   
| `--maxcommits` | `-M`  | Maximum number of commits to generate (default: 5)   

## 📦 to import

After execution, navigate to the repository folder and perform a git push to update the remote repository. 🚀💻
