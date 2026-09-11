const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Configure marked with custom heading renderer to add id attributes
const renderer = new marked.Renderer();
renderer.heading = function({ tokens, depth, raw }) {
  const text = this.parser.parseInline(tokens);
  const cleanText = raw.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1').replace(/[*_`]/g, '').trim();
  const id = encodeURIComponent(cleanText.toLowerCase().replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/g, '-'));
  return `<h${depth} id="${id}">${text}</h${depth}>\n`;
};

renderer.code = function({ text, lang }) {
  if (lang === 'mermaid') {
    return `<div class="mermaid my-6 p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex justify-center">${text}</div>\n`;
  }
  return `<pre><code class="language-${lang || 'text'}">${text}</code></pre>\n`;
};

marked.setOptions({
  renderer: renderer,
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

// Module structure for Navigation Sidebar
const MODULES = [
  {
    name: '基本的な使い方',
    icon: 'fa-solid fa-compass',
    portal: '基本的な使い方.md',
    pages: [
      { title: 'ログイン方法', file: 'ログイン方法.md' },
      { title: '画面の見方', file: '画面の見方.md' },
      { title: 'サブメニューの開き方', file: 'サブメニューの開き方.md' },
      { title: '編集モードへ', file: '編集モードへ.md' },
      { title: '編集ログの確認', file: '編集ログの確認.md' },
      { title: '検索モードへ', file: '検索モードへ.md' },
      { title: '送付文書準備', file: '業務文書-送付文書.md' },
      { title: '学内セキュリティ運用指針', file: '【重要】学内運用におけるセキュリティとパスワ.md' },
      { title: 'FileMaker Go ご利用ガイド', file: 'filemaker-goでの使い方.md' },
      { title: 'Cloud バックアップ手順', file: 'backup.md' },
    ]
  },
  {
    name: '学生管理',
    icon: 'fa-solid fa-user-graduate',
    portal: '学生管理ポータル.md',
    pages: [
      { title: '学生情報 基本情報', file: '学生情報-基本情報.md' },
      { title: '学生情報 一覧', file: '学生情報-一覧.md' },
      { title: '学生情報 写真取込', file: '学生情報-写真取込.md' },
      { title: '学生情報 顔写真名簿', file: '学生情報-顔写真名簿-ポータル.md' },
      { title: '学生情報 在籍状況', file: '学生情報-在籍状況.md' },
      { title: '学生情報 入学前', file: '学生情報-入学前.md' },
      { title: '学生情報 卒業生 一覧', file: '学生情報-卒業生-一覧.md' },
      { title: '学生情報 科目成績', file: '学生情報-科目成績.md' },
      { title: '学生情報 国家試験対策成績', file: '学生情報-国家試験対策成績.md' },
      { title: '学生情報 学習グループ', file: '学生情報-学習グループ.md' },
      { title: '学生情報 日常記録', file: '学生情報-日常記録.md' },
      { title: '学生情報 日常記録 詳細', file: '学生情報-日常記録-詳細.md' },
      { title: '学生情報 実習履歴', file: '学生情報-実習履歴.md' },
      { title: '学生情報 実習地候補', file: '学生情報-実習地候補.md' },
      { title: '学生情報 実習地候補 詳細', file: '学生情報-実習地候補-詳細-2.md' },
      { title: '学生情報 学生仮配置事前入力', file: '学生情報-学生仮配置事前入力.md' },
      { title: '学生情報 就職活動', file: '学生情報-就職活動.md' },
      { title: '学生情報 就職活動 一覧', file: '学生情報-就職活動-一覧.md' },
      { title: '学生情報 就職地', file: '学生情報-就職地.md' },
      { title: '学生情報 各種書類', file: '学生情報-各種書類.md' },
      { title: '学生情報 送付文書', file: '学生情報-送付文書.md' },
    ]
  },
  {
    name: '施設管理',
    icon: 'fa-solid fa-hospital',
    portal: '施設管理ポータル.md',
    pages: [
      { title: '施設情報 基本情報', file: '施設情報-基本情報.md' },
      { title: '施設情報 一覧', file: '施設情報-一覧.md' },
      { title: '施設情報 内部情報', file: '施設情報-内部情報.md' },
      { title: '施設情報 情報整備', file: '施設情報-情報整備.md' },
      { title: '施設情報 年次情報', file: '施設情報-年次情報.md' },
      { title: '施設情報 送付文書', file: '施設情報-送付文書.md' },
      { title: '施設情報 スタッフ', file: '施設情報-スタッフ.md' },
      { title: '施設情報 スタッフ 一覧', file: '施設情報-スタッフ-一覧.md' },
      { title: '施設情報 スタッフ 詳細', file: '施設情報-スタッフ-詳細.md' },
      { title: '施設情報 指導者会議', file: '施設情報-指導者会議.md' },
      { title: '施設情報 指導者講習会', file: '施設情報-指導者講習会.md' },
      { title: '施設情報 実習承諾', file: '施設情報-実習承諾.md' },
      { title: '施設情報 実習履歴', file: '施設情報-実習履歴.md' },
      { title: '施設情報 実習アンケート', file: '施設情報-実習アンケート.md' },
      { title: '施設情報 施設仮配置事前入力', file: '施設情報-施設仮配置事前入力.md' },
      { title: '施設情報 求人票', file: '施設情報-求人票.md' },
      { title: '施設情報 求人票 一覧', file: '施設情報-求人票-一覧.md' },
      { title: '施設情報 就職活動', file: '施設情報-就職活動.md' },
      { title: '施設情報 就職施設 一覧', file: '施設情報-就職施設-一覧.md' },
      { title: '施設情報 卒業生', file: '施設情報-卒業生.md' },
    ]
  },
  {
    name: '実習管理 & INTEVE LINK',
    icon: 'fa-solid fa-handshake-angle',
    portal: '実習管理ポータル.md',
    pages: [
      { title: '🗺️ 実習業務 年間運用フロー', file: '実習業務-年間運用フロー.md' },
      { title: 'INTEVE LINK プラットフォーム', file: 'inteve-link.md' },
      { title: '実習情報 ポータル', file: '実習情報-ポータル.md' },
      { title: '実習管理 実習仮配置', file: '実習管理-実習仮配置.md' },
      { title: '実習管理 実習仮配置 詳細', file: '実習仮配置詳細.md' },
      { title: '実習情報 承諾依頼', file: '実習情報-承諾依頼.md' },
      { title: '実習情報 承諾依頼文書', file: '実習情報-承諾依頼文書.md' },
      { title: '実習情報 承諾履歴', file: '実習情報-承諾履歴.md' },
      { title: '実習情報 指導依頼', file: '実習情報-指導依頼.md' },
      { title: '実習情報 指導依頼文書', file: '実習情報-指導依頼文書.md' },
      { title: '実習管理 チェックリスト', file: '実習管理-チェックリスト.md' },
      { title: '実習情報 実習生一覧', file: '実習情報-実習生一覧.md' },
      { title: '実習情報 定期', file: '実習情報-定期.md' },
      { title: '実習情報 宿泊地', file: '実習情報-宿泊地.md' },
      { title: '実習情報 実習中指導', file: '実習情報-実習中指導-参加票.md' },
      { title: '実習管理 実習中指導', file: '実習管理-実習中指導.md' },
      { title: '実習管理 実習中指導 個別画面', file: '実習管理-実習中指導-個別.md' },
      { title: '実習情報 採点者', file: '実習情報-採点者.md' },
      { title: '実習情報 アンケート', file: '実習情報-アンケート.md' },
      { title: '実習情報 経費', file: '実習情報-経費.md' },
      { title: '実習情報 謝礼金', file: '実習情報-謝礼金.md' },
      { title: '実習管理 指導者会議', file: '実習管理-指導者会議.md' },
      { title: '実習管理 指導者会議 一覧', file: '実習管理-指導者会議-一覧.md' },
      { title: '実習管理 指導者会議 詳細', file: '実習管理-指導者会議-詳細.md' },
      { title: '実習管理 指導者会議 参加者', file: '実習管理-指導者会議-参加者.md' },
      { title: '実習管理 指導者会議 参加者(2)', file: '実習管理-指導者会議-参加者-2.md' },
      { title: '実習管理 指導者講習会', file: '実習管理-指導者講習会.md' },
    ]
  },
  {
    name: '国家試験対策',
    icon: 'fa-solid fa-file-pen',
    portal: '国家試験対策ポータル.md',
    pages: [
      { title: '各種試験 新規作成', file: '各種試験-新規作成.md' },
      { title: '各種試験 レイアウト', file: 'レイアウト-各種試験.md' },
      { title: '各種試験 詳細', file: 'レイアウト-各種試験-詳細.md' },
      { title: '各種試験 試験問題', file: '各種試験-試験問題.md' },
      { title: '各種試験 問題挿入', file: 'レイアウト各種試験問題.md' },
      { title: '問題検索', file: 'レイアウト-問題検索.md' },
      { title: '問題分類 カラム', file: 'レイアウト-問題分類.md' },
      { title: '問題分類 リスト', file: 'レイアウト-問題項目編集画面-リスト.md' },
      { title: '各種試験 分野調整', file: '各種試験分野調整.md' },
      { title: '解答フォーム ベース', file: '解答フォーム-ベース.md' },
      { title: '解答フォーム 結果分析', file: '各種試験-解答フォーム-結果分析.md' },
      { title: '各種試験 結果分析', file: '結果分析コントロール.md' },
      { title: '解答分析 得点', file: '解答分析-得点.md' },
      { title: '試験分析 グラフ', file: '試験結果-グラフ.md' },
      { title: '各種試験 個人成績', file: '個人成績.md' },
      { title: '各種模試 出力設定', file: '各種模試出力設定.md' },
      { title: 'アカウント設定', file: 'レイアウト-アカウント.md' },
      { title: 'システム設定', file: 'レイアウト-設定.md' },
      { title: '外部接続設定', file: 'レイアウト-外部接続.md' },
    ]
  },
  {
    name: 'システム設定',
    icon: 'fa-solid fa-sliders',
    portal: '設定画面ポータル.md',
    pages: [
      { title: '設定 初期設定', file: '設定-初期設定.md' },
      { title: '設定 年度学年設定', file: '設定-年度学年設定.md' },
      { title: '設定 アカウント 詳細', file: '設定-アカウント-詳細.md' },
      { title: '設定 データ移行', file: '設定-データ移行.md' },
      { title: '設定 外部通信', file: '設定-外部通信.md' },
      { title: '設定 ログイン履歴', file: '設定-ログイン履歴.md' },
      { title: '設定 障害報告書 詳細', file: '設定-障害報告書-詳細.md' },
    ]
  },
  {
    name: 'その他のモジュール',
    icon: 'fa-solid fa-layer-group',
    pages: [
      { title: '講義管理 (準備中)', file: '講義管理.md' },
      { title: '教務管理 (準備中)', file: '教務管理.md' },
      { title: '入試・広報 (準備中)', file: '入試・広報.md' },
      { title: '業務文書', file: '業務文書.md' },
      { title: 'お知らせ (News)', file: 'news.md' },
      { title: '機能サイトマップ', file: 'sitemap.md' },
    ]
  }
];

function getHtmlFileName(mdFile) {
  if (mdFile === 'top.md' || mdFile === 'index.md') return 'index.html';
  const base = path.basename(mdFile, '.md');
  return `${encodeURIComponent(base)}.html`;
}

// Build Sidebar HTML with exclusive accordion support
function renderSidebar(currentFile) {
  let html = `
  <div class="sidebar-search-box">
    <div class="relative">
      <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
      <input type="text" id="manual-search" class="sidebar-search-input" placeholder="マニュアルを検索..." autocomplete="off">
    </div>
  </div>
  <div class="sidebar-nav" id="sidebar-nav-container">
    <a href="index.html" class="nav-item ${currentFile === 'top.md' ? 'active' : ''}">
      <span class="flex items-center gap-2"><i class="fa-solid fa-house text-xs opacity-70"></i> トップページ</span>
    </a>
    <a href="sitemap.html" class="nav-item ${currentFile === 'sitemap.md' ? 'active' : ''}">
      <span class="flex items-center gap-2 text-amber-600 font-semibold"><i class="fa-solid fa-map text-xs"></i> 機能サイトマップ</span>
    </a>
    <div class="nav-group-title">機能モジュール一覧</div>
`;

  MODULES.forEach((mod) => {
    const isCurrentInMod = mod.pages.some(p => p.file === currentFile) || mod.portal === currentFile;
    const portalUrl = mod.portal ? getHtmlFileName(mod.portal) : '#';

    html += `
    <div class="nav-group ${isCurrentInMod ? 'is-open' : ''}">
      <button type="button" class="nav-group-btn">
        <span class="flex items-center gap-2">
          <i class="${mod.icon} text-xs text-[#00BCD4]"></i>
          <span>${mod.name}</span>
        </span>
        <i class="fa-solid fa-chevron-right nav-group-chevron"></i>
      </button>
      <div class="nav-sub-items ${isCurrentInMod ? '' : 'hidden'}">
        ${mod.portal ? `<a href="${portalUrl}" class="nav-item text-xs font-semibold ${currentFile === mod.portal ? 'active' : ''}">📌 ${mod.name} ポータル</a>` : ''}
        ${mod.pages.map(p => {
          const isActive = currentFile === p.file;
          return `<a href="${getHtmlFileName(p.file)}" class="nav-item text-xs ${isActive ? 'active' : ''}">${p.title}</a>`;
        }).join('')}
      </div>
    </div>
    `;
  });

  html += `
    <div class="p-4 mt-6 border-t border-slate-200">
      <div class="bg-gradient-to-br from-slate-900 to-[#004080] p-3.5 rounded-xl text-white text-xs shadow-sm">
        <div class="font-bold mb-1 flex items-center gap-1.5 text-cyan-300">
          <i class="fa-solid fa-sparkles"></i> 機能の追加・導入相談
        </div>
        <p class="text-slate-300 text-[11px] leading-relaxed mb-2.5">
          現在未導入のモジュールや、教育DXのカスタマイズはお気軽にご相談ください。
        </p>
        <a href="https://creativesd.net/#contact" target="_blank" rel="noopener" class="block w-full text-center bg-[#FF6600] hover:bg-[#e65c00] text-white font-bold py-1.5 px-2 rounded-lg transition text-xs shadow">
          お問い合わせ <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
        </a>
      </div>
    </div>
  </div>
  `;

  return html;
}

// Generate full HTML Page
function renderFullHTML({ title, content, currentFile, headings }) {
  const sidebarHtml = renderSidebar(currentFile);

  // Convert markdown links
  const convertedContent = content.replace(/href=\"([^\"]+)\.md(#[^\"]*)?\"/g, (match, p1, p2) => {
    const hash = p2 || '';
    if (p1 === 'top' || p1 === 'index') {
      return `href="index.html${hash}"`;
    }
    return `href="${encodeURIComponent(decodeURIComponent(p1))}.html${hash}"`;
  });

  // TOC HTML
  let tocHtml = '';
  if (headings && headings.length > 1) {
    tocHtml = `
      <aside class="toc-sidebar">
        <div class="toc-title"><i class="fa-solid fa-list-ul mr-1.5"></i> このページの目次</div>
        <nav class="space-y-1">
          ${headings.map(h => `<a href="#${h.id}" class="toc-link ${h.level === 3 ? 'pl-3 text-xs' : 'font-medium'}">${h.text}</a>`).join('')}
        </nav>
      </aside>
    `;
  }

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title ? `${title} | ` : ''}INTEVE SCHOOL 運用マニュアル</title>
  <meta name="description" content="医療系専門学校・大学向け教育DXソリューション INTEVE SCHOOL の公式運用マニュアルです。">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+JP:wght@400;500;700;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="css/style.css">
</head>
<body class="bg-slate-50 text-slate-800 font-sans min-h-screen flex flex-col">

  <!-- Header -->
  <header class="bg-[#004080] text-white shadow-md sticky top-0 z-50 h-16">
    <div class="max-w-[1440px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <button id="mobile-menu-toggle" class="lg:hidden text-white hover:text-cyan-300 p-1.5 rounded-md focus:outline-none">
          <i class="fa-solid fa-bars text-xl"></i>
        </button>
        <a href="index.html" class="flex items-center space-x-2.5 text-white hover:text-cyan-300 transition">
          <i class="fa-solid fa-graduation-cap text-2xl text-[#00BCD4]"></i>
          <span class="font-extrabold text-lg tracking-wide">INTEVE SCHOOL</span>
          <span class="text-xs bg-cyan-400/20 text-cyan-200 px-2 py-0.5 rounded-full border border-cyan-400/30 hidden sm:inline">Manual</span>
        </a>
      </div>
      <nav class="flex items-center space-x-3 sm:space-x-5 text-sm font-medium">
        <a href="index.html" class="text-white/90 hover:text-cyan-300 transition flex items-center gap-1.5 hidden sm:flex">
          <i class="fa-solid fa-house text-xs"></i>
          <span>トップ</span>
        </a>
        <a href="sitemap.html" class="text-white/90 hover:text-cyan-300 transition flex items-center gap-1.5">
          <i class="fa-solid fa-map text-xs text-amber-400"></i>
          <span>サイトマップ</span>
        </a>
        <a href="https://creativesd.net/" target="_blank" rel="noopener" class="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-md transition flex items-center gap-1.5 border border-white/20 text-xs sm:text-sm">
          <span>CSD 公式サイト</span>
          <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
        </a>
      </nav>
    </div>
  </header>

  <!-- Layout Container -->
  <div class="doc-layout">
    <!-- Left Navigation Sidebar -->
    <aside id="sidebar-drawer" class="sidebar hidden lg:flex">
      ${sidebarHtml}
    </aside>

    <!-- Main Content Area -->
    <main class="main-content">
      <article class="article-card markdown-body">
        ${convertedContent}

        <!-- Upsell Promotion Banner -->
        <div class="upsell-banner">
          <div>
            <div class="font-extrabold text-lg flex items-center gap-2 mb-1 text-cyan-200">
              <i class="fa-solid fa-wand-magic-sparkles text-amber-400"></i> INTEVE SCHOOL でさらなる業務効率化を
            </div>
            <p class="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-xl">
              「実習仮配置の自動マッチング」「国家試験対策模試・自動採点」「教務・学事の一元化」など、未契約のモジュール追加やカスタマイズ導入が可能です。
            </p>
          </div>
          <a href="https://creativesd.net/#contact" target="_blank" rel="noopener" class="upsell-btn">
            <span>機能追加・導入のご相談</span>
            <i class="fa-solid fa-arrow-right text-xs"></i>
          </a>
        </div>
      </article>
    </main>

    <!-- Right TOC Sidebar -->
    ${tocHtml}
  </div>

  <!-- Lightbox Modal for Images -->
  <div id="lightbox" class="lightbox-modal" onclick="closeLightbox()">
    <button type="button" class="fixed top-6 right-6 text-white/90 hover:text-white text-xs sm:text-sm bg-black/50 hover:bg-black/80 px-4 py-2 rounded-full border border-white/30 flex items-center gap-2 transition cursor-pointer z-[110]" onclick="closeLightbox()">
      <i class="fa-solid fa-xmark text-base"></i>
      <span>閉じる (Esc)</span>
    </button>
    <img id="lightbox-image" class="lightbox-img" src="" alt="Zoomed Screenshot" onclick="event.stopPropagation()">
  </div>

  <!-- Floating Back to Flowchart Button -->
  <a id="floating-flowchart-btn" href="#timeline-flowchart" class="floating-flowchart-btn" aria-label="年間業務タイムライン＆全体フローチャートへ戻る">
    <i class="fa-solid fa-diagram-project"></i>
    <span>フローチャートへ戻る</span>
    <i class="fa-solid fa-arrow-up text-[11px] opacity-75"></i>
  </a>

  <!-- Global Footer -->
  <footer class="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs mt-auto">
    <div class="max-w-[1440px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center space-x-2">
        <span class="font-bold text-slate-200">INTEVE SCHOOL</span>
        <span>— Educational DX Solution for Medical Schools</span>
      </div>
      <div class="flex items-center space-x-4 text-slate-400">
        <a href="sitemap.html" class="hover:text-cyan-400 transition">サイトマップ</a>
        <span>|</span>
        <a href="https://creativesd.net/" target="_blank" rel="noopener" class="hover:text-cyan-400 transition">CSD 公式サイト</a>
        <span>|</span>
        <a href="privacy-policy.html" class="hover:text-cyan-400 transition">プライバシーポリシー</a>
      </div>
    </div>
    <div class="max-w-[1440px] mx-auto px-4 sm:px-6 text-center text-slate-500 mt-4 text-[11px]">
      © 2026 Creative System Design. All rights reserved.<br>
      ※「INTEVE SCHOOL」は、Creative System Design（代表：大塚和宏）の登録商標（第6994552号）です。
    </div>
  </footer>

  <!-- Scripts -->
  <script>
    (function() {
      // 100% Reliable Exclusive Accordion (Button-based, no details/summary native interference)
      function initAccordion() {
        const buttons = document.querySelectorAll('.nav-group-btn');
        buttons.forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const group = btn.closest('.nav-group');
            if (!group) return;
            const subItems = group.querySelector('.nav-sub-items');
            const isCurrentlyOpen = group.classList.contains('is-open');

            // Close ALL other groups unconditionally
            document.querySelectorAll('.nav-group').forEach(other => {
              if (other !== group) {
                other.classList.remove('is-open');
                const otherSub = other.querySelector('.nav-sub-items');
                if (otherSub) otherSub.classList.add('hidden');
              }
            });

            // Toggle clicked group
            if (isCurrentlyOpen) {
              group.classList.remove('is-open');
              if (subItems) subItems.classList.add('hidden');
            } else {
              group.classList.add('is-open');
              if (subItems) subItems.classList.remove('hidden');
            }
          });
        });
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAccordion);
      } else {
        initAccordion();
      }
    })();

    // Lightbox Functionality
    document.querySelectorAll('.markdown-body img').forEach(img => {
      img.addEventListener('click', () => {
        const lb = document.getElementById('lightbox');
        const lbImg = document.getElementById('lightbox-image');
        lbImg.src = img.src;
        lb.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      const lb = document.getElementById('lightbox');
      if (lb) {
        lb.classList.remove('active');
        document.body.style.overflow = '';
      }
    }

    // Close Lightbox on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        closeLightbox();
      }
    });

    // Mobile Sidebar Drawer
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar-drawer');
    if (menuToggle && sidebar) {
      menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('hidden');
        sidebar.classList.toggle('fixed');
        sidebar.classList.toggle('inset-y-0');
        sidebar.classList.toggle('left-0');
        sidebar.classList.toggle('z-50');
        sidebar.classList.toggle('shadow-2xl');
      });
    }

    // Incremental Search in Sidebar
    const searchInput = document.getElementById('manual-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const navItems = document.querySelectorAll('.nav-sub-items .nav-item');
        const groups = document.querySelectorAll('.nav-group');

        navItems.forEach(item => {
          const text = item.textContent.toLowerCase();
          if (!query || text.includes(query)) {
            item.style.display = 'flex';
          } else {
            item.style.display = 'none';
          }
        });

        groups.forEach(g => {
          const sub = g.querySelector('.nav-sub-items');
          if (query) {
            g.classList.add('is-open');
            if (sub) sub.classList.remove('hidden');
          }
        });
      });
    }

    // Make table rows with internal anchor links clickable as full rows
    document.querySelectorAll('.markdown-body table tbody tr').forEach(tr => {
      const anchor = tr.querySelector('a[href^="#"]');
      if (anchor) {
        tr.classList.add('clickable-row');
        tr.title = 'クリックしてこのステップの説明へジャンプ';
        tr.addEventListener('click', (e) => {
          if (e.target.tagName === 'A' && e.target.getAttribute('href') !== anchor.getAttribute('href')) {
            return;
          }
          const targetId = anchor.getAttribute('href');
          const targetElem = document.querySelector(targetId);
          if (targetElem) {
            targetElem.scrollIntoView({ behavior: 'smooth' });
            history.pushState(null, '', targetId);
          } else {
            window.location.hash = targetId;
          }
        });
      }
    });

    // Floating Back to Flowchart Button Logic
    const floatingFlowchartBtn = document.getElementById('floating-flowchart-btn');
    const flowchartTarget = document.getElementById('timeline-flowchart');
    if (floatingFlowchartBtn && flowchartTarget) {
      const handleScroll = () => {
        const rect = flowchartTarget.getBoundingClientRect();
        if (rect.bottom < 50) {
          floatingFlowchartBtn.classList.add('is-visible');
        } else {
          floatingFlowchartBtn.classList.remove('is-visible');
        }
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();

      floatingFlowchartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        flowchartTarget.scrollIntoView({ behavior: 'smooth' });
        history.pushState(null, '', '#timeline-flowchart');
      });
    } else if (floatingFlowchartBtn) {
      floatingFlowchartBtn.remove();
    }
  </script>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <script>
    if (document.querySelector('.mermaid') && typeof mermaid !== 'undefined') {
      mermaid.initialize({ startOnLoad: true, theme: 'neutral', securityLevel: 'loose' });
      mermaid.run().then(() => {
        document.querySelectorAll('.mermaid a').forEach(a => {
          const href = a.getAttribute('href') || a.getAttribute('xlink:href');
          if (href && href.startsWith('#')) {
            a.addEventListener('click', (e) => {
              e.preventDefault();
              const target = document.querySelector(href);
              if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                history.pushState(null, '', href);
              } else {
                window.location.hash = href;
              }
            });
          }
        });
      }).catch(() => {});
    }
  </script>
