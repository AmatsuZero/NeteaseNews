//
//  PlayerView.m
//  PlayerUI
//
//  Created by Henray Luo on 2017/1/12.
//  Copyright © 2017年 Henray Luo. All rights reserved.
//

#import "IJKPlayerView.h"
#import "IJKPlayerViewDefine.h"
#import "IJKMaterialDesignSpinner.h"
#import "IJKBrightnessView.h"
#import <AVFoundation/AVFoundation.h>
#import <CoreMotion/CoreMotion.h>

// 枚举值，包含水平移动方向和垂直移动方向
typedef NS_ENUM(NSInteger, PanDirection){
    PanDirectionHorizontalMoved, // 横向移动
    PanDirectionVerticalMoved    // 纵向移动
};

@interface IJKPlayerView ()<UIGestureRecognizerDelegate>

@property (nonatomic, strong) UIView *superView;
@property (nonatomic, assign) BOOL isFullScreen;
@property(atomic,strong) NSURL *url;
@property (nonatomic, strong) IJKMaterialDesignSpinner * materialDesignSpinner;
@property (nonatomic, strong) IJKBrightnessView       *brightnessView;
@property (nonatomic, strong) UISlider               *volumeViewSlider;
@property (nonatomic, assign) PanDirection           panDirection;
@property (nonatomic, assign) BOOL                   isVolume;

//用于锁定设备方向时获取当前设备朝向
@property (nonatomic, strong) CMMotionManager * motionManager;

@end

@implementation IJKPlayerView

-(void)onDismiss {

  [self.player stop];
}

- (instancetype)init
{
    return [self initWithURL:nil];
}

- (instancetype)initWithURL:(NSURL *)aURL
{
    self = [super init];
    if (self) {
        self.backgroundColor = [UIColor blackColor];
        
        _url = aURL;
        
        // 注册通知
        [self installUINotificationObservers];
        [self installMovieNotificationObservers];
        
        // 示意正在加载（seeking）的view。
        [self addSubview:self.materialDesignSpinner];
        [self makeConstraintsForMaterialDesignSpinner];
        
        // 初始化播放器
#ifdef DEBUG
        [IJKFFMoviePlayerController setLogReport:YES];
        [IJKFFMoviePlayerController setLogLevel:k_IJK_LOG_DEBUG];
#else
        [IJKFFMoviePlayerController setLogReport:NO];
        [IJKFFMoviePlayerController setLogLevel:k_IJK_LOG_INFO];
#endif
        
        [IJKFFMoviePlayerController checkIfFFmpegVersionMatch:YES];
        // [IJKFFMoviePlayerController checkIfPlayerVersionMatch:YES major:1 minor:0 micro:0];
    }
    return self;
}

-(void)setUpIJKPlayer {
  IJKFFOptions *options = [IJKFFOptions optionsByDefault];
  _player = [[IJKFFMoviePlayerController alloc] initWithContentURL:_url withOptions:options];
  _player.scalingMode = IJKMPMovieScalingModeAspectFit;
  _player.shouldAutoplay = NO;
  [_player prepareToPlay];
  [self.materialDesignSpinner startAnimating];
  [self addSubview:_player.view];
  
  // 初始化控制层
  _mediaControl = [[IJKPlayerControl alloc] init];
  _mediaControl.delegatePlayer = _player;
  [self addSubview:_mediaControl];
  
  UIPanGestureRecognizer *panRecognizer = [[UIPanGestureRecognizer alloc]initWithTarget:self action:@selector(panDirection:)];
  panRecognizer.delegate = self;
  [panRecognizer setMaximumNumberOfTouches:1];
  [panRecognizer setDelaysTouchesBegan:YES];
  [panRecognizer setDelaysTouchesEnded:YES];
  [panRecognizer setCancelsTouchesInView:YES];
  [self addGestureRecognizer:panRecognizer];
  
  // 配置音量
  [self configureVolume];
  
  [self.motionManager startAccelerometerUpdates];
}

- (void)setSuperView:(UIView *)view
{
  _superView = [[UIView alloc]initWithFrame:self.frame];
  self.frame = self.bounds;
  [self removeFromSuperview];
  [_superView addSubview:self];
  [view addSubview:_superView];
}

