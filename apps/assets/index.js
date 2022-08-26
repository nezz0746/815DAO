import ethers from "ethers";
// import { create } from "ipfs-http-client";
import Jimp from "jimp";

console.log("We have to go back !");

async function main() {
  const capacity = 361;
  for (let i = 0; i < 3; i++) {
    const flightNumber = (i / capacity).toFixed(0) + 1;
    const seatNumber = i % capacity;

    const tokenID = ethers.utils.solidityPack(
      ["uint128", "uint128"],
      [flightNumber, seatNumber]
    );

    const image = await Jimp.read("./Oceanic815Ticket.png");
    const font = await Jimp.loadFont(Jimp.FONT_SANS_128_BLACK);

    image.print(
      font,
      0,
      1600,
      {
        text: `Flight: ${flightNumber} - Seat n°: ${seatNumber}`,
        alignmentX: Jimp.HORIZONTAL_ALIGN_RIGHT,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
      },
      2500
    );

    await image.writeAsync("./build/" + tokenID + ".png");
  }
}

main();
