import { MOCK, useHttpRequest, useReactQuery } from '@/endpoints';
import { CONFIG, CONSTANTS } from '@/commons';

const KEY_POST = CONSTANTS.CRASH_PARAMS;

const useCrashParams = ({ token = ``, enabled = false }) => {
  const httpRequest = useHttpRequest();

  return useReactQuery().useQuery(
    [KEY_POST],
    async () => {
      try {
        const result: typeof MOCK.crashParams = await httpRequest.get({
          url: `${CONFIG.DOMAIN_URL}crashParams`,
          body: {},
          headers: { Authorization: `Bearer ${token}` },
        });

        return {
          status: result.status,
          data: {
            bias_probability: result.data.bias_probability,
            bias_point: result.data.bias_point,
            maximum_multiplier: result.data.maximum_multiplier,
          },
        };
      } catch (error) {
        throw error;
      }
    },
    { enabled },
  );
};

export { useCrashParams };
