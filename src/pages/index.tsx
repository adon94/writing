import dynamic from "next/dynamic";

const DynamicDraft = dynamic(() => import("@/components/DraftEditor"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen flex justify-start items-end relative">
      <DynamicDraft />
    </main>
  );
}
