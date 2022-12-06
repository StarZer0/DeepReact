# DeepReact

## 调试

1. 从 github 克隆 react 项目源码并安装依赖
   > yarn
2. 注释 react/scripts/rollup/build.js 中如下代码, 不进行生成环境下代码的压缩重命名

   ```javascript
   isProduction &&
      closure({
        compilation_level: 'SIMPLE',
        language_in: 'ECMASCRIPT_2015',
        language_out:
          bundleType === BROWSER_SCRIPT ? 'ECMASCRIPT5' : 'ECMASCRIPT5_STRICT',
        env: 'CUSTOM',
        warning_level: 'QUIET',
        apply_input_source_maps: false,
        use_types_for_optimization: false,
        process_common_js_modules: false,
        rewrite_polyfills: false,
        inject_libraries: false,

        // Don't let it create global variables in the browser.
        // https://github.com/facebook/react/issues/10909
        assume_function_wrapper: !isUMDBundle,
        renaming: !shouldStayReadable,
      }),
   ```

3. 打包 react 代码

   > npm run build react/index,react/jsx,react-dom/index,scheduler --type=NODE

4. 将`build/node_modules`拷贝到通过`create-react-app`新建的项目

5. `build/node_modules`目录包含打包生成的源码，通过`npm link`的方式为`react react-dom`添加软连接，方便调试：

   > cd build/node_modules/react && npm link && cd ../react-dom && npm link

   workspace:

   > npm link react react-dom

6. 将`build/node_modules/react-dom/index.js`中开发环境的文件改为生产环境的文件(去除了调试相关的代码, 相对更简洁):

   ```javascript
   if (process.env.NODE_ENV === "production") {
     // DCE check should happen before ReactDOM bundle executes so that
     // DevTools can report bad minification during injection.
     checkDCE();
     module.exports = require("react-dom/cjs/react-dom.production.min.js");
   } else {
     module.exports = require("react-dom/cjs/react-dom.development.js");
   }
   ```

## 启动项目

> npm run start
