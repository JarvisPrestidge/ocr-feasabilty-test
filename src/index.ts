import { readFileSync, writeFile } from "fs";
import { join } from "path";
const dv = require("dv");

interface IDVBox {
    x: Number;
    y: Number;
    width: Number;
    height: Number;
}

/**
 * Main application entry point
 *
 * @returns {Promise<void>}
 */
const application = async (): Promise<void> => {
    const nowTime = new Date();
    console.info("[APPLICATION] starting application");

    const imagePath = join(__dirname, "..", "fn-screenshot.png");

    const image = new dv.Image("png", readFileSync(imagePath));

    const cropBox: IDVBox = {
        x: 1250,
        y: 730,
        width: 200,
        height: 50
    };

    const croppedImage = image
        .crop(cropBox)
        .toGray(1, 0, 0)
        .subtract(image.crop(cropBox).toGray(0.15, 0.5, 0.5))
        .threshold()
        .invert()
        // .scale(2)

    const imageBuffer = croppedImage.toBuffer("png");

    writeFile(join(__dirname, "..", "output.png"), imageBuffer, (err) => {
        if(err) {
            return console.log(err);
        }
        console.log("image file was saved!");
    }); 

    // Get custom trained data
    // const tessdataRootDir = join(__dirname, "..");

    // const tesseract = new dv.Tesseract("Burbank", croppedImage, tessdataRootDir);
    const tesseract = new dv.Tesseract("eng", croppedImage);

    // Print tesseract options
    // for (const key in tesseract) {
    //     if (typeof tesseract[key] !== "function") {
    //         console.log(key + " = " + tesseract[key]);
    //     }
    // }

    const text = tesseract.findText("plain");

    console.log(text);

    const elapsedMs = new Date().getTime() - nowTime.getTime();
    console.info(`[APPLICATION] application took ${elapsedMs} ms`);
};

application();
