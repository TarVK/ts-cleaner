#!/usr/bin/env node
const Args = require("args");
const Path = require("path");
const tsCleaner = require("ts-cleaner");

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

// Get the source and distribution folders
const src = Path.resolve(process.cwd(), args.src);
const dist = Path.resolve(process.cwd(), args.dist);

// Clean the directory
tsCleaner.clean(src, dist, args.verbose);

// Check whether we should continue checking for chnages
if (args.watch) tsCleaner.watch(src, dist, args.verbose);
