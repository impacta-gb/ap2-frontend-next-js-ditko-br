'use client';

import { useState, useCallback, useEffect } from 'react';
import { ApiError } from '../types';
import { ApiErrorHandler } from '../lib/utils';

interface UseApiState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  success: boolean;
}

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

/**
 * Hook para chamadas de API
 */
export const useApi = <T,>(options?: UseApiOptions) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    error: null,
    loading: false,
    success: false,
  });

  const request = useCallback(
    async (apiCall: () => Promise<T>) => {
      setState({ data: null, error: null, loading: true, success: false });

      try {
        const result = await apiCall();
        setState({ data: result, error: null, loading: false, success: true });
        options?.onSuccess?.(result);
      } catch (err) {
        const errorMessage = ApiErrorHandler.handle(err);
        setState({
          data: null,
          error: errorMessage,
          loading: false,
          success: false,
        });
        options?.onError?.(errorMessage);
      }
    },
    [options]
  );

  return { ...state, request };
};

/**
 * Hook para carregar dados ao montar o componente
 */
export const useFetch = <T,>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    error: null,
    loading: true,
    success: false,
  });

  const [refetch, setRefetch] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setState({ data: null, error: null, loading: true, success: false });
      try {
        const result = await apiCall();
        if (isMounted) {
          setState({ data: result, error: null, loading: false, success: true });
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = ApiErrorHandler.handle(err);
          setState({
            data: null,
            error: errorMessage,
            loading: false,
            success: false,
          });
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [refetch, ...dependencies]);

  return {
    ...state,
    refetch: () => setRefetch((prev) => prev + 1),
  };
};
