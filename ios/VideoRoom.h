//
//  VideoRoom.h
//  news
//
//  Created by 姜振华 on 2017/1/7.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <IJKMediaFramework/IJKMediaFramework.h>
#import "PlayerViewControl.h"

@interface VideoRoom : UIView

@property(nonatomic,copy)NSString* playURL;
@property (atomic, retain) id <IJKMediaPlayback> player;
@property (strong, nonatomic) PlayerViewControl *playerControl;
@property (strong, nonatomic) UIView *playerView;

@end
