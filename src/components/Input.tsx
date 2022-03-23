// @ts-nocheck
import * as React from "react";
import cx from "clsx";

const Input = React.forwardRef(function Input(props, forwardedRef) {
  const { className, ...rest } = props;
  return (
    <input
      ref={forwardedRef}
      className={cx("rme-Input", className)}
      {...rest}
    />
  );
});

export default Input;
