const fs = require("fs");
const path = require("path");

function init(configPath, config) {
    fs.writeFile(configPath, JSON.stringify(config, null), (err) => {
        if (err) {
            console.error("Error writing to config.json:", err);
        } else {
            console.log("Config file created successfully.");
        }
    });
}

function startSync(sourceDir, targetDir) {
    console.log("Syncing started...");

    const files = fs.readdirSync(sourceDir);
    if (files.length > 0) {
        console.log(
            "Copying files from current directory to target directory..."
        );
        files.forEach((file) => {
            const sourcePath = path.join(sourceDir, file);
            const destinationPath = path.join(targetDir, file);
            fs.copyFileSync(sourcePath, destinationPath);
            console.log(`File ${sourcePath} copied to ${destinationPath}`);
        });
    }

    const watcher = fs.watch(
        sourceDir,
        { recursive: true },
        (eventType, filename) => {
            const sourcePath = path.join(sourceDir, filename);
            const destinationPath = path.join(targetDir, filename);

            if (eventType === "rename") {
                if (fs.existsSync(sourcePath)) {
                    fs.copyFileSync(sourcePath, destinationPath);
                    console.log(
                        `File ${sourcePath} copied to ${destinationPath}`
                    );
                } else {
                    fs.unlinkSync(destinationPath);
                    console.log(`File ${destinationPath} deleted`);
                }
            } else if (eventType === "change") {
                fs.copyFileSync(sourcePath, destinationPath);
                console.log(
                    `File ${sourcePath} synced with ${destinationPath}`
                );
            }
        }
    );

    return watcher;
}

module.exports = { init, startSync };
