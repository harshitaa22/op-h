import { BackHandler, Keyboard, Platform } from "react-native";
import { CommonActions } from "@react-navigation/native";
//framework
import { IBlock } from "../../../../../framework/src/IBlock";
import { BlockComponent } from "../../../../../framework/src/BlockComponent";
import MessageEnum, { getName } from "../../../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../../../framework/src/RunEngine";
import { Message } from "../../../../../framework/src/Message";
import { getStorageData } from "../../../../../framework/src/Utilities";
//components
import { listOfPollType, setEvent, setNavigatedInPolling } from "../../../../../components/src/Utils/service";
// Customizable Area End

let isOnPreview: boolean
export const configJSON = require("./config.js");
export interface Props {
  // Customizable Area Start
  navigation: any;
  id: string;
  route: any;
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  selectedTimeHorizon: any;
  selectedUpside: any;
  prevData: any;
  selectedType: any;
  pollType: any;
  compareStock: any;
  searchedPrice: any;
  searchedInstrument: any;
  selectedInstrument: any;
  companyDetail: any;
  avgHoldingPrice: any;
  temp: any;
  companyDetails: any;
  selection: any;
  typeForMultipleStock: any;
  errorIndexes: any;
  showErrorInAvg: any;

  isExpandMore: boolean;
  editable: boolean;
  voteOption: boolean;
  isLoaderVisible: boolean;
  expandInstrument: boolean;
  isLoading: boolean;
  showError: boolean;
  isFocused: boolean;
  isStockLoading: boolean;

  userToken: string;
  searchedText: string;
  selectedStockName: string;

  changeOnIndex: number;
  heighLightedInvestment: number;
  selectedIndex: number;
  selectedTempIndex: number;
  // prevData: any
  // Customizable Area End
}

interface SS {
  // Customizable Area Start
  id: any;
  // Customizable Area End
}

