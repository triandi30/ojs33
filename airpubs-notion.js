/**
 * AiRPubs OJS Enhancement Script - REMOVE VERSION
 * Menghapus: afiliasi, abstract view, pdf view, doi, halaman
 */
(function() {
    'use strict';

    function removeElements() {
        // 1. Hapus afiliasi penulis (dari berbagai kemungkinan selector)
        var affiliationSelectors = [
            '.authors .affiliation',
            '.item.authors .affiliation',
            '.obj_article_details .affiliation',
            '.authors .affiliation',
            '[class*="affiliation"]',
            '.airpubs-affiliations'
        ];
        affiliationSelectors.forEach(function(sel) {
            document.querySelectorAll(sel).forEach(function(el) { if(el) el.remove(); });
        });

        // 2. Hapus abstract view counter
        var abstractViewSelectors = [
            '.abstract_views',
            '.stat_views',
            '.views_abstract',
            '[class*="abstract_view"]',
            '.item.views',
            '.statistic_views',
            'span:contains("Abstract")',
            '.airpubs-stat'
        ];
        abstractViewSelectors.forEach(function(sel) {
            document.querySelectorAll(sel).forEach(function(el) {
                if(el && (el.textContent.includes('Abstract') || el.textContent.includes('abstract'))) {
                    el.remove();
                }
            });
        });

        // 3. Hapus pdf view counter
        var pdfViewSelectors = [
            '.pdf_views',
            '.views_pdf',
            '.downloads_pdf',
            '[class*="pdf_view"]',
            'span:contains("PDF")',
            '.airpubs-stat'
        ];
        pdfViewSelectors.forEach(function(sel) {
            document.querySelectorAll(sel).forEach(function(el) {
                if(el && (el.textContent.includes('PDF') || el.textContent.includes('pdf'))) {
                    el.remove();
                }
            });
        });

        // 4. Hapus DOI
        var doiSelectors = [
            '.doi',
            '.item.doi',
            '[class*="doi"]',
            'a[href*="doi.org"]',
            '.airpubs-doi',
            '.airpubs-doi-row'
        ];
        doiSelectors.forEach(function(sel) {
            document.querySelectorAll(sel).forEach(function(el) {
                if(el) el.remove();
                // Hapus parent jika hanya berisi DOI
                if(el && el.parentElement && el.parentElement.children.length === 0) {
                    el.parentElement.remove();
                }
            });
        });

        // 5. Hapus halaman (pages)
        var pagesSelectors = [
            '.pages',
            '.item.pages',
            '.pages span',
            '.airpubs-pages',
            '[class*="pages"]'
        ];
        pagesSelectors.forEach(function(sel) {
            document.querySelectorAll(sel).forEach(function(el) {
                if(el) el.remove();
            });
        });

        // 6. Hapus baris stats (abstract + pdf views)
        document.querySelectorAll('.airpubs-stats-row, .statistics, .article-statistics').forEach(function(el) {
            el.remove();
        });

        // 7. Hapus tombol galley jika diperlukan (tidak disebutkan, tapi bisa ditambahkan)
        // document.querySelectorAll('.galleys_links, .galley-links, .airpubs-galley-btns').forEach(el => el.remove());

        // 8. Hapus baris DOI row yang mungkin membungkus galley + DOI
        document.querySelectorAll('.airpubs-doi-row, .doi-row').forEach(function(el) {
            el.remove();
        });

        // 9. Hapus extra bottom section
        document.querySelectorAll('.airpubs-extra').forEach(function(el) {
            el.remove();
        });
    }

    // Fungsi untuk memproses setiap artikel dan menghapus elemen yang tidak diinginkan
    function processArticles() {
        var articles = document.querySelectorAll('.obj_article_summary, .article-summary, .article');
        
        articles.forEach(function(article) {
            // Hapus dari dalam artikel
            var toRemove = article.querySelectorAll('.affiliation, .doi, .pages, .airpubs-affiliations, .airpubs-doi, .airpubs-pages, .airpubs-stats-row, .airpubs-extra, .airpubs-doi-row, .abstract_views, .pdf_views, .views, .stat');
            toRemove.forEach(function(el) {
                if(el) el.remove();
            });
        });
    }

    // Observasi perubahan DOM untuk menangani konten yang dimuat secara dinamis
    var observer = new MutationObserver(function() {
        removeElements();
        processArticles();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Jalankan segera
    removeElements();
    processArticles();

    console.log('Script berjalan - afiliasi, abstract view, pdf view, doi, halaman telah dihapus');
})();
