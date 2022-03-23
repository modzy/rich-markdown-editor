// @ts-nocheck
import { forwardRef } from "react";
import cx from "classnames";

import "./ToolbarButton.scss";

type Props = { active?: boolean; disabled?: boolean };

const ToolbarButton = forwardRef(function ToolbarButton(
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
