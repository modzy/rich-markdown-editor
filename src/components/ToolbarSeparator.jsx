import cx from "classnames";
import "./ToolbarSeparator.scss";

export default function Separator({ className, rest }) {
  return <div className={cx("rme-ToolbarSeparator", className)} {...rest} />;
}
