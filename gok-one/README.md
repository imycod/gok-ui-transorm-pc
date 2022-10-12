gok-one
  - axios （不带token）
      - get
      - post
  - uc
      - api （常用uc接口的封装）
      - http (带token)
  - util  (工具包)
  - log  （埋点相关api，浏览器维一标示

### GOK-ONE目录结构
├── axios  axios代理文件
├── constant  项目常量
|   └── index.js
├── log  日志埋点模块
|   ├── api  埋点接口模块
|   └── store  埋点存储相关
├── login  登录模块（不需要鉴权）
|   ├── api  登录相关接口
|   |   ├── index.js  登录相关接口
|   └── index.js
├── store  项目本地存储模块
|   ├── user  用户相关本地存储
|   |   ├── cookie.js  cookie存储
|   |   ├── index.js
|   |   └── local.js  本地localStroage存储
|   └── index.js
├── test  测试模块
├── uc  UC用户相关模块（需要鉴权）
├── uni  uni-app模块
├── uni-log  uni-app日志埋点模块
├── util  工具模块
|   ├── axios-proxy  http请求代理
|   ├── base64  base64加解密相关
|   ├── cookie  cookie相关
|   ├── crypto-js  项目加解密相关
|   ├── fingerprint  浏览器指纹
|   ├── uni-storage  uni-app相关本地存储
|   └── index.js
├── .babelrc
├── index.js  入口文件
├── package.json  版本、依赖文件

