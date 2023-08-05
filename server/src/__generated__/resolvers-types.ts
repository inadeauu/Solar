import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { Context } from '../index';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
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

export type AuthUserResult = AuthUserSuccess | AuthenticationError | UserNotFoundError;

export type AuthUserSuccess = Success & {
  __typename?: 'AuthUserSuccess';
  code: Scalars['Int']['output'];
  successMsg?: Maybe<Scalars['String']['output']>;
  user: User;
};

export type AuthenticationError = Error & {
  __typename?: 'AuthenticationError';
  code: Scalars['Int']['output'];
  errorMsg: Scalars['String']['output'];
};

export type Community = {
  __typename?: 'Community';
  created_at: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  members?: Maybe<Array<User>>;
  owner?: Maybe<User>;
  posts?: Maybe<Array<Post>>;
  title: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
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

export const OrderByDir = {
  Asc: 'asc',
  Desc: 'desc'
} as const;

export type OrderByDir = typeof OrderByDir[keyof typeof OrderByDir];
export type Post = {
  __typename?: 'Post';
  body: Scalars['String']['output'];
  community?: Maybe<Community>;
  created_at: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  owner?: Maybe<User>;
  updated_at: Scalars['DateTime']['output'];
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
  users: Array<User>;
};


export type QueryUsersArgs = {
  input?: InputMaybe<UsersInput>;
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
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  inCommunities?: Maybe<Array<Community>>;
  ownedCommunities?: Maybe<Array<Community>>;
  posts?: Maybe<Array<Post>>;
  provider: Provider;
  updated_at: Scalars['DateTime']['output'];
  username: Scalars['String']['output'];
};

export type UserNotFoundError = Error & {
  __typename?: 'UserNotFoundError';
  code: Scalars['Int']['output'];
  errorMsg: Scalars['String']['output'];
};

export type UserOrderBy = {
  dir: OrderByDir;
  type: UserOrderByType;
};

export const UserOrderByType = {
  PostCount: 'postCount',
  Username: 'username'
} as const;

export type UserOrderByType = typeof UserOrderByType[keyof typeof UserOrderByType];
export type UsersFilters = {
  orderBy?: InputMaybe<UserOrderBy>;
  usernameContains?: InputMaybe<Scalars['String']['input']>;
};

export type UsersInput = {
  filters?: InputMaybe<UsersFilters>;
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
  AuthUserResult: ( AuthUserSuccess ) | ( AuthenticationError ) | ( UserNotFoundError );
  LoginEmailResult: ( LoginEmailInputError ) | ( LoginEmailSuccess );
  RegisterEmailResult: ( DuplicateEmailError ) | ( RegisterEmailInputError ) | ( RegisterEmailSuccess );
}>;

/** Mapping of interface types */
export type ResolversInterfaceTypes<RefType extends Record<string, unknown>> = ResolversObject<{
  Error: ( AuthenticationError ) | ( DuplicateEmailError ) | ( LoginEmailInputError ) | ( RegisterEmailInputError ) | ( UserNotFoundError );
  Success: ( AuthUserSuccess ) | ( LoginEmailSuccess ) | ( RegisterEmailSuccess );
}>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AuthUserInput: AuthUserInput;
  AuthUserResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['AuthUserResult']>;
  AuthUserSuccess: ResolverTypeWrapper<AuthUserSuccess>;
  AuthenticationError: ResolverTypeWrapper<AuthenticationError>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Community: ResolverTypeWrapper<Community>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  DuplicateEmailError: ResolverTypeWrapper<DuplicateEmailError>;
  Error: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Error']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  LoginEmailInput: LoginEmailInput;
  LoginEmailInputError: ResolverTypeWrapper<LoginEmailInputError>;
  LoginEmailResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['LoginEmailResult']>;
  LoginEmailSuccess: ResolverTypeWrapper<LoginEmailSuccess>;
  Mutation: ResolverTypeWrapper<{}>;
  OrderByDir: OrderByDir;
  Post: ResolverTypeWrapper<Post>;
  Provider: Provider;
  Query: ResolverTypeWrapper<{}>;
  RegisterEmailInput: RegisterEmailInput;
  RegisterEmailInputError: ResolverTypeWrapper<RegisterEmailInputError>;
  RegisterEmailInputErrors: ResolverTypeWrapper<RegisterEmailInputErrors>;
  RegisterEmailResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['RegisterEmailResult']>;
  RegisterEmailSuccess: ResolverTypeWrapper<RegisterEmailSuccess>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Success: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Success']>;
  User: ResolverTypeWrapper<User>;
  UserNotFoundError: ResolverTypeWrapper<UserNotFoundError>;
  UserOrderBy: UserOrderBy;
  UserOrderByType: UserOrderByType;
  UsersFilters: UsersFilters;
  UsersInput: UsersInput;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthUserInput: AuthUserInput;
  AuthUserResult: ResolversUnionTypes<ResolversParentTypes>['AuthUserResult'];
  AuthUserSuccess: AuthUserSuccess;
  AuthenticationError: AuthenticationError;
  Boolean: Scalars['Boolean']['output'];
  Community: Community;
  DateTime: Scalars['DateTime']['output'];
  DuplicateEmailError: DuplicateEmailError;
  Error: ResolversInterfaceTypes<ResolversParentTypes>['Error'];
  Int: Scalars['Int']['output'];
  LoginEmailInput: LoginEmailInput;
  LoginEmailInputError: LoginEmailInputError;
  LoginEmailResult: ResolversUnionTypes<ResolversParentTypes>['LoginEmailResult'];
  LoginEmailSuccess: LoginEmailSuccess;
  Mutation: {};
  Post: Post;
  Query: {};
  RegisterEmailInput: RegisterEmailInput;
  RegisterEmailInputError: RegisterEmailInputError;
  RegisterEmailInputErrors: RegisterEmailInputErrors;
  RegisterEmailResult: ResolversUnionTypes<ResolversParentTypes>['RegisterEmailResult'];
  RegisterEmailSuccess: RegisterEmailSuccess;
  String: Scalars['String']['output'];
  Success: ResolversInterfaceTypes<ResolversParentTypes>['Success'];
  User: User;
  UserNotFoundError: UserNotFoundError;
  UserOrderBy: UserOrderBy;
  UsersFilters: UsersFilters;
  UsersInput: UsersInput;
}>;

