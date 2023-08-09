/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** Banking account number is a string of 5 to 17 alphanumeric values for representing an generic account number */
  AccountNumber: { input: any; output: any; }
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  BigInt: { input: any; output: any; }
  /** The `Byte` scalar type represents byte value as a Buffer */
  Byte: { input: any; output: any; }
  /** A country code as defined by ISO 3166-1 alpha-2 */
  CountryCode: { input: any; output: any; }
  /** A field whose value conforms to the standard cuid format as specified in https://github.com/ericelliott/cuid#broken-down */
  Cuid: { input: any; output: any; }
  /** A field whose value is a Currency: https://en.wikipedia.org/wiki/ISO_4217. */
  Currency: { input: any; output: any; }
  /** A field whose value conforms to the standard DID format as specified in did-core: https://www.w3.org/TR/did-core/. */
  DID: { input: any; output: any; }
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: { input: any; output: any; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTimeISO: { input: any; output: any; }
  /** A field whose value conforms to the standard DeweyDecimal format as specified by the OCLC https://www.oclc.org/content/dam/oclc/dewey/resources/summaries/deweysummaries.pdf */
  DeweyDecimal: { input: any; output: any; }
  /**
   *
   *     A string representing a duration conforming to the ISO8601 standard,
   *     such as: P1W1DT13H23M34S
   *     P is the duration designator (for period) placed at the start of the duration representation.
   *     Y is the year designator that follows the value for the number of years.
   *     M is the month designator that follows the value for the number of months.
   *     W is the week designator that follows the value for the number of weeks.
   *     D is the day designator that follows the value for the number of days.
   *     T is the time designator that precedes the time components of the representation.
   *     H is the hour designator that follows the value for the number of hours.
   *     M is the minute designator that follows the value for the number of minutes.
   *     S is the second designator that follows the value for the number of seconds.
   *
   *     Note the time designator, T, that precedes the time value.
   *
   *     Matches moment.js, Luxon and DateFns implementations
   *     ,/. is valid for decimal places and +/- is a valid prefix
   *
   */
  Duration: { input: any; output: any; }
  /** A field whose value conforms to the standard internet email address format as specified in HTML Spec: https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address. */
  EmailAddress: { input: any; output: any; }
  /** A field whose value is a generic Universally Unique Identifier: https://en.wikipedia.org/wiki/Universally_unique_identifier. */
  GUID: { input: any; output: any; }
  /** A field whose value is a CSS HSL color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#hsl()_and_hsla(). */
  HSL: { input: any; output: any; }
  /** A field whose value is a CSS HSLA color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#hsl()_and_hsla(). */
  HSLA: { input: any; output: any; }
  /** A field whose value is a hex color code: https://en.wikipedia.org/wiki/Web_colors. */
  HexColorCode: { input: any; output: any; }
  /** A field whose value is a hexadecimal: https://en.wikipedia.org/wiki/Hexadecimal. */
  Hexadecimal: { input: any; output: any; }
  /** A field whose value is an International Bank Account Number (IBAN): https://en.wikipedia.org/wiki/International_Bank_Account_Number. */
  IBAN: { input: any; output: any; }
  /** A field whose value is either an IPv4 or IPv6 address: https://en.wikipedia.org/wiki/IP_address. */
  IP: { input: any; output: any; }
  /** A field whose value is an IPC Class Symbol within the International Patent Classification System: https://www.wipo.int/classifications/ipc/en/ */
  IPCPatent: { input: any; output: any; }
  /** A field whose value is a IPv4 address: https://en.wikipedia.org/wiki/IPv4. */
  IPv4: { input: any; output: any; }
  /** A field whose value is a IPv6 address: https://en.wikipedia.org/wiki/IPv6. */
  IPv6: { input: any; output: any; }
  /** A field whose value is a ISBN-10 or ISBN-13 number: https://en.wikipedia.org/wiki/International_Standard_Book_Number. */
  ISBN: { input: any; output: any; }
  /**
   *
   *     A string representing a duration conforming to the ISO8601 standard,
   *     such as: P1W1DT13H23M34S
   *     P is the duration designator (for period) placed at the start of the duration representation.
   *     Y is the year designator that follows the value for the number of years.
   *     M is the month designator that follows the value for the number of months.
   *     W is the week designator that follows the value for the number of weeks.
   *     D is the day designator that follows the value for the number of days.
   *     T is the time designator that precedes the time components of the representation.
   *     H is the hour designator that follows the value for the number of hours.
   *     M is the minute designator that follows the value for the number of minutes.
   *     S is the second designator that follows the value for the number of seconds.
   *
   *     Note the time designator, T, that precedes the time value.
   *
   *     Matches moment.js, Luxon and DateFns implementations
   *     ,/. is valid for decimal places and +/- is a valid prefix
   *
   */
  ISO8601Duration: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: { input: any; output: any; }
  /** A field whose value is a JSON Web Token (JWT): https://jwt.io/introduction. */
  JWT: { input: any; output: any; }
  /** A field whose value conforms to the Library of Congress Subclass Format ttps://www.loc.gov/catdir/cpso/lcco/ */
  LCCSubclass: { input: any; output: any; }
  /** A field whose value is a valid decimal degrees latitude number (53.471): https://en.wikipedia.org/wiki/Latitude */
  Latitude: { input: any; output: any; }
  /** A local date string (i.e., with no associated timezone) in `YYYY-MM-DD` format, e.g. `2020-01-01`. */
  LocalDate: { input: any; output: any; }
  /** A local date-time string (i.e., with no associated timezone) in `YYYY-MM-DDTHH:mm:ss` format, e.g. `2020-01-01T00:00:00`. */
  LocalDateTime: { input: any; output: any; }
  /** A local time string (i.e., with no associated timezone) in 24-hr `HH:mm[:ss[.SSS]]` format, e.g. `14:25` or `14:25:06` or `14:25:06.123`.  This scalar is very similar to the `LocalTime`, with the only difference being that `LocalEndTime` also allows `24:00` as a valid value to indicate midnight of the following day.  This is useful when using the scalar to represent the exclusive upper bound of a time block. */
  LocalEndTime: { input: any; output: any; }
  /** A local time string (i.e., with no associated timezone) in 24-hr `HH:mm[:ss[.SSS]]` format, e.g. `14:25` or `14:25:06` or `14:25:06.123`. */
  LocalTime: { input: any; output: any; }
  /** The locale in the format of a BCP 47 (RFC 5646) standard string */
  Locale: { input: any; output: any; }
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  Long: { input: any; output: any; }
  /** A field whose value is a valid decimal degrees longitude number (53.471): https://en.wikipedia.org/wiki/Longitude */
  Longitude: { input: any; output: any; }
  /** A field whose value is a IEEE 802 48-bit MAC address: https://en.wikipedia.org/wiki/MAC_address. */
  MAC: { input: any; output: any; }
  /** Floats that will have a value less than 0. */
  NegativeFloat: { input: any; output: any; }
  /** Integers that will have a value less than 0. */
  NegativeInt: { input: any; output: any; }
  /** A string that cannot be passed as an empty value */
  NonEmptyString: { input: any; output: any; }
  /** Floats that will have a value of 0 or more. */
  NonNegativeFloat: { input: any; output: any; }
  /** Integers that will have a value of 0 or more. */
  NonNegativeInt: { input: any; output: any; }
  /** Floats that will have a value of 0 or less. */
  NonPositiveFloat: { input: any; output: any; }
  /** Integers that will have a value of 0 or less. */
  NonPositiveInt: { input: any; output: any; }
  /** A field whose value conforms with the standard mongodb object ID as described here: https://docs.mongodb.com/manual/reference/method/ObjectId/#ObjectId. Example: 5e5677d71bdc2ae76344968c */
  ObjectID: { input: any; output: any; }
  /** A field whose value conforms to the standard E.164 format as specified in: https://en.wikipedia.org/wiki/E.164. Basically this is +17895551234. */
  PhoneNumber: { input: any; output: any; }
  /** A field whose value is a valid TCP port within the range of 0 to 65535: https://en.wikipedia.org/wiki/Transmission_Control_Protocol#TCP_ports */
  Port: { input: any; output: any; }
  /** Floats that will have a value greater than 0. */
  PositiveFloat: { input: any; output: any; }
  /** Integers that will have a value greater than 0. */
  PositiveInt: { input: any; output: any; }
  /** A field whose value conforms to the standard postal code formats for United States, United Kingdom, Germany, Canada, France, Italy, Australia, Netherlands, Spain, Denmark, Sweden, Belgium, India, Austria, Portugal, Switzerland or Luxembourg. */
  PostalCode: { input: any; output: any; }
  /** A field whose value is a CSS RGB color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb()_and_rgba(). */
  RGB: { input: any; output: any; }
  /** A field whose value is a CSS RGBA color: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb()_and_rgba(). */
  RGBA: { input: any; output: any; }
  /** In the US, an ABA routing transit number (`ABA RTN`) is a nine-digit code to identify the financial institution. */
  RoutingNumber: { input: any; output: any; }
  /** The `SafeInt` scalar type represents non-fractional signed whole numeric values that are considered safe as defined by the ECMAScript specification. */
  SafeInt: { input: any; output: any; }
  /** A field whose value is a Semantic Version: https://semver.org */
  SemVer: { input: any; output: any; }
  /** A time string at UTC, such as 10:15:30Z, compliant with the `full-time` format outlined in section 5.6 of the RFC 3339profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Time: { input: any; output: any; }
  /** A field whose value exists in the standard IANA Time Zone Database: https://www.iana.org/time-zones */
  TimeZone: { input: any; output: any; }
  /** The javascript `Date` as integer. Type represents date and time as number of milliseconds from start of UNIX epoch. */
  Timestamp: { input: any; output: any; }
  /** A field whose value conforms to the standard URL format as specified in RFC3986: https://www.ietf.org/rfc/rfc3986.txt. */
  URL: { input: any; output: any; }
  /** A currency string, such as $21.25 */
  USCurrency: { input: any; output: any; }
  /** A field whose value is a generic Universally Unique Identifier: https://en.wikipedia.org/wiki/Universally_unique_identifier. */
  UUID: { input: any; output: any; }
  /** Floats that will have a value of 0 or more. */
  UnsignedFloat: { input: any; output: any; }
  /** Integers that will have a value of 0 or more. */
  UnsignedInt: { input: any; output: any; }
  /** A field whose value is a UTC Offset: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones */
  UtcOffset: { input: any; output: any; }
  /** Represents NULL values */
  Void: { input: any; output: any; }
};

