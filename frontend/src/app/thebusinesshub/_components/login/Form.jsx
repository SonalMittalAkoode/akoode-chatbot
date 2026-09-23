"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { addAdminLoginAPI } from "@/api/adminlogin";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

const Form = () => {
  const router = useRouter();
  const [user, setUser]               = useState("");
  const [password, setPassword]       = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]   = useState(false);
  const [error, setError]             = useState("");
  const [loading, setLoading]         = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("adminRememberMe");
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (parsed?.rememberMe) {
        setRememberMe(true);
        setUser(parsed?.email || "");
      }
    } catch (_e) {}
  }, []);

  const addAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = { email: user, password };

    try {
      const data = await addAdminLoginAPI(formData);

      if (data.status === "success") {
        toast.success("Login successful!");
        sessionStorage.setItem("user", JSON.stringify(data.data));
        if (rememberMe) {
          localStorage.setItem("adminRememberMe", JSON.stringify({ rememberMe: true, email: formData.email }));
        } else {
          localStorage.removeItem("adminRememberMe");
        }
        setUser("");
        setPassword("");
        router.push("/thebusinesshub/dashboard");
      } else if (data.status === "fail") {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      const rawMessage = error?.message || "";
      const lowerMessage = rawMessage.toLowerCase();
      const msg =
        lowerMessage.includes("invalid") ||
        lowerMessage.includes("not found") ||
        lowerMessage.includes("incorrect") ||
        lowerMessage.includes("password") ||
        lowerMessage.includes("credential")
          ? "Wrong email or password. Please use a registered account."
          : rawMessage || "Login failed. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const fieldBase = {
    background: "#f4f3fb",
    border: "1px solid #dddfee",
    color: "#40415D",
  };

  return (
    <form onSubmit={addAdminLogin} className="w-full">

      {/* Logo badge */}
      <div className="flex justify-center mb-6">
        <div
          className="w-[60px] h-[60px] rounded-2xl bg-white flex items-center justify-center"
          style={{ border: "1px solid #dddfee", boxShadow: "0 4px 20px rgba(64,65,93,0.10)" }}
        >
          <Image
            src="/fav-logo1.png"
            alt="Akoode"
            width={38}
            height={38}
            className="object-contain"
          />
        </div>
      </div>

      {/* Heading */}
      <div className="text-center mb-7">
        <h2 className="text-[22px] font-bold mb-1.5 m-0" style={{ color: "#40415D" }}>
          Sign in to Admin Panel
        </h2>
        {/* <p className="text-[13px] m-0 leading-snug" style={{ color: "#9a9bb8" }}>
          Access the Akoode CMS dashboard<br />with your admin credentials.
        </p> */}
      </div>

      {/* Error banner */}
      {error && (
        <div
          className="mb-4 px-4 py-2.5 rounded-xl text-[13px] font-medium"
          style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626" }}
        >
          {error}
        </div>
      )}

      {/* Email */}
      <div className="mb-3">
        <div className="relative">
          <Mail
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "#9a9bb8" }}
          />
          <input
            type="text"
            required
            placeholder="Email"
            value={user}
            onChange={e => setUser(e.target.value)}
            className="w-full pl-10 pr-4 py-[11px] text-[13.5px] rounded-xl outline-none transition-all duration-150"
            style={fieldBase}
            onFocus={e => { e.target.style.borderColor = "#474972"; e.target.style.background = "#fff"; }}
            onBlur={e => { e.target.style.borderColor = "#dddfee"; e.target.style.background = "#f4f3fb"; }}
          />
        </div>
      </div>

      {/* Password */}
      <div className="mb-2">
        <div className="relative">
          <Lock
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "#9a9bb8" }}
          />
          <input
            type={showPassword ? "text" : "password"}
            required
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-[11px] text-[13.5px] rounded-xl outline-none transition-all duration-150"
            style={fieldBase}
            onFocus={e => { e.target.style.borderColor = "#474972"; e.target.style.background = "#fff"; }}
            onBlur={e => { e.target.style.borderColor = "#dddfee"; e.target.style.background = "#f4f3fb"; }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(p => !p)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{ color: "#9a9bb8" }}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {/* Remember me + Forgot password */}
      <div className="flex items-center justify-between mb-5 mt-3">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            id="rememberMe"
            onChange={e => setRememberMe(e.target.checked)}
            className="w-3.5 h-3.5 rounded"
            style={{ accentColor: "#474972" }}
          />
          <span className="text-[12.5px]" style={{ color: "#6e6f8a" }}>Remember me</span>
        </label>
        <a
          href="#"
          className="text-[12.5px] font-medium no-underline transition-colors"
          style={{ color: "#474972" }}
        >
          Forgot password?
        </a>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-[12px] rounded-xl text-[14px] font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200"
        style={{ background: loading ? "#9a9bb8" : "#40415D", cursor: loading ? "not-allowed" : "pointer" }}
        onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#474972"; }}
        onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#40415D"; }}
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" strokeLinecap="round" />
            </svg>
            Signing in…
          </>
        ) : (
          "Get Started"
        )}
      </button>

    </form>
  );
};

export default Form;
