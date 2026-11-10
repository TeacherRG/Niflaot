const apiKey = process.env.BUTTONDOWN_API_KEY;
if (!apiKey) throw new Error('Missing BUTTONDOWN_API_KEY GitHub Actions secret.');
if (process.env.SEND_CONFIRMATION !== 'SEND_MEMO_TEST') {
  throw new Error('Set the workflow confirmation input to SEND_MEMO_TEST.');
}
if (process.env.GITHUB_REF !== 'refs/heads/main') {
  throw new Error('This one-time email can only be sent from main.');
}

const headers = { Authorization: `Token ${apiKey}` };
const subscribersResponse = await fetch('https://api.buttondown.com/v1/subscribers', { headers });
if (!subscribersResponse.ok) {
  throw new Error(`Buttondown subscriber check failed (${subscribersResponse.status}).`);
}

const subscribers = await subscribersResponse.json();
if (subscribers.count !== 1) {
  throw new Error(`Expected exactly one Buttondown subscriber; found ${subscribers.count ?? 'an unknown number'}. No email sent.`);
}

const email = {
  subject: 'Мемо-игра по недельной главе · Niflaot Memo game',
  body: `# Попробуйте Memo-игру «Нифлаот»

Вспомните слова и идеи недельной главы, собирая пары карточек.

[Открыть Memo-игру по главе Толдот](https://niflaot.mychitas.app/?lang=ru#/13-baal-haturim-toldot/memo)

---

# Try the Niflaot Memo game

Match the cards and revisit the words and ideas of this week's Torah portion.

[Open the Toldot Memo game](https://niflaot.mychitas.app/?lang=en#/13-baal-haturim-toldot/memo)

---

# Probier das Niflaot-Memo-Spiel aus

Finde die passenden Kartenpaare und entdecke Wörter und Gedanken zum Wochenabschnitt.

[Memo-Spiel zu Toldot öffnen](https://niflaot.mychitas.app/?lang=de#/13-baal-haturim-toldot/memo)`,
  status: 'about_to_send',
};

const response = await fetch('https://api.buttondown.com/v1/emails', {
  method: 'POST',
  headers: {
    ...headers,
    'Content-Type': 'application/json',
    'X-Buttondown-Live-Dangerously': 'true',
    'X-Idempotency-Key': 'niflaot-memo-test-2026-11-10',
  },
  body: JSON.stringify(email),
});

if (!response.ok) {
  throw new Error(`Buttondown email send failed (${response.status}).`);
}

console.log('Buttondown accepted the one-time Memo game email.');
