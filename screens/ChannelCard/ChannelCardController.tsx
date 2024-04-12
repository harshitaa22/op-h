// Customizable Area Start
import { BackHandler, Keyboard } from "react-native";
//framework
import MessageEnum, {
    getName,
} from "../../../../../framework/src/Messages/MessageEnum";
import { BlockComponent } from "../../../../../framework/src/BlockComponent";
import { Message } from "../../../../../framework/src/Message";
import { runEngine } from "../../../../../framework/src/RunEngine";
import { IBlock } from "../../../../../framework/src/IBlock";
import { getStorageData } from "../../../../../framework/src/Utilities";
// components
import { listOfCatogary, setEvent } from "../../../../../components/src/Utils/service";
import { isValidPercentage } from "../../../../../components/src/utilitisFunction";
//library
import { EventRegister } from "react-native-event-listeners";
import Toast from "react-native-simple-toast";
// Customizable Area End

export const configJSON = require("./config.js");

export interface Props {
    // Customizable Area Start
    navigation: any;
    id: string;
    // Customizable Area End
}

interface S {
    // Customizable Area Start
    suggestions: any;
    channelType: any;
    channelItem: any;
    textInput: any;
    discriptionText: any;
    marketCategory: any;
    priceMovement: any;
    selectedPrice: any;
    searchedStock: any;
    isChannelError: any;
    changeStock: any;
    searchStockText: any;
    searchStockList: any;
    channelId: any;
    searchStockPrice: any;
    channleId: any,
    selectText: any;
    channelData: any;
    selectedCardType: any;

    isLoaderVisible: boolean;
    isBullish: boolean;
    showChannelType: boolean;
    isBearish: boolean;
    dropdownCategoryStatus: boolean;
    isExpandMore: boolean;
    isExpandMoreStock: boolean;
    isLoading: boolean;
    isLoadingCatogary: boolean;
    isFetchingDetail: boolean;
    isCaptionError: boolean;
    showPrice: boolean;
    isRewarded: boolean

    width: string;
    caption: string;
    userToken: string;
    selectedChannel: string;
    inputTargetPercentage: string;
    inputStopLossPercentage: string;

    selectedCategory: number;
    selectedStock: number;
    heighLightedInvestment: number;

    isError: boolean;
    visible: boolean;
    heighLightIndex: number;
    isStockLoading: boolean;
    isAutoClose: boolean;
    isSetTarget: boolean;
    isStopLoss: boolean;
    isErrorTarget: boolean;
    isErrorStopLoss: boolean;

    cardsType: {}[];
    selectedInfoIndex: number;
    // Customizable Area End
}

interface SS {
    // Customizable Area Start
    id: any;
    // Customizable Area End
}

