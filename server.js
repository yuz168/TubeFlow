const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Invidious インスタンスのリスト
// これらは Glitch.me の環境変数などで管理することも検討してください
const INVIDIOUS_INSTANCES = [
    "https://pol1.iv.ggtyler.dev",
    "https://invidious.lunivers.trade",
    "https://cal1.iv.ggtyler.dev",
    "https://lekker.gay",
    "https://iv.ggtyler.dev",
    "https://invidious.f5.si",
    "https://nyc1.iv.ggtyler.dev",
    "https://iv.duti.dev",
    "https://iv.melmac.space",
    "https://eu-proxy.poketube.fun",
    "https://invidious.reallyaweso.me",
    "https://invidious.dhusch.de",
    "https://yewtu.be",
    "https://usa-proxy2.poketube.fun",
    "https://id.420129.xyz",
    "https://invidious.darkness.service",
    "https://iv.datura.network",
    "https://invidious.jing.rocks",
    "https://invidious.private.coffee",
    "https://youtube.mosesmang.com",
    "https://invidious.projectsegfau.lt",
    "https://invidious.perennialte.ch",
    "https://invidious.einfachzocken.eu",
    "https://invidious.adminforge.de",
    "https://invid-api.poketube.fun",
    "https://inv.nadeko.net",
    "https://invidious.esmailelbob.xyz",
    "https://invidious.0011.lt",
    "https://invidious.ducks.party",
    "https://invidious.privacyredirect.com",
    "https://youtube.privacyplz.org",
    "https://invidious.materialio.us",
    "https://yt.artemislena.eu",
    "https://invidious.schenkel.eti.br"
];

// Invidious インスタンスを選択するシンプルな関数
// 実際にはより堅牢なヘルスチェックやラウンドロビンが必要
function getRandomInvidiousInstance() {
    return INVIDIOUS_INSTANCES[Math.floor(Math.random() * INVIDIOUS_INSTANCES.length)];
}

// EJS をビューエンジンとして設定
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // フォームデータ解析のため

// ルートページ (検索と人気動画)
app.get('/', async (req, res) => {
    let trendingVideos = [];
    try {
        const instance = getRandomInvidiousInstance();
        const response = await axios.get(`${instance}/api/v2/trending`);
        trendingVideos = response.data;
    } catch (error) {
        console.error('Error fetching trending videos:', error.message);
        // エラー時は空の配列を渡し、フロントで表示しないようにする
    }
    res.render('index', { trendingVideos: trendingVideos, searchQuery: '' });
});

// 検索結果ページ
app.get('/search', async (req, res) => {
    const searchQuery = req.query.q;
    let searchResults = [];
    if (searchQuery) {
        try {
            const instance = getRandomInvidiousInstance();
            // Invidious APIの検索エンドポイントは `/api/v2/search?q=` です
            const response = await axios.get(`${instance}/api/v2/search?q=${encodeURIComponent(searchQuery)}`);
            searchResults = response.data;
        } catch (error) {
            console.error('Error fetching search results:', error.message);
        }
    }
    res.render('index', { searchResults: searchResults, searchQuery: searchQuery });
});

// 動画ページ
app.get('/video', async (req, res) => {
    const videoId = req.query.id;
    let videoData = null;
    let relatedVideos = [];
    let comments = [];

    if (videoId) {
        try {
            const instance = getRandomInvidiousInstance();
            // 動画情報取得
            const videoResponse = await axios.get(`${instance}/api/v2/videos/${videoId}`);
            videoData = videoResponse.data;

            // 関連動画取得
            // Invidious APIには直接関連動画のエンドポイントがない場合が多いので、
            // videoDataに含まれるrecommendationsを使用するか、別途検索を行う
            if (videoData && videoData.recommendedVideos) {
                relatedVideos = videoData.recommendedVideos;
            } else {
                // 簡易的に動画タイトルで検索し、関連動画とする (精度は低い)
                if (videoData && videoData.title) {
                    const relatedSearchResponse = await axios.get(`${instance}/api/v2/search?q=${encodeURIComponent(videoData.title)}`);
                    relatedVideos = relatedSearchResponse.data.filter(v => v.videoId !== videoId).slice(0, 5); // 検索結果から自身を除外
                }
            }

            // コメント取得 (Invidious APIがコメントを直接提供していない場合もある)
            try {
                const commentsResponse = await axios.get(`${instance}/api/v2/comments/${videoId}`);
                comments = commentsResponse.data.comments;
            } catch (commentError) {
                console.warn('Comments API not available or error fetching comments:', commentError.message);
                comments = []; // コメントが取得できない場合は空にする
            }


        } catch (error) {
            console.error('Error fetching video data:', error.message);
            videoData = null; // エラー時は動画データをクリア
        }
    }
    res.render('video', { video: videoData, relatedVideos: relatedVideos, comments: comments });
});

// チャンネルページ
app.get('/channel', async (req, res) => {
    const channelId = req.query.id;
    let channelData = null;
    let channelVideos = [];

    if (channelId) {
        try {
            const instance = getRandomInvidiousInstance();
            // チャンネル情報取得
            const channelResponse = await axios.get(`${instance}/api/v2/channels/${channelId}`);
            channelData = channelResponse.data;

            // チャンネル動画取得 (チャンネル情報に含まれる場合と、別途エンドポイントがある場合がある)
            if (channelData && channelData.latestVideos) {
                channelVideos = channelData.latestVideos;
            } else {
                // チャンネルの動画を検索するAPIがあるか確認し、なければチャンネル名で検索するなど工夫
                // 例: Invidious APIの '/api/v2/channels/:channelId/videos' など
                try {
                    const channelVideosResponse = await axios.get(`${instance}/api/v2/channels/${channelId}/videos`);
                    channelVideos = channelVideosResponse.data;
                } catch (videosError) {
                    console.warn('Channel videos API not available or error fetching channel videos:', videosError.message);
                    channelVideos = [];
                }
            }

        } catch (error) {
            console.error('Error fetching channel data:', error.message);
            channelData = null; // エラー時はチャンネルデータをクリア
        }
    }
    res.render('channel', { channel: channelData, videos: channelVideos });
});


// サーバー起動
app.listen(PORT, () => {
    console.log(`TubeFlow server running on port ${PORT}`);
});
