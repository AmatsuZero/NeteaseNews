//
//  LightHouse.h
//  news
//
//  Created by 姜振华 on 2017/1/2.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@interface LightHouse : UIView

@property(nonatomic,copy)NSString* customURL;

@property(copy, nonatomic)RCTBubblingEventBlock onClick;

@end
