//
//  LightHouseManager.m
//  news
//
//  Created by 姜振华 on 2017/1/2.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "LightHouseManager.h"
#import "LightHouse.h"

@interface LightHouseManager ()

@end

@implementation LightHouseManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(customURL, NSString);

RCT_EXPORT_VIEW_PROPERTY(onClick, RCTBubblingEventBlock)

-(UIView*)view {
  
  LightHouse* lh = [[LightHouse alloc]init];
  return lh;
}

@end
