//
//  LiveRoom.h
//  news
//
//  Created by 姜振华 on 2017/2/9.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface LiveRoom : UIView
// 值越小，磨皮效果越好
@property(nonatomic,assign)float bilateralValue;
@property(nonatomic,assign)float brightnessValue;

/**
 切换摄像头
 */
-(void)toggleCapture;

@end
