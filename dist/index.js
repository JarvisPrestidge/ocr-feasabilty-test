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
const sharp = require("sharp");
const path_1 = require("path");
const Tesseract = require("tesseract.js");
/**
 * Main application entry point
 *
 * @returns {Promise<void>}
 */
const application = () => __awaiter(this, void 0, void 0, function* () {
    const nowTime = new Date();
    console.info("[APPLICATION] starting application");
    let image;
    const inputImagePath = path_1.join(__dirname, "..", "input1.jpg");
    const outputImagePath = path_1.join(__dirname, "..", "output.png");
    try {
        image = yield sharp(inputImagePath)
            .extract({ left: 350, top: 10, width: 25, height: 15 })
            .resize(100)
            // .median(2)
            // .sharpen(5)
            .greyscale();
        // .threshold(50)
        // .negate();
        const metadata = yield image.metadata();
        const stats = yield image.stats();
        console.log(metadata);
        console.log(stats);
        yield image.toFile(outputImagePath);
    }
    catch (error) {
        throw error;
    }
    const { TesseractWorker } = Tesseract;
    const tesseractWorker = new TesseractWorker();
    console.log(`Recognizing ${image}`);
    tesseractWorker
        .recognize(outputImagePath)
        .then((data) => {
        const cleanedText = data.text.replace(/\D/g, "");
        console.log(cleanedText);
    })
        .catch((err) => {
        console.error("Error\n", err);
    })
        .finally(() => {
        process.exit();
    });
    const elapsedMs = new Date().getTime() - nowTime.getTime();
    console.info(`[APPLICATION] application took ${elapsedMs} ms`);
});
application();
//# sourceMappingURL=index.js.map