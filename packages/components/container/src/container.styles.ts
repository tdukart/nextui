import {styled} from "@nextui-org/system";

export const StyledContainer = styled("div", {
  w: "100%",
  mr: "auto",
  ml: "auto",
  variants: {
    fluid: {
      true: {
        maxWidth: "100%",
      },
    },
    responsive: {
      true: {
        "@xs": {
          maxWidth: "$breakpoints$xs",
        },
        "@sm": {
          maxWidth: "$breakpoints$sm",
        },
        "@md": {
          maxWidth: "$breakpoints$md",
        },
        "@lg": {
          maxWidth: "$breakpoints$lg",
        },
        "@xl": {
          maxWidth: "$breakpoints$xl",
        },
      },
    },
  },
});
