import { formatJSONResponse } from '@/libs/api-gateway';
import { middyfy } from '@/libs/lambda';

const handler = () => {
  return formatJSONResponse({ ok: true }, 200);
};

export const main = middyfy(handler);
