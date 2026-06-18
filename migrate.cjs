const fs = require('fs');
let code = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Replace Config & sb function
code = code.replace(
  /const SUPABASE_URL = [\s\S]*?return res.json\(\);\n}/m,
  \`const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api';
const WHATSAPP_NUMBER = "94770000000"; // country code + number, no + or spaces

/* ---------- API helper ---------- */
async function api(path, { method = "GET", body, headers = {}, token } = {}) {
  const reqHeaders = { "Content-Type": "application/json", ...headers };
  if (token) reqHeaders.Authorization = \\\`Bearer \${token}\\\`;
  const res = await fetch(\\\`\${API_URL}/\${path}\\\`, {
    method,
    headers: reqHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (method === "DELETE" && res.ok) return null;
  if (!res.ok) throw new Error(\\\`API error \${res.status}\\\`);
  return res.json();
}\`
);

// 2. Replace AdminLogin fetch
code = code.replace(
  /const res = await fetch.*?grant_type=password\`.*?\n.*?method: \"POST\".*?\n.*?headers: \{ apikey.*?\n.*?body: JSON\.stringify\(\{ email, password \}\).*?\n.*?\}\);/s,
  \`const res = await fetch(\\\`\${API_URL}/login\\\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });\`
);

// 3. Remove !isSupabaseConfigured checks in AdminLogin
code = code.replace(
  /if \(!isSupabaseConfigured\) \{.*?return;\n\s*\}/s,
  ''
);

// 4. Update saveService
code = code.replace(
  /if \(isSupabaseConfigured\) \{.*?try \{.*?if \(isNew\) \{.*?const \[row\] = await sb\(\"services\", \{ method: \"POST\", body: \{ \.\.\.draft, id: undefined \} \}\);.*?updated = \[\.\.\.services, row\];.*?\} else \{.*?const \[row\] = await sb\(\`services\?id=eq\.\$\{draft\.id\}\`, \{ method: \"PATCH\", body: draft \}\);.*?updated = services\.map\(\(s\) => \(s\.id === draft\.id \? row : s\)\);.*?\}[\s\S]*?\} else \{\n.*?updated = isNew \? \[\.\.\.services, draft\] : services\.map\(\(s\) => \(s\.id === draft\.id \? draft : s\)\);\n.*?\}/s,
  \`try {
      if (isNew) {
        const row = await api("services", { method: "POST", body: { ...draft, id: undefined }, token: admin.token });
        updated = [...services, row];
      } else {
        const row = await api(\\\`services/\${draft.id}\\\`, { method: "PUT", body: draft, token: admin.token });
        updated = services.map((s) => (s.id === draft.id ? row : s));
      }
    } catch {
      updated = isNew ? [...services, draft] : services.map((s) => (s.id === draft.id ? draft : s));
    }\`
);

// 5. Update deleteService
code = code.replace(
  /if \(isSupabaseConfigured\) \{\n\s*try \{\n\s*await sb\(\`services\?id=eq\.\$\{id\}\`, \{ method: \"DELETE\" \}\);\n\s*\} catch \{\}\n\s*\}/s,
  \`try {
      await api(\\\`services/\${id}\\\`, { method: "DELETE", token: admin.token });
    } catch {}\`
);

// 6. Update saveReview
code = code.replace(
  /if \(isSupabaseConfigured\) \{.*?try \{.*?if \(isNew\) \{.*?const \[row\] = await sb\(\"reviews\", \{ method: \"POST\", body: \{ \.\.\.reviewDraft, id: undefined \} \}\);.*?updated = \[\.\.\.reviews, row\];.*?\} else \{.*?const \[row\] = await sb\(\`reviews\?id=eq\.\$\{reviewDraft\.id\}\`, \{ method: \"PATCH\", body: reviewDraft \}\);.*?updated = reviews\.map\(\(r\) => \(r\.id === reviewDraft\.id \? row : r\)\);.*?\}[\s\S]*?\} else \{\n.*?updated = isNew \? \[\.\.\.reviews, reviewDraft\] : reviews\.map\(\(r\) => \(r\.id === reviewDraft\.id \? reviewDraft : r\)\);\n.*?\}/s,
  \`try {
      if (isNew) {
        const row = await api("reviews", { method: "POST", body: { ...reviewDraft, id: undefined }, token: admin.token });
        updated = [...reviews, row];
      } else {
        const row = await api(\\\`reviews/\${reviewDraft.id}\\\`, { method: "PUT", body: reviewDraft, token: admin.token });
        updated = reviews.map((r) => (r.id === reviewDraft.id ? row : r));
      }
    } catch {
      updated = isNew ? [...reviews, reviewDraft] : reviews.map((r) => (r.id === reviewDraft.id ? reviewDraft : r));
    }\`
);

// 7. Update deleteReview
code = code.replace(
  /if \(isSupabaseConfigured\) \{\n\s*try \{\n\s*await sb\(\`reviews\?id=eq\.\$\{id\}\`, \{ method: \"DELETE\" \}\);\n\s*\} catch \{\}\n\s*\}/s,
  \`try {
      await api(\\\`reviews/\${id}\\\`, { method: "DELETE", token: admin.token });
    } catch {}\`
);

// 8. Update saveCompany
code = code.replace(
  /if \(isSupabaseConfigured\) \{\n\s*try \{\n\s*await sb\(\`company\?id=eq\.1\`, \{ method: \"PATCH\", body: companyDraft \}\);\n\s*\} catch \{\}\n\s*\}/s,
  \`try {
      await api("company", { method: "PUT", body: companyDraft, token: admin.token });
    } catch {}\`
);

// 9. Update useEffect initial fetch
code = code.replace(
  /if \(!isSupabaseConfigured\) \{.*?return;\n\s*\}[\s\S]*?try \{.*?sb\(\"services\?order=id\"\),.*?sb\(\"company\?id=eq\.1\"\),.*?sb\(\"reviews\?order=id\"\)\.catch\(\(\) => null\),.*?\n\s*\]\);.*?if \(svc\?\.length\) setServices\(svc\);.*?if \(comp\?\.length\) setCompany\(comp\[0\]\);.*?if \(rev\?\.length\) setReviews\(rev\);.*?\} catch \{.*?\}/s,
  \`try {
        const [svc, comp, rev] = await Promise.all([
          api("services"),
          api("company"),
          api("reviews").catch(() => null),
        ]);
        if (svc?.length) setServices(svc);
        if (comp?.length) setCompany(comp[0]);
        if (rev?.length) setReviews(rev);
      } catch {}\`
);

fs.writeFileSync('src/App.jsx', code);