- (void)layoutSubviews
{
    [super layoutSubviews];
    if (!self.superView) {
      [self setSuperView:self.superview];
    } else {
      if (!self.isFullScreen) {
        self.frame = self.superView.bounds;
      }
    }
    self.url = [NSURL URLWithString:self.playURL];
    if (!self.player) {
      [self setUpIJKPlayer];
    }
    self.player.view.frame = self.bounds;
    self.mediaControl.frame = self.bounds;
}

#pragma mark - Movie Notifications

/* Register observers for the various movie object notifications. */
-(void)installMovieNotificationObservers
{
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(loadStateDidChange:)
                                                 name:IJKMPMoviePlayerLoadStateDidChangeNotification
                                               object:_player];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(moviePlayBackDidFinish:)
                                                 name:IJKMPMoviePlayerPlaybackDidFinishNotification
                                               object:_player];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(mediaIsPreparedToPlayDidChange:)
                                                 name:IJKMPMediaPlaybackIsPreparedToPlayDidChangeNotification
                                               object:_player];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(moviePlayBackStateDidChange:)
                                                 name:IJKMPMoviePlayerPlaybackStateDidChangeNotification
                                               object:_player];
}

/* Remove the movie notification observers from the movie object. */
-(void)removeMovieNotificationObservers
{
    [[NSNotificationCenter defaultCenter] removeObserver:self name:IJKMPMoviePlayerLoadStateDidChangeNotification object:_player];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:IJKMPMoviePlayerPlaybackDidFinishNotification object:_player];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:IJKMPMediaPlaybackIsPreparedToPlayDidChangeNotification object:_player];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:IJKMPMoviePlayerPlaybackStateDidChangeNotification object:_player];
}

#pragma mark - Movie Notification Handlers

- (void)loadStateDidChange:(NSNotification*)notification
{
    //    MPMovieLoadStateUnknown        = 0,
    //    MPMovieLoadStatePlayable       = 1 << 0,
    //    MPMovieLoadStatePlaythroughOK  = 1 << 1, // Playback will be automatically started in this state when shouldAutoplay is YES
    //    MPMovieLoadStateStalled        = 1 << 2, // Playback will be automatically paused in this state, if started
    
    IJKMPMovieLoadState loadState = _player.loadState;
    
    if ((loadState & IJKMPMovieLoadStatePlaythroughOK) != 0) {
        NSLog(@"loadStateDidChange: IJKMPMovieLoadStatePlaythroughOK: %d\n", (int)loadState);
    } else if ((loadState & IJKMPMovieLoadStateStalled) != 0) {
        NSLog(@"loadStateDidChange: IJKMPMovieLoadStateStalled: %d\n", (int)loadState);
    } else {
        NSLog(@"loadStateDidChange: ???: %d\n", (int)loadState);
    }
}

- (void)moviePlayBackDidFinish:(NSNotification*)notification
{
    //    MPMovieFinishReasonPlaybackEnded,
    //    MPMovieFinishReasonPlaybackError,
    //    MPMovieFinishReasonUserExited
    int reason = [[[notification userInfo] valueForKey:IJKMPMoviePlayerPlaybackDidFinishReasonUserInfoKey] intValue];
    
    switch (reason)
    {
        case IJKMPMovieFinishReasonPlaybackEnded:
            NSLog(@"playbackStateDidChange: IJKMPMovieFinishReasonPlaybackEnded: %d\n", reason);
            break;
            
        case IJKMPMovieFinishReasonUserExited:
            NSLog(@"playbackStateDidChange: IJKMPMovieFinishReasonUserExited: %d\n", reason);
            break;
            
        case IJKMPMovieFinishReasonPlaybackError:
            NSLog(@"playbackStateDidChange: IJKMPMovieFinishReasonPlaybackError: %d\n", reason);
            break;
            
        default:
            NSLog(@"playbackPlayBackDidFinish: ???: %d\n", reason);
            break;
    }
}

- (void)mediaIsPreparedToPlayDidChange:(NSNotification*)notification
{
    [self.materialDesignSpinner startAnimating];
    NSLog(@"mediaIsPreparedToPlayDidChange\n");
}

