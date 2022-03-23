import * as React from "react";
export declare type Props = {
    selected: boolean;
    disabled?: boolean;
    onClick: () => void;
    icon?: typeof React.Component | React.FC<any>;
    title: React.ReactNode;
    shortcut?: string;
    containerId?: string;
};
declare function BlockMenuItem({ selected, disabled, onClick, title, shortcut, icon, containerId, }: Props): JSX.Element;
export default BlockMenuItem;
//# sourceMappingURL=BlockMenuItem.d.ts.map