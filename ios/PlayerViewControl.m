//
//  PlayerViewControl.m
//  viedoDemo4
//
//  Created by 林之杰 on 16/1/19.
//  Copyright © 2016年 林之杰. All rights reserved.
//

#import "PlayerViewControl.h"
#import <IJKMediaFramework/IJKMediaFramework.h>

@implementation PlayerViewControl {
    BOOL _isMediaSliderDragged;
}

- (id)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
        self.frame = CGRectMake(0, frame.size.height - 30, self.frame.size.width, 30);
        
        _overlay = [[UIView alloc] initWithFrame:CGRectMake(0, 0, self.frame.size.width, 30)];
        _overlay.backgroundColor = [UIColor clearColor];
      
        _buttomlay = [[UIView alloc] initWithFrame:CGRectMake(0, 0, self.frame.size.width, 30)];
        _buttomlay.backgroundColor = [UIColor blackColor];
        _buttomlay.alpha = 0.6f;
        
        _switchBut = [UIButton buttonWithType:UIButtonTypeCustom];
        _switchBut.frame = CGRectMake(1, 1, 45, 30);
        _switchBut.autoresizingMask = UIViewAutoresizingFlexibleHeight;
        _switchBut.backgroundColor = [UIColor clearColor];
        [_switchBut setTitle:@"普清" forState:UIControlStateNormal];
        _switchBut.titleLabel.font = [UIFont systemFontOfSize:15];
        _switchBut.showsTouchWhenHighlighted = YES;
        
        _slider = [[UISlider alloc] initWithFrame:CGRectMake(_switchBut.frame.size.width, 5, 250, 20)];
        _slider.autoresizingMask = UIViewAutoresizingFlexibleHeight;
        _slider.continuous = NO;
        _slider.value = 0;
        
        _timer = [[UILabel alloc] initWithFrame:CGRectMake(300, 10, 50, 10)];
        _timer.backgroundColor = [UIColor clearColor];
//        _timer.autoresizingMask = UIViewAutoresizingFlexibleHeight;
        _timer.textColor = [UIColor whiteColor];
        _timer.adjustsFontSizeToFitWidth = NO;
        _timer.textAlignment = NSTextAlignmentLeft;
        _timer.text = @"--:--";
        _timer.font = [UIFont systemFontOfSize:9];
      
        _danmakuBut = [UIButton buttonWithType:UIButtonTypeCustom];
        _danmakuBut.frame = CGRectMake(345, 1, 45, 30);
        _danmakuBut.autoresizingMask = UIViewAutoresizingFlexibleHeight;
        _danmakuBut.backgroundColor = [UIColor clearColor];
        [_danmakuBut setTitle:@"弹幕" forState:UIControlStateNormal];
        _danmakuBut.titleLabel.font = [UIFont systemFontOfSize:15];
        _danmakuBut.showsTouchWhenHighlighted = YES;
      
        _fullScreenBut = [UIButton buttonWithType:UIButtonTypeCustom];
        _fullScreenBut.frame = CGRectMake(380, 1, 45, 30);
        _fullScreenBut.autoresizingMask = UIViewAutoresizingFlexibleHeight;
        _fullScreenBut.backgroundColor = [UIColor clearColor];
        [_fullScreenBut setTitle:@"全" forState:UIControlStateNormal];
        _fullScreenBut.titleLabel.font = [UIFont systemFontOfSize:15];
        _fullScreenBut.showsTouchWhenHighlighted = YES;
        
        [_overlay addSubview:_buttomlay];
        [_overlay addSubview:_switchBut];
        [_overlay addSubview:_slider];
        [_overlay addSubview:_timer];
        [_overlay addSubview:_danmakuBut];
        [_overlay addSubview:_fullScreenBut];
      
        [self addSubview:_overlay];
    }
    return self;
}

- (void)awakeFromNib {
    [super awakeFromNib];
    [self refreshPlayerContrl];
}

- (void)showNoFade {
    self.overlay.hidden = NO;
    [self cancelDelayedHide];
    [self refreshPlayerContrl];
}

- (void)showAndFade {
    [self showNoFade];
    [self performSelector:@selector(hide) withObject:nil afterDelay:5];
}

-(void)hide {
    self.overlay.hidden = YES;
    [self cancelDelayedHide];
    NSLog(@"hide");
}

- (void)cancelDelayedHide {
    [NSObject cancelPreviousPerformRequestsWithTarget:self selector:@selector(hide) object:nil];
}

- (void)beginDragMediaSlider {}

- (void)endDragMediaSlider {}

- (void)continueDragMediaSlider {}

- (void)refreshPlayerContrl {

    NSTimeInterval position = self.delegatePlayer.currentPlaybackTime;
    NSInteger intPositon = position + 0.5;
    if (intPositon > 0) {
        self.slider.maximumValue = position;
        self.timer.text = [NSString stringWithFormat:@"直播%02d:%02d",(int)(intPositon/60),(int)(intPositon%60)];
    } else {
        self.slider.maximumValue = 1.0f;
        self.timer.text = @"直播--:--";
    }
    
    BOOL isPlaying = [self.delegatePlayer isPlaying];
    self.playBut.hidden = isPlaying;
    self.indicator.hidden = isPlaying;
//    self.overlay.hidden = YES;
    if (isPlaying) {
        [self.indicator stopAnimating];
        NSLog(@"-----------------------------------playing");
    }else if(!isPlaying){
        [self.indicator startAnimating];
        NSLog(@"----------------------------------no");
    }
    
    [NSObject cancelPreviousPerformRequestsWithTarget:self selector:@selector(refreshPlayerContrl) object:nil];
    if (!self.overlay.hidden) {
        [self performSelector:@selector(refreshPlayerContrl) withObject:nil afterDelay:0.5];
    }
}

@end
