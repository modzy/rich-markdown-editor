import cx from "clsx";

export default function Separator({ className, rest }) {
  return <div className={cx("rme-ToolbarSeparator", className)} {...rest} />;
}
