/**
 * Created by jiangzhenhua on 2016/12/15.
 */
import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ListView,
    Image,
    RecyclerViewBackedScrollView,
    InteractionManager,
    Platform,
    RefreshControl,
    Navigator,
    ScrollView,
    ActivityIndicator
} from "react-native";
//iOS和安卓通用的ViewPager/Tabbar
import ScrollableTabView, {ScrollableTabBar} from "react-native-scrollable-tab-view";
//详情页
import NewsDetail from "./NewsDetail";
//页面数据模型
import LabelModel from "./LabelModel";
//弹窗提示
import {toastShort} from "../Util/ToastUtil";

//是否能加载更多
let canLoadMore;
let loadMoreTime = 0;
let currentLabel;

class App extends React.Component {

    constructor(props){
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            ds,
            labels: [
                new LabelModel('头条', 'headline/T1348647853363', '3g_bbs'),
                new LabelModel('NBA', 'list/T1348649145984', 'sports_nba_bbs'),
                new LabelModel('手机', 'list/T1348649654285', 'mobile_bbs'),
                new LabelModel('移动互联', 'list/T1351233117091', 'mobile_bbs'),
                new LabelModel('娱乐', 'list/T1348648517839', 'auto_bbs'),
                new LabelModel('时尚', 'list/T1348650593803', 'lady_bbs'),
                new LabelModel('电影', 'list/T1348648650048', 'ent2_bbs'),
                new LabelModel('科技', 'list/T1348649580692', 'tech_bbs')]
        };

