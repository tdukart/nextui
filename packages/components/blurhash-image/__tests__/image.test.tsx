import * as React from "react";
import {render, act} from "@testing-library/react";

import {BlurhashImage} from "../src";

const src = "https://via.placeholder.com/300x450";
const blurhash = "L0NdO8?b-;?b~qj[ayj[?bfQD%fQ";

describe("Image", () => {
  it("should render correctly", () => {
    const wrapper = render(<BlurhashImage />);

    expect(() => wrapper.unmount()).not.toThrow();
  });

  it("ref should be forwarded", () => {
    const ref = React.createRef<HTMLImageElement>();

    render(<BlurhashImage ref={ref} />);
    expect(ref.current).not.toBeNull();
  });

  test("creates an instance of Image when mounted", () => {
    const wrapper = render(<BlurhashImage blurhash={blurhash} src={src} />);

    expect(wrapper.getByRole("img")).toBeInstanceOf(HTMLImageElement);
  });

  test("renders image if there is no blurhash defined", async () => {
    const wrapper = render(<BlurhashImage src={src} />);

    expect(wrapper.getByRole("img")).toHaveAttribute("src", src);
  });

  test("should render a wrapper when isZoomed or isBlurred is true", () => {
    const wrapper = render(<BlurhashImage isBlurred isZoomed src={src} />);

    expect(wrapper.getByRole("img").parentElement).toBeInstanceOf(HTMLDivElement);
  });

  test("should render a blurred image when isBlurred is true", () => {
    const wrapper = render(<BlurhashImage isBlurred src={src} />);
    const blurredImage = wrapper.getByRole("img").nextElementSibling;

    expect(blurredImage).toBeInstanceOf(HTMLImageElement);
  });

  test("should fire onload", () => {
    let imageOnload: any = null;

    function trackImageOnload() {
      Object.defineProperty(window.Image.prototype, "onload", {
        get() {
          return this._onload;
        },
        set(fn) {
          imageOnload = fn;
          this._onload = fn;
        },
      });
    }

    trackImageOnload();

    const onLoad = jest.fn();

    const wrapper = render(<BlurhashImage blurhash={blurhash} src={src} onLoad={onLoad} />);

    act(() => {
      imageOnload();
    });

    expect(wrapper.getByRole("img")).toHaveAttribute("src", src);
    expect(onLoad).toHaveBeenCalled();
  });
});
