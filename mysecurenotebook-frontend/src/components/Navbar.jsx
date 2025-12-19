import ProfileMenu from "./ProfileMenu";

export default function Navbar() {
  return (
    <header
      style={{
        height: 64,
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}
    >
      {/* App Name */}
      <div
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: "#0f172a",
        }}
      >
        Secure Notebook
      </div>

      {/* Right Section */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <ProfileMenu />
      </div>
    </header>
  );
}
