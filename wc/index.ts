import fs from "fs";

(() => {
    const args = process.argv.slice(2);

    if (!args.length) {
        console.error("No arguments passed");
        process.exit(1);
    }

    const filePath = args.pop();

    if (!filePath || !fs.existsSync(filePath)) {
        console.error("File path does not exist");
        process.exit(1);
    }

    const flags = new Set(args);

    if (!flags.size) {
        console.error("No flags passed");
        process.exit(1);
    }

    if (!flags.has("-c") && !flags.has("-l")) {
        console.error("Incorrect flag(s) passed");
        process.exit(1);
    }

    if (flags.has("-c")) {
        const stats = fs.statSync(filePath);
        console.log(stats.size, filePath);
        process.exit(0);
    }

    if (flags.has("-l")) {
        const readStream = fs.createReadStream(filePath, { encoding: "utf-8" });

        let lines = 0;
        let leftover: string | undefined = "";

        readStream.on("data", (chunk) => {
            chunk = (leftover || "") + chunk;
            let chunkLines = chunk.toString().split("\n");
            lines += chunkLines.length - 1;
            leftover = chunkLines.pop();
        });

        readStream.on("end", () => {
            console.log(lines, filePath);
        });

        return;
    }
})();
