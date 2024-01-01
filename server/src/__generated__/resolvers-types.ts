import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { User as UserModel, Post as PostModel, Community as CommunityModel, Comment as CommentModel } from '.prisma/client';
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

export type ChangeCommunityTitleInput = {
  id: Scalars['ID']['input'];
  newTitle: Scalars['String']['input'];
};

export type ChangeCommunityTitleInputError = Error & {
  __typename?: 'ChangeCommunityTitleInputError';
  code: Scalars['Int']['output'];
  errorMsg: Scalars['String']['output'];
  inputErrors: ChangeCommunityTitleInputErrors;
};

export type ChangeCommunityTitleInputErrors = {
  __typename?: 'ChangeCommunityTitleInputErrors';
  newTitle: Scalars['String']['output'];
};

export type ChangeCommunityTitleResult = ChangeCommunityTitleInputError | ChangeCommunityTitleSuccess;

export type ChangeCommunityTitleSuccess = Success & {
  __typename?: 'ChangeCommunityTitleSuccess';
  code: Scalars['Int']['output'];
  community: Community;
  successMsg: Scalars['String']['output'];
};

export type ChangePasswordInput = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};

export type ChangePasswordInputError = Error & {
  __typename?: 'ChangePasswordInputError';
  code: Scalars['Int']['output'];
  errorMsg: Scalars['String']['output'];
  inputErrors: ChangePasswordInputErrors;
};

export type ChangePasswordInputErrors = {
  __typename?: 'ChangePasswordInputErrors';
  currentPassword?: Maybe<Scalars['String']['output']>;
  newPassword?: Maybe<Scalars['String']['output']>;
};

export type ChangePasswordResult = ChangePasswordInputError | ChangePasswordSuccess;

export type ChangePasswordSuccess = Success & {
  __typename?: 'ChangePasswordSuccess';
  code: Scalars['Int']['output'];
  successMsg: Scalars['String']['output'];
};

