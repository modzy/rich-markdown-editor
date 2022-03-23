import * as React from "react";
declare type JustifyValues = "center" | "space-around" | "space-between" | "flex-start" | "flex-end";
declare type AlignValues = "stretch" | "center" | "baseline" | "flex-start" | "flex-end";
declare type Props = {
    style?: React.CSSProperties;
    column?: boolean;
    align?: AlignValues;
    justify?: JustifyValues;
    auto?: boolean;
    className?: string;
    children?: React.ReactNode;
};
declare function Flex(props: Props): JSX.Element;
export default Flex;
//# sourceMappingURL=Flex.d.ts.map