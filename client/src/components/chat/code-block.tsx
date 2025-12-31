import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language: string;
  fileName?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language, fileName, showLineNumbers = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-2 rounded-md border border-border overflow-hidden bg-muted/30">
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-muted/50 border-b border-border">
        <div className="flex items-center gap-2">
          {fileName && (
            <span className="text-xs font-mono text-muted-foreground">{fileName}</span>
          )}
          <span className="text-xs font-mono text-muted-foreground uppercase">{language}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handleCopy}
          data-testid="button-copy-code"
        >
          {copied ? (
            <Check className="h-3 w-3 text-chart-2" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <pre className="p-3 text-sm font-mono leading-relaxed">
          <code>
            {lines.map((line, index) => (
              <div key={index} className="flex">
                {showLineNumbers && (
                  <span className="select-none pr-4 text-muted-foreground/50 text-right min-w-[2.5rem]">
                    {index + 1}
                  </span>
                )}
                <span className={cn("flex-1", !line && "h-5")}>{line || " "}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
