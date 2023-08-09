import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { User as UserModel, Post as PostModel, Community as CommunityModel } from '.prisma/client';
import { Context } from '../index';
export type Maybe<T> = T | null;
export type InputMaybe<T> = undefined | T;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
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

export type CreateCommunityResult = AuthenticationError | CreateCommunityInputError | CreateCommunitySuccess;

export type CreateCommunitySuccess = Success & {
  __typename?: 'CreateCommunitySuccess';
  code: Scalars['Int']['output'];
  successMsg: Scalars['String']['output'];
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

export type LogoutResult = AuthenticationError | LogoutSessionDestroyError | LogoutSuccess;

export type LogoutSessionDestroyError = Error & {
  __typename?: 'LogoutSessionDestroyError';
  code: Scalars['Int']['output'];
  errorMsg: Scalars['String']['output'];
};

export type LogoutSuccess = Success & {
  __typename?: 'LogoutSuccess';
  code: Scalars['Int']['output'];
  successMsg: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCommunity: CreateCommunityResult;
  loginEmail: LoginEmailResult;
  logout: LogoutResult;
  registerEmail: RegisterEmailResult;
};


export type MutationCreateCommunityArgs = {
  input: CreateCommunityInput;
};


export type MutationLoginEmailArgs = {
  input: LoginEmailInput;
};


export type MutationRegisterEmailArgs = {
  input: RegisterEmailInput;
};

export const OrderByDir = {
  Asc: 'asc',
  Desc: 'desc'
} as const;

export type OrderByDir = typeof OrderByDir[keyof typeof OrderByDir];
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

export const Provider = {
  Email: 'EMAIL',
  Github: 'GITHUB',
  Google: 'GOOGLE'
} as const;

export type Provider = typeof Provider[keyof typeof Provider];
export type Query = {
  __typename?: 'Query';
  authUser: AuthUserResult;
  titleExists: Scalars['Boolean']['output'];
  user?: Maybe<User>;
  users: UserConnection;
};


export type QueryTitleExistsArgs = {
  title: Scalars['String']['input'];
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

export const UserOrderByType = {
  PostCount: 'postCount',
  Username: 'username'
} as const;

export type UserOrderByType = typeof UserOrderByType[keyof typeof UserOrderByType];
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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes<RefType extends Record<string, unknown>> = ResolversObject<{
  AuthUserResult: ( Omit<AuthUserSuccess, 'user'> & { user?: Maybe<RefType['User']> } );
  CreateCommunityResult: ( AuthenticationError ) | ( CreateCommunityInputError ) | ( CreateCommunitySuccess );
  LoginEmailResult: ( LoginEmailInputError ) | ( LoginEmailSuccess );
  LogoutResult: ( AuthenticationError ) | ( LogoutSessionDestroyError ) | ( LogoutSuccess );
  RegisterEmailResult: ( DuplicateEmailError ) | ( RegisterEmailInputError ) | ( RegisterEmailSuccess );
}>;

/** Mapping of interface types */
export type ResolversInterfaceTypes<RefType extends Record<string, unknown>> = ResolversObject<{
  Error: ( AuthenticationError ) | ( CreateCommunityInputError ) | ( DuplicateEmailError ) | ( LoginEmailInputError ) | ( LogoutSessionDestroyError ) | ( RegisterEmailInputError ) | ( UserNotFoundError );
  Success: ( Omit<AuthUserSuccess, 'user'> & { user?: Maybe<RefType['User']> } ) | ( CreateCommunitySuccess ) | ( LoginEmailSuccess ) | ( LogoutSuccess ) | ( RegisterEmailSuccess );
}>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AuthUserInput: AuthUserInput;
  AuthUserResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['AuthUserResult']>;
  AuthUserSuccess: ResolverTypeWrapper<Omit<AuthUserSuccess, 'user'> & { user?: Maybe<ResolversTypes['User']> }>;
  AuthenticationError: ResolverTypeWrapper<AuthenticationError>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Community: ResolverTypeWrapper<CommunityModel>;
  CommunityConnection: ResolverTypeWrapper<Omit<CommunityConnection, 'edges'> & { edges: Array<ResolversTypes['CommunityEdge']> }>;
  CommunityEdge: ResolverTypeWrapper<Omit<CommunityEdge, 'node'> & { node: ResolversTypes['Community'] }>;
  CreateCommunityInput: CreateCommunityInput;
  CreateCommunityInputError: ResolverTypeWrapper<CreateCommunityInputError>;
  CreateCommunityInputErrors: ResolverTypeWrapper<CreateCommunityInputErrors>;
  CreateCommunityResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CreateCommunityResult']>;
  CreateCommunitySuccess: ResolverTypeWrapper<CreateCommunitySuccess>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  DuplicateEmailError: ResolverTypeWrapper<DuplicateEmailError>;
  Error: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Error']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  LoginEmailInput: LoginEmailInput;
  LoginEmailInputError: ResolverTypeWrapper<LoginEmailInputError>;
  LoginEmailResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['LoginEmailResult']>;
  LoginEmailSuccess: ResolverTypeWrapper<LoginEmailSuccess>;
  LogoutResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['LogoutResult']>;
  LogoutSessionDestroyError: ResolverTypeWrapper<LogoutSessionDestroyError>;
  LogoutSuccess: ResolverTypeWrapper<LogoutSuccess>;
  Mutation: ResolverTypeWrapper<{}>;
  OrderByDir: OrderByDir;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  PaginateInput: PaginateInput;
  Post: ResolverTypeWrapper<PostModel>;
  PostConnection: ResolverTypeWrapper<Omit<PostConnection, 'edges'> & { edges: Array<ResolversTypes['PostEdge']> }>;
  PostEdge: ResolverTypeWrapper<Omit<PostEdge, 'node'> & { node: ResolversTypes['Post'] }>;
  Provider: Provider;
  Query: ResolverTypeWrapper<{}>;
  RegisterEmailInput: RegisterEmailInput;
  RegisterEmailInputError: ResolverTypeWrapper<RegisterEmailInputError>;
  RegisterEmailInputErrors: ResolverTypeWrapper<RegisterEmailInputErrors>;
  RegisterEmailResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['RegisterEmailResult']>;
  RegisterEmailSuccess: ResolverTypeWrapper<RegisterEmailSuccess>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Success: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Success']>;
  User: ResolverTypeWrapper<UserModel>;
  UserConnection: ResolverTypeWrapper<Omit<UserConnection, 'edges'> & { edges: Array<ResolversTypes['UserEdge']> }>;
  UserEdge: ResolverTypeWrapper<Omit<UserEdge, 'node'> & { node: ResolversTypes['User'] }>;
  UserInCommunitiesInput: UserInCommunitiesInput;
  UserInput: UserInput;
  UserNotFoundError: ResolverTypeWrapper<UserNotFoundError>;
  UserOrderByType: UserOrderByType;
  UserOwnedCommunitiesInput: UserOwnedCommunitiesInput;
  UserPostInput: UserPostInput;
  UsersFilters: UsersFilters;
  UsersInput: UsersInput;
  UsersOrderBy: UsersOrderBy;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthUserInput: AuthUserInput;
  AuthUserResult: ResolversUnionTypes<ResolversParentTypes>['AuthUserResult'];
  AuthUserSuccess: Omit<AuthUserSuccess, 'user'> & { user?: Maybe<ResolversParentTypes['User']> };
  AuthenticationError: AuthenticationError;
  Boolean: Scalars['Boolean']['output'];
  Community: CommunityModel;
  CommunityConnection: Omit<CommunityConnection, 'edges'> & { edges: Array<ResolversParentTypes['CommunityEdge']> };
  CommunityEdge: Omit<CommunityEdge, 'node'> & { node: ResolversParentTypes['Community'] };
  CreateCommunityInput: CreateCommunityInput;
  CreateCommunityInputError: CreateCommunityInputError;
  CreateCommunityInputErrors: CreateCommunityInputErrors;
  CreateCommunityResult: ResolversUnionTypes<ResolversParentTypes>['CreateCommunityResult'];
  CreateCommunitySuccess: CreateCommunitySuccess;
  DateTime: Scalars['DateTime']['output'];
  DuplicateEmailError: DuplicateEmailError;
  Error: ResolversInterfaceTypes<ResolversParentTypes>['Error'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  LoginEmailInput: LoginEmailInput;
  LoginEmailInputError: LoginEmailInputError;
  LoginEmailResult: ResolversUnionTypes<ResolversParentTypes>['LoginEmailResult'];
  LoginEmailSuccess: LoginEmailSuccess;
  LogoutResult: ResolversUnionTypes<ResolversParentTypes>['LogoutResult'];
  LogoutSessionDestroyError: LogoutSessionDestroyError;
  LogoutSuccess: LogoutSuccess;
  Mutation: {};
  PageInfo: PageInfo;
  PaginateInput: PaginateInput;
  Post: PostModel;
  PostConnection: Omit<PostConnection, 'edges'> & { edges: Array<ResolversParentTypes['PostEdge']> };
  PostEdge: Omit<PostEdge, 'node'> & { node: ResolversParentTypes['Post'] };
  Query: {};
  RegisterEmailInput: RegisterEmailInput;
  RegisterEmailInputError: RegisterEmailInputError;
  RegisterEmailInputErrors: RegisterEmailInputErrors;
  RegisterEmailResult: ResolversUnionTypes<ResolversParentTypes>['RegisterEmailResult'];
  RegisterEmailSuccess: RegisterEmailSuccess;
  String: Scalars['String']['output'];
  Success: ResolversInterfaceTypes<ResolversParentTypes>['Success'];
  User: UserModel;
  UserConnection: Omit<UserConnection, 'edges'> & { edges: Array<ResolversParentTypes['UserEdge']> };
  UserEdge: Omit<UserEdge, 'node'> & { node: ResolversParentTypes['User'] };
  UserInCommunitiesInput: UserInCommunitiesInput;
  UserInput: UserInput;
  UserNotFoundError: UserNotFoundError;
  UserOwnedCommunitiesInput: UserOwnedCommunitiesInput;
  UserPostInput: UserPostInput;
  UsersFilters: UsersFilters;
  UsersInput: UsersInput;
  UsersOrderBy: UsersOrderBy;
}>;

export type AuthUserResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AuthUserResult'] = ResolversParentTypes['AuthUserResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'AuthUserSuccess', ParentType, ContextType>;
}>;

export type AuthUserSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AuthUserSuccess'] = ResolversParentTypes['AuthUserSuccess']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  successMsg?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthenticationErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AuthenticationError'] = ResolversParentTypes['AuthenticationError']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  errorMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommunityResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Community'] = ResolversParentTypes['Community']> = ResolversObject<{
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  members?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  posts?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommunityConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CommunityConnection'] = ResolversParentTypes['CommunityConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['CommunityEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommunityEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CommunityEdge'] = ResolversParentTypes['CommunityEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Community'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateCommunityInputErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateCommunityInputError'] = ResolversParentTypes['CreateCommunityInputError']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  errorMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  inputErrors?: Resolver<ResolversTypes['CreateCommunityInputErrors'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateCommunityInputErrorsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateCommunityInputErrors'] = ResolversParentTypes['CreateCommunityInputErrors']> = ResolversObject<{
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateCommunityResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateCommunityResult'] = ResolversParentTypes['CreateCommunityResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'AuthenticationError' | 'CreateCommunityInputError' | 'CreateCommunitySuccess', ParentType, ContextType>;
}>;

