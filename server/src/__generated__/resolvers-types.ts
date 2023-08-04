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

export type AuthenticationError = Error & {
  __typename?: 'AuthenticationError';
  code: Scalars['Int']['output'];
  errorMsg: Scalars['String']['output'];
};

export type DuplicateEmailError = Error & {
  __typename?: 'DuplicateEmailError';
  code: Scalars['Int']['output'];
  errorMsg: Scalars['String']['output'];
};

export type EmailLoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type EmailLoginInputError = Error & {
  __typename?: 'EmailLoginInputError';
  code: Scalars['Int']['output'];
  errorMsg: Scalars['String']['output'];
};

export type EmailLoginResult = EmailLoginInputError | EmailLoginSuccess;

export type EmailLoginSuccess = Success & {
  __typename?: 'EmailLoginSuccess';
  successMsg?: Maybe<Scalars['String']['output']>;
};

export type EmailRegisterInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type EmailRegisterInputError = Error & {
  __typename?: 'EmailRegisterInputError';
  code: Scalars['Int']['output'];
  errorMsg: Scalars['String']['output'];
  inputErrors: EmailRegisterInputErrors;
};

export type EmailRegisterInputErrors = {
  __typename?: 'EmailRegisterInputErrors';
  email?: Maybe<Scalars['String']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type EmailRegisterResult = DuplicateEmailError | EmailRegisterInputError | EmailRegisterSuccess;

export type EmailRegisterSuccess = Success & {
  __typename?: 'EmailRegisterSuccess';
  successMsg?: Maybe<Scalars['String']['output']>;
};

export type Error = {
  code: Scalars['Int']['output'];
  errorMsg: Scalars['String']['output'];
};

export type GetAuthUserInput = {
  userId: Scalars['String']['input'];
};

export type GetAuthUserResult = AuthenticationError | GetAuthUserSuccess;

export type GetAuthUserSuccess = Success & {
  __typename?: 'GetAuthUserSuccess';
  successMsg?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type Mutation = {
  __typename?: 'Mutation';
  emailLogin: EmailLoginResult;
  emailRegister: EmailRegisterResult;
};


export type MutationEmailLoginArgs = {
  input: EmailLoginInput;
};


export type MutationEmailRegisterArgs = {
  input: EmailRegisterInput;
};

export const Provider = {
  Email: 'EMAIL',
  Github: 'GITHUB',
  Google: 'GOOGLE'
} as const;

export type Provider = typeof Provider[keyof typeof Provider];
export type Query = {
  __typename?: 'Query';
  getAuthUser: GetAuthUserResult;
};

export type Success = {
  successMsg?: Maybe<Scalars['String']['output']>;
};

export type User = {
  __typename?: 'User';
  created_at: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  email_verified: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  image?: Maybe<Scalars['String']['output']>;
  provider: Provider;
  updated_at: Scalars['DateTime']['output'];
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
  EmailLoginResult: ( EmailLoginInputError ) | ( EmailLoginSuccess );
  EmailRegisterResult: ( DuplicateEmailError ) | ( EmailRegisterInputError ) | ( EmailRegisterSuccess );
  GetAuthUserResult: ( AuthenticationError ) | ( GetAuthUserSuccess );
}>;

/** Mapping of interface types */
export type ResolversInterfaceTypes<RefType extends Record<string, unknown>> = ResolversObject<{
  Error: ( AuthenticationError ) | ( DuplicateEmailError ) | ( EmailLoginInputError ) | ( EmailRegisterInputError );
  Success: ( EmailLoginSuccess ) | ( EmailRegisterSuccess ) | ( GetAuthUserSuccess );
}>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AuthenticationError: ResolverTypeWrapper<AuthenticationError>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  DuplicateEmailError: ResolverTypeWrapper<DuplicateEmailError>;
  EmailLoginInput: EmailLoginInput;
  EmailLoginInputError: ResolverTypeWrapper<EmailLoginInputError>;
  EmailLoginResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['EmailLoginResult']>;
  EmailLoginSuccess: ResolverTypeWrapper<EmailLoginSuccess>;
  EmailRegisterInput: EmailRegisterInput;
  EmailRegisterInputError: ResolverTypeWrapper<EmailRegisterInputError>;
  EmailRegisterInputErrors: ResolverTypeWrapper<EmailRegisterInputErrors>;
  EmailRegisterResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['EmailRegisterResult']>;
  EmailRegisterSuccess: ResolverTypeWrapper<EmailRegisterSuccess>;
  Error: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Error']>;
  GetAuthUserInput: GetAuthUserInput;
  GetAuthUserResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['GetAuthUserResult']>;
  GetAuthUserSuccess: ResolverTypeWrapper<GetAuthUserSuccess>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Provider: Provider;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Success: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Success']>;
  User: ResolverTypeWrapper<User>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthenticationError: AuthenticationError;
  Boolean: Scalars['Boolean']['output'];
  DateTime: Scalars['DateTime']['output'];
  DuplicateEmailError: DuplicateEmailError;
  EmailLoginInput: EmailLoginInput;
  EmailLoginInputError: EmailLoginInputError;
  EmailLoginResult: ResolversUnionTypes<ResolversParentTypes>['EmailLoginResult'];
  EmailLoginSuccess: EmailLoginSuccess;
  EmailRegisterInput: EmailRegisterInput;
  EmailRegisterInputError: EmailRegisterInputError;
  EmailRegisterInputErrors: EmailRegisterInputErrors;
  EmailRegisterResult: ResolversUnionTypes<ResolversParentTypes>['EmailRegisterResult'];
  EmailRegisterSuccess: EmailRegisterSuccess;
  Error: ResolversInterfaceTypes<ResolversParentTypes>['Error'];
  GetAuthUserInput: GetAuthUserInput;
  GetAuthUserResult: ResolversUnionTypes<ResolversParentTypes>['GetAuthUserResult'];
  GetAuthUserSuccess: GetAuthUserSuccess;
  Int: Scalars['Int']['output'];
  Mutation: {};
  Query: {};
  String: Scalars['String']['output'];
  Success: ResolversInterfaceTypes<ResolversParentTypes>['Success'];
  User: User;
}>;

export type AuthenticationErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AuthenticationError'] = ResolversParentTypes['AuthenticationError']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  errorMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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

export type EmailLoginInputErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EmailLoginInputError'] = ResolversParentTypes['EmailLoginInputError']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  errorMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EmailLoginResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EmailLoginResult'] = ResolversParentTypes['EmailLoginResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'EmailLoginInputError' | 'EmailLoginSuccess', ParentType, ContextType>;
}>;

