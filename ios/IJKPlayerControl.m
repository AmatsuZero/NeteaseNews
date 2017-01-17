//
//  IJKPlayerControl.m
//  IJKMediaDemo
//
//  Created by Henray Luo on 2017/1/12.
//  Copyright © 2017年 bilibili. All rights reserved.
//

#import "IJKPlayerControl.h"
#import <IJKMediaFramework/IJKMediaFramework.h>
#import "IJKPlayerViewDefine.h"

NSString *const IJKPlayerControlFullScreenNotification = @"IJKPlayerControlFullScreenNotification";

@interface IJKPlayerControl ()

@property (nonatomic, strong) UIControl     * overlayPanel;
@property (nonatomic, strong) UIImageView   * topPanel;
@property (nonatomic, strong) UIImageView   * bottomPanel;

@property (nonatomic, strong) UIButton      * playButton;
@property (nonatomic, strong) UIButton      * pauseButton;

@property (nonatomic, strong) UILabel       * currentTimeLabel;
@property (nonatomic, strong) UILabel       * totalDurationLabel;
@property (nonatomic, strong) UISlider      * mediaProgressSlider;

@property (nonatomic, strong) UIButton      * fullScreenBtn;

@end

@implementation IJKPlayerControl
{
    BOOL _isMediaSliderBeingDragged;
}

- (instancetype)init
{
    self=[super init];
    if (self) {
        
        [self addTarget:self action:@selector(onClickMediaControl:) forControlEvents:UIControlEventTouchUpInside];
        
        [self addSubview:self.overlayPanel];
        [self.overlayPanel addSubview:self.topPanel];
        [self.overlayPanel addSubview:self.bottomPanel];
        
        [self.bottomPanel addSubview:self.playButton];
        [self.bottomPanel addSubview:self.pauseButton];
        [self.bottomPanel addSubview:self.currentTimeLabel];
        [self.bottomPanel addSubview:self.totalDurationLabel];
        [self.bottomPanel addSubview:self.mediaProgressSlider];
        [self.bottomPanel addSubview:self.fullScreenBtn];
        
        [self refreshMediaControl];
    }
    return self;
}

- (void)layoutSubviews
{
    self.overlayPanel.frame = self.bounds;
    
    CGFloat videoPortWidth = self.frame.size.width;
    
    /* 上边一排控件的容器 */
    self.topPanel.frame = CGRectMake(0, 0, videoPortWidth, 50);
    
    /* 底下一排控件的容器 */
    self.bottomPanel.frame = CGRectMake(0, self.frame.size.height-50, videoPortWidth, 50);
    
    self.playButton.frame = CGRectMake(5, 50-30-5, 30, 30);
    self.pauseButton.frame = CGRectMake(5, 50-30-5, 30, 30);
    
    self.currentTimeLabel.frame = CGRectMake(38, 0, 43, 20);
    self.currentTimeLabel.center = CGPointMake(self.currentTimeLabel.center.x, self.playButton.center.y);
    
    self.fullScreenBtn.frame = CGRectMake(videoPortWidth-30-5, 0, 30, 30);
    self.fullScreenBtn.center = CGPointMake(self.fullScreenBtn.center.x, self.playButton.center.y);
    
    self.totalDurationLabel.frame = CGRectMake(CGRectGetMinX(self.fullScreenBtn.frame)-43-3, 0, 43, 20);
    self.totalDurationLabel.center = CGPointMake(self.totalDurationLabel.center.x, self.playButton.center.y);
    
    CGFloat endWidth = videoPortWidth - CGRectGetMinX(self.totalDurationLabel.frame) + 4;
    CGFloat frontWidth = CGRectGetMaxX(self.currentTimeLabel.frame) + 4;
    CGFloat progressViewWidth = videoPortWidth - frontWidth - endWidth;
    self.mediaProgressSlider.frame = CGRectMake(CGRectGetMaxX(self.currentTimeLabel.frame)+4, 0, progressViewWidth, 30);
    self.mediaProgressSlider.center = CGPointMake(self.mediaProgressSlider.center.x, self.playButton.center.y);
}

#pragma mark - Public

- (void)showNoFade
{
    self.overlayPanel.hidden = NO;
    [self cancelDelayedHide];
    [self refreshMediaControl];
    [[UIApplication sharedApplication] setStatusBarHidden:NO withAnimation:UIStatusBarAnimationFade];
}

