/**
 * 抽象几何标识：黑白线框、锐利节点，呼应 Machi「编排 / 线程」气质；
 * 非任何第三方角色形象，避免版权与「套模板」观感。
 */
export function MachiMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="1" y="1" width="38" height="38" rx="5" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M11 29V11l9 11 9-11v18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <circle cx="29" cy="11" r="2" fill="currentColor" />
    </svg>
  );
}
