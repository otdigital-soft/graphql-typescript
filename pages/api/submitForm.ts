import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

const submitForm = async (request: VercelRequest, response: VercelResponse) => {
  const { email } = request.body;
  const submit = axios.create({
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Cookie: process.env.KLAVIYO_COOKIES,
    },
  });
  const raw = JSON.stringify({
    profiles: [
      {
        email: email,
      },
    ],
  });
  try {
    const { status } = await submit.post(
      `${process.env.KLAVIYO_SUBSCRIBE_URL}/list/${process.env.KLAVIYO_LIST_ID}/subscribe?api_key=${process.env.KLAVIYO_API_KEY}`,
      raw
    );
    if (status === 200) return response.status(200).json({ ok: true });
  } catch {
    return response.status(400).json({ ok: false });
  }
};

export default submitForm;
