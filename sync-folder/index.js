const fs = require("fs").promises;
const { init, startSync } = require("./syncUtils");
const { configPath, config } = require("./common");

(async function main() {
    const command = process.argv[2];

    if (command == "--init") {
        init(configPath, config);
    } else if (command == "--sync") {
        try {
            const data = await fs.readFile(configPath, "utf8");
            const config = JSON.parse(data);
            startSync(config.source, config.target);
        } catch (error) {
            console.error("Error reading config.json:", error);
        }
    } else {
        console.log('Unknown command. Please use "--init" or "--sync"');
    }
})();
