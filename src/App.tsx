/**
 * ─────────────────────────────────────────────────────────────────
 * APP — Entry point. Wires Controller to View.
 *
 * The controller owns state and dispatches updates to the view.
 * On mount, the controller sets initial data.
 * On every action, the view re-renders with new data.
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native";
import { LoginController, LoginViewData, LoginAction, FirebaseLoginModel } from "./features/login";

export default function App() {
  const controller = useMemo(() => {
    const model = new FirebaseLoginModel();
    return new LoginController(model);
  }, []);

  const [data, setData] = useState<LoginViewData>(() => controller.getInitialData());

  useEffect(() => {
    setData(controller.getInitialData());
  }, [controller]);

  const dispatch = useCallback(
    async (action: LoginAction) => {
      const next = await controller.dispatch(action);
      setData(next);
    },
    [controller],
  );

  // Lazy import the view surface to keep feature boundaries
  const { LoginView } = require("./features/login/ui/views/LoginView");

  return (
    <SafeAreaView>
      <LoginView data={data} dispatch={dispatch} />
    </SafeAreaView>
  );
}
