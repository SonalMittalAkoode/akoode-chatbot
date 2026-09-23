import Image from "next/image";

const WhatsApp = () => {
  return (
    <a
      href="https://api.whatsapp.com/send?phone=919899300017"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-[20px] left-6 z-[9999] max-md:bottom-[30px]"
    >
      <span
        className="block h-12 w-12 flex items-center justify-center rounded-full transition-all duration-300 shadow-[0_10px_25px_rgba(71,73,114,0.6)] hover:scale-110 "
        style={{
          background:"#2a2b44",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <Image
          src="/whatsapp.svg"
          alt="WhatsApp"
          width={22}
          height={22}
          className="relative z-10"
        />
      </span>
    </a>
  );
};

export default WhatsApp;