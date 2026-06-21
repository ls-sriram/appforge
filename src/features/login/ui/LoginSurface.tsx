import React from "react";
import type { TextInput } from "react-native";
import { ViewProps } from "../../../platform/core/types";
import { Body, Button, noopUi, type UiStamp, YStack } from "../../../platform/ui/index";
import { CenteredPageLayout } from "../../../platform/ui/layouts/index";
import { AuthFieldBlock } from "../../auth/ui/blocks/AuthFieldBlock";
import { AuthFormBlock } from "../../auth/ui/blocks/AuthFormBlock";
import { AuthSubmitBlock } from "../../auth/ui/blocks/AuthSubmitBlock";
import { LoginAction, LoginViewData } from "../LoginController";
import { app } from "../../../config/app";

type Props = ViewProps<LoginViewData, LoginAction>;

type LoginSurfaceProps = Props & {
  ui?: UiStamp;
};

export function LoginSurface({ ui = noopUi, data, dispatch }: LoginSurfaceProps) {
  const passwordRef = React.useRef<TextInput | undefined>(undefined);

  return (
    <CenteredPageLayout>
      <AuthFormBlock
        ui={ui.scope("form")}
        subtitle={app.copy.auth.loginSubtitle}
        showTerms
        footer={{
          prompt: "Don't have an account yet?",
          linkLabel: "Sign Up",
          onPress: () => dispatch({ type: "go_to_register" }),
        }}
      >
        <YStack {...ui("fields")} gap="$4">
          <AuthFieldBlock
            ui={ui.scope("email-field")}
            icon="mail"
            placeholder="Email"
            value={data.email}
            onChangeText={(value) => dispatch({ type: "email_changed", value })}
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => passwordRef.current?.focus()}
            testID="email-input"
          />
          <AuthFieldBlock
            ui={ui.scope("password-field")}
            inputRef={passwordRef}
            icon="key"
            placeholder="Password"
            value={data.password}
            onChangeText={(value) => dispatch({ type: "password_changed", value })}
            secureTextEntry
            autoComplete="current-password"
            returnKeyType="done"
            onSubmitEditing={() => dispatch({ type: "submit" })}
            testID="password-input"
          />
          <Button
            {...ui("forgot-link")}
            onPress={() => dispatch({ type: "go_to_forgot_password" })}
            bg="transparent"
            alignSelf="flex-start"
            p={0}
            minHeight={0}
          >
            <Body {...ui("forgot-link-label")} color="$primary">Forgot Password?</Body>
          </Button>
          <AuthSubmitBlock
            ui={ui.scope("submit")}
            label="Login →"
            loading={data.loading}
            generalError={data.generalError}
            onPress={() => dispatch({ type: "submit" })}
            testID="submit-button"
          />
        </YStack>
      </AuthFormBlock>
    </CenteredPageLayout>
  );
}
