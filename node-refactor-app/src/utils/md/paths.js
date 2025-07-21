"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthDirPath = exports.getMonthMdPath = exports.getMonthMdPathByWallpaper = exports.getDailyMdPath = void 0;
var constants_js_1 = require("../../constants.js");
var path_1 = require("path");
var getDailyMdPath = function (wp) {
    return (0, path_1.join)(constants_js_1.ARCHIVE_DIR, wp.year, wp.month, "".concat(wp.date, ".md"));
};
exports.getDailyMdPath = getDailyMdPath;
var getMonthMdPathByWallpaper = function (wp) {
    return (0, exports.getMonthMdPath)(wp.year, wp.month);
};
exports.getMonthMdPathByWallpaper = getMonthMdPathByWallpaper;
var getMonthMdPath = function (year, month) {
    return (0, path_1.join)(constants_js_1.ARCHIVE_DIR, year, "".concat(month, ".md"));
};
exports.getMonthMdPath = getMonthMdPath;
var getMonthDirPath = function (year, month) {
    return (0, path_1.join)(constants_js_1.WALLPAPERS_DIR, year, month);
};
exports.getMonthDirPath = getMonthDirPath;
