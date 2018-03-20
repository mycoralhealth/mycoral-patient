import React, { Component } from 'react';

export class AsyncRenderComponent extends Component {
  setStateAsync(state) {
    if (this.refs.main) {
      this.setState(state);
    }
  }
}