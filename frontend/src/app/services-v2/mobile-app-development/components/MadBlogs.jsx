// Reuses the software-development Related Blogs section (identical design/styling).
// SdBlogs self-fetches the latest posts from the API when no blogs prop is passed.
import SdBlogs from "@/app/services-v2/software-development/components/SdBlogs";

export default function MadBlogs({ data, blogs }) {
  return <SdBlogs data={data} blogs={blogs} />;
}
