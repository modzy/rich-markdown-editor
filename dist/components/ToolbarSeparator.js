"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clsx_1 = __importDefault(require("clsx"));
require("./ToolbarSeparator.scss");
function Separator({ className, rest }) {
    return React.createElement("div", Object.assign({ className: clsx_1.default("rme-ToolbarSeparator", className) }, rest));
}
exports.default = Separator;
//# sourceMappingURL=ToolbarSeparator.js.map