export default {
  async fetch(request, env) {
    // CORS設定（Pagesからの通信を許可）
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
    }

    try {
      // 送信されてきた回答データ（JSON）を取得
      const body = await request.json();
      const answersJsonString = JSON.stringify(body);

      // バインドした env.DB（survey-db）へ保存
      await env.DB.prepare(
        'INSERT INTO survey_responses (answers_json) VALUES (?)'
      )
      .bind(answersJsonString)
      .run();

      return new Response(JSON.stringify({ success: true, message: '保存成功' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};