# BUILD.md


## electron-builder

```
npm install --save-dev electron-builder
```


## For Mac

### build

```
node build_scripts/build-mac.js
```

or 

```
npm run build:mac
```


## For Windows

### brew

```
brew install wine
brew install mono
```

### build

```
node build_scripts/build-win.js
```

or 

```
npm run build:win
```
