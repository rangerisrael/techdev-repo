import { bundledLanguages, codeToHtml } from "shiki";

import { CopyCodeButton } from "./copy-code-button";

/** VSCode's own bundled "Dark+" theme — the look the design is explicitly matching. */
const THEME = "dark-plus";

export async function CodeBlock({
  language,
  label,
  code,
}: {
  language: string;
  label?: string;
  code: string;
}) {
  const lang = language in bundledLanguages ? language : "text";
  const html = await codeToHtml(code, { lang, theme: THEME });

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-[#1e1e1e]">
      <div className="flex items-center justify-between border-b border-white/10 bg-[#2d2d2d] px-4 py-2">
        <span className="font-mono text-xs text-white/50">{label ?? language}</span>
        <CopyCodeButton code={code} />
      </div>
      <div
        className="overflow-x-auto p-4 text-[13px] leading-relaxed [&_pre]:!bg-transparent [&_pre]:whitespace-pre"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
