"use client";
import { store } from "@/lib/stores/store";
import { Provider } from "react-redux";
import AuthInitializer from "./AuthInitializer";
import GetCurrentLocation from "./GetCurrentLocation";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      <GetCurrentLocation />
      {children}
    </Provider>
  );
}
