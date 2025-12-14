#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question) {
  return new Promise(resolve => {
    rl.question(question, resolve);
  });
}

async function createNewSlide() {
  console.log('🎓 新しいスライドを作成します\n');
  
  const name = await prompt('スライド名 (例: 002-advanced-topics): ');
  const title = await prompt('タイトル: ');
  const description = await prompt('説明: ');
  
  const slideDir = path.join('./slides', name);
  
  if (fs.existsSync(slideDir)) {
    console.log(`❌ エラー: ${slideDir} は既に存在します`);
    rl.close();
    return;
  }
  
  // ディレクトリを作成
  fs.mkdirSync(slideDir, { recursive: true });
  
  // README.md を作成
  const readmeContent = `# ${title}

## 概要
${description}

## ファイル
- \`slides.md\` - Reveal.js用スライドファイル

## 内容
（ここにスライドの構成を記載）
`;
  
  fs.writeFileSync(path.join(slideDir, 'README.md'), readmeContent);
  
  // slides.md を作成
  const slidesContent = `---
title: ${title}
theme: white
highlightTheme: github
css: custom.css
revealOptions:
  transition: slide
  controls: true
  progress: true
  history: true
  center: true
  width: 1200
  height: 800
---

# ${title}

---

## 概要

${description}

---

## 今日学ぶこと

- ポイント1
- ポイント2
- ポイント3

---

## まとめ

---

## Q&A

質問をどうぞ

---

## ありがとうございました

---
`;
  
  fs.writeFileSync(path.join(slideDir, 'slides.md'), slidesContent);
  
  // custom.css を作成
  const customCss = `.reveal h1 { 
  font-size: 2.2em; 
  line-height: 1.2; 
}

.reveal h2 { 
  font-size: 1.8em; 
  line-height: 1.3; 
}

.reveal h3 { 
  font-size: 1.4em; 
  line-height: 1.4; 
}

.reveal p, .reveal li { 
  font-size: 0.9em; 
  line-height: 1.6;
  text-align: left;
  max-width: 90%;
  margin: 0 auto;
}

.reveal .slides section {
  text-align: left;
  padding: 20px;
}

.reveal .slides section h1,
.reveal .slides section h2 {
  text-align: center;
  margin-bottom: 1em;
}

.reveal ol, .reveal dl, .reveal ul {
  display: block;
  text-align: left;
  margin: 0 auto 1em auto;
  width: 90%;
}

.reveal ul {
  margin-left: 0;
}

.reveal strong {
  color: #e74c3c;
  font-weight: bold;
}

.reveal code {
  background: #f8f9fa;
  padding: 2px 6px;
  border-radius: 3px;
  color: #e74c3c;
}`;

  fs.writeFileSync(path.join(slideDir, 'custom.css'), customCss);
  
  console.log(`\n✅ 新しいスライド "${name}" を作成しました！`);
  console.log(`📁 ディレクトリ: ${slideDir}`);
  console.log(`\n次のステップ:`);
  console.log(`1. ${path.join(slideDir, 'slides.md')} を編集`);
  console.log(`2. npm run build でビルド`);
  console.log(`3. git add && git commit && git push でデプロイ`);
  
  rl.close();
}

createNewSlide().catch(console.error);