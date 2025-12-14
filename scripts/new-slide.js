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
revealOptions:
  transition: slide
  controls: true
  progress: true
  history: true
  center: true
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
  
  console.log(`\n✅ 新しいスライド "${name}" を作成しました！`);
  console.log(`📁 ディレクトリ: ${slideDir}`);
  console.log(`\n次のステップ:`);
  console.log(`1. ${path.join(slideDir, 'slides.md')} を編集`);
  console.log(`2. npm run build でビルド`);
  console.log(`3. git add && git commit && git push でデプロイ`);
  
  rl.close();
}

createNewSlide().catch(console.error);