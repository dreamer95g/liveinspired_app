import React from "react";
import { SideBar } from "./SideBar";
import { Header } from "./Header";
import { DashBoardRoutes } from "../../routers/DashBoardRoutes";

export const DashboardLayout = ({ history }) => {
  return (
    <>
      <div className="flex h-screen font-roboto ">
        <SideBar />

        <div className="flex-1 flex flex-col overflow-hidden ">
          <Header history={history} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto ">
            <div className="container mx-auto px-6 py-8">
              <DashBoardRoutes />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};
