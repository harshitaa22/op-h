import MessageEnum, { getName } from "../../../../../framework/src/Messages/MessageEnum";
import { BlockComponent } from "../../../../../framework/src/BlockComponent";
import { Message } from "../../../../../framework/src/Message";
import { runEngine } from "../../../../../framework/src/RunEngine";
import { IBlock } from "../../../../../framework/src/IBlock";
import { getStorageData } from "../../../../../framework/src/Utilities";
import { setEvent } from "../../../../../components/src/Utils/service";
import { BackHandler } from "react-native";
export const configJSON = require("./config");

export interface Props {
    navigation: any;
    id: string;
    route: any;
    // Customizable Area Start
    // Customizable Area End
}

interface S {
    // Customizable Area Start
    data: any,
    topScoreList: any,
    topscoreLoaderVisible: boolean,
    userDetail: any,
    isLoading: boolean,
    up: boolean,
    activeTradeTime: boolean,
    best_performers: string,
    cards: any,
    visiblePopUp: boolean
    userToken: "",
    // Customizable Area End
}

interface SS {
    id: any;
    // Customizable Area Start
    // Customizable Area End
}



export default class TopRankersController extends BlockComponent<
    Props,
    S,
    SS
> {
    // Customizable Area Start
    apiPostCard: string = ""
    apiCardList: string = "";
    apiTopScorer: string = "";
    constructor(props: Props) {
        super(props);

        this.receive = this.receive.bind(this);
        this.subScribedMessages = [
            getName(MessageEnum.NavigationPayLoadMessage),
            getName(MessageEnum.RestAPIResponceMessage)
        ];
        // Customizable Area Start


        // Customizable Area End 
        this.state = {
            data: null,
            userDetail: null,
            isLoading: false,
            up: false,
            activeTradeTime: false,
            visiblePopUp: false,
            cards: [],
            topScoreList: [],
            topscoreLoaderVisible: false,
            best_performers: "Weekly Leaders",
            userToken: "",
        }
        runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
    }

    async receive(from: string, message: Message) {
        //

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

            if (apiRequestCallId == this.apiTopScorer) {

                if (responseJson && responseJson?.errors) {
                    const { message } = responseJson?.errors[0];
                    if (message === "Please login again.") {
                        // logoutUser("force")
                        this.context.authContext.signOut()
                        return
                    }
                }
                if (responseJson) {
                    const { errors, data } = responseJson
                    if (errors) {
                        this.setState({ topScoreList: [], topscoreLoaderVisible: false })
                        return
                    }
                    if (data) {
                        const accountid = await getStorageData("AccountID");
                        let topScoreList = data.map((item: any) => {
                            item.isMyProfile = item.id === accountid
                            return item
                        })
                        this.setState({ topscoreLoaderVisible: false, topScoreList: topScoreList })
                        //@ts-ignore
                        // let oldScores = this.context.loginState.opigoScores
                        // data.map((data: any) => {
                        //   let details = data.attributes
                        //   this.addDataToOpigoScores(oldScores, details.opigo_score, data.id)
                        // })
                        //@ts-ignore
                        // this.context.authContext.setOpiGoScores(oldScores)
                    } else {
                        //close loader here
                    }
                    //   if (this.state.isFirstTimeLoad) {
                    //     this.setState({ isFirstTimeLoad: false }, () => {
                    //       this.getCardDetail(this.state.userToken)
                    //     })
                    //   }
                }

            }
        }
        // Customizable Area End
    }


    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        let userDetail = await getStorageData("USER_DATA")
        let fData = JSON.parse(userDetail)
        this.setState({ userDetail: fData.data })
        let token = await getStorageData('Token')

        this.setState({ userToken: token })
        if (token) {
            { this.setState({ topscoreLoaderVisible: true }) }
            await this.getTopScorer(token)
        }
        setEvent("leaderboard screen", null)
    }

    handleBackButton = () => {
        this.props.navigation.goBack();
        return true;
    };

    async componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    goToFriendProfilePage = async (id: any) => {
        const accountid = await getStorageData("AccountID");
        if (accountid == id) {
            this.props.navigation.navigate("MyTabs", { screen: "Profiles" })
            setEvent("my profile viewed", { "screen": "topRankers" })
        } else {
            this.props.navigation.navigate("FriendProfiles", { 'id': id })
        }
    }


    gotToFriendPage = (id) => {
        this.goToFriendProfilePage(id);
    };

    goToBack = () => {
        this.props.navigation.goBack();
    };

    getTopScorer = (token: string) => {
        const header = {
            "Content-Type": configJSON.httpApiContentType,
            Authorization: token,
        };
        const requestMessage = new Message(
            getName(MessageEnum.RestAPIRequestMessage)
        );
        this.apiTopScorer = requestMessage.messageId;
        let url = configJSON.topScorer;
        if (this.state.best_performers === "Weekly Leaders") {
            url = url + "?num_of_days=10"
        } else {
            url = url + "?num_of_days=30"
        }
        requestMessage.addData(
            getName(MessageEnum.RestAPIResponceEndPointMessage),
            url
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
    // Customizable Area End


}

