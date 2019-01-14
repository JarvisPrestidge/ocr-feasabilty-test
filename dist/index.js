"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const dv = require("dv");
/**
 * Main application entry point
 *
 * @returns {Promise<void>}
 */
const application = () => __awaiter(this, void 0, void 0, function* () {
    const nowTime = new Date();
    console.info("[APPLICATION] starting application");
    const imagePath = path_1.join(__dirname, "..", "fn-screenshot.png");
    const image = new dv.Image("png", fs_1.readFileSync(imagePath));
    const cropBox = {
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
        .invert();
    // .scale(2)
    const imageBuffer = croppedImage.toBuffer("png");
    fs_1.writeFile(path_1.join(__dirname, "..", "output.png"), imageBuffer, (err) => {
        if (err) {
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
});
application();
//# sourceMappingURL=index.js.map