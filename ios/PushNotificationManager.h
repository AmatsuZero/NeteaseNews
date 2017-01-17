//
//  PushNotificationManager.h
//  news
//
//  Created by 姜振华 on 2017/1/17.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#ifdef NSFoundationVersionNumber_iOS_9_x_Max
#import <UserNotifications/UserNotifications.h>
#endif

@interface PushNotificationManager : NSObject

+(instancetype)defaultManager;

-(void)registerJPushWithLaunchOptions:(NSDictionary*)launchOptions;

-(void)registerDeviceToken:(NSData*)deviceToken;

-(void)didReceiveRemoteNotification:(NSDictionary *)userInfo;

-(void)didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void(^)(UIBackgroundFetchResult))completionHandler;

@end
