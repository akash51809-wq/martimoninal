import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";
import { Colors } from "../../constants/colors";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "gold" | "danger";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const getContainerStyle = (): ViewStyle => {
    switch (variant) {
      case "secondary":
        return { backgroundColor: Colors.secondary };
      case "gold":
        return { backgroundColor: Colors.gold };
      case "danger":
        return { backgroundColor: Colors.danger };
      case "outline":
        return {
          backgroundColor: "transparent",
          borderWidth: 1.5,
          borderColor: Colors.primary,
        };
      case "primary":
      default:
        return { backgroundColor: Colors.primary };
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case "outline":
        return { color: Colors.primary, fontWeight: "600" };
      case "gold":
        return { color: Colors.textPrimary, fontWeight: "700" };
      default:
        return { color: Colors.surface, fontWeight: "700" };
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case "small":
        return { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 };
      case "large":
        return { paddingVertical: 15, paddingHorizontal: 24, borderRadius: 14 };
      case "medium":
      default:
        return { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12 };
    }
  };

  const getTextSizeStyle = (): TextStyle => {
    switch (size) {
      case "small":
        return { fontSize: 13 };
      case "large":
        return { fontSize: 16 };
      case "medium":
      default:
        return { fontSize: 14 };
    }
  };

  const isInteractive = !disabled && !loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!isInteractive}
      activeOpacity={0.8}
      style={[
        styles.base,
        getContainerStyle(),
        getSizeStyle(),
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "outline" ? Colors.primary : Colors.surface}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon ? <View style={styles.iconWrapper}>{icon}</View> : null}
          <Text
            style={[
              styles.textBase,
              getTextStyle(),
              getTextSizeStyle(),
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    marginRight: 8,
  },
  textBase: {
    letterSpacing: 0.2,
  },
  disabled: {
    opacity: 0.5,
  },
});
