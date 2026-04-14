import Image from "next/image";

import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** 显示边长（正方形），默认 96 */
  size?: number;
  priority?: boolean;
};

/**
 * Machi 默认头像：与 Desktop `desktop/assets/export_embedded.png`（DEFAULT_META_AVATAR_URL）同源资源，
 * 避免自截 PNG 自带灰底块与页面 `#0a0a0a` / surface 产生色差。
 * 裁切与 Desktop 侧栏一致：`rounded-full object-cover`。
 */
export function MachiAvatar({ className, size = 96, priority }: Props) {
  return (
    <Image
      src="/machi-avatar.png"
      alt="Machi"
      width={size}
      height={size}
      priority={priority}
      className={cn(
        "rounded-full object-cover object-center select-none bg-transparent",
        className
      )}
      sizes={`${size}px`}
    />
  );
}