</body>
</html>`;
}

// Build all markdown files
const mdFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.md') && f !== 'README.md');
console.log(`Building ${mdFiles.length} modern manual pages...`);

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

  // Extract headings for TOC
  const headings = [];
  const headingMatches = contentMd.matchAll(/^(#{2,3})\s+(.+)$/gm);
  for (const m of headingMatches) {
    const level = m[1].length;
    const rawText = m[2].trim();
    const cleanText = rawText.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1').replace(/[*_`]/g, '');
    const id = encodeURIComponent(cleanText.toLowerCase().replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/g, '-'));
    headings.push({ level, text: cleanText, id });
  }

  const htmlContent = marked.parse(contentMd);
  const pageHtml = renderFullHTML({
    title,
    content: htmlContent,
    currentFile: file,
    headings
  });

  const baseName = path.basename(file, '.md');
  const outName = `${encodeURIComponent(baseName)}.html`;
  fs.writeFileSync(path.join(DIST_DIR, outName), pageHtml, 'utf-8');
  if (outName !== `${baseName}.html`) {
    fs.writeFileSync(path.join(DIST_DIR, `${baseName}.html`), pageHtml, 'utf-8');
  }

  if (file === 'top.md') {
    fs.writeFileSync(path.join(DIST_DIR, 'index.html'), pageHtml, 'utf-8');
  }
});

console.log('Successfully generated modern 3-column documentation in dist/!');
