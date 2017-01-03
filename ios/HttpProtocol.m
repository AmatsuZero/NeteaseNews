//
//  HttpProtocol.m
//  news
//
//  Created by 姜振华 on 2017/1/2.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "HttpProtocol.h"

@interface HttpProtocol ()
<
NSURLSessionDelegate,
NSURLSessionDataDelegate
>

@property(copy, nonatomic) NSURLSession* session;
@property(strong, nonatomic)NSURLSessionDataTask* task;

@end

@implementation HttpProtocol

+ (void)start
{
  [NSURLProtocol registerClass:self];
}

+ (BOOL)canInitWithRequest:(NSURLRequest *)request
{
  if (request
      && ([request.URL.scheme isEqualToString:@"http"] || [request.URL.scheme isEqualToString:@"https"])
      && ([request.URL.pathExtension isEqualToString:@"jpg"] || [request.URL.pathExtension isEqualToString:@"png"] || [request.URL.pathExtension isEqualToString:@"bmp"] || [request.URL.pathExtension isEqualToString:@"gif"] ||
          [request.URL.pathExtension isEqualToString:@"tiff"]|| [request.URL.pathExtension isEqualToString:@"jpeg"]||
          [request.URL.pathExtension isEqualToString:@"JPEG"])) {
        return YES;
      }
  
  return NO;
}

-(NSURLSession *)session {
  if (!_session) {
    NSURLSessionConfiguration* config = [NSURLSessionConfiguration defaultSessionConfiguration];
    config.requestCachePolicy = NSURLRequestUseProtocolCachePolicy;
    _session = [NSURLSession sessionWithConfiguration:config delegate:self delegateQueue:[NSOperationQueue new]];
  }
  return _session;
}

+ (NSURLRequest *)canonicalRequestForRequest:(NSURLRequest *)request
{
  return request;
}

+ (BOOL)requestIsCacheEquivalent:(NSURLRequest *)a toRequest:(NSURLRequest *)b {
  return [super requestIsCacheEquivalent:a toRequest:b];
}

- (id)initWithRequest:(NSURLRequest *)request cachedResponse:(NSCachedURLResponse *)cachedResponse client:(id <NSURLProtocolClient>)client
{
  return [super initWithRequest:request cachedResponse:cachedResponse client:client];
}

- (void)startLoading {
  
  NSURLCache* cache = [NSURLCache sharedURLCache];
  NSCachedURLResponse* cachedResponse = [cache cachedResponseForRequest:self.request];
    if (cachedResponse) {//有缓存,从缓存中加载...
      NSData* data= cachedResponse.data;
      NSString* mimeType = cachedResponse.response.MIMEType;
      NSString* encoding = cachedResponse.response.textEncodingName;
      NSURLResponse* response = [[NSURLResponse alloc]initWithURL:self.request.URL MIMEType:mimeType expectedContentLength:data.length textEncodingName:encoding];
      [self.client URLProtocol:self didReceiveResponse:response cacheStoragePolicy:NSURLCacheStorageNotAllowed];
      [self.client URLProtocol:self didLoadData:data];
      [self.client URLProtocolDidFinishLoading:self];
  } else {
    NSMutableURLRequest* newRequest = [self.request mutableCopy];
    newRequest.cachePolicy = NSURLRequestUseProtocolCachePolicy;
    self.task = [self.session dataTaskWithRequest:newRequest];
    [self.task resume];
  }
}

-(void)stopLoading {
  [self.task cancel];
  self.task = nil;
}


-(void)URLSession:(NSURLSession *)session dataTask:(NSURLSessionDataTask *)dataTask didReceiveResponse:(NSURLResponse *)response completionHandler:(void (^)(NSURLSessionResponseDisposition))completionHandler {
  [self.client URLProtocol:self didReceiveResponse:response cacheStoragePolicy:NSURLCacheStorageAllowed];
  completionHandler(NSURLSessionResponseAllow);
}

-(void)URLSession:(NSURLSession *)session dataTask:(NSURLSessionDataTask *)dataTask didReceiveData:(NSData *)data{
  [self.client URLProtocol:self didLoadData:data];
}

- (void)URLSession:(NSURLSession *)session dataTask:(NSURLSessionDataTask *)dataTask
 willCacheResponse:(NSCachedURLResponse *)proposedResponse
 completionHandler:(void (^)(NSCachedURLResponse * _Nullable cachedResponse))completionHandler{
  completionHandler(proposedResponse);
}

-(void)URLSession:(NSURLSession *)session task:(NSURLSessionTask *)task didCompleteWithError:(NSError *)error{
  if (error) {
    [self.client URLProtocol:self didFailWithError:error];
  } else {
    [self.client URLProtocolDidFinishLoading:self];
  }
}

@end
