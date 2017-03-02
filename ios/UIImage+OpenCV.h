//
//  UIImage+OpenCV.h
//  news
//
//  Created by 姜振华 on 2017/2/17.
//  Copyright © 2017年 Facebook. All rights reserved.
//
#ifdef __cplusplus
#import <opencv2/opencv.hpp>
#endif

#import <UIKit/UIKit.h>

@interface UIImage (OpenCV)

+ (UIImage *)imageFromCVMat:(cv::Mat)mat;

- (cv::Mat)cvMatRepresentationColor;
- (cv::Mat)cvMatRepresentationGray;

@end