export default class ChannelCardController extends BlockComponent<Props, S, SS> {
    // Customizable Area Start
    apiStockCategory: string = "";
    apiPriceMovement: string = "";
    apiMarketCatogary: string = "";
    apiChannelActive: string = '';
    apiSearchStock: string = "";
    apiGetLivePrive: string = "";
    searchTimeOut: any;
    RBSheet: any;
    backHandler: any;
    selectChannel: any;
    focusListener: any;
    blur: any;
    channelCard: any
    // details: any = ['Performance of your OpiGo Card directly impacts your OpiGo Score', 'OpiGo Cards cannot be edited or deleted after posting', 'Use “Mark as Completed” option to close an OpiGo card', 'Closed cards will be visible on your OpiGo Portfolio', 'These cards are not to be considered as stock tips or investment advice']
    details: any = [
        "Cards cannot be edited or deleted once posted",
        "Click on the three dots to close a card",
        "Closed cards will also be visible in your profile",
        "Performance of your card will impact your score",
        "Cards are simply your opinions or predictions and not to be considered as an investment advice.",
    ];
    generalCards: string[] = [
        "No daily limit.",
        "Track your stock performance.",
        "No rewards linked.",
    ];
    rewardCards: string[] = [
        "Get a reward on closing the card.",
        "Limited to one per day.",
        "Reward is linked to cards performance.",
    ];
    // Customizable Area End
    constructor(props: Props) {
        super(props);
        // Customizable Area Start
        this.receive = this.receive.bind(this);
        this.subScribedMessages = [getName(MessageEnum.RestAPIResponceMessage)];
        this.state = {
            // Customizable Area Start
            caption: "",
            width: '99.9%',
            changeStock: "",
            selectText: "",
            textInput: "",
            discriptionText: "",
            channelId: "",
            inputTargetPercentage: "",
            inputStopLossPercentage: "",
            selectedChannel: "Choose from drop-down",
            userToken: "",
            searchStockText: "",

            suggestions: [],
            channelData: [],
            marketCategory: [],
            priceMovement: [],
            searchStockList: [],
            searchedStock: [],
            channelType: [],

            isBearish: true,
            isBullish: false,
            isExpandMore: false,
            isExpandMoreStock: false,
            dropdownCategoryStatus: false,
            isCaptionError: false,
            visible: false,
            isChannelError: false,
            isLoaderVisible: false,
            isLoading: true,
            isLoadingCatogary: true,
            isFetchingDetail: false,
            showPrice: false,
            isError: false,
            isStockLoading: false,
            isAutoClose: false,
            isSetTarget: false,
            showChannelType: false,
            isErrorTarget: false,
            isErrorStopLoss: false,
            isStopLoss: false,
            isRewarded: false,

            selectedCategory: 1,
            selectedStock: 0,
            heighLightIndex: -1,
            heighLightedInvestment: -1,

            channelItem: {},

            selectedPrice: null,
            searchStockPrice: null,

            cardsType: [
                { name: "General", key: "general" },
                { name: "Reward", key: "reward" },
            ],
            selectedCardType: { name: "General", key: "general" },
            selectedInfoIndex: 0,
            // Customizable Area End
        };
        // Customizable Area End
        runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
    }

