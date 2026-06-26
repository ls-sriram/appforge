/**
 * ─────────────────────────────────────────────────────────────────
 * ONBOARDING CAROUSEL — Multi-step onboarding flow.
 *
 * Swipeable carousel with dots, progress, and CTA buttons.
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useState, useRef, useCallback } from "react";
import { Body, Button, ScrollView, YStack } from "../../../platform/ui/index";
import { FeatureCard } from "./FeatureCard";
import type { IconName } from "../../../platform/ui/index";
import { useViewport } from "../../../platform/ui/index";

export interface OnboardingStep {
  icon: IconName;
  title: string;
  description: string;
  accent?: string;
}

export interface OnboardingCarouselProps {
  steps: OnboardingStep[];
  onComplete: () => void;
  ctaLabel?: string;
  skipLabel?: string;
}

export function OnboardingCarousel({
  steps,
  onComplete,
  ctaLabel = "Get Started",
  skipLabel = "Skip",
}: OnboardingCarouselProps) {
  const viewport = useViewport();
  const screenWidth = viewport.width;
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<React.ElementRef<typeof ScrollView>>(null);

  const handleScroll = useCallback(
    (e: any) => {
      const x = e.nativeEvent.contentOffset.x;
      const index = Math.round(x / screenWidth);
      setActiveIndex(index);
    },
    [screenWidth]
  );

  const scrollTo = useCallback(
    (index: number) => {
      scrollRef.current?.scrollTo({ x: index * screenWidth, animated: true });
      setActiveIndex(index);
    },
    [screenWidth]
  );

  const isLast = activeIndex === steps.length - 1;

  return (
    <YStack>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {steps.map((step, i) => (
          <YStack key={i}>
            <FeatureCard
              icon={step.icon}
              title={step.title}
              description={step.description}
            />
          </YStack>
        ))}
      </ScrollView>

      <YStack>
        <YStack fd="row" gap="$2">
          {steps.map((_, i) => (
            <YStack
              key={i}
              onPress={() => scrollTo(i)}
              pressStyle={{ opacity: 0.7 }}
              cursor="pointer"
            />
          ))}
        </YStack>

        <YStack gap="$3">
          {!isLast && (
            <Button onPress={() => onComplete()} bg="transparent" w="100%">
              <Body>{skipLabel}</Body>
            </Button>
          )}
          <Button
            onPress={() => { if (isLast) { onComplete(); } else { scrollTo(activeIndex + 1); } }}
            bg="$primary"
            w="100%"
          >
            <Body color="$textInverse" fontFamily="$bold">{isLast ? ctaLabel : "Next"}</Body>
          </Button>
        </YStack>
      </YStack>
    </YStack>
  );
}
