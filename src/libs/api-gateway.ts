export function formatJSONResponse(
  response: unknown,
  statusCode: number = 200,
) {
  return {
    body: JSON.stringify(response),
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
}
