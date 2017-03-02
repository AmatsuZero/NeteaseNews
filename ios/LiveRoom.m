//
//  LiveRoom.m
//  news
//
//  Created by 姜振华 on 2017/2/9.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "LiveRoom.h"
#import <AVFoundation/AVFoundation.h>

//导入GPUImage模块
@import GPUImage;

@interface LiveRoom ()<UIGestureRecognizerDelegate>

@property (nonatomic, strong) AVCaptureSession *captureSession;
@property (nonatomic, strong) AVCaptureDeviceInput *currentVideoDeviceInput;

@property (nonatomic, weak) GPUImageBilateralFilter *bilateralFilter;
@property (nonatomic, weak) GPUImageBrightnessFilter *brightnessFilter;
@property (nonatomic, strong) GPUImageVideoCamera *videoCamera;

/**
 捕获音视频
 */
- (void)setupCaputureVideo;


@end

@implementation LiveRoom

-(void)setBrightnessValue:(float)brightnessValue {
  _brightnessFilter.brightness = brightnessValue;
}

-(void)setBilateralValue:(float)bilateralValue {
  CGFloat maxValue = 10;
  [_bilateralFilter setDistanceNormalizationFactor:(maxValue - bilateralValue)];
}

-(instancetype)init {
  if (self = [super init]) {
    self.backgroundColor = [UIColor whiteColor];
  }
  return self;
}


-(void)layoutSubviews {
  [super layoutSubviews];
  [self setupCaputureVideo];
}

- (void)setupCaputureVideo
{
  // 创建视频源
  // SessionPreset:屏幕分辨率，AVCaptureSessionPresetHigh会自适应高分辨率
  // cameraPosition:摄像头方向
  GPUImageVideoCamera *videoCamera = [[GPUImageVideoCamera alloc] initWithSessionPreset:AVCaptureSessionPresetHigh cameraPosition:AVCaptureDevicePositionFront];
  videoCamera.outputImageOrientation = UIInterfaceOrientationPortrait;
  _videoCamera = videoCamera;
  
  //AVCaptureSession Config
  _captureSession = videoCamera.captureSession;
  _currentVideoDeviceInput = [videoCamera valueForKeyPath:@"videoInput"];
  
  // 创建最终预览View
  GPUImageView *captureVideoPreview = [[GPUImageView alloc] initWithFrame:[UIScreen mainScreen].bounds];
  [self insertSubview:captureVideoPreview atIndex:0];
  
  // 创建滤镜：磨皮，美白，组合滤镜
  GPUImageFilterGroup *groupFilter = [[GPUImageFilterGroup alloc] init];
  
  // 磨皮滤镜
  GPUImageBilateralFilter *bilateralFilter = [[GPUImageBilateralFilter alloc] init];
  [groupFilter addTarget:bilateralFilter];
  _bilateralFilter = bilateralFilter;
  
  // 美白滤镜
  GPUImageBrightnessFilter *brightnessFilter = [[GPUImageBrightnessFilter alloc] init];
  [groupFilter addTarget:brightnessFilter];
  _brightnessFilter = brightnessFilter;
  
  // 设置滤镜组链
  [bilateralFilter addTarget:brightnessFilter];
  [groupFilter setInitialFilters:@[bilateralFilter]];
  groupFilter.terminalFilter = brightnessFilter;
  
  // 设置GPUImage响应链，从数据源 => 滤镜 => 最终界面效果
  [videoCamera addTarget:groupFilter];
  [groupFilter addTarget:captureVideoPreview];
  
  // 必须调用startCameraCapture，底层才会把采集到的视频源，渲染到GPUImageView中，就能显示了。
  // 开始采集视频
  [videoCamera startCameraCapture];
}

- (AVCaptureDevice *)getVideoDevice:(AVCaptureDevicePosition)position
{
  NSArray *devices = [AVCaptureDevice devicesWithMediaType:AVMediaTypeVideo];
  for (AVCaptureDevice *device in devices) {
    if (device.position == position) {
      return device;
    }
  }
  return nil;
}

-(void)toggleCapture {
  // 获取当前设备方向
  AVCaptureDevicePosition curPosition = _currentVideoDeviceInput.device.position;
  
  // 获取需要改变的方向
  AVCaptureDevicePosition togglePosition = curPosition == AVCaptureDevicePositionFront?AVCaptureDevicePositionBack:AVCaptureDevicePositionFront;
  
  // 获取改变的摄像头设备
  AVCaptureDevice *toggleDevice = [self getVideoDevice:togglePosition];
  
  // 获取改变的摄像头输入设备
  AVCaptureDeviceInput *toggleDeviceInput = [AVCaptureDeviceInput deviceInputWithDevice:toggleDevice error:nil];
  
  // 移除之前摄像头输入设备
  [_captureSession removeInput:_currentVideoDeviceInput];
  
  // 添加新的摄像头输入设备
  [_captureSession addInput:toggleDeviceInput];
  
  // 记录当前摄像头输入设备
  _currentVideoDeviceInput = toggleDeviceInput;
}

- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event {
  NSLog(@"%@", NSStringFromCGPoint(point));
  return nil;
}

@end
