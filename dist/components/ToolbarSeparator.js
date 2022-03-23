"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const classnames_1 = __importDefault(require("classnames"));
require("./ToolbarSeparator.scss");
function Separator({ className, rest }) {
    return React.createElement("div", Object.assign({ className: classnames_1.default("rme-ToolbarSeparator", className) }, rest));
}
exports.default = Separator;
//# sourceMappingURL=ToolbarSeparator.js.map