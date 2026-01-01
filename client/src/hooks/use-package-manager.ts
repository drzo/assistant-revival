
import { useMutation } from '@tanstack/react-query';
import { useToast } from './use-toast';

interface InstallPackageParams {
  language: string;
  packages: string[];
}

export function usePackageManager() {
  const { toast } = useToast();

  const installPackages = useMutation({
    mutationFn: async ({ language, packages }: InstallPackageParams) => {
      const installCmd = language === 'nodejs' 
        ? `npm install ${packages.join(' ')}`
        : language === 'python'
        ? `pip install ${packages.join(' ')}`
        : `install ${packages.join(' ')}`;

      const response = await fetch('/api/shell/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: installCmd })
      });

      if (!response.ok) {
        throw new Error('Failed to install packages');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      toast({
        title: 'Packages installed',
        description: `Installed ${variables.packages.join(', ')}`,
      });
    },
    onError: (error, variables) => {
      toast({
        title: 'Installation failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    },
  });

  return { installPackages };
}
