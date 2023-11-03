import React, { memo, useRef } from "react";

import { Button, SvgIcon } from "components";
import { clamp, round, clsx } from "utils";
import { initialZoom } from "../editor.constants";
import { addQuart, subQuint } from "../editor.utils";

import { ReactComponent as ZoomInSVG } from "docs/assets/images/magnifier-plus-grey.svg";
import { ReactComponent as ZoomOutSVG } from "docs/assets/images/magnifier-minus-grey.svg";
import { ReactComponent as ResetSVG } from "docs/assets/images/magnifier-reset-grey.svg";
import styles from "./zoom-controls.module.css";

export interface ZoomControlsProps {
  onZoomChange: (zoom: number) => void;
  className?: string;
}

export const ZoomControls: React.FC<ZoomControlsProps> = memo(
  ({ onZoomChange, className = "" }: ZoomControlsProps) => {
    const currentZoomRef = useRef(initialZoom);
    const zoomTextRef = useRef<HTMLSpanElement>(null);

    const handleChangeZoom = (zoom: number = initialZoom) => {
      currentZoomRef.current = clamp(round(zoom, 5), 0.4096, 5.96046);

      if (zoomTextRef.current) {
        zoomTextRef.current.innerText = "Zoom: " + currentZoomRef.current;
      }

      onZoomChange(currentZoomRef.current);
    };

    const handleZoomIn = () => handleChangeZoom(addQuart(currentZoomRef.current));

    const handleZoomOut = () => handleChangeZoom(subQuint(currentZoomRef.current));

    const handleResetZoom = () => handleChangeZoom();

    return (
      <div className={clsx(styles.zoomWrapper, className)}>
        <Button appearance="whiteGhost" onClick={handleZoomIn}>
          <SvgIcon icon={ZoomInSVG} size="small" />
        </Button>
        <Button appearance="whiteGhost" onClick={handleZoomOut}>
          <SvgIcon icon={ZoomOutSVG} size="small" />
        </Button>
        <Button appearance="whiteGhost" onClick={handleResetZoom}>
          <SvgIcon icon={ResetSVG} size="small" />
        </Button>
        <span className={styles.zoomText} ref={zoomTextRef}>
          Zoom: {currentZoomRef.current}
        </span>
      </div>
    );
  },
);

export default ZoomControls;
