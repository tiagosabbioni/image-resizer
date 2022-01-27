const fs = require("fs");
const sharp = require("sharp");
const image_compressor = require("compress-images");

const arguments = process.argv.slice(2);

let filePath = arguments[0];
let width = parseInt(arguments[1]);
let angle;

if(arguments[2] != undefined){
    angle = Number(arguments[2]);
}else{
    angle = 0;
}

function resize(image, outputPath) {
    sharp(image)
        .resize({ width: width })
        .rotate(angle)
        .toFile(outputPath, (error) => {
            if (error) {
                console.log(error);
            } else {
                console.log("Imagem redimensionada com sucesso.");
                compress(outputPath, "./compressed/");
            }
        });
}

function compress(image, output) {
    image_compressor(image, output, { compress_force: false, statistic: true, autoupdate: true }, false,
        { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
        { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
        { svg: { engine: "svgo", command: "--multipass" } },
        { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } }, function (error, completed, statistic){
            console.log("-------------");
            console.log(error);
            console.log(completed);
            console.log(statistic);
            console.log("-------------");
            fs.unlink(image, err => {
                if(err){
                    console.log(err);
                }else{
                    console.log("Arquivo temporário apagado com sucesso.");
                }
            })
        });
}

resize(filePath, "./temp/resized_image.png");