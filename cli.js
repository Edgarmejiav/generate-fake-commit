#!/usr/bin/env node

import meow from 'meow';
import {FakeGit} from './index.js';

const cli = meow(`
    Usage
      $ generate-fake-commit --remoteurl <URLGIT> --single --date <YYYY/MM/DD>
      $ generate-fake-commit --remoteurl <URLGIT> --range --start <YYYY/MM/DD> --stop <YYYY/MM/DD>

    Options
      --mincommits, -m  Minimum number of commits to generate
      --maxcommits, -M  Maximum number of commits to generate
      --remoteurl, -u  Remote URL for git repository
      --single, -s  Create a single commit
      --range, -r   Create commits over a date range
      --date, -d    Date for single commit (format: YYYY/MM/DD)
      --start, -a   Start date for range commits (format: YYYY/MM/DD)
      --stop, -o    Stop date for range commits (format: YYYY/MM/DD)

    Examples
      $ generate-fake-commit --single --date 2024/07/17
      $ generate-fake-commit --range --start 2024/07/10 --stop 2024/07/17
`, {
    importMeta: import.meta, flags: {
        remoteurl: {
            type: 'string', shortFlag: 'u'
        }, single: {
            type: 'boolean', shortFlag: 's'
        }, range: {
            type: 'boolean', shortFlag: 'r'
        }, date: {
            type: 'string', shortFlag: 'd'
        }, start: {
            type: 'string', shortFlag: 'a'
        }, stop: {
            type: 'string', shortFlag: 'o'
        }, mincommits: {
            type: 'number', shortFlag: 'm', default: 1
        }, maxcommits: {
            type: 'number', shortFlag: 'M', default: 10
        }
    }
});


(async () => {
    if (!cli.flags.remoteurl) {
        console.error("Please provide a remote URL using --remoteurl");
        process.exit(1);
    }

    const fakeGit = new FakeGit({
        remoteUrl: cli.flags.remoteurl, minCommits: cli.flags.mincommits, maxCommits: cli.flags.maxcommits
    });
    fakeGit.remoteUrl = cli.flags.remoteurl;
    await fakeGit.loadRepo();

    if (cli.flags.single) {
        if (!cli.flags.date) {
            console.error("Please provide a date using --date <YYYY/MM/DD>");
            process.exit(1);
        }
        const providedData = cli.flags.date.split("/").map(x => parseInt(x));
        await fakeGit.singleCommit(providedData[0], providedData[1], providedData[2]);
        // await fakeGit.gitPush();
    } else if (cli.flags.range) {
        if (!cli.flags.start || !cli.flags.stop) {
            console.error("Please provide start and stop dates using --start <YYYY/MM/DD> and --stop <YYYY/MM/DD>");
            process.exit(1);
        }
        const start = cli.flags.start.split("/").map(x => parseInt(x));
        const stop = cli.flags.stop.split("/").map(x => parseInt(x));

        const start_date = new Date(start[0], start[1] - 1, start[2]);
        const stop_date = new Date(stop[0], stop[1] - 1, stop[2]);

        await fakeGit.manyCommits(start_date, stop_date);
        // await fakeGit.gitPush();
    } else {
        console.error("Please provide either --single or --range flag");
        process.exit(1);
    }
    console.log("cd " + fakeGit.repoName);
    console.log("git push --force");
})();
