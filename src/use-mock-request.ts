import { useEffect, useState } from "react";

interface RequestState<TData> {
  data: TData | undefined;
  isLoading: boolean;
}

export const useMockRequest = <TData>(request: () => Promise<TData>, dependencies: readonly unknown[] = []) => {
  const [state, setState] = useState<RequestState<TData>>({
    data: undefined,
    isLoading: true,
  });

  useEffect(() => {
    let isActive = true;

    setState((current) => ({
      data: current.data,
      isLoading: true,
    }));

    void request().then((data) => {
      if (isActive) {
        setState({
          data,
          isLoading: false,
        });
      }
    });

    return () => {
      isActive = false;
    };
  }, dependencies);

  return state;
};
