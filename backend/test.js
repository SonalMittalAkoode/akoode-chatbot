const body = {
  'heroStats[0][icon]': 'BriefcaseStatIcon',
  'heroStats[0][value]': '100+',
  'heroStats[0][label]': 'Projects',
  'heroStats[0][sub]': 'Worldwide'
};
function collectArray(body, name) {
  const items = [];
  for (const [key, val] of Object.entries(body)) {
    let m = key.match(new RegExp(`^${name}\\[(\\d+)\\]\\[([\\w]+)\\]$`));
    if (m) {
      const i = +m[1], field = m[2];
      if (!items[i]) items[i] = {};
      items[i][field] = val;
    }
  }
  return items.filter(Boolean);
}
console.log(collectArray(body, 'heroStats'));
