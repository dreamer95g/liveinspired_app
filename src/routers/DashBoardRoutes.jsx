import { NoteList } from "../components/notes/NoteList";
import { NoteForm } from "../components/notes/NoteForm";
import { NoteScreen } from "../components/notes/NoteScreen";

import { TagList } from "../components/tags/TagList";

import { PhraseList } from "../components/phrases/PhraseList";
import { PhraseForm } from "../components/phrases/PhraseForm";
import { PhraseScreen } from "../components/phrases/PhraseScreen";

import { Home } from "../components/ui/Home";

import React from "react";

import { Switch, Route, Redirect } from "react-router-dom";
import { MainSearch } from "../components/search/MainSearch";

export const DashBoardRoutes = () => {
  return (
    <Switch>
      <Route exact path="/dashboard/notes" component={NoteList} />
      <Route exact path="/dashboard/notes/form" component={NoteForm} />
      <Route exact path="/dashboard/notes/form/:id" component={NoteForm} />
      <Route exact path="/dashboard/notes/view/:id" component={NoteScreen} />

      <Route exact path="/dashboard/phrases" component={PhraseList} />
      <Route exact path="/dashboard/phrases/form" component={PhraseForm} />
      <Route exact path="/dashboard/phrases/form/:id" component={PhraseForm} />
      <Route
        exact
        path="/dashboard/phrases/view/:id"
        component={PhraseScreen}
      />

      <Route exact path="/dashboard/search" component={MainSearch} />
      <Route exact path="/dashboard" component={Home} />
      <Route exact path="/dashboard/tags" component={TagList} />
      <Redirect to="/dashboard" />
    </Switch>
  );
};