export type ChangeUsernameInput = {
  newUsername: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type ChangeUsernameInputError = Error & {
  __typename?: 'ChangeUsernameInputError';
  code: Scalars['Int']['output'];
  errorMsg: Scalars['String']['output'];
  inputErrors: ChangeUsernameInputErrors;
};

export type ChangeUsernameInputErrors = {
  __typename?: 'ChangeUsernameInputErrors';
  password?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type ChangeUsernameResult = ChangeUsernameInputError | ChangeUsernameSuccess;

export type ChangeUsernameSuccess = Success & {
  __typename?: 'ChangeUsernameSuccess';
  code: Scalars['Int']['output'];
  successMsg: Scalars['String']['output'];
  user: User;
};

export type Comment = {
  __typename?: 'Comment';
  body: Scalars['String']['output'];
  created_at: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  owner: User;
  parent?: Maybe<Comment>;
  post: Post;
  replyCount: Scalars['Int']['output'];
  updated_at: Scalars['DateTime']['output'];
  voteStatus: VoteStatus;
  voteSum: Scalars['Int']['output'];
};

export type CommentConnection = {
  __typename?: 'CommentConnection';
  edges: Array<CommentEdge>;
  orderBy?: Maybe<Scalars['String']['output']>;
  pageInfo: PageInfo;
  replies?: Maybe<Scalars['Boolean']['output']>;
};

export type CommentEdge = {
  __typename?: 'CommentEdge';
  cursor: Cursor;
  node: Comment;
};

export type CommentInput = {
  id: Scalars['ID']['input'];
};

export const CommentOrderByType = {
  Low: 'LOW',
  New: 'NEW',
  Old: 'OLD',
  Top: 'TOP'
} as const;

export type CommentOrderByType = typeof CommentOrderByType[keyof typeof CommentOrderByType];
export type CommentsFilters = {
  orderBy: CommentOrderByType;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  postId?: InputMaybe<Scalars['ID']['input']>;
  replies?: InputMaybe<Scalars['Boolean']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type CommentsInput = {
  filters: CommentsFilters;
  paginate: PaginateInput;
};

export type CommunitiesFilters = {
  memberId?: InputMaybe<Scalars['String']['input']>;
  ownerId?: InputMaybe<Scalars['String']['input']>;
  titleContains?: InputMaybe<Scalars['String']['input']>;
};

export type CommunitiesInput = {
  filters: CommunitiesFilters;
  paginate: PaginateInput;
};

export type Community = {
  __typename?: 'Community';
  created_at: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  inCommunity: Scalars['Boolean']['output'];
  memberCount: Scalars['Int']['output'];
  owner: User;
  postCount: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
};

export type CommunityConnection = {
  __typename?: 'CommunityConnection';
  edges: Array<CommunityEdge>;
  memberOf?: Maybe<Scalars['Boolean']['output']>;
  pageInfo: PageInfo;
};

export type CommunityEdge = {
  __typename?: 'CommunityEdge';
  cursor: Cursor;
  node: Community;
};

export type CommunityInput = {
  id: Scalars['ID']['input'];
};

export type CreateCommentInput = {
  body: Scalars['String']['input'];
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
};

export type CreateCommentReplyInput = {
  body: Scalars['String']['input'];
  commentId: Scalars['ID']['input'];
};

export type CreateCommentReplyInputError = Error & {
  __typename?: 'CreateCommentReplyInputError';
  code: Scalars['Int']['output'];
  errorMsg: Scalars['String']['output'];
  inputErrors: CreateCommentReplyInputErrors;
};

export type CreateCommentReplyInputErrors = {
  __typename?: 'CreateCommentReplyInputErrors';
  body?: Maybe<Scalars['String']['output']>;
  commentId?: Maybe<Scalars['String']['output']>;
};

export type CreateCommentReplyResult = CreateCommentReplyInputError | CreateCommentReplySuccess;

export type CreateCommentReplySuccess = Success & {
  __typename?: 'CreateCommentReplySuccess';
  code: Scalars['Int']['output'];
  comment: Comment;
  successMsg: Scalars['String']['output'];
};

export type CreateCommentResult = CreateCommentInputError | CreateCommentSuccess;

export type CreateCommentSuccess = Success & {
  __typename?: 'CreateCommentSuccess';
  code: Scalars['Int']['output'];
  comment: Comment;
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
  community: Community;
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
  post: Post;
  successMsg: Scalars['String']['output'];
};

export type Cursor = {
  __typename?: 'Cursor';
  created_at?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  title?: Maybe<Scalars['String']['output']>;
  voteSum?: Maybe<Scalars['Int']['output']>;
};

export type CursorInput = {
  created_at?: InputMaybe<Scalars['DateTime']['input']>;
  id: Scalars['ID']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  voteSum?: InputMaybe<Scalars['Int']['input']>;
};

export type DeleteCommentInput = {
  commentId: Scalars['ID']['input'];
};

export type DeleteCommentResult = DeleteCommentSuccess;

export type DeleteCommentSuccess = Success & {
  __typename?: 'DeleteCommentSuccess';
  code: Scalars['Int']['output'];
  successMsg: Scalars['String']['output'];
};

export type DeleteCommunityInput = {
  id: Scalars['ID']['input'];
  title: Scalars['String']['input'];
};

export type DeleteCommunityInputError = Error & {
  __typename?: 'DeleteCommunityInputError';
  code: Scalars['Int']['output'];
  errorMsg: Scalars['String']['output'];
  inputErrors?: Maybe<DeleteCommunityInputErrors>;
};

export type DeleteCommunityInputErrors = {
  __typename?: 'DeleteCommunityInputErrors';
  title?: Maybe<Scalars['String']['output']>;
};

export type DeleteCommunityResult = DeleteCommunityInputError | DeleteCommunitySuccess;

export type DeleteCommunitySuccess = Success & {
  __typename?: 'DeleteCommunitySuccess';
  code: Scalars['Int']['output'];
  successMsg: Scalars['String']['output'];
};

export type DeletePostInput = {
  postId: Scalars['ID']['input'];
};

export type DeletePostResult = DeletePostSuccess;

export type DeletePostSuccess = Success & {
  __typename?: 'DeletePostSuccess';
  code: Scalars['Int']['output'];
  successMsg: Scalars['String']['output'];
};

export type DeleteUserInput = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type DeleteUserInputError = Error & {
  __typename?: 'DeleteUserInputError';
  code: Scalars['Int']['output'];
  errorMsg: Scalars['String']['output'];
  inputErrors: DeleteUserInputErrors;
};

export type DeleteUserInputErrors = {
  __typename?: 'DeleteUserInputErrors';
  password?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type DeleteUserResult = DeleteUserInputError | DeleteUserSuccess;

export type DeleteUserSuccess = Success & {
  __typename?: 'DeleteUserSuccess';
  code: Scalars['Int']['output'];
  successMsg: Scalars['String']['output'];
};

export type EditCommentInput = {
  body: Scalars['String']['input'];
  commentId: Scalars['ID']['input'];
};

export type EditCommentInputError = Error & {
  __typename?: 'EditCommentInputError';
  code: Scalars['Int']['output'];
  errorMsg: Scalars['String']['output'];
  inputErrors: EditCommentInputErrors;
};

export type EditCommentInputErrors = {
  __typename?: 'EditCommentInputErrors';
  body?: Maybe<Scalars['String']['output']>;
};

export type EditCommentResult = EditCommentInputError | EditCommentSuccess;

export type EditCommentSuccess = Success & {
  __typename?: 'EditCommentSuccess';
  code: Scalars['Int']['output'];
  comment: Comment;
  successMsg: Scalars['String']['output'];
};

export type EditPostInput = {
  body: Scalars['String']['input'];
  postId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
};

export type EditPostInputError = Error & {
  __typename?: 'EditPostInputError';
  code: Scalars['Int']['output'];
  errorMsg: Scalars['String']['output'];
  inputErrors: EditPostInputErrors;
};

export type EditPostInputErrors = {
  __typename?: 'EditPostInputErrors';
  body?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type EditPostResult = EditPostInputError | EditPostSuccess;

export type EditPostSuccess = Success & {
  __typename?: 'EditPostSuccess';
  code: Scalars['Int']['output'];
  post: Post;
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
  user: User;
};

export type LogoutResult = LogoutSuccess;

export type LogoutSuccess = Success & {
  __typename?: 'LogoutSuccess';
  code: Scalars['Int']['output'];
  successMsg: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changeCommunityTitle: ChangeCommunityTitleResult;
  changePassword: ChangePasswordResult;
  changeUsername: ChangeUsernameResult;
  createComment: CreateCommentResult;
  createCommentReply: CreateCommentReplyResult;
  createCommunity: CreateCommunityResult;
  createPost: CreatePostResult;
  deleteComment: DeleteCommentResult;
  deleteCommunity: DeleteCommunityResult;
  deletePost: DeletePostResult;
  deleteUser: DeleteUserResult;
  editComment: EditCommentResult;
  editPost: EditPostResult;
  loginUsername: LoginUsernameResult;
  logout: LogoutResult;
  registerUsername: RegisterUsernameResult;
  userJoinCommunity: UserJoinCommunityResult;
  voteComment: VoteCommentResult;
  votePost: VotePostResult;
};


export type MutationChangeCommunityTitleArgs = {
  input: ChangeCommunityTitleInput;
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


export type MutationChangeUsernameArgs = {
  input: ChangeUsernameInput;
};


export type MutationCreateCommentArgs = {
  input: CreateCommentInput;
};


export type MutationCreateCommentReplyArgs = {
  input: CreateCommentReplyInput;
};


export type MutationCreateCommunityArgs = {
  input: CreateCommunityInput;
};


export type MutationCreatePostArgs = {
  input: CreatePostInput;
};


export type MutationDeleteCommentArgs = {
  input: DeleteCommentInput;
};


export type MutationDeleteCommunityArgs = {
  input: DeleteCommunityInput;
};


export type MutationDeletePostArgs = {
  input: DeletePostInput;
};


export type MutationDeleteUserArgs = {
  input: DeleteUserInput;
};


export type MutationEditCommentArgs = {
  input: EditCommentInput;
};


export type MutationEditPostArgs = {
  input: EditPostInput;
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

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Cursor>;
  hasNextPage: Scalars['Boolean']['output'];
};

export type PaginateInput = {
  after?: InputMaybe<CursorInput>;
  first: Scalars['Int']['input'];
};

export type Post = {
  __typename?: 'Post';
  body: Scalars['String']['output'];
  commentCount: Scalars['Int']['output'];
  community: Community;
  created_at: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  owner: User;
  title: Scalars['String']['output'];
  updated_at: Scalars['DateTime']['output'];
  voteStatus: VoteStatus;
  voteSum: Scalars['Int']['output'];
};

export type PostConnection = {
  __typename?: 'PostConnection';
  edges: Array<PostEdge>;
  orderBy?: Maybe<Scalars['String']['output']>;
  pageInfo: PageInfo;
};

export type PostEdge = {
  __typename?: 'PostEdge';
  cursor: Cursor;
  node: Post;
};

export type PostInput = {
  id: Scalars['ID']['input'];
};

export const PostOrderByType = {
  Low: 'LOW',
  New: 'NEW',
  Old: 'OLD',
  Top: 'TOP'
} as const;

export type PostOrderByType = typeof PostOrderByType[keyof typeof PostOrderByType];
export type PostsFilters = {
  communityId?: InputMaybe<Scalars['ID']['input']>;
  orderBy: PostOrderByType;
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type PostsInput = {
  filters: PostsFilters;
  paginate: PaginateInput;
};

export const Provider = {
  Github: 'GITHUB',
  Google: 'GOOGLE',
  Username: 'USERNAME'
} as const;

export type Provider = typeof Provider[keyof typeof Provider];
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
  commentsCount: Scalars['Int']['output'];
  created_at: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  postsCount: Scalars['Int']['output'];
  provider: Provider;
  updated_at: Scalars['DateTime']['output'];
  username: Scalars['String']['output'];
};

export type UserConnection = {
  __typename?: 'UserConnection';
  edges: Array<UserEdge>;
  pageInfo: PageInfo;
};

export type UserEdge = {
  __typename?: 'UserEdge';
  cursor: Cursor;
  node: User;
};

export type UserInput = {
  username: Scalars['String']['input'];
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

export type UsersFilters = {
  usernameContains?: InputMaybe<Scalars['String']['input']>;
};

export type UsersInput = {
  filters: UsersFilters;
  paginate: PaginateInput;
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

export const VoteStatus = {
  Dislike: 'DISLIKE',
  Like: 'LIKE',
  None: 'NONE'
} as const;

export type VoteStatus = typeof VoteStatus[keyof typeof VoteStatus];
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
  ChangeCommunityTitleResult: ( ChangeCommunityTitleInputError ) | ( Omit<ChangeCommunityTitleSuccess, 'community'> & { community: RefType['Community'] } );
  ChangePasswordResult: ( ChangePasswordInputError ) | ( ChangePasswordSuccess );
  ChangeUsernameResult: ( ChangeUsernameInputError ) | ( Omit<ChangeUsernameSuccess, 'user'> & { user: RefType['User'] } );
  CreateCommentReplyResult: ( CreateCommentReplyInputError ) | ( Omit<CreateCommentReplySuccess, 'comment'> & { comment: RefType['Comment'] } );
  CreateCommentResult: ( CreateCommentInputError ) | ( Omit<CreateCommentSuccess, 'comment'> & { comment: RefType['Comment'] } );
  CreateCommunityResult: ( CreateCommunityInputError ) | ( Omit<CreateCommunitySuccess, 'community'> & { community: RefType['Community'] } );
  CreatePostResult: ( CreatePostInputError ) | ( Omit<CreatePostSuccess, 'post'> & { post: RefType['Post'] } );
  DeleteCommentResult: ( DeleteCommentSuccess );
  DeleteCommunityResult: ( DeleteCommunityInputError ) | ( DeleteCommunitySuccess );
  DeletePostResult: ( DeletePostSuccess );
  DeleteUserResult: ( DeleteUserInputError ) | ( DeleteUserSuccess );
  EditCommentResult: ( EditCommentInputError ) | ( Omit<EditCommentSuccess, 'comment'> & { comment: RefType['Comment'] } );
  EditPostResult: ( EditPostInputError ) | ( Omit<EditPostSuccess, 'post'> & { post: RefType['Post'] } );
  LoginUsernameResult: ( LoginUsernameInputError ) | ( Omit<LoginUsernameSuccess, 'user'> & { user: RefType['User'] } );
  LogoutResult: ( LogoutSuccess );
  RegisterUsernameResult: ( RegisterUsernameInputError ) | ( RegisterUsernameSuccess );
  UserJoinCommunityResult: ( Omit<UserJoinCommunitySuccess, 'community'> & { community: RefType['Community'] } );
  VoteCommentResult: ( Omit<VoteCommentSuccess, 'comment'> & { comment: RefType['Comment'] } );
  VotePostResult: ( Omit<VotePostSuccess, 'post'> & { post: RefType['Post'] } );
}>;

/** Mapping of interface types */
export type ResolversInterfaceTypes<RefType extends Record<string, unknown>> = ResolversObject<{
  Error: ( ChangeCommunityTitleInputError ) | ( ChangePasswordInputError ) | ( ChangeUsernameInputError ) | ( CreateCommentInputError ) | ( CreateCommentReplyInputError ) | ( CreateCommunityInputError ) | ( CreatePostInputError ) | ( DeleteCommunityInputError ) | ( DeleteUserInputError ) | ( EditCommentInputError ) | ( EditPostInputError ) | ( LoginUsernameInputError ) | ( RegisterUsernameInputError );
  Success: ( Omit<AuthUserSuccess, 'user'> & { user?: Maybe<RefType['User']> } ) | ( Omit<ChangeCommunityTitleSuccess, 'community'> & { community: RefType['Community'] } ) | ( ChangePasswordSuccess ) | ( Omit<ChangeUsernameSuccess, 'user'> & { user: RefType['User'] } ) | ( Omit<CreateCommentReplySuccess, 'comment'> & { comment: RefType['Comment'] } ) | ( Omit<CreateCommentSuccess, 'comment'> & { comment: RefType['Comment'] } ) | ( Omit<CreateCommunitySuccess, 'community'> & { community: RefType['Community'] } ) | ( Omit<CreatePostSuccess, 'post'> & { post: RefType['Post'] } ) | ( DeleteCommentSuccess ) | ( DeleteCommunitySuccess ) | ( DeletePostSuccess ) | ( DeleteUserSuccess ) | ( Omit<EditCommentSuccess, 'comment'> & { comment: RefType['Comment'] } ) | ( Omit<EditPostSuccess, 'post'> & { post: RefType['Post'] } ) | ( Omit<LoginUsernameSuccess, 'user'> & { user: RefType['User'] } ) | ( LogoutSuccess ) | ( RegisterUsernameSuccess ) | ( Omit<UserJoinCommunitySuccess, 'community'> & { community: RefType['Community'] } ) | ( Omit<VoteCommentSuccess, 'comment'> & { comment: RefType['Comment'] } ) | ( Omit<VotePostSuccess, 'post'> & { post: RefType['Post'] } );
}>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AuthUserInput: AuthUserInput;
  AuthUserResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['AuthUserResult']>;
  AuthUserSuccess: ResolverTypeWrapper<Omit<AuthUserSuccess, 'user'> & { user?: Maybe<ResolversTypes['User']> }>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ChangeCommunityTitleInput: ChangeCommunityTitleInput;
  ChangeCommunityTitleInputError: ResolverTypeWrapper<ChangeCommunityTitleInputError>;
  ChangeCommunityTitleInputErrors: ResolverTypeWrapper<ChangeCommunityTitleInputErrors>;
  ChangeCommunityTitleResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ChangeCommunityTitleResult']>;
  ChangeCommunityTitleSuccess: ResolverTypeWrapper<Omit<ChangeCommunityTitleSuccess, 'community'> & { community: ResolversTypes['Community'] }>;
  ChangePasswordInput: ChangePasswordInput;
  ChangePasswordInputError: ResolverTypeWrapper<ChangePasswordInputError>;
  ChangePasswordInputErrors: ResolverTypeWrapper<ChangePasswordInputErrors>;
  ChangePasswordResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ChangePasswordResult']>;
  ChangePasswordSuccess: ResolverTypeWrapper<ChangePasswordSuccess>;
  ChangeUsernameInput: ChangeUsernameInput;
  ChangeUsernameInputError: ResolverTypeWrapper<ChangeUsernameInputError>;
  ChangeUsernameInputErrors: ResolverTypeWrapper<ChangeUsernameInputErrors>;
  ChangeUsernameResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ChangeUsernameResult']>;
  ChangeUsernameSuccess: ResolverTypeWrapper<Omit<ChangeUsernameSuccess, 'user'> & { user: ResolversTypes['User'] }>;
  Comment: ResolverTypeWrapper<CommentModel>;
  CommentConnection: ResolverTypeWrapper<Omit<CommentConnection, 'edges'> & { edges: Array<ResolversTypes['CommentEdge']> }>;
  CommentEdge: ResolverTypeWrapper<Omit<CommentEdge, 'node'> & { node: ResolversTypes['Comment'] }>;
  CommentInput: CommentInput;
  CommentOrderByType: CommentOrderByType;
  CommentsFilters: CommentsFilters;
  CommentsInput: CommentsInput;
  CommunitiesFilters: CommunitiesFilters;
  CommunitiesInput: CommunitiesInput;
  Community: ResolverTypeWrapper<CommunityModel>;
  CommunityConnection: ResolverTypeWrapper<Omit<CommunityConnection, 'edges'> & { edges: Array<ResolversTypes['CommunityEdge']> }>;
  CommunityEdge: ResolverTypeWrapper<Omit<CommunityEdge, 'node'> & { node: ResolversTypes['Community'] }>;
  CommunityInput: CommunityInput;
  CreateCommentInput: CreateCommentInput;
  CreateCommentInputError: ResolverTypeWrapper<CreateCommentInputError>;
  CreateCommentInputErrors: ResolverTypeWrapper<CreateCommentInputErrors>;
  CreateCommentReplyInput: CreateCommentReplyInput;
  CreateCommentReplyInputError: ResolverTypeWrapper<CreateCommentReplyInputError>;
  CreateCommentReplyInputErrors: ResolverTypeWrapper<CreateCommentReplyInputErrors>;
  CreateCommentReplyResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CreateCommentReplyResult']>;
  CreateCommentReplySuccess: ResolverTypeWrapper<Omit<CreateCommentReplySuccess, 'comment'> & { comment: ResolversTypes['Comment'] }>;
  CreateCommentResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CreateCommentResult']>;
  CreateCommentSuccess: ResolverTypeWrapper<Omit<CreateCommentSuccess, 'comment'> & { comment: ResolversTypes['Comment'] }>;
  CreateCommunityInput: CreateCommunityInput;
  CreateCommunityInputError: ResolverTypeWrapper<CreateCommunityInputError>;
  CreateCommunityInputErrors: ResolverTypeWrapper<CreateCommunityInputErrors>;
  CreateCommunityResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CreateCommunityResult']>;
  CreateCommunitySuccess: ResolverTypeWrapper<Omit<CreateCommunitySuccess, 'community'> & { community: ResolversTypes['Community'] }>;
  CreatePostInput: CreatePostInput;
  CreatePostInputError: ResolverTypeWrapper<CreatePostInputError>;
  CreatePostInputErrors: ResolverTypeWrapper<CreatePostInputErrors>;
  CreatePostResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CreatePostResult']>;
  CreatePostSuccess: ResolverTypeWrapper<Omit<CreatePostSuccess, 'post'> & { post: ResolversTypes['Post'] }>;
  Cursor: ResolverTypeWrapper<Cursor>;
  CursorInput: CursorInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  DeleteCommentInput: DeleteCommentInput;
  DeleteCommentResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['DeleteCommentResult']>;
  DeleteCommentSuccess: ResolverTypeWrapper<DeleteCommentSuccess>;
  DeleteCommunityInput: DeleteCommunityInput;
  DeleteCommunityInputError: ResolverTypeWrapper<DeleteCommunityInputError>;
  DeleteCommunityInputErrors: ResolverTypeWrapper<DeleteCommunityInputErrors>;
  DeleteCommunityResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['DeleteCommunityResult']>;
  DeleteCommunitySuccess: ResolverTypeWrapper<DeleteCommunitySuccess>;
  DeletePostInput: DeletePostInput;
  DeletePostResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['DeletePostResult']>;
  DeletePostSuccess: ResolverTypeWrapper<DeletePostSuccess>;
  DeleteUserInput: DeleteUserInput;
  DeleteUserInputError: ResolverTypeWrapper<DeleteUserInputError>;
  DeleteUserInputErrors: ResolverTypeWrapper<DeleteUserInputErrors>;
  DeleteUserResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['DeleteUserResult']>;
  DeleteUserSuccess: ResolverTypeWrapper<DeleteUserSuccess>;
  EditCommentInput: EditCommentInput;
  EditCommentInputError: ResolverTypeWrapper<EditCommentInputError>;
  EditCommentInputErrors: ResolverTypeWrapper<EditCommentInputErrors>;
  EditCommentResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['EditCommentResult']>;
  EditCommentSuccess: ResolverTypeWrapper<Omit<EditCommentSuccess, 'comment'> & { comment: ResolversTypes['Comment'] }>;
  EditPostInput: EditPostInput;
  EditPostInputError: ResolverTypeWrapper<EditPostInputError>;
  EditPostInputErrors: ResolverTypeWrapper<EditPostInputErrors>;
  EditPostResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['EditPostResult']>;
  EditPostSuccess: ResolverTypeWrapper<Omit<EditPostSuccess, 'post'> & { post: ResolversTypes['Post'] }>;
  Error: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Error']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  LoginUsernameInput: LoginUsernameInput;
  LoginUsernameInputError: ResolverTypeWrapper<LoginUsernameInputError>;
  LoginUsernameResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['LoginUsernameResult']>;
  LoginUsernameSuccess: ResolverTypeWrapper<Omit<LoginUsernameSuccess, 'user'> & { user: ResolversTypes['User'] }>;
  LogoutResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['LogoutResult']>;
  LogoutSuccess: ResolverTypeWrapper<LogoutSuccess>;
  Mutation: ResolverTypeWrapper<{}>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  PaginateInput: PaginateInput;
  Post: ResolverTypeWrapper<PostModel>;
  PostConnection: ResolverTypeWrapper<Omit<PostConnection, 'edges'> & { edges: Array<ResolversTypes['PostEdge']> }>;
  PostEdge: ResolverTypeWrapper<Omit<PostEdge, 'node'> & { node: ResolversTypes['Post'] }>;
  PostInput: PostInput;
  PostOrderByType: PostOrderByType;
  PostsFilters: PostsFilters;
  PostsInput: PostsInput;
  Provider: Provider;
  Query: ResolverTypeWrapper<{}>;
  RegisterUsernameInput: RegisterUsernameInput;
  RegisterUsernameInputError: ResolverTypeWrapper<RegisterUsernameInputError>;
  RegisterUsernameInputErrors: ResolverTypeWrapper<RegisterUsernameInputErrors>;
  RegisterUsernameResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['RegisterUsernameResult']>;
  RegisterUsernameSuccess: ResolverTypeWrapper<RegisterUsernameSuccess>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Success: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Success']>;
  User: ResolverTypeWrapper<UserModel>;
  UserConnection: ResolverTypeWrapper<Omit<UserConnection, 'edges'> & { edges: Array<ResolversTypes['UserEdge']> }>;
  UserEdge: ResolverTypeWrapper<Omit<UserEdge, 'node'> & { node: ResolversTypes['User'] }>;
  UserInput: UserInput;
  UserJoinCommunityInput: UserJoinCommunityInput;
  UserJoinCommunityResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['UserJoinCommunityResult']>;
  UserJoinCommunitySuccess: ResolverTypeWrapper<Omit<UserJoinCommunitySuccess, 'community'> & { community: ResolversTypes['Community'] }>;
  UsersFilters: UsersFilters;
  UsersInput: UsersInput;
  VoteCommentInput: VoteCommentInput;
  VoteCommentResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['VoteCommentResult']>;
  VoteCommentSuccess: ResolverTypeWrapper<Omit<VoteCommentSuccess, 'comment'> & { comment: ResolversTypes['Comment'] }>;
  VotePostInput: VotePostInput;
  VotePostResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['VotePostResult']>;
  VotePostSuccess: ResolverTypeWrapper<Omit<VotePostSuccess, 'post'> & { post: ResolversTypes['Post'] }>;
  VoteStatus: VoteStatus;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthUserInput: AuthUserInput;
  AuthUserResult: ResolversUnionTypes<ResolversParentTypes>['AuthUserResult'];
  AuthUserSuccess: Omit<AuthUserSuccess, 'user'> & { user?: Maybe<ResolversParentTypes['User']> };
  Boolean: Scalars['Boolean']['output'];
  ChangeCommunityTitleInput: ChangeCommunityTitleInput;
  ChangeCommunityTitleInputError: ChangeCommunityTitleInputError;
  ChangeCommunityTitleInputErrors: ChangeCommunityTitleInputErrors;
  ChangeCommunityTitleResult: ResolversUnionTypes<ResolversParentTypes>['ChangeCommunityTitleResult'];
  ChangeCommunityTitleSuccess: Omit<ChangeCommunityTitleSuccess, 'community'> & { community: ResolversParentTypes['Community'] };
  ChangePasswordInput: ChangePasswordInput;
  ChangePasswordInputError: ChangePasswordInputError;
  ChangePasswordInputErrors: ChangePasswordInputErrors;
  ChangePasswordResult: ResolversUnionTypes<ResolversParentTypes>['ChangePasswordResult'];
  ChangePasswordSuccess: ChangePasswordSuccess;
  ChangeUsernameInput: ChangeUsernameInput;
  ChangeUsernameInputError: ChangeUsernameInputError;
  ChangeUsernameInputErrors: ChangeUsernameInputErrors;
  ChangeUsernameResult: ResolversUnionTypes<ResolversParentTypes>['ChangeUsernameResult'];
  ChangeUsernameSuccess: Omit<ChangeUsernameSuccess, 'user'> & { user: ResolversParentTypes['User'] };
  Comment: CommentModel;
  CommentConnection: Omit<CommentConnection, 'edges'> & { edges: Array<ResolversParentTypes['CommentEdge']> };
  CommentEdge: Omit<CommentEdge, 'node'> & { node: ResolversParentTypes['Comment'] };
  CommentInput: CommentInput;
  CommentsFilters: CommentsFilters;
  CommentsInput: CommentsInput;
  CommunitiesFilters: CommunitiesFilters;
  CommunitiesInput: CommunitiesInput;
  Community: CommunityModel;
  CommunityConnection: Omit<CommunityConnection, 'edges'> & { edges: Array<ResolversParentTypes['CommunityEdge']> };
  CommunityEdge: Omit<CommunityEdge, 'node'> & { node: ResolversParentTypes['Community'] };
  CommunityInput: CommunityInput;
  CreateCommentInput: CreateCommentInput;
  CreateCommentInputError: CreateCommentInputError;
  CreateCommentInputErrors: CreateCommentInputErrors;
  CreateCommentReplyInput: CreateCommentReplyInput;
  CreateCommentReplyInputError: CreateCommentReplyInputError;
  CreateCommentReplyInputErrors: CreateCommentReplyInputErrors;
  CreateCommentReplyResult: ResolversUnionTypes<ResolversParentTypes>['CreateCommentReplyResult'];
  CreateCommentReplySuccess: Omit<CreateCommentReplySuccess, 'comment'> & { comment: ResolversParentTypes['Comment'] };
  CreateCommentResult: ResolversUnionTypes<ResolversParentTypes>['CreateCommentResult'];
  CreateCommentSuccess: Omit<CreateCommentSuccess, 'comment'> & { comment: ResolversParentTypes['Comment'] };
  CreateCommunityInput: CreateCommunityInput;
  CreateCommunityInputError: CreateCommunityInputError;
  CreateCommunityInputErrors: CreateCommunityInputErrors;
  CreateCommunityResult: ResolversUnionTypes<ResolversParentTypes>['CreateCommunityResult'];
  CreateCommunitySuccess: Omit<CreateCommunitySuccess, 'community'> & { community: ResolversParentTypes['Community'] };
  CreatePostInput: CreatePostInput;
  CreatePostInputError: CreatePostInputError;
  CreatePostInputErrors: CreatePostInputErrors;
  CreatePostResult: ResolversUnionTypes<ResolversParentTypes>['CreatePostResult'];
  CreatePostSuccess: Omit<CreatePostSuccess, 'post'> & { post: ResolversParentTypes['Post'] };
  Cursor: Cursor;
  CursorInput: CursorInput;
  DateTime: Scalars['DateTime']['output'];
  DeleteCommentInput: DeleteCommentInput;
  DeleteCommentResult: ResolversUnionTypes<ResolversParentTypes>['DeleteCommentResult'];
  DeleteCommentSuccess: DeleteCommentSuccess;
  DeleteCommunityInput: DeleteCommunityInput;
  DeleteCommunityInputError: DeleteCommunityInputError;
  DeleteCommunityInputErrors: DeleteCommunityInputErrors;
  DeleteCommunityResult: ResolversUnionTypes<ResolversParentTypes>['DeleteCommunityResult'];
  DeleteCommunitySuccess: DeleteCommunitySuccess;
  DeletePostInput: DeletePostInput;
  DeletePostResult: ResolversUnionTypes<ResolversParentTypes>['DeletePostResult'];
  DeletePostSuccess: DeletePostSuccess;
  DeleteUserInput: DeleteUserInput;
  DeleteUserInputError: DeleteUserInputError;
  DeleteUserInputErrors: DeleteUserInputErrors;
  DeleteUserResult: ResolversUnionTypes<ResolversParentTypes>['DeleteUserResult'];
  DeleteUserSuccess: DeleteUserSuccess;
  EditCommentInput: EditCommentInput;
  EditCommentInputError: EditCommentInputError;
  EditCommentInputErrors: EditCommentInputErrors;
  EditCommentResult: ResolversUnionTypes<ResolversParentTypes>['EditCommentResult'];
  EditCommentSuccess: Omit<EditCommentSuccess, 'comment'> & { comment: ResolversParentTypes['Comment'] };
  EditPostInput: EditPostInput;
  EditPostInputError: EditPostInputError;
  EditPostInputErrors: EditPostInputErrors;
  EditPostResult: ResolversUnionTypes<ResolversParentTypes>['EditPostResult'];
  EditPostSuccess: Omit<EditPostSuccess, 'post'> & { post: ResolversParentTypes['Post'] };
  Error: ResolversInterfaceTypes<ResolversParentTypes>['Error'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  LoginUsernameInput: LoginUsernameInput;
  LoginUsernameInputError: LoginUsernameInputError;
  LoginUsernameResult: ResolversUnionTypes<ResolversParentTypes>['LoginUsernameResult'];
  LoginUsernameSuccess: Omit<LoginUsernameSuccess, 'user'> & { user: ResolversParentTypes['User'] };
  LogoutResult: ResolversUnionTypes<ResolversParentTypes>['LogoutResult'];
  LogoutSuccess: LogoutSuccess;
  Mutation: {};
  PageInfo: PageInfo;
  PaginateInput: PaginateInput;
  Post: PostModel;
  PostConnection: Omit<PostConnection, 'edges'> & { edges: Array<ResolversParentTypes['PostEdge']> };
  PostEdge: Omit<PostEdge, 'node'> & { node: ResolversParentTypes['Post'] };
  PostInput: PostInput;
  PostsFilters: PostsFilters;
  PostsInput: PostsInput;
  Query: {};
  RegisterUsernameInput: RegisterUsernameInput;
  RegisterUsernameInputError: RegisterUsernameInputError;
  RegisterUsernameInputErrors: RegisterUsernameInputErrors;
  RegisterUsernameResult: ResolversUnionTypes<ResolversParentTypes>['RegisterUsernameResult'];
  RegisterUsernameSuccess: RegisterUsernameSuccess;
  String: Scalars['String']['output'];
  Success: ResolversInterfaceTypes<ResolversParentTypes>['Success'];
  User: UserModel;
  UserConnection: Omit<UserConnection, 'edges'> & { edges: Array<ResolversParentTypes['UserEdge']> };
  UserEdge: Omit<UserEdge, 'node'> & { node: ResolversParentTypes['User'] };
  UserInput: UserInput;
  UserJoinCommunityInput: UserJoinCommunityInput;
  UserJoinCommunityResult: ResolversUnionTypes<ResolversParentTypes>['UserJoinCommunityResult'];
  UserJoinCommunitySuccess: Omit<UserJoinCommunitySuccess, 'community'> & { community: ResolversParentTypes['Community'] };
  UsersFilters: UsersFilters;
  UsersInput: UsersInput;
  VoteCommentInput: VoteCommentInput;
  VoteCommentResult: ResolversUnionTypes<ResolversParentTypes>['VoteCommentResult'];
  VoteCommentSuccess: Omit<VoteCommentSuccess, 'comment'> & { comment: ResolversParentTypes['Comment'] };
  VotePostInput: VotePostInput;
  VotePostResult: ResolversUnionTypes<ResolversParentTypes>['VotePostResult'];
  VotePostSuccess: Omit<VotePostSuccess, 'post'> & { post: ResolversParentTypes['Post'] };
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

export type ChangeCommunityTitleInputErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ChangeCommunityTitleInputError'] = ResolversParentTypes['ChangeCommunityTitleInputError']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  errorMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  inputErrors?: Resolver<ResolversTypes['ChangeCommunityTitleInputErrors'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChangeCommunityTitleInputErrorsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ChangeCommunityTitleInputErrors'] = ResolversParentTypes['ChangeCommunityTitleInputErrors']> = ResolversObject<{
  newTitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChangeCommunityTitleResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ChangeCommunityTitleResult'] = ResolversParentTypes['ChangeCommunityTitleResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ChangeCommunityTitleInputError' | 'ChangeCommunityTitleSuccess', ParentType, ContextType>;
}>;

export type ChangeCommunityTitleSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ChangeCommunityTitleSuccess'] = ResolversParentTypes['ChangeCommunityTitleSuccess']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  community?: Resolver<ResolversTypes['Community'], ParentType, ContextType>;
  successMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChangePasswordInputErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ChangePasswordInputError'] = ResolversParentTypes['ChangePasswordInputError']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  errorMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  inputErrors?: Resolver<ResolversTypes['ChangePasswordInputErrors'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChangePasswordInputErrorsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ChangePasswordInputErrors'] = ResolversParentTypes['ChangePasswordInputErrors']> = ResolversObject<{
  currentPassword?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  newPassword?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChangePasswordResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ChangePasswordResult'] = ResolversParentTypes['ChangePasswordResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ChangePasswordInputError' | 'ChangePasswordSuccess', ParentType, ContextType>;
}>;

export type ChangePasswordSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ChangePasswordSuccess'] = ResolversParentTypes['ChangePasswordSuccess']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  successMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChangeUsernameInputErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ChangeUsernameInputError'] = ResolversParentTypes['ChangeUsernameInputError']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  errorMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  inputErrors?: Resolver<ResolversTypes['ChangeUsernameInputErrors'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChangeUsernameInputErrorsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ChangeUsernameInputErrors'] = ResolversParentTypes['ChangeUsernameInputErrors']> = ResolversObject<{
  password?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ChangeUsernameResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ChangeUsernameResult'] = ResolversParentTypes['ChangeUsernameResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ChangeUsernameInputError' | 'ChangeUsernameSuccess', ParentType, ContextType>;
}>;

export type ChangeUsernameSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ChangeUsernameSuccess'] = ResolversParentTypes['ChangeUsernameSuccess']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  successMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommentResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']> = ResolversObject<{
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['Comment']>, ParentType, ContextType>;
  post?: Resolver<ResolversTypes['Post'], ParentType, ContextType>;
  replyCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  voteStatus?: Resolver<ResolversTypes['VoteStatus'], ParentType, ContextType>;
  voteSum?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommentConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CommentConnection'] = ResolversParentTypes['CommentConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['CommentEdge']>, ParentType, ContextType>;
  orderBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  replies?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommentEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CommentEdge'] = ResolversParentTypes['CommentEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['Cursor'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Comment'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommunityResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Community'] = ResolversParentTypes['Community']> = ResolversObject<{
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  inCommunity?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  memberCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  postCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommunityConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CommunityConnection'] = ResolversParentTypes['CommunityConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['CommunityEdge']>, ParentType, ContextType>;
  memberOf?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommunityEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CommunityEdge'] = ResolversParentTypes['CommunityEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['Cursor'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Community'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateCommentInputErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateCommentInputError'] = ResolversParentTypes['CreateCommentInputError']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  errorMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  inputErrors?: Resolver<ResolversTypes['CreateCommentInputErrors'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateCommentInputErrorsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateCommentInputErrors'] = ResolversParentTypes['CreateCommentInputErrors']> = ResolversObject<{
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateCommentReplyInputErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateCommentReplyInputError'] = ResolversParentTypes['CreateCommentReplyInputError']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  errorMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  inputErrors?: Resolver<ResolversTypes['CreateCommentReplyInputErrors'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateCommentReplyInputErrorsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateCommentReplyInputErrors'] = ResolversParentTypes['CreateCommentReplyInputErrors']> = ResolversObject<{
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  commentId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateCommentReplyResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateCommentReplyResult'] = ResolversParentTypes['CreateCommentReplyResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CreateCommentReplyInputError' | 'CreateCommentReplySuccess', ParentType, ContextType>;
}>;

export type CreateCommentReplySuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateCommentReplySuccess'] = ResolversParentTypes['CreateCommentReplySuccess']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  comment?: Resolver<ResolversTypes['Comment'], ParentType, ContextType>;
  successMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateCommentResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateCommentResult'] = ResolversParentTypes['CreateCommentResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CreateCommentInputError' | 'CreateCommentSuccess', ParentType, ContextType>;
}>;

export type CreateCommentSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateCommentSuccess'] = ResolversParentTypes['CreateCommentSuccess']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  comment?: Resolver<ResolversTypes['Comment'], ParentType, ContextType>;
  successMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  __resolveType: TypeResolveFn<'CreateCommunityInputError' | 'CreateCommunitySuccess', ParentType, ContextType>;
}>;

export type CreateCommunitySuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateCommunitySuccess'] = ResolversParentTypes['CreateCommunitySuccess']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  community?: Resolver<ResolversTypes['Community'], ParentType, ContextType>;
  successMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreatePostInputErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreatePostInputError'] = ResolversParentTypes['CreatePostInputError']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  errorMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  inputErrors?: Resolver<ResolversTypes['CreatePostInputErrors'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreatePostInputErrorsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreatePostInputErrors'] = ResolversParentTypes['CreatePostInputErrors']> = ResolversObject<{
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  communityId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreatePostResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreatePostResult'] = ResolversParentTypes['CreatePostResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CreatePostInputError' | 'CreatePostSuccess', ParentType, ContextType>;
}>;

export type CreatePostSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreatePostSuccess'] = ResolversParentTypes['CreatePostSuccess']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  post?: Resolver<ResolversTypes['Post'], ParentType, ContextType>;
  successMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CursorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Cursor'] = ResolversParentTypes['Cursor']> = ResolversObject<{
  created_at?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  voteSum?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DeleteCommentResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeleteCommentResult'] = ResolversParentTypes['DeleteCommentResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'DeleteCommentSuccess', ParentType, ContextType>;
}>;

export type DeleteCommentSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeleteCommentSuccess'] = ResolversParentTypes['DeleteCommentSuccess']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  successMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DeleteCommunityInputErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeleteCommunityInputError'] = ResolversParentTypes['DeleteCommunityInputError']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  errorMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  inputErrors?: Resolver<Maybe<ResolversTypes['DeleteCommunityInputErrors']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DeleteCommunityInputErrorsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeleteCommunityInputErrors'] = ResolversParentTypes['DeleteCommunityInputErrors']> = ResolversObject<{
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DeleteCommunityResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeleteCommunityResult'] = ResolversParentTypes['DeleteCommunityResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'DeleteCommunityInputError' | 'DeleteCommunitySuccess', ParentType, ContextType>;
}>;

