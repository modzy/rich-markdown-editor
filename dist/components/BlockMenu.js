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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const prosemirror_utils_1 = require("prosemirror-utils");
const CommandMenu_1 = __importDefault(require("./CommandMenu"));
const BlockMenuItem_1 = __importDefault(require("./BlockMenuItem"));
const block_1 = __importDefault(require("../menus/block"));
class BlockMenu extends React.Component {
    constructor() {
        super(...arguments);
        this.clearSearch = () => {
            const { state, dispatch } = this.props.view;
            const parent = prosemirror_utils_1.findParentNode((node) => !!node)(state.selection);
            if (parent) {
                dispatch(state.tr.insertText("", parent.pos, state.selection.to));
            }
        };
    }
    get items() {
        return block_1.default(this.props.dictionary);
    }
    render() {
        return (React.createElement(CommandMenu_1.default, Object.assign({}, this.props, { filterable: true, onClearSearch: this.clearSearch, renderMenuItem: (item, _index, options) => {
                return (React.createElement(BlockMenuItem_1.default, { onClick: options.onClick, selected: options.selected, icon: item.icon, title: item.title, shortcut: item.shortcut }));
            }, items: this.items })));
    }
}
exports.default = BlockMenu;
//# sourceMappingURL=BlockMenu.js.map