import { useMutation } from '@tanstack/react-query';
import { useToast } from './use-toast';

interface FileReadRequest {
  filePath: string;
}

interface FileWriteRequest {
  filePath: string;
  content: string;
}

interface FileListRequest {
  dirPath?: string;
}

interface FileDeleteRequest {
  filePath: string;
}

interface FileEntry {
  name: string;
  path: string;
  isDirectory: boolean;
  isFile: boolean;
}

export function useFileOperations() {
  const { toast } = useToast();

  const readFile = useMutation({
    mutationFn: async ({ filePath }: { filePath: string }) => {
      const response = await fetch('/api/files/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || error.error || 'Failed to read file');
      }
      return response.json();
    },
  });

  const writeFile = useMutation({
    mutationFn: async ({ filePath, content }: { filePath: string; content: string }) => {
      const response = await fetch('/api/files/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath, content }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || error.error || 'Failed to write file');
      }
      return response.json();
    },
  });

  const listFiles = useMutation({
    mutationFn: async ({ dirPath }: { dirPath?: string }) => {
      const response = await fetch('/api/files/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dirPath }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || error.error || 'Failed to list files');
      }
      return response.json() as Promise<{ dirPath: string; files: FileEntry[] }>;
    },
  });

  const deleteFile = useMutation({
    mutationFn: async ({ filePath }: { filePath: string }) => {
      const response = await fetch('/api/files/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || error.error || 'Failed to delete file');
      }
      return response.json();
    },
  });

  return {
    readFile,
    writeFile,
    listFiles,
    deleteFile,
    toast,
  };
}