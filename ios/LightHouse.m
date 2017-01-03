//
//  LightHouse.m
//  news
//
//  Created by 姜振华 on 2017/1/2.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "LightHouse.h"

#define SXSCREEN_W [UIScreen mainScreen].bounds.size.width
#define SXSCREEN_H [UIScreen mainScreen].bounds.size.height

@interface LightHouse ()

@property(nonatomic,strong)NSDictionary *temImgPara;
@property(nonatomic,strong)UIImageView* imageView;

@end

@implementation LightHouse

-(void)layoutSubviews {
  CGFloat w = SXSCREEN_W;
  CGFloat h = SXSCREEN_W / [self.temImgPara[@"whscale"] floatValue];
  CGFloat x = 0;
  CGFloat y = (SXSCREEN_H - h)/2;
  self.imageView.frame = CGRectMake(x, y, w, h);
}

-(instancetype)init {
  if (self = [super init]) {
    _imageView = [[UIImageView alloc]init];
    _imageView.contentMode = UIViewContentModeScaleToFill;
    _imageView.userInteractionEnabled = YES;
    [self addSubview:_imageView];
    
    UITapGestureRecognizer* tap = [[UITapGestureRecognizer alloc]initWithTarget:self action:@selector(dismissAction:)];
    [_imageView addGestureRecognizer:tap];
  }
  return self;
}

-(void)setCustomURL:(NSString *)url {
  _customURL = url;
  NSRange range = [url rangeOfString:@"github.com/dsxNiubility?"];
  NSInteger path = range.location + range.length;
  NSString *tail = [url substringFromIndex:path];
  NSArray *keyValues = [tail componentsSeparatedByString:@"&"];
  NSMutableDictionary *parameters = [NSMutableDictionary dictionary];
  for (NSString *str in keyValues) {
    NSArray *keyVaule = [str componentsSeparatedByString:@"="];
    if (keyVaule.count == 2) {
      [parameters setValue:keyVaule[1] forKey:keyVaule[0]];
    }else if (keyValues.count > 2){
      NSRange range = [str rangeOfString:@"src="];
      if (range.location != NSNotFound) {
        NSString *value = [str substringFromIndex:range.length];
        [parameters setValue:value forKey:@"src"];
      }
    }
  }
  self.temImgPara = parameters;
  NSURLCache *cache = [NSURLCache sharedURLCache];
  NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:parameters[@"src"]]];
  NSData *imgData = [cache cachedResponseForRequest:request].data;
  UIImage *image = [UIImage imageWithData:imgData];
  
  self.imageView.image = image;
}

-(void)dismissAction:(UITapGestureRecognizer *)tapGez {
  self.onClick(nil);
}

@end