- (void)moviePlayBackStateDidChange:(NSNotification*)notification
{
    //    MPMoviePlaybackStateStopped,
    //    MPMoviePlaybackStatePlaying,
    //    MPMoviePlaybackStatePaused,
    //    MPMoviePlaybackStateInterrupted,
    //    MPMoviePlaybackStateSeekingForward,
    //    MPMoviePlaybackStateSeekingBackward
    
    switch (_player.playbackState)
    {
        case IJKMPMoviePlaybackStateStopped: {
            NSLog(@"IJKMPMoviePlayBackStateDidChange %d: stoped", (int)_player.playbackState);
            break;
        }
        case IJKMPMoviePlaybackStatePlaying: {
            NSLog(@"IJKMPMoviePlayBackStateDidChange %d: playing", (int)_player.playbackState);
            [self.materialDesignSpinner stopAnimating];
            break;
        }
        case IJKMPMoviePlaybackStatePaused: {
            NSLog(@"IJKMPMoviePlayBackStateDidChange %d: paused", (int)_player.playbackState);
            break;
        }
        case IJKMPMoviePlaybackStateInterrupted: {
            NSLog(@"IJKMPMoviePlayBackStateDidChange %d: interrupted", (int)_player.playbackState);
            break;
        }
        case IJKMPMoviePlaybackStateSeekingForward:
        case IJKMPMoviePlaybackStateSeekingBackward: {
            NSLog(@"IJKMPMoviePlayBackStateDidChange %d: seeking", (int)_player.playbackState);
            [self.materialDesignSpinner startAnimating];
            break;
        }
        default: {
            NSLog(@"IJKMPMoviePlayBackStateDidChange %d: unknown", (int)_player.playbackState);
            break;
        }
    }
}

#pragma mark - UIGestureRecognizerDelegate

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldReceiveTouch:(UITouch *)touch
{
    if ([touch.view isKindOfClass:[UISlider class]]) {
        return NO;
    }
    
    return YES;
}

#pragma mark - UIPanGestureRecognizer手势方法

- (void)panDirection:(UIPanGestureRecognizer *)pan
{
    //根据在view上Pan的位置，确定是调音量还是亮度
    CGPoint locationPoint = [pan locationInView:self];
    
    // 我们要响应水平移动和垂直移动
    // 根据上次和本次移动的位置，算出一个速率的point
    CGPoint veloctyPoint = [pan velocityInView:self];
    
    // 判断是垂直移动还是水平移动
    switch (pan.state) {
        case UIGestureRecognizerStateBegan:{ // 开始移动
            // 使用绝对值来判断移动的方向
            CGFloat x = fabs(veloctyPoint.x);
            CGFloat y = fabs(veloctyPoint.y);
            if (x > y) { // 水平移动
                // 取消隐藏
                self.panDirection = PanDirectionHorizontalMoved;
                // 给sumTime初值
//                CMTime time       = self.player.currentTime;
//                self.sumTime      = time.value/time.timescale;
            }
            else if (x < y){ // 垂直移动
                self.panDirection = PanDirectionVerticalMoved;
                // 开始滑动的时候,状态改为正在控制音量
                if (locationPoint.x > self.bounds.size.width / 2) {
                    self.isVolume = YES;
                }else { // 状态改为显示亮度调节
                    self.isVolume = NO;
                }
            }
            break;
        }
        case UIGestureRecognizerStateChanged:{ // 正在移动
            switch (self.panDirection) {
                case PanDirectionHorizontalMoved:{
                    [self horizontalMoved:veloctyPoint.x]; // 水平移动的方法只要x方向的值
                    break;
                }
                case PanDirectionVerticalMoved:{
                    [self verticalMoved:veloctyPoint.y]; // 垂直移动方法只要y方向的值
                    break;
                }
                default:
                    break;
            }
            break;
        }
        case UIGestureRecognizerStateEnded:{ // 移动停止
            // 移动结束也需要判断垂直或者平移
            // 比如水平移动结束时，要快进到指定位置，如果这里没有判断，当我们调节音量完之后，会出现屏幕跳动的bug
            switch (self.panDirection) {
                case PanDirectionHorizontalMoved:{
//                    self.isPauseByUser = NO;
//                    [self seekToTime:self.sumTime completionHandler:nil];
//                    // 把sumTime滞空，不然会越加越多
//                    self.sumTime = 0;
                    break;
                }
                case PanDirectionVerticalMoved:{
                    // 垂直移动结束后，把状态改为不再控制音量
                    self.isVolume = NO;
                    break;
                }
                default:
                    break;
            }
            break;
        }
        default:
            break;
    }
}

