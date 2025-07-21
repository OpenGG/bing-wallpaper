"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDailyObjectPath = void 0;
var path_1 = require("path");
var getDailyObjectPath = function (wp) {
    return (0, path_1.join)(wp.year, wp.month, wp.day, wp.filename || "".concat(wp.date, ".jpg"));
};
exports.getDailyObjectPath = getDailyObjectPath;
