import React from "react";
import { Provider } from "react-redux";

import { store } from "./store/store";
import { AppRouter } from "./routers/AppRouter";

// ESTO ES PARA LA INTERNACIONALIZACION
import { ConfigProvider } from "antd";
import esES from "antd/lib/locale/es_ES";

export const TrackingApp = () => {
  return (
    <Provider store={store}>
      <ConfigProvider locale={esES}>
        <AppRouter />
      </ConfigProvider>
    </Provider>
  );
};
