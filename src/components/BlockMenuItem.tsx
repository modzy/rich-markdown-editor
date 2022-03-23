// @ts-nocheck

import * as React from "react";
import scrollIntoView from "smooth-scroll-into-view-if-needed";
import cx from "clsx";

import "./BlockMenuItem.scss";

export type Props = {
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
  icon?: typeof React.Component | React.FC<any>;
  title: React.ReactNode;
  shortcut?: string;
  containerId?: string;
};

function BlockMenuItem({
  selected,
  disabled,
  onClick,
  title,
  shortcut,
  icon,
  containerId = "block-menu-container",
}: Props) {
  const Icon = icon;

  const ref = React.useCallback(
    (node) => {
      if (selected && node) {
        scrollIntoView(node, {
          scrollMode: "if-needed",
          block: "center",
          boundary: (parent) => {
            // All the parent elements of your target are checked until they
            // reach the #block-menu-container. Prevents body and other parent
            // elements from being scrolled
            return parent.id !== containerId;
          },
        });
      }
    },
    [selected, containerId]
  );

  return (
    <MenuItem
      selected={selected}
      onClick={disabled ? undefined : onClick}
      ref={ref}
    >
      {Icon && (
        <>
          <Icon
            color={
              selected
                ? "var(--rme-blockToolbarIconSelected)"
                : "var(--rme-blockToolbarIcon)"
            }
          />
          &nbsp;&nbsp;
        </>
      )}
      {title}
      {shortcut && <Shortcut>{shortcut}</Shortcut>}
    </MenuItem>
  );
}

const MenuItem = React.forwardRef(function MenuItem(props, forwardedRef) {
  const { className, disabled, selected, ...rest } = props;

  return (
    <button
      ref={forwardedRef}
      className={cx("rme-blockMenuItem-menuItem", className, {
        disabled,
        selected,
      })}
      {...rest}
    />
  );
});

function Shortcut({ className, ...rest }) {
  return (
    <span className={cx("rme-blockMenuItem-shortcut", className)} {...rest} />
  );
}

export default BlockMenuItem;
