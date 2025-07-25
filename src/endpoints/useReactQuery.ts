'use client';

import { useCallback, useMemo } from 'react';
import {
  useMutation as tanstackUseMutation,
  useQuery as tanstackUseQuery,
  QueryOptions,
  QueryObserverOptions,
  MutationOptions,
  MutationObserverOptions,
  QueryKey,
} from '@tanstack/react-query';

const useReactQuery = () => {
  const useQuery = useCallback(
    <T>(
      keys: QueryKey,
      func: () => Promise<T>,
      options:
        | Omit<QueryOptions<T>, `queryKey`>
        | Omit<QueryObserverOptions<T>, `queryKey`> = {},
    ) => {
      const result = tanstackUseQuery<T, Error, T, QueryKey>({
        queryKey: keys,
        queryFn: func,
        staleTime: 0,
        retry: 0,
        retryDelay: 1000,
        ...options,
      });

      return {
        isLoading: result.isLoading,
        isSuccess: result.isSuccess,
        isError: result.isError,
        error: result.error,
        data: result.data,
        request: result.refetch,
      };
    },
    [],
  );

  const useMutation = useCallback(
    <T>(
      keys: QueryKey,
      func: (object: any) => Promise<T>,
      options: MutationOptions<T> | MutationObserverOptions<T> = {},
    ) => {
      const result = tanstackUseMutation<T, any, any>({
        mutationKey: keys,
        mutationFn: func,
        retry: 0,
        retryDelay: 1000,
        ...options,
      });

      return {
        isLoading: result.isPending,
        isSuccess: result.isSuccess,
        isError: result.isError,
        error: result.error,
        data: result.data,
        request: result.mutateAsync,
        reset: result.reset,
      };
    },
    [],
  );

  const queries = useMemo(() => {
    return {
      useQuery,
      useMutation,
    };
  }, [useMutation, useQuery]);

  return queries;
};

export { useReactQuery };
