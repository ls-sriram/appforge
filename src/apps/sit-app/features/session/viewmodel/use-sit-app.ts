import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import {
  BREATH_CYCLE,
  DHAMMAPADA_QUOTES,
  PHILOSOPHY_TOPICS,
  SIT_ONBOARDING_SLIDES,
  SIT_SESSION_TYPE_LABELS,
  type PhilosophyTopic,
  type SitOnboardingSlide,
  type SitSessionType,
  type SitSurface,
  type VipassanaSession,
  VIPASSANA_SESSIONS,
} from "../domain/content";
import { useSitTimer } from "./use-sit-timer";

type VipassanaSessionStatus = "done" | "active" | "upcoming";

type VipassanaSessionState = VipassanaSession & {
  status: VipassanaSessionStatus;
};

const ONBOARDING_KEY = "appforge.sit-app.onboarding.complete";

function minuteOfDay(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

function buildVipassanaSchedule() {
  const now = minuteOfDay(new Date());
  let activeIndex = -1;

  for (let index = VIPASSANA_SESSIONS.length - 1; index >= 0; index -= 1) {
    const session = VIPASSANA_SESSIONS[index];
    if (now >= session.startHour * 60 + session.startMin) {
      activeIndex = index;
      break;
    }
  }

  const schedule: VipassanaSessionState[] = VIPASSANA_SESSIONS.map((session, index) => ({
    ...session,
    status: activeIndex < 0 ? "upcoming" : index < activeIndex ? "done" : index === activeIndex ? "active" : "upcoming",
  }));

  const active = activeIndex >= 0 ? schedule[activeIndex] : null;
  const nextSit = schedule.find((session) => session.status === "upcoming" && session.kind === "sit") ?? null;
  const totalSits = schedule.filter((session) => session.kind === "sit").length;
  const doneSits = schedule.filter((session) => session.kind === "sit" && session.status === "done").length;

  return {
    schedule,
    active,
    nextSit,
    allDone: totalSits > 0 && totalSits === doneSits,
  };
}

export function useSitApp() {
  const [surface, setSurface] = React.useState<SitSurface>("landing");
  const [returnSurface, setReturnSurface] = React.useState<SitSurface>("landing");
  const [sessionType, setSessionType] = React.useState<SitSessionType>("anapana");
  const [sessionMinutes, setSessionMinutes] = React.useState(10);
  const [intentionText, setIntentionText] = React.useState("");
  const [taskText, setTaskText] = React.useState("");
  const [openTopicId, setOpenTopicId] = React.useState<string | null>(PHILOSOPHY_TOPICS[0]?.id ?? null);
  const [scheduleExpanded, setScheduleExpanded] = React.useState(false);
  const [onboardingStatus, setOnboardingStatus] = React.useState<"loading" | "needed" | "done">("loading");
  const [onboardingIndex, setOnboardingIndex] = React.useState(0);
  const [breathPhrase, setBreathPhrase] = React.useState(BREATH_CYCLE[0].word);
  const [completionQuoteIndex, setCompletionQuoteIndex] = React.useState(0);
  const [completionContinueSurface, setCompletionContinueSurface] = React.useState<SitSurface>("landing");
  const [activeTimerKind, setActiveTimerKind] = React.useState<"timer" | "focus">("timer");
  const quoteIndexRef = React.useRef(0);
  const breathTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const showCompletion = React.useCallback((nextSurface: SitSurface) => {
    setCompletionQuoteIndex(quoteIndexRef.current);
    quoteIndexRef.current = (quoteIndexRef.current + 1) % DHAMMAPADA_QUOTES.length;
    setCompletionContinueSurface(nextSurface);
    setSurface("completion");
  }, []);

  const meditationTimer = useSitTimer({
    onComplete: () => {
      setBreathPhrase(BREATH_CYCLE[0].word);
      showCompletion("intention");
    },
  });

  const focusTimer = useSitTimer({
    onComplete: () => {
      setIntentionText("");
      showCompletion("landing");
    },
  });

  React.useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(ONBOARDING_KEY).then((value) => {
      if (cancelled) return;
      setOnboardingStatus(value === "true" ? "done" : "needed");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    if (!(surface === "timer" && activeTimerKind === "timer")) {
      if (breathTimeoutRef.current) {
        clearTimeout(breathTimeoutRef.current);
        breathTimeoutRef.current = null;
      }
      return;
    }

    let active = true;
    let index = 0;

    const run = () => {
      if (!active) return;
      const phase = BREATH_CYCLE[index % BREATH_CYCLE.length];
      index += 1;
      setBreathPhrase(phase.word);
      breathTimeoutRef.current = setTimeout(run, phase.ms);
    };

    run();

    return () => {
      active = false;
      if (breathTimeoutRef.current) {
        clearTimeout(breathTimeoutRef.current);
        breathTimeoutRef.current = null;
      }
    };
  }, [activeTimerKind, surface]);

  const vipassana = React.useMemo(() => buildVipassanaSchedule(), [surface]);

  const nextOnboarding = React.useCallback(() => {
    setOnboardingIndex((current) => Math.min(current + 1, SIT_ONBOARDING_SLIDES.length - 1));
  }, []);

  const completeOnboarding = React.useCallback(async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    setOnboardingStatus("done");
  }, []);

  const goHome = React.useCallback(() => {
    setSurface("landing");
  }, []);

  const enterMeditationSetup = React.useCallback(() => {
    setSurface("meditation");
  }, []);

  const enterIntentionSetup = React.useCallback(() => {
    setSurface("intention");
  }, []);

  const openPhilosophy = React.useCallback(() => {
    setReturnSurface(surface);
    setSurface("philosophy");
  }, [surface]);

  const openVipassana = React.useCallback(() => {
    setReturnSurface(surface);
    setSurface("vipassana");
  }, [surface]);

  const closeOverlay = React.useCallback(() => {
    setSurface(returnSurface);
  }, [returnSurface]);

  const beginMeditation = React.useCallback(() => {
    setActiveTimerKind("timer");
    meditationTimer.start(sessionMinutes * 60);
    setSurface("timer");
  }, [meditationTimer, sessionMinutes]);

  const beginVipassanaSession = React.useCallback(() => {
    setSessionType("vipassana");
    setSessionMinutes(vipassana.active?.duration ?? 20);
    setActiveTimerKind("timer");
    meditationTimer.start((vipassana.active?.duration ?? 20) * 60);
    setSurface("timer");
  }, [meditationTimer, vipassana.active]);

  const beginFocus = React.useCallback(() => {
    const nextTaskText = intentionText.trim();
    if (!nextTaskText) return;
    setTaskText(nextTaskText);
    setActiveTimerKind("focus");
    focusTimer.start(sessionMinutes * 60);
    setSurface("focus");
  }, [focusTimer, intentionText, sessionMinutes]);

  const cancelActiveTimer = React.useCallback(() => {
    if (activeTimerKind === "focus") {
      focusTimer.stop();
      setSurface("intention");
      return;
    }
    meditationTimer.stop();
    setSurface(returnSurface === "vipassana" ? "vipassana" : "meditation");
  }, [activeTimerKind, focusTimer, meditationTimer, returnSurface]);

  const continueFromCompletion = React.useCallback(() => {
    setSurface(completionContinueSurface);
  }, [completionContinueSurface]);

  const toggleTopic = React.useCallback((topicId: string) => {
    setOpenTopicId((current) => (current === topicId ? null : topicId));
  }, []);

  const toggleSchedule = React.useCallback(() => {
    setScheduleExpanded((current) => !current);
  }, []);

  const currentTimer = activeTimerKind === "focus" ? focusTimer : meditationTimer;
  const completionQuote = DHAMMAPADA_QUOTES[completionQuoteIndex];
  const currentOnboardingSlide = SIT_ONBOARDING_SLIDES[onboardingIndex] as SitOnboardingSlide;
  const timerTitle = activeTimerKind === "focus" ? taskText || "focus" : SIT_SESSION_TYPE_LABELS[sessionType];
  const timerCaption = activeTimerKind === "focus" ? "one thing only" : breathPhrase;
  const timerValue = `${String(Math.floor(currentTimer.secondsLeft / 60)).padStart(2, "0")}:${String(currentTimer.secondsLeft % 60).padStart(2, "0")}`;

  return {
    surface,
    sessionType,
    sessionMinutes,
    intentionText,
    onboardingStatus,
    onboardingIndex,
    onboardingTotal: SIT_ONBOARDING_SLIDES.length,
    currentOnboardingSlide,
    openTopicId,
    scheduleExpanded,
    timerSecondsLeft: currentTimer.secondsLeft,
    timerProgress: currentTimer.progress,
    timerTitle,
    timerValue,
    timerCaption,
    completionQuote,
    philosophyTopics: PHILOSOPHY_TOPICS as PhilosophyTopic[],
    vipassanaSchedule: vipassana.schedule,
    activeVipassanaSession: vipassana.active,
    nextVipassanaSit: vipassana.nextSit,
    vipassanaAllDone: vipassana.allDone,
    nextOnboarding,
    completeOnboarding,
    enterMeditationSetup,
    enterIntentionSetup,
    openPhilosophy,
    openVipassana,
    closeOverlay,
    goHome,
    setSessionType,
    setSessionMinutes,
    setIntentionText,
    beginMeditation,
    beginVipassanaSession,
    beginFocus,
    cancelActiveTimer,
    continueFromCompletion,
    toggleTopic,
    toggleSchedule,
  };
}