export type AuthUserInput = {
  userId: Scalars['String']['input'];
};

export type AuthUserResult = AuthUserSuccess;

export type AuthUserSuccess = Success & {
  __typename?: 'AuthUserSuccess';
  code: Scalars['Int']['output'];
  successMsg?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type AuthenticationError = Error & {
  __typename?: 'AuthenticationError';
  code: Scalars['Int']['output'];
  errorMsg: Scalars['String']['output'];
};

export type Community = {
  __typename?: 'Community';
  created_at: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  members: Array<User>;
  owner: User;
  posts: Array<Post>;
  title: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
};

export type CommunityConnection = {
  __typename?: 'CommunityConnection';
  edges: Array<CommunityEdge>;
  pageInfo: PageInfo;
};

export type CommunityEdge = {
  __typename?: 'CommunityEdge';
  cursor: Scalars['String']['output'];
  node: Community;
};

export type DuplicateEmailError = Error & {
  __typename?: 'DuplicateEmailError';
  code: Scalars['Int']['output'];
  errorMsg: Scalars['String']['output'];
};

export type Error = {
  code: Scalars['Int']['output'];
  errorMsg: Scalars['String']['output'];
};

export type LoginEmailInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type LoginEmailInputError = Error & {
  __typename?: 'LoginEmailInputError';
  code: Scalars['Int']['output'];
  errorMsg: Scalars['String']['output'];
};

export type LoginEmailResult = LoginEmailInputError | LoginEmailSuccess;

export type LoginEmailSuccess = Success & {
  __typename?: 'LoginEmailSuccess';
  code: Scalars['Int']['output'];
  successMsg?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  loginEmail: LoginEmailResult;
  registerEmail: RegisterEmailResult;
};


export type MutationLoginEmailArgs = {
  input: LoginEmailInput;
};


export type MutationRegisterEmailArgs = {
  input: RegisterEmailInput;
};

export enum OrderByDir {
  Asc = 'asc',
  Desc = 'desc'
}

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PaginateInput = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type Post = {
  __typename?: 'Post';
  body: Scalars['String']['output'];
  community: Community;
  created_at: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  owner: User;
  updated_at: Scalars['DateTime']['output'];
};

export type PostConnection = {
  __typename?: 'PostConnection';
  edges: Array<PostEdge>;
  pageInfo: PageInfo;
};

export type PostEdge = {
  __typename?: 'PostEdge';
  cursor: Scalars['String']['output'];
  node: Post;
};

export enum Provider {
  Email = 'EMAIL',
  Github = 'GITHUB',
  Google = 'GOOGLE'
}

export type Query = {
  __typename?: 'Query';
  authUser: AuthUserResult;
  user?: Maybe<User>;
  users: UserConnection;
};


export type QueryUserArgs = {
  input: UserInput;
};


export type QueryUsersArgs = {
  input: UsersInput;
};

export type RegisterEmailInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type RegisterEmailInputError = Error & {
  __typename?: 'RegisterEmailInputError';
  code: Scalars['Int']['output'];
  errorMsg: Scalars['String']['output'];
  inputErrors: RegisterEmailInputErrors;
};

export type RegisterEmailInputErrors = {
  __typename?: 'RegisterEmailInputErrors';
  email?: Maybe<Scalars['String']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type RegisterEmailResult = DuplicateEmailError | RegisterEmailInputError | RegisterEmailSuccess;

export type RegisterEmailSuccess = Success & {
  __typename?: 'RegisterEmailSuccess';
  code: Scalars['Int']['output'];
  successMsg?: Maybe<Scalars['String']['output']>;
};

export type Success = {
  code: Scalars['Int']['output'];
  successMsg?: Maybe<Scalars['String']['output']>;
};

export type User = {
  __typename?: 'User';
  created_at: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  email_verified: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  inCommunities: CommunityConnection;
  ownedCommunities: CommunityConnection;
  posts: PostConnection;
  provider: Provider;
  updated_at: Scalars['DateTime']['output'];
  username: Scalars['String']['output'];
};


export type UserInCommunitiesArgs = {
  input: UserInCommunitiesInput;
};


export type UserOwnedCommunitiesArgs = {
  input: UserOwnedCommunitiesInput;
};


export type UserPostsArgs = {
  input: UserPostInput;
};

export type UserConnection = {
  __typename?: 'UserConnection';
  edges: Array<UserEdge>;
  pageInfo: PageInfo;
};

export type UserEdge = {
  __typename?: 'UserEdge';
  cursor: Scalars['String']['output'];
  node: User;
};

export type UserInCommunitiesInput = {
  paginate: PaginateInput;
};

export type UserInput = {
  id: Scalars['ID']['input'];
};

export type UserNotFoundError = Error & {
  __typename?: 'UserNotFoundError';
  code: Scalars['Int']['output'];
  errorMsg: Scalars['String']['output'];
};

export enum UserOrderByType {
  PostCount = 'postCount',
  Username = 'username'
}

export type UserOwnedCommunitiesInput = {
  paginate: PaginateInput;
};

export type UserPostInput = {
  paginate: PaginateInput;
};

export type UsersFilters = {
  orderBy?: InputMaybe<UsersOrderBy>;
  usernameContains?: InputMaybe<Scalars['String']['input']>;
};

export type UsersInput = {
  filters?: InputMaybe<UsersFilters>;
  paginate: PaginateInput;
};

export type UsersOrderBy = {
  dir: OrderByDir;
  type: UserOrderByType;
};

export type AuthUserQueryVariables = Exact<{ [key: string]: never; }>;


export type AuthUserQuery = { __typename?: 'Query', authUser: { __typename?: 'AuthUserSuccess', successMsg?: string | null, code: number, user?: { __typename?: 'User', username: string, updated_at: any, provider: Provider, image?: string | null, id: string, email_verified: boolean, email: string, created_at: any } | null } };

export type EmailRegisterMutationVariables = Exact<{
  input: RegisterEmailInput;
}>;


export type EmailRegisterMutation = { __typename?: 'Mutation', registerEmail: { __typename?: 'DuplicateEmailError', errorMsg: string, code: number } | { __typename?: 'RegisterEmailInputError', errorMsg: string, code: number, inputErrors: { __typename?: 'RegisterEmailInputErrors', email?: string | null, password?: string | null, username?: string | null } } | { __typename?: 'RegisterEmailSuccess', successMsg?: string | null, code: number } };


export const AuthUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AuthUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuthUserSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"successMsg"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email_verified"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AuthUserQuery, AuthUserQueryVariables>;
export const EmailRegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EmailRegister"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterEmailInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterEmailSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"successMsg"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorMsg"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterEmailInputError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"inputErrors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"password"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]}}]} as unknown as DocumentNode<EmailRegisterMutation, EmailRegisterMutationVariables>;