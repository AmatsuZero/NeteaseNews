//
//  PlayerViewControl.h
//  viedoDemo4
//
//  Created by 林之杰 on 16/1/19.
//  Copyright © 2016年 林之杰. All rights reserved.
//

#import <UIKit/UIKit.h>

@protocol IJKMediaPlayback;

@interface PlayerViewControl : UIControl
@property (weak, nonatomic) id<IJKMediaPlayback> delegatePlayer;

@property (strong, nonatomic) UIButton* switchBut;
@property (strong, nonatomic) UISlider* slider;
@property (strong, nonatomic) UILabel * timer;
@property (strong, nonatomic) UIButton* danmakuBut;
@property (strong, nonatomic) UIButton* fullScreenBut;

@property (strong, nonatomic) UIButton* playBut;


@property (strong, nonatomic) UIView* overlay;
@property (strong, nonatomic) UIView* buttomlay;


@property (strong, nonatomic) UIActivityIndicatorView* indicator;
- (void)refreshPlayerContrl;
- (void)showNoFade;
- (void)showAndFade;
- (void)hide;

- (void)beginDragMediaSlider;
- (void)endDragMediaSlider;
- (void)continueDragMediaSlider;

@end
