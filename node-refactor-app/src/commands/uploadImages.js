"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadImagesCommand = void 0;
var constants_ts_1 = require("/constants.ts");
var TempService_ts_1 = require("/services/temp/TempService.ts");
var retry_ts_1 = require("/utils/retry.ts");
var IndexService_ts_1 = require("/services/indexes/IndexService.ts");
var ObjectService_ts_1 = require("/services/object/ObjectService.ts");
var DownloadService_ts_1 = require("/services/download/DownloadService.ts");
var ImageService_ts_1 = require("/services/image/ImageService.ts");
var di_ts_1 = require("/utils/di.ts");
var UploadImagesCommand = function () {
    var _a;
    var _indexService_decorators;
    var _indexService_initializers = [];
    var _indexService_extraInitializers = [];
    var _objectService_decorators;
    var _objectService_initializers = [];
    var _objectService_extraInitializers = [];
    var _tempService_decorators;
    var _tempService_initializers = [];
    var _tempService_extraInitializers = [];
    var _downloadService_decorators;
    var _downloadService_initializers = [];
    var _downloadService_extraInitializers = [];
    var _imageService_decorators;
    var _imageService_initializers = [];
    var _imageService_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UploadImagesCommand() {
                this.indexService = __runInitializers(this, _indexService_initializers, void 0);
                this.objectService = (__runInitializers(this, _indexService_extraInitializers), __runInitializers(this, _objectService_initializers, void 0));
                this.tempService = (__runInitializers(this, _objectService_extraInitializers), __runInitializers(this, _tempService_initializers, void 0));
                this.downloadService = (__runInitializers(this, _tempService_extraInitializers), __runInitializers(this, _downloadService_initializers, void 0));
                this.imageService = (__runInitializers(this, _downloadService_extraInitializers), __runInitializers(this, _imageService_initializers, void 0));
                __runInitializers(this, _imageService_extraInitializers);
            }
            /**
             * 增量式地上传新的壁纸图片到 R2 云存储。
             * 这段代码是 uploadImage.sh 脚本的 Deno/TypeScript 实现。
             */
            UploadImagesCommand.prototype.execute = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var indexes, cursor, lastSuccessfulCursor, _loop_1, this_1, _i, indexes_1, index, error_1;
                    var _this = this;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, this.indexService.loadIndexes()];
                            case 1:
                                indexes = _b.sent();
                                return [4 /*yield*/, this._getCursorFromR2()];
                            case 2:
                                cursor = _b.sent();
                                console.log("Starting upload process. Current cursor: ".concat(cursor));
                                lastSuccessfulCursor = cursor;
                                _b.label = 3;
                            case 3:
                                _b.trys.push([3, 8, 9, 13]);
                                _loop_1 = function (index) {
                                    var date, url, error_2;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0:
                                                date = index.date, url = index.url;
                                                if (!(date > cursor)) return [3 /*break*/, 4];
                                                console.log("Dealing with new wallpaper: ".concat(date));
                                                _c.label = 1;
                                            case 1:
                                                _c.trys.push([1, 3, , 4]);
                                                return [4 /*yield*/, this_1.tempService.withTempFile(function (tempFilePath) { return __awaiter(_this, void 0, void 0, function () {
                                                        var targetPath;
                                                        var _this = this;
                                                        return __generator(this, function (_b) {
                                                            switch (_b.label) {
                                                                case 0:
                                                                    // 5. 下载
                                                                    console.log("  Downloading from ".concat(url));
                                                                    return [4 /*yield*/, (0, retry_ts_1.retry)(function () { return __awaiter(_this, void 0, void 0, function () {
                                                                            return __generator(this, function (_b) {
                                                                                switch (_b.label) {
                                                                                    case 0: return [4 /*yield*/, this.downloadService.downloadFile(url, tempFilePath)];
                                                                                    case 1:
                                                                                        _b.sent();
                                                                                        return [2 /*return*/];
                                                                                }
                                                                            });
                                                                        }); })];
                                                                case 1:
                                                                    _b.sent();
                                                                    // 6. 校验
                                                                    console.log("  Validating image: ".concat(tempFilePath));
                                                                    return [4 /*yield*/, this.imageService.validateImage(tempFilePath)];
                                                                case 2:
                                                                    if (!(_b.sent())) {
                                                                        throw new Error("Corrupt image detected");
                                                                    }
                                                                    targetPath = index.objectPath;
                                                                    // 7. 上传
                                                                    console.log("  Image valid. Uploading to R2: ".concat(constants_ts_1.BUCKET, "/").concat(targetPath));
                                                                    return [4 /*yield*/, this.objectService.putObjectWithFile({
                                                                            bucket: constants_ts_1.BUCKET,
                                                                            path: targetPath,
                                                                            filePath: tempFilePath,
                                                                        })];
                                                                case 3:
                                                                    _b.sent();
                                                                    return [2 /*return*/];
                                                            }
                                                        });
                                                    }); })];
                                            case 2:
                                                _c.sent();
                                                // 8. 更新光标
                                                lastSuccessfulCursor = date;
                                                console.log("  Successfully processed. New cursor position: ".concat(lastSuccessfulCursor));
                                                return [3 /*break*/, 4];
                                            case 3:
                                                error_2 = _c.sent();
                                                console.error("Failed to process ".concat(date, ":"), error_2);
                                                throw error_2; // 中断整个循环
                                            case 4: return [2 /*return*/];
                                        }
                                    });
                                };
                                this_1 = this;
                                _i = 0, indexes_1 = indexes;
                                _b.label = 4;
                            case 4:
                                if (!(_i < indexes_1.length)) return [3 /*break*/, 7];
                                index = indexes_1[_i];
                                return [5 /*yield**/, _loop_1(index)];
                            case 5:
                                _b.sent();
                                _b.label = 6;
                            case 6:
                                _i++;
                                return [3 /*break*/, 4];
                            case 7: return [3 /*break*/, 13];
                            case 8:
                                error_1 = _b.sent();
                                console.error("An error occurred during the upload process. The process will stop.", error_1);
                                return [3 /*break*/, 13];
                            case 9:
                                if (!(lastSuccessfulCursor > cursor)) return [3 /*break*/, 11];
                                console.log("Saving final cursor to R2: ".concat(lastSuccessfulCursor));
                                return [4 /*yield*/, this.objectService.putObject({
                                        bucket: constants_ts_1.BUCKET,
                                        path: constants_ts_1.CURSOR_PATH,
                                        data: lastSuccessfulCursor,
                                    })];
                            case 10:
                                _b.sent();
                                return [3 /*break*/, 12];
                            case 11:
                                console.log("No new wallpapers were uploaded. Cursor remains unchanged.");
                                _b.label = 12;
                            case 12:
                                console.log("Upload process finished.");
                                return [7 /*endfinally*/];
                            case 13: return [2 /*return*/];
                        }
                    });
                });
            };
            UploadImagesCommand.prototype._getCursorFromR2 = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var cursor, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _c.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, this.objectService.getObjectAsText({
                                        bucket: constants_ts_1.BUCKET,
                                        path: constants_ts_1.CURSOR_PATH,
                                    })];
                            case 1:
                                cursor = _c.sent();
                                return [2 /*return*/, cursor.trim()];
                            case 2:
                                _b = _c.sent();
                                // 任何错误（命令失败、文件读不到等）都视为光标不存在
                                console.log("Cursor not found on R2. Starting from scratch.");
                                return [2 /*return*/, "1970/01/01"];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            };
            return UploadImagesCommand;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _indexService_decorators = [(0, di_ts_1.Inject)(IndexService_ts_1.IndexService)];
            _objectService_decorators = [(0, di_ts_1.Inject)(ObjectService_ts_1.ObjectService)];
            _tempService_decorators = [(0, di_ts_1.Inject)(TempService_ts_1.TempService)];
            _downloadService_decorators = [(0, di_ts_1.Inject)(DownloadService_ts_1.DownloadService)];
            _imageService_decorators = [(0, di_ts_1.Inject)(ImageService_ts_1.ImageService)];
            __esDecorate(null, null, _indexService_decorators, { kind: "field", name: "indexService", static: false, private: false, access: { has: function (obj) { return "indexService" in obj; }, get: function (obj) { return obj.indexService; }, set: function (obj, value) { obj.indexService = value; } }, metadata: _metadata }, _indexService_initializers, _indexService_extraInitializers);
            __esDecorate(null, null, _objectService_decorators, { kind: "field", name: "objectService", static: false, private: false, access: { has: function (obj) { return "objectService" in obj; }, get: function (obj) { return obj.objectService; }, set: function (obj, value) { obj.objectService = value; } }, metadata: _metadata }, _objectService_initializers, _objectService_extraInitializers);
            __esDecorate(null, null, _tempService_decorators, { kind: "field", name: "tempService", static: false, private: false, access: { has: function (obj) { return "tempService" in obj; }, get: function (obj) { return obj.tempService; }, set: function (obj, value) { obj.tempService = value; } }, metadata: _metadata }, _tempService_initializers, _tempService_extraInitializers);
            __esDecorate(null, null, _downloadService_decorators, { kind: "field", name: "downloadService", static: false, private: false, access: { has: function (obj) { return "downloadService" in obj; }, get: function (obj) { return obj.downloadService; }, set: function (obj, value) { obj.downloadService = value; } }, metadata: _metadata }, _downloadService_initializers, _downloadService_extraInitializers);
            __esDecorate(null, null, _imageService_decorators, { kind: "field", name: "imageService", static: false, private: false, access: { has: function (obj) { return "imageService" in obj; }, get: function (obj) { return obj.imageService; }, set: function (obj, value) { obj.imageService = value; } }, metadata: _metadata }, _imageService_initializers, _imageService_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UploadImagesCommand = UploadImagesCommand;
