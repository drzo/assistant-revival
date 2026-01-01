
import { Router, Request, Response } from 'express';
import type { Express } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface PackageInstallRequest {
  language: string;
  packageList: string;
}

export function registerPackageManagerRoutes(app: Express) {
  // Install packages
  app.post('/api/packages/install', async (req: Request, res: Response) => {
    try {
      const { language, packageList }: PackageInstallRequest = req.body;

      if (!language || !packageList) {
        return res.status(400).json({ 
          error: 'language and packageList are required' 
        });
      }

      const packages = packageList.split(',').map(p => p.trim()).filter(Boolean);
      
      if (packages.length === 0) {
        return res.status(400).json({ error: 'No valid packages provided' });
      }

      let installCommand = '';
      
      switch (language.toLowerCase()) {
        case 'nodejs':
        case 'javascript':
        case 'typescript':
          installCommand = `npm install --no-audit ${packages.join(' ')}`;
          break;
        case 'python':
          installCommand = `pip install ${packages.join(' ')}`;
          break;
        case 'ruby':
          installCommand = `gem install ${packages.join(' ')}`;
          break;
        default:
          return res.status(400).json({ 
            error: `Unsupported language: ${language}` 
          });
      }

      console.log(`[Package Manager] Installing: ${installCommand}`);

      const { stdout, stderr } = await execAsync(installCommand, {
        maxBuffer: 1024 * 1024 * 10
      });

      res.json({
        success: true,
        language,
        packages,
        output: stdout || stderr,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Error installing packages:', error);
      res.status(500).json({ 
        error: 'Failed to install packages',
        details: error.message,
        output: error.stdout || error.stderr || ""
      });
    }
  });

  // Get installed packages
  app.get('/api/packages/list/:language', async (req: Request, res: Response) => {
    try {
      const { language } = req.params;
      let listCommand = '';

      switch (language.toLowerCase()) {
        case 'nodejs':
        case 'javascript':
        case 'typescript':
          listCommand = 'npm list --depth=0 --json';
          break;
        case 'python':
          listCommand = 'pip list --format=json';
          break;
        default:
          return res.status(400).json({ 
            error: `Unsupported language: ${language}` 
          });
      }

      const { stdout } = await execAsync(listCommand);
      const packages = JSON.parse(stdout);

      res.json({ language, packages });
    } catch (error: any) {
      console.error('Error listing packages:', error);
      res.status(500).json({ 
        error: 'Failed to list packages',
        details: error.message 
      });
    }
  });
}
