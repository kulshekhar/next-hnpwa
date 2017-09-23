import * as React from 'react';
import { registerSW } from '../helpers/sw';

export class ServiceWorker extends React.Component {
  render() {
    return null;
  }

  componentDidMount() {
    registerSW();
  }
}
