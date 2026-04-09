'use client';

import { useState, useEffect } from 'react';

interface UseMockDataState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  success: boolean;
}

/**
 * Hook para carregar dados mockados ao montar o componente
 * Simula um delay de API
 */
export const useMockData = <T,>(
  mockData: T,
  delayMs: number = 500
) => {
  const [state, setState] = useState<UseMockDataState<T>>({
    data: null,
    error: null,
    loading: true,
    success: false,
  });

  const [refetch, setRefetch] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const timer = setTimeout(() => {
      if (isMounted) {
        setState({
          data: mockData,
          error: null,
          loading: false,
          success: true,
        });
      }
    }, delayMs);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [mockData, delayMs, refetch]);

  return {
    ...state,
    refetch: () => setRefetch((prev) => prev + 1),
  };
};
