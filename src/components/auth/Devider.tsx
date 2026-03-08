import { Theme } from "@/types/authTypes";

function Divider({ t }: { t: Theme }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginBottom: 24,
      }}
    >
      <span
        style={{
          flex: 1,
          height: 1,
          background: t.inputBorder,
          transition: "background 0.4s",
        }}
      />
      <span
        style={{
          fontSize: 11,
          color: t.textMuted,
          letterSpacing: "0.08em",
          textTransform: "uppercase" as const,
          transition: "color 0.4s",
        }}
      >
        or
      </span>
      <span
        style={{
          flex: 1,
          height: 1,
          background: t.inputBorder,
          transition: "background 0.4s",
        }}
      />
    </div>
  );
}

export default Divider;
