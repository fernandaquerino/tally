"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  Children,
  cloneElement,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  useState,
} from "react";

import { cn } from "@/lib/utils";

const avatarVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center overflow-hidden",
    "rounded-full font-medium select-none uppercase",
  ],
  {
    variants: {
      size: {
        sm: "size-7 text-[11px]",
        md: "size-9 text-[13px]",
        lg: "size-11 text-sm",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const fallbackPalette = [
  "bg-primary text-primary-foreground",
  "bg-pj text-white",
  "bg-pf text-white",
  "bg-warning text-white",
  "bg-info text-white",
  "bg-success text-white",
];

function getInitials(name?: string): string {
  if (!name) return "?";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) {
    return words[0]!.slice(0, 2).toUpperCase();
  }
  return (words[0]![0]! + words[words.length - 1]![0]!).toUpperCase();
}

function pickPaletteClass(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash + seed.charCodeAt(i)) % fallbackPalette.length;
  }
  return fallbackPalette[hash]!;
}

export interface AvatarProps
  extends
    Omit<HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  name?: string;
  initials?: string;
}

export function Avatar({
  className,
  size,
  src,
  alt,
  name,
  initials,
  ...props
}: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const resolvedInitials = initials ?? getInitials(name);
  const accessibleLabel = alt ?? name ?? resolvedInitials;
  const showImage = Boolean(src) && !imageFailed;

  return (
    <span
      data-slot="avatar"
      role={showImage ? undefined : "img"}
      aria-label={showImage ? undefined : accessibleLabel}
      className={cn(
        avatarVariants({ size }),
        !showImage && pickPaletteClass(resolvedInitials),
        className,
      )}
      {...props}
    >
      {showImage ? (
        <img
          src={src}
          alt={accessibleLabel}
          className="size-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span aria-hidden="true">{resolvedInitials}</span>
      )}
    </span>
  );
}

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: AvatarProps["size"];
}

export function AvatarGroup({
  className,
  children,
  max,
  size,
  ...props
}: AvatarGroupProps) {
  const avatars = Children.toArray(children).filter(
    (child): child is ReactElement<AvatarProps> => isValidElement(child),
  );

  const limit = max ?? avatars.length;
  const visible = avatars.slice(0, limit);
  const overflow = avatars.length - visible.length;

  return (
    <div
      data-slot="avatar-group"
      className={cn("flex items-center -space-x-2", className)}
      {...props}
    >
      {visible.map((avatar, index) => (
        <span
          key={avatar.key ?? index}
          className="rounded-full ring-2 ring-background"
        >
          {size
            ? cloneElement(avatar, { size: avatar.props.size ?? size })
            : avatar}
        </span>
      ))}

      {overflow > 0 ? (
        <span
          className={cn(
            avatarVariants({ size }),
            "bg-secondary text-foreground-muted ring-2 ring-background",
          )}
          aria-label={`mais ${overflow}`}
          role="img"
        >
          <span aria-hidden="true">+{overflow}</span>
        </span>
      ) : null}
    </div>
  );
}
