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
import { LoginViewModel, LoginViewData, LoginAction } from "./features/login/index";

export default function App() {
  const viewmodel = useMemo(() => new LoginViewModel(), []);

  const [data, setData] = useState<LoginViewData>(() => viewmodel.getInitialData());

  useEffect(() => {
    setData(viewmodel.getInitialData());
  }, [viewmodel]);

  const dispatch = useCallback(
    async (action: LoginAction) => {
      const next = await viewmodel.dispatch(action);
      setData(next);
    },
    [viewmodel],
  );

  // Lazy import the view surface to keep feature boundaries
  const { LoginView } = require("./features/login/login.view");

  return (
    <SafeAreaView>
      <LoginView data={data} dispatch={dispatch} />
    </SafeAreaView>
  );
}