    async receive(from: string, message: Message) {
        // Customizable Area Start
        if (getName(MessageEnum.RestAPIResponceMessage) == message.id) {
            const apiRequestCallId = message.getData(
                getName(MessageEnum.RestAPIResponceDataMessage)
            );
            var responseJson = message.getData(
                getName(MessageEnum.RestAPIResponceSuccessMessage)
            );
            var errorReponse = message.getData(
                getName(MessageEnum.RestAPIResponceErrorMessage)
            );
            if (apiRequestCallId !== null) {
                if (apiRequestCallId === this.apiStockCategory) {
                    this.setState({ isLoadingCatogary: false });
                    if (responseJson.error) {
                        return;
                    } else {
                        let catogary = [];
                        for (let i = 0; i < responseJson.length; i++) {
                            const element = responseJson[i];
                            if (element.name == "stocks") {
                                let detail1 = {
                                    id: element.id,
                                    name: element.name,
                                    type: "BSE",
                                };
                                let detail2 = {
                                    id: element.id,
                                    name: element.name,
                                    type: "NSE",
                                };
                                catogary.push(detail1);
                                catogary.push(detail2);
                            } else {
                                catogary.push(element);
                            }
                        }
                        this.setState({ marketCategory: catogary });
                    }
                } else if (apiRequestCallId == this.apiPriceMovement) {
                    this.setState({ isLoading: false });
                    if (responseJson && responseJson.error) {
                        return;
                    } else {
                        if (responseJson && responseJson.movements) {
                            this.setState({
                                priceMovement: responseJson.movements,
                                selectedPrice: responseJson.movements[0],
                            });
                        }
                    }
                } else if (apiRequestCallId == this.apiSearchStock) {
                    this.setState({ isStockLoading: false });
                    if (responseJson.companies.includes("error")) {
                        return;
                    }
                    if (responseJson && responseJson.error) {
                        return;
                    } else {
                        this.setState({ searchStockList: responseJson.companies });
                    }
                } else if (apiRequestCallId == this.apiGetLivePrive) {
                    if (responseJson.status == 404) {
                        return;
                    }
                    if (responseJson) {
                        this.setState({
                            searchedStock: responseJson.stock_company_detail,
                            searchStockPrice: responseJson.stock_company_detail.market_cap,
                        });
                        this.setState({ isLoaderVisible: false })
                    }
                }
                else if (apiRequestCallId == this.apiChannelActive) {
                    if (responseJson && responseJson?.errors) {
                    }
                    else {
                        this.setState({ channelData: responseJson.channels })

                    }
                }
            }
            // Customizable Area End
        }
    }
    async componentDidMount() {
        // this.changeDisc("");
        this.setState({
            selectedPrice: null,
            selectedCategory: 1,
            marketCategory: listOfCatogary,
            caption: "",
            showChannelType: false,
            isExpandMore: false,
            isLoadingCatogary: false,
        });
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        );
        let token = await getStorageData("Token");
        this.setState({ userToken: token });
        this.getPriceMovement(token);
        this.getChannelData()
        if (this.props?.route?.params?.channelTitle) {
            this.setState({ selectedChannel: this.props?.route?.params?.channelTitle, channelId: this.props?.route?.params?.channelId })
        }
        this.focusListener = this.props.navigation.addListener("focus", () => {
            this.props?.navigation.setParams({ channelTitle: "", channelId: "" })
            if (this.props?.route?.params?.channelTitle) {
                this.setState({ selectedChannel: this.props?.route?.params?.channelTitle, channelId: this.props?.route?.params?.channelId })
            }
            this.setState({
                caption: "",
            });
            this.backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                this.backAction
            );
            if (this.state.priceMovement.length > 0) {
                this.changeStockText("");
                this.setState({ searchStockText: "" })
                if (this.state.selectedPrice == null) {
                    this.setState({ selectedPrice: this.state.priceMovement[0] });
                }
            }
        });

        this.blur = this.props.navigation.addListener("blur", () => {
            this.setState({
                isError: false,
                isExpandMore: false,
                isExpandMoreStock: false,
                isCaptionError: false,
                showChannelType: false,
                isChannelError: false,
                selectedChannel: "Choose from drop-down",
                dropdownCategoryStatus: false
            });
        });
    }

    getDataAndUpdate() {
        if (this.props.route?.params?.channelTitle) {
            this.setState({ selectedChannel: this.props.route?.params?.channelTitle });
        }
    }

    // componentDidUpdate(prevProps, prevState) {
    //     const { route } = this.props;
    //     if (route?.params?.channelTitle !== prevProps?.route?.params?.channelTitle) {
    //         this.setState({ selectedChannel: route?.params?.channelTitle });
    //     }
    //     // if (this.props.navigation.isFocused()) {
    //     //     // Your logic when focus changes
    //     //     if (this.props.navigation.isFocused()) {
    //     //     } else {
    //     //     }
    //     // }
    // }

    async componentWillUnmount() {
        EventRegister.removeEventListener(this.backHandler)
    }

    dismiss = () => {
        Keyboard.dismiss()
    }

    backAction = (): any => {
        this.setState({
            isError: false,
            isCaptionError: false,
            showChannelType: false,
            isChannelError: false,

            selectedPrice: this.state.priceMovement[0],
            searchedStock: [],

            searchStockPrice: null,

            selectedCategory: 1,
            channelItem: {},

            selectedChannel: "Choose from drop-down",
            searchStockText: "",
        });
    };

    hendleTag = (text: any) => {
        this.setState({ caption: text })
    }

    getStockList = (text: any) => {
        const header = {
            "Content-Type": configJSON.httpApiContentType,
            token: this.state.userToken,
        };
        let category = this.state.marketCategory[this.state.selectedCategory];
        let data = {
            company: {
                query: text,
                category: category.name == "stocks" ? "stock" : category.name,
                exchange: category.type,
            },
        };
        this.setState({ isStockLoading: true });
        const requestMessage = new Message(
            getName(MessageEnum.RestAPIRequestMessage)
        );
        this.apiSearchStock = requestMessage.messageId;
        requestMessage.addData(
            getName(MessageEnum.RestAPIResponceEndPointMessage),
            configJSON.getCompanyName
        );
        requestMessage.addData(
            getName(MessageEnum.RestAPIRequestHeaderMessage),
            JSON.stringify(header)
        );
        requestMessage.addData(
            getName(MessageEnum.RestAPIRequestBodyMessage),
            JSON.stringify(data)
        );
        requestMessage.addData(
            getName(MessageEnum.RestAPIRequestMethodMessage),
            configJSON.httpPostMethod
        );
        runEngine.sendMessage(requestMessage.id, requestMessage);
        return true;
    };

    getChannelData = async () => {
        // apiChannelActive
        const token = await getStorageData("Token");
        const header = {
            "Content-Type": configJSON.httpApiContentType,
            Authorization: token
        };
        const requestMessage = new Message(
            getName(MessageEnum.RestAPIRequestMessage)
        );
        this.apiChannelActive = requestMessage.messageId;
        requestMessage.addData(
            getName(MessageEnum.RestAPIResponceEndPointMessage),
            configJSON.channelActive
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

    getCategory = (token: string) => {
        const header = {
            "Content-Type": configJSON.httpApiContentType,
            token: token,
        };
        const requestMessage = new Message(
            getName(MessageEnum.RestAPIRequestMessage)
        );
        this.apiMarketCatogary = requestMessage.messageId;
        requestMessage.addData(
            getName(MessageEnum.RestAPIResponceEndPointMessage),
            configJSON.getPointMarketCatogary
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
    };

    // Customizable Area Start
    getPriceMovement = (token: string) => {
        const header = {
            "Content-Type": configJSON.httpApiContentType,
            token: token,
        };
        const requestMessage = new Message(
            getName(MessageEnum.RestAPIRequestMessage)
        );
        this.apiPriceMovement = requestMessage.messageId;
        requestMessage.addData(
            getName(MessageEnum.RestAPIResponceEndPointMessage),
            configJSON.getPointPriceMovement
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
    };

    getMarketCategory = (token: string) => {
        const header = {
            "Content-Type": configJSON.httpApiContentType,
            token: token,
        };
        const requestMessage = new Message(
            getName(MessageEnum.RestAPIRequestMessage)
        );
        this.apiStockCategory = requestMessage.messageId;
        requestMessage.addData(
            getName(MessageEnum.RestAPIResponceEndPointMessage),
            configJSON.getPointMarketCategory
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
    };

    getLivePrice = (id: string) => {
        this.setState({ isLoaderVisible: true })
        const header = {
            "Content-Type": configJSON.httpApiContentType,
            token: this.state.userToken,
        };
        let body = {
            stock_company_id: id,
        };
        const requestMessage = new Message(
            getName(MessageEnum.RestAPIRequestMessage)
        );
        this.apiGetLivePrive = requestMessage.messageId;
        requestMessage.addData(
            getName(MessageEnum.RestAPIResponceEndPointMessage),
            configJSON.getLivePrice
        );
        requestMessage.addData(
            getName(MessageEnum.RestAPIRequestHeaderMessage),
            JSON.stringify(header)
        );
        requestMessage.addData(
            getName(MessageEnum.RestAPIRequestBodyMessage),
            JSON.stringify(body)
        );
        requestMessage.addData(
            getName(MessageEnum.RestAPIRequestMethodMessage),
            configJSON.httpPostMethod
        );
        runEngine.sendMessage(requestMessage.id, requestMessage);
        return true;
    };

    goBack = () => {
        this.props.navigation.goBack();
    };

    goToFinalCard = () => {
        if (!this.state.isFetchingDetail) {
            console.log("this.state.captionthis.state.caption", this.state.caption);

            if (
                this.state.searchStockList.length == 0 ||
                this.state.searchedStock.length == 0
            ) {
                this.setState({ isError: true });
            }
            if (this.state.selectedChannel == "Choose from drop-down" || this.state.channelItem == undefined) {
                this.setState({ isChannelError: true });
            }
            if (this.state.caption.length == 0 || this.state.caption.length == null) {
                this.setState({ isCaptionError: true });
            }
            else {
                if (
                    this.state.searchStockPrice == null ||
                    this.state.searchStockPrice.length == 0 ||
                    Number(this.state.searchStockPrice) == 0
                ) {
                    return Toast.show(
                        "Failed to fetch price, please try again!",
                        Toast.SHORT,
                        ["UIAlertController"]
                    );
                }
                if (this.state.caption.length == 0 || this.state.caption.length == null) {
                    return Toast.show(
                        "Please enter caption",
                        Toast.SHORT,
                        ["UIAlertController"]
                    );
                }
                if (this.state.selectedChannel == "Choose from drop-down" || this.state.channelItem == undefined) {
                    return Toast.show(
                        "Please Select channel",
                        Toast.SHORT,
                        ["UIAlertController"]
                    );
                }
                if (this.state.isAutoClose) {
                    if (!this.state.isSetTarget && !this.state.isStopLoss) {
                        Toast.show("Please select at least one option", Toast.SHORT, [
                            "UIAlertController",
                        ]);
                        return;
                    }
                    if (
                        this.state.isSetTarget &&
                        !isValidPercentage(this.state.inputTargetPercentage)
                    ) {
                        this.setState({ isErrorTarget: true }, () => {
                            Toast.show("Please enter valid percentage", Toast.SHORT, [
                                "UIAlertController",
                            ]);
                        });
                        return;
                    } else if (
                        this.state.isStopLoss &&
                        !isValidPercentage(this.state.inputStopLossPercentage)
                    ) {
                        this.setState({ isErrorStopLoss: true }, () => {
                            Toast.show("Please enter valid percentage", Toast.SHORT, [
                                "UIAlertController",
                            ]);
                        });
                        return;
                    } else {
                        this.setState({ isErrorTarget: false, isErrorStopLoss: false });
                    }
                }
                console.log("this.state.channelData", this.state.selectedChannel);

                let channelData = {
                    description: this.state.caption,
                    price_movement: "Bullish",
                    stock_company_id: this.state.searchedStock?.stock_company_id,
                    book_price: Number(this.state.searchStockPrice).toFixed(2),
                    currency_name: this.state.searchedStock?.currency_name,
                    is_auto_close: false,
                    auto_close_profit_percent: "",
                    auto_close_loss_percent: "",
                    channel_id: this.state.channelId,
                    selectedChannel: this.state.selectedChannel
                }

                this.props.navigation.navigate("ChannelFinalCard", { data: channelData });
            }
        } else {
            alert("please try again");
        }
    };

    changeStockText = (text: string | any[]) => {
        clearTimeout(this.searchTimeOut);
        this.setState({
            searchedStock: [],
            searchStockList: [],
            isError: false,
            searchStockPrice: null,
        });
        if (text.length > 2) {
            this.searchTimeOut = setTimeout(() => {
                this.getStockList(text);
            }, 800);
        }
        if (text.length > 0) {
            this.setState({ isExpandMoreStock: true });
        } else {
            this.setState({ isExpandMoreStock: false });
        }
    };

    changeDisc = (text: string | any[]) => {
        this.setState({ caption: "" });
    };
    // Customizable Area End
}


//comment code
// },
// "card": {
// }

// }
// let data = {
//     category: this.state.marketCategory[this.state.selectedCategory],
//     stock: this.state.searchStockList[this.state.selectedStock],
//     bulish_barish: this.state.selectedPrice,
//     discription: this.state.caption,
//     stockDetail: this.state.searchedStock,
//     is_auto_close: this.state.isAutoClose,
//     auto_close_profit_percent: this.state.inputTargetPercentage,
//     auto_close_loss_percent: this.state.inputStopLossPercentage,
//     type_of: this.state.selectedCardType,
// };