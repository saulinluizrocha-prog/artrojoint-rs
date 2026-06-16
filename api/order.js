const https = require('https');
const crypto = require('crypto');
const querystring = require('querystring');

// Configuração da API CRM (mesmos valores do api.php original)
const config = {
  api_key:    'c66289394c2a6e8515c8e8b382fba719',
  offer_id:   '12145',
  user_id:    '75329',
  api_domain: 'https://t-api.org',
};

function checkSum(jsonData) {
  return crypto.createHash('sha1').update(jsonData + config.api_key).digest('hex');
}

function apiRequest(payload) {
  return new Promise((resolve, reject) => {
    const wrapper = {
      user_id: config.user_id,
      data:    payload,
    };
    const jsonData   = JSON.stringify(wrapper);
    const checkSumVal = checkSum(jsonData);

    const url = new URL(`${config.api_domain}/api/lead/create?check_sum=${checkSumVal}`);

    const options = {
      hostname: url.hostname,
      path:     url.pathname + url.search,
      method:   'POST',
      headers:  {
        'Content-Type':   'application/json',
        'Content-Length': Buffer.byteLength(jsonData),
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.status === 'ok') {
            resolve(parsed.data);
          } else {
            reject(new Error(parsed.error || 'Unknown API error'));
          }
        } catch (e) {
          reject(new Error('JSON parse error: ' + body));
        }
      });
    });

    req.on('error', reject);
    req.write(jsonData);
    req.end();
  });
}

// Lê o body da requisição POST (application/x-www-form-urlencoded)
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk.toString(); });
    req.on('end', () => resolve(querystring.parse(body)));
    req.on('error', reject);
  });
}

module.exports = async function handler(req, res) {
  // Só aceita POST
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  let fields;
  try {
    fields = await readBody(req);
  } catch (e) {
    return res.status(400).send('Bad Request');
  }

  const { name, phone } = fields;

  // Validação mínima igual ao php original
  if (!name || !phone) {
    const referer = req.headers.referer || '/';
    return res.redirect(302, referer);
  }

  // Monta o payload para a API CRM
  const payload = {
    name:     name.trim(),
    phone:    phone.trim(),
    offer_id: config.offer_id,
    country:  fields.country  || 'RS',
    region:   fields.region   || undefined,
    city:     fields.city     || undefined,
    count:    fields.count    || undefined,
    stream_id: '',
    tz:       '',
    address:  fields.address  || undefined,
    email:    fields.email    || undefined,
    zip:      fields.zip      || undefined,
    user_comment: fields.user_comment || undefined,
    referer:  req.headers.referer || undefined,

    // UTM params (vindos da query string da URL original)
    utm_source:   fields.utm_source   || undefined,
    utm_medium:   fields.utm_medium   || undefined,
    utm_campaign: fields.utm_campaign || undefined,
    utm_term:     fields.utm_term     || undefined,
    utm_content:  fields.utm_content  || undefined,

    sub_id:   fields.sub_id   || undefined,
    sub_id_1: fields.sub_id_1 || undefined,
    sub_id_2: fields.sub_id_2 || undefined,
    sub_id_3: fields.sub_id_3 || undefined,
    sub_id_4: fields.sub_id_4 || undefined,
  };

  // Remove chaves com valor undefined para não poluir o payload
  Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

  try {
    const lead = await apiRequest(payload);
    const leadId = (lead && lead.id) ? lead.id : '';
    return res.redirect(302, `/success.html?id=${leadId}`);
  } catch (err) {
    console.error('CRM API error:', err.message);
    // Mesmo em erro, redireciona para success para não expor detalhes ao usuário
    return res.redirect(302, '/success.html');
  }
};