/**
 *  pan垂直移动的方法
 *
 *  @param value void
 */
- (void)verticalMoved:(CGFloat)value
{
    self.isVolume ? (self.volumeViewSlider.value -= value / 10000) : ([UIScreen mainScreen].brightness -= value / 10000);
}

/**
 *  pan水平移动的方法
 *
 *  @param value void
 */
- (void)horizontalMoved:(CGFloat)value
{
//    // 每次滑动需要叠加时间
//    self.sumTime += value / 200;
//    
//    // 需要限定sumTime的范围
//    CMTime totalTime           = self.playerItem.duration;
//    CGFloat totalMovieDuration = (CGFloat)totalTime.value/totalTime.timescale;
//    if (self.sumTime > totalMovieDuration) { self.sumTime = totalMovieDuration;}
//    if (self.sumTime < 0) { self.sumTime = 0; }
//    
//    BOOL style = false;
//    if (value > 0) { style = YES; }
//    if (value < 0) { style = NO; }
//    if (value == 0) { return; }
//    
//    self.isDragged = YES;
//    [self.controlView zf_playerDraggedTime:self.sumTime totalTime:totalMovieDuration isForward:style hasPreview:NO];
}

#pragma mark - Volume Config

/**
 *  获取系统音量
 */
- (void)configureVolume
{
    MPVolumeView *volumeView = [[MPVolumeView alloc] init];
    _volumeViewSlider = nil;
    for (UIView *view in [volumeView subviews]){
        if ([view.class.description isEqualToString:@"MPVolumeSlider"]){
            _volumeViewSlider = (UISlider *)view;
            break;
        }
    }
    
    // 使用这个category的应用不会随着手机静音键打开而静音，可在手机静音下播放声音
    NSError *setCategoryError = nil;
    BOOL success = [[AVAudioSession sharedInstance]
                    setCategory: AVAudioSessionCategoryPlayback
                    error: &setCategoryError];
    
    if (!success) { /* handle the error in setCategoryError */ }
    
    // 监听耳机插入和拔掉通知
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(audioRouteChangeListenerCallback:) name:AVAudioSessionRouteChangeNotification object:nil];
}

/**
 *  耳机插入、拔出事件
 */
- (void)audioRouteChangeListenerCallback:(NSNotification*)notification
{
    NSDictionary *interuptionDict = notification.userInfo;
    
    NSInteger routeChangeReason = [[interuptionDict valueForKey:AVAudioSessionRouteChangeReasonKey] integerValue];
    
    switch (routeChangeReason) {
            
        case AVAudioSessionRouteChangeReasonNewDeviceAvailable:
            // 耳机插入
            break;
            
        case AVAudioSessionRouteChangeReasonOldDeviceUnavailable:
        {
            // 耳机拔掉
            // 拔掉耳机继续播放
//            [self play];
        }
            break;
            
        case AVAudioSessionRouteChangeReasonCategoryChange:
            // called at start - also when other audio wants to play
            NSLog(@"AVAudioSessionRouteChangeReasonCategoryChange");
            break;
    }
}

#pragma mark - UI 旋转

/**
 *  添加观察者、通知
 */
- (void)installUINotificationObservers
{
    // 监测设备方向
    [[UIDevice currentDevice] beginGeneratingDeviceOrientationNotifications];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onDeviceOrientationChange)
                                                 name:UIDeviceOrientationDidChangeNotification
                                               object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onClickFullScrenBtn:)
                                                 name:IJKPlayerControlFullScreenNotification
                                               object:nil];
}

- (void)removeUINotificationObservers
{
    [[UIDevice currentDevice] endGeneratingDeviceOrientationNotifications];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIDeviceOrientationDidChangeNotification object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:IJKPlayerControlFullScreenNotification object:nil];
}

- (UIDeviceOrientation)deviceOrientationWhenDeviceLockRotation
{
    CMAccelerometerData *accelerometerData = self.motionManager.accelerometerData;
    CGFloat xx = accelerometerData.acceleration.x;
    return xx >= 0 ? UIDeviceOrientationLandscapeLeft : UIDeviceOrientationLandscapeRight;
}

