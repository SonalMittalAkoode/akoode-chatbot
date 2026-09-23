import { notFound } from "next/navigation";

// This route exists only as a development/staging workspace for the
// StaffAugmentationTemplate components. The live page is served at
// /services/<slug> via the dynamic [slug] route, driven by an Updated
// Services CMS record with template = "staff-augmentation".
export default function StaffAugmentationDevPage() {
  notFound();
}
