
import { useState, useCallback } from 'react';
import { useAssistantStore } from './use-assistant-store';
import { parseCodeChangesFromMessage } from '@/lib/code-change-applier';

export function useChatStream() {
  const [isStreaming, setIsStreaming] = useState(false);
  const { addMessage, updateMessage, settings, setPendingChanges, files } = useAssistantStore();

  const sendMessage = useCallback(async (
    content: string,
    mentionedFiles: string[] = [],
    systemPrompt?: string,
    agentName?: string
  ) => {
    setIsStreaming(true);

    const userMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user' as const,
      content,
      createdAt: new Date().toISOString(),
      mentionedFiles: mentionedFiles.length > 0 ? mentionedFiles : undefined,
    };
    addMessage(userMessage);

    const assistantMessageId = `msg-${Date.now()}-assistant`;
    addMessage({
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
    });

    try {
      const fileContext = mentionedFiles
        .map(fileId => {
          const file = files.find(f => f.id === fileId);
          return file ? {
            name: file.name,
            content: file.content,
            language: file.language,
          } : null;
        })
        .filter(Boolean);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          files: fileContext,
          systemPrompt,
          agentName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let buffer = '';
      let metadata: any = {};

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.content) {
                buffer += data.content;
                updateMessage(assistantMessageId, { content: buffer });
              }

              if (data.metadata) {
                metadata = { ...metadata, ...data.metadata };
              }

              if (data.codeChanges) {
                metadata.codeChanges = data.codeChanges;
                if (!settings.autoApplyChanges) {
                  setPendingChanges(data.codeChanges);
                }
              }

              if (data.done) {
                const { 
                  fileEdits, 
                  shellCommands, 
                  packageInstalls,
                } = parseCodeChangesFromMessage(buffer);
                
                updateMessage(assistantMessageId, {
                  content: buffer,
                  metadata: { 
                    ...metadata, 
                    fileEdits, 
                    shellCommands, 
                    packageInstalls,
                  },
                } as any);

                if (settings.autoApplyChanges && fileEdits.length > 0) {
                  const changes = fileEdits.map(edit => ({
                    fileId: edit.file,
                    fileName: edit.file,
                    oldContent: edit.oldContent || '',
                    newContent: edit.newContent || '',
                    description: `${edit.added} additions, ${edit.removed} deletions`
                  }));
                  setPendingChanges(changes);
                }
              }
            } catch (parseError) {
              continue;
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      updateMessage(assistantMessageId, {
        content: 'Sorry, I encountered an error processing your request.',
      });
    } finally {
      setIsStreaming(false);
    }
  }, [addMessage, updateMessage, files, settings, setPendingChanges]);

  return { sendMessage, isStreaming };
}
