document.addEventListener('DOMContentLoaded', () => {
    console.log('TubeFlow frontend script loaded!');

    // --- 動画再生ページでの自動次動画再生機能の提案 (オプション) ---
    // この機能はユーザーのデータ使用量や好みにより賛否があるため、
    // 必要に応じて有効化してください。
    const videoPlayer = document.querySelector('.video-player-container video');
    if (videoPlayer) {
        videoPlayer.addEventListener('ended', () => {
            console.log('Video playback ended. Attempting to play next related video...');
            const relatedVideos = document.querySelectorAll('.related-videos .video-item a');

            if (relatedVideos.length > 0) {
                // 最初の関連動画に自動的に遷移
                const nextVideoUrl = relatedVideos[0].href;
                console.log(`Navigating to next video: ${nextVideoUrl}`);
                window.location.href = nextVideoUrl;
            } else {
                console.log('No related videos found to autoplay.');
            }
        });

        // --- 動画の音量記憶機能 (LocalStorageを使用) ---
        // ユーザーが以前設定した音量を記憶し、次回再生時に適用します。
        const savedVolume = localStorage.getItem('tubeFlowVideoVolume');
        if (savedVolume !== null) {
            videoPlayer.volume = parseFloat(savedVolume);
            console.log(`Restored video volume to: ${videoPlayer.volume}`);
        }

        videoPlayer.addEventListener('volumechange', () => {
            localStorage.setItem('tubeFlowVideoVolume', videoPlayer.volume.toString());
            console.log(`Saved video volume: ${videoPlayer.volume}`);
        });
    }

    // --- 検索フォームのクライアントサイドバリデーション (オプション) ---
    // ユーザーが空の検索クエリを送信するのを防ぎます。
    const searchForm = document.querySelector('header form');
    const searchInput = document.querySelector('header input[name="q"]');

    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', (event) => {
            if (searchInput.value.trim() === '') {
                event.preventDefault(); // フォームの送信を停止
                alert('検索キーワードを入力してください。');
                searchInput.focus(); // 検索入力フィールドにフォーカスを当てる
                console.warn('Search query was empty. Form submission prevented.');
            }
        });
    }

    // --- コメントセクションの展開/折りたたみ機能 (UI改善) ---
    // コメントが多い場合に、最初は一部だけ表示し、クリックで全体を表示する。
    const commentsSection = document.querySelector('.comments-section');
    if (commentsSection) {
        const commentsList = commentsSection.querySelector('.comments-list'); // コメントのリスト全体
        const commentsHeader = commentsSection.querySelector('h3');

        if (commentsList && commentsHeader) {
            // 初期状態では、コメントリストの高さを制限し、スクロール可能にするか、
            // もしくは一定数以上の場合に「もっと見る」ボタンを表示する。
            // ここでは簡単な例として、クリックで表示/非表示を切り替える。
            // 実際のサイトではCSSで初期表示の高さを設定し、ボタンで切り替える方が一般的です。

            // 例: 初期状態で高さを制限したい場合 (CSSと連携)
            // commentsList.style.maxHeight = '300px'; // 例としての高さ
            // commentsList.style.overflowY = 'auto'; // スクロール可能にする

            // クリックイベントでコメントの表示を切り替えるトグルボタンの例
            const toggleButton = document.createElement('button');
            toggleButton.textContent = 'コメントを非表示';
            toggleButton.classList.add('toggle-comments-button'); // CSSでスタイルを当てるためのクラス
            commentsHeader.appendChild(toggleButton); // ヘッダーの下にボタンを追加

            commentsList.style.display = 'block'; // 初期表示は表示状態に

            toggleButton.addEventListener('click', () => {
                if (commentsList.style.display === 'none') {
                    commentsList.style.display = 'block';
                    toggleButton.textContent = 'コメントを非表示';
                } else {
                    commentsList.style.display = 'none';
                    toggleButton.textContent = 'コメントを表示';
                }
                console.log(`Comments section toggled to: ${commentsList.style.display}`);
            });
        }
    }
});
