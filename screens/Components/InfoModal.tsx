import React, { Component } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { Fonts } from "../../../../../components/src/Utils/Fonts";
import {
  deviceHeight,
  deviceWidth,
  scaledSize,
  widthFromPercentage,
} from "../../../../../framework/src/Utilities";
import colors from "../../../../PushNotifications/src/colors";
import { success } from "../../assets";
import AntDesign from "react-native-vector-icons/AntDesign";
import { configJSON } from "../../PollingController";
import { navigate } from "../../../../../mobile/Navigation/RootNavigation";
import { setEvent } from "../../../../../components/src/Utils/service";

type MyProps = {
  visible: boolean;
  onCancel: any;
  onPress: any;
  isLoading: any;
  title: string;
  text1?: string;
  text2?: string;
};
export class InfoModal extends Component<MyProps> {
  state = {
    agreeTemrs: true,
  };
  render() {
    return (
      <Modal
        onRequestClose={() => {
          if (!this.props.isLoading) {
            this.setState({ agreeTemrs: false });
            this.props.onCancel();
          }
        }}
        visible={this.props.visible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.container}>
          <TouchableWithoutFeedback
            onPress={() => {
              if (!this.props.isLoading) {
                this.setState({ agreeTemrs: false });
                this.props.onCancel();
              }
            }}
          >
            <View style={styles.background} />
          </TouchableWithoutFeedback>
          <View style={styles.contentContainer}>
            <AntDesign
              name="closecircleo"
              size={scaledSize(18)}
              color={colors.black}
              style={{ alignSelf: "flex-end" }}
              onPress={() => this.props.onCancel()}
            />
            <Image style={styles.Image} source={success} />

            <Text
              style={[
                styles.fontFamilyMedium,
                { marginBottom: scaledSize(15), textAlign: 'center' },
              ]}>
              Let's create your first card
            </Text>
            <Text
              style={[
                {
                  color: colors.gray,
                  fontSize: scaledSize(16),
                  marginBottom: scaledSize(15),
                  textAlign: 'center'
                },
              ]}
            >
              Do you have a bullish or a bearish view for any stock? Share it
              with the community using cards
            </Text>

            <View style={styles.button_row}>
              <TouchableOpacity
                onPress={() => {
                  this.props.onCancel(), setEvent("first card popup", {
                    "action": " later"
                  })
                }}
                style={[
                  styles.button_container,
                  { backgroundColor: colors.lightGray },
                ]}

              >
                <Text style={[styles.button_txt, { color: colors.gray }]}>
                  {"Later"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  navigate("Card", {});
                  this.props.onCancel();
                  setEvent("first card popup", {
                    "action": " letsgo"
                  })
                }}
                style={styles.button_container}
              >
                <Text style={[styles.button_txt]}>{"Let's Go"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    backgroundColor: colors.black,
    position: "absolute",
    height: deviceHeight,
    width: deviceWidth,
    opacity: 0.5,
  },
  Image: {
    width: widthFromPercentage(40),
    height: widthFromPercentage(40),
    marginVertical: scaledSize(7),
  },
  contentContainer: {
    backgroundColor: colors.white,
    width: deviceWidth - scaledSize(40),
    borderRadius: scaledSize(10),
    paddingHorizontal: scaledSize(20),
    paddingVertical: scaledSize(20),
    alignItems: "center",
  },
  fontFamilyMedium: {
    fontFamily: Fonts.LIGHT_BOLD,
    fontSize: scaledSize(18),
  },
  terms: {
    fontSize: scaledSize(14),
    color: colors.gray,
    fontFamily: Fonts.REGULAR,
    textAlign: "center",
  },
  termsContainer: {
    flexDirection: "row",
    paddingHorizontal: scaledSize(10),
    alignItems: "center",
  },
  button_row: {
    flexDirection: "row",
    marginTop: scaledSize(5),
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  button_container: {
    backgroundColor: colors.blue,
    width: widthFromPercentage(36),
    borderRadius: scaledSize(10),
    marginBottom: scaledSize(10),
    alignItems: "center",
  },
  button_txt: {
    padding: scaledSize(15),
    color: colors.white,
    fontSize: scaledSize(15),
    fontFamily: Fonts.LIGHT_BOLD,
  },
});

export default InfoModal;
