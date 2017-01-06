/**
 * Created by jiangzhenhua on 2017/1/6.
 */
import React, { Component } from 'react';
import {
    SwitchIOS,
    View,
    Text,
    StyleSheet,
    PixelRatio
} from 'react-native';

import Button from '../Component/Button'

export default class ControlPanel extends Component {
    render() {
        return (
            <View style={styles.controlPanel}>
                <Text style={styles.controlPanelWelcome}>
                    Control Panel
                </Text>
                <Button
                    onPress={() => {
                        this.props.closeDrawer();
                    }}
                    text="Close Drawer"
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: '#B99BC4',
    },
    container: {
        flex: 1,
        backgroundColor: '#C5B9C9',
    },
    controlPanel: {
        flex: 1,
        backgroundColor:'#326945',
    },
    controlPanelText: {
        color:'white',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 25,
    },
    controlPanelWelcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 25,
        color:'white',
        fontWeight:'bold',
    },
    categoryLabel: {
        fontSize: 15,
        textAlign: 'left',
        left: 10,
        padding:10,
        fontWeight:'bold',
    },
    row: {
        flexDirection: 'row',
        backgroundColor:'white',
        borderRadius: 0,
        borderWidth: 0,
        borderTopWidth: 1 / PixelRatio.get(),
        borderColor: '#d6d7da',
        padding:10,
        alignItems: 'center'
    },
    lastRow: {
        flexDirection: 'row',
        backgroundColor:'white',
        borderRadius: 0,
        borderWidth: 0,
        borderTopWidth: 1 / PixelRatio.get(),
        borderBottomWidth: 1 / PixelRatio.get(),
        borderColor: '#d6d7da',
        padding:10,
        alignItems: 'center'
    },
    rowLabel: {
        left:10,
        fontSize:15,
        flex:1,
    },
    rowInput: {
        right:10,
    },
    sliderMetric: {
        right:10,
        width:30,
    },
    slider: {
        width: 150,
        height: 30,
        margin: 10,
    },
    picker: {
        backgroundColor:'white',
        borderRadius: 0,
        borderWidth: 0,
        padding:0,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderTopWidth: 1 / PixelRatio.get(),
        borderColor: '#d6d7da',
    },
    label: {
        fontSize: 20,
        textAlign: 'left',
        margin: 0,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});