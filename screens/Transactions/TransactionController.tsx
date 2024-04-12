import React from 'react'
import { BackHandler, FlatList, StyleSheet, Text, View } from 'react-native'
//components
import { Fonts } from '../../../../../components/src/Utils/Fonts';
//framework
import { getStorageData, scaledSize } from '../../../../../framework/src/Utilities';
import MessageEnum, { getName } from '../../../../../framework/src/Messages/MessageEnum';
import { runEngine } from '../../../../../framework/src/RunEngine';
import { Message } from '../../../../../framework/src/Message';
import { IBlock } from '../../../../../framework/src/IBlock';
import { BlockComponent } from '../../../../../framework/src/BlockComponent';
//library
import moment from 'moment';
//colors
import colors from '../../colors';

export interface Props {
    navigation: any;
}
export const configJSON = require("./config.js");

interface S {
    // Customizable Area Start
    trasactionDetail: any,
    isLoadingNews: boolean,
    isLoading: boolean
    // Customizable Area End
}

interface SS {
    // Customizable Area Start
    id: any;
    // Customizable Area End
}

export class TransactionController extends BlockComponent<
    Props,
    S,
    SS
>  {
    apiTransaction: string = "";
    constructor(props: any) {
        super(props);
        this.receive = this.receive.bind(this);
        this.subScribedMessages = [
            getName(MessageEnum.NavigationPayLoadMessage),
            getName(MessageEnum.RestAPIResponceMessage)
        ];
        runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
        this.state = {
            trasactionDetail: []
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
                if (apiRequestCallId == this.apiTransaction) {
                    this.setState({ isLoadingNews: false, isLoading: false })
                    if (responseJson && responseJson.error) {
                        return
                    } else {
                        this.setState({ trasactionDetail: responseJson })
                    }
                }
            }
        }
    }

    async componentDidMount() {
        BackHandler.addEventListener(
            "hardwareBackPress",
            this.handleBackButton
        );
        const token = await getStorageData("Token");
        this.getTransactionList(token)
    }

    async componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        this.props.navigation.goBack();
        return true;
    };

    goToBack() {
        this.props.navigation.goBack()
    }

    getTransactionList = (token: any) => {
        const header = {
            "Content-Type": configJSON.httpApiContentType,
            Authorization: token,
        };

        const requestMessage = new Message(
            getName(MessageEnum.RestAPIRequestMessage)
        );
        this.apiTransaction = requestMessage.messageId;
        requestMessage.addData(
            getName(MessageEnum.RestAPIResponceEndPointMessage),
            configJSON.getTransactionList + this.props.route.params.walletId
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

    renderTransation() {
        return (
            <FlatList
                data={this.state.trasactionDetail}
                contentContainerStyle={{ paddingBottom: 30, paddingTop: 20 }}
                renderItem={({ item, index }: { item: any, index: any }) => {
                    return (
                        <View key={index}>
                            <View style={styles.transactionContainer}>
                                <View style={styles.commonFlex}>
                                    <Text style={styles.priceTxt(item.transaction_type == "debit")}>{item.currency_name + " " + item.amount}</Text>
                                    <Text style={styles.dateText}>{moment(item.updated_at).format('DD MMM YYYY, HH:MM A')}</Text>
                                </View>
                                <View style={styles.commonFlex}>
                                    <Text style={styles.cardText} >{item.transaction_type}</Text>
                                </View>
                            </View>
                            <View style={styles.horizontalLine} />
                        </View>
                    )
                }}
                keyExtractor={(item, index) => index.toString()}
            />)
    }
}

export default TransactionController
const styles = StyleSheet.create({
    horizontalLine: {
        borderWidth: 0.5,
        backgroundColor: colors.gray,
        opacity: 0.1,
    },
    transactionContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: scaledSize(15),
        paddingTop: scaledSize(15),
        paddingBottom: scaledSize(15),
    },
    priceTxt: (visible) => ({
        fontSize: 18,
        fontFamily: Fonts.MEDIUM,
        color: visible ? colors.red : colors.green
    }),
    cardText: {
        fontSize: 16,
        color: colors.gray,
        textAlign: "right"
    },
    dateText: {
        fontSize: 15,
        color: colors.black,
        marginTop: scaledSize(5),
    },
    commonFlex: {
        flex: 1
    }
})