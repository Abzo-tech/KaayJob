import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  resolve?: (value: boolean) => void;
}

export function useConfirmDialog() {
  const [dialogState, setDialogState] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    description: '',
    confirmText: 'Confirmer',
    cancelText: 'Annuler',
  });

  const confirm = (
    title: string,
    description: string,
    confirmText = 'Confirmer',
    cancelText = 'Annuler'
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialogState({
        isOpen: true,
        title,
        description,
        confirmText,
        cancelText,
        resolve,
      });
    });
  };

  const handleConfirm = () => {
    setDialogState(prev => ({ ...prev, isOpen: false }));
    dialogState.resolve?.(true);
  };

  const handleCancel = () => {
    setDialogState(prev => ({ ...prev, isOpen: false }));
    dialogState.resolve?.(false);
  };

  const closeDialog = () => {
    setDialogState(prev => ({ ...prev, isOpen: false }));
    dialogState.resolve?.(false);
  };

  const ConfirmDialogComponent = () => (
    <AlertDialog open={dialogState.isOpen} onOpenChange={(open) => {
      if (!open) closeDialog();
    }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogState.title}</AlertDialogTitle>
          <AlertDialogDescription>{dialogState.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {dialogState.cancelText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {dialogState.confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return {
    confirm,
    ConfirmDialog: ConfirmDialogComponent,
  };
}