import { redirect } from "next/navigation";

/** Entry URL: /presentation2026malaga → self-contained deck HTML. */
export default function PresentationPage() {
  redirect("/presentation2026malaga/deck");
}
