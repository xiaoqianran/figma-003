import { useToast } from '../components/ui';
import { useDemoState } from '../context/DemoStateContext';

export function useGodyToast() {
  const toast = useToast();
  const demo = useDemoState();

  const successWithLog = (title: string, message?: string, action?: string) => {
    toast.success(title, message);
    if (action) demo.addRecentAction(action);
  };

  const infoWithLog = (title: string, message?: string, action?: string) => {
    toast.info(title, message);
    if (action) demo.addRecentAction(action);
  };

  return {
    ...toast,
    successWithLog,
    infoWithLog,
  };
}
