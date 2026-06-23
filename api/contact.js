
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'Method not allowed' });
  const body = req.body || {};
  const email = String(body.email || '').trim();
  const name = String(body.name || '').trim();
  if (!name || !email || !email.includes('@')) return res.status(400).json({ ok:false, error:'Nom et email valides requis' });
  if (!process.env.RESEND_API_KEY) return res.status(503).json({ ok:false, error:'Email service not configured' });
  const html = `<h2>Nouvelle demande Hypercharge</h2><p><b>Nom:</b> ${escapeHtml(name)}</p><p><b>Email:</b> ${escapeHtml(email)}</p><p><b>Entreprise:</b> ${escapeHtml(body.company||'')}</p><p><b>Fonction:</b> ${escapeHtml(body.role||'')}</p><p><b>Besoin:</b> ${escapeHtml(body.interest||'')}</p><p><b>Message:</b><br>${escapeHtml(body.message||'')}</p>`;
  const r = await fetch('https://api.resend.com/emails', {method:'POST', headers:{'Authorization':`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'}, body:JSON.stringify({from:process.env.RESEND_FROM || 'Hypercharge <onboarding@resend.dev>', to:process.env.CONTACT_TO || 'contact@hypercharge.fr', subject:'Nouvelle demande Hypercharge', html, reply_to: email})});
  if (!r.ok) return res.status(502).json({ ok:false, error:'Email provider error' });
  return res.status(200).json({ ok:true });
}
function escapeHtml(v){return String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
