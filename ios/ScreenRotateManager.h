//
//  ScreenRotateManager.h
//  news
//
//  Created by 姜振华 on 2017/1/7.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <React/RCTBridgeModule.h>

@interface ScreenRotateManager : NSObject

+ (void)forceOrientation: (UIInterfaceOrientation)orientation;

+ (BOOL)isOrientationLandscape;

@end
