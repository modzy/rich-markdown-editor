// @ts-nocheck

import * as React from "react";
import scrollIntoView from "smooth-scroll-into-view-if-needed";

import "./LinkSearchResult.scss";

type Props = {
  onClick: (event: React.MouseEvent) => void;
  onMouseOver: (event: React.MouseEvent) => void;
  icon: React.ReactNode;
  selected: boolean;
  title: string;
  subtitle?: string;
};

function LinkSearchResult({ title, subtitle, selected, icon, ...rest }: Props) {
  const ref = React.useCallback(
    (node) => {
      if (selected && node) {
        scrollIntoView(node, {
          scrollMode: "if-needed",
          block: "center",
          boundary: (parent) => {
            // All the parent elements of your target are checked until they
            // reach the #link-search-results. Prevents body and other parent
            // elements from being scrolled
            return parent.id !== "link-search-results";
          },
        });
      }
    },
    [selected]
  );

  return (
    <ListItem ref={ref} compact={!subtitle} selected={selected} {...rest}>
      <span className="rme-LinkSearchResult-IconWrapper">{icon}</span>
      <div>
        <div className="rme-LinkSearchResult-Title">{title}</div>
        {subtitle ? (
          <div className={cx("rme-LinkSearchResult-Subtitle", { selected })}>
            {subtitle}
          </div>
        ) : null}
      </div>
    </ListItem>
  );
}

const ListItem = React.forwardRef(function ListItem(props, forwardedRef) {
  const { selected, compact, className, ...rest } = props;

  return (
    <li
      ref={forwardedRef}
      className={cx("rme-LinkSearchResult-ListItem", className, {
        selected,
        compact,
      })}
      {...rest}
    />
  );
});

export default LinkSearchResult;
