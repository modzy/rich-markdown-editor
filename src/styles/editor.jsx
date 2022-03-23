import { forwardRef } from "react";
import cx from "clsx";

export const StyledEditor = forwardRef(function StyledEditor(
  props,
  forwardedRef
) {
  const { readOnly, readOnlyWriteCheckboxes, rtl, className, ...rest } = props;

  return (
    <div
      ref={forwardedRef}
      {...rest}
      className={cx("rme-StyledEditor", {
        readOnly,
        readOnlyWriteCheckboxes,
      })}
    />
  );
});
