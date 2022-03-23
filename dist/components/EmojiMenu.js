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
const gemoji_1 = __importDefault(require("gemoji"));
const fuzzy_search_1 = __importDefault(require("fuzzy-search"));
const CommandMenu_1 = __importDefault(require("./CommandMenu"));
const EmojiMenuItem_1 = __importDefault(require("./EmojiMenuItem"));
const searcher = new fuzzy_search_1.default(gemoji_1.default, ["names"], {
    caseSensitive: true,
    sort: true,
});
class EmojiMenu extends React.Component {
    constructor() {
        super(...arguments);
        this.clearSearch = () => {
            var _a;
            const { state, dispatch } = this.props.view;
            dispatch(state.tr.insertText("", state.selection.$from.pos - ((_a = this.props.search) !== null && _a !== void 0 ? _a : "").length - 1, state.selection.to));
        };
    }
    get items() {
        const { search = "" } = this.props;
        const n = search.toLowerCase();
        const result = searcher.search(n).map((item) => {
            const description = item.description;
            const name = item.names[0];
            return Object.assign(Object.assign({}, item), { name: "emoji", title: name, description, attrs: { markup: name, "data-name": name } });
        });
        return result.slice(0, 10);
    }
    render() {
        return (React.createElement(CommandMenu_1.default, Object.assign({}, this.props, { id: "emoji-menu-container", filterable: false, onClearSearch: this.clearSearch, renderMenuItem: (item, _index, options) => {
                return (React.createElement(EmojiMenuItem_1.default, { onClick: options.onClick, selected: options.selected, title: item.description, emoji: item.emoji, containerId: "emoji-menu-container" }));
            }, items: this.items })));
    }
}
exports.default = EmojiMenu;
//# sourceMappingURL=EmojiMenu.js.map