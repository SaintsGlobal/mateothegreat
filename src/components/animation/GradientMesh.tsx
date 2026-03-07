// FD-020: Animated gradient mesh background

export function GradientMesh({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Violet blob */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-40 blur-[100px] animate-[blob-drift_20s_infinite_ease-in-out]"
        style={{ background: "#8b5cf6", top: "10%", left: "20%" }}
      />
      {/* Cyan blob */}
      <div
        className="absolute w-[350px] h-[350px] rounded-full opacity-30 blur-[100px] animate-[blob-drift_25s_infinite_ease-in-out_reverse]"
        style={{ background: "#06b6d4", top: "40%", right: "15%" }}
      />
      {/* Amber blob */}
      <div
        className="absolute w-[300px] h-[300px] rounded-full opacity-20 blur-[100px] animate-[blob-drift_22s_3s_infinite_ease-in-out]"
        style={{ background: "#f59e0b", bottom: "10%", left: "40%" }}
      />
    </div>
  );
}
