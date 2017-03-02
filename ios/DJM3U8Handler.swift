//
//  DJM3U8Handler.swift
//  news
//
//  Created by 姜振华 on 2017/3/1.
//  Copyright © 2017年 Facebook. All rights reserved.
//

import UIKit

@objc protocol DJM3U8HandlerDelegate {
  
  /// 解析M3U8连接失败
  func parseM3U8Finished(_ delegate:DJM3U8Handler)
  
  /// 解析M3U8成功
  func parseM3U8Failed(_ delegate:DJM3U8Handler)
  
}

public class DJM3U8Handler: NSObject {
  
  /// 传输成功或者失败的代理
  var handlerDelegate:DJM3U8HandlerDelegate?
  
  /// 打包获取的TS片段
  var playList:M3U8Playlist?
  
  /// 存储TS片段的数组
  lazy var segmentArray:Array<M3U8SegmentModel> = Array()
  
  /// 存储原始的M3U8数据
  var oriM3U8Str:String?

  /// 解码M3U8
  func parseUrl(urlStr:String) {
    if !urlStr.hasPrefix("http://") && !urlStr.hasPrefix("https://") {
      if handlerDelegate != nil {
        handlerDelegate?.parseM3U8Failed(self)
        return
      }
    }
    
    //解析出M3U8
    var encoding:UInt = 0
    do {
      var m3u8Str = try NSString.init(contentsOf: URL.init(string: urlStr)!, usedEncoding: &encoding)
      var segmentRange:NSRange = m3u8Str.range(of: "#EXTINF:")
      //解析TS文件
      if segmentRange.location != NSNotFound {
        if segmentArray.count > 0  {
          segmentArray.removeAll()
        }
        //逐个解析TS文件，并存储
        while segmentRange.location != NSNotFound {
          let model = M3U8SegmentModel()
          //读取TS片段时长
          let commaRange = m3u8Str.range(of: ",")
          let length = NSString.init(string: "#EXTINF:")
          let value = m3u8Str.substring(with: NSMakeRange(segmentRange.location + length.length,
                                                          commaRange.location - (segmentRange.location + length.length)))
          model.duration = Int(value)
          //截取M3U8
          m3u8Str = m3u8Str.substring(from: commaRange.location) as NSString
          //获取TS下载链接,这需要根据具体的M3U8获取链接，可以更具自己公司的需求
          let linkRangeBegin = m3u8Str.range(of: ",")
          let linkRangeEnd = m3u8Str.range(of: ".ts")
          model.locationUrl = m3u8Str.substring(with: NSMakeRange(linkRangeBegin.location + 2,
                                                            linkRangeEnd.location + 3 - linkRangeBegin.location - 2))
          segmentArray.append(model)
          m3u8Str = m3u8Str.substring(from: linkRangeEnd.location + 3) as NSString
          segmentRange = m3u8Str.range(of: length as String)
        }
        
        playList = M3U8Playlist.init(segmentArray: self.segmentArray)
        //到此数据TS解析成功，通过代理发送成功消息
        if handlerDelegate != nil {
          handlerDelegate?.parseM3U8Finished(self)
          return
        }

      } else {//M3U8里没有TS文件
        if handlerDelegate != nil {
          handlerDelegate?.parseM3U8Failed(self)
          return
        }
      }
    } catch {
      if handlerDelegate != nil {
        handlerDelegate?.parseM3U8Failed(self)
        return
      }
    }
  }
}
