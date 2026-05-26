// Netlify Function: decrement-slot.js
// Triggered by GHL webhook when someone purchases the Boss Her Tech Stack course
// Decrements slots_remaining in Supabase by 1

const SUPABASE_URL = 'https://dlsnpbzntajezchadfnc.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

exports.handler = async (event) => {

  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    // 1. Get current slot count
    const getRes = await fetch(
      `${SUPABASE_URL}/rest/v1/slots?id=eq.1&select=remaining`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const rows = await getRes.json();

    if (!rows || rows.length === 0) {
      return { statusCode: 404, body: 'Slots record not found' };
    }

    const current = rows[0].remaining;

    // Don't go below 0
    if (current <= 0) {
      return { statusCode: 200, body: JSON.stringify({ remaining: 0, message: 'No slots left' }) };
    }

    // 2. Decrement by 1
    const updateRes = await fetch(
      `${SUPABASE_URL}/rest/v1/slots?id=eq.1`,
      {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ remaining: current - 1 })
      }
    );

    const updated = await updateRes.json();
    const newCount = updated[0]?.remaining ?? current - 1;

    console.log(`Slot decremented: ${current} → ${newCount}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ remaining: newCount, success: true })
    };

  } catch (err) {
    console.error('Decrement error:', err);
    return { statusCode: 500, body: 'Server error: ' + err.message };
  }
};
