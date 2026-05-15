"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import type { ApiResponse } from "@/types";

export function useData<T>(url: string, options?: { params?: Record<string, any> }) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get<ApiResponse<T>>(url, { params: options?.params })
      .then((res) => {
        if (!cancelled) {
          setData(res.data.data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message ?? "An error occurred.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [url, JSON.stringify(options?.params)]);

  const refetch = async () => {
    setLoading(true);
    try {
      const res = await api.get<ApiResponse<T>>(url, { params: options?.params });
      setData(res.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message ?? "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}
