#!/usr/bin/env node
const chokidar = require("chokidar");
const Path = require("path");
const fs = require("fs");

const srcTypePattern = /^(.*)\.ts$/;
const distTypePattern = /^(.*)\.d\.ts$/;
const distTypeJsPattern = /^(.*)\.js$/;

/**
 * Watches a folder for file removal
 * @param {string} src The source folder to observe
 * @param {string} dist The distribution folder to mirror deletions of ts files to
 * @param {boolean} verbose Whether or not to print messages in the console about deletions
 */
exports.watch = function(src, dist, verbose) {
    chokidar
        .watch(src, {
            persistent: true,
            cwd: src,
        })
        .on("unlink", path => {
            // Check if it was a type file
            const match = path.match(srcTypePattern);
            if (match) {
                path = Path.resolve(dist, match[1]);

                if (fs.existsSync(path + ".js")) fs.unlinkSync(path + ".js");
                if (fs.existsSync(path + ".js.map")) fs.unlinkSync(path + ".js.map");
                if (fs.existsSync(path + ".d.ts")) fs.unlinkSync(path + ".d.ts");

                if (verbose) console.log(`Removed "${match[1]}" from dist`);
            }
        });
    if (verbose) console.log(`Watching in "${src}"`);
};

/**
 * Removes js files from the folder if no ts file exists for them anymore
 * @param {string} src The source folder that should contain the ts files
 * @param {string} dist The distribution folder to remove files from if not present in the source folder
 * @param {boolean} ifTsDecl Whether or not to only remove a js file, if a .d.ts file is also present
 * @param {booleanp} verbose Whether or not to print message in the console about deletions
 */
exports.clean = function(src, dist, ifTsDecl, verbose) {
    // Define a recursive method for scanning and cleaning a directory
    const readDir = dirPath => {
        // Get and read the files in the directory
        const files = fs.readdirSync(dirPath);
        files.forEach(file => {
            const path = Path.join(dirPath, file);

            // Check if this file is a directory or not, and if it is; recurse
            if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
                readDir(path);
            } else {
                // Otherwise, check if it is a ts fist file
                const match = path.match(ifTsDecl ? distTypePattern : distTypeJsPattern);
                if (match) {
                    const extLess = match[1].substring(0, match[1].length);
                    const relPath = extLess.substring(dist.length);
                    const srcPath = Path.join(src, relPath);

                    // Check if there is either a ts, d.ts or tsx file corresponding to this d.ts files
                    if (
                        !(
                            fs.existsSync(srcPath + ".d.ts") ||
                            fs.existsSync(srcPath + ".ts") ||
                            fs.existsSync(srcPath + ".tsx")
                        )
                    ) {
                        if (fs.existsSync(extLess + ".js"))
                            fs.unlinkSync(extLess + ".js");
                        if (fs.existsSync(extLess + ".js.map"))
                            fs.unlinkSync(extLess + ".js.map");
                        if (fs.existsSync(extLess + ".d.ts"))
                            fs.unlinkSync(extLess + ".d.ts");

                        if (verbose) console.log(`Removed "${relPath}" from dist`);
                    }
                }
            }
        });
    };

    // Start cleaning the root directory
    readDir(dist);

    if (verbose) console.log(`Cleaned "${dist}"`);
};
