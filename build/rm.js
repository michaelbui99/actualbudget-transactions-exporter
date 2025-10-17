const path = require("path");
const fs = require("fs");
const { argv } = require("process");

function printUsage() {
    console.log("node rm.js <PATH>");
}

const args = argv.slice(2);
if (args.length != 1) {
    printUsage();
}

const resolvedPath = path.resolve(args[0]);
if (!fs.existsSync(resolvedPath)) {
    return;
}
fs.rmSync(resolvedPath, {recursive: true, force: true});
