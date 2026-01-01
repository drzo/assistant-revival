
import { createTool } from '@mastra/core';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

// Tool for reading file contents
export const readFileTool = createTool({
  id: 'read-file',
  description: 'Read the contents of a file in the project',
  inputSchema: z.object({
    filePath: z.string().describe('Path to the file relative to project root'),
  }),
  execute: async ({ context }) => {
    const { filePath } = context;
    try {
      const fullPath = path.join(process.cwd(), filePath);
      const content = await fs.readFile(fullPath, 'utf-8');
      return {
        success: true,
        content,
        path: filePath,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to read file',
      };
    }
  },
});

// Tool for listing directory contents
export const listDirectoryTool = createTool({
  id: 'list-directory',
  description: 'List files and directories in a given path',
  inputSchema: z.object({
    dirPath: z.string().describe('Path to the directory relative to project root'),
  }),
  execute: async ({ context }) => {
    const { dirPath } = context;
    try {
      const fullPath = path.join(process.cwd(), dirPath);
      const entries = await fs.readdir(fullPath, { withFileTypes: true });
      
      const files = entries
        .filter(e => e.isFile())
        .map(e => e.name);
      
      const directories = entries
        .filter(e => e.isDirectory())
        .map(e => e.name);
      
      return {
        success: true,
        path: dirPath,
        files,
        directories,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list directory',
      };
    }
  },
});

// Tool for analyzing code patterns
export const analyzeCodeTool = createTool({
  id: 'analyze-code',
  description: 'Analyze code for patterns, issues, and improvements',
  inputSchema: z.object({
    code: z.string().describe('Code to analyze'),
    language: z.string().describe('Programming language'),
    analysisType: z.enum(['security', 'performance', 'quality', 'patterns']).describe('Type of analysis'),
  }),
  execute: async ({ context }) => {
    const { code, language, analysisType } = context;
    
    // This is a simple pattern detection - can be extended with actual linters
    const issues: string[] = [];
    
    if (analysisType === 'security' || analysisType === 'quality') {
      if (code.includes('eval(')) {
        issues.push('Avoid using eval() - it can execute arbitrary code');
      }
      if (code.match(/password\s*=\s*['"][^'"]+['"]/i)) {
        issues.push('Hardcoded credentials detected - use environment variables');
      }
    }
    
    if (analysisType === 'performance' || analysisType === 'quality') {
      if (code.includes('for (') && code.includes('.push(')) {
        issues.push('Consider using map/filter/reduce for functional transformations');
      }
    }
    
    return {
      success: true,
      language,
      analysisType,
      issues,
      codeLength: code.length,
    };
  },
});

// Export all tools
export const mastraTools = {
  readFile: readFileTool,
  listDirectory: listDirectoryTool,
  analyzeCode: analyzeCodeTool,
};
