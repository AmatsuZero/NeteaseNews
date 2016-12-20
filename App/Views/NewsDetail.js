/**
 * Created by 振华 on 2016/12/17.
 */
import React from "react";
import {
    View,
    Navigator,
    Text,
    WebView,
    StyleSheet,
    TouchableWithoutFeedback,
    Dimensions,
    Image,
    Platform
} from "react-native";
//加载中
import LoadingView from "../Component/LoadingView";

let Navibarheight = 22 + 30;
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

    //返回
    goBack() {
        const { navigator } = this.props;
        if(navigator) {
            //很熟悉吧，入栈出栈~ 把当前的页面pop掉，这里就返回到列表了
            navigator.pop();
        }
    }

    //评论数
    renderReplyNumber() {

        let replyCount = this.state.replyCount;
        let displayCount = '';

        if (replyCount.isNaN) {
            displayCount = '未知';
        } else {
            //拼接显示字符串
            let count = parseInt(replyCount);
            if (count > 10000) {
                displayCount = (count / 10000).toFixed(1) + "万跟帖";
            } else {
                displayCount = count + "跟帖";
            }
        }

        let width = displayCount.length <= 5 ? 50 : 60;

        return (
            <Image
                style={{
                        bottom:0,
                        width:width,
                        justifyContent: 'center',
                        alignItems: 'center',
                        resizeMode: 'stretch',
                        marginRight:8,
                        marginBottom:6
                    }}
                source={replyImg}>
                <Text
                    numberOfLines={1}
                    style={{
                            fontSize: 8,
                            textAlign: 'auto',
                            color:'white',
                            backgroundColor:'transparent'
                        }}
                >
                    {displayCount}
                </Text>
            </Image>
        );
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
                        style={{
                            bottom:0,
                            marginLeft:8,
                            marginBottom:6
                        }}
                        source={backArrow}
                    />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                    onPress={()=>{
                        console.log('Comment');
                    }}
                >
                    {this.renderReplyNumber()}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingTop: Platform.OS === 'ios' ? 10 : 0
    }
});