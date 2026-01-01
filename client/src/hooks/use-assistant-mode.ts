
import { useState, useEffect } from 'react';
import { useAssistantStore } from './use-assistant-store';

export type AssistantMode = 'basic' | 'advanced';

export function useAssistantMode() {
  const { settings } = useAssistantStore();
  const [mode, setMode] = useState<AssistantMode>('basic');

  // Detect mode based on settings and context
  useEffect(() => {
    if (settings.autoApplyChanges) {
      setMode('advanced');
    } else {
      setMode('basic');
    }
  }, [settings.autoApplyChanges]);

  const isAdvancedMode = mode === 'advanced';
  const isBasicMode = mode === 'basic';

  return {
    mode,
    setMode,
    isAdvancedMode,
    isBasicMode
  };
}
