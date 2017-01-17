//
//  IJKPlayerViewDefine.h
//  IJKMediaDemo
//
//  Created by Henray Luo on 2017/1/13.
//  Copyright © 2017年 bilibili. All rights reserved.
//

#ifndef IJKPlayerViewDefine_h
#define IJKPlayerViewDefine_h

#ifdef DEBUG
#define NSLog(format, ...) printf("\n[%s] %s [第%d行] %s\n", __TIME__, __FUNCTION__, __LINE__, [[NSString stringWithFormat:format, ## __VA_ARGS__] UTF8String]);
#else
#define NSLog(format, ...)
#endif

#define IJKScreenWidth                         [[UIScreen mainScreen] bounds].size.width
#define IJKScreenHeight                        [[UIScreen mainScreen] bounds].size.height

#define IJKPlayerSrcName(file)               [@"IJKPlayerView.bundle" stringByAppendingPathComponent:file]
#define IJKPlayerImage(file)                 [UIImage imageNamed:IJKPlayerSrcName(file)]

#endif /* IJKPlayerViewDefine_h */
