//
//  VideoRoom.m
//  news
//
//  Created by 姜振华 on 2017/1/7.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "VideoRoom.h"
#import "VideoRoom+Notification.h"
#import "ScreenRotateManager.h"

@interface VideoRoom ()
{
  BOOL isHidden;
  UIInterfaceOrientation _lastOrientaion;
  NSTimer *timer;
  UISlider* volumeViewSlider;
  float systemVolume;
  CGPoint startPoint;
  CGRect smallFrame;
}

@end

@implementation VideoRoom

- (void)dealloc {
  [self.player stop];
  [_player shutdown];
  [self removeNotification];
}

-(instancetype)init{
  self = [super init];
  if (self) {
    isHidden = false;
  }
  return self;
}

-(void)layoutSubviews {
    [self setupPlayer];
}


- (void)setupPlayer {
  self.backgroundColor = [UIColor grayColor];
  
  if (!self.playerView) {
    self.playerView = [[UIView alloc] init];
    [self addSubview:self.playerView];
  }
  
  self.playerView.frame = self.bounds;
  smallFrame = self.playerView.frame;
  
  IJKFFOptions *options;
  [options setCodecOptionIntValue:IJK_AVDISCARD_DEFAULT
                           forKey:@"skip_loop_filter"];
  [options setCodecOptionIntValue:IJK_AVDISCARD_DEFAULT
                           forKey:@"skip_frame"];
  [options setPlayerOptionIntValue:1 forKey:@"videotoolbox"];
  [options setPlayerOptionIntValue:8 forKey:@"framedrop"];
  
  if (!self.player) {
    NSURL* url = [NSURL URLWithString:self.playURL];
    self.player = [[IJKFFMoviePlayerController alloc] initWithContentURL:url withOptions:options];
    [self.player setScalingMode:IJKMPMovieScalingModeAspectFit];
    self.player.shouldAutoplay = YES;
  }
  
  self.player.view.frame = self.bounds;
  
  if (![self.player isPlaying]) {
    //一定要调用！
    [self.player prepareToPlay];
  }

  /*!
   playerControl method
   */
  if (!self.playerControl) {
    self.playerControl = [[PlayerViewControl alloc] initWithFrame:self.frame];
    self.playerControl.delegatePlayer = _player;
    [self.player.view addSubview:self.playerControl];
    [self.playerView addSubview:self.player.view];
    [self.playerControl.fullScreenBut addTarget:self action:@selector(fullScreenButDidTouch) forControlEvents:UIControlEventTouchUpInside];
    [self.playerControl.switchBut addTarget:self action:@selector(switchButDidTouch) forControlEvents:UIControlEventTouchUpInside];
    [self setupNotification];
  }
  
  [self.playerControl showAndFade];
  
  /*!
   Volume method
   */
  MPVolumeView *volumeView = [[MPVolumeView alloc] init];
  UISlider* vs = nil;
  for (UIView *view in [volumeView subviews]){
    if ([view.class.description isEqualToString:@"MPVolumeSlider"]){
      vs = (UISlider*)view;
      break;
    }
  }
  systemVolume = volumeViewSlider.value;
}

-(void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
  if (event.allTouches.count == 1) {
    [self.playerControl showAndFade];
    
    startPoint = [[touches anyObject] locationInView:self];;
  }
}
- (void)touchesMoved:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
  if (event.allTouches.count == 1) {
    CGPoint point = [[touches anyObject] locationInView:self];
    float dx = point.x - startPoint.x;
    float dy = point.y - startPoint.y;
    NSLog(@"Point(x,y) =%.2f:%.2f",point.x,point.y);
    int indexY = (int)dy;
    if (startPoint.x > self.bounds.size.width/2) {
      if (indexY > 0) {
        if (indexY % 5 == 0) {
          NSLog(@"%.2f",systemVolume);
          if (systemVolume > 0.1) {
            systemVolume = systemVolume - 0.05;
            [volumeViewSlider setValue:systemVolume animated:YES];
            [volumeViewSlider sendActionsForControlEvents:  UIControlEventTouchUpInside];
          }
        }
      }else {
        if (indexY%5 == 0) {
          NSLog(@"+x == %d",indexY);
          NSLog(@"%.2f",systemVolume);
          if (systemVolume >= 0 && systemVolume < 1) {
            systemVolume +=0.05;
            [volumeViewSlider setValue:systemVolume animated:YES];
            [volumeViewSlider sendActionsForControlEvents:  UIControlEventTouchUpInside];
          }
        }
      }
      
    }else {
      NSLog(@"%.2f",dx);
      [UIScreen mainScreen].brightness = (float) dy/self.bounds.size.height;
      NSLog(@"%.2f",[UIScreen mainScreen].brightness);
    }
  }
}
#pragma -ActionSelector

-(void) switchButDidTouch{
  
  [self.player stop];
  [_player shutdown];
  _player = nil;
  self.player = nil;
  _playerControl = nil;
  self.playerControl = nil;
  _playerView = nil;
  self.playerView = nil;
  
  
  timer = [NSTimer scheduledTimerWithTimeInterval:5.0f target:self selector:@selector(timeEnd) userInfo:nil repeats:YES];
  
  [self removeNotification];
  
  self.playURL = @"http://61.143.225.69:8080/live/12345_3.m3u8";

  [self setupPlayer];
  [_playerControl.switchBut setTitle:@"高清" forState:UIControlStateNormal];
  isHidden = false;
  [self addSubview:self.playerView];
  
  NSLog(@"View Did Init");
  
}

- (void)timeEnd {
  [timer invalidate];
  [self.player prepareToPlay];
}


- (void) fullScreenButDidTouch {
  if ([ScreenRotateManager isOrientationLandscape]) {
    [ScreenRotateManager forceOrientation:UIInterfaceOrientationPortrait];
    _lastOrientaion = [UIApplication sharedApplication].statusBarOrientation;
    [self prepareForSmallScreen];
  }else {
    
    [ScreenRotateManager forceOrientation:UIInterfaceOrientationLandscapeRight];
    
    [self prepareForFullScreen];
  }
}


- (void)prepareForFullScreen {
  
  [_player setScalingMode:IJKMPMovieScalingModeAspectFit];
  [_playerControl.fullScreenBut setTitle:@"缩" forState:UIControlStateNormal];
  self.frame = [[UIScreen mainScreen] bounds];
  _playerView.frame = self.frame;
  _playerView.autoresizingMask = UIViewAutoresizingFlexibleWidth & UIViewAutoresizingFlexibleHeight;
}

- (void)prepareForSmallScreen {
  [_player setScalingMode:IJKMPMovieScalingModeAspectFit];
  self.frame = CGRectMake(0, 64, smallFrame.size.width, smallFrame.size.height);
  _playerView.frame = CGRectMake(0, 0, smallFrame.size.width, smallFrame.size.height);
  [_playerControl.fullScreenBut setTitle:@"全" forState:UIControlStateNormal];
}

@end
