// @ts-nocheck
import * as React from "react";
import cx from "clsx";

type Props = { active?: boolean; disabled?: boolean };

const ToolbarButton = React.forwardRef(function ToolbarButton(
  props: Props,
  forwardedRef
) {
  const { active, className, ...rest } = props;
  return (
    <button
      ref={forwardedRef}
      className={cx("rme-ToolbarButton", className, { active })}
      {...rest}
    />
  );
});

export default ToolbarButton;
