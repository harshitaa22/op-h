// Customizable Area Start
import React from "react";
import { TextInput, View, Keyboard, BackHandler } from 'react-native'
//framework
import { IBlock } from "../../../../../framework/src/IBlock";
import { Message } from "../../../../../framework/src/Message";
import { BlockComponent } from "../../../../../framework/src/BlockComponent";
import MessageEnum, {
  getName
} from "../../../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../../../framework/src/RunEngine";
import { getStorageData, scaledSize } from "../../../../../framework/src/Utilities";
//colors
import colors from "../../colors";
//library
import { CommonActions } from "@react-navigation/native";
import Toast from 'react-native-toast-message'
//components
import { setNavigatedInPolling } from "../../../../../components/src/Utils/service";
import { replaceMentionValues } from "react-native-controlled-mentions";
// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  // Customizable Area Start
  navigation: any;
  id: string;
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  textInput: any;
  inputData: any;
  stocks: any;
  searchedInstrument: any;
  companyDetails: any;
  errorIndexes: any;
  suggestions: any;
  optionSuggestions: any
  compareDetails: any;
  tagList: any

  optionid: string;
  selectedStockName: string;
  userToken: string;
  question: string;
  width: string;
  textInputWidth: string;

  selectedIndex: number;
  changeOnIndex: number;

  scrollEnable: boolean
  activeButton: boolean;
  isPosting: boolean;
  isExpandMore: boolean;
  temp: boolean;
  isFocused: boolean;
  // Customizable Area End
}

interface SS {
  // Customizable Area Start
  id: any;
  // Customizable Area End
}

export default class CustomPollController extends BlockComponent<
  Props,
  S,
  SS
