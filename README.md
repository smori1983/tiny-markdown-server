# Tiny Markdown Server

Run server which serves parsed markdown files.

1. Select the directory where markdown files are saved (Like Apache's document root).
1. Enter the port (80-65535).
1. Click 'start'.
1. Open in browser.

![mac](https://raw.githubusercontent.com/smori1983/tiny-markdown-server/images/app_mac.png)


## Build for Electron

```
npm run build
npm run build:mac
npm run build:win
```


## CLI

```
cli.js serve <directory> <port>
```

### Example

```
node cli.js serve /path/to/dir 3000
```


## License

MIT