export type DeleteCommunitySuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeleteCommunitySuccess'] = ResolversParentTypes['DeleteCommunitySuccess']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  successMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DeletePostResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeletePostResult'] = ResolversParentTypes['DeletePostResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'DeletePostSuccess', ParentType, ContextType>;
}>;

export type DeletePostSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeletePostSuccess'] = ResolversParentTypes['DeletePostSuccess']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  successMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DeleteUserInputErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeleteUserInputError'] = ResolversParentTypes['DeleteUserInputError']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  errorMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  inputErrors?: Resolver<ResolversTypes['DeleteUserInputErrors'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DeleteUserInputErrorsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeleteUserInputErrors'] = ResolversParentTypes['DeleteUserInputErrors']> = ResolversObject<{
  password?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DeleteUserResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeleteUserResult'] = ResolversParentTypes['DeleteUserResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'DeleteUserInputError' | 'DeleteUserSuccess', ParentType, ContextType>;
}>;

export type DeleteUserSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeleteUserSuccess'] = ResolversParentTypes['DeleteUserSuccess']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  successMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EditCommentInputErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EditCommentInputError'] = ResolversParentTypes['EditCommentInputError']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  errorMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  inputErrors?: Resolver<ResolversTypes['EditCommentInputErrors'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EditCommentInputErrorsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EditCommentInputErrors'] = ResolversParentTypes['EditCommentInputErrors']> = ResolversObject<{
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EditCommentResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EditCommentResult'] = ResolversParentTypes['EditCommentResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'EditCommentInputError' | 'EditCommentSuccess', ParentType, ContextType>;
}>;

