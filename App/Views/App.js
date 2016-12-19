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
    Navigator
} from "react-native";
//iOS和安卓通用的ViewPager/Tabbar
import ScrollableTabView, {ScrollableTabBar} from "react-native-scrollable-tab-view";
//详情页
import NewsDetail from "./NewsDetail";

class App extends React.Component {

    constructor(props){
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            ds,
            labels: [
                {
                    title: '头条',
                    urlString: 'headline/T1348647853363',
                    replyUrl: '3g_bbs',
                    page: 0
                },
                {
                    title: 'NBA',
                    urlString: 'list/T1348649145984',
                    replyUrl: 'sports_nba_bbs',
                    page: 0
                },
                {
                    title: '手机',
                    urlString: 'list/T1348649654285',
                    replyUrl: 'mobile_bbs',
                    page: 0
                },
                {
                    title: '移动互联',
                    urlString: 'list/T1351233117091',
                    replyUrl: 'mobile_bbs',
                    page: 0
                },
                {
                    title: '娱乐',
                    urlString: 'list/T1348648517839',
                    replyUrl: 'auto_bbs',
                    page: 0
                },
                {
                    title: '时尚',
                    urlString: 'list/T1348650593803',
                    replyUrl: 'lady_bbs',
                    page: 0
                },
                {
                    title: '电影',
                    urlString: 'list/T1348648650048',
                    replyUrl: 'ent2_bbs',
                    page: 0
                },
                {
                    title: '科技',
                    urlString: 'list/T1348649580692',
                    replyUrl: 'tech_bbs',
                    page: 0
                }
            ],
            page:'second'
        };

        this.typeList = {};
        //要这样绑定一下
        this.renderItem = this.renderItem.bind(this);
    }

    componentDidMount() {

        InteractionManager.runAfterInteractions(()=>{
            console.log('Request Data!!!!');
            //预请求所有标签数据
            //注意：这里要通过并发来发请求,否则会由于管道复用的原因，导致部分请求没有响应（猜测）
            Promise.all(this.state.labels.map(label => fetch('http://c.m.163.com//nc/article/' + label.urlString + '/0-20.html')
                .then(resp => this.parseJSON(resp))
                .then(respData => {
                    for (let key in respData) {
                        this.typeList[label.title] = respData[key];
                    }
                }))
            ).catch(error => {
                console.error(error);
            })
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


    getNewsList(label) {//获取新闻网络请求
        let URL = 'http://c.m.163.com//nc/article/' + label.urlString + '/0-20.html';
        return new fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((response)=>{
                return this.parseJSON(response);
            })
            .then((responseData)=>{
                for(let key in responseData) {
                    this.typeList[label.title] = responseData[key];
                }
            })
            .catch((error) => {
                console.error(error);
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
                        this.setState({
                           ds: this.state.ds.cloneWithRows(this.typeList[key]?this.typeList[key]:[])
                        });
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

    renderContent(dataSource, label) {//列表页渲染
        if (typeof dataSource === 'undefined' || dataSource.length === 0) {
            return (
                <View>
                    <Text>无数据！！！！</Text>
                </View>
            );
        } else {
            return (
                <ListView
                    dataSource={dataSource}
                    style={styles.listView}
                    renderRow={this.renderItem}
                    renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
                    refreshControl={
                      <RefreshControl
                        style={styles.refreshControlBase}
                        refreshing={false}
                        onRefresh={() => this.onRefresh(label)}
                        title="Loading..."
                        colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
                      />
                    }
                />
            );
        }

    }

    onRefresh(label) {
        console.log(label.title)
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
    }
});

export default App;