const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 設定
const slides = [
  {
    name: 'slides',
    file: 'slides.md',
    title: 'AIコーディングの心構え',
    description: 'コンテクスト・スコープ・粒度の3つの軸でAIを使いこなす方法'
  }
  // 新しいスライドはここに追加
];

// docsディレクトリをクリーンアップ
if (fs.existsSync('docs')) {
  fs.rmSync('docs', { recursive: true });
}
fs.mkdirSync('docs');

// インデックスページをコピー
fs.copyFileSync('index.html', 'docs/index.html');

// 各スライドをビルド
slides.forEach(slide => {
  console.log(`Building ${slide.name}...`);
  execSync(`reveal-md ${slide.file} --static docs/${slide.name}`, { stdio: 'inherit' });
});

console.log('Build completed!');