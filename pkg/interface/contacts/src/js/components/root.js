import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from "react-router-dom";
import classnames from 'classnames';
import _ from 'lodash';

import { api } from '/api';
import { subscription } from '/subscription';
import { store } from '/store';
import { Skeleton } from '/components/skeleton';
import { NewScreen } from '/components/new';
import { ContactSidebar } from '/components/lib/contact-sidebar';
import { ContactCard } from '/components/lib/contact-card';
import { AddScreen } from '/components/lib/add-contact';


export class Root extends Component {
  constructor(props) {
    super(props);

    this.state = store.state;
    store.setStateHandler(this.setState.bind(this));
    this.setSpinner = this.setSpinner.bind(this);
  }

  setSpinner(spinner) {
    this.setState({ spinner });
  }

  render() {
    const { props, state } = this;

    let contacts = !!state.contacts ? state.contacts : {};
    let groups = !!state.groups ? state.groups : {};

    return (
      <BrowserRouter>
        <div className="h-100 w-100">
        <Route exact path="/~contacts"
          render={ (props) => {
            return (
              <Skeleton
                activeDrawer="groups"
                contacts={contacts}
                groups={groups}>
                <div className="h-100 w-100 overflow-x-hidden bg-gray0 dn db-ns"></div>
              </Skeleton>
            );
          }} />
          <Route exact path="/~contacts/new" 
            render={ (props) => {
              return (
                <Skeleton
                  spinner={state.spinner}
                  contacts={contacts}
                  groups={groups}
                  activeDrawer="rightPanel">
                  <NewScreen setSpinner={this.setSpinner} api={api} />
                </Skeleton>
              );
          }} />
          <Route exact path="/~contacts/:ship/:group"
            render={ (props) => {
              let groupPath =
                `/${props.match.params.ship}/${props.match.params.group}`;
              let groupContacts = contacts[groupPath] || {};
              let group = groups[groupPath] || new Set([]);

              return (
                <Skeleton
                  spinner={state.spinner}
                  contacts={contacts}
                  groups={groups}
                  activeDrawer="contacts"
                  selected={groupPath}>
                    <ContactSidebar 
                      contacts={groupContacts}
                      group={group}
                      activeDrawer="contacts"
                      path={groupPath} />
                    <div className="h-100 w-100 overflow-x-hidden bg-gray0 dn db-ns"></div>
                  </Skeleton>
              );
            }}
            />
          <Route exact path="/~contacts/add/:ship/:group"
            render={(props) => {
              let groupPath =
                `/${props.match.params.ship}/${props.match.params.group}`;
              let groupContacts = contacts[groupPath] || {};
              let group = groups[groupPath] || new Set([]);

              return (
                <Skeleton
                  spinner={state.spinner}
                  contacts={contacts}
                  groups={groups}
                  activeDrawer="rightPanel"
                  selected={groupPath}>
                  <ContactSidebar
                    contacts={groupContacts}
                    group={group}
                    activeDrawer="rightPanel"
                    path={groupPath} />
                  <AddScreen 
                    path={groupPath}
                    contacts={groupContacts}
                  />
                </Skeleton>
              );
            }} />
          <Route exact path="/~contacts/:ship/:group/:contact"
            render={ (props) => {
              let groupPath =
                `/${props.match.params.ship}/${props.match.params.group}`;
              let shipPath = 
                `${groupPath}/${props.match.params.contact}`;

              let groupContacts = contacts[groupPath] || {};
              let contact =
                (props.match.params.contact in groupContacts) ?
                groupContacts[props.match.params.contact] : {};
              let group = groups[groupPath] || new Set([]);

              return (
                <Skeleton
                  spinner={state.spinner}
                  contacts={contacts}
                  groups={groups}
                  activeDrawer="rightPanel"
                  selected={groupPath}>
                  <ContactSidebar
                    activeDrawer="rightPanel"
                    contacts={groupContacts}
                    group={group}
                    path={groupPath}
                    selectedContact={shipPath} />
                  <ContactCard
                    contact={contact}
                    path={groupPath}
                    ship={props.match.params.contact} />
                </Skeleton>
              );
            }} />
          <Route exact path="/~contacts/share/:ship/:group"
            render={(props) => {
              let groupPath =
                `/${props.match.params.ship}/${props.match.params.group}`;
              let shipPath = `${groupPath}/${window.ship}`;

              let defaultContacts = contacts["/~/default"] || {};
              let rootIdentity = defaultContacts[window.ship] || {};

              let groupContacts = contacts[groupPath] || {};
              let contact =
                (window.ship in groupContacts) ?
                groupContacts[window.ship] : {};

              return (
                <Skeleton
                  spinner={state.spinner}
                  contacts={contacts}
                  groups={groups}
                  activeDrawer="rightPanel"
                  selected={groupPath}>
                  <ContactSidebar
                    activeDrawer="rightPanel"
                    contacts={groupContacts}
                    groups={groups}
                    path={groupPath}
                    selectedContact={shipPath} />
                  <ContactCard
                    contact={contact}
                    path={groupPath}
                    ship={window.ship}
                    share={true}
                    rootIdentity={rootIdentity} />
                </Skeleton>
              );
            }} />
          <Route exact path="/~contacts/me"
            render={ (props) => {
              let defaultContacts = contacts["/~/default"] || {};
              let me = defaultContacts[window.ship] || {};

              return (
                <Skeleton
                  spinner={state.spinner}
                  contacts={contacts}
                  groups={groups}
                  activeDrawer="rightPanel"
                  selected="me">
                  <ContactCard
                    path="/~/default"
                    contact={me}
                    ship={window.ship} />
                </Skeleton>
              );
            }} />
        </div>
      </BrowserRouter>
    );
  }
}

