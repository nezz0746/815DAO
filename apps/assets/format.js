import fs from "fs/promises";

const main = async () => {
  const file = await fs.readFile("./svg/Oceanic815Ticket.svg", "utf-8");

  await fs.writeFile("./parsedForContract.txt", "");

  await fs.appendFile("./parsedForContract.txt", "string(abi.encodePacked(\n");
  file.split(/\r?\n/).forEach(async (line, lineIndex) => {
    line = line.replaceAll('"', `'`);
    if (lineIndex === 90 || lineIndex === 92) {
      await fs.appendFile(
        "./parsedForContract.txt",
        `string(abi.encodePacked("${line.trimStart()}"),\n`
      );
    } else {
      await fs.appendFile(
        "./parsedForContract.txt",
        `"${line.trimStart()}",\n`
      );
    }
  });
  await fs.appendFile("./parsedForContract.txt", "));");
};

main();
