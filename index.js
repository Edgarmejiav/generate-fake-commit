const {execSync} = require('child_process');
const fs = require('fs');
const path = require('path');
const {randomUUID} = require('crypto');
const simpleGit = require('simple-git');
const readline = require('readline');

class FakeGit {
    constructor() {
        this.projectDir = path.resolve(path.dirname(__filename));
        this.minCommits = 1;
        this.maxCommits = 10;
        this.repo = null;
        this.remoteUrl = "git@github.com:Edgarmejiav/my-git.git";
        this.repoName = this.remoteUrl.split('/').pop().split('.')[0];
        console.log("[Info]: Starting");
    }

    async loadRepo() {
        const repoPath = path.join(this.projectDir, this.repoName);
        if (!fs.existsSync(repoPath)) {
            console.log("[Error]: Repo not found. Creating new one from remote-url");
            fs.mkdirSync(repoPath, {recursive: true});
            this.repo = simpleGit(repoPath);
            await this.repo.clone(this.remoteUrl, repoPath);
        } else {
            console.log("[Info]: Loading git repository");
            this.repo = simpleGit(repoPath);
            console.log("[Info]: Repo loaded");
        }
    }

    executeCommit(year, month, day) {
        const actionDate = new Date(year, month - 1, day).toISOString();
        process.env.GIT_AUTHOR_DATE = actionDate;
        process.env.GIT_COMMITTER_DATE = actionDate;
        this.repo.raw(['commit', '--allow-empty', '-m', randomUUID(), '--date', actionDate]);
    }


    async singleCommit(year, month, day) {
        const currentDate = new Date(year, month - 1, day);
        const commitsAmount = this.randomIntFromInterval(this.minCommits, this.maxCommits);
        console.log(`Currently committing ${currentDate.toISOString().split('T')[0]} with ${commitsAmount} commits`);
        for (let x = 0; x < commitsAmount; x++) {
            this.executeCommit(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
        }
    }

    async manyCommits(commitStartDate, commitStopDate, mix = false) {
        let startDate = new Date(commitStartDate);
        const stopDate = new Date(commitStopDate);

        while (startDate < stopDate) {
            await this.singleCommit(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());
            const randomDays = this.randomIntFromInterval(3, 9);
            if (mix) {
                startDate.setDate(startDate.getDate() + randomDays);
            } else {
                startDate.setDate(startDate.getDate() + 1);
            }
        }
    }

    async gitPush() {
        try {
            await this.repo.push();
            console.log("Changes have been pushed!");
        } catch (e) {
            console.log(`Error occurred while pushing the code !:\n${e}`);
        }
    }

    randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

(async () => {
    const fakeGit = new FakeGit();
    await fakeGit.loadRepo();

    const rl = readline.createInterface({
        input: process.stdin, output: process.stdout
    });

    rl.question("1.Create single commit\n2.Range of commits\n>> ", async (answer) => {
        if (answer === '1') {
            rl.question("Date in format YYYY/MM/DD\n>> ", async (date) => {
                const providedData = date.split("/").map(x => parseInt(x));
                await fakeGit.singleCommit(providedData[0], providedData[1], providedData[2]);
                await fakeGit.gitPush();
                rl.close();
            });
        } else {
    rl.question("Start date in format YYYY/MM/DD\n>> ", async (startDate = "2020/01/01") => {
        rl.question("Stop date in format YYYY/MM/DD\n>> ", async (stopDate = "2020/03/01") => {
            const start = "2020/01/01".split("/").map(x => parseInt(x));
            const stop =  "2020/03/01".split("/").map(x => parseInt(x));

            const start_date = new Date(start[0], start[1] - 1, start[2]);
            const stop_date = new Date(stop[0], stop[1] - 1, stop[2]);

            await fakeGit.manyCommits(start_date, stop_date);
            await fakeGit.gitPush();
            rl.close();
        });
    });
    }
    });
})();
