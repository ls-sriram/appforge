/**
 * ─────────────────────────────────────────────────────────────────
 * ONBOARDING CAROUSEL — Multi-step onboarding flow.
 *
 * Swipeable carousel with dots, progress, and CTA buttons.
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useState, useRef, useCallback } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../../../theme/ThemeProvider";
import { Text } from "../../../ui/primitives/Text";
import { Button } from "../../../ui/primitives/Button";
import { FeatureCard } from "./FeatureCard";
import type { IconName } from "../../../ui/primitives/Icon";
import { onboarding } from "../../../theme/tokens";
import { useViewport } from "../../../theme/Viewport";

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
  const t = useTheme();
  const viewport = useViewport();
  const screenWidth = viewport.width;
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

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
    <View>
      {/* Carousel */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {steps.map((step, i) => (
          <View
            key={i}
          >
            <FeatureCard
              icon={step.icon}
              title={step.title}
              description={step.description}
            />
          </View>
        ))}
      </ScrollView>

      {/* Dots + Actions */}
      <View
      >
        {/* Pagination Dots */}
        <View>
          {steps.map((_, i) => {
            const isActive = i === activeIndex;
            return (
              <TouchableOpacity
                key={i}
                activeOpacity={0.7}
                onPress={() => scrollTo(i)}
              />
            );
          })}
        </View>

        {/* Actions */}
        <View
        >
          {!isLast && (
            <Button label={skipLabel} variant="ghost" onPress={() => onComplete()} fullWidth />
          )}
          <Button
            label={isLast ? ctaLabel : "Next"}
            variant="primary"
            onPress={() => {
              if (isLast) {
                onComplete();
              } else {
                scrollTo(activeIndex + 1);
              }
            }}
            fullWidth
          />
        </View>
      </View>
    </View>
  );
}
