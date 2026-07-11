import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { Text, View } from "react-native";
import { defaultContracts } from "../../theme/index";
import { CardList } from "./CardList";

describe("CardList", () => {
  it("gives the container and its children list semantics", () => {
    let tree: any;
    act(() => {
      tree = TestRenderer.create(
        <CardList contract={defaultContracts.cardList!.default} accessibilityLabel="Recent projects">
          <Text key="one">One</Text>
          <Text key="two">Two</Text>
        </CardList>,
      );
    });

    expect(tree!.root.findAllByType(View).filter((node: any) => node.props.accessibilityRole === "list")).toHaveLength(1);
    expect(tree!.root.findAllByType(Text)).toHaveLength(2);
  });
});
