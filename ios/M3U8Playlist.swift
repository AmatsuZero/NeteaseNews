//
//  M3U8Playlist.swift
//  news
//
//  Created by 姜振华 on 2017/2/28.
//  Copyright © 2017年 Facebook. All rights reserved.
//

import UIKit

extension String {
  
  static let formatter = DateFormatter()
  static func getTiemStamp() -> String{
    let nowDate = Date()
    let timeZone = TimeZone.init(identifier: "UTC")
    formatter.timeZone = timeZone
    formatter.locale = Locale.init(identifier: "zh_CN")
    formatter.dateFormat = "yyyy-MM-dd HH:mm"
    let date = formatter.string(from: nowDate)
    return date.components(separatedBy: " ").first!
  }
}

public class M3U8Playlist: NSObject {
  
  var segmentArray:Array<M3U8SegmentModel>
  var uuid: String
  var length:Int
  
  public init(segmentArray:Array<M3U8SegmentModel>, uuid:String = "movie1") {
    self.segmentArray = segmentArray
    self.length = segmentArray.count
    self.uuid = uuid
    super.init()
  }
  
  
}