- (void)onClickFullScrenBtn:(NSNotification *)notification
{
    if (self.isFullScreen) {
        [self forceRotatePlayerViewToOrientation:UIInterfaceOrientationPortrait];
    } else {
        UIDeviceOrientation orientation = [self deviceOrientationWhenDeviceLockRotation];
        if (orientation == UIDeviceOrientationLandscapeRight) {
            [self forceRotatePlayerViewToOrientation:UIInterfaceOrientationLandscapeRight];
        } else {
            [self forceRotatePlayerViewToOrientation:UIInterfaceOrientationLandscapeLeft];
        }
    }
}

- (void)onDeviceOrientationChange
{
    UIDeviceOrientation orientation = [UIDevice currentDevice].orientation;
    
    [self forceRotatePlayerViewToOrientation:(UIInterfaceOrientation)orientation];
}

- (void)forceRotatePlayerViewToOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    CGAffineTransform transform = CGAffineTransformIdentity;
    
    switch (interfaceOrientation) {
            
        case UIInterfaceOrientationPortrait:
        {
            self.isFullScreen = NO;
           
            transform = CGAffineTransformIdentity;
        }
            break;
        case UIInterfaceOrientationLandscapeLeft:
        case UIInterfaceOrientationLandscapeRight:
        {
            self.isFullScreen = YES;
            
            transform = interfaceOrientation == UIInterfaceOrientationLandscapeLeft ? CGAffineTransformMakeRotation(-M_PI_2) : CGAffineTransformMakeRotation(M_PI_2);
        }
            break;
        default: return ;
            break;
    }
    
#pragma clang diagnostic push
#pragma clang diagnostic ignored"-Wdeprecated-declarations"
    [[UIApplication sharedApplication] setStatusBarOrientation:interfaceOrientation animated:NO];
#pragma clang diagnostic pop
    
    [UIView beginAnimations:nil context:nil];
    [UIView setAnimationDuration:0.4];
    
    if (!self.isFullScreen) {
        [self.superView addSubview:self];
        [self makeConstraintsOnSuperView];
        [[UIApplication sharedApplication].keyWindow addSubview:self.brightnessView];
        self.brightnessView.frame = CGRectMake((IJKScreenWidth-155)/2, (IJKScreenHeight-155)/2, 155, 155);
        [[UIApplication sharedApplication] setStatusBarHidden:NO withAnimation:UIStatusBarAnimationFade];
        NSLog(@"%@",NSStringFromCGRect(self.frame));
    } else {
        [[UIApplication sharedApplication].keyWindow addSubview:self];
      
        [self makeConstraintsOnWindow];
        [self addSubview:self.brightnessView];
        CGFloat maxWidth = MAX(IJKScreenWidth, IJKScreenHeight);
        CGFloat minHeight = MIN(IJKScreenWidth, IJKScreenHeight);
        self.brightnessView.frame = CGRectMake((maxWidth-155)/2, (minHeight-155)/2, 155, 155);
        
        if (self.mediaControl.showingPlayControl) {
            [[UIApplication sharedApplication] setStatusBarHidden:NO withAnimation:UIStatusBarAnimationFade];
        } else {
            [[UIApplication sharedApplication] setStatusBarHidden:YES withAnimation:UIStatusBarAnimationFade];
        }
    }
    
    self.transform = CGAffineTransformIdentity;
    self.transform = transform;
    
    [UIView commitAnimations];
}

- (void)makeConstraintsOnSuperView
{
  // 此时 PlayerView 在自定义的 View 上。
  self.translatesAutoresizingMaskIntoConstraints = NO;
  
  NSArray *selfHConstraint =
  [NSLayoutConstraint constraintsWithVisualFormat:@"H:|-0-[self]-0-|"
                                          options:0
                                          metrics:nil
                                            views:@{@"self" : self}];
  [self.superView addConstraints:selfHConstraint];
  
  NSArray *selfVConstraint =
  [NSLayoutConstraint constraintsWithVisualFormat:@"V:|-0-[self]-0-|"
                                          options:0
                                          metrics:nil
                                            views:@{@"self" : self}];
  [self.superView addConstraints:selfVConstraint];

}

