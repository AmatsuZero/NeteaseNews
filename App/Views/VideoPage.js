/**
 * Created by jiangzhenhua on 2017/1/6.
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
    RefreshControl,
    Navigator,
    ScrollView,
    ActivityIndicator,
    TouchableWithoutFeedback,
    Modal,
    Animated,
    InteractionManager,
    Dimensions,
    Platform
} from "react-native";

const screenWidth = Dimensions.get('window').width;

import {VideoModel, getVideoList} from '../Model/VideoModel'
import PlayPage from './PlayPage'
import {Navibarheight} from "../Model/Constants";

export default class VideoPage extends React.Component {

    constructor(props){
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource:ds,
            isLoading:true
        }
        this.renderItem = this.renderItem.bind(this);
        this.source = null;
    }

    componentDidMount(){
        InteractionManager.runAfterInteractions(()=>{
            getVideoList()
                .then((dataList)=>{
                    this.source = dataList;
                    this.setState({
                        dataSource:this.state.dataSource.cloneWithRows(dataList),
                        isLoading:false
                    })
                })
                .catch((e)=>{
                    console.log(e);
                })
        })
    }

    //下拉刷新
    onRefresh(label) {

    }

    //跳转到视频播放页
    toPlayPage(url){
        const { navigator } = this.props;
        //这里传递了navigator作为props
        if(navigator) {
            navigator.push({
                name: '播放',
                component: PlayPage,
                params: {
                    playURL:url
                }
            })
        }
    }

    renderItem(video:VideoModel){
        return(
            <TouchableOpacity
                onPress={()=>{
                    this.toPlayPage(video.url);
                }}
                style={styles.cellStyle}>
                <Image
                    style={styles.cellImg}
                    source={{uri:video.img}}
                    resizeMode={'stretch'}
                >
                    <Image
                        resizeMode={'center'}
                        source={require('../Img/play_btn.png')}
                    />
                    <Text style={styles.cellText}>
                        {video.title}
                    </Text>
                    <View style={{flexDirection:'row',justifyContent:'space-between', marginLeft:15, marginBottom:10, width:screenWidth - 20, flexShrink:1}}>
                        <Text style={{marginTop:8, backgroundColor:'transparent', color:'rgba(135,135,135,1)'}}>
                            {video.sname}
                        </Text>
                        <Text style={{marginTop:8, backgroundColor:'transparent', color:'rgba(135,135,135,1)', marginRight:30 + 20}}>
                            {video.comment.vote}
                        </Text>
                    </View>
                </Image>
            </TouchableOpacity>
        )
    }

    textReminder(isLoading) {
        let text = "";
        if (!isLoading) {
            text = "目前没有数据，请下拉刷新";
        }
        return (
            <Text style={{ fontSize: 16, color:'white' }}>
                {text}
            </Text>);
    }

    renderNaivBar() {
        return (
            <View style={styles.navibar}>
                <Text style={{flex:1,textAlign:'center',color:'white', fontSize:16, letterSpacing:5}}>
                    视频
                </Text>
            </View>);
    }

    render(){
        return this.source ?
            (
                <View style={styles.container}>
                    {this.renderNaivBar()}
                    <ListView
                        initialListSize={1}
                        dataSource={this.state.dataSource}
                        style={styles.listView}
                        renderRow={this.renderItem}
                        enableEmptySections={true}
                        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
                        refreshControl={
                      <RefreshControl
                        style={styles.refreshControlBase}
                        refreshing={false}
                        onRefresh={() => {
                            this.onRefresh()
                        }}
                        title="刷新中，请稍后..."
                        colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
                      />
                    }
                    />
                </View>
            )
            :
            (
                <View style={{flex:1,backgroundColor:'#eeeeec'}}>
                    {this.renderNaivBar()}
                    <ScrollView
                        automaticallyAdjustContentInsets={false}
                        horizontal={false}
                        contentContainerStyle={styles.no_data}
                        style={styles.base}
                        refreshControl={
                    <RefreshControl
                      style={styles.refreshControlBase}
                      refreshing={this.state.isLoading}
                      onRefresh={() => {
                        this.onRefresh(this.state.isLoading)
                      }}
                      title="刷新中，请稍后……"
                      colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
                    />
                  }
                    >
                        <View style={{ alignItems: 'center',backgroundColor:'#D3D3D3' }}>
                            {this.textReminder(this.state.isLoading)}
                            <Image
                                source={require('../Img/background@2x.png')}
                            >
                            </Image>
                        </View>
                    </ScrollView>
                </View>
            );
    };
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent:'center',
        alignItems:'center'
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

    no_data: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100
    },

    cellStyle:{
        height:240,
        flexDirection:'column',
        backgroundColor:'#eeeeec',
        justifyContent:'center',
        paddingVertical:10
    },

    cellImg:{
        flex:1,
        marginHorizontal:18,
        flexDirection:'column',
        justifyContent:'flex-end',
        alignItems:'flex-start'
    },
    cellText:{
        backgroundColor:'transparent',
        color:'white',
        marginLeft:15,
        fontSize:17,
        fontWeight:'bold'
    },

    navibar: {
        height: Navibarheight,
        backgroundColor: 'red',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 10 : 0
    },
});

