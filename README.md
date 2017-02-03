##项目介绍

这是一个iOS版网易新闻的RN改造版，原版只完成了新闻列表页部分，我也就新闻列表页完成度比较高了……
（懒得用Charles去找接口……）

视频部分是基于移动网页版抓的接口，只做了一部分（主要还是没能找到接口参数的规律，相信做过网银新闻爬虫的童鞋都对有体会），待日后慢慢添加……

原生模块只做了iOS的，Android版还没做（毕竟目前安卓知识的有限），目前请先尝试iOS版。

P.S. 推荐使用最新版WebStorm打开RN项目，2016.3.x版本支持RN项目，能用IDE，为什么不用……
##安装

```bash
#请先确保你安装了RN需要的一些东西
$ npm install
$ react-native start
$ react-native run-ios
```

由于以前升级到40版本，后由于兼容性原因，又退回到39，如果安装失败，请这样尝试一下：
```bash
$ react-native upgrade

#保险起见，下面你可以全部选no，然后按照再酌情配置工程。
#如果工程配置全部恢复初始值了，你需要重新链接一下原来的库……
#react-native link

```
视频原生模块是封装的ijkplayer，由于没有用cocoapods的原因，你可能需要手动添加ijkplayer。

##TODO
* ~~iOS版~~
* 安卓版
* Travis CI
* ~~热更新~~
* Redux重构

