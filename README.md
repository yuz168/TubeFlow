# TubeFlow: Your Private YouTube Experience

## 概要

**TubeFlow** は、広告なしでプライバシーに配慮した動画視聴を提供する、オープンソースの簡易YouTubeビューアです。複数のInvidiousインスタンスを活用することで、YouTubeの動画を追跡を最小限に抑えながら楽しめます。

このプロジェクトは、**Node.js (Express.js)** をバックエンドフレームワークに、**EJS (Embedded JavaScript)** をテンプレートエンジンに、そして標準の**HTML**, **CSS**, **JavaScript**をフロントエンドに使用して構築されています。

---

## 特徴

* **プライバシー重視**: Invidiousインスタンスを経由してコンテンツにアクセスするため、Googleによるデータ追跡を最小限に抑えます。
* **動画検索**: キーワードによる動画検索をサポートし、`/search?q=(キーワード)` というクリーンなURLで結果を表示します。
* **動画再生**: 動画IDに基づく `/video?id=(動画ID)` のURLで直接動画を再生。Invidious APIの `videoStream` を利用し、安定したストリーミングを実現します。
* **チャンネル表示**: チャンネルIDに基づく `/channel?id=(チャンネルID)` のURLで、特定のチャンネルの動画一覧や情報を表示します。
* **人気動画**: トップページで、現在人気のあるトレンド動画を一覧表示します。
* **関連動画・コメント**: 各動画ページで、関連性の高い動画の提案と、動画に対するコメントを閲覧できます。
* **動画音量記憶**: ブラウザのLocalStorageを利用して、動画の音量設定を記憶し、次回再生時に自動適用します。
* **簡易オートプレイ**: 動画再生後、自動的に次の関連動画に遷移するオプション機能。

---

## 技術スタック

* **バックエンド**: Node.js, Express.js
* **フロントエンド**: HTML, CSS, JavaScript (Vanilla JS), EJS (埋め込みJavaScriptテンプレート)
* **API**: Invidious API (サードパーティ製)
* **HTTPクライアント**: Axios

---

## セットアップ方法

TubeFlowをローカルで実行するには、以下の手順に従ってください。

### 1. リポジトリのクローン

まず、このGitHubリポジトリをローカルマシンにクローンします。

```bash
git clone [https://github.com/your-username/TubeFlow.git](https://github.com/your-username/TubeFlow.git) # ここをあなたのリポジトリURLに変更してください
cd TubeFlow
