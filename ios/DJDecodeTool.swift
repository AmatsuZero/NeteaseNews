//
//  DJDecodeTool.swift
//  news
//
//  Created by 姜振华 on 2017/3/1.
//  Copyright © 2017年 Facebook. All rights reserved.
//

import UIKit

@objc protocol DJDecodeToolDelegate {
  func decodeSuccess()
  func decodeFail()
}

public class DJDecodeTool: NSObject, DJM3U8HandlerDelegate, DJVideoDownloadDelegate {

  var decodeDelegate:DJDecodeToolDelegate?
  
  /// 解码器
  fileprivate var handler:DJM3U8Handler
  
  /// 下载器
  fileprivate var downloader:DJVideoDownloader
  
  /// 播放链接
  fileprivate var playUrl:String?
  
  /// 定时解码的定时器
  fileprivate var decodeTimer:Timer?
  
  /// 标记第一次是否已经创建多M3U8
  fileprivate var isM3U8:Bool = true
  
  override init() {
    handler = DJM3U8Handler()
    downloader = DJVideoDownloader()
    super.init()
    handler.handlerDelegate = self
    downloader.downloaderDelegate = self
  }
  
  func handleM3U8Url(_ url:String)  {
    handler.parseUrl(urlStr: url)
    playUrl = url
    isM3U8 = false
  }
  
  //MARK: - VideoDownloadDelegate
  func videoDownloaderFinished(_ delegate: DJVideoDownloader?) {
    //文件创建成功开始播放,这里需要建立本地HTTP服务器
    self.decodeDelegate?.decodeSuccess()
  }
  
  func videoDownloaderFailed(_ delegate: DJVideoDownloader?) {
    self.decodeDelegate?.decodeFail()
  }
  
  //MARK: - M3U8HandlerDelegate
  func parseM3U8Failed(_ delegate: DJM3U8Handler) {
    decodeDelegate?.decodeFail()
  }
  
  func parseM3U8Finished(_ delegate: DJM3U8Handler) {
    //从这里获取解析的TS片段数据
    //解析成功后开始下载
    self.downloader.playList = delegate.playList
    self.downloader.orignalM3U8str = handler.oriM3U8Str
    self.downloader.startDonwloadVideo()
  }
  
  /// 开启循环解码定时器
  func openDecodeTimer() {
    guard decodeTimer == nil else {
      //分析定时器的循环时间，这里取一个M3U8时间的一半
      var time = 0
      for item in (self.downloader.playList?.segmentArray)! {
        time += item.duration!
      }
      
      time /= (self.downloader.playList?.segmentArray.count)!
      decodeTimer = Timer.scheduledTimer(timeInterval: TimeInterval(time), target: self, selector: #selector(circleDecode), userInfo: nil, repeats: true)
      return
    }
  }
  
  func circleDecode() {
    self.handler.parseUrl(urlStr: playUrl!)
  }
  
}
