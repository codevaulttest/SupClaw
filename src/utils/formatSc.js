export function trimNumber(value, decimals = 2) {
  return Number(value.toFixed(decimals)).toString();
}

export function formatScAmount(yiAmount, lang = 'en') {
  const amount = Number(yiAmount) || 0;
  if (lang === 'zh') {
    const value = trimNumber(amount);
    return { value, unit: '亿 SC', text: `${value} 亿 SC` };
  }

  if (amount >= 10) {
    const value = trimNumber(amount / 10, 3);
    return { value, unit: 'B SC', text: `${value}B SC` };
  }

  const value = trimNumber(amount * 100);
  return { value, unit: 'M SC', text: `${value}M SC` };
}

export function formatScText(text, lang = 'en') {
  if (lang === 'zh') return text;
  return text.replace(/(\d+(?:\.\d+)?)亿 SC/g, (_, raw) => formatScAmount(Number(raw), lang).text);
}
