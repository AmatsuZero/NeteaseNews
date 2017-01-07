//
//  RCTConvert+UIInterfaceOrientation.m
//  news
//
//  Created by 姜振华 on 2017/1/7.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "RCTConvert+UIInterfaceOrientation.h"

@implementation RCTConvert (UIInterfaceOrientation)

RCT_ENUM_CONVERTER(UIInterfaceOrientation,
                   (@{
                      @"interfaceOrientationUnknown":@(UIInterfaceOrientationPortrait),
                      @"interfaceOrientationPortrait":@(UIInterfaceOrientationPortrait),
                      @"interfaceOrientationPortraitUpsideDown":@(UIInterfaceOrientationPortraitUpsideDown),
                      @"interfaceOrientationLandscapeLeft":@(UIInterfaceOrientationLandscapeLeft),
                      @"interfaceOrientationLandscapeRight":@(UIInterfaceOrientationLandscapeRight)
                    }),
                   UIInterfaceOrientationPortrait,
                   integerValue)



@end
