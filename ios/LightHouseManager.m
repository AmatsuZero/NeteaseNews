//
//  LightHouseManager.m
//  news
//
//  Created by 姜振华 on 2017/1/2.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "LightHouseManager.h"
#import "LightHouse.h"

@implementation LightHouseManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(customURL, NSString);

-(UIView*)view {
  
  return [[LightHouse alloc]init];
}


@end
