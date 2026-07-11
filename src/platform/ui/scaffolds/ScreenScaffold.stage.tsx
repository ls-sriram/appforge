import React from "react";
import { Text, View } from "react-native";
import { createUi } from "../viz";
import { ScreenScaffold } from "./ScreenScaffold.scaffold";

export function ScrollingScreenScaffoldStage() {
  const ui = createUi("screen-scaffold-scroll-stage");

  return (
    <ScreenScaffold
      header={<Text>Fixed header</Text>}
      footer={<Text>Fixed footer</Text>}
      scroll
      ui={ui}
    >
      {Array.from({ length: 20 }, (_, index) => (
        <View
          key={index}
          nativeID={ui(`row-${index}`, `Scrollable row ${index + 1}`).__uiid}
          style={{ padding: 12 }}
          testID={ui(`row-${index}`, `Scrollable row ${index + 1}`).__uiid}
        >
          <Text>Scrollable row {index + 1}</Text>
        </View>
      ))}
    </ScreenScaffold>
  );
}

export function FixedScreenScaffoldStage() {
  const ui = createUi("screen-scaffold-fixed-stage");

  return (
    <ScreenScaffold ui={ui}>
      <View
        nativeID={ui("center", "Centered fill content").__uiid}
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        testID={ui("center", "Centered fill content").__uiid}
      >
        <Text>Fill content</Text>
      </View>
    </ScreenScaffold>
  );
}
