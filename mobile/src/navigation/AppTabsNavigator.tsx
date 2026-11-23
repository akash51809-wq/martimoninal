import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Compass,
  Search,
  Heart,
  MessageCircle,
  User,
} from "lucide-react-native";
import { Colors } from "../constants/colors";
import type { MainTabsParamList } from "./types";
import { HomeScreen } from "../screens/main/HomeScreen";
import { DiscoverScreen } from "../screens/main/DiscoverScreen";
import { AdvancedSearchScreen } from "../screens/main/AdvancedSearchScreen";
import { InterestsScreen } from "../screens/main/InterestsScreen";
import { ChatListScreen } from "../screens/main/ChatListScreen";

const Tab = createBottomTabNavigator<MainTabsParamList>();

export const AppTabsNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: "Overview",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="DiscoverTab"
        component={DiscoverScreen}
        options={{
          tabBarLabel: "Discover",
          tabBarIcon: ({ color, size }) => <Compass size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={AdvancedSearchScreen}
        options={{
          tabBarLabel: "Search",
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="InterestsTab"
        component={InterestsScreen}
        options={{
          tabBarLabel: "Interests",
          tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="ChatTab"
        component={ChatListScreen}
        options={{
          tabBarLabel: "Messages",
          tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};
