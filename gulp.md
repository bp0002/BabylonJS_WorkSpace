# 构建库文件
* 将库文件拷贝到对应构建目录
```
gulp copy-lib
```

# 构建html
* 将 index.html 文件拷贝到对应构建目录
```
gulp copy-html
```

# 构建前台逻辑代码
* 入口为 src/boot/index.ts 的代码 编译为 ES6，并保存到 build/boot/index.js
```
gulp default
```
