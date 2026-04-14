import Image from "next/image";

import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** 显示边长（正方形），默认 96 */
  size?: number;
  priority?: boolean;
};

/**
 * Machi 线稿头像（与当前聊天页视觉一致的暗底版本）。
 * 使用独立文件名避免旧资源缓存导致头像错位。
 */
export function MachiAvatar({ className, size = 96, priority }: Props) {
  return (
    <Image
      src="/machi-avatar-wireframe.png"
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
