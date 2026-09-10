const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

marked.setOptions({
  gfm: true,
  breaks: true,
});

const DIST_DIR = path.join(__dirname, 'dist');
const IMAGES_DIR = path.join(__dirname, 'images');
const CSS_DIR = path.join(__dirname, 'css');

if (fs.existsSync(DIST_DIR)) {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DIST_DIR, { recursive: true });

if (fs.existsSync(IMAGES_DIR)) {
  fs.cpSync(IMAGES_DIR, path.join(DIST_DIR, 'images'), { recursive: true });
}

if (fs.existsSync(CSS_DIR)) {
  fs.cpSync(CSS_DIR, path.join(DIST_DIR, 'css'), { recursive: true });
}

function renderHTML(title, content) {
  const converted = content.replace(/href=\"([^\"]+)\.md(#[^\"]*)?\"/g, (match, p1, p2) => {
    const hash = p2 || '';
    if (p1 === 'top' || p1 === 'index') {
      return 'href="index.html' + hash + '"';
    }
    return 'href="' + encodeURIComponent(decodeURIComponent(p1)) + '.html' + hash + '"';
  });

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title ? `${title} | ` : ''}INTEVE SCHOOL 運用マニュアル</title>
  <meta name="description" content="医療系専門学校・大学向け教育DXソリューション INTEVE SCHOOL の公式運用マニュアルです。">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="css/style.css">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: '#004080',
            primaryLight: '#0077b6',
            secondary: '#00BCD4',
            accent: '#FF6600',
          },
          fontFamily: {
            sans: ['Inter', 'Noto Sans JP', 'sans-serif'],
          }
        }
      }
    }
  </script>
</head>
<body class="bg-slate-50 text-slate-800 font-sans min-h-screen flex flex-col">
  <header class="bg-[#004080] text-white shadow-md sticky top-0 z-50">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <a href="index.html" class="flex items-center space-x-2 text-white hover:text-cyan-300 transition">
          <i class="fa-solid fa-graduation-cap text-2xl text-[#00BCD4]"></i>
          <span class="font-bold text-lg tracking-wide">INTEVE SCHOOL</span>
          <span class="text-xs bg-cyan-500/20 text-cyan-200 px-2 py-0.5 rounded-full border border-cyan-400/30 hidden sm:inline">Manual</span>
        </a>
      </div>
      <nav class="flex items-center space-x-4 text-sm font-medium">
        <a href="index.html" class="text-white/90 hover:text-cyan-300 transition flex items-center gap-1.5">
          <i class="fa-solid fa-house text-xs"></i>
          <span>トップ</span>
        </a>
        <a href="https://creativesd.net/" target="_blank" rel="noopener" class="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-md transition flex items-center gap-1.5 border border-white/20 text-xs sm:text-sm">
          <span>CSD 公式サイト</span>
          <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
        </a>
      </nav>
    </div>
  </header>
  <main class="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
    <article class="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-10 markdown-body">
      ${converted}
    </article>
  </main>
  <footer class="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs mt-auto">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center space-x-2">
        <span class="font-bold text-slate-200">INTEVE SCHOOL</span>
        <span>— Educational DX Solution</span>
      </div>
      <div class="flex items-center space-x-4 text-slate-400">
        <a href="https://creativesd.net/" target="_blank" rel="noopener" class="hover:text-cyan-400 transition">CSD 公式サイト</a>
        <span>|</span>
        <a href="privacy-policy.html" class="hover:text-cyan-400 transition">プライバシーポリシー</a>
      </div>
    </div>
    <div class="max-w-5xl mx-auto px-4 sm:px-6 text-center text-slate-500 mt-4 text-[11px]">
      © 2026 Creative System Design. All rights reserved.<br>
      ※「INTEVE SCHOOL」は、Creative System Design（代表：大塚和宏）の登録商標（第6994552号）です。
    </div>
  </footer>
</body>
</html>`;
}

const mdFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.md') && f !== 'README.md');
console.log('Building ' + mdFiles.length + ' markdown pages to HTML...');

mdFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  const raw = fs.readFileSync(filePath, 'utf-8');

  let title = path.basename(file, '.md');
  let contentMd = raw;

  const fmMatch = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (fmMatch) {
    const fm = fmMatch[1];
    contentMd = fmMatch[2];
    const titleMatch = fm.match(/^title:\s*\"?(.*?)\"?$/m);
    if (titleMatch) {
      title = titleMatch[1].trim();
    }
  }

  const htmlContent = marked.parse(contentMd);
  const pageHtml = renderHTML(title, htmlContent);
  const baseName = path.basename(file, '.md');
  
  const outName = encodeURIComponent(baseName) + '.html';
  fs.writeFileSync(path.join(DIST_DIR, outName), pageHtml, 'utf-8');
  if (outName !== baseName + '.html') {
    fs.writeFileSync(path.join(DIST_DIR, baseName + '.html'), pageHtml, 'utf-8');
  }

  if (file === 'top.md') {
    fs.writeFileSync(path.join(DIST_DIR, 'index.html'), pageHtml, 'utf-8');
  }
});

console.log('Build completed successfully in dist/');
