import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import Link from "next/link";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "ghost";

type BaseProps = {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    href?: undefined;
  };

type ButtonAsAnchor = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const isInternal = (href: string) => href.startsWith("/");

/**
 * Button — Primary (gradient) or Ghost (glass).
 * Renders a Next <Link> for internal hrefs (client-side nav), a plain <a>
 * for external/anchor hrefs, or a <button> when no href is given.
 * All visual values derive from design tokens.
 */
export function Button({
  variant = "primary",
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = [styles.btn, styles[variant], className]
    .filter(Boolean)
    .join(" ");
  const content = <span className={styles.label}>{children}</span>;

  if (typeof (rest as ButtonAsAnchor).href === "string") {
    const { href, ...anchorProps } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    };

    if (isInternal(href) && !anchorProps.target) {
      return (
        <Link href={href} className={classes} {...anchorProps}>
          {content}
        </Link>
      );
    }

    return (
      <a href={href} className={classes} {...anchorProps}>
        {content}
      </a>
    );
  }

  const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} {...buttonProps}>
      {content}
    </button>
  );
}

/** Convenience wrappers matching the PRD component names. */
export function ButtonPrimary(props: Omit<ButtonProps, "variant">) {
  return <Button variant="primary" {...(props as ButtonProps)} />;
}

export function ButtonGhost(props: Omit<ButtonProps, "variant">) {
  return <Button variant="ghost" {...(props as ButtonProps)} />;
}
