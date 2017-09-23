import * as React from 'react';

import { Layout } from '../components/Layout';
import { User as UserType } from '../server/types';

export default class User extends React.Component<UserProps> {
  render() {
    return (
      <Layout title={`Profile: ${this.props.user.id}`}>
        <div className="profile">
          user: {this.props.user.id}
          <br />
          karma: {this.props.user.karma}
        </div>
      </Layout>
    );
  }

  static async getInitialProps(context: Context): Promise<UserProps> {
    if (context.req) {
      return { user: context.query.user };
    }

    const response = await fetch(`/_api/user/${context.query.id}`);
    const user = await response.json();

    return {
      user
    };
  }
}

type UserProps = {
  user: UserType;
  id?: number;
};

type Context = {
  req: any;
  pathname: string;
  query: UserProps;
};