- (void)showAndFade
{
    [self showNoFade];
    [self performSelector:@selector(hide) withObject:nil afterDelay:5];
}

- (void)hide
{
    self.overlayPanel.hidden = YES;
    [self cancelDelayedHide];
    if ([self b_isFullScreen]) {
        [[UIApplication sharedApplication] setStatusBarHidden:YES withAnimation:UIStatusBarAnimationFade];
    }
}

- (void)cancelDelayedHide
{
    [NSObject cancelPreviousPerformRequestsWithTarget:self selector:@selector(hide) object:nil];
}

- (void)beginDragMediaSlider
{
    _isMediaSliderBeingDragged = YES;
}

- (void)endDragMediaSlider
{
    _isMediaSliderBeingDragged = NO;
}

- (void)continueDragMediaSlider
{
    [self refreshMediaControl];
}

- (void)refreshMediaControl
{
    // duration
    NSTimeInterval duration = self.delegatePlayer.duration;
    NSInteger intDuration = duration + 0.5;
    if (intDuration > 0) {
        self.mediaProgressSlider.maximumValue = duration;
        self.totalDurationLabel.text = [NSString stringWithFormat:@"%02d:%02d", (int)(intDuration / 60), (int)(intDuration % 60)];
    } else {
        self.totalDurationLabel.text = @"--:--";
        self.mediaProgressSlider.maximumValue = 1.0f;
    }
    
    
    // position
    NSTimeInterval position;
    if (_isMediaSliderBeingDragged) {
        position = self.mediaProgressSlider.value;
    } else {
        position = self.delegatePlayer.currentPlaybackTime;
    }
    NSInteger intPosition = position + 0.5;
    if (intDuration > 0) {
        self.mediaProgressSlider.value = position;
    } else {
        self.mediaProgressSlider.value = 0.0f;
    }
    self.currentTimeLabel.text = [NSString stringWithFormat:@"%02d:%02d", (int)(intPosition / 60), (int)(intPosition % 60)];
    
    
    // status
    BOOL isPlaying = [self.delegatePlayer isPlaying];
    self.playButton.hidden = isPlaying;
    self.pauseButton.hidden = !isPlaying;
    
    
    [NSObject cancelPreviousPerformRequestsWithTarget:self selector:@selector(refreshMediaControl) object:nil];
    if (!self.overlayPanel.hidden) {
        [self performSelector:@selector(refreshMediaControl) withObject:nil afterDelay:0.5];
    }
}

- (BOOL)b_isFullScreen
{
    CGFloat minWidth = MIN(IJKScreenWidth, IJKScreenHeight);
    if (self.frame.size.width<=minWidth) {
        return NO;
    } else {
        return YES;
    }
}

#pragma mark - Event Responder

- (void)onClickMediaControl:(id)sender
{
    [self showAndFade];
}

- (void)onClickOverlay:(id)sender
{
    [self hide];
}

- (void)onClickDone:(id)sender
{

}

- (void)onClickHUD:(UIBarButtonItem *)sender
{
    if ([self.delegatePlayer isKindOfClass:[IJKFFMoviePlayerController class]]) {
        IJKFFMoviePlayerController *player = self.delegatePlayer;
        player.shouldShowHudView = !player.shouldShowHudView;
        
        sender.title = (player.shouldShowHudView ? @"HUD On" : @"HUD Off");
    }
}

- (void)onClickPlay:(id)sender
{
    [self.delegatePlayer play];
    [self refreshMediaControl];
}

- (void)onClickPause:(id)sender
{
    [self.delegatePlayer pause];
    [self refreshMediaControl];
}

- (void)onClickFullScreenBtn:(id)sender
{
    [[NSNotificationCenter defaultCenter] postNotificationName:IJKPlayerControlFullScreenNotification object:nil];
}

- (void)didSliderTouchDown
{
    [self beginDragMediaSlider];
}

- (void)didSliderTouchCancel
{
    [self endDragMediaSlider];
}

- (void)didSliderTouchUpOutside
{
    [self endDragMediaSlider];
}

- (void)didSliderTouchUpInside
{
    self.delegatePlayer.currentPlaybackTime = self.mediaProgressSlider.value;
    [self endDragMediaSlider];
}

- (void)didSliderValueChanged
{
    [self continueDragMediaSlider];
}

#pragma mark - Property

