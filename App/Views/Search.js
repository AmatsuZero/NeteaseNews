/**
 * Created by jiangzhenhua on 2016/12/22.
 */
import React from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    InteractionManager,
    TouchableOpacity,
    Dimensions,
    Navigator,
    Button,
    TextInput,
    Platform,
    DeviceEventEmitter
} from "react-native";
import {Navibarheight} from "../Model/Constants";

export default class Search extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hotwords: null,
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                hotwords: this.props.hotwords["hotWordList"]
            });
        });
    }

    searchForNews(key) {
        console.log(event.nativeEvent.text);
    }

    //返回
    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            DeviceEventEmitter.emit('showTabbar', true);
            navigator.pop();
        }
    }

    renderNaivBar() {
        return (
            <View style={styles.navibar}>
                <TextInput
                    autoCapitalize="none"
                    style={styles.inputStyle}
                    onSubmitEditing={(event)=>this.searchForNews(event.nativeEvent.text)}
                    returnKeyType='search'
                    placeholder='搜索'
                    placeholderTextColor='gray'
                    clearButtonMode="while-editing"
                    enablesReturnKeyAutomatically={true}
                />
                <Button
                    title="取消"
                    onPress={()=>this.goBack()}
                />
            </View>);
    }

    renderHeader() {

    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderNaivBar()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#F6F6F6'
    },

    navibar: {
        height: Navibarheight,
        backgroundColor: '#EDEDED',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingTop: Platform.OS === 'ios' ? 10 : 0
    },

    inputStyle: {
        height: 28,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 15,
        flex: 1,
        fontSize: 13,
        padding: 4,
        marginTop: Platform.OS === 'ios' ? 10 : 0,
        marginLeft: 10
    }

});