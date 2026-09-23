// Reuses the software-development FAQ section (identical design/styling),
// driven by mobile-specific questions from madData.
import SdFAQ from "@/app/services-v2/software-development/components/SdFAQ";

export default function MadFAQ({ data }) {
  return <SdFAQ data={data} />;
}
