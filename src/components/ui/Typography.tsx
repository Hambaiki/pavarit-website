import { createElement, forwardRef } from "react";
import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactElement,
  Ref,
} from "react";

import { cn } from "@/lib/cn";

export type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "h7"
  | "body1"
  | "body2"
  | "span"
  | "div";

const defaultComponents: Record<TypographyVariant, ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  h7: "p",
  body1: "p",
  body2: "p",
  span: "span",
  div: "div",
};

const variantClasses: Record<TypographyVariant, string> = {
  h1: "typography-h1 font-display",
  h2: "typography-h2 font-display",
  h3: "typography-h3 font-display",
  h4: "typography-h4 font-display",
  h5: "typography-h5 font-display",
  h6: "typography-h6 font-display",
  h7: "typography-h7 font-display",
  body1: "typography-body1 font-body",
  body2: "typography-b2 font-body",
  span: "typography-caption font-body",
  div: "typography-b1 font-body",
};

export type TypographyProps<C extends ElementType = "p"> = {
  variant: TypographyVariant;
  component?: C;
  className?: string;
  ref?: Ref<unknown>;
} & Omit<ComponentPropsWithoutRef<C>, "className">;

const TypographyInner = (
  { variant, component, className = "", ...rest }: TypographyProps,
  ref: Ref<unknown>
) => {
  const Tag: ElementType = component ?? defaultComponents[variant];
  const variantClass = variantClasses[variant];

  return createElement(Tag, {
    ref,
    className: cn(variantClass, className),
    ...rest,
  });
};

const Typography = forwardRef(TypographyInner) as <C extends ElementType = "p">(
  props: TypographyProps<C>
) => ReactElement;

export default Typography;
