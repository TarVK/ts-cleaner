/**
 * A file watcher that will remove all ts generated files when a ts source file is deleted
 */
const chokidar = require("chokidar");
const Path = require("path");
const fs = require("fs");

const typePattern = /^(.*)\.ts$/;
const dir = Path.join(process.cwd(), "src");
chokidar
    .watch(dir, {
        persistent: true,
        cwd: dir,
    })
    .on("unlink", path => {
        // Check if it was a type file
        const match = path.match(typePattern);
        if (match) {
            path = Path.join("dist", match[1]);

            if (fs.existsSync(path + ".js")) fs.unlink(path + ".js", () => {});
            if (fs.existsSync(path + ".js.map")) fs.unlink(path + ".js.map", () => {});
            if (fs.existsSync(path + ".d.ts")) fs.unlink(path + ".d.ts", () => {});
        }
    });