> {

  // Customizable Area Start
  stockCompany: string = 'StockCompany'
  apiUsetCalledId: string = "";
  apiSearchStock: string = "";
  apisearchCompanyDetail: string = "";
  apiPostCustomPoll: string = '';
  backHandler: any
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.RestAPIResponceMessage),
    ];
    this.state = {

      // Customizable Area Start
      textInput: [],
      inputData: [],
      suggestions: [],
      optionSuggestions: [],
      compareDetails: [],
      searchedInstrument: [],
      companyDetails: [],
      errorIndexes: [],
      tagList: [],

      optionid: 'C',
      stocks: [{ input: "" }, { input: "" }],
      selectedStockName: '',
      width: '99.5%',
      question: '',
      userToken: '',
      textInputWidth: '94.5%',

      temp: false,
      isFocused: false,
      isExpandMore: false,
      activeButton: false,
      isPosting: false,
      scrollEnable: true,

      changeOnIndex: -1,
      selectedIndex: -1,
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }

  async receive(from: string, message: Message) {
    if (getName(MessageEnum.RestAPIResponceMessage) == message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      );
      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
      if (apiRequestCallId !== null) {
        if (apiRequestCallId === this.apiSearchStock) {
          if (this.state.selectedStockName !== "") {
            this.state.stocks.map((itemMain: any) => {
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
        else if (apiRequestCallId == this.apiPostCustomPoll) {
          if (responseJson) {
            this.setState({ isPosting: false })
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
        }
        if (apiRequestCallId == this.apiUsetCalledId) {
          if (responseJson.length > 0) {
            this.setState({ suggestions: responseJson })
          }

        }
      }
    }
  }

  async componentDidMount() {
    setTimeout(() => {
      this.setState({ width: "100%", textInputWidth: '95%' })
    }, 0)
    let token = await getStorageData("Token")
    this.setState({ userToken: token })
    this.props.navigation.addListener('focus', () => {
      this.backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        this.backAction
      );
    })
  }

  backAction = (): any => {
    this.setState({ question: '', stocks: [{ input: "" }, { input: "" }] })
  }

  goBack = () => {
    this.backAction()
    this.props.navigation.goBack()
  }

  onChangeText = (data: any, index: number) => {
    this.setState({ searchedInstrument: [] })
    let temp = this.state.stocks[index]
    temp.input = data

    // this.setState({ suggestions: [] })
    // let lastIndex = data.lastIndexOf("@")
    // if (lastIndex != -1) {
    //   let tagdata = data.slice(lastIndex + 1)
    //   if (data.length >= 1) {
    //     this.tagPeople(tagdata)
    //   }
    // }





    // let tempData = this.state.stocks.filter((data: any) => data.input == '')
    // if (!tempData.length) {
    //   this.setState({ activeButton: true })
    // } else {
    //   this.setState({ activeButton: false })
    // }
  }

  removeFromList = (index: number) => {
    this.state.stocks.splice(index, 1)
    this.state.companyDetails.splice(index, 1)
    console.log(this.state.stocks)
    // let data = this.state.stocks.filter((data: any) => data.input == '')
    // if (!data.length) {
    //   this.setState({ activeButton: true })
    // } else {
    //   this.setState({ activeButton: false })
    // }
    this.setState({ temp: !this.state.temp })
  }

  searchStock = (text: any) => {
    const header = {
      "Content-Type": configJSON.httpApiContentType,
      token: this.state.userToken,
    };
    let data = {
      "company": {
        "query": text
      }
    }
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

  // Customizable Area Start
  goToOpigoPoll = () => {
    const msg: Message = new Message(
      getName(MessageEnum.NavigationToOpigoPoll)
    );
    msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    this.send(msg);
  }

  addTextInput = (index: any, styles: any, textInput_container: any, optionid: any) => {
    this.setState({ optionid: String.fromCharCode(optionid.charCodeAt() + 1) })
    let textInput = this.state.textInput;
    textInput.push(<View style={textInput_container}>
      <TextInput style={styles}
        maxLength={30}
        placeholderTextColor={colors.lightGray}
        placeholder={`Option ${this.state.optionid}`}
        onChangeText={(text) => this.addValues(text, index)} />
    </View>);
    this.setState({ textInput });
  }

  manageMention = (item: any) => {
    this.state.compareDetails.push({
      "tag_type": "caption",
      "tagged_type": item.tagged_type,
      "tagged_id": item.id,
      'company_symbol': item?.company_symbol,
      'exchange': item?.exchange,
      'company_name': item?.company_name
    })
    this.setState({ suggestions: [], scrollEnable: true })
  }

  addToList = () => {
    this.state.stocks.push({ input: '' })
    this.setState({ temp: !this.state.temp, activeButton: false })
  }

  hendleTag = (question: any) => {
    this.setState({ suggestions: [] })
    let lastIndex = question.lastIndexOf("@")
    if (lastIndex != -1) {
      let data = question.slice(lastIndex + 1)
      if (data.length >= 1) {
        this.tagPeople(data)
      }
    }
    this.setState({ question })
  }


  hendleOptionTag = (option: any, index: any) => {
    console.log(index, "option", option);

    this.setState({ suggestions: [] })
    let lastIndex = option.lastIndexOf("@")
    if (lastIndex != -1) {
      let data = option.slice(lastIndex + 1)
      if (data.length >= 1) {
        this.tagPeople(data)
      }
    }
    this.setState({ searchedInstrument: [] })
    let temp = this.state.stocks[index]
    temp.input = option
  }


  addValues = (text: any, index: any) => {
    let dataArray = this.state.inputData;
    let checkBool = false;
    if (dataArray.length !== 0) {
      dataArray.forEach((element: any) => {
        if (element.index === index) {
          element.text = text;
          checkBool = true;
        }
      });
    }
    if (checkBool) {
      this.setState({
        inputData: dataArray
      });
    }
    else {
      dataArray.push({ 'text': text, 'index': index });
      this.setState({
        inputData: dataArray
      });
    }
  }

  postPoll = async (type: string) => {




    this.setState({ errorIndexes: [] })
    let data: any = []
    this.state.stocks.map((item: any) => {
      data.push(item.input)
    })
    let errorIndexes: any
    if (data.length == 2) {
      errorIndexes = [0, 1]
    }
    else if (data.length == 3) {
      errorIndexes = [0, 1, 2]
    }
    else if (data.length == 4) {
      errorIndexes = [0, 1, 2, 3]
    }
    else {
      errorIndexes = [0, 1, 2, 3, 4]
    }
    if (this.state.question.length < 5) {
      this.setState({ activeButton: true })
      return
    }
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      if (element != "") {
        if (data[index] == data[index + 1]) {
          Toast.show({
            type: 'success',
            text1: 'Duplicate options are not allowed'
          })
          return
        }
      }
    }
    data.forEach((element: any) => {
      let indexs
      if (element != "") {
        indexs = data.findIndex((item: string) => item == element)
      }
      if (indexs != undefined) {
        if (errorIndexes.includes(indexs)) {
          let index = errorIndexes.indexOf(indexs)
          if (index != -1) {
            errorIndexes.splice(index, 1)
          }
        }
      }
    });
    this.setState({ errorIndexes: errorIndexes })
    if (errorIndexes.length) {
      return
    }
    if (type == "nav") {
      Keyboard.dismiss()
      this.props.navigation.navigate("CustomPollPreview", { data: this.state.stocks, question: this.state.question })
    } else {
      this.setState({ isPosting: true })
      Keyboard.dismiss()
      setNavigatedInPolling(false)




      let companydetails = this.state.compareDetails.filter((data: any) => data.tagged_type == this.stockCompany)
      let caption = replaceMentionValues(this.state.question, ({ id, name }) => {
        let item = companydetails.find((data: any) => data.tagged_id == id)
        if (item) {
          return `<a href="${this.stockCompany}/${item.company_name}/${item.company_symbol}/${item.exchange}/${id}">${name}</a>`
        } else {
          return `<a href="account_block/accounts/${id}">${name}</a>`
        }
      })
      let answer = data.map((item, index) => {


        return replaceMentionValues(item, ({ id, name }) => {
          let item = companydetails.find((data: any) => data.tagged_id == id)
          if (item) {
            return `<a href="${this.stockCompany}/${item.company_name}/${item.company_symbol}/${item.exchange}/${id}">${name}</a>`
          } else {
            return `<a href="account_block/accounts/${id}">${name}</a>`
          }
        })
      })

      // let tagListData = this.state.tagList
      // let x_coordinate = []
      // let y_cordinates = []
      // let tagId = []
      // for (let i = 0; i < tagListData.length; i++) {
      //   const data = tagListData[i];
      //   if (data.full_name != 'null') {
      //     x_coordinate.push(scaledSize(data.locationX))
      //     y_cordinates.push(scaledSize(data.locationY))
      //     tagId.push(data.id)
      //   }
      // }
      // const token = await getStorageData("Token");

      // let formData: any = new FormData();
      // let categotyid = 2
      // formData.append("post[category_id]", categotyid);
      // formData.append("post[caption]", caption);
      // formData.append("post[answer]", answer);
      // if (tagListData.length > 0) {
      //   for (let i = 0; i < tagListData.length; i++) {
      //     const data = tagListData[i];
      //     console.log(data.tagged_type, "formDataformData", data.locationX, "dbfbhjsd", data.locationY);
      //     if (data.full_name != "null") {

      //       formData.append("post[tags_attributes][][tag_coordinate_attributes][x_coordinate]", data.locationX);
      //       formData.append("post[tags_attributes][][tag_coordinate_attributes][y_coordinate]", data.locationY);
      //       formData.append("post[tags_attributes][][tagged_id]", data.id)
      //       formData.append("post[tags_attributes][][tag_type]", "image")
      //       formData.append("post[tags_attributes][][tagged_type]", data.tagged_type)
      //     }
      //   }
      // }
      // let id = await getStorageData("AccountID")
      // formData.append("post[tags_attributes][][tagged_by_user]", id)
      // console.log("formDataformData", formData);



      let body = {
        "poll_type": "custom_poll",
        "question": caption,
        "stock_name": answer,
      }

      // console.log("formDataformData", formData);

      const header = {
        "Content-Type": configJSON.httpApiContentType,
        token: this.state.userToken,
      };

      const requestMessage = new Message(
        getName(MessageEnum.RestAPIRequestMessage)
      );
      this.apiPostCustomPoll = requestMessage.messageId;
      requestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        configJSON.createCustomPoll
      );
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify(header)
      );

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify(body)
        // formData
      );

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestMethodMessage),
        configJSON.httpPostMethod

      );
      runEngine.sendMessage(requestMessage.id, requestMessage);
      return true;
    }
  }

  tagPeople = async (text: any) => {
    const token = await getStorageData("Token");
    let endPoint = configJSON.tagUserApiEndPoint
    endPoint = endPoint + text
    const header = {
      "Content-Type": configJSON.createPostApiContentType,
      token: token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiUsetCalledId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endPoint
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


  // goToPreview = () => {
  //   let data: any = []
  //   this.state.stocks.map((item: any) => {
  //     data.push(item.input)
  //   })

  //   if (new Set(data).size !== data.length) {
  //     Toast.show({
  //       type: 'success',
  //       text1: 'Duplicate options are not allowed'
  //     })
  //     this.setState({ isPosting: false })
  //     return
  //   }
  //   Keyboard.dismiss()
  //   this.props.navigation.navigate("CustomPollPreview", { data: this.state.stocks, question: this.state.question })
  // }

  // Customizable Area End

}
