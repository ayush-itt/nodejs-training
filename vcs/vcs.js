const { Command } = require("commander");
const VersionController = require("./utils/VersionController");

const program = new Command();
let vc = new VersionController();

program
    .command("init")
    .description("Initialize repository!")
    .action(async () => vc.init());
program
    .command("add <filename>")
    .description("Add to repository!")
    .action(async (fileName) => vc.add(fileName));
program
    .command("commit <message>")
    .description("Commit repository!")
    .action(async (message) => vc.commit(message));
program
    .command("log")
    .description("Log repository!")
    .action(() => vc.log());

program.parse(process.argv);
