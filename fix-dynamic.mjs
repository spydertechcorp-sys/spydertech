import fs from 'fs';
import path from 'path';

const files = [
  'app/admin/page.tsx',
  'app/admin/businesses/page.tsx',
  'app/admin/onboarding/page.tsx',
  'app/admin/plans/page.tsx',
  'app/admin/users/page.tsx',
  'app/sitemap.ts'
];

for (const file of files) {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('export const dynamic')) {
      content = `export const dynamic = 'force-dynamic';\n` + content;
      fs.writeFileSync(filePath, content);
      console.log(`Fixed ${file}`);
    }
  }
}
