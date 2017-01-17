//
//  VideoRoomManager.m
//  news
//
//  Created by 姜振华 on 2017/1/7.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "VideoRoomManager.h"
#import "IJKPlayerView.h"

@interface VideoRoomManager ()

@property(nonatomic,strong)IJKPlayerView* videoroom;

@end

@implementation VideoRoomManager

RCT_EXPORT_MODULE()
RCT_EXPORT_VIEW_PROPERTY(playURL, NSString);
RCT_EXPORT_METHOD(onDismiss)
{
  [self.videoroom onDismiss];
}

-(UIView*)view {
  _videoroom = [[IJKPlayerView alloc] init];
  return _videoroom;
}

@end
