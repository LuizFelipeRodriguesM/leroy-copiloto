import type { Metadata } from "next";
import { CopilotApp } from "@/components/copilot/copilot-app";

export const metadata: Metadata = {
  title: "Charles · Leroy Copiloto",
  description: "Conta o problema, responde duas perguntas e o Charles monta a lista, a rota e acha o produto certo na prateleira.",
};

export default function AppPage() {
  return <CopilotApp />;
}
