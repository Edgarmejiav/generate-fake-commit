import fs from 'fs';
import path from 'path';
import {randomUUID} from 'crypto';
import simpleGit from 'simple-git';


export class FakeGit {
    constructor({minCommits = 1, maxCommits = 10, remoteUrl = ""}) {
        this.projectDir = process.cwd();
        this.minCommits = minCommits;
        this.maxCommits = maxCommits;
        this.repo = null;
        this.remoteUrl = remoteUrl;
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
        const emoji = this.getRandomEmoji();
        const uuid = randomUUID();
        const commitMessage = `${emoji} : ${uuid}`;
        this.repo.raw(['commit', '--allow-empty', '-m', commitMessage, '--date', actionDate]);
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

    getRandomEmoji() {
        const emojis = ["🎉", "✨", "🐛", "🚀"];
        const randomIndex = Math.floor(Math.random() * emojis.length);
        return emojis[randomIndex];
    }


}