- (void)makeConstraintsOnWindow
{
    // 此时 PalyerView 在 keyWindow 上 .
    self.translatesAutoresizingMaskIntoConstraints = NO;
    
    NSLayoutConstraint *selfWidthConstraint =
    [NSLayoutConstraint constraintWithItem:self
                                 attribute:NSLayoutAttributeWidth
                                 relatedBy:NSLayoutRelationEqual
                                    toItem:nil
                                 attribute:NSLayoutAttributeWidth
                                multiplier:1.0
                                  constant:MAX(IJKScreenWidth, IJKScreenHeight)];
    [self.superview addConstraint:selfWidthConstraint];
    
    NSLayoutConstraint *selfHeightConstraint =
    [NSLayoutConstraint constraintWithItem:self
                                 attribute:NSLayoutAttributeHeight
                                 relatedBy:NSLayoutRelationEqual
                                    toItem:nil
                                 attribute:NSLayoutAttributeHeight
                                multiplier:1.0
                                  constant:MIN(IJKScreenWidth, IJKScreenHeight)];
    [self.superview addConstraint:selfHeightConstraint];
    
    NSLayoutConstraint *selfCenterXConstraint =
    [NSLayoutConstraint constraintWithItem:self
                                 attribute:NSLayoutAttributeCenterX
                                 relatedBy:NSLayoutRelationEqual
                                    toItem:[UIApplication sharedApplication].keyWindow
                                 attribute:NSLayoutAttributeCenterX
                                multiplier:1.0
                                  constant:0];
    [self.superview addConstraint:selfCenterXConstraint];
    
    NSLayoutConstraint *selfCenterYConstraint =
    [NSLayoutConstraint constraintWithItem:self
                                 attribute:NSLayoutAttributeCenterY
                                 relatedBy:NSLayoutRelationEqual
                                    toItem:[UIApplication sharedApplication].keyWindow
                                 attribute:NSLayoutAttributeCenterY
                                multiplier:1.0
                                  constant:0];
    [[UIApplication sharedApplication].keyWindow addConstraint:selfCenterYConstraint];
}

- (void)makeConstraintsForMaterialDesignSpinner
{
    self.materialDesignSpinner.translatesAutoresizingMaskIntoConstraints = NO;
    NSDictionary *dict = NSDictionaryOfVariableBindings(_materialDesignSpinner);
    
    NSArray *materialDesignSpinnerHConstraints =
    [NSLayoutConstraint constraintsWithVisualFormat:@"H:[_materialDesignSpinner(45)]"
                                            options:0
                                            metrics:nil
                                              views:dict];
    [self addConstraints:materialDesignSpinnerHConstraints];
    
    NSArray *materialDesignSpinnerVConstraints =
    [NSLayoutConstraint constraintsWithVisualFormat:@"V:[_materialDesignSpinner(45)]"
                                            options:0
                                            metrics:nil
                                              views:dict];
    [self addConstraints:materialDesignSpinnerVConstraints];
    
    NSLayoutConstraint * hAlignCenter =
    [NSLayoutConstraint constraintWithItem:self.materialDesignSpinner
                                 attribute:NSLayoutAttributeCenterX
                                 relatedBy:NSLayoutRelationEqual
                                    toItem:self
                                 attribute:NSLayoutAttributeCenterX
                                multiplier:1.0
                                  constant:0];
    
    [self addConstraint:hAlignCenter];
    
    NSLayoutConstraint * vAlignCenter =
    [NSLayoutConstraint constraintWithItem:self.materialDesignSpinner
                                 attribute:NSLayoutAttributeCenterY
                                 relatedBy:NSLayoutRelationEqual
                                    toItem:self
                                 attribute:NSLayoutAttributeCenterY
                                multiplier:1.0
                                  constant:0];
    [self addConstraint:vAlignCenter];
}

#pragma mark - Property

- (IJKMaterialDesignSpinner *)materialDesignSpinner
{
    if (!_materialDesignSpinner) {
        _materialDesignSpinner = [[IJKMaterialDesignSpinner alloc] init];
        _materialDesignSpinner.lineWidth = 1;
        _materialDesignSpinner.duration  = 1;
        _materialDesignSpinner.tintColor = [[UIColor whiteColor] colorWithAlphaComponent:0.9];
    }
    return _materialDesignSpinner;
}

- (IJKBrightnessView *)brightnessView
{
    if (!_brightnessView) {
        _brightnessView = [IJKBrightnessView sharedBrightnessView];
    }
    return _brightnessView;
}

- (CMMotionManager *)motionManager
{
    if (!_motionManager) {
        _motionManager = [[CMMotionManager alloc] init];
        _motionManager.accelerometerUpdateInterval = .5f;
    }
    return _motionManager;
}

@end
