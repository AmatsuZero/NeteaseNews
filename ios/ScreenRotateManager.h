//
//  ScreenRotate.h
//  news
//
//  Created by 姜振华 on 2017/1/9.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "RCTBridgeModule.h"

@interface ScreenRotateManager : NSObject
<
RCTBridgeModule
>

+ (void)forceOrientation: (UIInterfaceOrientation)orientation;

+ (BOOL)isOrientationLandscape;

@end
