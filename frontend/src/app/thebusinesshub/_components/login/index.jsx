import Image from "next/image";
import Form from "./Form";

const AdminLogin = () => {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #f4f3fb 0%, #edeafd 55%, #f0effe 100%)",
      }}
    >
      {/* Decorative background orbs */}
      <div
        className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(71,73,114,0.12) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(71,73,114,0.10) 0%, transparent 70%)" }}
      />
      {/* Subtle ring */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ border: "1px solid rgba(71,73,114,0.08)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ border: "1px solid rgba(71,73,114,0.06)" }}
      />

      {/* Login card */}
      <div
        className="relative w-full max-w-[400px] bg-white rounded-3xl px-8 py-9"
        style={{
          boxShadow: "0 24px 64px rgba(64,65,93,0.13), 0 2px 8px rgba(64,65,93,0.06)",
          border: "1px solid #dddfee",
        }}
      >
        <Form />

        {/* Footer brand line */}
        <div className="flex items-center justify-center gap-1.5 mt-7 pt-6" style={{ borderTop: "1px solid #dddfee" }}>
          <Image
            src="/logo-dark.png"
            alt="Akoode"
            width={80}
            height={24}
            className="object-contain opacity-60"
          />
          {/* <span className="text-[11px]" style={{ color: "#9a9bb8" }}>Admin Panel</span> */}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
