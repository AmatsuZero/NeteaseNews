//
//  SegmentDownloader.swift
//  news
//
//  Created by 姜振华 on 2017/2/28.
//  Copyright © 2017年 Facebook. All rights reserved.
//

import UIKit
import AFNetworking

@objc protocol SegmentDownloaderDelegate {
  
  /// 下载成功
  func segmentDownloadFinished(_ delegate:SegmentDownloaderDelegate?)
  
  /// 下载失败
  func segmentDownloadFailed(_ delegate:SegmentDownloaderDelegate?)
  
  /// 监听进度
  func segmentProgress(delegate:SegmentDownloaderDelegate?, totalUnitCount:Int64, completeCount:Int64)
  
}

public class SegmentDownloader: NSObject {
  
  ///传递数据下载成功或者失败的代理
  var downloadDelegate:SegmentDownloaderDelegate?
  var fileName:String
  var filePath:String?
  var downloadUrl:String
  var duration:Int
  var index:Int
  var flag:Bool = false
  
  lazy fileprivate var serializer: AFHTTPRequestSerializer = AFHTTPRequestSerializer()
  lazy fileprivate var downLoadSession:AFURLSessionManager =  AFURLSessionManager.init(sessionConfiguration: URLSessionConfiguration.default)
  
  //MARK: - 初始化TS下载器
  ///初始化TS下载器
  required public init(url:String, filePath:String, fileName:String, duration:Int, index:Int) {
    self.downloadUrl = url
    self.filePath = filePath
    self.fileName = fileName
    self.duration = duration
    self.index = index
    super.init()
  }
  
  //MARK: - 开始下载
  ///开始
  func start() {
    //检查此文件是否已经下载
    if checkIsDownLoad() {
      //下载了
      downloadDelegate?.segmentDownloadFinished(downloadDelegate!)
      return
    }
    //首先拼接存储数据的路径
    var path = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true).first
    path?.append("/Downloads/\(filePath)/\(fileName)")
    //这里使用AFN下载,并将数据同时存储到沙盒目录制定的目录中
    let request = URLRequest.init(url: URL.init(string: self.downloadUrl)!)
    let downloadTask = self.downLoadSession.downloadTask(with: request, progress: { (progress:Progress) in
      //监听进度
      self.downloadDelegate?.segmentProgress(delegate: self.downloadDelegate, totalUnitCount: progress.totalUnitCount, completeCount: progress.completedUnitCount)
    }, destination: { (url:URL, response:URLResponse) -> URL in
        //在这里告诉AFN数据存储的路径和文件名
        let documentDirectoryURL = URL.init(fileURLWithPath: path!, isDirectory: false)
        return documentDirectoryURL
    }) { (response:URLResponse, url:URL?, error:Error?) in
      if error != nil {//下载失败
        self.downloadDelegate?.segmentDownloadFailed(self.downloadDelegate)
      } else {//下载成功
        self.downloadDelegate?.segmentDownloadFinished(self.downloadDelegate)
      }
    }
    downloadTask.resume()
  }
  
  //MARK: - 检查此文件是否下载过
  fileprivate func checkIsDownLoad() -> Bool {
    guard let pathPrefix = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true).first else { return false }
    var saveTo = (pathPrefix as NSString).appendingPathComponent("Download")
    saveTo.append("/\(filePath!)")
    let fm = FileManager.default
    
    var isE = false
    if let subFileArray = fm.subpaths(atPath: saveTo) {
      for item in subFileArray {
        if item == self.fileName {
          isE = true
        }
      }
    }
    return isE
  }
}
