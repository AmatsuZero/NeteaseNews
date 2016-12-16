/**
 * Created by jiangzhenhua on 2016/12/15.
 */
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ListView,
    Image,
    RecyclerViewBackedScrollView,
    InteractionManager
} from 'react-native';

class App extends React.Component {

    constructor(props){
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            ds,
        };
        this._data = [];
        //要这样绑定一下
        this.onPress = this.onPress.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(()=>{
            this.getNewsList();
        });
    }

    getNewsList() {
        fetch('http://c.m.163.com//nc/article/headline/T1348647853363/0-20.html')
            .then((response)=>{
                return response.json()
            })
            .then((responseData)=>{
                for(let key in responseData) {
                    this._data = responseData[key];
                    this.setState({
                        ds: this.state.ds.cloneWithRows(this._data)
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    onPress(article) {

    }

    render() {
        return (
          this.renderContent(this.state.ds)
        );
    }

    renderContent(dataSource) {
        return (
            <ListView
                dataSource={dataSource}
                style={styles.listView}
                renderRow={this.renderItem}
                renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
            />
        );
    }

    //评论
    renderReplyNumber(replyCount) {
        return(
            <View>
                <Image source={require('../Img/night_contentcell_comment_border@2x.png')}/>
                <Text style={styles.replyNumber}>
                    {replyCount}
                </Text>
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
                <TouchableOpacity onPress={this.onPress(article.url)}>
                    <View style={styles.cellHead}>
                        <Image
                            style={styles.cellImgHead}
                            source={{uri:article.imgsrc}}
                        />
                        <Text style={styles.cellHeadLine}>
                            {article.title}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        } else if (article.imgextra) {//图片样式
            return (
                <TouchableOpacity onPress={this.onPress(article.url)}>
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
                <TouchableOpacity onPress={this.onPress(article.url)}>
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
                                {this.renderReplyNumber(article.replyNumber)}
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
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
        height:180
    },

    cellHeadLine:{
        position:'absolute',
        bottom:0,
        color:'white',
        backgroundColor:'rgba(33,33,33,0.3)',
    },

    replyNumber: {
        fontSize:0,
        position:'absolute',
        color:'black',
        backgroundColor:'rgba(33,33,33,0.3)',
    }
});

export default App;