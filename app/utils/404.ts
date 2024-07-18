import { json } from '@remix-run/node';

export function api404(message = 'No API route found at this URL') {
  return json(
    {
      status: 404,
      message,
    },
    { status: 404 }
  );
}
