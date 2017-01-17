//
//  IJKPlayerControl.h
//  IJKMediaDemo
//
//  Created by Henray Luo on 2017/1/12.
//  Copyright © 2017年 bilibili. All rights reserved.
//

#import <UIKit/UIKit.h>

@protocol IJKMediaPlayback;

extern NSString *const IJKPlayerControlFullScreenNotification;

@interface IJKPlayerControl : UIControl

@property (nonatomic, readonly) BOOL showingPlayControl;
@property (nonatomic, weak) id<IJKMediaPlayback> delegatePlayer;

@end
