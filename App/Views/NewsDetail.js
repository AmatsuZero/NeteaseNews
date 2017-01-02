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
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions,
    Image,
    Platform,
    InteractionManager,
    ListView,
    RecyclerViewBackedScrollView,
    Modal
} from "react-native";
//加载中
import LoadingView from "../Component/LoadingView";
import {Navibarheight} from "../Model/Constants";
import Reply from "./Reply";
import {getDetail} from "../Model/DetailModel";
import {toastShort} from "../Util/ToastUtil";

const replyImg = require('../Img/contentview_commentbacky@2x.png');
const backArrow = require('../Img/night_icon_back@2x.png');

import LightHouse from "./LightHouse"

export default class NewsDetail extends React.Component {

    constructor(props) {
        super(props);

        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
        });

        this.state = {
            url: "about:blank",
            dataSource: ds,
            replyCount: 0,
            boardid: null,
            docid: null,
            postid: null,
            detail: null,
            shouldChange:false,
            modalVisible:false,
            imgURL:null
        };

        this.renderSectionHeader = this.renderSectionHeader.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this._handleRequest = this._handleRequest.bind(this);
        this.changeContent = this.changeContent.bind(this);
    }

    componentDidMount() {

        InteractionManager.runAfterInteractions(()=>{
            this.setState({
                url: this.props.url,
                replyCount: this.props.replyCount,
                boardid:this.props.boardid,
                docid:this.props.docid,
                postid: this.props.postid,
                modalVisible:false
            });
            getDetail(this.state.docid, this.state.boardid, this.state.postid).then((detail) => {
                this.setState({
                    detail: detail,
                    replyCount: detail.newsdetail.replyCount,
                    dataSource: this.state.dataSource.cloneWithRowsAndSections({
                        "正文": [detail.html],
                        "分享": ["1"],
                        "热门跟帖": detail.replyModels,
                        "相关新闻": detail.similarNews,
                    }),
                })
            }).catch((e) => {
                toastShort(e.toString());
            })
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
        if (!replyCount || replyCount.isNaN) {
            displayCount = '0 回帖';
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
                                    hotRelies:this.state.detail.replyModels
                                }
                            })
                        }
                    }}
                >
                    {this.renderReplyNumber()}
                </TouchableWithoutFeedback>
            </View>);
    }

    _onPressShowMoreComments() {
        const { navigator } = this.props;
        if(navigator) {
            navigator.push({
                name: '评论',
                component: Reply,
                params: {
                    boardid:this.state.boardid,
                    docid:this.state.docid,
                    postid:this.state.postid,
                    hotRelies:this.state.detail.replyModels
                }
            })
        }
    }

    _handleRequest(request) {
        if(request.url.indexOf('sx://') > -1) {
            this.setState({
                modalVisible:true,
                imgURL:request.url
            });
            return false;
        } else {
            return true;
        }
    }

    renderItem(rowData, sectionID, rowID, highlightRow) {
        switch (sectionID) {
            case "正文":
                return (
                    <WebView
                    domStorageEnabled={true}
                    onShouldStartLoadWithRequest={this._handleRequest}
                    automaticallyAdjustContentInsets={false}
                    style={styles.webView}
                    source={{html:rowData}}
                    renderLoading={()=>{return <LoadingView />}}
                />);
            case "热门跟帖": {
                if (rowID == this.state.detail.replyModels.length - 1) {
                    return (
                        <TouchableOpacity onPress={()=>this._onPressShowMoreComments()}>
                            <View style={[styles.sectionHeader,{height:50}]}>
                                <Text style={{fontSize:15, color:'#3C84C3', marginHorizontal:10, textAlign:'center'}}>
                                    显示更多评论
                                </Text>
                            </View>
                        </TouchableOpacity>);
                } else {
                    return (
                        <TouchableOpacity>
                            <View style={styles.hotReply}>
                                <View
                                    style={{flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginTop:20}}>
                                    <View style={{flexDirection:'row', marginHorizontal:10, flexShrink:10}}>
                                        <Image
                                            style={{width:30,height:30, marginHorizontal:10, borderRadius:15}}
                                            source={ rowData.icon ? {uri:rowData.icon} : require('../Img/comment_profile_mars@2x.png')}
                                        />
                                        <View style={{flexDirection:'column', alignItems:'flex-start', flexShrink:5}}>
                                            <Text numberOfLines={1} style={{fontSize:13,color:'#3C84C3'}}>
                                                {rowData.name}
                                            </Text>
                                            <Text numberOfLines={1} style={{fontSize:11,color:'gray'}}>
                                                {this.processAddress(rowData.address) + ' ' + rowData.rtime}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={{fontSize:11,color:'gray', marginRight:10}}>
                                        {rowData.suppose + '顶'}
                                    </Text>
                                </View>
                                <Text
                                    style={{fontSize:15,color:'black', marginTop:7.5, marginBottom:10, marginLeft:60}}>
                                    {rowData.say}
                                </Text>
                            </View>
                        </TouchableOpacity>);
                }
            }
            case "相关新闻": {
                if (rowID == 0) {
                    return (
                        <View>
                            {this.renderKeySearchWord(rowData)}
                        </View>)
                } else {
                    return (
                        <TouchableOpacity onPress={()=>{
                                const { navigator } = this.props;
                                //这里传递了navigator作为props
                                if(navigator) {
                                    navigator.push({
                                        name: rowData.title,
                                        component: NewsDetail,
                                        params: {
                                            docid: rowData.id,
                                        }
                                    })
                                }
                            }}>
                            <View style={styles.simiNews}>
                                <Image
                                    style={{width:80,height:60, margin:10, borderRadius:2}}
                                    source={rowData.imgsrc ? {uri:rowData.imgsrc} : require('../Img/Detail/303.jpg')}
                                />
                                <View
                                    style={{flexDirection:'column', justifyContent:'flex-start', alignItems:'flex-start', marginVertical:10, flexShrink:10}}>
                                    <Text style={{fontSize:15}}>
                                        {rowData.title}
                                    </Text>
                                    <View style={{flexDirection:'row', justifyContent:'flex-start', marginTop:10}}>
                                        <Text style={{fontSize:11, color:'gray'}}>
                                            {rowData.source}
                                        </Text>
                                        <Text style={{fontSize:11,marginLeft:10, color:'gray'}}>
                                            {rowData.ptime}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                }
            }
            case "分享": {
                return <Image
                    style={{height:130, width:Dimensions.get('window').width}}
                    resizeMode={'contain'}
                    source={require('../Img/Detail/news_share.png')}
                />
            }
        }
    }

    renderKeySearchWord(keyword) {
        console.log(keyword);
    }

    processAddress(address) {
        let index = address.indexOf('&');
        if (index !== -1) {
            return address.substring(0, index);
        } else {
            return address;
        }
    }

    renderSectionHeader(sectionData, sectionID) {
        switch (sectionID) {
            case "相关新闻":
                return (
                    <View style={[{height:sectionData.length > 0 ? 40 : 0}, styles.sectionHeader]}>
                        <Text style={styles.sectionText}>{sectionID}</Text>
                    </View>);
            case "热门跟帖":
                return (
                    <View style={[{height:sectionData.length > 0 ? 40 : 0}, styles.sectionHeader]}>
                        <Text style={styles.sectionText}>{sectionID}</Text>
                    </View>);
            default:
                return <View/>;
        }
    }

    renderFooter() {
        return (
            <View
                style={{flexDirection:'row', justifyContent:'center', alignItems:'center', height:64, borderColor: '#eeeeec'}}>
                <Image
                    style={{width:26, height:26}}
                    source={!this.state.shouldChange ? require('../Img/Detail/newscontent_drag_arrow@2x.png') : require('../Img/Detail/newscontent_drag_return@2x.png')}
                />
                <Text style={{fontSize:15,color:'gray', marginLeft:10}}>
                    上拉关闭当前页
                </Text>
            </View>)
    }

    changeContent(event) {
        let contentOffSetY = event.nativeEvent.contentOffset.y;
        let totalHeight = event.nativeEvent.contentSize.height;
        if(contentOffSetY > totalHeight - 400) {
            this.setState({
                shouldChange:true
            })
        } else {
            this.setState({
                shouldChange:false
            })
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderNaivBar()}
                <Modal
                    onRequestClose={()=>{ this.setState({modalVisible:false})}}//Necessary for Android
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.modalVisible}
                >
                    <LightHouse customURL={this.state.imgURL} style={{width:300,height:400}}/>
                </Modal>
                {!this.state.dataSource.sectionIdentities.length > 0 ?
                    <LoadingView/> :
                    <ListView
                        style={styles.listView}
                        initialListSize={3}
                        dataSource={this.state.dataSource}
                        enableEmptySections={true}
                        renderRow={this.renderItem}
                        renderSectionHeader={this.renderSectionHeader}
                        renderFooter={()=>this.renderFooter()}
                        onScroll={this.changeContent}
                        scrollEventThrottle={10}
                        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
                    />}
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
        width: Dimensions.get('window').width,
        height: 700
    },

    navibar: {
        height: Navibarheight,
        backgroundColor: '#D3D3D3',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingTop: Platform.OS === 'ios' ? 10 : 0
    },

    listView: {
        backgroundColor: '#eeeeec'
    },

    sectionHeader: {
        borderColor: '#eeeeec',
        backgroundColor: 'white',
        justifyContent: 'center',
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5
    },

    sectionText: {
        color: 'red',
        fontSize: 14,
        marginHorizontal: 10
    },

    hotReply: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
        borderColor: '#eeeeec',
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5
    },

    simiNews: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderColor: '#eeeeec',
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        backgroundColor: 'white'
    }
});