import { MOCK, useHttpRequest, useReactQuery } from '@/endpoints';
import { CONFIG, CONSTANTS } from '@/commons';

const KEY_POST = CONSTANTS.SUBMIT_NET_AMOUNT;

const useSubmitNetAmount = ({ token = `` }) => {
  const httpRequest = useHttpRequest();

  return useReactQuery().useMutation([KEY_POST], async (amount) => {
    try {
      const result: typeof MOCK.submitNetAmount = await httpRequest.post({
        url: `${CONFIG.DOMAIN_URL}submitNetAmount`,
        body: { amount },
        headers: { Authorization: `Bearer ${token}` },
      });

      return {
        status: result.status,
        data: result.data,
      };
    } catch (error) {
      throw error;
    }
  });
};

export { useSubmitNetAmount };
