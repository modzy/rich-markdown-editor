"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StyledEditor = void 0;
const react_1 = require("react");
const clsx_1 = __importDefault(require("clsx"));
require("./editor.scss");
exports.StyledEditor = react_1.forwardRef(function StyledEditor(props, forwardedRef) {
    const { readOnly, readOnlyWriteCheckboxes, rtl, className } = props, rest = __rest(props, ["readOnly", "readOnlyWriteCheckboxes", "rtl", "className"]);
    return (React.createElement("div", Object.assign({ ref: forwardedRef }, rest, { className: clsx_1.default("rme-StyledEditor", {
            readOnly,
            readOnlyWriteCheckboxes,
        }) })));
});
//# sourceMappingURL=editor.js.map