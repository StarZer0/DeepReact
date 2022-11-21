# DeepReact

## 调试

`build/node_modules`目录包含打包生成的源码，通过`npm link`的方式为`react react-dom`添加软连接，方便调试：

> cd build/node_modules/react && npm link && cd ../react-dom && npm link

workspace:

> npm link react react-dom

## 启动项目

> npm run start
