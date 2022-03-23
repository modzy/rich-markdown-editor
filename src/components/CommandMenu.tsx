// @ts-nocheck

import * as React from "react";
import cx from "classnames";
import capitalize from "lodash/capitalize";
import { Portal } from "react-portal";
import { EditorView } from "prosemirror-view";
import { findDomRefAtPos, findParentNode } from "prosemirror-utils";
import { EmbedDescriptor, MenuItem, ToastType } from "../types";
import Input from "./Input";
import VisuallyHidden from "./VisuallyHidden";
import getDataTransferFiles from "../lib/getDataTransferFiles";
import filterExcessSeparators from "../lib/filterExcessSeparators";
import insertFiles from "../commands/insertFiles";
import baseDictionary from "../dictionary";

import "./CommandMenu.scss";

const SSR = typeof window === "undefined";

const defaultPosition = {
  left: -1000,
  top: 0,
  bottom: undefined,
  isAbove: false,
};

export type Props<T extends MenuItem = MenuItem> = {
  rtl: boolean;
  isActive: boolean;
  commands: Record<string, any>;
  dictionary: typeof baseDictionary;
  view: EditorView;
  search: string;
  uploadImage?: (file: File) => Promise<string>;
  onImageUploadStart?: () => void;
  onImageUploadStop?: () => void;
  onShowToast?: (message: string, id: string) => void;
  onLinkToolbarOpen?: () => void;
  onClose: () => void;
  onClearSearch: () => void;
  embeds?: EmbedDescriptor[];
  renderMenuItem: (
    item: T,
    index: number,
    options: {
      selected: boolean;
      onClick: () => void;
    }
  ) => React.ReactNode;
  filterable?: boolean;
  items: T[];
  id?: string;
};

type State = {
  insertItem?: EmbedDescriptor;
  left?: number;
  top?: number;
  bottom?: number;
  isAbove: boolean;
  selectedIndex: number;
};

class CommandMenu<T = MenuItem> extends React.Component<Props<T>, State> {
  menuRef = React.createRef<HTMLDivElement>();
  inputRef = React.createRef<HTMLInputElement>();

  state: State = {
    left: -1000,
    top: 0,
    bottom: undefined,
    isAbove: false,
    selectedIndex: 0,
    insertItem: undefined,
  };

