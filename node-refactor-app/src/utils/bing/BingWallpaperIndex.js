"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BingWallpaperIndex = void 0;
var paths_js_1 = require("../md/paths.js");
var paths_js_2 = require("../object/paths.js");
var parsers_js_1 = require("./parsers.js");
var parseMdPath = function (mdPath) {
    var matches = mdPath.match(/^(\d+)\/(\d+)\/(\d+)\.md$/);
    if (!matches) {
        throw new Error("Invalid mdPath");
    }
    var _a = mdPath.split("/").filter(function (a) { return a; }), year = _a[0], month = _a[1], day = _a[2];
    return {
        year: year,
        month: month,
        day: day,
        date: "".concat(year, "/").concat(month, "/").concat(day),
    };
};
var BingWallpaperIndex = /** @class */ (function () {
    function BingWallpaperIndex(args) {
        this.date = args.date;
        this.year = args.year;
        this.month = args.month;
        this.day = args.day;
        this.mdPath = args.mdPath;
        this.objectPath = args.objectPath;
        this.url = args.url;
        this.filename = args.filename;
    }
    BingWallpaperIndex.fromBingWallpaper = function (wp) {
        return new BingWallpaperIndex({
            year: wp.year,
            month: wp.month,
            day: wp.day,
            date: wp.date,
            mdPath: (0, paths_js_1.getDailyMdPath)(wp),
            objectPath: wp.objectPath,
            url: wp.downloadUrl,
            filename: wp.filename,
        });
    };
    BingWallpaperIndex.fromIndexLine = function (content) {
        var line = content.trim();
        var parts = line.split(" ");
        if (parts.length !== 2) {
            return null;
        }
        var _a = line.split(" "), mdPath = _a[0], url = _a[1];
        var dateProps = parseMdPath(mdPath);
        var filename = (0, parsers_js_1.parseBingWalpaperUrl)(url).filename;
        return new BingWallpaperIndex(__assign(__assign({}, dateProps), { mdPath: mdPath, objectPath: (0, paths_js_2.getDailyObjectPath)(__assign(__assign({}, dateProps), { filename: filename })), url: url, filename: filename }));
    };
    return BingWallpaperIndex;
}());
exports.BingWallpaperIndex = BingWallpaperIndex;
