import Image from "next/image";

import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** 显示边长（正方形），默认 96 */
  size?: number;
  priority?: boolean;
};

/**
 * Machi 产品头像：线稿角色 bust（与桌面端玛奇神韵一致），非几何标。
 */
export function MachiAvatar({ className, size = 96, priority }: Props) {
  return (
    <Image
      src="/machi-avatar.png"
      alt="Machi"
      width={size}
      height={size}
      priority={priority}
      className={cn("rounded-xl object-cover object-top select-none", className)}
      sizes={`${size}px`}
    />
  );
}