export type CreateCommunitySuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateCommunitySuccess'] = ResolversParentTypes['CreateCommunitySuccess']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  successMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DuplicateEmailErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DuplicateEmailError'] = ResolversParentTypes['DuplicateEmailError']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  errorMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Error'] = ResolversParentTypes['Error']> = ResolversObject<{
  __resolveType: TypeResolveFn<'AuthenticationError' | 'CreateCommunityInputError' | 'DuplicateEmailError' | 'LoginEmailInputError' | 'LogoutSessionDestroyError' | 'RegisterEmailInputError' | 'UserNotFoundError', ParentType, ContextType>;
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  errorMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type LoginEmailInputErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LoginEmailInputError'] = ResolversParentTypes['LoginEmailInputError']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  errorMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LoginEmailResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LoginEmailResult'] = ResolversParentTypes['LoginEmailResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'LoginEmailInputError' | 'LoginEmailSuccess', ParentType, ContextType>;
}>;

export type LoginEmailSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LoginEmailSuccess'] = ResolversParentTypes['LoginEmailSuccess']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  successMsg?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LogoutResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LogoutResult'] = ResolversParentTypes['LogoutResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'AuthenticationError' | 'LogoutSessionDestroyError' | 'LogoutSuccess', ParentType, ContextType>;
}>;

