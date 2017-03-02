//
//  DJFaceRecognizer.m
//  news
//
//  Created by 姜振华 on 2017/2/17.
//  Copyright © 2017年 Facebook. All rights reserved.
//
#ifdef __cplusplus
#import <opencv2/opencv.hpp>
#endif

#import "DJFaceRecognizer.h"
#import "UIImage+OpenCV.h"

using namespace cv;

@interface DJFaceRecognizer () {
  Ptr<FaceRecognizer> _faceClassifier;
}

@property (nonatomic, strong) NSMutableDictionary *labelsDictionary;

@end

@implementation DJFaceRecognizer

+ (DJFaceRecognizer *)faceRecognizerWithFile:(NSString *)path {
  DJFaceRecognizer *fr = [DJFaceRecognizer new];
  
  fr->_faceClassifier = createLBPHFaceRecognizer();
  
  NSFileManager *fm = [NSFileManager defaultManager];
  if (path && [fm fileExistsAtPath:path isDirectory:nil]) {
    fr->_faceClassifier->load(path.UTF8String);
    
    NSDictionary *unarchivedNames = [NSKeyedUnarchiver
                                     unarchiveObjectWithFile:[path stringByAppendingString:@".names"]];
    
    fr.labelsDictionary = [NSMutableDictionary dictionaryWithDictionary:unarchivedNames];
    
  }
  else {
    fr.labelsDictionary = [NSMutableDictionary dictionary];
    NSLog(@"could not load paramaters file: %@", path);
  }
  
  return fr;
}



- (BOOL)serializeFaceRecognizerParamatersToFile:(NSString *)path {
  
  self->_faceClassifier->save(path.UTF8String);
  
  [NSKeyedArchiver archiveRootObject:_labelsDictionary toFile:[path stringByAppendingString:@".names"]];
  
  return YES;
}


- (NSString *)predict:(UIImage*)img confidence:(double *)confidence {
  
  cv::Mat src = [img cvMatRepresentationGray];
  int label;
  
  self->_faceClassifier->predict(src, label, *confidence);
  
  return _labelsDictionary[@(label)];
}

- (void)updateWithFace:(UIImage *)img name:(NSString *)name {
  cv::Mat src = [img cvMatRepresentationGray];
  
  
  NSSet *keys = [_labelsDictionary keysOfEntriesPassingTest:^BOOL(id key, id obj, BOOL *stop) {
    return ([name isEqual:obj]);
  }];
  
  NSInteger label;
  
  if (keys.count) {
    label = [[keys anyObject] integerValue];
  }
  else {
    label = _labelsDictionary.allKeys.count;
    _labelsDictionary[@(label)] = name;
  }
  
  vector<cv::Mat> images = vector<cv::Mat>();
  images.push_back(src);
  vector<int> labels = vector<int>();
  labels.push_back((int)label);
  
  self->_faceClassifier->update(images, labels);
  [self labels];
}

- (NSArray *)labels {
  cv::Mat labels = _faceClassifier->getMat("labels");
  
  if (labels.total() == 0) {
    return @[];
  }
  else {
    NSMutableArray *mutableArray = [NSMutableArray array];
    for (MatConstIterator_<int> itr = labels.begin<int>(); itr != labels.end<int>(); ++itr ) {
      int lbl = *itr;
      [mutableArray addObject:@(lbl)];
    }
    return [NSArray arrayWithArray:mutableArray];
  }
}

@end
