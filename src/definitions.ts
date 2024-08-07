export interface AwsAmplifyPlugin {
  load(options: { cognitoConfig: AWSCognitoConfig }): Promise<void>;
  signIn(options: {
    email: string;
    password: string;
  }): Promise<CognitoAuthSession>;
  federatedSignIn(options: {
    provider: CognitoHostedUIIdentityProvider;
  }): Promise<CognitoAuthSession>;
  fetchAuthSession(): Promise<CognitoAuthSession>;
  getUserAttributes(): Promise<{
    status: AwsAmplifyPluginResponseStatus;
    userAttributes: Record<string, string>;
  }>;
  updateUserAttributes(options: {
    attributes: { name: AuthUserAttributeKey | string; value: string }[];
  }): Promise<{
    status: AwsAmplifyPluginResponseStatus;
    userAttributes: Record<string, string>;
  }>;
  signOut(): Promise<{ status: AwsAmplifyPluginResponseStatus }>;
  deleteUser(): Promise<{ status: AwsAmplifyPluginResponseStatus }>;
}

export interface CognitoAuthSession {
  accessToken?: string;
  idToken?: string;
  identityId?: string;
  refreshToken?: string;
  deviceKey?: string | null;
  status: AwsAmplifyPluginResponseStatus;
}

export interface AWSCognitoConfig {
  aws_cognito_region: string;
  aws_user_pools_id: string;
  aws_user_pools_web_client_id: string;
  aws_cognito_identity_pool_id: string;
  aws_mandatory_sign_in: string;
  oauth: {
    domain: string;
    scope: string[];
    redirectSignIn: string;
    redirectSignOut: string;
    responseType: 'code';
  };
}

export enum AwsAmplifyPluginResponseStatus {
  Ok = 0,
  Ko = -1,
  Cancelled = -2,
  SignedOut = -3,
}

export enum CognitoHostedUIIdentityProvider {
  Cognito = 'COGNITO',
  Google = 'Google',
  Facebook = 'Facebook',
  Amazon = 'LoginWithAmazon',
  Apple = 'SignInWithApple',
}

export enum AuthUserAttributeKey {
  /// Attribute key for user's address
  address = 'address',

  /// Attribute key for user's birthdate
  birthDate = 'birthDate',

  /// Attribute key for user's email
  email = 'email',

  /// Attribute key for user's family name
  familyName = 'familyName',

  /// Attribute key for user's gender
  gender = 'gender',

  /// Attribute key for user's given name
  givenName = 'givenName',

  /// Attribute key for user's locale
  locale = 'locale',

  /// Attribute key for user's middle name
  middleName = 'middleName',

  /// Attribute key for user's name
  name = 'name',

  /// Attribute key for user's nickname
  nickname = 'nickname',

  /// Attribute key for user's phone number
  phoneNumber = 'phoneNumber',

  /// Attribute key for user's picture
  picture = 'picture',

  /// Attribute key for user's preferred user name
  preferredUsername = 'preferredUsername',
}
