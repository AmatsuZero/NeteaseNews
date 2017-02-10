//
//  LiveRoomManager.m
//  news
//
//  Created by 姜振华 on 2017/2/9.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "LiveRoomManager.h"
#import "LiveRoom.h"

@interface LiveRoomManager ()

@property(nonatomic,strong)LiveRoom* liveRoom;

@end

@implementation LiveRoomManager

RCT_EXPORT_MODULE()
RCT_EXPORT_VIEW_PROPERTY(bilateralValue, float);
RCT_EXPORT_VIEW_PROPERTY(brightnessValue, float);
RCT_EXPORT_METHOD(toggleCapture) {
  [self.liveRoom toggleCapture];
}

-(UIView *)view {
  _liveRoom = [[LiveRoom alloc] init];
  return _liveRoom;
}

@end
