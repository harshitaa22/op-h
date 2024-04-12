// Customizable Area Start
import { BackHandler } from "react-native";
//framework
import MessageEnum, { getName } from "../../../../../framework/src/Messages/MessageEnum";
import { BlockComponent } from "../../../../../framework/src/BlockComponent";
import { Message } from "../../../../../framework/src/Message";
import { runEngine } from "../../../../../framework/src/RunEngine";
import { IBlock } from "../../../../../framework/src/IBlock";
import { getStorageData } from "../../../../../framework/src/Utilities";
//components
import { listOfCatogary, setEvent } from "../../../../../components/src/Utils/service";
// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  // Customizable Area Start
  navigation: any;
  route: any;
  id: string;
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  isExpandMore: boolean;
  isLoading: boolean,

  selectedCategory: number,
  heighLightIndex: number;

  textInput: any,
  discriptionText: any,
  selectedType: any,
  pollCategory: any,
  // Customizable Area End
}

interface SS {
  // Customizable Area Start
  id: any;
  // Customizable Area End
}



export default class OpigoPollController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  apiStockCategory: string = ""
  RBSheet: any
  backHandler: any
  listOfPollType = [{ key: "single_investment", name: "Single " }, { key: "compare_2_investment", name: "Compare 2 " }, { key: "rank_investment", name: "Rank " }]
  constructor(props: Props) {
    super(props);

    // Customizable Area Start
    this.receive = this.receive.bind(this);
    this.subScribedMessages = [getName(MessageEnum.RestAPIResponceMessage)];
    this.state = {
      // Customizable Area Start
      isExpandMore: false,
      isLoading: true,

      selectedCategory: 1,
      heighLightIndex: -1,

      textInput: '',
      discriptionText: '',

      selectedType: this.listOfPollType[0],
      pollCategory: [],
      // Customizable Area End 
    }
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
    // Customizable Area End
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

      if (apiRequestCallId !== null) {
        if (apiRequestCallId === this.apiStockCategory) {
          if (responseJson != undefined) {
            let catogary = []
            for (let i = 0; i < responseJson.length; i++) {
              const element = responseJson[i]
              if (element.name == "stocks") {
                let detail1 = {
                  id: element.id,
                  name: element.name,
                  type: "BSE"
                }
                let detail2 = {
                  id: element.id,
                  name: element.name,
                  type: "NSE"
                }
                catogary.push(detail1)
                catogary.push(detail2)
              } else {
                catogary.push(element)
              }
            }
            this.setState({ pollCategory: catogary, isLoading: false })
          } else {
            this.setState({ pollCategory: [], isLoading: false })
          }
        }
      }
      // Customizable Area End
    }
  }

  async componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
    this.props.navigation.addListener('blur', () => {
      this.setState({ heighLightIndex: -1, isExpandMore: false, isLoading: true })
      this.backHandler && this.backHandler?.remove()
      // BackHandler.removeEventListener('hardwareBackPress', this.backAction);
    })
    // this.getmarketCatogary()
    this.setState({ isLoading: false, pollCategory: listOfCatogary, selectedCategory: 1 })
    this.props.navigation.addListener('focus', () => {
      this.backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        this.backAction
      );
      // this.getmarketCatogary()
      this.setState({ isLoading: false, pollCategory: listOfCatogary, })
    })
  }

  backAction = (): any => {
    this.setState({ selectedType: this.listOfPollType[0], selectedCategory: 1 })
  }

  getmarketCatogary = async () => {
    let token = await getStorageData("Token")
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
  }

  goBack = () => {
    this.setState({ selectedType: this.listOfPollType[0], selectedCategory: 1 })
    this.props.navigation.goBack()
  }

  goToFinalCard = () => {
    let data = {
      discription: this.state.discriptionText,
      pollType: this.state.selectedType,
      category: this.state.pollCategory[this.state.selectedCategory],
    }

    let selectedPoll = this.state.selectedType.name
    setEvent("opigo poll clicked", { selectedPoll })
    this.props.navigation.navigate("OpiGoPollFinal", { data: data })
  }

  changeDisc = (text: string | any[]) => {
    this.setState({ discriptionText: text })
  }
  // Customizable Area End
}

