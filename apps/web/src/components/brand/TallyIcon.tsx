import type { SVGProps } from "react";

type TallyIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export function TallyIcon({ size = 24, ...props }: TallyIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 44 44"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <rect width="44" height="44" rx="10.56" fill="#5E63D6" />
      <rect
        x="9.68"
        y="9.68"
        width="24.64"
        height="4.84"
        rx="2.64"
        fill="#FFFFFF"
      />
      <rect
        x="9.68"
        y="22"
        width="7.04"
        height="12.32"
        rx="2.64"
        fill="#FFFFFF"
      />
      <rect
        x="27.28"
        y="15.84"
        width="7.04"
        height="18.48"
        rx="2.64"
        fill="#FFFFFF"
        fillOpacity="0.72"
      />
    </svg>
  );
}