  componentDidMount() {
    if (!SSR) {
      window.addEventListener("keydown", this.handleKeyDown);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.search !== this.props.search ||
      nextProps.isActive !== this.props.isActive ||
      nextState !== this.state
    );
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isActive && this.props.isActive) {
      const position = this.calculatePosition(this.props);

      this.setState({
        insertItem: undefined,
        selectedIndex: 0,
        ...position,
      });
    } else if (prevProps.search !== this.props.search) {
      this.setState({ selectedIndex: 0 });
    }
  }

  componentWillUnmount() {
    if (!SSR) {
      window.removeEventListener("keydown", this.handleKeyDown);
    }
  }

  handleKeyDown = (event: KeyboardEvent) => {
    if (!this.props.isActive) return;

    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();

      const item = this.filtered[this.state.selectedIndex];

      if (item) {
        this.insertItem(item);
      } else {
        this.props.onClose();
      }
    }

    if (
      event.key === "ArrowUp" ||
      (event.key === "Tab" && event.shiftKey) ||
      (event.ctrlKey && event.key === "p")
    ) {
      event.preventDefault();
      event.stopPropagation();

      if (this.filtered.length) {
        const prevIndex = this.state.selectedIndex - 1;
        const prev = this.filtered[prevIndex];

        this.setState({
          selectedIndex: Math.max(
            0,
            prev && prev.name === "separator" ? prevIndex - 1 : prevIndex
          ),
        });
      } else {
        this.close();
      }
    }

    if (
      event.key === "ArrowDown" ||
      (event.key === "Tab" && !event.shiftKey) ||
      (event.ctrlKey && event.key === "n")
    ) {
      event.preventDefault();
      event.stopPropagation();

      if (this.filtered.length) {
        const total = this.filtered.length - 1;
        const nextIndex = this.state.selectedIndex + 1;
        const next = this.filtered[nextIndex];

        this.setState({
          selectedIndex: Math.min(
            next && next.name === "separator" ? nextIndex + 1 : nextIndex,
            total
          ),
        });
      } else {
        this.close();
      }
    }

    if (event.key === "Escape") {
      this.close();
    }
  };

  insertItem = (item) => {
    switch (item.name) {
      case "image":
        return this.triggerImagePick();
      case "embed":
        return this.triggerLinkInput(item);
      case "link": {
        this.clearSearch();
        this.props.onClose();
        this.props.onLinkToolbarOpen?.();
        return;
      }
      default:
        this.insertBlock(item);
    }
  };

  close = () => {
    this.props.onClose();
    this.props.view.focus();
  };

  handleLinkInputKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!this.props.isActive) return;
    if (!this.state.insertItem) return;

    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();

      const href = event.currentTarget.value;
      const matches = this.state.insertItem.matcher(href);

      if (!matches && this.props.onShowToast) {
        this.props.onShowToast(
          this.props.dictionary.embedInvalidLink,
          ToastType.Error
        );
        return;
      }

      this.insertBlock({
        name: "embed",
        attrs: {
          href,
        },
      });
    }

    if (event.key === "Escape") {
      this.props.onClose();
      this.props.view.focus();
    }
  };

  handleLinkInputPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    if (!this.props.isActive) return;
    if (!this.state.insertItem) return;

    const href = event.clipboardData.getData("text/plain");
    const matches = this.state.insertItem.matcher(href);

    if (matches) {
      event.preventDefault();
      event.stopPropagation();

      this.insertBlock({
        name: "embed",
        attrs: {
          href,
        },
      });
    }
  };

  triggerImagePick = () => {
    if (this.inputRef.current) {
      this.inputRef.current.click();
    }
  };

  triggerLinkInput = (item) => {
    this.setState({ insertItem: item });
  };

  handleImagePicked = (event) => {
    const files = getDataTransferFiles(event);

    const {
      view,
      uploadImage,
      onImageUploadStart,
      onImageUploadStop,
      onShowToast,
    } = this.props;
    const { state } = view;
    const parent = findParentNode((node) => !!node)(state.selection);

    this.clearSearch();

    if (parent) {
      insertFiles(view, event, parent.pos, files, {
        uploadImage,
        onImageUploadStart,
        onImageUploadStop,
        onShowToast,
        dictionary: this.props.dictionary,
      });
    }

    if (this.inputRef.current) {
      this.inputRef.current.value = "";
    }

    this.props.onClose();
  };

  clearSearch = () => {
    this.props.onClearSearch();
  };

  insertBlock(item) {
    this.clearSearch();

    const command = this.props.commands[item.name];
    if (command) {
      command(item.attrs);
    } else {
      this.props.commands[`create${capitalize(item.name)}`](item.attrs);
    }

    this.props.onClose();
  }

  get caretPosition(): { top: number; left: number } {
    const selection = window.document.getSelection();
    if (!selection || !selection.anchorNode || !selection.focusNode) {
      return {
        top: 0,
        left: 0,
      };
    }

    const range = window.document.createRange();
    range.setStart(selection.anchorNode, selection.anchorOffset);
    range.setEnd(selection.focusNode, selection.focusOffset);

    // This is a workaround for an edge case where getBoundingClientRect will
    // return zero values if the selection is collapsed at the start of a newline
    // see reference here: https://stackoverflow.com/a/59780954
    const rects = range.getClientRects();
    if (rects.length === 0) {
      // probably buggy newline behavior, explicitly select the node contents
      if (range.startContainer && range.collapsed) {
        range.selectNodeContents(range.startContainer);
      }
    }

    const rect = range.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
    };
  }

  calculatePosition(props) {
    const { view } = props;
    const { selection } = view.state;
    let startPos;
    try {
      startPos = view.coordsAtPos(selection.from);
    } catch (err) {
      console.warn(err);
      return defaultPosition;
    }

    const domAtPos = view.domAtPos.bind(view);

    const ref = this.menuRef.current;
    const offsetHeight = ref ? ref.offsetHeight : 0;
    const node = findDomRefAtPos(selection.from, domAtPos);
    const paragraph: any = { node };

    if (
      !props.isActive ||
      !paragraph.node ||
      !paragraph.node.getBoundingClientRect ||
      SSR
    ) {
      return defaultPosition;
    }

    const { left } = this.caretPosition;
    const { top, bottom, right } = paragraph.node.getBoundingClientRect();
    const margin = 24;

    let leftPos = left + window.scrollX;
    if (props.rtl && ref) {
      leftPos = right - ref.scrollWidth;
    }

    if (startPos.top - offsetHeight > margin) {
      return {
        left: leftPos,
        top: undefined,
        bottom: window.innerHeight - top - window.scrollY,
        isAbove: false,
      };
    } else {
      return {
        left: leftPos,
        top: bottom + window.scrollY,
        bottom: undefined,
        isAbove: true,
      };
    }
  }

  get filtered() {
    const {
      embeds = [],
      search = "",
      uploadImage,
      commands,
      filterable = true,
    } = this.props;
    let items: (EmbedDescriptor | MenuItem)[] = this.props.items;
    const embedItems: EmbedDescriptor[] = [];

    for (const embed of embeds) {
      if (embed.title && embed.icon) {
        embedItems.push({
          ...embed,
          name: "embed",
        });
      }
    }

    if (embedItems.length) {
      items.push({
        name: "separator",
      });
      items = items.concat(embedItems);
    }

    const filtered = items.filter((item) => {
      if (item.name === "separator") return true;

      // Some extensions may be disabled, remove corresponding menu items
      if (
        item.name &&
        !commands[item.name] &&
        !commands[`create${capitalize(item.name)}`]
      ) {
        return false;
      }

      // If no image upload callback has been passed, filter the image block out
      if (!uploadImage && item.name === "image") return false;

      // some items (defaultHidden) are not visible until a search query exists
      if (!search) return !item.defaultHidden;

      const n = search.toLowerCase();
      if (!filterable) {
        return item;
      }
      return (
        (item.title || "").toLowerCase().includes(n) ||
        (item.keywords || "").toLowerCase().includes(n)
      );
    });

    return filterExcessSeparators(filtered);
  }

  render() {
    const { dictionary, isActive, uploadImage } = this.props;
    const items = this.filtered;
    const { insertItem, ...positioning } = this.state;

    return (
      <Portal>
        <Wrapper
          id={this.props.id || "block-menu-container"}
          active={isActive}
          ref={this.menuRef}
          {...positioning}
        >
          {insertItem ? (
            <div className="rem-CommandMenu-LinkInputWrapper">
              <Input
                className="rme-CommandMenu-LinkInput"
                type="text"
                placeholder={
                  insertItem.title
                    ? dictionary.pasteLinkWithTitle(insertItem.title)
                    : dictionary.pasteLink
                }
                onKeyDown={this.handleLinkInputKeydown}
                onPaste={this.handleLinkInputPaste}
                autoFocus
              />
            </div>
          ) : (
            <ol className="rme-CommandMenu-List">
              {items.map((item, index) => {
                if (item.name === "separator") {
                  return (
                    <li className="rme-CommandMenu-ListItem" key={index}>
                      <hr />
                    </li>
                  );
                }
                const selected = index === this.state.selectedIndex && isActive;

                if (!item.title) {
                  return null;
                }

                return (
                  <li className="rme-CommandMenu-ListItem" key={index}>
                    {this.props.renderMenuItem(item as any, index, {
                      selected,
                      onClick: () => this.insertItem(item),
                    })}
                  </li>
                );
              })}
              {items.length === 0 && (
                <li className="rme-CommandMenu-ListItem">
                  <div className="rme-CommandMenu-Empty">
                    {dictionary.noResults}
                  </div>
                </li>
              )}
            </ol>
          )}
          {uploadImage && (
            <VisuallyHidden>
              <input
                type="file"
                ref={this.inputRef}
                onChange={this.handleImagePicked}
                accept="image/*"
              />
            </VisuallyHidden>
          )}
        </Wrapper>
      </Portal>
    );
  }
}

const Wrapper = React.forwardRef(function Wrapper(props, forwardedRef) {
  const { active, top, bottom, left, isAbove, selectedIndex, ...rest } = props;
  return (
    <div
      className={cx("rme-CommandMenu-Wrapper", {
        active,
        isAbove,
      })}
      ref={forwardedRef}
      style={{
        top: !!top ? `${top}px` : undefined,
        bottom: !!bottom ? `${bottom}px` : undefined,
        left: !!left ? `${left}px` : undefined,
      }}
      {...rest}
    />
  );
});

export default CommandMenu;
