import type { Metadata } from "next";
import { CodeEditorMock } from "@/components/CodeEditorMock";
import { ScaledViewport } from "@/components/ScaledViewport";

export const metadata: Metadata = {
  title: "Luna",
  description: "Editor shell mock",
};

export default function Home() {
  return (
    <ScaledViewport>
      <CodeEditorMock />
    </ScaledViewport>
  );
}
