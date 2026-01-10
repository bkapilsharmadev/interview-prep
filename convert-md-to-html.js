const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Configure marked options
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert '\n' in paragraphs into <br>
  headerIds: true, // Add id attributes to headers
  mangle: false // Don't mangle email addresses
});

function convertMarkdownFiles() {
  const mdDir = path.join(__dirname, 'javascript', 'docs', 'group-0-language-fundamentals');
  const htmlDir = path.join(mdDir, 'html');
  
  // Read all markdown files
  const files = fs.readdirSync(mdDir).filter(file => file.endsWith('.md'));
  
  files.forEach(file => {
    const mdPath = path.join(mdDir, file);
    const htmlFileName = file.replace('.md', '.html');
    const htmlPath = path.join(htmlDir, htmlFileName);
    
    // Read markdown content
    const markdown = fs.readFileSync(mdPath, 'utf8');
    
    // Convert to HTML using marked
    const htmlContent = marked.parse(markdown);
    
    // Create full HTML document
    const title = file.replace('.md', '').replace(/-/g, ' ').replace(/\d+\.\d+\s+/, '');
    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * {
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.7;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px 40px;
            color: #2c3e50;
            background-color: #ffffff;
        }
        h1 {
            color: #2c3e50;
            border-bottom: 4px solid #3498db;
            padding-bottom: 15px;
            margin-top: 0;
            font-size: 2.5em;
        }
        h2 {
            color: #34495e;
            margin-top: 40px;
            border-bottom: 2px solid #ecf0f1;
            padding-bottom: 8px;
            font-size: 2em;
        }
        h3 {
            color: #555;
            margin-top: 30px;
            font-size: 1.5em;
        }
        h4 {
            color: #666;
            margin-top: 25px;
            font-size: 1.25em;
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
            margin: 20px 0;
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
            margin: 8px 0;
        }
        ul ul, ol ol, ul ol, ol ul {
            margin-top: 5px;
            margin-bottom: 5px;
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
        p {
            margin: 15px 0;
        }
        strong {
            color: #2c3e50;
            font-weight: 600;
        }
        em {
            color: #555;
            font-style: italic;
        }
        @media (max-width: 768px) {
            body {
                padding: 15px 20px;
            }
            h1 {
                font-size: 2em;
            }
            h2 {
                font-size: 1.5em;
            }
            pre {
                padding: 15px;
                font-size: 0.85em;
            }
        }
    </style>
</head>
<body>
${htmlContent}
</body>
</html>`;
    
    // Write HTML file
    fs.writeFileSync(htmlPath, fullHTML, 'utf8');
    console.log(`✅ Converted: ${file} -> ${htmlFileName}`);
  });
  
  console.log(`\n🎉 Successfully converted ${files.length} markdown files to HTML!`);
  console.log(`📁 Files saved in: ${htmlDir}`);
}

convertMarkdownFiles();
