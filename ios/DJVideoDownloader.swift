//
//  DJVideoDownloader.swift
//  news
//
//  Created by 姜振华 on 2017/3/1.
//  Copyright © 2017年 Facebook. All rights reserved.
//

import UIKit

@objc protocol DJVideoDownloadDelegate {
  ///下载成功
  func videoDownloaderFinished(_ delegate:DJVideoDownloader?)
  ///下载失败
  func videoDownloaderFailed(_ delegate:DJVideoDownloader?)
}

public class DJVideoDownloader: NSObject, SegmentDownloaderDelegate {
  
  /// 记录原始的M3U8
  var orignalM3U8str:String?
  var playList:M3U8Playlist?
  /// 储存正在下载的数组
  var downLoadArray:Array<SegmentDownloader> = Array()
  /// 下载成功或者失败的代理
  var downloaderDelegate:DJVideoDownloadDelegate?
  
  /// 记录一共多少TS文件
  fileprivate var index:Int = 0
  /// 记录所有的下载链接
  fileprivate var downloadUrlArray:Array<String> = Array()
  /// 记录下载成功的文件的数量
  fileprivate var sIndex:Int = 0
  
  /// 开始下载
  func startDonwloadVideo(){
    //首先检查是否存在路径
    self.checkDirectoryIsCreateM3U8()
    
    for item in (self.playList?.segmentArray)! {
        //检查此下载对象是否存在
        var isE = false
      for url in downloadUrlArray {
        if url == item.locationUrl {
          //已经存在
          isE = true
          break
          
        } else {
          isE = false
        }
      }
      if isE == false {//如果不存在
        let fileName = "id\(self.index)ld.ts"
        let sgDownLoader = SegmentDownloader.init(url: item.locationUrl!,
                                                  filePath: (playList?.uuid)!,
                                                  fileName: fileName,
                                                  duration: item.duration!,
                                                  index: index)
        sgDownLoader.downloadDelegate = self
        downLoadArray.append(sgDownLoader)
        downloadUrlArray.append(item.locationUrl!)
      }
    }
    
    //根据新的数据更改新的playList
    var newPlayListModelArray = Array<M3U8SegmentModel>()
    for item in self.downLoadArray {
      let model = M3U8SegmentModel()
      model.duration = item.duration
      model.locationUrl = item.fileName
      model.index = item.index
      newPlayListModelArray.append(model)
    }
    
    if newPlayListModelArray.count > 0  {
      playList?.segmentArray = newPlayListModelArray
    }
    
    //打包完成开始下载
    for item in downLoadArray {
      item.flag = true
      item.start()
    }
  }
  
  //MARK: - 创建M3U8文件
  /// 创建M3U8文件
  func createLocalM3U8file() {
    checkDirectoryIsCreateM3U8()
    var path:NSString = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true).first! as NSString
    path = path.appendingPathComponent("Downloads") as NSString
    path = path.appendingPathComponent((playList?.uuid)!) as NSString
    path = path.appendingPathComponent("movie.m3u8") as NSString
    
    //拼接M3U8链接的头部具体内容
    var header = "#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-MEDIA-SEQUENCE:0\n#EXT-X-TARGETDURATION:15\n"
    //填充M3U8数据
    var tsStr = ""
    for item in (playList?.segmentArray)! {
      //文件名
      let fileName = "id\(item.index)ld.ts"
      //文件时长
      let length = "#EXTINF:\(item.duration),\n"
      //拼接m3u8
      tsStr.append("\(length)\(fileName)\n")
    }
    //M3U8头部和中间拼接,到此我们完成的新的M3U8链接的拼接
    header.append(tsStr)
    header.append("#EXT-X-ENDLIST")
    //拼接完成，存储到本地
    var buffer = Data()
    let fm = FileManager.default
    if !fm.fileExists(atPath: path as String, isDirectory: nil) {
      do{
        try fm.createDirectory(at: URL.init(fileURLWithPath: path as String), withIntermediateDirectories: true, attributes: nil)
      } catch {
        print(error.localizedDescription)
        return
      }
    }
      do {
        let data = header.data(using: .utf8)
        buffer.append(data!)
        try data?.write(to: URL.init(fileURLWithPath: path as String))
      } catch {
        print(error.localizedDescription)
      }
  }
  
  //MARK: - 删除多余文件
  fileprivate func deleteCache() {
    let fix = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true).first
    let fm = FileManager.default
    let path = "\(fix)\\Downloads"
    do {
      let deleteArray = try fm.contentsOfDirectory(atPath: path)
      for item in deleteArray {
        if item.hasPrefix("movie1") {
           let tsList = try fm.contentsOfDirectory(atPath: item)
           //只保留一个片段，其余删除
          for i in 1..<tsList.count {
            let subpath = tsList[i]
            try fm.removeItem(atPath: subpath)
          }
        }
      }
    } catch {
      print("\(error.localizedDescription)")
    }
  }
  
  //MARK: - 检查路径
  fileprivate func checkDirectoryIsCreateM3U8() {
    if let pathPrefix:NSString = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true).first as NSString? {
      let saveTo = pathPrefix.appendingPathComponent("Downloads")
      (saveTo  as NSString).appendingPathComponent((self.playList?.uuid)!)
      let fm = FileManager.default
      guard fm.fileExists(atPath:saveTo) else {//不存在
        do {
          try fm.createDirectory(atPath: saveTo, withIntermediateDirectories: true, attributes: nil)
        } catch{
          print("创建文件夹失败\(error)")
        }
        return
      }
    }
  }
  
  //MARK: - SegmentDownloaderDelegate
  func segmentDownloadFinished(_ delegate: SegmentDownloaderDelegate?) {
    //数据下载成功后再数据源中移除当前下载器
    sIndex += 1
    if sIndex >= 3 {
      //每次下载完成后都要创建M3U8文件
      createLocalM3U8file()
      //证明所需片段已经下完
      downloaderDelegate?.videoDownloaderFinished(self)
    }
  }
  
  func segmentDownloadFailed(_ delegate: SegmentDownloaderDelegate?) {
    downloaderDelegate?.videoDownloaderFailed(self)
  }
  
  func segmentProgress(delegate: SegmentDownloaderDelegate?, totalUnitCount: Int64, completeCount: Int64) {
    
  }
}
