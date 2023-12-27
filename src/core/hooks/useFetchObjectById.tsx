import { useParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import _get from 'lodash/get';

export const useFetchObjectById = <T,>(apiAction: (value: any) => Promise<any>) => {
  const params = useParams();
  const id = _get(params, 'id') as string;

  const user = useQuery<T>(
    [apiAction.name, id],
    () => {
      return apiAction(id);
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  return user;
};
