/**
 * INTEVE SCHOOL Manual - 3-Column Interactive Search & Page Preview Engine
 * 
 * Column 1 (Left): Navigation menu & search input
 * Column 2 (Center): Real-time search results list with relevance scoring & snippets
 * Column 3 (Right): Non-destructive page preview with "全画面表示しますか？" confirmation bar
 */
(function() {
  function initSearchWorkspace() {
    const searchInput = document.getElementById('manual-search');
    const searchClearBtn = document.getElementById('manual-search-clear');
    const mainContentArea = document.getElementById('main-content-area');
    const rightSidebar = document.getElementById('right-sidebar');
    const searchWorkspace = document.getElementById('search-workspace');
    const searchResultsScroll = document.getElementById('search-results-scroll');
    const searchQueryDisplay = document.getElementById('search-query-display');
    const searchTotalCount = document.getElementById('search-total-count');
    const searchExitBtn = document.getElementById('search-exit-btn');

    const previewEmptyState = document.getElementById('preview-empty-state');
    const previewContentContainer = document.getElementById('preview-content-container');
    const previewFullscreenBtn = document.getElementById('preview-fullscreen-btn');
    const previewCloseBtn = document.getElementById('preview-close-btn');
    const previewArticleBody = document.getElementById('preview-article-body');

    if (!searchInput || !searchWorkspace) return;

    let searchIndex = null;
    let isLoadingIndex = false;
    let debounceTimer = null;
    let currentPreviewUrl = null;
    let activeQuery = '';

    // Cache of fetched page contents
    const pageHtmlCache = new Map();

    // Helper: Escape HTML
    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    // Helper: Escape Regex Characters
    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Fetch search-index.json lazily
    async function loadSearchIndex() {
      if (searchIndex || isLoadingIndex) return searchIndex;
      isLoadingIndex = true;
      try {
        const res = await fetch('/search-index.json');
        if (res.ok) {
          searchIndex = await res.json();
          return searchIndex;
        } else {
          console.error('Failed to load search-index.json:', res.status);
        }
      } catch (err) {
        console.error('Error fetching search index:', err);
      } finally {
        isLoadingIndex = false;
      }
      return null;
    }

    // Preload index on focus
    searchInput.addEventListener('focus', loadSearchIndex);

    function openSearchWorkspace() {
      if (mainContentArea) mainContentArea.classList.add('hidden');
      if (rightSidebar) rightSidebar.classList.add('hidden');
      if (searchWorkspace) searchWorkspace.classList.remove('hidden');
    }

    function closeSearchWorkspace() {
      if (searchWorkspace) searchWorkspace.classList.add('hidden');
      if (mainContentArea) mainContentArea.classList.remove('hidden');
      if (rightSidebar) rightSidebar.classList.remove('hidden');
      closePreview();
    }

    function closePreview() {
      currentPreviewUrl = null;
      if (previewContentContainer) previewContentContainer.classList.add('hidden');
      if (previewEmptyState) previewEmptyState.classList.remove('hidden');
      if (searchResultsScroll) {
        searchResultsScroll.querySelectorAll('.search-result-card').forEach(c => {
          c.classList.remove('is-selected');
        });
      }
    }

    // Load and render page preview in Column 3
    async function loadPagePreview(pageUrl, terms) {
      if (currentPreviewUrl === pageUrl) return;
      currentPreviewUrl = pageUrl;

      // Update card selected state
      if (searchResultsScroll) {
        searchResultsScroll.querySelectorAll('.search-result-card').forEach(c => {
          if (c.getAttribute('data-url') === pageUrl) {
            c.classList.add('is-selected');
          } else {
            c.classList.remove('is-selected');
          }
        });
      }

      // Show preview container
      if (previewEmptyState) previewEmptyState.classList.add('hidden');
      if (previewContentContainer) previewContentContainer.classList.remove('hidden');
      const resolvedUrl = pageUrl.startsWith('/') ? pageUrl : '/' + pageUrl;
      if (previewFullscreenBtn) previewFullscreenBtn.href = resolvedUrl;

      // Show loading indicator
      if (previewArticleBody) {
        previewArticleBody.innerHTML = `
          <div class="search-loading">
            <i class="fa-solid fa-circle-notch fa-spin text-xl"></i>
            <span>ページを読み込み中...</span>
          </div>
        `;
      }

      try {
        let htmlText = pageHtmlCache.get(resolvedUrl);
        if (!htmlText) {
          const res = await fetch(resolvedUrl);
          if (!res.ok) throw new Error(`HTTP error ${res.status}`);
          htmlText = await res.text();
          pageHtmlCache.set(resolvedUrl, htmlText);
        }

        // Only update if this is still the requested preview
        if (currentPreviewUrl !== pageUrl) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        // Extract article content
        const article = doc.querySelector('.article-card.markdown-body') || doc.querySelector('.markdown-body') || doc.querySelector('main');
        if (!article) {
          if (previewArticleBody) previewArticleBody.innerHTML = '<p class="text-slate-500 p-4">内容の読み込みに失敗しました。</p>';
          return;
        }

        // Remove promotion banners & floating buttons inside preview
        const upsell = article.querySelector('.upsell-banner');
        if (upsell) upsell.remove();
        const prevNext = article.querySelector('.page-nav-container');
        if (prevNext) prevNext.remove();

        // Highlight matching terms in preview text nodes
        if (terms && terms.length > 0) {
          const regex = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi');
          highlightTextNodes(article, regex);
        }

        if (previewArticleBody) {
          previewArticleBody.innerHTML = article.innerHTML;

          // Scroll preview to top
          const scrollWrapper = previewContentContainer.querySelector('.preview-scroll-wrapper');
          if (scrollWrapper) scrollWrapper.scrollTop = 0;

          // Re-initialize mermaid if any exists in preview
          if (window.mermaid && previewArticleBody.querySelector('.mermaid')) {
            window.mermaid.run({ nodes: previewArticleBody.querySelectorAll('.mermaid') });
          }
        }
      } catch (err) {
        console.error('Failed to load preview:', err);
        if (previewArticleBody && currentPreviewUrl === pageUrl) {
          previewArticleBody.innerHTML = `
            <div class="p-6 text-center text-slate-500">
              <i class="fa-solid fa-triangle-exclamation text-amber-500 text-2xl mb-2 block"></i>
              <p class="font-semibold text-slate-700 mb-2">プレビューの読み込みに失敗しました</p>
              <a href="${pageUrl}" class="inline-flex items-center gap-2 bg-[#00BCD4] text-white text-xs font-bold px-3 py-1.5 rounded shadow hover:opacity-90">
                <span>直接ページを開く</span>
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            </div>
          `;
        }
      }
    }

    // Safely highlight terms inside text nodes without corrupting HTML tags
    function highlightTextNodes(root, regex) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
      const textNodes = [];
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.parentElement && !['SCRIPT', 'STYLE', 'MARK', 'CODE', 'PRE'].includes(node.parentElement.tagName)) {
          if (regex.test(node.nodeValue)) {
            textNodes.push(node);
          }
        }
      }

      textNodes.forEach(node => {
        const span = document.createElement('span');
        span.innerHTML = node.nodeValue.replace(regex, '<mark>$1</mark>');
        node.parentElement.replaceChild(span, node);
      });
    }

    // Perform the full-text search
    async function performSearch(query) {
      activeQuery = query;
      const rawTerms = query.split(/[\s　]+/).filter(t => t.length > 0);

      if (rawTerms.length === 0) {
        closeSearchWorkspace();
        return;
      }

      openSearchWorkspace();

      if (searchQueryDisplay) {
        searchQueryDisplay.textContent = `「${query}」の検索結果`;
      }

      const index = await loadSearchIndex();
      if (!index) {
        if (searchResultsScroll) {
          searchResultsScroll.innerHTML = `
            <div class="search-loading">
              <i class="fa-solid fa-circle-notch fa-spin"></i>
              <span>インデックスを読み込み中...</span>
            </div>
          `;
        }
        return;
      }

      // Check if query hasn't changed while awaiting
      if (searchInput.value.trim() !== query) return;

      const terms = rawTerms.map(t => t.toLowerCase());
      const regexTerms = rawTerms.map(escapeRegExp);
      const highlightRegex = new RegExp(`(${regexTerms.join('|')})`, 'gi');

      const scoredResults = [];

      for (const page of index) {
        const titleLower = (page.title || '').toLowerCase();
        const contentLower = (page.content || '').toLowerCase();
        const moduleLower = (page.module || '').toLowerCase();
        const headingsText = Array.isArray(page.headings) ? page.headings.join(' ').toLowerCase() : '';

        // Check if all search terms match (AND search condition)
        let matchAll = true;
        for (const term of terms) {
          if (
            !titleLower.includes(term) &&
            !contentLower.includes(term) &&
            !moduleLower.includes(term) &&
            !headingsText.includes(term)
          ) {
            matchAll = false;
            break;
          }
        }

        if (!matchAll) continue;

        // Relevance Scoring
        let score = 0;
        for (const term of terms) {
          if (titleLower === term) score += 100;
          else if (titleLower.includes(term)) score += 35;

          if (moduleLower.includes(term)) score += 15;
          if (headingsText.includes(term)) score += 10;

          // Occurrences in content (up to 15 times)
          let idx = 0;
          let count = 0;
          while ((idx = contentLower.indexOf(term, idx)) !== -1 && count < 15) {
            score += 2;
            idx += term.length;
            count++;
          }
        }

        // Extract Snippet
        let snippet = '';
        let firstMatchPos = -1;
        for (const term of terms) {
          const p = contentLower.indexOf(term);
          if (p !== -1 && (firstMatchPos === -1 || p < firstMatchPos)) {
            firstMatchPos = p;
          }
        }

        if (firstMatchPos !== -1) {
          const start = Math.max(0, firstMatchPos - 35);
          const end = Math.min(page.content.length, firstMatchPos + 85);
          snippet = (start > 0 ? '...' : '') +
            page.content.slice(start, end).trim() +
            (end < page.content.length ? '...' : '');
        } else {
          snippet = (page.content || '').slice(0, 100) + ((page.content || '').length > 100 ? '...' : '');
        }

        scoredResults.push({
          page,
          score,
          snippet
        });
      }

      // Sort by relevance score descending
      scoredResults.sort((a, b) => b.score - a.score);

      // Update total count badge
      if (searchTotalCount) {
        searchTotalCount.textContent = scoredResults.length;
      }

      if (scoredResults.length === 0) {
        if (searchResultsScroll) {
          searchResultsScroll.innerHTML = `
            <div class="search-no-results">
              <i class="fa-solid fa-magnifying-glass text-slate-300 text-3xl mb-3 block"></i>
              <p class="font-semibold text-slate-600 mb-1">一致するページは見つかりませんでした</p>
              <p class="text-xs text-slate-400">別のキーワードや、ひらがな・漢字を変えてお試しください。</p>
            </div>
          `;
        }
        closePreview();
        return;
      }

      const currentPath = window.location.pathname.split('/').pop() || 'index.html';

      let html = '';
      scoredResults.forEach(res => {
        const isCurrent = res.page.url === currentPath;
        const isSelected = res.page.url === currentPreviewUrl;
        const highlightedTitle = escapeHtml(res.page.title).replace(highlightRegex, '<mark>$1</mark>');
        const highlightedSnippet = escapeHtml(res.snippet).replace(highlightRegex, '<mark>$1</mark>');
        const moduleIcon = res.page.moduleIcon || 'fa-solid fa-file-lines';

        html += `
          <div class="search-result-card ${isSelected ? 'is-selected' : ''} ${isCurrent ? 'is-current-page' : ''}" data-url="${res.page.url}" data-title="${escapeHtml(res.page.title)}">
            <div class="search-result-module">
              <i class="${moduleIcon} text-[10px]"></i>
              <span>${escapeHtml(res.page.module)}</span>
              ${isCurrent ? '<span class="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded ml-auto">閲覧中</span>' : ''}
            </div>
            <div class="search-result-title">${highlightedTitle}</div>
            <div class="search-result-snippet">${highlightedSnippet}</div>
          </div>
        `;
      });

      if (searchResultsScroll) {
        searchResultsScroll.innerHTML = html;

        // Attach click listeners to cards
        searchResultsScroll.querySelectorAll('.search-result-card').forEach(card => {
          card.addEventListener('click', (e) => {
            e.preventDefault();
            const url = card.getAttribute('data-url');
            loadPagePreview(url, terms);
          });
        });
      }

      // If user had a preview open and it's still in results, re-select it
      if (currentPreviewUrl && scoredResults.some(r => r.page.url === currentPreviewUrl)) {
        loadPagePreview(currentPreviewUrl, terms);
      }
    }

    // Input handler with debounce
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();

      if (query) {
        if (searchClearBtn) searchClearBtn.classList.remove('hidden');
      } else {
        if (searchClearBtn) searchClearBtn.classList.add('hidden');
      }

      // Filter left sidebar navigation
      const lowerQuery = query.toLowerCase();
      const navItems = document.querySelectorAll('.nav-sub-items .nav-item');
      const groups = document.querySelectorAll('.nav-group');

      navItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (!query || text.includes(lowerQuery)) {
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

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        performSearch(query);
      }, 150);
    });

    // Clear search input button
    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchClearBtn.classList.add('hidden');
        closeSearchWorkspace();
        searchInput.dispatchEvent(new Event('input'));
        searchInput.focus();
      });
    }

    // Exit search button in center topbar
    if (searchExitBtn) {
      searchExitBtn.addEventListener('click', () => {
        searchInput.value = '';
        if (searchClearBtn) searchClearBtn.classList.add('hidden');
        closeSearchWorkspace();
        searchInput.dispatchEvent(new Event('input'));
      });
    }

    // Close preview button in right topbar
    if (previewCloseBtn) {
      previewCloseBtn.addEventListener('click', () => {
        closePreview();
      });
    }

    // Keyboard shortcuts (Escape key)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (searchWorkspace && !searchWorkspace.classList.contains('hidden')) {
          if (currentPreviewUrl) {
            closePreview();
          } else {
            searchInput.value = '';
            if (searchClearBtn) searchClearBtn.classList.add('hidden');
            closeSearchWorkspace();
            searchInput.dispatchEvent(new Event('input'));
          }
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearchWorkspace);
  } else {
    initSearchWorkspace();
  }
})();
