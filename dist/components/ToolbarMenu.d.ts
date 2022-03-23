import * as React from "react";
import { EditorView } from "prosemirror-view";
import theme from "../styles/theme";
import { MenuItem } from "../types";
declare type Props = {
    tooltip: typeof React.Component | React.FC<any>;
    commands: Record<string, any>;
    view: EditorView;
    theme: typeof theme;
    items: MenuItem[];
};
declare class ToolbarMenu extends React.Component<Props> {
    render(): JSX.Element;
}
export default ToolbarMenu;
//# sourceMappingURL=ToolbarMenu.d.ts.map