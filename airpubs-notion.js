/**
 * AiRPubs OJS Enhancement Script v1 (Tanpa Penulis, Afiliasi, DOI)
 * With fetch() - gets stats from article detail page
 * Works on servers that don't block same-origin fetch
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
            '.airpubs-extra { margin-top:12px; padding-top:12px; border-top:1px solid #f3f4f6; overflow:hidden; }' +
            '.airpubs-doi-row { display:flex!important; align-items:center!important; justify-content:space-between!important; flex-wrap:nowrap!important; gap:10px; }' +
            '.airpubs-galley-btns { display:flex!important; gap:8px; flex-wrap:wrap; flex-shrink:0; }' +
            '.airpubs-galley-btn { display:inline-flex; align-items:center; gap:5px; padding:6px 16px; border:1.5px solid #dc3545; border-radius:5px; font-size:12.5px; font-weight:600; color:#dc3545; text-decoration:none; transition:all .2s ease; }' +
            '.airpubs-galley-btn:hover { background:#dc3545; color:#fff; text-decoration:none; }' +
            '.airpubs-pages { font-size:13px; color:#6b7280; display:inline-flex; align-items:center; gap:5px; }' +
            '.airpubs-stats-row { display:flex; gap:20px; margin-bottom:10px; }' +
            '.airpubs-stat { font-size:13px; color:#6b7280; display:inline-flex; align-items:center; gap:5px; }' +
            '';
        document.head.appendChild(css);

        // Load external CSS
        var extCss = document.createElement('link');
        extCss.rel = 'stylesheet';
        extCss.href = 'https://cdn.jsdelivr.net/gh/triandi30/cssv2@main/notion.css';
        document.head.appendChild(extCss);

        var articles = document.querySelectorAll('.obj_article_summary');
        if (!articles.length) return;

        // Helper function to build bottom section (tanpa DOI)
        function buildBottom(article, galleys, pages, abstractViews, pdfViews) {
            var bottomHtml = '<div class="airpubs-extra">';
            // Stats row
            bottomHtml += '<div class="airpubs-stats-row">';
            bottomHtml += '<span class="airpubs-stat"><i class="fas fa-chart-line"></i> Abstract : ' + abstractViews + '</span>';
            bottomHtml += '<span class="airpubs-stat"><i class="fas fa-download"></i> PDF : ' + pdfViews + '</span>';
            bottomHtml += '</div>';
            // Galley row (tanpa DOI)
            bottomHtml += '<div class="airpubs-doi-row">';
            bottomHtml += '<div class="airpubs-galley-btns">';
            for (var g = 0; g < galleys.length; g++) {
                bottomHtml += '<a href="' + galleys[g].href + '" class="airpubs-galley-btn"><i class="fas fa-file-pdf"></i> ' + galleys[g].label + '</a>';
            }
            bottomHtml += '</div>';
            bottomHtml += '</div>';
            if (pages) {
                bottomHtml += '<div style="text-align:right;margin-top:4px"><span class="airpubs-pages"><i class="far fa-file-alt"></i> ' + pages + '</span></div>';
            }
            bottomHtml += '</div>';
            article.insertAdjacentHTML('beforeend', bottomHtml);
        }

        articles.forEach(function(article) {
            if (article.getAttribute('data-airpubs')) return;
            article.setAttribute('data-airpubs', '1');

            var titleLink = article.querySelector('.title a') || article.querySelector('h3 a') || article.querySelector('h4 a');
            if (!titleLink) return;

            var articleUrl = titleLink.getAttribute('href');
            var authorsDiv = article.querySelector('.meta .authors');
            var pagesDiv = article.querySelector('.meta .pages');
            var galleysList = article.querySelector('.galleys_links');

            // HAPUS element authors (nama penulis) dari DOM
            if (authorsDiv && authorsDiv.parentNode) {
                authorsDiv.parentNode.removeChild(authorsDiv);
            }

            // Read data first
            var pages = pagesDiv ? pagesDiv.textContent.trim() : '';
            var galleys = [];
            if (galleysList) {
                var gLinks = galleysList.querySelectorAll('a');
                for (var i = 0; i < gLinks.length; i++) {
                    galleys.push({ label: gLinks[i].textContent.trim(), href: gLinks[i].getAttribute('href') });
                }
            }

            // Remove originals
            if (pagesDiv && pagesDiv.parentNode) pagesDiv.parentNode.removeChild(pagesDiv);
            if (galleysList && galleysList.parentNode) galleysList.parentNode.removeChild(galleysList);

            // Fetch article detail untuk mendapatkan stats (tanpa DOI)
            fetch(articleUrl).then(function(res) {
                return res.text();
            }).then(function(html) {
                var parser = new DOMParser();
                var doc = parser.parseFromString(html, 'text/html');

                // Get article ID for stats API
                var artIdMatch = articleUrl.match(/\/view\/(\d+)/);
                var artId = artIdMatch ? artIdMatch[1] : '';
                var journalPath = window.location.pathname.match(/\/index\.php\/([^\/]+)/);
                var jPath = journalPath ? journalPath[1] : '';

                // Fetch stats from API
                var statsUrl = '/index.php/' + jPath + '/api/v1/stats/publications/' + artId;
                fetch(statsUrl).then(function(sr) { return sr.json(); }).then(function(stats) {
                    var abstractViews = stats.abstractViews || 0;
                    var pdfViews = stats.pdfViews || stats.galleyViews || 0;
                    buildBottom(article, galleys, pages, abstractViews, pdfViews);
                }).catch(function() {
                    buildBottom(article, galleys, pages, 0, 0);
                });

            }).catch(function() {
                // Fetch failed - fallback tanpa data tambahan
                buildBottom(article, galleys, pages, 0, 0);
            });
        });

        // Article detail page - HAPUS penulis dan afiliasi dari halaman detail
        var detailAuthors = document.querySelector('.obj_article_details .item.authors');
        if (detailAuthors && !detailAuthors.getAttribute('data-airpubs')) {
            detailAuthors.setAttribute('data-airpubs', '1');
            // Hapus seluruh blok authors dari halaman detail
            if (detailAuthors.parentNode) {
                detailAuthors.parentNode.removeChild(detailAuthors);
            }
        }

        // HAPUS DOI dari halaman detail artikel jika ada
        var doiItem = document.querySelector('.obj_article_details .item.doi');
        if (doiItem && doiItem.parentNode) {
            doiItem.parentNode.removeChild(doiItem);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
