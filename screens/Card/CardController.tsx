// Customizable Area Start
//framework
import MessageEnum, {
  getName,
} from "../../../../../framework/src/Messages/MessageEnum";
import { BlockComponent } from "../../../../../framework/src/BlockComponent";
import { Message } from "../../../../../framework/src/Message";
import { runEngine } from "../../../../../framework/src/RunEngine";
import { IBlock } from "../../../../../framework/src/IBlock";
import { getStorageData } from "../../../../../framework/src/Utilities";
import { BackHandler, Keyboard } from "react-native";
//library
import Toast from "react-native-simple-toast";
//components
import { listOfCatogary } from "../../../../../components/src/Utils/service";
import { isValidPercentage } from "../../../../../components/src/utilitisFunction";
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
  textInput: any;
  discriptionText: any;
  marketCategory: any;
  priceMovement: any;
  selectedPrice: any;
  searchedStock: any;
  changeStock: any;
  searchStockText: any;
  searchStockList: any;
  searchStockPrice: any;
  selectedCardType: any;
  selectText: any;

  isLoaderVisible: boolean;
  isBullish: boolean;
  isBearish: boolean;
  isExpandMore: boolean;
  isExpandMoreStock: boolean;
  isLoading: boolean;
  isLoadingCatogary: boolean;
  isFetchingDetail: boolean;
  showPrice: boolean;
  isError: boolean;
  visible: boolean;
  isStockLoading: boolean;
  isAutoClose: boolean;
  isSetTarget: boolean;
  isStopLoss: boolean;
  isErrorTarget: boolean;
  isErrorStopLoss: boolean;
  isRewarded: boolean

  width: string;
  caption: string;
  userToken: string;
  inputTargetPercentage: string;
  inputStopLossPercentage: string;

  selectedCategory: number;
  selectedStock: number;
  heighLightIndex: number;
  selectedInfoIndex: number;

  cardsType: {}[];
  // Customizable Area End
}

interface SS {
  // Customizable Area Start
  id: any;
  // Customizable Area End
}

export default class CardController extends BlockComponent<Props, S, SS> {
  // Customizable Area Start
  apiStockCategory: string = "";
  apiPriceMovement: string = "";
  apiMarketCatogary: string = "";
  apiSearchStock: string = "";
  apiGetLivePrive: string = "";
  searchTimeOut: any;
  RBSheet: any;
  backHandler: any;
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
      userToken: "",
      searchStockText: "",
      inputTargetPercentage: "",
      inputStopLossPercentage: "",

      isBearish: true,
      isBullish: false,
      isExpandMore: false,
      isExpandMoreStock: false,
      visible: false,
      isLoaderVisible: false,
      isLoading: true,
      isLoadingCatogary: true,
      isFetchingDetail: false,
      showPrice: false,
      isError: false,
      isStockLoading: false,
      isAutoClose: false,
      isSetTarget: false,
      isStopLoss: false,
      isErrorTarget: false,
      isErrorStopLoss: false,
      isRewarded: false,

      selectedCategory: 1,
      selectedStock: 0,
      heighLightIndex: -1,
      selectedInfoIndex: 0,

      marketCategory: [],
      priceMovement: [],
      searchedStock: [],
      searchStockList: [],
      suggestions: [],

      selectedPrice: null,
      searchStockPrice: null,

      cardsType: [
        { name: "General", key: "general" },
        { name: "Reward", key: "reward" },
      ],
      selectedCardType: { name: "General", key: "general" },
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
      }
      // Customizable Area End
    }
  }
  async componentDidMount() {
    this.setState({
      selectedPrice: null,
      isExpandMore: false,
      selectedCategory: 1,
      marketCategory: listOfCatogary,
      isLoadingCatogary: false,
      caption: ""
    });
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
    let token = await getStorageData("Token");
    this.setState({ userToken: token });
    this.getPriceMovement(token);
    this.props.navigation.addListener("focus", () => {
      this.setState({
        caption: ""
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
    this.props.navigation.addListener("blur", () => {
      this.setState({
        isError: false,
        isExpandMore: false,
        isExpandMoreStock: false,
      });
    });
  }

  dismiss = () => {
    Keyboard.dismiss()
  }

  backAction = (): any => {
    this.setState({
      isError: false,
      searchStockText: "",
      selectedPrice: this.state.priceMovement[0],
      searchedStock: [],
      searchStockPrice: null,
      selectedCategory: 1,
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
      if (
        this.state.searchStockList.length == 0 ||
        this.state.searchedStock.length == 0
      ) {
        this.setState({ isError: true });
      } else {
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
        let data = {
          category: this.state.marketCategory[this.state.selectedCategory],
          stock: this.state.searchStockList[this.state.selectedStock],
          bulish_barish: this.state.selectedPrice,
          discription: this.state.caption,
          stockDetail: this.state.searchedStock,
          is_auto_close: this.state.isAutoClose,
          auto_close_profit_percent: this.state.inputTargetPercentage,
          auto_close_loss_percent: this.state.inputStopLossPercentage,
          type_of: this.state.selectedCardType,
        };
        this.props.navigation.navigate("FinalCard", { data: data });
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

// details: any = ['Performance of your OpiGo Card directly impacts your OpiGo Score', 'OpiGo Cards cannot be edited or deleted after posting', 'Use “Mark as Completed” option to close an OpiGo card', 'Closed cards will be visible on your OpiGo Portfolio', 'These cards are not to be considered as stock tips or investment advice']

// if (!this.state.showPrice) return
// searchStockText: text,