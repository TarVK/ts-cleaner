# ts-cleaner

A simple script that can be used to cleanup previously transpiled typescript files. When typescript is setup to transpile files from a source to distribution folder, it won't automatically remove distribution fils when their source file is deleted. ts-cleaner can take care of this task for you, both in single time build mode, or in watch mode.

Npm: [ts-cleaner](https://www.npmjs.com/package/ts-cleaner)

## Example

```
tsc && ts-cleaner
```

```
concurrently "tsc --watch" "ts-cleaner --watch"
```

-   [TypeScript](https://www.npmjs.com/package/typescript)
-   [Concurrently](https://www.npmjs.com/package/concurrently)

## Options

```
 Usage: ts-cleaner [options] [command]

  Commands:
    help     Display help
    version  Display version

  Options:
    -d, --dist [value]  The distribution folder with js files (defaults to "dist")
    -h, --help          Output usage information
    -s, --src [value]   The source folder with ts files (defaults to "src")
    -v, --verbose       Whether to show messages for files being deleted (disabled by default)
    -V, --version       Output the version number
    -w, --watch         Whether to watch for files being deleted (disabled by default)
```

## Node usage

ts-cleaner also provides two simple functions for usage from within a node script:

```ts
const tsCleaner = require("ts-cleaner");

/**
 * Cleans the directory by removing dist files that no longer have a source file
 * Arguments: Source directory, distrbution directory, verbose
 * Where a directory is either an absolute path, or a path relative to process.cwd()
 */
tsCleaner.clean("srcDir", "distDir", true);

/**
 * Cleans the directory by removing dist files when a src file is deleted
 * Arguments: Source directory, distrbution directory, verbose
 * Where a directory is either an absolute path, or a path relative to process.cwd()
 */
tsCleaner.watch("srcDir", "distDir", true);
```