- (UIControl *)overlayPanel
{
    if (!_overlayPanel) {
        _overlayPanel = [[UIControl alloc] init];
        [_overlayPanel addTarget:self action:@selector(onClickOverlay:) forControlEvents:UIControlEventTouchDown];
    }
    return _overlayPanel;
}

- (UIImageView *)topPanel
{
    if (!_topPanel) {
        _topPanel = [[UIImageView alloc] init];
        _topPanel.userInteractionEnabled = YES;
        _topPanel.image = IJKPlayerImage(@"IJKPlayer_top_shadow");
    }
    return _topPanel;
}

- (UIImageView *)bottomPanel
{
    if (!_bottomPanel) {
        _bottomPanel = [[UIImageView alloc] init];
        _bottomPanel.userInteractionEnabled = YES;
        _bottomPanel.image = IJKPlayerImage(@"IJKPlayer_bottom_shadow");
    }
    return _bottomPanel;
}

- (UIButton *)playButton
{
    if (!_playButton) {
        _playButton = [[UIButton alloc] init];
        [_playButton setImage:IJKPlayerImage(@"IJKPlayer_play") forState:UIControlStateNormal];
        [_playButton addTarget:self action:@selector(onClickPlay:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _playButton;
}

- (UIButton *)pauseButton
{
    if (!_pauseButton) {
        _pauseButton = [[UIButton alloc] init];
        [_pauseButton setImage:IJKPlayerImage(@"IJKPlayer_pause") forState:UIControlStateNormal];
        [_pauseButton addTarget:self action:@selector(onClickPause:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _pauseButton;
}

- (UILabel *)currentTimeLabel
{
    if (!_currentTimeLabel) {
        _currentTimeLabel               = [[UILabel alloc] init];
        _currentTimeLabel.textColor     = [UIColor whiteColor];
        _currentTimeLabel.font          = [UIFont systemFontOfSize:12.0f];
        _currentTimeLabel.textAlignment = NSTextAlignmentCenter;
    }
    return _currentTimeLabel;
}

- (UILabel *)totalDurationLabel
{
    if (!_totalDurationLabel) {
        _totalDurationLabel               = [[UILabel alloc] init];
        _totalDurationLabel.textColor     = [UIColor whiteColor];
        _totalDurationLabel.font          = [UIFont systemFontOfSize:12.0f];
        _totalDurationLabel.textAlignment = NSTextAlignmentCenter;
    }
    return _totalDurationLabel;
}

- (UISlider *)mediaProgressSlider
{
    if (!_mediaProgressSlider) {
        _mediaProgressSlider = [[UISlider alloc] init];
        [_mediaProgressSlider setThumbImage:IJKPlayerImage(@"IJKPlayer_slider") forState:UIControlStateNormal];
        _mediaProgressSlider.maximumValue          = 1;
        _mediaProgressSlider.minimumTrackTintColor = [UIColor whiteColor];
        _mediaProgressSlider.maximumTrackTintColor = [UIColor colorWithRed:0.5 green:0.5 blue:0.5 alpha:0.5];
        
        [_mediaProgressSlider addTarget:self action:@selector(didSliderTouchDown) forControlEvents:UIControlEventTouchDown];
        [_mediaProgressSlider addTarget:self action:@selector(didSliderTouchCancel) forControlEvents:UIControlEventTouchCancel];
        [_mediaProgressSlider addTarget:self action:@selector(didSliderTouchUpInside) forControlEvents:UIControlEventTouchUpInside];
        [_mediaProgressSlider addTarget:self action:@selector(didSliderTouchUpOutside) forControlEvents:UIControlEventTouchUpOutside];
        [_mediaProgressSlider addTarget:self action:@selector(didSliderValueChanged) forControlEvents:UIControlEventValueChanged];
    }
    return _mediaProgressSlider;
}

- (UIButton *)fullScreenBtn
{
    if (!_fullScreenBtn) {
        _fullScreenBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_fullScreenBtn setImage:IJKPlayerImage(@"IJKPlayer_fullscreen") forState:UIControlStateNormal];
        [_fullScreenBtn setImage:IJKPlayerImage(@"IJKPlayer_shrinkscreen") forState:UIControlStateSelected];
        [_fullScreenBtn addTarget:self action:@selector(onClickFullScreenBtn:) forControlEvents:UIControlEventTouchUpInside];
    }
    return _fullScreenBtn;
}

- (BOOL)showingPlayControl
{
    return !self.overlayPanel.hidden;
}

@end
