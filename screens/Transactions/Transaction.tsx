import React from "react";
import {
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
//library
import { SafeAreaView } from "react-native-safe-area-context";
//controller
import TransactionController from "./TransactionController";
// /framework
import { scaledSize } from "../../../../../framework/src/Utilities";
//assets
import { icons } from "../../assets";
//colors
import colors from "../../colors";
//fonts
import { Fonts } from "../../../../../components/src/Utils/Fonts";
//library
import Icon from "react-native-vector-icons/MaterialIcons";

export class Transaction extends TransactionController {
  render() {
    return (
      <>
        <SafeAreaView
          forceInset={{
            top: Platform.OS == "android" ? "always" : "never",
            bottom: "never",
          }}
          style={styles.container}
        >
          <View
            style={{
              paddingTop: scaledSize(10),
              backgroundColor: colors.white,
            }}
          >
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: scaledSize(5),

              }}
            >
              <Text
                style={[
                  styles.fontFamilyBold,
                  {
                    color: colors.black,
                    flex: 1,
                    textAlign: 'center',
                    fontSize: scaledSize(20),
                  },
                ]}
              >
                {"Transactions"}
              </Text>
              <Icon
                testID={"goBack"}
                name={icons.chevron_left}
                size={scaledSize(35)}
                color={colors.black}
                style={{ padding: 0, margin: 0, left: 0, position: 'absolute' }}
                onPress={() => [this.goToBack(), Keyboard.dismiss()]}
              />
            </View>
          </View>
          <View>{this.renderTransation()}</View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,

  },
  fontFamilyRegular: {
    fontFamily: Fonts.REGULAR,
  },
  fontFamilyBold: {
    fontFamily: Fonts.LIGHT_BOLD,
  },
  commonFlex: {
    flex: 1,
  },
  flex: {
    flex: 2,
  },
});

export default Transaction;
