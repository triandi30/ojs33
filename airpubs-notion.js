/**
 * AiRPubs OJS Enhancement Script v1 - CLEAN VERSION (No Duplicates)
 * Menghapus: Nama Penulis, Afiliasi, DOI, dan data ganda
 */
(function() {
    'use strict';

    function init() {
        // Inject styles (tanpa style untuk penulis/afiliasi/doi)
        var css = document.createElement('style');
        css.textContent = '' +
            '.obj_article_summary { padding:20px; margin-bottom:16px; border:1px solid #e5e7eb; border-radius:10px; background:#fff; transition:all .2s ease; }' +
            '.obj_article_summary:hover { box-shadow:0 4px 15px rgba(0,0,0,.06); border-color:#1565c0; }' +
            '.obj_article_summary .title a { color:#1565c0; font-weight:700; font-size:15px; text-decoration:none; }' +
            '.obj_article_summary .title a:hover { text-decoration:underline; }' +
            '.airpubs-extra { margin-top:12px; padding-top:12px; border-top:1px solid #f3f4f6; overflow:hidden; }' +
            '.airpubs-galley-btns { display:flex!important; gap:8px; flex-wrap:wrap; }' +
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

        // ==================== HAPUS SEMUA DATA GANDA ====================

        // 1. HAPUS DUPLIKAT ABSTRACT (yang muncul 2 kali)
        var allAbstracts = document.querySelectorAll('.obj_article_details .abstract, .item.abstract');
        if (allAbstracts.length > 1) {
            for (var a = 1; a < allAbstracts.length; a++) {
                if (allAbstracts[a] && allAbstracts[a].parentNode) {
                    allAbstracts[a].parentNode.removeChild(allAbstracts[a]);
                }
            }
        }

        // 2. HAPUS DUPLIKAT PDF STATS (yang muncul 2 kali)
        var allPdfStats = document.querySelectorAll('[class*="pdf"], .airpubs-stat:contains("PDF")');
        // Hapus lewat method lain - cari semua span yang mengandung kata PDF
        var allStats = document.querySelectorAll('.airpubs-stat, .stat-item, .views-pdf');
        var pdfCount = 0;
        for (var s = 0; s < allStats.length; s++) {
            if (allStats[s].textContent && allStats[s].textContent.indexOf('PDF') !== -1) {
                pdfCount++;
                if (pdfCount > 1 && allStats[s].parentNode) {
                    allStats[s].parentNode.removeChild(allStats[s]);
                }
            }
        }

        // 3. HAPUS SEMUA BLOK AUTHORS (nama penulis)
        var allAuthors = document.querySelectorAll('.authors, .item.authors, .meta .authors, .obj_article_details .authors');
        for (var i = 0; i < allAuthors.length; i++) {
            if (allAuthors[i] && allAuthors[i].parentNode) {
                allAuthors[i].parentNode.removeChild(allAuthors[i]);
            }
        }

        // 4. HAPUS SEMUA BLOK AFILIASI
        var allAffiliations = document.querySelectorAll('.affiliation, .item.affiliations, .affiliations');
        for (var j = 0; j < allAffiliations.length; j++) {
            if (allAffiliations[j] && allAffiliations[j].parentNode) {
                allAffiliations[j].parentNode.removeChild(allAffiliations[j]);
            }
        }

        // 5. HAPUS SEMUA DOI
        var allDoi = document.querySelectorAll('.doi, .item.doi, [class*="doi"], meta[name="DC.Identifier.DOI"]');
        for (var k = 0; k < allDoi.length; k++) {
            if (allDoi[k] && allDoi[k].parentNode) {
                allDoi[k].parentNode.removeChild(allDoi[k]);
            }
        }
        // Hapus juga meta DOI dari head (opsional)
        var metaDoi = document.querySelector('meta[name="DC.Identifier.DOI"]');
        if (metaDoi && metaDoi.parentNode) {
            metaDoi.parentNode.removeChild(metaDoi);
        }

        // 6. HAPUS DUPLIKAT PAGES (jika ada)
        var allPages = document.querySelectorAll('.pages, .item.pages');
        if (allPages.length > 1) {
            for (var p = 1; p < allPages.length; p++) {
                if (allPages[p] && allPages[p].parentNode) {
                    allPages[p].parentNode.removeChild(allPages[p]);
                }
            }
        }

        // ==================== TAMPILKAN ULANG DENGAN RAPI (TANPA DOBEL) ====================

        var articles = document.querySelectorAll('.obj_article_summary');
        if (!articles.length) return;

        // Helper function build bottom
        function buildBottom(article, galleys, pages, abstractViews, pdfViews) {
            var bottomHtml = '<div class="airpubs-extra">';
            bottomHtml += '<div class="airpubs-stats-row">';
            bottomHtml += '<span class="airpubs-stat"><i class="fas fa-chart-line"></i> Abstract Views: ' + abstractViews + '</span>';
            bottomHtml += '<span class="airpubs-stat"><i class="fas fa-download"></i> PDF Downloads: ' + pdfViews + '</span>';
            bottomHtml += '</div>';
            bottomHtml += '<div class="airpubs-galley-btns">';
            for (var g = 0; g < galleys.length; g++) {
                bottomHtml += '<a href="' + galleys[g].href + '" class="airpubs-galley-btn"><i class="fas fa-file-pdf"></i> ' + galleys[g].label + '</a>';
            }
            bottomHtml += '</div>';
            if (pages) {
                bottomHtml += '<div style="margin-top:8px; text-align:right"><span class="airpubs-pages"><i class="far fa-file-alt"></i> ' + pages + '</span></div>';
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
            var pagesDiv = article.querySelector('.meta .pages, .pages');
            var galleysList = article.querySelector('.galleys_links');

            // Hapus lagi authors di dalam article ini (antisipasi)
            var articleAuthors = article.querySelector('.authors, .meta .authors');
            if (articleAuthors && articleAuthors.parentNode) {
                articleAuthors.parentNode.removeChild(articleAuthors);
            }

            var pages = pagesDiv ? pagesDiv.textContent.trim() : '';
            var galleys = [];
            if (galleysList) {
                var gLinks = galleysList.querySelectorAll('a');
                for (var i = 0; i < gLinks.length; i++) {
                    galleys.push({ label: gLinks[i].textContent.trim(), href: gLinks[i].getAttribute('href') });
                }
            }

            // Hapus original pages & galleys
            if (pagesDiv && pagesDiv.parentNode) pagesDiv.parentNode.removeChild(pagesDiv);
            if (galleysList && galleysList.parentNode) galleysList.parentNode.removeChild(galleysList);

            // Fetch stats
            fetch(articleUrl).then(function(res) {
                return res.text();
            }).then(function(html) {
                var parser = new DOMParser();
                var doc = parser.parseFromString(html, 'text/html');

                var artIdMatch = articleUrl.match(/\/view\/(\d+)/);
                var artId = artIdMatch ? artIdMatch[1] : '';
                var journalPath = window.location.pathname.match(/\/index\.php\/([^\/]+)/);
                var jPath = journalPath ? journalPath[1] : '';

                if (artId && jPath) {
                    var statsUrl = '/index.php/' + jPath + '/api/v1/stats/publications/' + artId;
                    fetch(statsUrl).then(function(sr) { return sr.json(); }).then(function(stats) {
                        var abstractViews = stats.abstractViews || 0;
                        var pdfViews = stats.pdfViews || stats.galleyViews || 0;
                        buildBottom(article, galleys, pages, abstractViews, pdfViews);
                    }).catch(function() {
                        buildBottom(article, galleys, pages, 0, 0);
                    });
                } else {
                    buildBottom(article, galleys, pages, 0, 0);
                }
            }).catch(function() {
                buildBottom(article, galleys, pages, 0, 0);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