export type AuthUserResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AuthUserResult'] = ResolversParentTypes['AuthUserResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'AuthUserSuccess' | 'AuthenticationError' | 'UserNotFoundError', ParentType, ContextType>;
}>;

export type AuthUserSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AuthUserSuccess'] = ResolversParentTypes['AuthUserSuccess']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  successMsg?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthenticationErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AuthenticationError'] = ResolversParentTypes['AuthenticationError']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  errorMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommunityResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Community'] = ResolversParentTypes['Community']> = ResolversObject<{
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  members?: Resolver<Maybe<Array<ResolversTypes['User']>>, ParentType, ContextType>;
  owner?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  posts?: Resolver<Maybe<Array<ResolversTypes['Post']>>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
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
  __resolveType: TypeResolveFn<'AuthenticationError' | 'DuplicateEmailError' | 'LoginEmailInputError' | 'RegisterEmailInputError' | 'UserNotFoundError', ParentType, ContextType>;
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

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  loginEmail?: Resolver<ResolversTypes['LoginEmailResult'], ParentType, ContextType, RequireFields<MutationLoginEmailArgs, 'input'>>;
  registerEmail?: Resolver<ResolversTypes['RegisterEmailResult'], ParentType, ContextType, RequireFields<MutationRegisterEmailArgs, 'input'>>;
}>;

export type PostResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = ResolversObject<{
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  community?: Resolver<Maybe<ResolversTypes['Community']>, ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  authUser?: Resolver<ResolversTypes['AuthUserResult'], ParentType, ContextType>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, Partial<QueryUsersArgs>>;
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
  __resolveType: TypeResolveFn<'AuthUserSuccess' | 'LoginEmailSuccess' | 'RegisterEmailSuccess', ParentType, ContextType>;
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  successMsg?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email_verified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  inCommunities?: Resolver<Maybe<Array<ResolversTypes['Community']>>, ParentType, ContextType>;
  ownedCommunities?: Resolver<Maybe<Array<ResolversTypes['Community']>>, ParentType, ContextType>;
  posts?: Resolver<Maybe<Array<ResolversTypes['Post']>>, ParentType, ContextType>;
  provider?: Resolver<ResolversTypes['Provider'], ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  DateTime?: GraphQLScalarType;
  DuplicateEmailError?: DuplicateEmailErrorResolvers<ContextType>;
  Error?: ErrorResolvers<ContextType>;
  LoginEmailInputError?: LoginEmailInputErrorResolvers<ContextType>;
  LoginEmailResult?: LoginEmailResultResolvers<ContextType>;
  LoginEmailSuccess?: LoginEmailSuccessResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RegisterEmailInputError?: RegisterEmailInputErrorResolvers<ContextType>;
  RegisterEmailInputErrors?: RegisterEmailInputErrorsResolvers<ContextType>;
  RegisterEmailResult?: RegisterEmailResultResolvers<ContextType>;
  RegisterEmailSuccess?: RegisterEmailSuccessResolvers<ContextType>;
  Success?: SuccessResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserNotFoundError?: UserNotFoundErrorResolvers<ContextType>;
}>;

