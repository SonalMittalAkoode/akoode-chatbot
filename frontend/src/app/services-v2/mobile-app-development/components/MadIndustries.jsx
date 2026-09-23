// Reuses the software-development Industries section (identical design/styling),
// driven by mobile-specific heading/intro. Falls back to its built-in industry list.
import SdIndustries from "@/app/services-v2/software-development/components/SdIndustries";

export default function MadIndustries({ data }) {
  return <SdIndustries data={data} />;
}
