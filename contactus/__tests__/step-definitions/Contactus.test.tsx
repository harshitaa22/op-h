import React from 'react'
// import { render, fireEvent } from "react-native-testing-library";
import { shallow, ShallowWrapper } from "enzyme";

import { Message } from '../../../../framework/src/Message';
import MessageEnum, { getName } from '../../../../framework/src/Messages/MessageEnum';
import { runEngine } from '../../../../framework/src/RunEngine';
import Contactus from "../../src/Contactus";

describe('<Contactus />', () => {
  const navigation = {
    goBack: jest.fn(),
    openDrawer: jest.fn()
  }
  test('', () => {
    let instance: Contactus;
    let ContactUsWrapper: ShallowWrapper;
     ContactUsWrapper = shallow(<Contactus navigation={navigation} id={""} />)

    instance = ContactUsWrapper.instance() as Contactus;
    const getConttactUsAPI = new Message(
      getName(MessageEnum.RestAPIResponceMessage)
    );

    getConttactUsAPI.addData(
      getName(MessageEnum.RestAPIResponceSuccessMessage),
      { data: [{ "id": "10", "type": "contact", "attributes": { "name": "Tester", "email": "test@me.com", "phone_number": "13015551212", "description": "None", "created_at": "2021-03-08T23:17:49.068Z", "user": "Firstname Lastname" } }] }
    );
    instance.apiContactusCallId = getConttactUsAPI.messageId;
    // runEngine.sendMessage("Unit Test", getConttactUsAPI);
    instance.componentDidMount();
    // let goBack = rendered.getByTestId('goBack')

    // fireEvent.press(goBack)
    // expect(navigation.goBack).toBeCalledTimes(1)
    // expect(navigation.openDrawer).toBeCalledTimes(1)

    // fireEvent.changeText(rendered.getByTestId('subject'),'subject')
    // fireEvent.changeText(rendered.getByTestId('email'),'email@gmail.com')
    // fireEvent.changeText(rendered.getByTestId('message'),'this is test message')

    // fireEvent.press(rendered.getByTestId('submitTicket'))
  })
})
