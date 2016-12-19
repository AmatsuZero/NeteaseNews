/**
 * Created by 振华 on 2016/12/17.
 */
import React from "react";
import {View, Navigator, Text, WebView, StyleSheet, TouchableWithoutFeedback, Dimensions, Image} from "react-native";
//加载中
import LoadingView from "../Component/LoadingView";

let Navibarheight = 60;
let WebViewHeight = Dimensions.get('window').height - Navibarheight;

let replyImg = require('../Img/contentview_commentbacky@2x.png');
let backArrow = require('../Img/night_icon_back@2x.png');


export default class NewsDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            url: "https://www.baidu.com",
            replyCount: 0
        };
    }

    componentDidMount() {
        this.setState({
            url: this.props.url,
            replyCount: this.props.replyCount
        });
    }

    shouldComponentUpdate() {
        return true;
    }

    goBack() {
        const { navigator } = this.props;
        if(navigator) {
            //很熟悉吧，入栈出栈~ 把当前的页面pop掉，这里就返回到列表了
            navigator.pop();
        }
    }

    renderNaivBar() {
        return (
            <View style={styles.navibar}>
                <TouchableWithoutFeedback
                    onPress={()=>{
                        this.goBack();
                    }}
                >
                    <Image
                        source={backArrow}
                    />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                    onPress={()=>{
                        console.log('Comment');
                    }}
                >
                    <Image
                        source={replyImg}
                    />
                </TouchableWithoutFeedback>
            </View>);
    }

    renderLoading() {
        return <LoadingView />;
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderNaivBar()}
                <WebView
                    automaticallyAdjustContentInsets={false}
                    style={styles.webView}
                    source={{uri: this.state.url}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    decelerationRate="normal"
                    onNavigationStateChange={()=>{

                    }}
                    startInLoadingState={true}
                    renderLoading={this.renderLoading}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: 'column'
    },

    webView: {
        height: WebViewHeight,
    },

    navibar: {
        height: Navibarheight,
        backgroundColor: '#D3D3D3',
        alignContent: 'space-between'
    }
});