import React, { Component } from 'react'
import { Modal, StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
//components
import { Fonts } from '../../../../../components/src/Utils/Fonts'
//framework
import { deviceWidth, scaledSize } from '../../../../../framework/src/Utilities'
//colors
import colors from '../../../../PushNotifications/src/colors'
//controller
import { configJSON } from '../../PollingController'

type MyProps = {
    onCancel: any;
    onDelete: any;
    isLoading: any;

    visible: boolean,
    swap?: boolean

    title: string;
    subTitle?: string;
    text1?: string;
    text2?: string;
}
export class DeletePollModal extends Component<MyProps> {
    render() {
        return (
            <Modal
                onRequestClose={() => {
                    if (!this.props.isLoading) {
                        this.props.onCancel()
                    }
                }}
                visible={this.props.visible}
                animationType='slide'
                transparent={true}>
                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={() => {
                        if (!this.props.isLoading) {
                            this.props.onCancel()
                        }
                    }}>
                        <View style={styles.background} />
                    </TouchableWithoutFeedback>
                    <View style={styles.contentContainer}>
                        <Text style={[styles.fontFamilyBold,
                        { fontSize: scaledSize(16), marginBottom: scaledSize(15), }]}>{this.props.title}</Text>
                        {
                            this.props.subTitle ?
                                <Text style={[styles.fontFamilyMedium, { textAlign: 'center', marginBottom: scaledSize(20) }]}>
                                    {this.props.subTitle}
                                </Text>
                                : null
                        }
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                disabled={this.props.isLoading}
                                onPress={this.props.swap ? this.props.onCancel : this.props.onDelete}
                                style={[styles.button, { marginRight: scaledSize(10) }]}>
                                {this.props.isLoading ? <ActivityIndicator color={colors.blue} /> :
                                    <Text style={[styles.fontFamilyBold, { color: colors.blue, fontSize: scaledSize(15) }]}>{this.props.text1 ? this.props.text1 : configJSON.delete}</Text>}
                            </TouchableOpacity>
                            <TouchableOpacity
                                disabled={this.props.isLoading}
                                onPress={this.props.swap ? this.props.onDelete : this.props.onCancel}
                                style={[styles.button, { backgroundColor: colors.blue }]}>
                                <Text style={[styles.fontFamilyBold, { color: colors.white, fontSize: scaledSize(15) }]}>{this.props.text2 ? this.props.text2 : configJSON.cancel}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    background: {
        backgroundColor: colors.black,
        position: 'absolute',
        height: "100%",
        width: deviceWidth,
        opacity: 0.5
    },
    contentContainer: {
        backgroundColor: colors.white,
        width: deviceWidth - scaledSize(40),
        borderRadius: scaledSize(10),
        paddingHorizontal: scaledSize(20),
        paddingVertical: scaledSize(20),
        alignItems: 'center'
    },
    button: {
        width: "48%",
        height: scaledSize(40),
        borderRadius: scaledSize(10),
        borderWidth: 1,
        borderColor: colors.blue,
        justifyContent: 'center',
        alignItems: 'center'
    },
    fontFamilyRegular: {
        fontFamily: Fonts.REGULAR,
    },
    fontFamilyBold: {
        fontFamily: Fonts.LIGHT_BOLD,
    },
    fontFamilyMedium: {
        fontFamily: Fonts.MEDIUM,
    },
})

export default DeletePollModal

