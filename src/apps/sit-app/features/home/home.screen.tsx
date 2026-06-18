import React from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView, Theme, YStack } from "../../../../ui";
import { SitActionLayout } from "./sit-action.layout";
import { SitCompletionLayout } from "./sit-completion.layout";
import { SitLandingLayout } from "./sit-landing.layout";
import { SitMeditateLayout } from "./sit-meditate.layout";
import { SitOnboardingLayout } from "./sit-onboarding.layout";
import { SitPhilosophyLayout } from "./sit-philosophy.layout";
import { SitTimerLayout } from "./sit-timer.layout";
import { SitVipassanaLayout } from "./sit-vipassana.layout";
import { useSitApp } from "../session/viewmodel/use-sit-app";

export function SitAppHomeScreen() {
  const app = useSitApp();

  if (app.onboardingStatus === "loading") {
    return (
      <Theme name="dark">
        <SafeAreaView style={{ flex: 1 }}>
          <YStack f={1} ai="center" jc="center" bg="$bg">
            <ActivityIndicator size="large" />
          </YStack>
        </SafeAreaView>
      </Theme>
    );
  }

  if (app.onboardingStatus === "needed") {
    return (
      <Theme name="dark">
        <SitOnboardingLayout
          slide={app.currentOnboardingSlide}
          index={app.onboardingIndex}
          total={app.onboardingTotal}
          onNext={app.nextOnboarding}
          onComplete={() => {
            void app.completeOnboarding();
          }}
        />
      </Theme>
    );
  }

  let screen: React.ReactNode;
  switch (app.surface) {
    case "landing":
      screen = (
        <SitLandingLayout
          onMeditate={app.enterMeditationSetup}
          onAction={app.enterIntentionSetup}
          onVipassana={app.openVipassana}
          onInfo={app.openPhilosophy}
        />
      );
      break;
    case "meditation":
      screen = (
        <SitMeditateLayout
          sessionType={app.sessionType}
          sessionMinutes={app.sessionMinutes}
          onBack={app.goHome}
          onInfo={app.openPhilosophy}
          onSelectSessionType={app.setSessionType}
          onSelectSessionMinutes={app.setSessionMinutes}
          onBegin={app.beginMeditation}
        />
      );
      break;
    case "intention":
      screen = (
        <SitActionLayout
          intentionText={app.intentionText}
          sessionMinutes={app.sessionMinutes}
          onChangeIntentionText={app.setIntentionText}
          onSelectSessionMinutes={app.setSessionMinutes}
          onBegin={app.beginFocus}
          onBack={app.goHome}
          onInfo={app.openPhilosophy}
        />
      );
      break;
    case "timer":
    case "focus":
      screen = (
        <SitTimerLayout
          eyebrow={app.timerTitle}
          timer={app.timerValue}
          caption={app.timerCaption}
          endLabel={app.surface === "focus" ? "done" : "end"}
          onBack={app.cancelActiveTimer}
        />
      );
      break;
    case "completion":
      screen = (
        <SitCompletionLayout
          quote={app.completionQuote.text}
          attribution={app.completionQuote.attribution}
          onContinue={app.continueFromCompletion}
        />
      );
      break;
    case "philosophy":
      screen = (
        <SitPhilosophyLayout
          topics={app.philosophyTopics}
          openTopicId={app.openTopicId}
          onToggleTopic={app.toggleTopic}
          onBack={app.closeOverlay}
        />
      );
      break;
    case "vipassana":
      screen = (
        <SitVipassanaLayout
          schedule={app.vipassanaSchedule}
          activeSession={app.activeVipassanaSession}
          scheduleExpanded={app.scheduleExpanded}
          onToggleSchedule={app.toggleSchedule}
          onBack={app.closeOverlay}
          onInfo={app.openPhilosophy}
          onBegin={app.beginVipassanaSession}
        />
      );
      break;
    default:
      screen = null;
  }

  return <Theme name="dark">{screen}</Theme>;
}
