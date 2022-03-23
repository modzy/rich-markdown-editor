// @ts-nocheck

import * as React from "react";
import cx from "clsx";

type JustifyValues =
  | "center"
  | "space-around"
  | "space-between"
  | "flex-start"
  | "flex-end";

type AlignValues =
  | "stretch"
  | "center"
  | "baseline"
  | "flex-start"
  | "flex-end";

type Props = {
  style?: React.CSSProperties;
  column?: boolean;
  align?: AlignValues;
  justify?: JustifyValues;
  auto?: boolean;
  className?: string;
  children?: React.ReactNode;
};

function Flex(props: Props) {
  const { column, align, justify, auto, className, style, ...rest } = props;

  return (
    <div
      style={{ ...style, alignItems: align, justifyContent: justify }}
      className={cx("rme-flex", className, {
        auto,
        column,
      })}
      {...rest}
    />
  );
}

export default Flex;
