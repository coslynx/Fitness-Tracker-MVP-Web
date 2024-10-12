'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@/common/constants';
import { getAuthToken } from '@/common/utils';

interface UseFetchProps<T> {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: any;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
}

const useFetch = <T>(props: UseFetchProps<T>): [T | null, boolean, any] => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = getAuthToken();
        const response = await axios({
          method: props.method || 'GET',
          url: `${API_URL}${props.url}`,
          data: props.body,
          headers: {
            ...props.headers,
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });

        setData(response.data);
        props.onSuccess && props.onSuccess(response.data);
      } catch (error: any) {
        setError(error);
        props.onError && props.onError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [props.url, props.method, props.body, props.headers, props.onSuccess, props.onError]);

  return [data, isLoading, error];
};

export default useFetch;