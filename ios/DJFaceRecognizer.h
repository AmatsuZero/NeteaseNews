//
//  DJFaceRecognizer.h
//  news
//
//  Created by 姜振华 on 2017/2/17.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface DJFaceRecognizer : NSObject

+ (DJFaceRecognizer *)faceRecognizerWithFile:(NSString *)path;

- (BOOL)serializeFaceRecognizerParamatersToFile:(NSString *)path;

- (NSString *)predict:(UIImage*)img confidence:(double *)confidence;

- (void)updateWithFace:(UIImage *)img name:(NSString *)name;

- (NSArray *)labels;

@end
