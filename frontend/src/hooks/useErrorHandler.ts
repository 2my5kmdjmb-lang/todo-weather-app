import { useState, useCallback } from 'react';

interface ErrorState {
  error: string | null;
  isVisible: boolean;
}

export const useErrorHandler = () => {
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isVisible: false
  });

  const showError = useCallback((message: string) => {
    setErrorState({
      error: message,
      isVisible: true
    });
  }, []);

  const hideError = useCallback(() => {
    setErrorState({
      error: null,
      isVisible: false
    });
  }, []);

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      isVisible: false
    });
  }, []);

  return {
    error: errorState.error,
    isErrorVisible: errorState.isVisible,
    showError,
    hideError,
    clearError
  };
};