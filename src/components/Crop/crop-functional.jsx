import React, { useRef, useState, useEffect } from "react";
import clsx from "clsx";

import {
  defaultCrop,
  clamp,
  areCropsEqual,
  convertToPercentCrop,
  convertToPixelCrop,
  containCrop,
  nudgeCrop,
} from "../../constant/utils";

import "./Crop.css";

const DOC_MOVE_OPTS = { capture: true, passive: false };

const Crop = React.memo((props) => {
  const ariaLabel = {
    cropArea: "Use the arrow keys to move the crop selection area",
    nwDragHandle:
      "Use the arrow keys to move the north west drag handle to change the crop selection area",
    nDragHandle:
      "Use the up and down arrow keys to move the north drag handle to change the crop selection area",
    neDragHandle:
      "Use the arrow keys to move the north east drag handle to change the crop selection area",
    eDragHandle:
      "Use the up and down arrow keys to move the east drag handle to change the crop selection area",
    seDragHandle:
      "Use the arrow keys to move the south east drag handle to change the crop selection area",
    sDragHandle:
      "Use the up and down arrow keys to move the south drag handle to change the crop selection area",
    swDragHandle:
      "Use the arrow keys to move the south west drag handle to change the crop selection area",
    wDragHandle:
      "Use the up and down arrow keys to move the west drag handle to change the crop selection area",
  };

  const {
    crop,
    onComplete,
    disabled,
    locked,
    keepSelection,
    onChange,
    isCrop,
    onDragStart,
    aspect = 0,
    minWidth = 0,
    minHeight = 0,
    maxWidth,
    maxHeight,
    onDragEnd,
    ariaLabels = ariaLabel,
    renderSelectionAddon,
    ruleOfThirds,
    children,
    circularCrop,
    className,
    style,
  } = props;

  const xOrds = ["e", "w"];
  const yOrds = ["n", "s"];
  const xyOrds = ["nw", "ne", "se", "sw"];

  const nudgeStep = 1;
  const nudgeStepMedium = 10;
  const nudgeStepLarge = 100;

  let docMoveBound = false;
  let mouseDownOnCrop = false;
  let dragStarted = false;

  let evData = {
    startClientX: 0,
    startClientY: 0,
    startCropX: 0,
    startCropY: 0,
    clientX: 0,
    clientY: 0,
    isResize: true,
  };

  const [cropState, setCropState] = useState({
    cropIsActive: false,
    newCropIsBeingDrawn: false,
  });

  const componentRef = useRef(null);
  const mediaRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const documentRef = useRef(document);

  // We unfortunately get the bounding box every time as x+y changes
  // due to scrolling.
  const getBox = () => {
    const el = mediaRef.current;
    if (!el) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }
    const { x, y, width, height } = el.getBoundingClientRect();
    return { x, y, width, height };
  };

  useEffect(() => {
    if (onComplete && crop) {
      const { width, height } = getBox();
      if (width && height) {
        onComplete(
          convertToPixelCrop(crop, width, height),
          convertToPercentCrop(crop, width, height)
        );
      }
    }
  }, [crop]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      // handle resize event
    });

    resizeObserverRef.current = resizeObserver;

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  const bindDocMove = () => {
    if (docMoveBound) {
      return;
    }

    documentRef.current.addEventListener(
      "pointermove",
      onDocPointerMove,
      DOC_MOVE_OPTS
    );
    documentRef.current.addEventListener(
      "pointerup",
      onDocPointerDone,
      DOC_MOVE_OPTS
    );
    documentRef.current.addEventListener(
      "pointercancel",
      onDocPointerDone,
      DOC_MOVE_OPTS
    );

    docMoveBound = true;
  };

  const unbindDocMove = () => {
    if (!docMoveBound) {
      return;
    }

    documentRef.current.removeEventListener(
      "pointermove",
      onDocPointerMove,
      DOC_MOVE_OPTS
    );
    documentRef.current.removeEventListener(
      "pointerup",
      onDocPointerDone,
      DOC_MOVE_OPTS
    );
    documentRef.current.removeEventListener(
      "pointercancel",
      onDocPointerDone,
      DOC_MOVE_OPTS
    );

    docMoveBound = false;
  };

  const onCropPointerDown = (e) => {
    const box = getBox();

    if (!crop) {
      return;
    }

    const pixelCrop = convertToPixelCrop(crop, box.width, box.height);

    if (disabled) {
      return;
    }

    if (e.cancelable) e.preventDefault(); // Stop drag selection.

    // Bind to doc to follow movements outside of element.
    bindDocMove();

    // Focus for detecting keypress.
    componentRef.current.focus({ preventScroll: true });

    const ord = e.target.dataset.ord;
    const isResize = Boolean(ord);
    let startClientX = e.clientX;
    let startClientY = e.clientY;
    let startCropX = pixelCrop.x;
    let startCropY = pixelCrop.y;

    // Set the starting coords to the opposite corner.
    if (ord) {
      const relativeX = e.clientX - box.x;
      const relativeY = e.clientY - box.y;
      let fromCornerX = 0;
      let fromCornerY = 0;

      if (ord === "ne" || ord === "e") {
        fromCornerX = relativeX - (pixelCrop.x + pixelCrop.width);
        fromCornerY = relativeY - pixelCrop.y;
        startCropX = pixelCrop.x;
        startCropY = pixelCrop.y + pixelCrop.height;
      } else if (ord === "se" || ord === "s") {
        fromCornerX = relativeX - (pixelCrop.x + pixelCrop.width);
        fromCornerY = relativeY - (pixelCrop.y + pixelCrop.height);
        startCropX = pixelCrop.x;
        startCropY = pixelCrop.y;
      } else if (ord === "sw" || ord === "w") {
        fromCornerX = relativeX - pixelCrop.x;
        fromCornerY = relativeY - (pixelCrop.y + pixelCrop.height);
        startCropX = pixelCrop.x + pixelCrop.width;
        startCropY = pixelCrop.y;
      } else if (ord === "nw" || ord === "n") {
        fromCornerX = relativeX - pixelCrop.x;
        fromCornerY = relativeY - pixelCrop.y;
        startCropX = pixelCrop.x + pixelCrop.width;
        startCropY = pixelCrop.y + pixelCrop.height;
      }

      startClientX = startCropX + box.x + fromCornerX;
      startClientY = startCropY + box.y + fromCornerY;
    }

    evData = {
      startClientX,
      startClientY,
      startCropX,
      startCropY,
      clientX: e.clientX,
      clientY: e.clientY,
      isResize,
      ord,
    };

    mouseDownOnCrop = true;
    setCropState((prevState) => ({
      ...prevState,
      cropIsActive: true,
    }));
  };

  const onComponentPointerDown = (e) => {
    if (isCrop) {
      const box = getBox();

      if (disabled || locked || (keepSelection && crop)) {
        return;
      }

      if (e.cancelable) e.preventDefault(); // Stop drag selection.

      // Bind to doc to follow movements outside of element.
      bindDocMove();

      // Focus for detecting keypress.
      componentRef.current.focus({ preventScroll: true });

      const cropX = e.clientX - box.x;
      const cropY = e.clientY - box.y;
      const nextCrop = {
        unit: "px",
        x: cropX,
        y: cropY,
        width: 0,
        height: 0,
      };

      evData = {
        startClientX: e.clientX,
        startClientY: e.clientY,
        startCropX: cropX,
        startCropY: cropY,
        clientX: e.clientX,
        clientY: e.clientY,
        isResize: true,
      };

      mouseDownOnCrop = true;

      onChange(
        convertToPixelCrop(nextCrop, box.width, box.height),
        convertToPercentCrop(nextCrop, box.width, box.height)
      );

      setCropState({
        cropIsActive: true,
        newCropIsBeingDrawn: true,
      });
    }
  };

  const onDocPointerMove = (e) => {
    const box = getBox();

    if (disabled || !crop || !mouseDownOnCrop) {
      return;
    }

    // Stop drag selection.
    if (e.cancelable) e.preventDefault();

    if (!dragStarted) {
      dragStarted = true;
      if (onDragStart) {
        onDragStart(e);
      }
    }

    evData.clientX = e.clientX;
    evData.clientY = e.clientY;

    let nextCrop;

    if (evData.isResize) {
      nextCrop = resizeCrop();
    } else {
      nextCrop = dragCrop();
    }

    if (!areCropsEqual(crop, nextCrop)) {
      onChange(
        convertToPixelCrop(nextCrop, box.width, box.height),
        convertToPercentCrop(nextCrop, box.width, box.height)
      );
    }
  };

  const onComponentKeyDown = (e) => {
    const box = getBox();

    if (disabled) {
      return;
    }

    const keyCode = e.key;
    let nudged = false;

    if (!crop) {
      return;
    }

    const nextCrop = makePixelCrop();
    const ctrlCmdPressed = navigator.platform.match("Mac")
      ? e.metaKey
      : e.ctrlKey;
    const nudgeSteps = ctrlCmdPressed
      ? nudgeStepLarge
      : e.shiftKey
      ? nudgeStepMedium
      : nudgeStep;

    if (keyCode === "ArrowLeft") {
      nextCrop.x -= nudgeSteps;
      nudged = true;
    } else if (keyCode === "ArrowRight") {
      nextCrop.x += nudgeSteps;
      nudged = true;
    } else if (keyCode === "ArrowUp") {
      nextCrop.y -= nudgeSteps;
      nudged = true;
    } else if (keyCode === "ArrowDown") {
      nextCrop.y += nudgeSteps;
      nudged = true;
    }

    if (nudged) {
      if (e.cancelable) e.preventDefault(); // Stop drag selection.

      nextCrop.x = clamp(nextCrop.x, 0, box.width - nextCrop.width);
      nextCrop.y = clamp(nextCrop.y, 0, box.height - nextCrop.height);

      const pixelCrop = convertToPixelCrop(nextCrop, box.width, box.height);
      const percentCrop = convertToPercentCrop(nextCrop, box.width, box.height);

      onChange(pixelCrop, percentCrop);
      if (onComplete) {
        onComplete(pixelCrop, percentCrop);
      }
    }
  };

  const onHandlerKeyDown = (e, ord) => {
    const box = getBox();

    if (disabled || !crop) {
      return;
    }

    // Keep the event from bubbling up to the container
    if (
      e.key === "ArrowUp" ||
      e.key === "ArrowDown" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight"
    ) {
      e.stopPropagation();
      e.preventDefault();
    } else {
      return;
    }

    const ctrlCmdPressed = navigator.platform.match("Mac")
      ? e.metaKey
      : e.ctrlKey;
    const offset = ctrlCmdPressed
      ? nudgeStepLarge
      : e.shiftKey
      ? nudgeStepMedium
      : nudgeStep;

    const pixelCrop = convertToPixelCrop(crop, box.width, box.height);
    const nudgedCrop = nudgeCrop(pixelCrop, e.key, offset, ord);
    const containedCrop = containCrop(
      nudgedCrop,
      aspect,
      ord,
      box.width,
      box.height,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight
    );

    if (!areCropsEqual(crop, containedCrop)) {
      const percentCrop = convertToPercentCrop(
        containedCrop,
        box.width,
        box.height
      );
      onChange(containedCrop, percentCrop);

      if (onComplete) {
        onComplete(containedCrop, percentCrop);
      }
    }
  };

  const onDocPointerDone = (e) => {
    const box = getBox();

    unbindDocMove();

    if (disabled || !crop) {
      return;
    }

    if (mouseDownOnCrop) {
      mouseDownOnCrop = false;
      dragStarted = false;

      onDragEnd && onDragEnd(e);
      onComplete &&
        onComplete(
          convertToPixelCrop(crop, box.width, box.height),
          convertToPercentCrop(crop, box.width, box.height)
        );

      setCropState({
        cropIsActive: false,
        newCropIsBeingDrawn: false,
      });
    }
  };

  const onDragFocus = (e) => {
    componentRef.current?.scrollTo(0, 0);
  };

  const getCropStyle = () => {
    if (!crop) {
      return undefined;
    }

    return {
      top: `${crop.y}${crop.unit}`,
      left: `${crop.x}${crop.unit}`,
      width: `${crop.width}${crop.unit}`,
      height: `${crop.height}${crop.unit}`,
    };
  };

  const dragCrop = () => {
    const box = getBox();
    const nextCrop = makePixelCrop();
    const xDiff = evData.clientX - evData.startClientX;
    const yDiff = evData.clientY - evData.startClientY;

    nextCrop.x = clamp(
      evData.startCropX + xDiff,
      0,
      box.width - nextCrop.width
    );
    nextCrop.y = clamp(
      evData.startCropY + yDiff,
      0,
      box.height - nextCrop.height
    );

    return nextCrop;
  };

  const getPointRegion = (box) => {
    const relativeX = evData.clientX - box.x;
    const relativeY = evData.clientY - box.y;
    const topHalf = relativeY < evData.startCropY;
    const leftHalf = relativeX < evData.startCropX;

    if (leftHalf) {
      return topHalf ? "nw" : "sw";
    } else {
      return topHalf ? "ne" : "se";
    }
  };

  const resizeCrop = () => {
    const box = getBox();
    const area = getPointRegion(box);
    const nextCrop = makePixelCrop();
    const resolvedOrd = evData.ord ? evData.ord : area;
    const xDiff = evData.clientX - evData.startClientX;
    const yDiff = evData.clientY - evData.startClientY;

    const tmpCrop = {
      unit: "px",
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };

    if (area === "ne") {
      tmpCrop.x = evData.startCropX;
      tmpCrop.width = xDiff;

      if (aspect) {
        tmpCrop.height = tmpCrop.width / aspect;
        tmpCrop.y = evData.startCropY - tmpCrop.height;
      } else {
        tmpCrop.height = Math.abs(yDiff);
        tmpCrop.y = evData.startCropY - tmpCrop.height;
      }
    } else if (area === "se") {
      tmpCrop.x = evData.startCropX;
      tmpCrop.y = evData.startCropY;
      tmpCrop.width = xDiff;

      if (aspect) {
        tmpCrop.height = tmpCrop.width / aspect;
      } else {
        tmpCrop.height = yDiff;
      }
    } else if (area === "sw") {
      tmpCrop.x = evData.startCropX + xDiff;
      tmpCrop.y = evData.startCropY;
      tmpCrop.width = Math.abs(xDiff);

      if (aspect) {
        tmpCrop.height = tmpCrop.width / aspect;
      } else {
        tmpCrop.height = yDiff;
      }
    } else if (area === "nw") {
      tmpCrop.x = evData.startCropX + xDiff;
      tmpCrop.width = Math.abs(xDiff);

      if (aspect) {
        tmpCrop.height = tmpCrop.width / aspect;
        tmpCrop.y = evData.startCropY - tmpCrop.height;
      } else {
        tmpCrop.height = Math.abs(yDiff);
        tmpCrop.y = evData.startCropY + yDiff;
      }
    }

    const containedCrop = containCrop(
      tmpCrop,
      aspect,
      area,
      box.width,
      box.height,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight
    );

    // Apply x/y/width/height changes depending on ordinate
    // (fixed aspect always applies both).
    if (aspect || xyOrds.indexOf(resolvedOrd) > -1) {
      nextCrop.x = containedCrop.x;
      nextCrop.y = containedCrop.y;
      nextCrop.width = containedCrop.width;
      nextCrop.height = containedCrop.height;
    } else if (xOrds.indexOf(resolvedOrd) > -1) {
      nextCrop.x = containedCrop.x;
      nextCrop.width = containedCrop.width;
    } else if (yOrds.indexOf(resolvedOrd) > -1) {
      nextCrop.y = containedCrop.y;
      nextCrop.height = containedCrop.height;
    }

    return nextCrop;
  };

  const createCropSelection = () => {
    const style = getCropStyle();

    if (!crop) {
      return undefined;
    }

    return (
      <div
        style={style}
        className="Crop__crop-selection"
        onPointerDown={onCropPointerDown}
        aria-label={ariaLabels.cropArea}
        tabIndex={0}
        onKeyDown={onComponentKeyDown}
        role="group"
      >
        {!disabled && !locked && (
          <div className="Crop__drag-elements" onFocus={onDragFocus}>
            <div className="Crop__drag-bar ord-n" data-ord="n" />
            <div className="Crop__drag-bar ord-e" data-ord="e" />
            <div className="Crop__drag-bar ord-s" data-ord="s" />
            <div className="Crop__drag-bar ord-w" data-ord="w" />

            <div
              className="Crop__drag-handle ord-nw"
              data-ord="nw"
              tabIndex={0}
              aria-label={ariaLabels.nwDragHandle}
              onKeyDown={(e) => onHandlerKeyDown(e, "nw")}
              role="button"
            />
            <div
              className="Crop__drag-handle ord-n"
              data-ord="n"
              tabIndex={0}
              aria-label={ariaLabels.nDragHandle}
              onKeyDown={(e) => onHandlerKeyDown(e, "n")}
              role="button"
            />
            <div
              className="Crop__drag-handle ord-ne"
              data-ord="ne"
              tabIndex={0}
              aria-label={ariaLabels.neDragHandle}
              onKeyDown={(e) => onHandlerKeyDown(e, "ne")}
              role="button"
            />
            <div
              className="Crop__drag-handle ord-e"
              data-ord="e"
              tabIndex={0}
              aria-label={ariaLabels.eDragHandle}
              onKeyDown={(e) => onHandlerKeyDown(e, "e")}
              role="button"
            />
            <div
              className="Crop__drag-handle ord-se"
              data-ord="se"
              tabIndex={0}
              aria-label={ariaLabels.seDragHandle}
              onKeyDown={(e) => onHandlerKeyDown(e, "se")}
              role="button"
            />
            <div
              className="Crop__drag-handle ord-s"
              data-ord="s"
              tabIndex={0}
              aria-label={ariaLabels.sDragHandle}
              onKeyDown={(e) => onHandlerKeyDown(e, "s")}
              role="button"
            />
            <div
              className="Crop__drag-handle ord-sw"
              data-ord="sw"
              tabIndex={0}
              aria-label={ariaLabels.swDragHandle}
              onKeyDown={(e) => onHandlerKeyDown(e, "sw")}
              role="button"
            />
            <div
              className="Crop__drag-handle ord-w"
              data-ord="w"
              tabIndex={0}
              aria-label={ariaLabels.wDragHandle}
              onKeyDown={(e) => onHandlerKeyDown(e, "w")}
              role="button"
            />
          </div>
        )}
        {renderSelectionAddon && (
          <div
            className="Crop__selection-addon"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {renderSelectionAddon(cropState)}
          </div>
        )}
        {ruleOfThirds && (
          <>
            <div className="Crop__rule-of-thirds-hz" />
            <div className="Crop__rule-of-thirds-vt" />
          </>
        )}
      </div>
    );
  };

  const makePixelCrop = () => {
    const crop2 = { ...defaultCrop, ...(crop || {}) };
    const box = getBox();
    return convertToPixelCrop(crop2, box.width, box.height);
  };

  const cropSelection = crop && isCrop ? createCropSelection() : null;

  const componentClasses = clsx("Crop", className, {
    "Crop--active": cropState.cropIsActive,
    "Crop--disabled": disabled,
    "Crop--locked": locked,
    "Crop--new-crop": cropState.newCropIsBeingDrawn,
    "Crop--fixed-aspect": crop && aspect,
    "Crop--circular-crop": crop && circularCrop,
    "Crop--rule-of-thirds": crop && ruleOfThirds,
    "Crop--invisible-crop": !dragStarted && crop && !crop.width && !crop.height,
    "Crop--noCrop": !isCrop,
  });

  return (
    <div ref={componentRef} className={componentClasses} style={style}>
      <div
        ref={mediaRef}
        className="Crop__child-wrapper"
        onPointerDown={onComponentPointerDown}
      >
        {children}
      </div>
      {cropSelection}
    </div>
  );
});

export default Crop;
