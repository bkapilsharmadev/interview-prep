const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const yaml = require('js-yaml');

// Configure marked options
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert '\n' in paragraphs into <br>
  headerIds: true, // Add id attributes to headers
  mangle: false // Don't mangle email addresses
});

// YAML frontmatter parser using js-yaml
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { metadata: {}, content: content };
  }
  
  const frontmatter = match[1];
  const markdown = match[2];
  
  try {
    const metadata = yaml.load(frontmatter);
    return { metadata: metadata || {}, content: markdown };
  } catch (e) {
    console.warn('Warning: Failed to parse frontmatter, using empty metadata:', e.message);
    return { metadata: {}, content: markdown };
  }
}

function convertBlogToHTML(mdFileName) {
  const blogDir = path.join(__dirname, 'javascript', 'docs', 'group-0-language-fundamentals', 'blog');
  const mdFile = path.join(blogDir, mdFileName);
  
  if (!fs.existsSync(mdFile)) {
    console.error(`❌ File not found: ${mdFile}`);
    return;
  }
  
  // Read markdown content
  const rawContent = fs.readFileSync(mdFile, 'utf8');
  
  // Parse frontmatter
  const { metadata, content } = parseFrontmatter(rawContent);
  
  // Convert markdown to HTML
  const htmlContent = marked.parse(content);
  
  // Extract title from metadata or first H1
  const defaultTitle = mdFileName.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const title = (metadata.seo && metadata.seo.title) || metadata.title || defaultTitle;
  const description = (metadata.seo && metadata.seo.description) || metadata.description || '';
  const keywords = (metadata.seo && metadata.seo.keywords) || metadata.keywords || '';
  const author = metadata.author || 'BytesJourney';
  const date = metadata.date || new Date().toISOString().split('T')[0];
  const canonicalUrl = (metadata.seo && metadata.seo.canonical_url) || `/blog/${mdFileName.replace('.md', '')}`;
  const ogImage = (metadata.seo && metadata.seo.og_image) || `/images/${mdFileName.replace('.md', '.png')}`;
  
  // Build keywords string
  let keywordsString = '';
  if (Array.isArray(keywords)) {
    keywordsString = keywords.join(', ');
  } else if (typeof keywords === 'string') {
    keywordsString = keywords;
  }
  
  // Create full HTML document with SEO
  const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Primary Meta Tags -->
    <title>${title}</title>
    <meta name="title" content="${title}">
    <meta name="description" content="${description}">
    <meta name="keywords" content="${keywordsString}">
    <meta name="author" content="${author}">
    <link rel="canonical" href="${canonicalUrl}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${ogImage}">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${canonicalUrl}">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${ogImage}">
    
    <!-- Article Meta -->
    <meta property="article:published_time" content="${date}">
    <meta property="article:author" content="${author}">
    ${metadata.tags ? `<meta property="article:tag" content="${Array.isArray(metadata.tags) ? metadata.tags.join(', ') : metadata.tags}">` : ''}
    
    <!-- Schema.org Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${title}",
      "description": "${description}",
      "image": "${ogImage}",
      "author": {
        "@type": "Person",
        "name": "${author}"
      },
      "publisher": {
        "@type": "Organization",
        "name": "BytesJourney",
        "logo": {
          "@type": "ImageObject",
          "url": "/logo.png"
        }
      },
      "datePublished": "${date}",
      "dateModified": "${date}",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${canonicalUrl}"
      },
      "keywords": "${keywordsString}",
      "articleSection": "${metadata.category || 'JavaScript Fundamentals'}",
      "inLanguage": "en-US"
    }
    </script>
    
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.8;
            max-width: 1100px;
            margin: 0 auto;
            padding: 20px 40px;
            color: #2c3e50;
            background-color: #ffffff;
        }
        article {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        h1 {
            color: #2c3e50;
            border-bottom: 4px solid #3498db;
            padding-bottom: 15px;
            margin-top: 0;
            margin-bottom: 30px;
            font-size: 2.8em;
            font-weight: 700;
        }
        h2 {
            color: #34495e;
            margin-top: 50px;
            margin-bottom: 20px;
            border-bottom: 2px solid #ecf0f1;
            padding-bottom: 10px;
            font-size: 2.2em;
            font-weight: 600;
        }
        h3 {
            color: #555;
            margin-top: 35px;
            margin-bottom: 15px;
            font-size: 1.6em;
            font-weight: 600;
        }
        h4 {
            color: #666;
            margin-top: 25px;
            margin-bottom: 12px;
            font-size: 1.3em;
            font-weight: 600;
        }
        p {
            margin: 18px 0;
            font-size: 1.05em;
        }
        code {
            background-color: #f4f4f4;
            padding: 3px 8px;
            border-radius: 4px;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 0.9em;
            color: #e83e8c;
        }
        pre {
            background-color: #2d2d2d;
            color: #f8f8f2;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 25px 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        pre code {
            background-color: transparent;
            padding: 0;
            color: inherit;
            font-size: 0.95em;
            line-height: 1.6;
        }
        blockquote {
            border-left: 4px solid #3498db;
            margin: 25px 0;
            padding: 15px 20px;
            background-color: #f8f9fa;
            color: #555;
            font-style: italic;
            border-radius: 4px;
        }
        ul, ol {
            margin: 20px 0;
            padding-left: 40px;
        }
        li {
            margin: 10px 0;
            font-size: 1.05em;
        }
        ul ul, ol ol, ul ol, ol ul {
            margin-top: 8px;
            margin-bottom: 8px;
        }
        a {
            color: #3498db;
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: border-color 0.2s;
        }
        a:hover {
            border-bottom-color: #3498db;
        }
        hr {
            border: none;
            border-top: 2px solid #ecf0f1;
            margin: 40px 0;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 25px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px 15px;
            text-align: left;
        }
        th {
            background-color: #3498db;
            color: white;
            font-weight: 600;
        }
        tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        tr:hover {
            background-color: #e8f4f8;
        }
        strong {
            color: #2c3e50;
            font-weight: 600;
        }
        em {
            color: #555;
            font-style: italic;
        }
        .article-meta {
            color: #7f8c8d;
            font-size: 0.9em;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #ecf0f1;
        }
        .article-meta span {
            margin-right: 20px;
        }
        @media (max-width: 768px) {
            body {
                padding: 15px 20px;
            }
            article {
                padding: 20px;
            }
            h1 {
                font-size: 2em;
            }
            h2 {
                font-size: 1.8em;
            }
            h3 {
                font-size: 1.4em;
            }
            pre {
                padding: 15px;
                font-size: 0.85em;
            }
        }
    </style>
</head>
<body>
    <article>
        <div class="article-meta">
            <span>📅 Published: ${date}</span>
            <span>✍️ Author: ${author}</span>
            ${metadata.category ? `<span>📂 Category: ${metadata.category}</span>` : ''}
        </div>
        ${htmlContent}
    </article>
</body>
</html>`;
  
  // Write HTML file
  const htmlFileName = mdFileName.replace('.md', '.html');
  const htmlPath = path.join(blogDir, htmlFileName);
  fs.writeFileSync(htmlPath, fullHTML, 'utf8');
  
  console.log(`✅ Successfully converted blog post to HTML!`);
  console.log(`📁 File saved: ${htmlPath}`);
  console.log(`📊 Title: ${title}`);
  console.log(`📝 Description: ${description.substring(0, 60)}...`);
}

// Get filename from command line argument or use default
const filename = process.argv[2] || 'value-vs-reference-in-javascript.md';
convertBlogToHTML(filename);