export type LogoutSessionDestroyErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LogoutSessionDestroyError'] = ResolversParentTypes['LogoutSessionDestroyError']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  errorMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LogoutSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LogoutSuccess'] = ResolversParentTypes['LogoutSuccess']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  successMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createCommunity?: Resolver<ResolversTypes['CreateCommunityResult'], ParentType, ContextType, RequireFields<MutationCreateCommunityArgs, 'input'>>;
  loginEmail?: Resolver<ResolversTypes['LoginEmailResult'], ParentType, ContextType, RequireFields<MutationLoginEmailArgs, 'input'>>;
  logout?: Resolver<ResolversTypes['LogoutResult'], ParentType, ContextType>;
  registerEmail?: Resolver<ResolversTypes['RegisterEmailResult'], ParentType, ContextType, RequireFields<MutationRegisterEmailArgs, 'input'>>;
}>;

export type PageInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = ResolversObject<{
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = ResolversObject<{
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  community?: Resolver<ResolversTypes['Community'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PostConnection'] = ResolversParentTypes['PostConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['PostEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PostEdge'] = ResolversParentTypes['PostEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Post'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  authUser?: Resolver<ResolversTypes['AuthUserResult'], ParentType, ContextType>;
  titleExists?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<QueryTitleExistsArgs, 'title'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'input'>>;
  users?: Resolver<ResolversTypes['UserConnection'], ParentType, ContextType, RequireFields<QueryUsersArgs, 'input'>>;
}>;

export type RegisterEmailInputErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RegisterEmailInputError'] = ResolversParentTypes['RegisterEmailInputError']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  errorMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  inputErrors?: Resolver<ResolversTypes['RegisterEmailInputErrors'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RegisterEmailInputErrorsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RegisterEmailInputErrors'] = ResolversParentTypes['RegisterEmailInputErrors']> = ResolversObject<{
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  password?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RegisterEmailResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RegisterEmailResult'] = ResolversParentTypes['RegisterEmailResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'DuplicateEmailError' | 'RegisterEmailInputError' | 'RegisterEmailSuccess', ParentType, ContextType>;
}>;

export type RegisterEmailSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RegisterEmailSuccess'] = ResolversParentTypes['RegisterEmailSuccess']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  successMsg?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Success'] = ResolversParentTypes['Success']> = ResolversObject<{
  __resolveType: TypeResolveFn<'AuthUserSuccess' | 'CreateCommunitySuccess' | 'LoginEmailSuccess' | 'LogoutSuccess' | 'RegisterEmailSuccess', ParentType, ContextType>;
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  successMsg?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email_verified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  inCommunities?: Resolver<ResolversTypes['CommunityConnection'], ParentType, ContextType, RequireFields<UserInCommunitiesArgs, 'input'>>;
  ownedCommunities?: Resolver<ResolversTypes['CommunityConnection'], ParentType, ContextType, RequireFields<UserOwnedCommunitiesArgs, 'input'>>;
  posts?: Resolver<ResolversTypes['PostConnection'], ParentType, ContextType, RequireFields<UserPostsArgs, 'input'>>;
  provider?: Resolver<ResolversTypes['Provider'], ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserConnection'] = ResolversParentTypes['UserConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['UserEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserEdge'] = ResolversParentTypes['UserEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserNotFoundErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserNotFoundError'] = ResolversParentTypes['UserNotFoundError']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  errorMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  AuthUserResult?: AuthUserResultResolvers<ContextType>;
  AuthUserSuccess?: AuthUserSuccessResolvers<ContextType>;
  AuthenticationError?: AuthenticationErrorResolvers<ContextType>;
  Community?: CommunityResolvers<ContextType>;
  CommunityConnection?: CommunityConnectionResolvers<ContextType>;
  CommunityEdge?: CommunityEdgeResolvers<ContextType>;
  CreateCommunityInputError?: CreateCommunityInputErrorResolvers<ContextType>;
  CreateCommunityInputErrors?: CreateCommunityInputErrorsResolvers<ContextType>;
  CreateCommunityResult?: CreateCommunityResultResolvers<ContextType>;
  CreateCommunitySuccess?: CreateCommunitySuccessResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  DuplicateEmailError?: DuplicateEmailErrorResolvers<ContextType>;
  Error?: ErrorResolvers<ContextType>;
  LoginEmailInputError?: LoginEmailInputErrorResolvers<ContextType>;
  LoginEmailResult?: LoginEmailResultResolvers<ContextType>;
  LoginEmailSuccess?: LoginEmailSuccessResolvers<ContextType>;
  LogoutResult?: LogoutResultResolvers<ContextType>;
  LogoutSessionDestroyError?: LogoutSessionDestroyErrorResolvers<ContextType>;
  LogoutSuccess?: LogoutSuccessResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  PostConnection?: PostConnectionResolvers<ContextType>;
  PostEdge?: PostEdgeResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RegisterEmailInputError?: RegisterEmailInputErrorResolvers<ContextType>;
  RegisterEmailInputErrors?: RegisterEmailInputErrorsResolvers<ContextType>;
  RegisterEmailResult?: RegisterEmailResultResolvers<ContextType>;
  RegisterEmailSuccess?: RegisterEmailSuccessResolvers<ContextType>;
  Success?: SuccessResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserConnection?: UserConnectionResolvers<ContextType>;
  UserEdge?: UserEdgeResolvers<ContextType>;
  UserNotFoundError?: UserNotFoundErrorResolvers<ContextType>;
}>;

