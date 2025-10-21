"use client";
import { store } from "@/lib/stores/store";
import { Provider } from "react-redux";
import AuthInitializer from "./AuthInitializer";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      {children}
    </Provider>
  );
}
