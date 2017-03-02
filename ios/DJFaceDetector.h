//
//  DJFaceDetector.h
//  news
//
//  Created by 姜振华 on 2017/2/17.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <opencv2/highgui/cap_ios.h>

@interface DJFaceDetector : NSObject<CvVideoCameraDelegate>

@property (nonatomic, strong) CvVideoCamera* videoCamera;

- (instancetype)initWithCameraView:(UIImageView *)view scale:(CGFloat)scale;

- (void)startCapture;
- (void)stopCapture;

- (NSArray *)detectedFaces;
- (UIImage *)faceWithIndex:(NSInteger)idx;

@end
