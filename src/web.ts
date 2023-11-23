import type { FederatedSignInOptions } from '@aws-amplify/auth/lib/types';
import { WebPlugin } from '@capacitor/core';
import type { CognitoUser } from 'amazon-cognito-identity-js';
import { Amplify, Auth } from 'aws-amplify';

import type {
  AwsAmplifyPlugin,
  AWSCognitoConfig,
  CognitoAuthSession,
} from './definitions';
import { AwsAmplifyPluginResponseStatus } from './definitions';

export class AwsAmplifyWeb extends WebPlugin implements AwsAmplifyPlugin {
  private cognitoConfig?: AWSCognitoConfig;

  async load(options: { cognitoConfig: AWSCognitoConfig }): Promise<void> {
    this.cognitoConfig = options.cognitoConfig;
    Amplify.configure({ ...options.cognitoConfig });
  }
  async signIn(options: {
    email: string;
    password: string;
  }): Promise<CognitoAuthSession> {
    if (!this.cognitoConfig) {
      throw new Error('call load first');
    }
    try {
      const session = await this.fetchAuthSession();
      if (session.status === AwsAmplifyPluginResponseStatus.Ok) {
        return session;
      }

      const user = (await Auth.signIn(
        options.email,
        options.password,
      )) as CognitoUser;

      return this.getCognitoAuthSession(
        user,
        this.cognitoConfig.aws_cognito_identity_pool_id,
      );
    } catch (error) {
      return this.handleError(error, 'signIn');
    }
  }

  async federatedSignIn(options: {
    provider: string;
  }): Promise<CognitoAuthSession> {
    if (!this.cognitoConfig) {
      throw new Error('call load first');
    }
    try {
      const session = await this.fetchAuthSession();
      if (session.status === AwsAmplifyPluginResponseStatus.Ok) {
        return session;
      }

      await Auth.federatedSignIn(options as FederatedSignInOptions);
      return this.fetchAuthSession();
    } catch (error) {
      return this.handleError(error, 'federatedSignIn');
    }
  }

  async fetchAuthSession(): Promise<CognitoAuthSession> {
    if (!this.cognitoConfig) {
      throw new Error('call load first');
    }
    try {
      const user = await Auth.currentAuthenticatedUser();
      const cognitoAuthSession: CognitoAuthSession = this.getCognitoAuthSession(
        user,
        this.cognitoConfig.aws_cognito_identity_pool_id,
      );

      return cognitoAuthSession;
    } catch (error) {
      return this.handleError(error, 'fetchAuthSession');
    }
  }

  async signOut(): Promise<{ status: AwsAmplifyPluginResponseStatus }> {
    if (!this.cognitoConfig) {
      throw new Error('call load first');
    }
    return Auth.signOut()
      .then(() => ({
        status: AwsAmplifyPluginResponseStatus.Ok,
      }))
      .catch(error => this.handleError(error, 'signOut'));
  }

  private getCognitoAuthSession(user: CognitoUser, identityId: string) {
    const userSession = user.getSignInUserSession();

    const res: CognitoAuthSession = {
      accessToken: userSession?.getAccessToken().getJwtToken(),
      idToken: userSession?.getIdToken().getJwtToken(),
      identityId: identityId,
      refreshToken: userSession?.getRefreshToken().getToken(),
      deviceKey: userSession?.getAccessToken().decodePayload().device_key,
      status: userSession
        ? AwsAmplifyPluginResponseStatus.Ok
        : AwsAmplifyPluginResponseStatus.Ko,
    };
    return res;
  }

  private handleError(error: any, from: string): CognitoAuthSession {
    console.error(`[CAPACITOR AWS AMPLIFY] - error from ${from}: `, error);
    const res: CognitoAuthSession = {
      status: AwsAmplifyPluginResponseStatus.Ko,
    };
    if (typeof error !== 'string') {
      return res;
    }
    if (error.includes('not authenticated')) {
      res.status = AwsAmplifyPluginResponseStatus.SignedOut;
    }
    return res;
  }
}
