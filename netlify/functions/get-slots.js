// Netlify Function: get-slots.js
// Called by the course page on load to show current available spots

const SUPABASE_URL = 'https://dlsnpbzntajezchadfnc.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

exports.handler = async (event) => {

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/slots?id=eq.1&select=remaining`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    const rows = await res.json();
    const remaining = rows?.[0]?.remaining ?? 10;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ remaining })
    };

  } catch (err) {
    // Fail gracefully — show 10 if something goes wrong
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ remaining: 10, error: err.message })
    };
  }
};
