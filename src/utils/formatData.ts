export function formatData(data: string): string {
  const time = new Date(data);
  const formatador = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const response = formatador.format(time);

  return response;
}
