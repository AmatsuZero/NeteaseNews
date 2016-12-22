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
    Platform,
    InteractionManager
} from "react-native";
//加载中
import LoadingView from "../Component/LoadingView";
import {parseJSON, cancellableFetch} from "../Util/NetworkUtil";
import {Navibarheight, DefaultTimeout} from "../Model/Constants";
import ReplyModel from "../Model/ReplyModel";
import Reply from "./Reply";
let WebViewHeight = Dimensions.get('window').height - Navibarheight;

const replyImg = require('../Img/contentview_commentbacky@2x.png');
const backArrow = require('../Img/night_icon_back@2x.png');

//热门评论
let hotPosts = [];

export default class NewsDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            url: "about:blank",
            replyCount: 0,
            boardid:'',
            docid:'',
            postid:null
        };
    }

    componentDidMount() {

        InteractionManager.runAfterInteractions(()=>{
            this.setState({
                url: this.props.url,
                replyCount: this.props.replyCount,
                boardid:this.props.boardid,
                docid:this.props.docid,
                postid:this.props.postid
            });

            this.getCommentsList();
        });
    }

    getCommentsList() {

        //拼接URL，图片详情和普通详情是不一样的
        let URL = 'http://comment.api.163.com/api/json/post/list/new/hot/' + this.state.boardid + '/' + (this.state.postid ? this.state.postid : this.state.docid ) + '/0/10/10/2/2';

        return cancellableFetch(fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }), DefaultTimeout)
            .then((response)=>{
                if (response.ok) {
                    return parseJSON(response);
                } else {
                    return {};
                }
            })
            .then((responseData)=>{
                if (Object.keys(responseData).length === 0) {//返回数据为空
                    throw "返回数据为空！";
                } else {
                    let hp = responseData["hotPosts"];//取出热门评论
                    if (hp && hp.length > 0) {
                        for(let comment of hp) {
                            let model = comment["1"];
                            hotPosts.push(ReplyModel.createHotReplyModel(model));
                        }
                    }
                }
            })
            .catch((error) => {
                console.log(error);
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
                       const { navigator } = this.props;
                        //这里传递了navigator作为props
                        if(navigator) {
                            navigator.push({
                                name: '评论',
                                component: Reply,
                                params: {
                                    boardid:this.state.boardid,
                                    docid:this.state.docid,
                                    postid:this.state.postid,
                                    hotRelies:hotPosts
                                }
                            })
                        }
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
                    onShouldStartLoadWithRequest={(req)=>{
                        if(req.url === 'about:blank') {
                            return false;
                        } else {
                            return true;
                        }
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