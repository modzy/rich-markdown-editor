"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const outline_icons_1 = require("outline-icons");
const prosemirror_state_1 = require("prosemirror-state");
const prosemirror_inputrules_1 = require("prosemirror-inputrules");
const react_medium_image_zoom_1 = __importDefault(require("react-medium-image-zoom"));
const getDataTransferFiles_1 = __importDefault(require("../lib/getDataTransferFiles"));
const uploadPlaceholder_1 = __importDefault(require("../lib/uploadPlaceholder"));
const insertFiles_1 = __importDefault(require("../commands/insertFiles"));
const Node_1 = __importDefault(require("./Node"));
const clsx_1 = __importDefault(require("clsx"));
const IMAGE_INPUT_REGEX = /!\[(?<alt>[^\]\[]*?)]\((?<filename>[^\]\[]*?)(?=\“|\))\“?(?<layoutclass>[^\]\[\”]+)?\”?\)$/;
const uploadPlugin = (options) => new prosemirror_state_1.Plugin({
    props: {
        handleDOMEvents: {
            paste(view, event) {
                if ((view.props.editable && !view.props.editable(view.state)) ||
                    !options.uploadImage) {
                    return false;
                }
                if (!event.clipboardData)
                    return false;
                const files = Array.prototype.slice
                    .call(event.clipboardData.items)
                    .map((dt) => dt.getAsFile())
                    .filter((file) => file);
                if (files.length === 0)
                    return false;
                const { tr } = view.state;
                if (!tr.selection.empty) {
                    tr.deleteSelection();
                }
                const pos = tr.selection.from;
                insertFiles_1.default(view, event, pos, files, options);
                return true;
            },
            drop(view, event) {
                if ((view.props.editable && !view.props.editable(view.state)) ||
                    !options.uploadImage) {
                    return false;
                }
                const files = getDataTransferFiles_1.default(event).filter((file) => /image/i.test(file.type));
                if (files.length === 0) {
                    return false;
                }
                const result = view.posAtCoords({
                    left: event.clientX,
                    top: event.clientY,
                });
                if (result) {
                    insertFiles_1.default(view, event, result.pos, files, options);
                    return true;
                }
                return false;
            },
        },
    },
});
const IMAGE_CLASSES = ["right-50", "left-50"];
const getLayoutAndTitle = (tokenTitle) => {
    if (!tokenTitle)
        return {};
    if (IMAGE_CLASSES.includes(tokenTitle)) {
        return {
            layoutClass: tokenTitle,
        };
    }
    else {
        return {
            title: tokenTitle,
        };
    }
};
const downloadImageNode = async (node) => {
    const image = await fetch(node.attrs.src);
    const imageBlob = await image.blob();
    const imageURL = URL.createObjectURL(imageBlob);
    const extension = imageBlob.type.split("/")[1];
    const potentialName = node.attrs.alt || "image";
    const link = document.createElement("a");
    link.href = imageURL;
    link.download = `${potentialName}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
class Image extends Node_1.default {
    constructor() {
        super(...arguments);
        this.handleKeyDown = ({ node, getPos }) => (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                const { view } = this.editor;
                const $pos = view.state.doc.resolve(getPos() + node.nodeSize);
                view.dispatch(view.state.tr.setSelection(new prosemirror_state_1.TextSelection($pos)).split($pos.pos));
                view.focus();
                return;
            }
            if (event.key === "Backspace" && event.target.innerText === "") {
                const { view } = this.editor;
                const $pos = view.state.doc.resolve(getPos());
                const tr = view.state.tr.setSelection(new prosemirror_state_1.NodeSelection($pos));
                view.dispatch(tr.deleteSelection());
                view.focus();
                return;
            }
        };
        this.handleBlur = ({ node, getPos }) => (event) => {
            const alt = event.target.innerText;
            const { src, title, layoutClass } = node.attrs;
            if (alt === node.attrs.alt)
                return;
            const { view } = this.editor;
            const { tr } = view.state;
            const pos = getPos();
            const transaction = tr.setNodeMarkup(pos, undefined, {
                src,
                alt,
                title,
                layoutClass,
            });
            view.dispatch(transaction);
        };
        this.handleSelect = ({ getPos }) => (event) => {
            event.preventDefault();
            const { view } = this.editor;
            const $pos = view.state.doc.resolve(getPos());
            const transaction = view.state.tr.setSelection(new prosemirror_state_1.NodeSelection($pos));
            view.dispatch(transaction);
        };
        this.handleDownload = ({ node }) => (event) => {
            event.preventDefault();
            event.stopPropagation();
            downloadImageNode(node);
        };
        this.component = (props) => {
            const { theme, isSelected } = props;
            const { alt, src, title, layoutClass } = props.node.attrs;
            const className = layoutClass ? `image image-${layoutClass}` : "image";
            return (React.createElement("div", { contentEditable: false, className: className },
                React.createElement("span", { className: clsx_1.default("rme-Image-ImageWrapper", {
                        "ProseMirror-selectednode": isSelected,
                    }), onClick: this.handleSelect(props) },
                    React.createElement("button", { className: "rme-Image-Button" },
                        React.createElement(outline_icons_1.DownloadIcon, { color: "currentColor", onClick: this.handleDownload(props) })),
                    React.createElement(react_medium_image_zoom_1.default, { image: {
                            src,
                            alt,
                            title,
                        }, defaultStyles: {
                            overlay: {
                                backgroundColor: theme.background,
                            },
                        }, shouldRespectMaxDimension: true })),
                React.createElement("p", { onKeyDown: this.handleKeyDown(props), onBlur: this.handleBlur(props), className: "rme-Image-Caption caption", tabIndex: -1, role: "textbox", contentEditable: true, suppressContentEditableWarning: true, "data-caption": this.options.dictionary.imageCaptionPlaceholder }, alt)));
        };
    }
    get name() {
        return "image";
    }
    get schema() {
        return {
            inline: true,
            attrs: {
                src: {},
                alt: {
                    default: null,
                },
                layoutClass: {
                    default: null,
                },
                title: {
                    default: null,
                },
            },
            content: "text*",
            marks: "",
            group: "inline",
            selectable: true,
            draggable: true,
            parseDOM: [
                {
                    tag: "div[class~=image]",
                    getAttrs: (dom) => {
                        const img = dom.getElementsByTagName("img")[0];
                        const className = dom.className;
                        const layoutClassMatched = className && className.match(/image-(.*)$/);
                        const layoutClass = layoutClassMatched
                            ? layoutClassMatched[1]
                            : null;
                        return {
                            src: img === null || img === void 0 ? void 0 : img.getAttribute("src"),
                            alt: img === null || img === void 0 ? void 0 : img.getAttribute("alt"),
                            title: img === null || img === void 0 ? void 0 : img.getAttribute("title"),
                            layoutClass: layoutClass,
                        };
                    },
                },
                {
                    tag: "img",
                    getAttrs: (dom) => {
                        return {
                            src: dom.getAttribute("src"),
                            alt: dom.getAttribute("alt"),
                            title: dom.getAttribute("title"),
                        };
                    },
                },
            ],
            toDOM: (node) => {
                const className = node.attrs.layoutClass
                    ? `image image-${node.attrs.layoutClass}`
                    : "image";
                return [
                    "div",
                    {
                        class: className,
                    },
                    ["img", Object.assign(Object.assign({}, node.attrs), { contentEditable: false })],
                    ["p", { class: "caption" }, 0],
                ];
            },
        };
    }
    toMarkdown(state, node) {
        let markdown = " ![" +
            state.esc((node.attrs.alt || "").replace("\n", "") || "") +
            "](" +
            state.esc(node.attrs.src);
        if (node.attrs.layoutClass) {
            markdown += ' "' + state.esc(node.attrs.layoutClass) + '"';
        }
        else if (node.attrs.title) {
            markdown += ' "' + state.esc(node.attrs.title) + '"';
        }
        markdown += ")";
        state.write(markdown);
    }
    parseMarkdown() {
        return {
            node: "image",
            getAttrs: (token) => {
                return Object.assign({ src: token.attrGet("src"), alt: (token.children[0] && token.children[0].content) || null }, getLayoutAndTitle(token.attrGet("title")));
            },
        };
    }
    commands({ type }) {
        return {
            downloadImage: () => async (state) => {
                const { node } = state.selection;
                if (node.type.name !== "image") {
                    return false;
                }
                downloadImageNode(node);
                return true;
            },
            deleteImage: () => (state, dispatch) => {
                dispatch(state.tr.deleteSelection());
                return true;
            },
            alignRight: () => (state, dispatch) => {
                const attrs = Object.assign(Object.assign({}, state.selection.node.attrs), { title: null, layoutClass: "right-50" });
                const { selection } = state;
                dispatch(state.tr.setNodeMarkup(selection.from, undefined, attrs));
                return true;
            },
            alignLeft: () => (state, dispatch) => {
                const attrs = Object.assign(Object.assign({}, state.selection.node.attrs), { title: null, layoutClass: "left-50" });
                const { selection } = state;
                dispatch(state.tr.setNodeMarkup(selection.from, undefined, attrs));
                return true;
            },
            alignCenter: () => (state, dispatch) => {
                const attrs = Object.assign(Object.assign({}, state.selection.node.attrs), { layoutClass: null });
                const { selection } = state;
                dispatch(state.tr.setNodeMarkup(selection.from, undefined, attrs));
                return true;
            },
            createImage: (attrs) => (state, dispatch) => {
                const { selection } = state;
                const position = selection.$cursor
                    ? selection.$cursor.pos
                    : selection.$to.pos;
                const node = type.create(attrs);
                const transaction = state.tr.insert(position, node);
                dispatch(transaction);
                return true;
            },
        };
    }
    inputRules({ type }) {
        return [
            new prosemirror_inputrules_1.InputRule(IMAGE_INPUT_REGEX, (state, match, start, end) => {
                const [okay, alt, src, matchedTitle] = match;
                const { tr } = state;
                if (okay) {
                    tr.replaceWith(start - 1, end, type.create(Object.assign({ src,
                        alt }, getLayoutAndTitle(matchedTitle))));
                }
                return tr;
            }),
        ];
    }
    get plugins() {
        return [uploadPlaceholder_1.default, uploadPlugin(this.options)];
    }
}
exports.default = Image;
//# sourceMappingURL=Image.js.map