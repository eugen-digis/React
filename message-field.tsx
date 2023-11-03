import React, { memo } from "react";

import { Nullable } from "models";
import { getTextStatus, StatusColorKeys, clsx } from "utils";
import { messageFieldSizeType, messageFieldAlignType } from "./message-field.constants";
import { MessageFieldSizeTypeKeys, MessageFieldAlignTypeKeys } from "./message-field.types";

import globalStyles from "assets/styles/global.module.css";
import styles from "./message-field.module.css";

export interface MessageFieldProps {
  message: Nullable<string>;
  className?: string;
  status?: StatusColorKeys;
  align?: MessageFieldAlignTypeKeys;
  size?: MessageFieldSizeTypeKeys;
  hideMessage?: boolean;
  disableOverflow?: boolean;
}

export const MessageField: React.FC<MessageFieldProps> = memo(
  ({
    message,
    className = "",
    status = "error",
    align = "left",
    size = "medium",
    hideMessage = false,
    disableOverflow = false,
    ...rest
  }: MessageFieldProps) => {
    if (hideMessage) return null;

    const containerStyles = clsx(
      styles.container,
      messageFieldSizeType[size],
      messageFieldAlignType[align],
      className,
    );

    const messageStyles = clsx(
      styles.message,
      { [globalStyles.applyMultiOverflow]: !disableOverflow },
      getTextStatus(status),
    );

    return (
      <div className={containerStyles} {...rest}>
        <span className={messageStyles}>{message}</span>
      </div>
    );
  },
);
