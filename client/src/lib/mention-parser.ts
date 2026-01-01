import type { File } from "@shared/schema";

export function parseFileMentions(message: string, files: File[]) {
  const mentionedFileIds: string[] = [];
  const mentionedFileNames: string[] = [];
  
  const mentionPattern = /@([\w\-\.]+)/g;
  let match;
  
  while ((match = mentionPattern.exec(message)) !== null) {
    const fileName = match[1];
    
    const file = files.find(f => f.name === fileName || f.name.includes(fileName));
    if (file) {
      mentionedFileIds.push(file.id);
      mentionedFileNames.push(file.name);
    }
  }
  
  return {
    cleanMessage: message,
    mentionedFileIds: Array.from(new Set(mentionedFileIds)),
    mentionedFileNames: Array.from(new Set(mentionedFileNames))
  };
}

export function extractFileContext(mentionedFileIds: string[], files: File[]): string {
  if (mentionedFileIds.length === 0) return '';
  
  let context = '\n\nReferenced files:\n';
  
  for (const fileId of mentionedFileIds) {
    const file = files.find(f => f.id === fileId);
    if (file) {
      context += `\nFile: ${file.name}\n\`\`\`${file.language || 'plaintext'}\n${file.content}\n\`\`\`\n`;
    }
  }
  
  return context;
}

export function highlightMentions(message: string, files: File[]): string {
  const { mentionedFileNames } = parseFileMentions(message, files);
  
  let highlighted = message;
  for (const fileName of mentionedFileNames) {
    const mentionPattern = new RegExp(`@${fileName}`, 'g');
    highlighted = highlighted.replace(mentionPattern, `**@${fileName}**`);
  }
  
  return highlighted;
}