export type EditCommentSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EditCommentSuccess'] = ResolversParentTypes['EditCommentSuccess']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  comment?: Resolver<ResolversTypes['Comment'], ParentType, ContextType>;
  successMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EditPostInputErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EditPostInputError'] = ResolversParentTypes['EditPostInputError']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  errorMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  inputErrors?: Resolver<ResolversTypes['EditPostInputErrors'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EditPostInputErrorsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EditPostInputErrors'] = ResolversParentTypes['EditPostInputErrors']> = ResolversObject<{
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type EditPostResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EditPostResult'] = ResolversParentTypes['EditPostResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'EditPostInputError' | 'EditPostSuccess', ParentType, ContextType>;
}>;

export type EditPostSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EditPostSuccess'] = ResolversParentTypes['EditPostSuccess']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  post?: Resolver<ResolversTypes['Post'], ParentType, ContextType>;
  successMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Error'] = ResolversParentTypes['Error']> = ResolversObject<{
  __resolveType: TypeResolveFn<'ChangeCommunityTitleInputError' | 'ChangePasswordInputError' | 'ChangeUsernameInputError' | 'CreateCommentInputError' | 'CreateCommentReplyInputError' | 'CreateCommunityInputError' | 'CreatePostInputError' | 'DeleteCommunityInputError' | 'DeleteUserInputError' | 'EditCommentInputError' | 'EditPostInputError' | 'LoginUsernameInputError' | 'RegisterUsernameInputError', ParentType, ContextType>;
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  errorMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type LoginUsernameInputErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LoginUsernameInputError'] = ResolversParentTypes['LoginUsernameInputError']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  errorMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LoginUsernameResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LoginUsernameResult'] = ResolversParentTypes['LoginUsernameResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'LoginUsernameInputError' | 'LoginUsernameSuccess', ParentType, ContextType>;
}>;

