//
//  VideoRoomManager.m
//  news
//
//  Created by 姜振华 on 2017/1/7.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "VideoRoomManager.h"
#import "VideoRoom.h"


@implementation VideoRoomManager

RCT_EXPORT_MODULE()
RCT_EXPORT_VIEW_PROPERTY(playURL, NSString);

-(UIView*)view {
  VideoRoom* videoroom = [[VideoRoom alloc]init];
  return videoroom;
}

@end
