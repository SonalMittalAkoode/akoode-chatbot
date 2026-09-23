import Image from "next/image";
import { Star } from "lucide-react";
import resolveImageUrl from "@/utils/resolveImageUrl";

export default function ReviewCard({ testimonial }) {
    if (!testimonial) return null;

    // Map database fields to component fields
    const name = testimonial.title || testimonial.name;
    const role = testimonial.designation || testimonial.role;
    const text = testimonial.description || testimonial.text;
    const stars = testimonial.star || 5;
    const image = testimonial.logoimage || testimonial.image;

    const imageSrc = resolveImageUrl(image);

    return (
        <div className="rounded-xl border-1 border-[#1E293B] overflow-hidden h-full flex flex-col transition-all duration-500">
            {/* Header Section (Gray Background) */}
            <div className="bg-[#f8fafb] p-4 md:p-4 flex items-center gap-5">
                <div className="md:w-14 md:h-14 w-12 h-12   rounded-full overflow-hidden relative border-2 border-white shadow-sm flex-shrink-0 bg-slate-200">
                    {imageSrc ? (
                        <Image
                        src={imageSrc}
                        alt={`Profile photo of ${name}`}
                        fill
                        className="object-cover"
                    />
                    ) : (
                        <div className={`w-full h-full flex items-center justify-center text-white text-xl font-bold ${testimonial.avatarBg || 'bg-slate-400'}`}>
                            {testimonial.avatar || name?.charAt(0)}
                        </div>
                    )}
                </div>
                <div>
                    <h3 className="text-md font-bold text-[#1e293b] leading-tight mb-1">{name}</h3>
                    <p className="text-[#585c9c] font-sm text-[13px]">{role}</p>
                </div>
            </div>

            {/* Body Section (White Background) */}
            <div className="bg-white p-4 md:p-8 flex-grow">
                {/* Stars */}
                <div className="flex gap-1.5 mb-5 text-[#8b91cc]">
                    {[...Array(Math.round(stars))].map((_, i) => (
                        <Star key={i} className="text-sm fill-current" size={14} />
                    ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-[#101828] md:text-[17px] text-[15px] leading-[1.6] line-clamp-5">
                    {text}
                </p>
            </div>
        </div>
    );
}
