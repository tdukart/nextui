import type {
  SlotsToClasses,
  BlurhashImageSlots,
  BlurhashImageVariantProps,
} from "@nextui-org/theme";

import {ImgHTMLAttributes, useCallback} from "react";
import {HTMLNextUIProps, mapPropsVariants, PropGetter} from "@nextui-org/system";
import {blurhashImage} from "@nextui-org/theme";
import {useDOMRef} from "@nextui-org/react-utils";
import {clsx, dataAttr} from "@nextui-org/shared-utils";
import {ReactRef} from "@nextui-org/react-utils";
import {useImage as useImageBase} from "@nextui-org/use-image";
import {useMemo} from "react";
type NativeImageProps = ImgHTMLAttributes<HTMLImageElement>;

interface Props extends HTMLNextUIProps<"img"> {
  /**
   * Ref to the DOM node.
   */
  ref?: ReactRef<HTMLImageElement | null>;
  /**
   * Whether to add a blurred effect to the image.
   * @default false
   */
  isBlurred?: boolean;
  /**
   * A fallback blurhash.
   */
  blurhash?: string;
  /**
   * Whether to disable the loading skeleton.
   * @default false
   */
  disableSkeleton?: boolean;
  /**
   * A callback for when the image `src` has been loaded
   */
  onLoad?: NativeImageProps["onLoad"];
  /**
   * A loading strategy to use for the image.
   */
  loading?: NativeImageProps["loading"];
  /**
   * Whether to remove the wrapper element. This will cause the image to be rendered as a direct child of the parent element.
   * If you set this prop as `true` neither the skeleton nor the zoom effect will work.
   * @default false
   */
  removeWrapper?: boolean;
  /**
   * Controlled loading state.
   */
  isLoading?: boolean;
  /**
   * Function called when image failed to load
   */
  onError?: () => void;
  /**
   * Classname or List of classes to change the classNames of the element.
   * if `className` is passed, it will be added to the base slot.
   *
   * @example
   * ```ts
   * <Image classNames={{
   *    base:"base-classes", // image classes
   *    wrapper: "wrapper-classes",
   *    blurredImg: "blurredImg-classes", // this is a cloned version of the img
   * }} />
   * ```
   */
  classNames?: SlotsToClasses<BlurhashImageSlots>;
}

export type UseBlurhashImageProps = Props & BlurhashImageVariantProps;

export function useBlurhashImage(originalProps: UseBlurhashImageProps) {
  const [props, variantProps] = mapPropsVariants(originalProps, blurhashImage.variantKeys);

  const {
    ref,
    as,
    src,
    className,
    classNames,
    loading,
    isBlurred,
    blurhash,
    isLoading: isLoadingProp,
    disableSkeleton = !!blurhash,
    removeWrapper = false,
    onError,
    onLoad,
    srcSet,
    sizes,
    crossOrigin,
    width,
    height,
    ...otherProps
  } = props;

  const imageStatus = useImageBase({
    src,
    loading,
    onError,
    onLoad,
    ignoreFallback: false,
    srcSet,
    sizes,
    crossOrigin,
  });

  const isImgLoaded = imageStatus === "loaded" && !isLoadingProp;
  const isLoading = imageStatus === "loading" || isLoadingProp;
  const isZoomed = originalProps.isZoomed;

  const Component = as || "img";

  const domRef = useDOMRef(ref);

  const {w} = useMemo(() => {
    return {
      w: props.width
        ? typeof props.width === "number"
          ? `${props.width}px`
          : props.width
        : "fit-content",
    };
  }, [props?.width]);

  const showFallback = (!src || !isImgLoaded) && !!blurhash;
  const showSkeleton = isLoading && !disableSkeleton;

  const slots = useMemo(
    () =>
      blurhashImage({
        ...variantProps,
        showSkeleton,
      }),
    [...Object.values(variantProps), showSkeleton],
  );

  const baseStyles = clsx(className, classNames?.img);

  const getImgProps: PropGetter = (props = {}) => {
    const imgStyles = clsx(baseStyles, props?.className, blurhash && "absolute");

    return {
      src,
      ref: domRef,
      "data-loaded": dataAttr(isImgLoaded),
      className: slots.img({class: imgStyles}),
      loading,
      srcSet,
      sizes,
      crossOrigin,
      ...otherProps,
    };
  };

  const getWrapperProps = useCallback<PropGetter>(() => {
    return {
      className: slots.wrapper({class: classNames?.wrapper}),
      style: {
        maxWidth: w,
      },
      width,
      height,
    };
  }, [slots, showFallback, classNames?.wrapper]);

  const getBlurredImgProps = useCallback<PropGetter>(() => {
    return {
      src,
      "aria-hidden": dataAttr(true),
      className: slots.blurredImg({class: classNames?.blurredImg}),
    };
  }, [slots, src, classNames?.blurredImg]);

  const getPlaceholderProps = useCallback<PropGetter>(() => {
    return {
      className: slots.placeholder({class: classNames?.placeholder}),
      style: {
        maxWidth: w,
      },
      width,
      height,
    };
  }, [slots, classNames?.placeholder]);

  return {
    Component,
    domRef,
    slots,
    classNames,
    isBlurred,
    disableSkeleton,
    blurhash,
    removeWrapper,
    isZoomed,
    isLoading,
    getImgProps,
    getWrapperProps,
    getBlurredImgProps,
    getPlaceholderProps,
    width,
    height,
  };
}

export type UseBlurhashImageReturn = ReturnType<typeof useBlurhashImage>;
