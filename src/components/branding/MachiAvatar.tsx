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
 * - 资源本身为透明背景，仅保留线稿
 * - 通过 `mix-blend-difference` 在深色背景显示亮线、浅色背景显示暗线
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
        "object-contain object-center select-none bg-transparent mix-blend-difference",
        className
      )}
      sizes={`${size}px`}
    />
  );
}
