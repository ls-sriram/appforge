import React from "react";
import { Text, View } from "react-native";
import { Pressable } from "../pressable/Pressable";
import { Icon } from "../icon/Icon";

import type { SelectContract } from "./select.styles";
import type { SelectOption, SelectProps } from "./select.contract";
export type { SelectContract };
export type { SelectOption, SelectProps };
export { SelectSchema, SelectOptionSchema } from "./select.contract";

export function Select({
  contract,
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  label,
  helperText,
  disabled = false,
  testID,
}: SelectProps) {
  const s = contract;

  const [open, setOpen] = React.useState(false);
  const selected = options.find((o) => o.value === value);
  const ix = s.interaction;

  const handleSelect = React.useCallback(
    (nextValue: string) => { onValueChange(nextValue); setOpen(false); },
    [onValueChange],
  );

  const swatchSize = Math.max(12, s.icon.size - 2);

  const renderSwatch = (color: string | undefined) =>
    color ? (
      <View
        style={{
          width: swatchSize,
          height: swatchSize,
          borderRadius: swatchSize / 2,
          backgroundColor: color,
          borderWidth: 1,
          borderColor: s.menu.borderColor,
        }}
      />
    ) : null;

  return (
    <View style={{ gap: s.layout.fieldGap, position: "relative", zIndex: open ? 100 : undefined }} testID={testID}>
      {label ? (
        <Text style={{ color: s.label.color, fontSize: s.label.fontSize, fontFamily: s.text.fontFamily }}>{label}</Text>
      ) : null}

      <Pressable
        accessibilityLabel={label ?? placeholder}
        expanded={open}
        disabled={disabled}
        onPress={() => setOpen((v) => !v)}
        testID={testID ? `${testID}-trigger` : undefined}
      >
        {({ pressed, hovered, focused }) => {
          const activeStyle = focused ? ix?.focused : pressed ? ix?.pressed : hovered ? ix?.hover : undefined;
          const opacity = disabled ? (ix?.disabledOpacity ?? 0.5)
            : (activeStyle as { opacity?: number } | undefined)?.opacity ?? 1;
          const activeBorderWidth = (activeStyle as { borderWidth?: number } | undefined)?.borderWidth;

          return (
            <View
              style={{
                backgroundColor: activeStyle?.backgroundColor ?? s.trigger.backgroundColor,
                borderColor: activeStyle?.borderColor ?? s.trigger.borderColor,
                borderWidth: activeBorderWidth ?? s.trigger.borderWidth,
                borderRadius: s.trigger.borderRadius,
                minHeight: s.trigger.minHeight,
                paddingVertical: s.trigger.paddingVertical,
                paddingHorizontal: s.trigger.paddingHorizontal,
                flexDirection: "row",
                alignItems: "center",
                gap: s.trigger.gap,
                opacity,
              }}
            >
              {renderSwatch(selected?.swatch)}
              <View style={{ flex: 1 }}>
                <Text style={{ color: selected ? s.text.color : s.text.placeholderColor, fontSize: s.option.fontSize, fontFamily: s.text.fontFamily }}>
                  {selected?.label ?? placeholder}
                </Text>
              </View>
              <Icon color={s.icon.color} name="chevron-down" size={s.icon.size} />
            </View>
          );
        }}
      </Pressable>

      {open ? (
        <View
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: 4,
            zIndex: 1000,
            backgroundColor: s.menu.backgroundColor,
            borderWidth: s.trigger.borderWidth,
            borderColor: s.menu.borderColor,
            borderRadius: s.menu.borderRadius,
            overflow: "hidden",
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.28,
            shadowRadius: 24,
            elevation: 8,
          }}
          testID={testID ? `${testID}-menu` : undefined}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <Pressable
                key={option.value}
                accessibilityLabel={option.label}
                selected={isSelected}
                disabled={option.disabled}
                onPress={() => handleSelect(option.value)}
                testID={testID ? `${testID}-option-${option.value}` : undefined}
              >
                {({ focused }) => (
                  <View
                    style={{
                      backgroundColor: focused
                        ? (ix?.focused?.backgroundColor ?? s.option.selectedBackgroundColor)
                        : isSelected
                          ? s.option.selectedBackgroundColor
                          : "transparent",
                      paddingVertical: s.trigger.paddingVertical,
                      paddingHorizontal: s.trigger.paddingHorizontal,
                      borderBottomWidth: index === options.length - 1 ? 0 : 1,
                      borderBottomColor: s.menu.borderColor,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: s.trigger.gap,
                      opacity: option.disabled ? (ix?.disabledOpacity ?? 0.5) : 1,
                    }}
                  >
                    {renderSwatch(option.swatch)}
                    <View style={{ flex: 1, gap: s.option.rowGap }}>
                      <Text
                        style={{
                          color: isSelected ? s.option.selectedColor : s.option.color,
                          fontSize: s.option.fontSize,
                          fontWeight: (isSelected ? s.option.selectedFontWeight : s.option.fontWeight) as any,
                          fontFamily: s.text.fontFamily,
                        }}
                      >
                        {option.label}
                      </Text>
                      {option.description ? (
                        <Text style={{ color: s.option.descriptionColor, fontSize: s.option.descriptionFontSize, fontFamily: s.text.fontFamily }}>
                          {option.description}
                        </Text>
                      ) : null}
                    </View>
                    {isSelected ? <Icon color={s.icon.selectedColor} name="check" size={s.icon.size} /> : null}
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {helperText ? (
        <Text style={{ color: s.helper.color, fontSize: s.helper.fontSize, fontFamily: s.text.fontFamily }}>{helperText}</Text>
      ) : null}
    </View>
  );
}
