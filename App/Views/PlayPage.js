/**
 * Created by jiangzhenhua on 2017/1/9.
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
    Platform,
} from "react-native";

import VideoRoom from './VideoRoom'
import {Navibarheight} from "../Model/Constants";
const screenWidth = Dimensions.get('window').width;
import LoadingView from '../Component/LoadingView'
import {fetchPlayURL} from '../Model/VideoModel'

import ScrollableTabView, {DefaultTabBar} from "react-native-scrollable-tab-view";

export default class PlayPage extends React.Component {

    constructor(props){
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            vid:this.props.vid,
            playInfo:null,
            dataSource:ds
        };
        this.recommendList = null;
        this.renderRecommendItem = this.renderRecommendItem.bind(this);
    }

    componentDidMount(){
        InteractionManager.runAfterInteractions(()=>{
            fetchPlayURL(this.state.vid)
                .then((json)=>{
                    this.setState({
                        playInfo:json
                    })
                })
                .catch((e)=>{
                    console.log(e);
                })
        })
    }

    //返回
    goBack() {
        const { navigator } = this.props;
        if(navigator) {
            navigator.pop();
            VideoRoom.onDismiss();
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
                        style={{
                            bottom:0,
                            marginLeft:8,
                            marginBottom:6
                        }}
                        source={require('../Img/night_icon_back@2x.png')}
                    />
                </TouchableWithoutFeedback>
            </View>);
    }

    renderRecommendItem(item){

    }

    render(){
        return(
            <View style={styles.container}>
                {this.renderNaivBar()}
                {!this.state.playInfo ? <LoadingView/> :
                    <View>
                        <VideoRoom playURL={this.state.playInfo['mp4_url']} style={styles.playerBlock} coverImg={this.state.playInfo['cover']}/>
                        <View style={{flexDirection:'column', padding:10, borderBottomWidth:0.6, borderColor:'#D3D3D3'}}>
                            <Text style={{fontSize:15}}>
                                {this.state.playInfo.title}
                            </Text>
                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <Text style={{color:'gray',fontSize:12, marginTop:5}}>
                                    {this.state.playInfo['videotype']}
                                </Text>
                                <View style={{marginTop:5, flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                                    <Image
                                        style={{width:12,height:12}}
                                        resizeMode={'cover'}
                                        source={require('../Img/Video/clock.png')}/>
                                    <Text style={{color:'gray',fontSize:12, marginLeft:4}}>{this.state.playInfo['length']}</Text>
                                </View>
                            </View>
                        </View>
                        <ScrollableTabView
                            locked={false}
                            scrollWithoutAnimation={false}
                            tabBarPosition={'top'}
                            tabBarBackgroundColor="#fcfcfc"
                            tabBarActiveTextColor="red"
                            tabBarInactiveTextColor="#aaaaaa"
                            tabBarUnderlineStyle={{backgroundColor:'red',height:2}}
                            renderTabBar={()=> <DefaultTabBar/> }
                        >
                            <View tabLabel='推荐' style={{flex:1}}>
                                {!this.recommendList ? <LoadingView/>:
                                <ListView
                                    dataSource={dataSource}
                                    style={styles.listView}
                                    renderRow={this.renderRecommendItem}
                                    enableEmptySections={true}
                                    renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
                                />}
                            </View>
                            <View tabLabel='跟帖'>
                                <Text>2</Text>
                            </View>
                        </ScrollableTabView>
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent:'flex-start',
        alignItems:'center',
        flexDirection:'column'
    },

    playerBlock:{
        width:screenWidth,
        height:200,
        marginLeft:2
    },

    navibar: {
        height: Navibarheight,
        width:screenWidth,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingTop: Platform.OS === 'ios' ? 10 : 0,
        backgroundColor:'red'
    },

    listView: {
        backgroundColor: '#eeeeec'
    },

});