---
title: "Assistant Revival"
source: "https://replit.com/t/unicorn/repls/Assistant-Revival"
author:
  - "[[replit]]"
published:
created: 2025-12-31
description: "Build and deploy software collaboratively with the power of AI without spending a second on setup."
tags:
  - "clippings"
---
# Tutorial: Working with Files

  

\*\*Difficulty\*\*: Beginner

\*\*Time\*\*: 20 minutes

\*\*Prerequisites\*\*: \[Getting Started Tutorial\](./getting-started.md)

  

## Learning Objectives

  

\- Upload multiple file types

\- Organize and manage files

\- Reference files effectively

\- Work with multi-file projects

\- Understand file mention syntax

  

## Part 1: Uploading Different File Types

  

### Supported File Types

  

Assistant supports a wide variety of file formats:

  

\`\`\`

Code: .js, .ts, .jsx, .tsx, .py, .java, .cpp, .c, .go, .rs

Web: .html, .css, .scss, .vue

Config: .json, .yaml, .yml, .xml, .toml

Docs: .md, .txt

Data: .csv, .sql

\`\`\`

  

### Exercise 1: Upload Multiple Files

  

1. Create a simple project structure:

  

\*\*index.html\*\*:

\`\`\`html

<!DOCTYPE html>

<html\>

<head\>

<link rel\="stylesheet" href\="styles.css"\>

</head\>

<body\>

<div id\="app"\></div\>

<script src\="app.js"\></script\>

</body\>

</html\>

\`\`\`

  

\*\*styles.css\*\*:

\`\`\`css

body {

font-family: Arial, sans-serif;

margin: 0;

padding: 20px;

}

  

#app {

max-width: 800px;

margin: 0 auto;

}

\`\`\`

  

\*\*app.js\*\*:

\`\`\`javascript

document.getElementById('app').innerHTML \= '<h1>Hello World</h1>';

\`\`\`

  

2. Upload all three files at once (drag and drop multiple files)

3. Verify they appear in the file list

  

## Part 2: File Reference Syntax

  

### Basic File Mentions

  

Use \`@\` to reference files in your messages:

  

\`\`\`

@filename.ext → References file

@folder/file.js → References file in folder (if supported)

\`\`\`

  

### Exercise 2: Single File Questions

  

Try these questions with your uploaded files:

  

\`\`\`

1\. @index.html What does this HTML file do?

  

2\. @styles.css Can you explain the CSS styles?

  

3\. @app.js Is there a better way to write this JavaScript?