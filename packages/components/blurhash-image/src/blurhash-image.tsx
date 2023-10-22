import {cloneElement} from "react";
import {forwardRef} from "@nextui-org/system";
import {Blurhash} from "react-blurhash";

import {UseBlurhashImageProps, useBlurhashImage} from "./use-blurhash-image";

export interface BlurhashImageProps extends Omit<UseBlurhashImageProps, "showSkeleton"> {}

const BlurhashImage = forwardRef<"img", BlurhashImageProps>((props, ref) => {
  const {
    Component,
    domRef,
    slots,
    classNames,
    isBlurred,
    isZoomed,
    blurhash,
    removeWrapper,
    disableSkeleton,
    getImgProps,
    getWrapperProps,
    getBlurredImgProps,
    getPlaceholderProps,
    width,
    height,
  } = useBlurhashImage({
    ...props,
    ref,
  });

  const img = <Component ref={domRef} {...getImgProps()} />;

  if (removeWrapper) {
    return img;
  }

  const zoomed = (
    <div className={slots.zoomedWrapper({class: classNames?.zoomedWrapper})}>{img}</div>
  );

  const placeholder =
    blurhash && width && height ? <Blurhash hash={blurhash} {...getPlaceholderProps()} /> : null;

  if (isBlurred) {
    // clone element to add isBlurred prop to the cloned image
    return (
      <div {...getWrapperProps()}>
        {isZoomed ? zoomed : img}
        {cloneElement(img, getBlurredImgProps())}
      </div>
    );
  }

  // when zoomed or showSkeleton, we need to wrap the image
  if (isZoomed || !disableSkeleton || blurhash) {
    return (
      <div {...getWrapperProps()}>
        {placeholder}
        {isZoomed ? zoomed : img}
      </div>
    );
  }

  return img;
});

BlurhashImage.displayName = "NextUI.BlurhashImage";

export default BlurhashImage;
