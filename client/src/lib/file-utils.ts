export function getLanguageFromFileName(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  const languageMap: Record<string, string> = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    py: "python",
    rb: "ruby",
    java: "java",
    cpp: "cpp",
    c: "c",
    cs: "csharp",
    go: "go",
    rs: "rust",
    php: "php",
    html: "html",
    css: "css",
    scss: "scss",
    sass: "sass",
    less: "less",
    json: "json",
    xml: "xml",
    yaml: "yaml",
    yml: "yaml",
    md: "markdown",
    sql: "sql",
    sh: "shell",
    bash: "shell",
    zsh: "shell",
    vue: "vue",
    svelte: "svelte",
    swift: "swift",
    kt: "kotlin",
    scala: "scala",
    r: "r",
    dart: "dart",
    lua: "lua",
    toml: "toml",
  };
  return languageMap[ext] || "plaintext";
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function getFileIcon(language: string): string {
  const iconMap: Record<string, string> = {
    javascript: "JS",
    typescript: "TS",
    python: "PY",
    ruby: "RB",
    java: "JV",
    cpp: "C+",
    c: "C",
    csharp: "C#",
    go: "GO",
    rust: "RS",
    php: "HP",
    html: "HT",
    css: "CS",
    json: "{}",
    markdown: "MD",
    sql: "SQ",
    shell: "SH",
  };
  return iconMap[language] || "FI";
}
