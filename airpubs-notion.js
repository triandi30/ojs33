/**
 * AiRPubs OJS Enhancement Script v1
 * With fetch() - gets affiliations from article detail page
 * Works on servers that don't block same-origin fetch
 * MODIFIED: Removed affiliations, abstract view, doi, pdf view, and pages
 */
(function() {
    'use strict';

    function init() {
        // Inject styles
        var css = document.createElement('style');
        css.textContent = '' +
            '.obj_article_summary { padding:20px; margin-bottom:16px; border:1px solid #e5e7eb; border-radius:10px; background:#fff; transition:all .2s ease; }' +
            '.obj_article_summary:hover { box-shadow:0 4px 15px rgba(0,0,0,.06); border-color:#1565c0; }' +
            '.obj_article_summary .title a { color:#1565c0; font-weight:700; font-size:15px; text-decoration:none; }' +
            '.obj_article_summary .title a:hover { text-decoration:underline; }' +
            '.airpubs-authors { font-size:14px; color:#374151; margin-bottom:6px; }' +
            '';
        document.head.appendChild(css);

        // Load external CSS
        var extCss = document.createElement('link');
        extCss.rel = 'stylesheet';
        extCss.href = 'https://cdn.jsdelivr.net/gh/triandi30/cssv2@main/notion.css';
        document.head.appendChild(extCss);

        var articles = document.querySelectorAll('.obj_article_summary');
        if (!articles.length) return;

        articles.forEach(function(article) {
            if (article.getAttribute('data-airpubs')) return;
            article.setAttribute('data-airpubs', '1');

            var titleLink = article.querySelector('.title a') || article.querySelector('h3 a') || article.querySelector('h4 a');
            if (!titleLink) return;

            var articleUrl = titleLink.getAttribute('href');
            var authorsDiv = article.querySelector('.meta .authors');
            var pagesDiv = article.querySelector('.meta .pages');
            var galleysList = article.querySelector('.galleys_links');

            // Remove originals
            if (pagesDiv && pagesDiv.parentNode) pagesDiv.parentNode.removeChild(pagesDiv);
            if (galleysList && galleysList.parentNode) galleysList.parentNode.removeChild(galleysList);

            // Fetch article detail for authors only
            fetch(articleUrl).then(function(res) {
                return res.text();
            }).then(function(html) {
                var parser = new DOMParser();
                var doc = parser.parseFromString(html, 'text/html');

                // Get authors from meta tags
                var metaAuthors = doc.querySelectorAll('meta[name="citation_author"]');
                var names = [];

                if (metaAuthors.length > 0) {
                    for (var a = 0; a < metaAuthors.length; a++) {
                        names.push(metaAuthors[a].getAttribute('content'));
                    }
                }

                // Build authors HTML (no affiliations)
                if (names.length > 0 && authorsDiv) {
                    var authHtml = '<div class="airpubs-authors"><i class="fas fa-users"></i> ';
                    for (var j = 0; j < names.length; j++) {
                        authHtml += '<strong>' + names[j] + '</strong>';
                        if (j < names.length - 1) authHtml += ', ';
                    }
                    authHtml += '</div>';
                    authorsDiv.innerHTML = authHtml;
                }

            }).catch(function() {
                // Fetch failed - fallback without affiliations
                if (authorsDiv) {
                    var authorsText = authorsDiv.textContent.trim();
                    var authorNames = authorsText.split(',');
                    var authHtml = '<div class="airpubs-authors"><i class="fas fa-users"></i> ';
                    for (var j = 0; j < authorNames.length; j++) {
                        var n = authorNames[j].trim();
                        if (n) {
                            authHtml += '<strong>' + n + '</strong>';
                            if (j < authorNames.length - 1) authHtml += ', ';
                        }
                    }
                    authHtml += '</div>';
                    authorsDiv.innerHTML = authHtml;
                }
            });
        });

        // Article detail page - remove affiliations if present
        var detailAuthors = document.querySelector('.obj_article_details .item.authors ul.authors');
        if (detailAuthors && !detailAuthors.getAttribute('data-airpubs')) {
            detailAuthors.setAttribute('data-airpubs', '1');
            var lis = detailAuthors.querySelectorAll('li');
            var authDetailHtml = '<div class="airpubs-authors" style="margin-bottom:8px"><i class="fas fa-users"></i> ';
            for (var m = 0; m < lis.length; m++) {
                var nameEl = lis[m].querySelector('.name');
                var nm = nameEl ? nameEl.textContent.trim() : '';
                if (nm) {
                    authDetailHtml += '<strong>' + nm + '</strong>';
                    if (m < lis.length - 1) authDetailHtml += ', ';
                }
            }
            authDetailHtml += '</div>';
            detailAuthors.innerHTML = '<li>' + authDetailHtml + '</li>';
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
