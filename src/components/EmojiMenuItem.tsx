// @ts-nocheck

import * as React from "react";
import BlockMenuItem, { Props as BlockMenuItemProps } from "./BlockMenuItem";

const EmojiTitle = ({
  emoji,
  title,
}: {
  emoji: React.ReactNode;
  title: React.ReactNode;
}) => {
  return (
    <p>
      <span className="emoji rme-EmojiMenuItem-Emoji">{emoji}</span>
      &nbsp;&nbsp;
      {title}
    </p>
  );
};

type EmojiMenuItemProps = Omit<BlockMenuItemProps, "shortcut" | "theme"> & {
  emoji: string;
};

export default function EmojiMenuItem(props: EmojiMenuItemProps) {
  return (
    <BlockMenuItem
      {...props}
      title={<EmojiTitle emoji={props.emoji} title={props.title} />}
    />
  );
}
