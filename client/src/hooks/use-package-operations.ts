
import { useState } from 'react';

interface InstallPackagesParams {
  language: string;
  packages: string[];
}

import { useMutation, useQuery } from '@tanstack/react-query';

export function usePackageOperations() {
  const installPackagesMutation = useMutation({
    mutationFn: async ({ language, packages }: InstallPackagesParams) => {
      const response = await fetch('/api/packages/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          packageList: packages.join(', ')
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to install packages');
      }

      return data;
    }
  });

  const listPackagesQuery = (language: string) => useQuery({
    queryKey: ['packages', language],
    queryFn: async () => {
      const response = await fetch(`/api/packages/list/${language}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to list packages');
      }

      return data;
    },
    enabled: !!language
  });

  return {
    installPackages: installPackagesMutation.mutateAsync,
    listPackages: listPackagesQuery,
    isInstalling: installPackagesMutation.isPending
  };
}
