//
//  PlayerView.h
//  PlayerUI
//
//  Created by Henray Luo on 2017/1/12.
//  Copyright © 2017年 Henray Luo. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <IJKMediaFramework/IJKMediaFramework.h>
#import "IJKPlayerControl.h"

@interface IJKPlayerView : UIView

@property(nonatomic,copy)NSString* playURL;
@property(nonatomic,copy)NSString* coverImg;
@property(atomic, retain) id<IJKMediaPlayback> player;
@property(nonatomic,strong) IJKPlayerControl *mediaControl;

- (instancetype)initWithURL:(NSURL *)aURL;

- (void)setSuperView:(UIView *)view;

- (void)onDismiss;

@end
