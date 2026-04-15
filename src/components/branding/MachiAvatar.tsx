import Image from "next/image";

import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** 显示边长（正方形），默认 96 */
  size?: number;
  priority?: boolean;
};

/**
 * Machi 透明线稿头像：
 * - 资源本身为透明背景白线稿
 * - 通过 `invert dark:invert-0` 在浅色背景显示黑线、深色背景显示白线
 */
export function MachiAvatar({ className, size = 96, priority }: Props) {
  return (
    <Image
      src="/machi-lineart-mask.png"
      alt="Machi"
      width={size}
      height={size}
      priority={priority}
      className={cn(
        "object-contain object-center select-none bg-transparent invert dark:invert-0",
        className
      )}
      sizes={`${size}px`}
    />
  );
}
