import Link from "next/link";

/** Sub-page counterpart to `REPLAY BOOT`. */
export function ReturnAction() {
  return (
    <Link
      href="/"
      className="status-action"
    >
      ← RETURN TO TERMINAL
    </Link>
  );
}
