import { defineChatSessionFunction } from "node-llama-cpp";
import fs from "fs-extra";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * Define Assistant Revival tool functions that can be called by the local LLM
 */

export const assistantFunctions = {
  /**
   * Read file contents
   */
  readFile: defineChatSessionFunction({
    description: "Read the contents of a file from the workspace. Returns the file content as a string. Use this when you need to examine code, configuration, or documentation files.",
    params: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description: "The relative or absolute path to the file to read"
        }
      }
    },
    async handler(params: { filePath: string }) {
      try {
        const content = await fs.readFile(params.filePath, "utf-8");
        return {
          success: true,
          filePath: params.filePath,
          content,
          size: content.length
        };
      } catch (error: any) {
        return {
          success: false,
          filePath: params.filePath,
          error: error.message
        };
      }
    }
  }),

  /**
   * Write file contents
   */
  writeFile: defineChatSessionFunction({
    description: "Write content to a file in the workspace. Creates the file if it doesn't exist, overwrites if it does. Use this to create new files or update existing ones.",
    params: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description: "The relative or absolute path where the file should be written"
        },
        content: {
          type: "string",
          description: "The content to write to the file"
        }
      }
    },
    async handler(params: { filePath: string; content: string }) {
      try {
        await fs.ensureDir(path.dirname(params.filePath));
        await fs.writeFile(params.filePath, params.content, "utf-8");
        return {
          success: true,
          filePath: params.filePath,
          bytesWritten: params.content.length
        };
      } catch (error: any) {
        return {
          success: false,
          filePath: params.filePath,
          error: error.message
        };
      }
    }
  }),

  /**
   * List directory contents
   */
  listDirectory: defineChatSessionFunction({
    description: "List all files and directories in a given path. Returns an array of file/directory names with their types. Use this to explore the workspace structure.",
    params: {
      type: "object",
      properties: {
        dirPath: {
          type: "string",
          description: "The path to the directory to list"
        }
      }
    },
    async handler(params: { dirPath: string }) {
      try {
        const entries = await fs.readdir(params.dirPath, { withFileTypes: true });
        const items = entries.map(entry => ({
          name: entry.name,
          type: entry.isDirectory() ? "directory" : "file",
          path: path.join(params.dirPath, entry.name)
        }));
        return {
          success: true,
          dirPath: params.dirPath,
          items,
          count: items.length
        };
      } catch (error: any) {
        return {
          success: false,
          dirPath: params.dirPath,
          error: error.message
        };
      }
    }
  }),

  /**
   * Execute shell command
   */
  executeShell: defineChatSessionFunction({
    description: "Execute a shell command in the workspace. Returns stdout, stderr, and exit code. Use this for running build commands, tests, or system operations. Be cautious with destructive commands.",
    params: {
      type: "object",
      properties: {
        command: {
          type: "string",
          description: "The shell command to execute"
        },
        workingDir: {
          type: "string",
          description: "Optional working directory for command execution"
        }
      }
    },
    async handler(params: { command: string; workingDir?: string }) {
      try {
        const options = params.workingDir ? { cwd: params.workingDir } : {};
        const { stdout, stderr } = await execAsync(params.command, options);
        return {
          success: true,
          command: params.command,
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          exitCode: 0
        };
      } catch (error: any) {
        return {
          success: false,
          command: params.command,
          stdout: error.stdout?.trim() || "",
          stderr: error.stderr?.trim() || error.message,
          exitCode: error.code || 1
        };
      }
    }
  }),

  /**
   * Search files by pattern
   */
  searchFiles: defineChatSessionFunction({
    description: "Search for files matching a glob pattern in the workspace. Returns an array of matching file paths. Use this to find specific files or file types.",
    params: {
      type: "object",
      properties: {
        pattern: {
          type: "string",
          description: "Glob pattern to match files (e.g., '**/*.ts' for all TypeScript files)"
        },
        baseDir: {
          type: "string",
          description: "Base directory to start search from"
        }
      }
    },
    async handler(params: { pattern: string; baseDir: string }) {
      try {
        const glob = require("glob");
        const files = await new Promise<string[]>((resolve, reject) => {
          glob(params.pattern, { cwd: params.baseDir }, (err: any, matches: string[]) => {
            if (err) reject(err);
            else resolve(matches);
          });
        });
        return {
          success: true,
          pattern: params.pattern,
          baseDir: params.baseDir,
          files,
          count: files.length
        };
      } catch (error: any) {
        return {
          success: false,
          pattern: params.pattern,
          baseDir: params.baseDir,
          error: error.message
        };
      }
    }
  }),

  /**
   * Get file metadata
   */
  getFileInfo: defineChatSessionFunction({
    description: "Get metadata about a file including size, creation time, modification time, and type. Use this to check file properties without reading the full content.",
    params: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description: "Path to the file to inspect"
        }
      }
    },
    async handler(params: { filePath: string }) {
      try {
        const stats = await fs.stat(params.filePath);
        return {
          success: true,
          filePath: params.filePath,
          size: stats.size,
          isDirectory: stats.isDirectory(),
          isFile: stats.isFile(),
          created: stats.birthtime.toISOString(),
          modified: stats.mtime.toISOString(),
          accessed: stats.atime.toISOString()
        };
      } catch (error: any) {
        return {
          success: false,
          filePath: params.filePath,
          error: error.message
        };
      }
    }
  }),

  /**
   * Create directory
   */
  createDirectory: defineChatSessionFunction({
    description: "Create a new directory in the workspace. Creates parent directories if they don't exist. Use this to organize files into folders.",
    params: {
      type: "object",
      properties: {
        dirPath: {
          type: "string",
          description: "Path to the directory to create"
        }
      }
    },
    async handler(params: { dirPath: string }) {
      try {
        await fs.ensureDir(params.dirPath);
        return {
          success: true,
          dirPath: params.dirPath,
          message: "Directory created successfully"
        };
      } catch (error: any) {
        return {
          success: false,
          dirPath: params.dirPath,
          error: error.message
        };
      }
    }
  }),

  /**
   * Delete file or directory
   */
  deleteFileOrDir: defineChatSessionFunction({
    description: "Delete a file or directory from the workspace. For directories, removes all contents recursively. Use with caution as this operation cannot be undone.",
    params: {
      type: "object",
      properties: {
        targetPath: {
          type: "string",
          description: "Path to the file or directory to delete"
        }
      }
    },
    async handler(params: { targetPath: string }) {
      try {
        await fs.remove(params.targetPath);
        return {
          success: true,
          targetPath: params.targetPath,
          message: "File or directory deleted successfully"
        };
      } catch (error: any) {
        return {
          success: false,
          targetPath: params.targetPath,
          error: error.message
        };
      }
    }
  }),

  /**
   * Search file contents
   */
  searchInFiles: defineChatSessionFunction({
    description: "Search for a text pattern within file contents. Returns matching files and line numbers. Use this to find specific code or text across multiple files.",
    params: {
      type: "object",
      properties: {
        searchText: {
          type: "string",
          description: "Text or regex pattern to search for"
        },
        filePattern: {
          type: "string",
          description: "Glob pattern for files to search (e.g., '**/*.ts')"
        },
        baseDir: {
          type: "string",
          description: "Base directory to search in"
        }
      }
    },
    async handler(params: { searchText: string; filePattern: string; baseDir: string }) {
      try {
        const glob = require("glob");
        const files = await new Promise<string[]>((resolve, reject) => {
          glob(params.filePattern, { cwd: params.baseDir }, (err: any, matches: string[]) => {
            if (err) reject(err);
            else resolve(matches);
          });
        });

        const results: Array<{ file: string; matches: Array<{ line: number; text: string }> }> = [];
        const searchRegex = new RegExp(params.searchText, "gi");

        for (const file of files) {
          const fullPath = path.join(params.baseDir, file);
          try {
            const content = await fs.readFile(fullPath, "utf-8");
            const lines = content.split("\n");
            const matches: Array<{ line: number; text: string }> = [];

            lines.forEach((line, index) => {
              if (searchRegex.test(line)) {
                matches.push({ line: index + 1, text: line.trim() });
              }
            });

            if (matches.length > 0) {
              results.push({ file, matches });
            }
          } catch (err) {
            // Skip files that can't be read
            continue;
          }
        }

        return {
          success: true,
          searchText: params.searchText,
          filePattern: params.filePattern,
          baseDir: params.baseDir,
          results,
          filesSearched: files.length,
          filesWithMatches: results.length
        };
      } catch (error: any) {
        return {
          success: false,
          searchText: params.searchText,
          error: error.message
        };
      }
    }
  })
};

/**
 * Get a subset of functions based on permissions or context
 */
export function getFilteredFunctions(allowedFunctions?: string[]): Record<string, any> {
  if (!allowedFunctions) {
    return assistantFunctions;
  }

  const filtered: Record<string, any> = {};
  for (const funcName of allowedFunctions) {
    if (funcName in assistantFunctions) {
      filtered[funcName] = assistantFunctions[funcName as keyof typeof assistantFunctions];
    }
  }
  return filtered;
}
