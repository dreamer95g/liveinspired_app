import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";


import { DashboardLayout } from "../components/ui/DashboardLayout";
import { AuthContainer } from "../components/auth/AuthContainer";
import { useSelector, useDispatch } from "react-redux";
import {useLazyQuery, gql, useMutation, useQuery} from "@apollo/client";
import { LogInAction } from "../actions/auth";

import { ME } from "../graphql/queries/AuthQueries";
import { apollo_client } from "../config/apollo";
import { Loading } from "../components/ui/Loading";

export const AppRouter = ({ history }) => {
  const [whoIam, { data: me }] = useLazyQuery(ME);
  const dispatch = useDispatch();

  const [isAuthenticated, setIsAuthenticated] = useState("");

  const { token } = useSelector((state) => state.auth);
  // const token = localStorage.getItem("_token");

  //observer
  useEffect(async () => {
    if (token !== undefined) {
      setIsAuthenticated(true);
      // history.push('/dashboard')
    } else {
      setIsAuthenticated(false);
      // history.push('/auth/login');
    }
  }, [token, history]);



  useEffect( async () => {
    // console.log(token)

    if (token !== null  && token !== "") {
      // console.log(localStorage.getItem("_token"));
      try {

        apollo_client
            .query({
              query: ME,
            })
            .then((response) => {

              // console.log(response.data.me);
              const access_token = token;
              const { id, name, email, images } = response.data.me;

              dispatch(
                  LogInAction(id, access_token, name, email, images[0].name)
              );
              setIsAuthenticated(true);
            });
      } catch (error) {
        // console.log(error.message);
      }
    } else {
      setIsAuthenticated(false);
    }


  }, []);

  return (
      <>
        <Router>
          <div className="my-auto">
            <Switch>
              {isAuthenticated && (
                  <Route path="/dashboard" component={DashboardLayout} />
              )}

              {!isAuthenticated && (
                  <Route exact path="/auth/login" component={AuthContainer} />
              )}


              <Redirect to={isAuthenticated ? "/dashboard" : "/auth/login"} />

            </Switch>
          </div>
        </Router>
      </>
  );


};
