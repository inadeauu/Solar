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

export type Comment = {
  __typename?: 'Comment';
  body: Scalars['String']['output'];
  children: CommentConnection;
  created_at: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  owner: User;
  parent?: Maybe<Comment>;
  post: Post;
  updated_at: Scalars['DateTime']['output'];
  voteStatus: VoteStatus;
  voteSum: Scalars['Int']['output'];
};


export type CommentChildrenArgs = {
  input: CommentChildrenInput;
};

export type CommentChildrenInput = {
  paginate: PaginateInput;
};

export type CommentConnection = {
  __typename?: 'CommentConnection';
  edges: Array<CommentEdge>;
  pageInfo: PageInfo;
};

export type CommentEdge = {
  __typename?: 'CommentEdge';
  cursor: Scalars['String']['output'];
  node: Comment;
};

export type CommentInput = {
  id: Scalars['ID']['input'];
};

export type CommentsFilters = {
  parentId?: InputMaybe<Scalars['ID']['input']>;
  postId?: InputMaybe<Scalars['ID']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type CommentsInput = {
  filters?: InputMaybe<CommentsFilters>;
  paginate: PaginateInput;
};

export type CommunitiesFilters = {
  orderBy?: InputMaybe<CommunitiesOrderBy>;
  titleContains?: InputMaybe<Scalars['String']['input']>;
};

export type CommunitiesInput = {
  filters?: InputMaybe<CommunitiesFilters>;
  paginate: PaginateInput;
};

export type CommunitiesOrderBy = {
  dir: OrderByDir;
  type: CommunityOrderByType;
};

export type Community = {
  __typename?: 'Community';
  created_at: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  inCommunity: Scalars['Boolean']['output'];
  memberCount: Scalars['Int']['output'];
  members: UserConnection;
  owner: User;
  postCount: Scalars['Int']['output'];
  posts: PostConnection;
  title: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
};


export type CommunityMembersArgs = {
  input: CommunityMembersInput;
};


export type CommunityPostsArgs = {
  input: CommunityPostsInput;
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

export type CommunityInput = {
  id: Scalars['ID']['input'];
};

export type CommunityMembersInput = {
  paginate: PaginateInput;
};

export enum CommunityOrderByType {
  MemberCount = 'memberCount'
}

export type CommunityPostsInput = {
  paginate: PaginateInput;
};

export type CreateCommentInput = {
  body: Scalars['String']['input'];
  commentId?: InputMaybe<Scalars['ID']['input']>;
  postId: Scalars['ID']['input'];
};

export type CreateCommentInputError = Error & {
  __typename?: 'CreateCommentInputError';
  code: Scalars['Int']['output'];
  errorMsg: Scalars['String']['output'];
  inputErrors: CreateCommentInputErrors;
};

export type CreateCommentInputErrors = {
  __typename?: 'CreateCommentInputErrors';
  body?: Maybe<Scalars['String']['output']>;
  commentId?: Maybe<Scalars['String']['output']>;
  postId?: Maybe<Scalars['String']['output']>;
};

export type CreateCommentResult = CreateCommentInputError | CreateCommentSuccess;

export type CreateCommentSuccess = Success & {
  __typename?: 'CreateCommentSuccess';
  code: Scalars['Int']['output'];
  successMsg: Scalars['String']['output'];
};

export type CreateCommunityInput = {
  title: Scalars['String']['input'];
};

export type CreateCommunityInputError = Error & {
  __typename?: 'CreateCommunityInputError';
  code: Scalars['Int']['output'];
  errorMsg: Scalars['String']['output'];
  inputErrors: CreateCommunityInputErrors;
};

export type CreateCommunityInputErrors = {
  __typename?: 'CreateCommunityInputErrors';
  title?: Maybe<Scalars['String']['output']>;
};

export type CreateCommunityResult = CreateCommunityInputError | CreateCommunitySuccess;

export type CreateCommunitySuccess = Success & {
  __typename?: 'CreateCommunitySuccess';
  code: Scalars['Int']['output'];
  successMsg: Scalars['String']['output'];
};

export type CreatePostInput = {
  body?: InputMaybe<Scalars['String']['input']>;
  communityId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
};

export type CreatePostInputError = Error & {
  __typename?: 'CreatePostInputError';
  code: Scalars['Int']['output'];
  errorMsg: Scalars['String']['output'];
  inputErrors: CreatePostInputErrors;
};

export type CreatePostInputErrors = {
  __typename?: 'CreatePostInputErrors';
  body?: Maybe<Scalars['String']['output']>;
  communityId?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type CreatePostResult = CreatePostInputError | CreatePostSuccess;

export type CreatePostSuccess = Success & {
  __typename?: 'CreatePostSuccess';
  code: Scalars['Int']['output'];
  successMsg: Scalars['String']['output'];
};

export type Error = {
  code: Scalars['Int']['output'];
  errorMsg: Scalars['String']['output'];
};

export type LoginUsernameInput = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type LoginUsernameInputError = Error & {
  __typename?: 'LoginUsernameInputError';
  code: Scalars['Int']['output'];
  errorMsg: Scalars['String']['output'];
};

export type LoginUsernameResult = LoginUsernameInputError | LoginUsernameSuccess;

export type LoginUsernameSuccess = Success & {
  __typename?: 'LoginUsernameSuccess';
  code: Scalars['Int']['output'];
  successMsg?: Maybe<Scalars['String']['output']>;
};

export type LogoutResult = LogoutSuccess;

export type LogoutSuccess = Success & {
  __typename?: 'LogoutSuccess';
  code: Scalars['Int']['output'];
  successMsg: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createComment: CreateCommentResult;
  createCommunity: CreateCommunityResult;
  createPost: CreatePostResult;
  loginUsername: LoginUsernameResult;
  logout: LogoutResult;
  registerUsername: RegisterUsernameResult;
  userJoinCommunity: UserJoinCommunityResult;
  voteComment: VoteCommentResult;
  votePost: VotePostResult;
};


export type MutationCreateCommentArgs = {
  input: CreateCommentInput;
};


export type MutationCreateCommunityArgs = {
  input: CreateCommunityInput;
};


export type MutationCreatePostArgs = {
  input: CreatePostInput;
};


export type MutationLoginUsernameArgs = {
  input: LoginUsernameInput;
};


export type MutationRegisterUsernameArgs = {
  input: RegisterUsernameInput;
};


export type MutationUserJoinCommunityArgs = {
  input: UserJoinCommunityInput;
};


export type MutationVoteCommentArgs = {
  input: VoteCommentInput;
};


export type MutationVotePostArgs = {
  input: VotePostInput;
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
  commentCount: Scalars['Int']['output'];
  comments: CommentConnection;
  community: Community;
  created_at: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  owner: User;
  title: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
  voteStatus: VoteStatus;
  voteSum: Scalars['Int']['output'];
};


export type PostCommentsArgs = {
  input: PostCommentInput;
};

export type PostCommentInput = {
  paginate: PaginateInput;
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

export type PostInput = {
  id: Scalars['ID']['input'];
};

export enum PostOrderByType {
  Recent = 'recent'
}

export type PostsFilters = {
  communityId?: InputMaybe<Scalars['ID']['input']>;
  orderBy?: InputMaybe<PostsOrderBy>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type PostsInput = {
  filters?: InputMaybe<PostsFilters>;
  paginate: PaginateInput;
};

export type PostsOrderBy = {
  dir: OrderByDir;
  type: PostOrderByType;
};

export enum Provider {
  Github = 'GITHUB',
  Google = 'GOOGLE',
  Username = 'USERNAME'
}

export type Query = {
  __typename?: 'Query';
  authUser: AuthUserResult;
  comment?: Maybe<Comment>;
  comments: CommentConnection;
  communities: CommunityConnection;
  community?: Maybe<Community>;
  post?: Maybe<Post>;
  posts: PostConnection;
  titleExists: Scalars['Boolean']['output'];
  user?: Maybe<User>;
  usernameExists: Scalars['Boolean']['output'];
  users: UserConnection;
};


export type QueryCommentArgs = {
  input: CommentInput;
};


export type QueryCommentsArgs = {
  input: CommentsInput;
};


export type QueryCommunitiesArgs = {
  input: CommunitiesInput;
};


export type QueryCommunityArgs = {
  input: CommunityInput;
};


export type QueryPostArgs = {
  input: PostInput;
};


export type QueryPostsArgs = {
  input: PostsInput;
};


export type QueryTitleExistsArgs = {
  title: Scalars['String']['input'];
};


export type QueryUserArgs = {
  input: UserInput;
};


export type QueryUsernameExistsArgs = {
  username: Scalars['String']['input'];
};


export type QueryUsersArgs = {
  input: UsersInput;
};

export type RegisterUsernameInput = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type RegisterUsernameInputError = Error & {
  __typename?: 'RegisterUsernameInputError';
  code: Scalars['Int']['output'];
  errorMsg: Scalars['String']['output'];
  inputErrors: RegisterUsernameInputErrors;
};

export type RegisterUsernameInputErrors = {
  __typename?: 'RegisterUsernameInputErrors';
  password?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type RegisterUsernameResult = RegisterUsernameInputError | RegisterUsernameSuccess;

export type RegisterUsernameSuccess = Success & {
  __typename?: 'RegisterUsernameSuccess';
  code: Scalars['Int']['output'];
  successMsg?: Maybe<Scalars['String']['output']>;
};

export type Success = {
  code: Scalars['Int']['output'];
  successMsg?: Maybe<Scalars['String']['output']>;
};

export type User = {
  __typename?: 'User';
  comments: CommentConnection;
  commentsCount: Scalars['Int']['output'];
  created_at: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  inCommunities: CommunityConnection;
  ownedCommunities: CommunityConnection;
  posts: PostConnection;
  postsCount: Scalars['Int']['output'];
  provider: Provider;
  updated_at: Scalars['DateTime']['output'];
  username: Scalars['String']['output'];
};


export type UserCommentsArgs = {
  input: UserCommentInput;
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

export type UserCommentInput = {
  paginate: PaginateInput;
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

export type UserJoinCommunityInput = {
  communityId: Scalars['String']['input'];
};

export type UserJoinCommunityResult = UserJoinCommunitySuccess;

export type UserJoinCommunitySuccess = Success & {
  __typename?: 'UserJoinCommunitySuccess';
  code: Scalars['Int']['output'];
  community: Community;
  successMsg: Scalars['String']['output'];
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

export type VoteCommentInput = {
  commentId: Scalars['String']['input'];
  like: Scalars['Boolean']['input'];
};

export type VoteCommentResult = VoteCommentSuccess;

export type VoteCommentSuccess = Success & {
  __typename?: 'VoteCommentSuccess';
  code: Scalars['Int']['output'];
  comment: Comment;
  successMsg: Scalars['String']['output'];
};

export type VotePostInput = {
  like: Scalars['Boolean']['input'];
  postId: Scalars['String']['input'];
};

export type VotePostResult = VotePostSuccess;

export type VotePostSuccess = Success & {
  __typename?: 'VotePostSuccess';
  code: Scalars['Int']['output'];
  post: Post;
  successMsg: Scalars['String']['output'];
};

export enum VoteStatus {
  Dislike = 'DISLIKE',
  Like = 'LIKE',
  None = 'NONE'
}

export type VoteCommentMutationVariables = Exact<{
  input: VoteCommentInput;
}>;


export type VoteCommentMutation = { __typename?: 'Mutation', voteComment: { __typename?: 'VoteCommentSuccess', successMsg: string, code: number, comment: { __typename?: 'Comment', body: string, created_at: any, id: string, voteSum: number, voteStatus: VoteStatus, owner: { __typename?: 'User', id: string, username: string } } } };

export type UserJoinCommunityMutationVariables = Exact<{
  input: UserJoinCommunityInput;
}>;


export type UserJoinCommunityMutation = { __typename?: 'Mutation', userJoinCommunity: { __typename: 'UserJoinCommunitySuccess', successMsg: string, code: number, community: { __typename?: 'Community', id: string, memberCount: number, postCount: number, inCommunity: boolean, title: string, created_at: any, updated_at: any, owner: { __typename?: 'User', id: string, username: string } } } };

export type PostFeedQueryVariables = Exact<{
  input: PostsInput;
}>;


export type PostFeedQuery = { __typename?: 'Query', posts: { __typename?: 'PostConnection', edges: Array<{ __typename?: 'PostEdge', node: { __typename?: 'Post', id: string, body: string, created_at: any, title: string, commentCount: number, voteSum: number, voteStatus: VoteStatus, community: { __typename?: 'Community', id: string, title: string }, owner: { __typename?: 'User', id: string, username: string } } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean } } };

export type CreateCommunityPostMutationVariables = Exact<{
  input: CreatePostInput;
}>;


export type CreateCommunityPostMutation = { __typename?: 'Mutation', createPost: { __typename: 'CreatePostInputError', errorMsg: string, code: number } | { __typename: 'CreatePostSuccess', successMsg: string, code: number } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: { __typename: 'LogoutSuccess', successMsg: string, code: number } };

export type PostCommentFeedQueryVariables = Exact<{
  input: CommentsInput;
}>;


export type PostCommentFeedQuery = { __typename?: 'Query', comments: { __typename?: 'CommentConnection', edges: Array<{ __typename?: 'CommentEdge', node: { __typename?: 'Comment', body: string, created_at: any, id: string, voteSum: number, voteStatus: VoteStatus, owner: { __typename?: 'User', id: string, username: string } } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean } } };

export type CreateCommentMutationVariables = Exact<{
  input: CreateCommentInput;
}>;


export type CreateCommentMutation = { __typename?: 'Mutation', createComment: { __typename: 'CreateCommentInputError', errorMsg: string, code: number } | { __typename: 'CreateCommentSuccess', successMsg: string, code: number } };

export type CommunitiesSearchQueryVariables = Exact<{
  input: CommunitiesInput;
}>;


export type CommunitiesSearchQuery = { __typename?: 'Query', communities: { __typename?: 'CommunityConnection', edges: Array<{ __typename?: 'CommunityEdge', node: { __typename?: 'Community', id: string, memberCount: number, title: string, created_at: any } }> } };

export type UsersSearchQueryVariables = Exact<{
  input: UsersInput;
}>;


export type UsersSearchQuery = { __typename?: 'Query', users: { __typename?: 'UserConnection', edges: Array<{ __typename?: 'UserEdge', node: { __typename?: 'User', username: string, created_at: any, postsCount: number, commentsCount: number } }> } };

export type AuthUserQueryVariables = Exact<{ [key: string]: never; }>;


export type AuthUserQuery = { __typename?: 'Query', authUser: { __typename: 'AuthUserSuccess', successMsg?: string | null, code: number, user?: { __typename?: 'User', username: string, updated_at: any, provider: Provider, id: string, created_at: any } | null } };

export type VotePostMutationVariables = Exact<{
  input: VotePostInput;
}>;


export type VotePostMutation = { __typename?: 'Mutation', votePost: { __typename?: 'VotePostSuccess', successMsg: string, code: number, post: { __typename?: 'Post', id: string, body: string, created_at: any, title: string, commentCount: number, voteSum: number, voteStatus: VoteStatus, community: { __typename?: 'Community', id: string, title: string }, owner: { __typename?: 'User', id: string, username: string } } } };

export type CommunityQueryVariables = Exact<{
  input: CommunityInput;
}>;


export type CommunityQuery = { __typename?: 'Query', community?: { __typename?: 'Community', id: string, memberCount: number, postCount: number, inCommunity: boolean, title: string, created_at: any, updated_at: any, owner: { __typename?: 'User', id: string, username: string } } | null };

export type CommunityTitleExistsQueryVariables = Exact<{
  title: Scalars['String']['input'];
}>;


export type CommunityTitleExistsQuery = { __typename?: 'Query', titleExists: boolean };

export type CreateCommunityMutationVariables = Exact<{
  input: CreateCommunityInput;
}>;


export type CreateCommunityMutation = { __typename?: 'Mutation', createCommunity: { __typename: 'CreateCommunityInputError', errorMsg: string, code: number } | { __typename: 'CreateCommunitySuccess', successMsg: string, code: number } };

export type LoginUsernameMutationVariables = Exact<{
  input: LoginUsernameInput;
}>;


export type LoginUsernameMutation = { __typename?: 'Mutation', loginUsername: { __typename: 'LoginUsernameInputError', errorMsg: string, code: number } | { __typename: 'LoginUsernameSuccess', successMsg?: string | null, code: number } };

export type SinglePostQueryVariables = Exact<{
  input: PostInput;
}>;


export type SinglePostQuery = { __typename?: 'Query', post?: { __typename?: 'Post', id: string, body: string, created_at: any, title: string, commentCount: number, voteSum: number, voteStatus: VoteStatus, community: { __typename?: 'Community', id: string, title: string }, owner: { __typename?: 'User', id: string, username: string } } | null };

export type RegisterUsernameMutationVariables = Exact<{
  input: RegisterUsernameInput;
}>;


export type RegisterUsernameMutation = { __typename?: 'Mutation', registerUsername: { __typename: 'RegisterUsernameInputError', errorMsg: string, code: number } | { __typename: 'RegisterUsernameSuccess', successMsg?: string | null, code: number } };

export type UsernameExistsQueryVariables = Exact<{
  username: Scalars['String']['input'];
}>;


export type UsernameExistsQuery = { __typename?: 'Query', usernameExists: boolean };


export const VoteCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VoteComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VoteCommentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"voteComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"VoteCommentSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"successMsg"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"comment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"voteSum"}},{"kind":"Field","name":{"kind":"Name","value":"voteStatus"}}]}}]}}]}}]}}]} as unknown as DocumentNode<VoteCommentMutation, VoteCommentMutationVariables>;
export const UserJoinCommunityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UserJoinCommunity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserJoinCommunityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userJoinCommunity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserJoinCommunitySuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"successMsg"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"community"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"memberCount"}},{"kind":"Field","name":{"kind":"Name","value":"postCount"}},{"kind":"Field","name":{"kind":"Name","value":"inCommunity"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UserJoinCommunityMutation, UserJoinCommunityMutationVariables>;
export const PostFeedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PostFeed"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PostsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"posts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"commentCount"}},{"kind":"Field","name":{"kind":"Name","value":"voteSum"}},{"kind":"Field","name":{"kind":"Name","value":"voteStatus"}},{"kind":"Field","name":{"kind":"Name","value":"community"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]}}]} as unknown as DocumentNode<PostFeedQuery, PostFeedQueryVariables>;
export const CreateCommunityPostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCommunityPost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePostInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePostSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"successMsg"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"errorMsg"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<CreateCommunityPostMutation, CreateCommunityPostMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LogoutSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"successMsg"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const PostCommentFeedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PostCommentFeed"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CommentsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"comments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"voteSum"}},{"kind":"Field","name":{"kind":"Name","value":"voteStatus"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]}}]} as unknown as DocumentNode<PostCommentFeedQuery, PostCommentFeedQueryVariables>;
export const CreateCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCommentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCommentSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"successMsg"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"errorMsg"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<CreateCommentMutation, CreateCommentMutationVariables>;
export const CommunitiesSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CommunitiesSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CommunitiesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"memberCount"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CommunitiesSearchQuery, CommunitiesSearchQueryVariables>;
export const UsersSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UsersSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UsersInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"postsCount"}},{"kind":"Field","name":{"kind":"Name","value":"commentsCount"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UsersSearchQuery, UsersSearchQueryVariables>;
export const AuthUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AuthUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AuthUserSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"successMsg"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AuthUserQuery, AuthUserQueryVariables>;
export const VotePostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VotePost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VotePostInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"votePost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"VotePostSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"successMsg"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"post"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"commentCount"}},{"kind":"Field","name":{"kind":"Name","value":"voteSum"}},{"kind":"Field","name":{"kind":"Name","value":"voteStatus"}},{"kind":"Field","name":{"kind":"Name","value":"community"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<VotePostMutation, VotePostMutationVariables>;
export const CommunityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Community"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CommunityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"community"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"memberCount"}},{"kind":"Field","name":{"kind":"Name","value":"postCount"}},{"kind":"Field","name":{"kind":"Name","value":"inCommunity"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]} as unknown as DocumentNode<CommunityQuery, CommunityQueryVariables>;
export const CommunityTitleExistsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CommunityTitleExists"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"titleExists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}}]}]}}]} as unknown as DocumentNode<CommunityTitleExistsQuery, CommunityTitleExistsQueryVariables>;
export const CreateCommunityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCommunity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCommunityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCommunity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCommunitySuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"successMsg"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"errorMsg"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<CreateCommunityMutation, CreateCommunityMutationVariables>;
export const LoginUsernameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LoginUsername"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginUsernameInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginUsername"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LoginUsernameSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"successMsg"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"errorMsg"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<LoginUsernameMutation, LoginUsernameMutationVariables>;
export const SinglePostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SinglePost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PostInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"post"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"commentCount"}},{"kind":"Field","name":{"kind":"Name","value":"voteSum"}},{"kind":"Field","name":{"kind":"Name","value":"voteStatus"}},{"kind":"Field","name":{"kind":"Name","value":"community"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<SinglePostQuery, SinglePostQueryVariables>;
export const RegisterUsernameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterUsername"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterUsernameInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerUsername"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterUsernameSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"successMsg"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"errorMsg"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<RegisterUsernameMutation, RegisterUsernameMutationVariables>;
export const UsernameExistsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UsernameExists"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"usernameExists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}]}]}}]} as unknown as DocumentNode<UsernameExistsQuery, UsernameExistsQueryVariables>;