export default class OpiGoPollFinalController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  apiSearchStock: string = ''
  apiPostPoll: string = ''
  apiGetLivePrive: string = ''
  searchTimeOut: any
  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start.
    this.subScribedMessages = [
      getName(MessageEnum.RestAPIResponceMessage),
    ];
    // Customizable Area End 
    this.state = {
      selectedTimeHorizon: 0,
      selectedUpside: 0,
      selectedType: this.listOfInvestmentType[0],

      prevData: null,
      selectedInstrument: null,
      searchedPrice: null,

      isExpandMore: false,
      voteOption: true,
      editable: true,
      expandInstrument: false,
      temp: false,
      showError: false,
      isLoading: false,
      isLoaderVisible: false,
      isFocused: false,
      showErrorInAvg: false,
      isStockLoading: false,

      pollType: { key: '', name: '' },
      userToken: '',
      searchedText: '',
      avgHoldingPrice: '',
      selectedStockName: '',

      searchedInstrument: [],
      companyDetail: [],
      companyDetails: [],
      errorIndexes: [],

      changeOnIndex: -1,
      heighLightedInvestment: -1,
      selectedIndex: -1,
      selectedTempIndex: -1,

      compareStock: this.props.route.params.data.pollType.key == listOfPollType[1].key ? [{ input: "", price: null }, { input: "", price: null }] : [{ input: "", price: null }, { input: "", price: null }, { input: "", price: null }],
      typeForMultipleStock: this.props.route.params.data.pollType.key == listOfPollType[1].key ? { name: `Which ${this.props.route.params.data.category.name == 'stocks' ? 'stock' : this.props.route.params.data.category.name} is more bullish?`, key: 'Bullish' } : this.compareMultipleStock[0],
      selection: Platform.OS === 'android' ? { start: 0 } : null,
      // prevData:this.props.route.params.data
    }
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
        if (apiRequestCallId === this.apiSearchStock) {
          this.setState({ isStockLoading: false })
          if (responseJson.companies.includes('error')) {
            return
          }
          if (this.state.selectedStockName !== "") {
            this.state.compareStock.map((itemMain: any) => {
              let index = responseJson.companies.findIndex((item: any) => item.name == itemMain.input)
              if (index != -1) {
                responseJson.companies.splice(index, 1);
              }
            })
            this.setState({ searchedInstrument: responseJson.companies })
          } else {
            this.setState({ searchedInstrument: responseJson.companies })
          }
        }
        else if (apiRequestCallId == this.apiPostPoll) {
          this.setState({ isLoading: false })
          setNavigatedInPolling(false)
          this.props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: "MyTabs",
                  params: {
                    screen: 'Polling',
                    params: {
                      screen: "Polling",
                      params: {
                        navigateTo: "Polls"
                      }
                    }
                  }
                }
              ]
            })
          );
        }
        if (apiRequestCallId == this.apiGetLivePrive) {
          if (responseJson.status == 404) {
            return
          }
          if (responseJson) {
            if (this.state.pollType.key == listOfPollType[1].key || this.state.pollType.key == listOfPollType[2].key) {
              // for list
              let temp = this.state.compareStock[this.state.changeOnIndex]
              temp.input = responseJson.stock_company_detail.name
              temp.price = responseJson.stock_company_detail.market_cap
              //for API
              let data = this.state.companyDetails
              let item = data[this.state.changeOnIndex]
              let currentIndex = item.index
              item = responseJson.stock_company_detail
              item.index = currentIndex
              data[this.state.changeOnIndex] = item
              this.setState({ companyDetails: data, })
              Keyboard.dismiss()
            }
            else {
              this.setState({ isLoaderVisible: false, selectedInstrument: responseJson.stock_company_detail, searchedPrice: responseJson.stock_company_detail.market_cap })
            }
          }
        }
      }
      // Customizable Area End
    }
  }

  timeHorizon = "timeHorizon"
  listOfTimeHorizone = [{ key: "next_1_month", name: "Next 1 Month" }, { key: 'next_1_to_6_month', name: "Next 1 - 6 Months" }, { key: 'next_6_to_12_month', name: "Next 6 - 12 Months" }, { key: 'more_than_1_year', name: "More than 1 Year" }]
  listOfInvestmentType = [{ key: 'new_investment', name: "New Investment" }, { key: 'excisting_investment', name: "Existing Investment" }]
  compareMultipleStock = [{ name: "Rank bullish to bearish", key: 'bullish_to' }, { name: "Rank bearish to bullish", key: 'bearish_to' }]
  backHandler: any
  refs: any

  async componentDidMount() {
    super.componentDidMount();
    Keyboard.addListener(
      'keyboardDidHide',
      () => {
      }
    );
    let token = await getStorageData('Token')
    this.setState({ userToken: token })
    this.loadData()
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
    this.props.navigation.addListener("focus", () => {
      isOnPreview = false
      this.setState({ typeForMultipleStock: this.props.route.params.data.pollType.key == listOfPollType[1].key ? { name: `Which ${this.props.route.params.data.category.name == 'stocks' ? "stock" : this.props.route.params.data.category.name} is more bullish?`, key: 'Bullish' } : this.compareMultipleStock[0] })
      this.loadData()
    });
  }

  async componentWillUnmount() {
    this.setState({ companyDetails: [] })
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  }

  getCapitalizeText = (name: string) => {
    return String(name).toUpperCase().slice(0, 1) + String(name).slice(1)
  }

  loadData = () => {
    let type = this.props.route.params.data.pollType
    this.setState({ temp: !this.state.temp })
    this.setState({ pollType: type, prevData: this.props.route.params.data })
    if (this.props.route.params.data.pollType.key == listOfPollType[1].key) {
      this.setState({ typeForMultipleStock: { name: `Which ${this.props.route.params.data.category.name == 'stocks' ? 'stock' : this.props.route.params.data.category.name} is more bullish?`, key: 'Bullish' } })
    } else {
      this.setState({ typeForMultipleStock: this.compareMultipleStock[0] })
    }
    this.setState({ expandInstrument: false, })
    if (type.key == listOfPollType[2].key && this.state.compareStock[0].input == '') {
      this.setState({
        compareStock: [{ input: "", price: null }, { input: "", price: null }, { input: "", price: null }]
      })
    }
  }

  searchStock = (text: any) => {
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: this.state.userToken,
    };
    let category = this.props.route.params.data.category

    let data = {
      "company": {
        "query": text,
        'category': category?.name == 'stocks' ? 'stock' : category?.name,
        "exchange": category?.type
      }
    }

    this.setState({ isStockLoading: true })
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
  }

  getLivePrice = (id: string) => {
    this.setState({ isLoaderVisible: true })
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: this.state.userToken,
    };
    let body = {
      stock_company_id: id
    }
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
  }

  addQuestions = () => {
    let temp = this.state.compareStock
    temp.push({ input: '' })
    this.setState({ compareStock: temp })
    // setEvent("opigo poll created", {
    //   "add stock clicked": "add stock clicked"
    // })
  }

  postPoll = (type: string) => {
    this.setState({ errorIndexes: [], showError: false })

    let tempDetals = this.state.selectedInstrument
    const { prevData } = this.state
    if (listOfPollType[0].key == this.state.pollType.key) {
      if (tempDetals?.name) {
        let innerData = {}
        if (this.state.selectedType.key == this.listOfInvestmentType[0].key) {
          innerData = {
            investment_type: this.state.selectedType.key,
            vote_options: ["bullish", "bearish", "neutral"]
          }
        } else {
          if (this.state.avgHoldingPrice.length <= 0) {
            this.setState({ showErrorInAvg: true })
            return
          }
          innerData = {
            investment_type: this.state.selectedType.key,
            avg_holding_value: this.state.avgHoldingPrice,
            vote_options: ["bullish", "bearish", "neutral"]
          }
        }
        const data = {
          poll: {
            poll_category_id: this.state.prevData.category.id,
            title: 'Poll Title',
            description: prevData.discription,
            poll_type: prevData.pollType.key,
            time_frame: this.listOfTimeHorizone[this.state.selectedTimeHorizon].key,
            data: innerData,
            poll_stocks_attributes:
              [{ stock_company_id: tempDetals?.stock_company_id }]
          }
        }
        if (type == 'nav') {
          this.props.navigation.navigate("OpiGoPollPreview", {
            apidata: data,
            companyDetail: [tempDetals],
            timeHorizon: this.listOfTimeHorizone[this.state.selectedTimeHorizon],
            options: ["bullish", "bearish", "neutral"],
            polltype: this.state.prevData.pollType,
            investment_type: this.state.selectedType.key
          })
        } else {
          this.sendPost(data)
          setEvent("opigo poll created", {
            "type": data.poll.poll_type,
            "stock names": tempDetals.name,
            "stocks search query": tempDetals.name,
            "investment type": data?.poll?.data?.investment_type,
            "time frame": data.poll.time_frame,
            "bullish stock": ["bullish", "bearish", "neutral"],
            "bearish stock": ["bullish", "bearish", "neutral"],
          })
        }
      } else {
        this.setState({ showError: true, })
      }
    }
    else if (listOfPollType[1].key == this.state.pollType.key) {
      let errorIndexes: any = [0, 1]
      this.state.companyDetails.forEach((element: any) => {
        if (errorIndexes.includes(element.index)) {
          let index = errorIndexes.indexOf(element.index)
          if (index != -1) {
            if (!element.stock_company_id) {
              return
            }
            errorIndexes.splice(index, 1)
          }
        }
      });
      this.setState({ errorIndexes: errorIndexes })
      if (errorIndexes.length) {
        return
      }
      if (this.state.companyDetails.length == 2) {
        let dataAttributes = []
        let temp = this.state.companyDetails
        for (let i = 0; i < temp.length; i++) {
          dataAttributes.push({ stock_company_id: temp[i].stock_company_id })
        }
        const data = {
          poll: {
            poll_category_id: this.state.prevData.category.id,
            title: 'Poll Title',
            description: prevData.discription,
            poll_type: prevData.pollType.key,
            time_frame: this.listOfTimeHorizone[this.state.selectedTimeHorizon].key,
            data: { investment_type: this.state.typeForMultipleStock.name },
            poll_stocks_attributes: dataAttributes
          }
        }
        if (type == 'nav') {
          this.props.navigation.navigate("OpiGoPollPreview", {
            apidata: data,
            companyDetail: this.state.companyDetails,
            timeHorizon: this.listOfTimeHorizone[this.state.selectedTimeHorizon],
            options: ["bullish", "bearish", "neutral"],
            polltype: this.state.prevData.pollType,
            investment_type: this.state.typeForMultipleStock
          })
        } else {
          let a: any = []
          this.state.companyDetails.map((item, index) => {
            return a.push(item.name)
          })
          this.sendPost(data)
          setEvent("opigo poll created", {
            "type": data.poll.poll_type,
            "stock names": a.toString(),
            "stocks search query": a.toString(),
            "investment type": data.poll.data.investment_type,
            "time frame": data.poll.time_frame,
            "bullish stock": ["bullish", "bearish", "neutral"],
            "bearish stock": ["bullish", "bearish", "neutral"],
          })
          console.log(JSON.stringify(data), "opigo poll created22222", a);
        }
      }
    }
    else if (listOfPollType[2].key == this.state.pollType.key) {
      let errorIndexes: any
      if (this.state.compareStock.length == 3) {
        errorIndexes = [0, 1, 2]
      }
      else if (this.state.compareStock.length == 4) {
        errorIndexes = [0, 1, 2, 3]
      }
      else {
        errorIndexes = [0, 1, 2, 3, 4]
      }
      this.state.companyDetails.forEach((element: any) => {
        if (errorIndexes.includes(element.index)) {
          let index = errorIndexes.indexOf(element.index)
          if (index != -1) {
            if (!element.stock_company_id) {
              return
            }
            errorIndexes.splice(index, 1)
          }
        }
      });
      this.setState({ errorIndexes: errorIndexes })
      if (errorIndexes.length) {
        return
      }
      if (this.state.companyDetails.length == this.state.compareStock.length) {
        let dataAttributes = []
        let temp = this.state.companyDetails
        for (let i = 0; i < temp.length; i++) {
          dataAttributes.push({ stock_company_id: temp[i].stock_company_id })
        }
        const data = {
          poll: {
            poll_category_id: this.state.prevData.category.id,
            title: 'Poll Title',
            description: prevData.discription,
            poll_type: prevData.pollType.key,
            time_frame: this.listOfTimeHorizone[this.state.selectedTimeHorizon].key,
            data: { investment_type: this.state.typeForMultipleStock.name },
            poll_stocks_attributes: dataAttributes
          }
        }
        if (type == 'nav') {
          this.props.navigation.navigate("OpiGoPollPreview", {
            apidata: data,
            companyDetail: this.state.companyDetails,
            timeHorizon: this.listOfTimeHorizone[this.state.selectedTimeHorizon],
            options: ["bullish", "bearish", "neutral"],
            polltype: this.state.prevData.pollType,
            investment_type: this.state.typeForMultipleStock
          })
        } else {
          this.sendPost(data)
          let a: any = []
          this.state.companyDetails.map((item, index) => {
            return a.push(item.name)
          })
          setEvent("opigo poll created", {
            "type": data.poll.poll_type,
            "investment type": data.poll.data.investment_type,
            "stock names": a.toString(),
            "time frame": data.poll.time_frame,
            "bullish stock": ["bullish", "bearish", "neutral"],
            "bearish stock": ["bullish", "bearish", "neutral"],
            "ranking type": data.poll.data.investment_type,
            "add stock clicked": this.state.compareStock.length > 3 ? true : false
          })
        }
      }
    }
  }

  sendPost = (data: any) => {
    this.setState({ isLoading: true })
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: this.state.userToken,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiPostPoll = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.postPoll
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
  }

  manageMultipleStock = (data: any, index: number) => {
    Keyboard.dismiss()
    let temp = this.state.compareStock[index]
    temp.input = data.name
    temp.price = data.market_cap
    this.setState({ temp: !this.state.temp, changeOnIndex: index })
    let responseJson = {
      trade_details: data
    }
    responseJson.trade_details.index = index
    if (index == 0) {
      if (this.state.companyDetails[index]?.index == 0) {
        this.state.companyDetails.splice(0, 1, responseJson.trade_details)
      } else {
        this.state.companyDetails.splice(0, 0, responseJson.trade_details)
      }
    } else {
      this.state.companyDetails.splice(index, 1, responseJson.trade_details)
    }
  }

  backAction = (): any => {
    if (!isOnPreview) {
      this.emptyData()
    }
  };

  onChangeText = (data: any, index: number) => {
    clearTimeout(this.searchTimeOut)
    if (data.length >= 2) {
      this.searchTimeOut = setTimeout(() => {
        this.searchStock(data)
        // setEvent("opigo poll created", {
        //   "stocks search query": data
        // })
      }, 600);
    }
    this.setState({ searchedInstrument: [] })
    let temp = this.state.compareStock[index]
    temp.input = data
    temp.price = null
  }

  goBack = () => {
    this.emptyData()
    this.props.navigation.goBack()
  }

  onSearch = (text: any) => {
    clearTimeout(this.searchTimeOut)
    this.setState({ searchedText: text, showError: false, searchedPrice: null, selectedInstrument: null })
    if (listOfPollType[0].key == this.state.pollType.key) {
      this.setState({ companyDetail: [] })
    }
    if (text.length > 2) {
      this.setState({ expandInstrument: true })
      this.searchTimeOut = setTimeout(() => {
        this.searchStock(text)
        //search function
      }, 600);
    }
    if (text.length > 0) {
      this.setState({ expandInstrument: true })
    } else {
      this.setState({ expandInstrument: false })
    }
  }

  removeFromList = (index: any) => {
    let temp = this.state.compareStock
    temp.splice(index, 1)

    let tempCompanyDetail = this.state.companyDetails
    tempCompanyDetail.splice(index, 1)
    this.setState({ compareStock: temp, companyDetails: tempCompanyDetail })
  }

  emptyData = () => {
    this.setState({ searchedInstrument: [], compareStock: [{ input: '' }, { input: '' }], selectedStockName: '', companyDetails: [], errorIndexes: [], showError: false, searchedText: '', selectedTimeHorizon: 0, heighLightedInvestment: -1, selectedType: this.listOfInvestmentType[0], searchedPrice: null, companyDetail: [], showErrorInAvg: false, avgHoldingPrice: '' });
  }

  goToPreView = () => {
    isOnPreview = true
    this.postPoll('nav')
  }
  // Customizable Area End
}


