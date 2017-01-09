//
//  VideoRoom+Notification.m
//  news
//
//  Created by 姜振华 on 2017/1/9.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "VideoRoom+Notification.h"

@implementation VideoRoom (Notification)

- (void)setupNotification {
  [UIApplication sharedApplication].idleTimerDisabled = YES;
  
  NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
  
  [center addObserver:self
             selector:@selector(__IJKMPMediaPlaybackIsPreparedToPlayDidChangeNotification:)
                 name:IJKMPMediaPlaybackIsPreparedToPlayDidChangeNotification object:nil];
  
  [center addObserver:self
             selector:@selector(__IJKMPMoviePlayerLoadStateDidChangeNotification:)
                 name:IJKMPMoviePlayerLoadStateDidChangeNotification object:nil];
  
  [center addObserver:self
             selector:@selector(__IJKMPMoviePlayerPlaybackDidFinishNotification:)
                 name:IJKMPMoviePlayerPlaybackDidFinishNotification object:nil];
  
  
  [center addObserver:self
             selector:@selector(__screenDidConnectNotification:)
                 name:UIScreenDidConnectNotification object:nil];
  
  
  [center addObserver:self
             selector:@selector(__screenDidDisconnectNotification:)
                 name:UIScreenDidDisconnectNotification object:nil];
}

- (void)removeNotification {
  [[NSNotificationCenter defaultCenter]removeObserver:self];
  [UIApplication sharedApplication].idleTimerDisabled = NO;
}

#pragma mark - Private
- (void)__IJKMPMediaPlaybackIsPreparedToPlayDidChangeNotification:(NSNotification *)sender
{
  [self.player play];
  [self.playerControl refreshPlayerContrl];
}

- (void)__IJKMPMoviePlayerLoadStateDidChangeNotification:(NSNotification *)sender
{
  [self.playerControl refreshPlayerContrl];
}

- (void)__IJKMPMoviePlayerPlaybackDidFinishNotification:(NSNotification *)sender
{
  NSInteger reason =
  [[sender.userInfo valueForKey:IJKMPMoviePlayerPlaybackDidFinishReasonUserInfoKey]integerValue];
  
  if(reason != IJKMPMovieFinishReasonPlaybackEnded)
  {
    [self.playerControl refreshPlayerContrl];
  }
}

- (void)__screenDidConnectNotification:(NSNotification *)sender
{
}

- (void)__screenDidDisconnectNotification:(NSNotification *)sender
{
  
}

@end
