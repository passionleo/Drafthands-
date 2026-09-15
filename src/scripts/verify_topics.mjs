import fs from 'fs';

const files = [
  'src/data/topics/ss1.ts',
  'src/data/topics/ss2.ts',
  'src/data/topics/ss3.ts',
  'src/data/topics/higher.ts',
  'src/data/topics/building.ts',
  'src/data/topics/machine.ts',
  'src/data/topics/cad.ts',
  'src/data/topics/digitalGraphics.ts'
];

const topics = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  // Look for blocks with id: '...', tier: '...'
  const regex = /id:\s*['"]([^'"]+)['"],\s*(?:[\r\n\s]*tier:\s*['"]([^'"]+)['"],)?\s*(?:[\r\n\s]*moduleCode:\s*['"]([^'"]+)['"],)?\s*title:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    topics.push({
      file,
      id: m[1],
      tier: m[2],
      moduleCode: m[3],
      title: m[4]
    });
  }
}

console.log(`Total DrawingTopics detected: ${topics.length}`);
topics.forEach((t, idx) => {
  console.log(`${idx + 1}. [${t.tier || '?'}] (${t.id}) "${t.title}"`);
});

