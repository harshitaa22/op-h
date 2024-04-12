import React, { Component } from 'react'
import { Modal, StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import { Fonts } from '../../../../../components/src/Utils/Fonts'
import { deviceHeight, deviceWidth, scaledSize } from '../../../../../framework/src/Utilities'
import colors from '../../../../PushNotifications/src/colors'
// import {BlurView} from '@react-native-community/blur'
import Entypo from 'react-native-vector-icons/Entypo'
import Toast from 'react-native-toast-message'
import { configJSON } from '../../PollingController'
type MyProps = {
    visible: boolean,
    onCancel: any;
    onPress: any;
    isLoading: any;
    title: string;
    text1?: string;
    text2?: string;
}
export class ConformationModal extends Component<MyProps> {
    state = {
        agreeTemrs: true
    }
    render() {
        return (
            <Modal
                onRequestClose={() => {
                    if (!this.props.isLoading) {
                        this.setState({ agreeTemrs: false })
                        this.props.onCancel()
                    }
                }}
                visible={this.props.visible}
                animationType='slide'
                transparent={true}>
                {/* <BlurView /> */}


                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={() => {
                        if (!this.props.isLoading) {
                            this.setState({ agreeTemrs: false })
                            this.props.onCancel()
                        }
                    }}>
                        <View style={styles.background} />
                    </TouchableWithoutFeedback>
                    <View style={styles.contentContainer}>

                        <Text style={[styles.fontFamilyMedium, { textAlign: 'center', marginBottom: scaledSize(20) }]}>
                            {this.props.title}
                        </Text>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                disabled={this.props.isLoading}
                                onPress={() => {
                                    this.setState({ agreeTemrs: false })
                                    this.props.onCancel()
                                }}
                                style={[styles.button, { marginRight: scaledSize(10), borderWidth: 1, borderColor: colors.blue }]}>
                                {
                                    <Text style={[styles.fontFamilyBold, { color: colors.blue, fontSize: scaledSize(13) }]}>{this.props.text1 ? this.props.text1 : configJSON.back}</Text>}

                            </TouchableOpacity>
                            <TouchableOpacity
                                disabled={this.props.isLoading}
                                onPress={() => {
                                    if (this.state.agreeTemrs) {
                                        this.props.onPress()
                                        return
                                    }
                                    Toast.show({
                                        type: 'success',
                                        text1: 'Please agree to the T&C',
                                    });
                                }}
                                style={[styles.button, { backgroundColor: colors.blue }]}>
                                {this.props.isLoading ? <ActivityIndicator color={colors.white} /> : <Text style={[styles.fontFamilyBold, { color: colors.white, fontSize: scaledSize(13) }]}>{this.props.text2 ? this.props.text2 : configJSON.continue}</Text>}

                            </TouchableOpacity>

                        </View>
                        <View style={styles.termsContainer}>
                            <TouchableOpacity
                                onPress={() => { this.setState({ agreeTemrs: !this.state.agreeTemrs }) }}
                                activeOpacity={0.9} style={!this.state.agreeTemrs ? styles.inactiveCheckBox : styles.activeCheckBox}>
                                {this.state.agreeTemrs && <Entypo name='check' size={scaledSize(12)} color={colors.white} />}
                            </TouchableOpacity>
                            <Text style={styles.terms}>{configJSON.termsAndCondition}</Text>
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
        alignItems: 'center'
    },
    background: {
        backgroundColor: colors.black,
        position: 'absolute',
        height: deviceHeight,
        width: deviceWidth,
        opacity: 0.5
    },
    contentContainer: {
        backgroundColor: colors.white,
        width: deviceWidth - scaledSize(40),
        borderRadius: scaledSize(10),
        // justifyContent:'center',
        paddingHorizontal: scaledSize(20),
        paddingVertical: scaledSize(20),
        alignItems: 'center'
    },
    button: {
        // backgroundColor:'red',
        width: "48%",
        height: scaledSize(35),
        borderRadius: scaledSize(10),
        // borderWidth: 1,
        // borderColor: colors.blue,
        justifyContent: 'center',
        alignItems: 'center'
    },

    fontFamilyBold: {
        fontFamily: Fonts.LIGHT_BOLD,
    },

    fontFamilyMedium: {
        fontFamily: Fonts.MEDIUM,
    },
    terms: {
        fontSize: scaledSize(10),
        lineHeight: scaledSize(12),
        color: colors.gray,
        fontFamily: Fonts.REGULAR,
    },
    termsContainer: {
        flexDirection: 'row',
        marginTop: scaledSize(10),
        paddingHorizontal: scaledSize(10),
        alignItems: 'center'
    },
    inactiveCheckBox: {
        height: scaledSize(15),
        width: scaledSize(15),
        backgroundColor: colors.lightGray,
        marginRight: scaledSize(10),
        borderRadius: scaledSize(4)
    },
    activeCheckBox: {
        height: scaledSize(15),
        width: scaledSize(15),
        backgroundColor: colors.blue,
        marginRight: scaledSize(10),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: scaledSize(4)
    }

})

export default ConformationModal

