"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatArchiveLinksInReadme = exports.formatMonth = exports.formatLatestWallpapersInReadme = exports.formatMonthlyMarkdown = exports.formatDailyMarkdown = void 0;
var formatDailyMarkdown = function (wallpaper) {
    return "## ".concat(wallpaper.title, "\n\n").concat(wallpaper.copyright, "\n\n![").concat(wallpaper.title, "](").concat(wallpaper.previewUrl, ")\n\nDate: ").concat(wallpaper.date, "\n\nDownload 4k: [").concat(wallpaper.title, "](").concat(wallpaper.downloadUrl, ")\n");
};
exports.formatDailyMarkdown = formatDailyMarkdown;
var formatMonthlyMarkdown = function (year, month, contents) {
    return "# ".concat(year, "-").concat(month, "\n\n").concat(contents.join("\n\n"), "\n");
};
exports.formatMonthlyMarkdown = formatMonthlyMarkdown;
var formatLatestWallpapersInReadme = function (markdowns) {
    return "\n".concat(markdowns.map(function (md) { return md.trim(); }).join("\n\n---\n\n"), "\n");
};
exports.formatLatestWallpapersInReadme = formatLatestWallpapersInReadme;
var formatMonth = function (year, month) { return "".concat(year, "-").concat(month); };
exports.formatMonth = formatMonth;
var formatArchiveLinksInReadme = function (linksMap) { return "\n\n".concat(__spreadArray([], linksMap.entries(), true).map(function (_a) {
    var name = _a[0], mdPath = _a[1];
    return "[".concat(name, "](").concat(mdPath, ")");
}).join("\n\n---\n\n"), ";\n\n"); };
exports.formatArchiveLinksInReadme = formatArchiveLinksInReadme;
