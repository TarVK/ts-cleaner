const Args = require("args");
const chokidar = require("chokidar");
const Path = require("path");
const fs = require("fs");

// Define the arguments
Args.options([
    {
        name: "src",
        description: "The source folder with ts files",
        defaultValue: "src",
    },
    {
        name: "dist",
        description: "The distribution folder with js files",
        defaultValue: "dist",
    },
    {
        name: "watch",
        description: "Whether to watch for files being deleted",
        defaultValue: false,
    },
    {
        name: "verbose",
        description: "Whether to show messages for files being deleted",
        defaultValue: false,
    },
]);
const args = Args.parse(process.argv);

const srcTypePattern = /^(.*)\.ts$/;
const distTypePattern = /^(.*)\.d\.ts$/;

// Define the watcher function
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

                if (fs.existsSync(path + ".js")) fs.unlink(path + ".js", () => {});
                if (fs.existsSync(path + ".js.map"))
                    fs.unlink(path + ".js.map", () => {});
                if (fs.existsSync(path + ".d.ts")) fs.unlink(path + ".d.ts", () => {});

                if (verbose) console.log(`Removed "${match[1]}" from dist`);
            }
        });
    if (verbose) console.log(`Watching in "${src}"`);
};

// Define the clean function
exports.clean = function(src, dist, verbose) {
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
                const match = path.match(distTypePattern);
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
                            fs.unlink(extLess + ".js", () => {});
                        if (fs.existsSync(extLess + ".js.map"))
                            fs.unlink(extLess + ".js.map", () => {});
                        if (fs.existsSync(extLess + ".d.ts"))
                            fs.unlink(extLess + ".d.ts", () => {});

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

// Get the source and distribution folders
const src = Path.resolve(process.cwd(), args.src);
const dist = Path.resolve(process.cwd(), args.dist);

// Clean the directory
if (module.parent == null) exports.clean(src, dist, args.verbose);

// Check whether we should continue checking for chnages
if (args.watch) exports.watch(src, dist, args.verbose);
