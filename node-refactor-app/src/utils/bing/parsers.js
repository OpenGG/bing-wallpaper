"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBingWalpaperUrl = void 0;
var constants_js_1 = require("../../constants.js");
var parseBingWalpaperUrl = function (url) {
    if (url.startsWith("/th?"))
        url = "https://bing.com".concat(url);
    var urlObj = new URL(url);
    urlObj.searchParams.set("w", "3840");
    urlObj.searchParams.set("h", "2160");
    var downloadUrl = urlObj.toString();
    urlObj.searchParams.set("w", "1024");
    urlObj.searchParams.set("h", "576");
    var previewUrl = urlObj.toString();
    var id = urlObj.searchParams.get("id");
    var filename = null;
    if (id && constants_js_1.IMAGE_FILENAME_REGEX.test(id)) {
        filename = id;
    }
    return { previewUrl: previewUrl, downloadUrl: downloadUrl, filename: filename };
};
exports.parseBingWalpaperUrl = parseBingWalpaperUrl;
