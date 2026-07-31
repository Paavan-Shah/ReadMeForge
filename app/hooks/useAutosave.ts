import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';

const AUTOSAVE_DELAY = 1500;

export function useAutosave() {
  const project = useAppStore((s) => s.project);
  const saveCurrentProject = useAppStore((s) => s.saveCurrentProject);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    // Skip autosave on first mount
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      saveCurrentProject();
    }, AUTOSAVE_DELAY);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [project, saveCurrentProject]);
}
