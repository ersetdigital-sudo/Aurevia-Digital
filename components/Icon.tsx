import type { SVGProps } from "react";
import type { IconName } from "@/lib/icons";
import { cn } from "@/lib/cn";

type IconProps = { name: IconName } & SVGProps<SVGSVGElement>;

export function Icon({ name, className, ...props }: IconProps) {
  return (
    <svg
      className={cn("ic", className)}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <use href={`#i-${name}`} />
    </svg>
  );
}
