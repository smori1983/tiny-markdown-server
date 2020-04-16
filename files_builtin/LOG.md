# LOG

## jquery

version: `3.5.0`

```
npm install jquery

mkdir -p files_builtin/jquery
cp node_modules/jquery/dist/jquery.min.js files_builtin/jquery/
```

## bootstrap

version: `4.4.1`

```
npm install bootstrap

mkdir -p files_builtin/bootstrap
cp -r node_modules/bootstrap/dist/* files_builtin/bootstrap/
```

## `github-markdown.css`

```
npm install github-markdown-css
cp node_modules/github-markdown-css/github-markdown.css files_builtin/
```

## `highlight.js`

Download zip from https://highlightjs.org/download/ with all languages.

version: `9.15.6`

```
files_builtin/highlight.zip
```

```
cd files_builtin
unzip highlight.zip -d highlight.js
```
