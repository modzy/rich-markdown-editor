"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const React = __importStar(require("react"));
const smooth_scroll_into_view_if_needed_1 = __importDefault(require("smooth-scroll-into-view-if-needed"));
const clsx_1 = __importDefault(require("clsx"));
require("./BlockMenuItem.scss");
function BlockMenuItem({ selected, disabled, onClick, title, shortcut, icon, containerId = "block-menu-container", }) {
    const Icon = icon;
    const ref = React.useCallback((node) => {
        if (selected && node) {
            smooth_scroll_into_view_if_needed_1.default(node, {
                scrollMode: "if-needed",
                block: "center",
                boundary: (parent) => {
                    return parent.id !== containerId;
                },
            });
        }
    }, [selected, containerId]);
    return (React.createElement(MenuItem, { selected: selected, onClick: disabled ? undefined : onClick, ref: ref },
        Icon && (React.createElement(React.Fragment, null,
            React.createElement(Icon, { color: selected
                    ? "var(--rme-blockToolbarIconSelected)"
                    : "var(--rme-blockToolbarIcon)" }),
            "\u00A0\u00A0")),
        title,
        shortcut && React.createElement(Shortcut, null, shortcut)));
}
const MenuItem = React.forwardRef(function MenuItem(props, forwardedRef) {
    const { className, disabled, selected } = props, rest = __rest(props, ["className", "disabled", "selected"]);
    return (React.createElement("button", Object.assign({ ref: forwardedRef, className: clsx_1.default("rme-blockMenuItem-menuItem", className, {
            disabled,
            selected,
        }) }, rest)));
});
function Shortcut(_a) {
    var { className } = _a, rest = __rest(_a, ["className"]);
    return (React.createElement("span", Object.assign({ className: clsx_1.default("rme-blockMenuItem-shortcut", className) }, rest)));
}
exports.default = BlockMenuItem;
//# sourceMappingURL=BlockMenuItem.js.map