export type LoginUsernameSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LoginUsernameSuccess'] = ResolversParentTypes['LoginUsernameSuccess']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  successMsg?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LogoutResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LogoutResult'] = ResolversParentTypes['LogoutResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'LogoutSuccess', ParentType, ContextType>;
}>;

export type LogoutSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['LogoutSuccess'] = ResolversParentTypes['LogoutSuccess']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  successMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  changeCommunityTitle?: Resolver<ResolversTypes['ChangeCommunityTitleResult'], ParentType, ContextType, RequireFields<MutationChangeCommunityTitleArgs, 'input'>>;
  changePassword?: Resolver<ResolversTypes['ChangePasswordResult'], ParentType, ContextType, RequireFields<MutationChangePasswordArgs, 'input'>>;
  changeUsername?: Resolver<ResolversTypes['ChangeUsernameResult'], ParentType, ContextType, RequireFields<MutationChangeUsernameArgs, 'input'>>;
  createComment?: Resolver<ResolversTypes['CreateCommentResult'], ParentType, ContextType, RequireFields<MutationCreateCommentArgs, 'input'>>;
  createCommentReply?: Resolver<ResolversTypes['CreateCommentReplyResult'], ParentType, ContextType, RequireFields<MutationCreateCommentReplyArgs, 'input'>>;
  createCommunity?: Resolver<ResolversTypes['CreateCommunityResult'], ParentType, ContextType, RequireFields<MutationCreateCommunityArgs, 'input'>>;
  createPost?: Resolver<ResolversTypes['CreatePostResult'], ParentType, ContextType, RequireFields<MutationCreatePostArgs, 'input'>>;
  deleteComment?: Resolver<ResolversTypes['DeleteCommentResult'], ParentType, ContextType, RequireFields<MutationDeleteCommentArgs, 'input'>>;
  deleteCommunity?: Resolver<ResolversTypes['DeleteCommunityResult'], ParentType, ContextType, RequireFields<MutationDeleteCommunityArgs, 'input'>>;
  deletePost?: Resolver<ResolversTypes['DeletePostResult'], ParentType, ContextType, RequireFields<MutationDeletePostArgs, 'input'>>;
  deleteUser?: Resolver<ResolversTypes['DeleteUserResult'], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'input'>>;
  editComment?: Resolver<ResolversTypes['EditCommentResult'], ParentType, ContextType, RequireFields<MutationEditCommentArgs, 'input'>>;
  editPost?: Resolver<ResolversTypes['EditPostResult'], ParentType, ContextType, RequireFields<MutationEditPostArgs, 'input'>>;
  loginUsername?: Resolver<ResolversTypes['LoginUsernameResult'], ParentType, ContextType, RequireFields<MutationLoginUsernameArgs, 'input'>>;
  logout?: Resolver<ResolversTypes['LogoutResult'], ParentType, ContextType>;
  registerUsername?: Resolver<ResolversTypes['RegisterUsernameResult'], ParentType, ContextType, RequireFields<MutationRegisterUsernameArgs, 'input'>>;
  userJoinCommunity?: Resolver<ResolversTypes['UserJoinCommunityResult'], ParentType, ContextType, RequireFields<MutationUserJoinCommunityArgs, 'input'>>;
  voteComment?: Resolver<ResolversTypes['VoteCommentResult'], ParentType, ContextType, RequireFields<MutationVoteCommentArgs, 'input'>>;
  votePost?: Resolver<ResolversTypes['VotePostResult'], ParentType, ContextType, RequireFields<MutationVotePostArgs, 'input'>>;
}>;

