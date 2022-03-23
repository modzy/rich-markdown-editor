// @ts-nocheck
import { forwardRef } from "react";
import cx from "classnames";

import "./Input.scss";

const Input = forwardRef(function Input(props, forwardedRef) {
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
