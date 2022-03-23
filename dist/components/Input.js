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
const react_1 = require("react");
const classnames_1 = __importDefault(require("classnames"));
require("./Input.scss");
const Input = react_1.forwardRef(function Input(props, forwardedRef) {
    const { className } = props, rest = __rest(props, ["className"]);
    return (React.createElement("input", Object.assign({ ref: forwardedRef, className: classnames_1.default("rme-Input", className) }, rest)));
});
exports.default = Input;
//# sourceMappingURL=Input.js.map