export type PageInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = ResolversObject<{
  endCursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = ResolversObject<{
  body?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  commentCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  community?: Resolver<ResolversTypes['Community'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updated_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  voteStatus?: Resolver<ResolversTypes['VoteStatus'], ParentType, ContextType>;
  voteSum?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PostConnection'] = ResolversParentTypes['PostConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['PostEdge']>, ParentType, ContextType>;
  orderBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PostEdge'] = ResolversParentTypes['PostEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['Cursor'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Post'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  authUser?: Resolver<ResolversTypes['AuthUserResult'], ParentType, ContextType>;
  comment?: Resolver<Maybe<ResolversTypes['Comment']>, ParentType, ContextType, RequireFields<QueryCommentArgs, 'input'>>;
  comments?: Resolver<ResolversTypes['CommentConnection'], ParentType, ContextType, RequireFields<QueryCommentsArgs, 'input'>>;
  communities?: Resolver<ResolversTypes['CommunityConnection'], ParentType, ContextType, RequireFields<QueryCommunitiesArgs, 'input'>>;
  community?: Resolver<Maybe<ResolversTypes['Community']>, ParentType, ContextType, RequireFields<QueryCommunityArgs, 'input'>>;
  post?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<QueryPostArgs, 'input'>>;
  posts?: Resolver<ResolversTypes['PostConnection'], ParentType, ContextType, RequireFields<QueryPostsArgs, 'input'>>;
  titleExists?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<QueryTitleExistsArgs, 'title'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'input'>>;
  usernameExists?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<QueryUsernameExistsArgs, 'username'>>;
  users?: Resolver<ResolversTypes['UserConnection'], ParentType, ContextType, RequireFields<QueryUsersArgs, 'input'>>;
}>;

export type RegisterUsernameInputErrorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RegisterUsernameInputError'] = ResolversParentTypes['RegisterUsernameInputError']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  errorMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  inputErrors?: Resolver<ResolversTypes['RegisterUsernameInputErrors'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RegisterUsernameInputErrorsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RegisterUsernameInputErrors'] = ResolversParentTypes['RegisterUsernameInputErrors']> = ResolversObject<{
  password?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type RegisterUsernameResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RegisterUsernameResult'] = ResolversParentTypes['RegisterUsernameResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'RegisterUsernameInputError' | 'RegisterUsernameSuccess', ParentType, ContextType>;
}>;

export type RegisterUsernameSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['RegisterUsernameSuccess'] = ResolversParentTypes['RegisterUsernameSuccess']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  successMsg?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Success'] = ResolversParentTypes['Success']> = ResolversObject<{
  __resolveType: TypeResolveFn<'AuthUserSuccess' | 'ChangeCommunityTitleSuccess' | 'ChangePasswordSuccess' | 'ChangeUsernameSuccess' | 'CreateCommentReplySuccess' | 'CreateCommentSuccess' | 'CreateCommunitySuccess' | 'CreatePostSuccess' | 'DeleteCommentSuccess' | 'DeleteCommunitySuccess' | 'DeletePostSuccess' | 'DeleteUserSuccess' | 'EditCommentSuccess' | 'EditPostSuccess' | 'LoginUsernameSuccess' | 'LogoutSuccess' | 'RegisterUsernameSuccess' | 'UserJoinCommunitySuccess' | 'VoteCommentSuccess' | 'VotePostSuccess', ParentType, ContextType>;
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  successMsg?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  commentsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  created_at?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  postsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
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
  cursor?: Resolver<ResolversTypes['Cursor'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserJoinCommunityResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserJoinCommunityResult'] = ResolversParentTypes['UserJoinCommunityResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'UserJoinCommunitySuccess', ParentType, ContextType>;
}>;

export type UserJoinCommunitySuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserJoinCommunitySuccess'] = ResolversParentTypes['UserJoinCommunitySuccess']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  community?: Resolver<ResolversTypes['Community'], ParentType, ContextType>;
  successMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VoteCommentResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['VoteCommentResult'] = ResolversParentTypes['VoteCommentResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'VoteCommentSuccess', ParentType, ContextType>;
}>;

export type VoteCommentSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['VoteCommentSuccess'] = ResolversParentTypes['VoteCommentSuccess']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  comment?: Resolver<ResolversTypes['Comment'], ParentType, ContextType>;
  successMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VotePostResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['VotePostResult'] = ResolversParentTypes['VotePostResult']> = ResolversObject<{
  __resolveType: TypeResolveFn<'VotePostSuccess', ParentType, ContextType>;
}>;

export type VotePostSuccessResolvers<ContextType = Context, ParentType extends ResolversParentTypes['VotePostSuccess'] = ResolversParentTypes['VotePostSuccess']> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  post?: Resolver<ResolversTypes['Post'], ParentType, ContextType>;
  successMsg?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  AuthUserResult?: AuthUserResultResolvers<ContextType>;
  AuthUserSuccess?: AuthUserSuccessResolvers<ContextType>;
  ChangeCommunityTitleInputError?: ChangeCommunityTitleInputErrorResolvers<ContextType>;
  ChangeCommunityTitleInputErrors?: ChangeCommunityTitleInputErrorsResolvers<ContextType>;
  ChangeCommunityTitleResult?: ChangeCommunityTitleResultResolvers<ContextType>;
  ChangeCommunityTitleSuccess?: ChangeCommunityTitleSuccessResolvers<ContextType>;
  ChangePasswordInputError?: ChangePasswordInputErrorResolvers<ContextType>;
  ChangePasswordInputErrors?: ChangePasswordInputErrorsResolvers<ContextType>;
  ChangePasswordResult?: ChangePasswordResultResolvers<ContextType>;
  ChangePasswordSuccess?: ChangePasswordSuccessResolvers<ContextType>;
  ChangeUsernameInputError?: ChangeUsernameInputErrorResolvers<ContextType>;
  ChangeUsernameInputErrors?: ChangeUsernameInputErrorsResolvers<ContextType>;
  ChangeUsernameResult?: ChangeUsernameResultResolvers<ContextType>;
  ChangeUsernameSuccess?: ChangeUsernameSuccessResolvers<ContextType>;
  Comment?: CommentResolvers<ContextType>;
  CommentConnection?: CommentConnectionResolvers<ContextType>;
  CommentEdge?: CommentEdgeResolvers<ContextType>;
  Community?: CommunityResolvers<ContextType>;
  CommunityConnection?: CommunityConnectionResolvers<ContextType>;
  CommunityEdge?: CommunityEdgeResolvers<ContextType>;
  CreateCommentInputError?: CreateCommentInputErrorResolvers<ContextType>;
  CreateCommentInputErrors?: CreateCommentInputErrorsResolvers<ContextType>;
  CreateCommentReplyInputError?: CreateCommentReplyInputErrorResolvers<ContextType>;
  CreateCommentReplyInputErrors?: CreateCommentReplyInputErrorsResolvers<ContextType>;
  CreateCommentReplyResult?: CreateCommentReplyResultResolvers<ContextType>;
  CreateCommentReplySuccess?: CreateCommentReplySuccessResolvers<ContextType>;
  CreateCommentResult?: CreateCommentResultResolvers<ContextType>;
  CreateCommentSuccess?: CreateCommentSuccessResolvers<ContextType>;
  CreateCommunityInputError?: CreateCommunityInputErrorResolvers<ContextType>;
  CreateCommunityInputErrors?: CreateCommunityInputErrorsResolvers<ContextType>;
  CreateCommunityResult?: CreateCommunityResultResolvers<ContextType>;
  CreateCommunitySuccess?: CreateCommunitySuccessResolvers<ContextType>;
  CreatePostInputError?: CreatePostInputErrorResolvers<ContextType>;
  CreatePostInputErrors?: CreatePostInputErrorsResolvers<ContextType>;
  CreatePostResult?: CreatePostResultResolvers<ContextType>;
  CreatePostSuccess?: CreatePostSuccessResolvers<ContextType>;
  Cursor?: CursorResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  DeleteCommentResult?: DeleteCommentResultResolvers<ContextType>;
  DeleteCommentSuccess?: DeleteCommentSuccessResolvers<ContextType>;
  DeleteCommunityInputError?: DeleteCommunityInputErrorResolvers<ContextType>;
  DeleteCommunityInputErrors?: DeleteCommunityInputErrorsResolvers<ContextType>;
  DeleteCommunityResult?: DeleteCommunityResultResolvers<ContextType>;
  DeleteCommunitySuccess?: DeleteCommunitySuccessResolvers<ContextType>;
  DeletePostResult?: DeletePostResultResolvers<ContextType>;
  DeletePostSuccess?: DeletePostSuccessResolvers<ContextType>;
  DeleteUserInputError?: DeleteUserInputErrorResolvers<ContextType>;
  DeleteUserInputErrors?: DeleteUserInputErrorsResolvers<ContextType>;
  DeleteUserResult?: DeleteUserResultResolvers<ContextType>;
  DeleteUserSuccess?: DeleteUserSuccessResolvers<ContextType>;
  EditCommentInputError?: EditCommentInputErrorResolvers<ContextType>;
  EditCommentInputErrors?: EditCommentInputErrorsResolvers<ContextType>;
  EditCommentResult?: EditCommentResultResolvers<ContextType>;
  EditCommentSuccess?: EditCommentSuccessResolvers<ContextType>;
  EditPostInputError?: EditPostInputErrorResolvers<ContextType>;
  EditPostInputErrors?: EditPostInputErrorsResolvers<ContextType>;
  EditPostResult?: EditPostResultResolvers<ContextType>;
  EditPostSuccess?: EditPostSuccessResolvers<ContextType>;
  Error?: ErrorResolvers<ContextType>;
  LoginUsernameInputError?: LoginUsernameInputErrorResolvers<ContextType>;
  LoginUsernameResult?: LoginUsernameResultResolvers<ContextType>;
  LoginUsernameSuccess?: LoginUsernameSuccessResolvers<ContextType>;
  LogoutResult?: LogoutResultResolvers<ContextType>;
  LogoutSuccess?: LogoutSuccessResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  PostConnection?: PostConnectionResolvers<ContextType>;
  PostEdge?: PostEdgeResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RegisterUsernameInputError?: RegisterUsernameInputErrorResolvers<ContextType>;
  RegisterUsernameInputErrors?: RegisterUsernameInputErrorsResolvers<ContextType>;
  RegisterUsernameResult?: RegisterUsernameResultResolvers<ContextType>;
  RegisterUsernameSuccess?: RegisterUsernameSuccessResolvers<ContextType>;
  Success?: SuccessResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserConnection?: UserConnectionResolvers<ContextType>;
  UserEdge?: UserEdgeResolvers<ContextType>;
  UserJoinCommunityResult?: UserJoinCommunityResultResolvers<ContextType>;
  UserJoinCommunitySuccess?: UserJoinCommunitySuccessResolvers<ContextType>;
  VoteCommentResult?: VoteCommentResultResolvers<ContextType>;
  VoteCommentSuccess?: VoteCommentSuccessResolvers<ContextType>;
  VotePostResult?: VotePostResultResolvers<ContextType>;
  VotePostSuccess?: VotePostSuccessResolvers<ContextType>;
}>;

