"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BingWallpaper = void 0;
var paths_js_1 = require("../md/paths.js");
var parsers_js_1 = require("./parsers.js");
var paths_js_2 = require("../object/paths.js");
/**
 * 代表一张壁纸的纯数据模型。
 */
var BingWallpaper = /** @class */ (function () {
    function BingWallpaper(data) {
        this.title = data.title;
        this.copyright = data.copyright;
        this.year = data.startdate.slice(0, 4);
        this.month = data.startdate.slice(4, 6);
        this.day = data.startdate.slice(6, 8);
        this.date = "".concat(this.year, "-").concat(this.month, "-").concat(this.day);
        var _a = (0, parsers_js_1.parseBingWalpaperUrl)(data.url), previewUrl = _a.previewUrl, downloadUrl = _a.downloadUrl, filename = _a.filename;
        this.previewUrl = previewUrl;
        this.downloadUrl = downloadUrl;
        this.filename = filename;
        this.mdPath = (0, paths_js_1.getDailyMdPath)(this);
        this.objectPath = (0, paths_js_2.getDailyObjectPath)(this);
    }
    return BingWallpaper;
}());
exports.BingWallpaper = BingWallpaper;