        this.typeList = {};
        //要这样绑定一下
        this.renderItem = this.renderItem.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        canLoadMore = false;
        //当前页
        currentLabel = this.state.labels[0];
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(()=>{
            this.getNewsList(this.state.labels[0]);
        });
    }

    parseJSON(response) {
        if(response.ok){
            return response.text()
                .then(function (text) {
                    return text ? JSON.parse(text) : {}
                })
        } else {
            return {}
        }
    }

    //自定义Fetch，可以设置超时时间
    _fetch(fetch_promise, timeout) {
        let abort_fn = null;

        //这是一个可以被reject的promise
        let abort_promise = new Promise(function (resolve, reject) {
            abort_fn = function () {
                reject('abort promise');
            };
        });

        //这里使用Promise.race，以最快 resolve 或 reject 的结果来传入后续绑定的回调
        let abortable_promise = Promise.race([
            fetch_promise,
            abort_promise
        ]);

        setTimeout(function () {
            abort_fn();
        }, timeout);

        return abortable_promise;
    }

    getNewsList(label) {//获取新闻网络请求
        let count = 0;
        if (this.typeList[label.title]) {
            count = this.typeList[label.title].length - this.typeList[label.title].length % 10;
        }

        let URL = 'http://c.m.163.com//nc/article/' + label.urlString + '/' + count + '-20.html';
        label.loading = true;
        let isEmpty = !this.typeList[label.title] || this.typeList[label.title].length === 0;

        return this._fetch(fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }), 30000)
            .then((response)=>{
                if (response.ok) {
                    return this.parseJSON(response);
                } else {
                    label.loading = false;
                    return {};
                }
            })
            .then((responseData)=>{
                label.loading = false;
                currentLabel.loadingMore = false;
                if (Object.keys(responseData).length === 0) {//返回数据为空
                    throw "返回数据为空！";
                } else {
                    for (let key in responseData) {
                        if (isEmpty) {
                            this.typeList[label.title] = responseData[key];
                        } else {
                            this.typeList[label.title] = this.typeList[label.title].concat(responseData[key]);
                        }
                    }
                }
                this.setState({
                    ds: this.state.ds.cloneWithRows(this.typeList[label.title])
                });
            })
            .catch((error) => {
                label.loading = false;
                currentLabel.loadingMore = false;
                toastShort(error);
                if (isEmpty) {
                    this.setState({
                        ds: this.state.ds.cloneWithRows([])
                    });
                }
            });
    }

    renderLabelView() {
        let views = [];
        for (let label of this.state.labels) {
            const typeview = (
                <View
                    key={label.title}
                    tabLabel={label.title}
                    style={styles.base}
                >
                    {
                        this.renderContent((this.typeList[label.title] ? this.state.ds.cloneWithRows(this.typeList[label.title]) : []), label)
                    }
                </View>);
            views.push(typeview);
        }
        return views;
    }

    _onPress(article) {
        if (article){
            const { navigator } = this.props;
            console.log("Url: " + article.url);
            //这里传递了navigator作为props
            if(navigator) {
                navigator.push({
                    name: article.title,
                    component: NewsDetail,
                    params: {
                        url: article.url
                    }
                })
            }
        }
    }

    shouldComponentUpdate() {
        return true;
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollableTabView
                    onChangeTab={(lb)=>{
                        let key = lb.ref.props.tabLabel;
                        for(let label of this.state.labels){
                                if(label.title === key){
                                     currentLabel = label;
                                     break;
                                }
                            }
                        if(this.typeList[key]) {
                            this.setState({
                                ds: this.state.ds.cloneWithRows(this.typeList[key]?this.typeList[key]:[])
                            });
                        } else {
                            this.getNewsList(currentLabel);
                        }
                      }
                    }
                    scrollWithoutAnimation={false}
                    tabBarBackgroundColor="#fcfcfc"
                    tabBarUnderlineStyle={styles.tabBarUnderline}
                    tabBarActiveTextColor="red"
                    tabBarInactiveTextColor="#aaaaaa"
                    tabBarPosition={'top'}
                    renderTabBar={() =>
                        <ScrollableTabBar/>
                    }>
                    {
                        this.renderLabelView()
                    }
                </ScrollableTabView>
            </View>
        );
    }

    textReminder(label) {

        let text = "";

        if (!label.loading) {
            text = "目前没有数据，请下拉刷新";
        }

        return (
            <Text style={{ fontSize: 16, color:'white' }}>
                {text}
            </Text>);
    }

    renderContent(dataSource, label) {//列表页渲染
        if (typeof dataSource === 'undefined' || dataSource.length === 0) {
            return (
                <ScrollView
                    automaticallyAdjustContentInsets={false}
                    horizontal={false}
                    contentContainerStyle={styles.no_data}
                    style={styles.base}
                    refreshControl={
                    <RefreshControl
                      style={styles.refreshControlBase}
                      refreshing={label.loading}
                      onRefresh={() => {
                        this.onRefresh(label)
                      }}
                      title="刷新中，请稍后……"
                      colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
                    />
                  }
                >
                    <View style={{ alignItems: 'center',backgroundColor:'#D3D3D3' }}>
                        {this.textReminder(label)}
                        <Image
                            source={require('../Img/background@2x.png')}
                        >
                        </Image>
                    </View>
                </ScrollView>
            );
        } else {
            return (
                <ListView
                    initialListSize={1}
                    dataSource={dataSource}
                    style={styles.listView}
                    onScroll={this.onScroll}
                    renderRow={this.renderItem}
                    enableEmptySections={true}
                    renderFooter={()=>this.renderFooter()}//tableview footer
                    onEndReached={() => this.onEndReached(label)}//在到达列表尾部的时候调用回调函数
                    onEndReachedThreshold={20}//调用onEndReached之前的临界值，单位是像素。
                    renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
                    refreshControl={
                      <RefreshControl
                        style={styles.refreshControlBase}
                        refreshing={label.loading}
                        onRefresh={() => {
                            this.onRefresh(label)
                        }}
                        title="刷新中，请稍后..."
                        colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
                      />
                    }
                />
            );
        }

    }

    onScroll() {
        if (!canLoadMore) {
            canLoadMore = true;
        }
    }

    //下拉刷新
    onRefresh(label) {
        canLoadMore = false;
        this.getNewsList(label);
    }

    //上拉加载
    onEndReached(label) {
        const time = Date.parse(new Date()) / 1000;
        if (canLoadMore && time - loadMoreTime > 1) {
            label.page += 1;
            currentLabel.loadingMore = true;
            this.getNewsList(label);;;;;;;;;;;;;
            canLoadMore = false;
            loadMoreTime = Date.parse(new Date()) / 1000;
        }
    }

    //评论
    renderReplyNumber(replyCount) {

        //拼接显示字符串
        let count = parseInt(replyCount);
        let displayCount = '';
        if (count > 10000) {
            displayCount = (count / 10000).toFixed(1) + "万跟帖";
        } else {
            displayCount = count + "跟帖";
        }

        return(
            <View>
                <Image
                    style={styles.replyImg}
                    source={require('../Img/night_contentcell_comment_border@2x.png')}>
                    <Text
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}
                        style={styles.replyNumber}>
                        {displayCount}
                    </Text>
                </Image>
            </View>
        );
    }

    //图片类型数组
    renderPhotoSet(mainImg,imageSet) {
        let photoSet = [];
        photoSet.push(
            <Image
                key={0}//这里一定要给key值，因为DOM树渲染的原因，参考：http://stackoverflow.com/questions/28329382/understanding-unique-keys-for-array-children-in-react-js
                style={styles.cellPhoto}
                source={{uri:mainImg}}
            />);
        for(let i =0 ; i < imageSet.length; i++) {
            photoSet.push(
                <Image
                    key={i+1}
                    style={styles.cellPhoto}
                    source={{uri:imageSet[i].imgsrc}}
            />);
        }
        return photoSet;
    }

    //单元格
    renderItem(article) {
        if (article.hasHead) {//头条样式
            return (
                <TouchableOpacity onPress={()=>{
                    this._onPress(article);
                }}>
                    <View style={styles.cellHead}>
                        <Image
                            style={styles.cellImgHead}
                            source={{uri:article.imgsrc}}
                        />
                        <Text
                            style={styles.cellHeadLine}>
                            {article.title}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        } else if (article.imgextra) {//图片样式
            return (
                <TouchableOpacity onPress={()=>{
                    this._onPress(article);
                }}>
                    <View style={styles.cellPhotoSet}>
                        <View style={styles.cellUpContent}>
                            <Text style={styles.title}>
                                {article.title}
                            </Text>
                        </View>
                        <View style={styles.cellDownContent}>
                            {this.renderPhotoSet(article.imgsrc, article.imgextra)}
                        </View>
                    </View>
                </TouchableOpacity>
            );
        } else {//普通样式
            return (
                <TouchableOpacity onPress={()=>{
                    this._onPress(article);
                }}>
                    <View style={styles.cellNormal}>
                        <Image
                            style={styles.cellImg}
                            source={{uri:article.imgsrc}}
                        />
                        <View style={styles.cellRightContent}>
                            <Text style={styles.title}>
                                {article.title}
                            </Text>
                            <View style={styles.cellRightBottom} >
                                <Text style={styles.source} >
                                    {article.source}
                                </Text>
                                {this.renderReplyNumber(article.replyCount)}
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }
    }

    renderFooter() {
        if (currentLabel.loadingMore) {
            return (
                <View style={styles.footerContainer}>
                    <ActivityIndicator size="small" color="#3e9ce9"/>
                    <Text style={styles.footerText}>
                        数据加载中……
                    </Text>
                </View>
            );
        }
        return <View />;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: Platform.OS === 'ios' ? 10 : 0
    },

    refreshControlBase: {
        backgroundColor: 'transparent'
    },

    base: {
        flex: 1,
        backgroundColor: '#D3D3D3'
    },

    listView: {
        backgroundColor: '#eeeeec'
    },

    cellNormal: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fcfcfc',
        padding: 10,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1
    },

    cellPhotoSet: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: '#fcfcfc',
        padding: 8,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1
    },

    cellUpContent:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    cellDownContent: {
        paddingVertical:6,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    cellPhoto: {
        flex:1,
        height:100,
        marginHorizontal: 8
    },

    title: {
        fontSize: 18,
        textAlign: 'left',
        color: 'black'
    },

    source: {
        flex: 1,
        fontSize: 14,
        color: '#D3D3D3',
        marginTop: 5,
        marginRight: 5
    },

    cellImg: {
        width: 88,
        height: 66,
        marginRight: 10
    },

    cellRightContent: {
        flex: 1,
        flexDirection: 'column'
    },

    cellRightBottom: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },

    cellHead:{

    },

    cellImgHead:{
        height: 200
    },

    cellHeadLine:{
        fontWeight: 'bold',
        position:'absolute',
        bottom:0,
        color:'white',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },

    reply: {},

    replyImg: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    replyNumber: {
        fontSize: 8,
        textAlign: 'auto',
        color:'black',
    },

    tabBarUnderline: {
        backgroundColor: 'transparent',
        height: 2
    },

    no_data: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100
    },

    footerContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5
    },

});

export default App;