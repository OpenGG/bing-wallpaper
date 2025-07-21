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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
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
exports.IndexService = void 0;
var di_js_1 = require("../../utils/di.js");
var constants_js_1 = require("../../constants.js");
var BingWallpaperIndex_js_1 = require("../../utils/bing/BingWallpaperIndex.js");
var enCollator = new Intl.Collator("en");
var formatLine = function (index) {
    return "".concat(index.mdPath, " ").concat(index.url);
};
var IndexService = function () {
    var _classDecorators = [(0, di_js_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _fs_decorators;
    var _fs_initializers = [];
    var _fs_extraInitializers = [];
    var IndexService = _classThis = /** @class */ (function () {
        function IndexService_1() {
            this.fs = __runInitializers(this, _fs_initializers, void 0);
            this.indexesMap = (__runInitializers(this, _fs_extraInitializers), new Map());
            this.indexKeys = [];
            this.indexValues = [];
        }
        IndexService_1.prototype.loadIndexes = function () {
            return __awaiter(this, void 0, void 0, function () {
                var content;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.fs.readTextFile(constants_js_1.ALL_WALLPAPERS_PATH)];
                        case 1:
                            content = _a.sent();
                            content.split("\n").filter(Boolean)
                                .filter(function (line) { return line; })
                                .forEach(function (line) {
                                try {
                                    var index = BingWallpaperIndex_js_1.BingWallpaperIndex.fromIndexLine(line);
                                    if (index) {
                                        _this.indexesMap.set(index.date, index);
                                    }
                                }
                                catch (e) {
                                    console.warn("Index error", e);
                                    // ignore
                                }
                            });
                            this.updateIndexes();
                            return [2 /*return*/, this.indexValues];
                    }
                });
            });
        };
        IndexService_1.prototype.updateIndexes = function () {
            var _this = this;
            this.indexKeys = __spreadArray([], this.indexesMap.keys(), true).sort(enCollator.compare)
                .reverse();
            this.indexValues = this.indexKeys.map(function (k) {
                return _this.indexesMap.get(k);
            });
        };
        IndexService_1.prototype.addIndexes = function (indexes) {
            var _this = this;
            var addCount = 0;
            indexes.forEach(function (index) {
                var _a;
                if (_this.indexesMap.has(index.date) &&
                    ((_a = _this.indexesMap.get(index.date)) === null || _a === void 0 ? void 0 : _a.url) === index.url) {
                    return;
                }
                addCount += 1;
                _this.indexesMap.set(index.date, index);
            });
            if (addCount > 0) {
                this.updateIndexes();
            }
            return addCount;
        };
        IndexService_1.prototype.addWallpapers = function (wallpapers) {
            var indexes = wallpapers.map(function (wp) {
                return BingWallpaperIndex_js_1.BingWallpaperIndex.fromBingWallpaper(wp);
            });
            return this.addIndexes(indexes);
        };
        IndexService_1.prototype.getContent = function () {
            return this.indexValues.map(formatLine).join("\n");
        };
        IndexService_1.prototype.save = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.fs.writeTextFile(constants_js_1.ALL_WALLPAPERS_PATH, this.getContent())];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return IndexService_1;
    }());
    __setFunctionName(_classThis, "IndexService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _fs_decorators = [(0, di_js_1.Inject)("FileService")];
        __esDecorate(null, null, _fs_decorators, { kind: "field", name: "fs", static: false, private: false, access: { has: function (obj) { return "fs" in obj; }, get: function (obj) { return obj.fs; }, set: function (obj, value) { obj.fs = value; } }, metadata: _metadata }, _fs_initializers, _fs_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        IndexService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return IndexService = _classThis;
}();
exports.IndexService = IndexService;
