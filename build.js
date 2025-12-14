const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// スライドディレクトリを自動検索
function findSlides() {
  const slidesDir = './slides';
  if (!fs.existsSync(slidesDir)) {
    return [];
  }
  
  const slides = [];
  const directories = fs.readdirSync(slidesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  directories.forEach(dir => {
    const slideDir = path.join(slidesDir, dir);
    const slidePath = path.join(slideDir, 'slides.md');
    const readmePath = path.join(slideDir, 'README.md');
    
    if (fs.existsSync(slidePath)) {
      let title = dir;
      let description = '';
      
      // README.mdからタイトルと説明を取得
      if (fs.existsSync(readmePath)) {
        const readme = fs.readFileSync(readmePath, 'utf-8');
        const titleMatch = readme.match(/^# (.+)$/m);
        const descMatch = readme.match(/## 概要\n(.+)/);
        
        if (titleMatch) title = titleMatch[1];
        if (descMatch) description = descMatch[1];
      }
      
      slides.push({
        name: dir,
        file: slidePath,
        title: title,
        description: description
      });
    }
  });
  
  return slides.sort((a, b) => a.name.localeCompare(b.name));
}

// docsディレクトリをクリーンアップ
if (fs.existsSync('docs')) {
  fs.rmSync('docs', { recursive: true });
}
fs.mkdirSync('docs');

// スライドを検索
const slides = findSlides();

// インデックスページを動的生成
const indexHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI時代のエンジニアリング講座</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            padding: 2rem;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        h1 {
            text-align: center;
            margin-bottom: 1rem;
            font-size: 2.5rem;
        }
        .subtitle {
            text-align: center;
            margin-bottom: 2rem;
            opacity: 0.9;
            font-size: 1.2rem;
        }
        .slide-list {
            list-style: none;
            padding: 0;
        }
        .slide-item {
            margin: 1rem 0;
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
        }
        .slide-item:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
        }
        .slide-link {
            color: white;
            text-decoration: none;
            display: block;
        }
        .slide-title {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
        }
        .slide-description {
            opacity: 0.8;
            line-height: 1.6;
        }
        .github-link {
            text-align: center;
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
        }
        .github-link a {
            color: white;
            text-decoration: none;
            opacity: 0.8;
        }
        .github-link a:hover {
            opacity: 1;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎓 AI時代のエンジニアリング講座</h1>
        <p class="subtitle">Engineering course in the AI era</p>
        
        <ul class="slide-list">
${slides.map(slide => `            <li class="slide-item">
                <a href="./${slide.name}/" class="slide-link">
                    <div class="slide-title">📝 ${slide.title}</div>
                    <div class="slide-description">
                        ${slide.description}
                    </div>
                </a>
            </li>`).join('\n')}
        </ul>
        
        <div class="github-link">
            <a href="https://github.com/goodsun/lecture">📚 GitHub Repository</a>
        </div>
    </div>
</body>
</html>`;

fs.writeFileSync('docs/index.html', indexHtml);

// 各スライドをビルド
slides.forEach(slide => {
  console.log(`Building ${slide.name} (${slide.title})...`);
  execSync(`reveal-md "${slide.file}" --static docs/${slide.name}`, { stdio: 'inherit' });
});

console.log(`Build completed! Generated ${slides.length} slides.`);