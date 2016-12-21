/**
 * Created by jiangzhenhua on 2016/12/20.
 */
import React from "react";
import {
    StyleSheet,
    Text,
    View,
    ListView,
    Image,
    RecyclerViewBackedScrollView,
    InteractionManager,
    Platform,
    Navigator,
    ScrollView,
    TouchableWithoutFeedback,
    Dimensions,
} from "react-native";

import {Navibarheight, DefaultTimeout} from "../Model/Constants";
import {parseJSON, cancellableFetch} from "../Util/NetworkUtil";
import ReplyModel from "../Model/ReplyModel";

let backArrow = require('../Img/night_icon_back@2x.png');
let replyImg = require('../Img/contentview_commentbacky@2x.png');
let profile = require('../Img/comment_profile_mars@2x.png');
let proThumb = require('../Img/night_contentview_pkbutton@2x.png');

let source = {
    "hotPosts": [],//热门评论
    "normalPosts": []//普通评论
};

export default class Reply extends React.Component {

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2
        });
        this.state = {
            dataSource: ds,
            boardid: '',
            docid: '',
            postid: null,
            hotRelies: [],
        };

        this.renderItem = this.renderItem.bind(this);
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                boardid: this.props.boardid,
                docid: this.props.docid,
                postid: this.props.postid,
                hotRelies: this.props.hotRelies
            });
            source["hotPosts"] = this.state.hotRelies;
            this.getCommentsList();
        });
    }

    //返回
    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            //很熟悉吧，入栈出栈~ 把当前的页面pop掉，这里就返回到列表了
            navigator.pop();
        }
    }

    //导航栏
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
            </View>);
    }

    getCommentsList() {

        //拼接URL，图片详情和普通详情是不一样的
        let URL = 'http://comment.api.163.com/api/json/post/list/new/normal/' + this.state.boardid + '/' + (this.state.postid ? this.state.postid : this.state.docid ) + '/desc/0/10/10/2/2';

        return cancellableFetch(fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }), DefaultTimeout)
            .then((response) => {
                if (response.ok) {
                    return parseJSON(response);
                } else {
                    return {};
                }
            })
            .then((responseData) => {
                if (Object.keys(responseData).length === 0) {//返回数据为空
                    throw "返回数据为空！";
                } else {

                    let np = responseData["newPosts"];//取出普通评论
                    if (np && np.length > 0) {
                        for (let comment of np) {
                            let model = comment["1"];
                            source["normalPosts"].push(ReplyModel.createNormalModel(model))
                        }
                    }
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRowsAndSections(source)
                    })
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    renderItem(reply) {
        if (reply) {
            return (
                <View style={styles.cellContainer}>
                    <Image
                        style={{
                            marginTop:10,
                            marginLeft:10,
                            marginRight:10,
                            resizeMode:'cover',
                            height:30,
                            width:30,
                            borderRadius:15
                        }}
                        source={ reply.icon ? { uri:reply.icon} : profile}
                    />
                    <View style={{
                        flex:1,
                        flexDirection:'column',
                        justifyContent: 'flex-end'
                }}>
                        <View style={{
                            flexDirection:'row',
                            justifyContent: 'space-between',
                            alignItems:'flex-start'
                        }}>
                            <View style={{
                                flex:1,
                                flexDirection:'column',
                                paddingBottom:10,
                                paddingTop:10
                                }}>
                                <Text
                                    adjustsFontSizeToFit={true}
                                    style={{fontSize:14, color:'#1e90ff'}}
                                    numberOfLines={1}
                                >
                                    {reply.name}
                                </Text>
                                <Text
                                    adjustsFontSizeToFit={true}
                                    numberOfLines={1}
                                    style={{fontSize:10, color:'#a9a9a9'}}>
                                    {reply.address}
                                </Text>
                            </View>
                            <View style={{
                                flex:0,
                                flexDirection:'row',
                                marginRight:4,
                                paddingTop:10
                            }}>
                                <Text
                                    numberOfLines={1}
                                    style={{fontSize:14, color:'#a9a9a9'}}>
                                    {reply.suppose}
                                </Text>
                                <Image
                                    style={{
                                        marginLeft:4
                                    }}
                                    source={proThumb}
                                />
                            </View>
                        </View>
                        <Text
                            style={{
                                flex:1,
                                flexGrow:1,//解决横竖屏切换是文本内容
                                fontSize:18,
                                textAlign:'left',
                                color:'black',
                                marginBottom:15,
                                flexWrap:'wrap'
                            }}>
                            {reply.say}
                        </Text>
                    </View>
                </View>
            );
        } else {
            return (
                <View>
                    <Text>
                        加载中.....
                    </Text>
                </View>
            );
        }
    }

    renderSectionHeader(sectionHeader) {

        let display = '';
        if (sectionHeader === 'hotPosts') {
            display = '热门回复';
        } else {
            display = '最新回复';
        }

        return (
            <Image
                style={{
                    width:50,
                    marginTop:6,
                    justifyContent: 'center',
                    alignItems: 'center',
                    resizeMode: 'stretch'
                }}
                source={replyImg}
            >
                <Text style={{
                    fontSize: 10,
                    textAlign: 'auto',
                    color:'white',
                    backgroundColor:'transparent'
                }}>
                    {display}
                </Text>
            </Image>);
    }

    shouldComponentUpdate() {
        return true;
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderNaivBar()}
                <ListView
                    initialListSize={2}
                    enableEmptySections={true}
                    dataSource={this.state.dataSource}
                    style={styles.listView}
                    renderSectionHeader={(sectionData, sectionID) => this.renderSectionHeader(sectionID)}
                    renderRow={this.renderItem}
                    renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
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

    cellContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fcfcfc',
        borderBottomColor: '#ddd',
        borderBottomWidth: 1
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