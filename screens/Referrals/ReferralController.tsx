import React from 'react'
import { BackHandler, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
//assets
import { profile } from '../../assets';
//framework
import { getStorageData, scaledSize, widthFromPercentage } from '../../../../../framework/src/Utilities';
import MessageEnum, { getName } from '../../../../../framework/src/Messages/MessageEnum';
import { runEngine } from '../../../../../framework/src/RunEngine';
import { IBlock } from '../../../../../framework/src/IBlock';
import { Message } from '../../../../../framework/src/Message';
import { BlockComponent } from '../../../../../framework/src/BlockComponent';
//colors
import colors from '../../colors';
//components
import { Fonts } from '../../../../../components/src/Utils/Fonts';

export const configJSON = require("./config.js");

export interface Props {
    navigation: any;
}

interface S {
    referralDetail: any,
    isLoadingNews: boolean,
    isLoading: boolean
}

interface SS {
    id: any;
}

export class ReferralController extends BlockComponent<
    Props,
    S,
    SS
>{
    apiReferral: string = "";
    constructor(props: any) {
        super(props);
        this.receive = this.receive.bind(this);
        this.subScribedMessages = [
            getName(MessageEnum.NavigationPayLoadMessage),
            getName(MessageEnum.RestAPIResponceMessage)
        ];
        runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
        this.state = {
            referralDetail: []
        };
    }

    async receive(from: string, message: Message) {
        if (getName(MessageEnum.NavigationPayLoadMessage) === message.id) { }
        if (getName(MessageEnum.RestAPIResponceMessage) == message.id) {
            const apiRequestCallId = message.getData(
                getName(MessageEnum.RestAPIResponceDataMessage)
            );
            var responseJson = message.getData(
                getName(MessageEnum.RestAPIResponceSuccessMessage)
            );
            if (apiRequestCallId !== null) {
                if (apiRequestCallId == this.apiReferral) {
                    this.setState({ isLoadingNews: false, isLoading: false })
                    if (responseJson && responseJson.error) {
                        return
                    } else {
                        this.setState({ referralDetail: responseJson })
                    }
                }
            }
        }
    }

    async componentDidMount() {
        const token = await getStorageData("Token");
        BackHandler.addEventListener(
            "hardwareBackPress",
            this.handleBackButton
        );
        this.getReferralList(token)
    }

    async componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        this.props.navigation.goBack();
        return true;
    };

    getReferralList = (token) => {
        const header = {
            "Content-Type": configJSON.httpApiContentType,
            Authorization: token,
        };
        const requestMessage = new Message(
            getName(MessageEnum.RestAPIRequestMessage)
        );
        this.apiReferral = requestMessage.messageId;
        requestMessage.addData(
            getName(MessageEnum.RestAPIResponceEndPointMessage),
            configJSON.referrals
        );
        requestMessage.addData(
            getName(MessageEnum.RestAPIRequestHeaderMessage),
            JSON.stringify(header)
        );
        requestMessage.addData(
            getName(MessageEnum.RestAPIRequestMethodMessage),
            configJSON.httpGetMethod
        );
        runEngine.sendMessage(requestMessage.id, requestMessage);
        return true;
    }

    goToBack() {
        this.props.navigation.goBack()
    }

    renderReferrals() {
        return (
            <View>
                <Text style={styles.totalText}>Total count: {this.state.referralDetail.length}</Text>
                <FlatList
                    data={this.state.referralDetail}
                    contentContainerStyle={{ paddingBottom: 30, }}
                    renderItem={({ item, index }: { item: any, index: any }) => {
                        return (
                            <>
                                <View style={styles.listContainer}>
                                    <View key={index}>
                                        <View style={styles.imageContainer}>
                                            <TouchableOpacity
                                                style={[
                                                    styles.profileView,
                                                ]}
                                            >
                                                {
                                                    item.profile !== null ? <Image source={{ uri: item.profile }} style={styles.profile} />
                                                        : <Image source={profile} style={styles.profile} />
                                                }
                                            </TouchableOpacity>
                                            <View
                                                style={
                                                    styles.id_view
                                                }
                                            >
                                                <Text style={styles.id_txt}>
                                                    {item?.referrals_count}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <Text style={styles.nameTxt}>{item.full_name}</Text>
                                </View>
                                <View style={styles.horizontalLine} />
                            </>
                        )
                    }}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>)
    }
}


export default ReferralController

const styles = StyleSheet.create({
    profile: {
        height: 44,
        width: 44,
        borderRadius: 44 / 2,
        backgroundColor: colors.lightGray,
        borderColor: colors.lightBlue,
    },
    horizontalLine: {
        borderWidth: 0.5,
        backgroundColor: colors.gray,
        opacity: 0.1,
    },
    imageContainer: { justifyContent: "flex-start", alignItems: "flex-start" },
    profileView: {
        width: 48,
        height: 48,
        borderRadius: 48 / 2,
        borderColor: colors.blue,
        borderWidth: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.blue,
    },
    id_view: {
        backgroundColor: colors.blue,
        borderRadius: scaledSize(10),
        paddingHorizontal: scaledSize(10),
        alignSelf: "center",
        bottom: 0,
        position: "absolute",
    },
    id_txt: {
        color: "#fff",
        fontSize: scaledSize(10),
        fontFamily: Fonts.REGULAR,
        textAlign: "center"
    },
    veified: {
        width: widthFromPercentage(4),
        height: widthFromPercentage(4),
    },
    listContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: scaledSize(10),
        paddingBottom: scaledSize(10),
        paddingHorizontal: scaledSize(15),
    },
    nameTxt: {
        fontFamily: Fonts.REGULAR,
        fontSize: scaledSize(15),
        color: colors.black,
        marginLeft: scaledSize(15)
    },
    totalText: {
        fontFamily: Fonts.REGULAR,
        fontSize: 15,
        color: colors.gray,
        paddingHorizontal: scaledSize(15),
        paddingVertical: scaledSize(20),

    }
})