import { useEffect, useState } from "react";

interface RequestState<TData> {
  data: TData | undefined;
  error: Error | undefined;
  isLoading: boolean;
}

export const useMockRequest = <TData>(request: () => Promise<TData>, dependencies: readonly unknown[] = []) => {
  const [state, setState] = useState<RequestState<TData>>({
    data: undefined,
    error: undefined,
    isLoading: true,
  });

  useEffect(() => {
    let isActive = true;

    setState((current) => ({
      data: current.data,
      error: undefined,
      isLoading: true,
    }));

    void request()
      .then((data) => {
        if (isActive) {
          setState({
            data,
            error: undefined,
            isLoading: false,
          });
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          setState((current) => ({
            data: current.data,
            error: error instanceof Error ? error : new Error("Request failed"),
            isLoading: false,
          }));
        }
      });

    return () => {
      isActive = false;
    };
  }, dependencies);

  return state;
};
