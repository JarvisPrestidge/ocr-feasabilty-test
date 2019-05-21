import * as sharp from "sharp";
import { join } from "path";

const Tesseract = require("tesseract.js");

/**
 * Main application entry point
 *
 * @returns {Promise<void>}
 */
const application = async (): Promise<void> => {

    const nowTime = new Date();
    console.info("[APPLICATION] starting application");

    let image: sharp.Sharp;

    const inputImagePath = join(__dirname, "..", "input1.jpg");
    const outputImagePath = join(__dirname, "..", "output.png");

    try {
        image = await sharp(inputImagePath)
            .extract({ left: 350, top: 10, width: 25, height: 15 })
            .resize(100)
            // .median(2)
            // .sharpen(5)
            .greyscale()
            // .threshold(50)
            // .negate();
        
        const metadata = await image.metadata();

        const stats = await image.stats();

        console.log(metadata);
        console.log(stats);

        await image.toFile(outputImagePath);
    } catch (error) {
        throw error;
    }

    const { TesseractWorker } = Tesseract;
    const tesseractWorker = new TesseractWorker();

    console.log(`Recognizing ${image}`);

    tesseractWorker
        .recognize(outputImagePath)
        .then((data: any) => {
            const cleanedText = data.text.replace(/\D/g, "");
            console.log(cleanedText);
        })
        .catch((err: Error) => {
            console.error("Error\n", err);
        })
        .finally(() => {
            process.exit()
        });

    const elapsedMs = new Date().getTime() - nowTime.getTime();
    console.info(`[APPLICATION] application took ${elapsedMs} ms`);
};

application();