export type EmailLoginSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EmailLoginSuccess'] = ResolversParentTypes['EmailLoginSuccess']> = ResolversObject<{
  successMsg?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EmailRegisterInputErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EmailRegisterInputError'] = ResolversParentTypes['EmailRegisterInputError']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  errorMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  inputErrors?: Resolver<ResolversTypes['EmailRegisterInputErrors'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EmailRegisterInputErrorsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EmailRegisterInputErrors'] = ResolversParentTypes['EmailRegisterInputErrors']> = ResolversObject<{
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  password?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EmailRegisterResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EmailRegisterResult'] = ResolversParentTypes['EmailRegisterResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'DuplicateEmailError' | 'EmailRegisterInputError' | 'EmailRegisterSuccess', ParentType, ContextType>;
}>;

export type EmailRegisterSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EmailRegisterSuccess'] = ResolversParentTypes['EmailRegisterSuccess']> = ResolversObject<{
  successMsg?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Error'] = ResolversParentTypes['Error']> = ResolversObject<{
  __resolveType: TypeResolveFn<'AuthenticationError' | 'DuplicateEmailError' | 'EmailLoginInputError' | 'EmailRegisterInputError', ParentType, ContextType>;
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  errorMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type GetAuthUserResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GetAuthUserResult'] = ResolversParentTypes['GetAuthUserResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'AuthenticationError' | 'GetAuthUserSuccess', ParentType, ContextType>;
}>;

export type GetAuthUserSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GetAuthUserSuccess'] = ResolversParentTypes['GetAuthUserSuccess']> = ResolversObject<{
  successMsg?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  emailLogin?: Resolver<ResolversTypes['EmailLoginResult'], ParentType, ContextType, RequireFields<MutationEmailLoginArgs, 'input'>>;
  emailRegister?: Resolver<ResolversTypes['EmailRegisterResult'], ParentType, ContextType, RequireFields<MutationEmailRegisterArgs, 'input'>>;
}>;

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  getAuthUser?: Resolver<ResolversTypes['GetAuthUserResult'], ParentType, ContextType>;
}>;

export type SuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Success'] = ResolversParentTypes['Success']> = ResolversObject<{
  __resolveType: TypeResolveFn<'EmailLoginSuccess' | 'EmailRegisterSuccess' | 'GetAuthUserSuccess', ParentType, ContextType>;
  successMsg?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email_verified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  provider?: Resolver<ResolversTypes['Provider'], ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  AuthenticationError?: AuthenticationErrorResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  DuplicateEmailError?: DuplicateEmailErrorResolvers<ContextType>;
  EmailLoginInputError?: EmailLoginInputErrorResolvers<ContextType>;
  EmailLoginResult?: EmailLoginResultResolvers<ContextType>;
  EmailLoginSuccess?: EmailLoginSuccessResolvers<ContextType>;
  EmailRegisterInputError?: EmailRegisterInputErrorResolvers<ContextType>;
  EmailRegisterInputErrors?: EmailRegisterInputErrorsResolvers<ContextType>;
  EmailRegisterResult?: EmailRegisterResultResolvers<ContextType>;
  EmailRegisterSuccess?: EmailRegisterSuccessResolvers<ContextType>;
  Error?: ErrorResolvers<ContextType>;
  GetAuthUserResult?: GetAuthUserResultResolvers<ContextType>;
  GetAuthUserSuccess?: GetAuthUserSuccessResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Success?: SuccessResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;

