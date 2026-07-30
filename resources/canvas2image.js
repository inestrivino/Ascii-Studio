// https://github.com/hongru/canvas2image 
/**
 * covert canvas to image
 * and save the image file
 */
const Canvas2Image = (function () {
    // check if support sth.
    const $support = (function () {
        const canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d");

        return {
            canvas: !!ctx,
            imageData: !!ctx.getImageData,
            dataURL: !!canvas.toDataURL,
            btoa: !!window.btoa,
        };
    })();

    const downloadMime = "image/octet-stream";

    function scaleCanvas(canvas, width, height) {
        const w = canvas.width,
            h = canvas.height;
        if (width === undefined) {
            width = w;
        }
        if (height === undefined) {
            height = h;
        }

        let retCanvas = document.createElement("canvas");
        let retCtx = retCanvas.getContext("2d");
        retCanvas.width = width;
        retCanvas.height = height;
        retCtx.drawImage(canvas, 0, 0, w, h, 0, 0, width, height);
        return retCanvas;
    }

    function getDataURL(canvas, type, width, height) {
        canvas = scaleCanvas(canvas, width, height);
        return canvas.toDataURL(type);
    }

    // save file to local with file name and file type
    function saveFile(strData, fileType, fileName = "name") {
        // document.location.href = strData;
        let saveLink = document.createElement("a");
        // download file name
        saveLink.download = fileName + "." + fileType;
        // download file data
        saveLink.href = strData;
        // start download
        saveLink.click();
    }

    function genImage(strData) {
        let img = document.createElement("img");
        img.src = strData;
        return img;
    }

    function fixType(type) {
        const r = type.match(/png/)[0];
        return "image/" + r;
    }

    /**
     * saveAsImage
     * @param canvas canvasElement
     * @param width {String} image type
     * @param height {Number} [optional] png width
     * @param type {string} [optional] png height
     * @param fileName {String} image name
     */
    const saveAsImage = function (canvas, width, height, type, fileName) {
        // save file type
        const fileType = type;
        if ($support.canvas && $support.dataURL) {
            if (typeof canvas == "string") {
                canvas = document.getElementById(canvas);
            }
            if (type === undefined) {
                type = "png";
            }
            type = fixType(type);
            const strData = getDataURL(canvas, type, width, height);
            // use new parameter: fileType
            saveFile(strData.replace(type, downloadMime), fileType, fileName);
        }
    };

    const convertToImage = function (canvas, width, height, type) {
        if ($support.canvas && $support.dataURL) {
            if (typeof canvas == "string") {
                canvas = document.getElementById(canvas);
            }
            if (type === undefined) {
                type = "png";
            }
            type = fixType(type);

            const strData = getDataURL(canvas, type, width, height);
            return genImage(strData);
        }
    };

    return {
        saveAsImage: saveAsImage,
        saveAsPNG: function (canvas, width, height, fileName) {
            return saveAsImage(canvas, width, height, "png", fileName);
        },

        convertToImage: convertToImage,
        convertToPNG: function (canvas, width, height) {
            return convertToImage(canvas, width, height, "png");
        }
    };
})();

export default Canvas2Image;