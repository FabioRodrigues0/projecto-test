import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TabParamList } from "../types/navigation";
import DashboardScreen from "../app/(tabs)/dashboard";
import ProfileScreen from "../app/(tabs)/profile";

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator: React.FC = () => (
  <Tab.Navigator>
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Perfil" component={ProfileScreen} />
  </Tab.Navigator>
);

export default TabNavigator;
