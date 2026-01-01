import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-2 px-4 py-2">
      <div className="flex-shrink-0 w-6 h-6 rounded-sm bg-primary flex items-center justify-center mt-1">
        <Bot className="h-3.5 w-3.5 text-primary-foreground" />
      </div>
      <div className="flex-1">
        <div className="text-xs font-medium text-muted-foreground mb-1">Assistant</div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-pulse" style={{ animationDelay: "0ms" }} />
          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-pulse" style={{ animationDelay: "150ms" }} />
          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-pulse" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
