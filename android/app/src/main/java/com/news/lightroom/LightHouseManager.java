package com.news.lightroom;

import android.provider.Settings;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.Log;

import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.image.ReactImageView;

/**
 * Created by jiangzhenhua on 2017/1/19.
 */

public class LightHouseManager extends SimpleViewManager<ReactImageView> {

    private Object mCallerContext=null;

    @Override
    public String getName() {
        return "LightHouse";
    }

    @Override
    protected ReactImageView createViewInstance(ThemedReactContext context) {
        return new ReactImageView(context, Fresco.newDraweeControllerBuilder(), mCallerContext);
    }

    @ReactProp(name="customURL")
    public void setCustomURL(ReactImageView view, @NonNull String customURL){
        String target = "github.com/dsxNiubility?";
        int index = customURL.indexOf(target) + target.length();
        String tail = customURL.substring(index);
        String[] keyValues = tail.split("&");
        System.out.println(keyValues);
    }

    public static void main(String args[]) {
        String testURL = "sx://github.com/dsxNiubility?src=http://cms-bucket.nosdn.127.net/b4276032e5cf4ff6b837017fe45b48ec20170119155702.jpeg&top=113&whscale=1.3333333333333333";
        LightHouseManager mgr = new LightHouseManager();
        mgr.setCustomURL(null,testURL);
    }
}
