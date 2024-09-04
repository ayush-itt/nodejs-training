const path = require("node:path");
const fs = require("node:fs/promises");
const hashObject = require("./hashObject");

class VersionController {
    constructor() {
        this.repoPath = path.join(".", ".vcs"); // .vcs
        this.objectsPath = path.join(this.repoPath, "objects"); // .vcs/objects
        this.headPath = path.join(this.repoPath, "HEAD"); // .vcs/HEAD
        this.indexPath = path.join(this.repoPath, "index"); //.vcs/index
    }

    async init() {
        await fs.mkdir(this.objectsPath, { recursive: true });
        try {
            await fs.writeFile(this.headPath, "", { flag: "wx" });
            await fs.writeFile(this.indexPath, JSON.stringify([]), {
                flag: "wx",
            });
            console.log(`Initialized empty vcs repository!!`);
        } catch (error) {
            console.log("Already initialized with .vcs folder!!");
        }
    }

    async updateStagingArea(filePath, fileHash) {
        const index = JSON.parse(
            await fs.readFile(this.indexPath, { encoding: "utf-8" })
        );

        index.push({ path: filePath, hash: fileHash });
        await fs.writeFile(this.indexPath, JSON.stringify(index));
    }

    async getCurrentHead() {
        try {
            return await fs.readFile(this.headPath, { encoding: "utf-8" });
        } catch (error) {
            return null;
        }
    }

    async add(fileToAdded) {
        const fileData = await fs.readFile(fileToAdded, { encoding: "utf-8" });
        const fileHash = hashObject(fileData);
        const fileHashObjectPath = path.join(this.objectsPath, fileHash);
        await fs.writeFile(fileHashObjectPath, fileData);
        await this.updateStagingArea(fileToAdded, fileHash);
        console.log(`${fileToAdded} added to vcs!`);
    }

    async commit(message) {
        const index = JSON.parse(
            await fs.readFile(this.indexPath, { encoding: "utf-8" })
        );
        const parentCommit = await this.getCurrentHead();

        const commitData = {
            timeStamp: new Date().toISOString(),
            message,
            files: index,
            parent: parentCommit,
        };

        const commitHash = hashObject(JSON.stringify(commitData));
        const commitHashObjectPath = path.join(this.objectsPath, commitHash);
        await fs.writeFile(commitHashObjectPath, JSON.stringify(commitData));

        await fs.writeFile(this.headPath, commitHash); // update the HEAD to new commit hash
        await fs.writeFile(this.indexPath, JSON.stringify([])); // clear the staging area

        console.log(`commit successfully created: ${commitHash}`);
    }

    async log() {
        let currentCommitHash = await this.getCurrentHead();
        while (currentCommitHash) {
            const commitData = JSON.parse(
                await fs.readFile(
                    path.join(this.objectsPath, currentCommitHash),
                    { encoding: "utf-8" }
                )
            );
            console.log(
                "----------------------------------------------------------------"
            );
            console.log(`Commit: ${currentCommitHash}`);
            console.log(`Message: ${commitData.message}`);
            console.log(`Timestamp: ${commitData.timeStamp}`);
            console.log(`Parent Commit: ${commitData.parent}`);
            console.log(
                "----------------------------------------------------------------\n"
            );
            currentCommitHash = commitData.parent;
        }
    }
}

module.exports = VersionController;
