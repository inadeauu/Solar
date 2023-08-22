/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation UserJoinCommunity($input: UserJoinCommunityInput!) {\n    userJoinCommunity(input: $input) {\n      ... on UserJoinCommunitySuccess {\n        __typename\n        successMsg\n        code\n        community {\n          id\n          memberCount\n          postCount\n          inCommunity\n          owner {\n            id\n            username\n          }\n          title\n          created_at\n          updated_at\n        }\n      }\n    }\n  }\n": types.UserJoinCommunityDocument,
    "\n  query PostFeed($input: PostsInput!) {\n    posts(input: $input) {\n      edges {\n        node {\n          id\n          body\n          created_at\n          title\n          commentCount\n          voteSum\n          voteStatus\n          community {\n            id\n            title\n          }\n          owner {\n            id\n            username\n          }\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n": types.PostFeedDocument,
    "\n  mutation CreateCommunityPost($input: CreatePostInput!) {\n    createPost(input: $input) {\n      ... on CreatePostSuccess {\n        __typename\n        successMsg\n        code\n      }\n      ... on Error {\n        __typename\n        errorMsg\n        code\n      }\n    }\n  }\n": types.CreateCommunityPostDocument,
    "\n  mutation Logout {\n    logout {\n      ... on LogoutSuccess {\n        __typename\n        successMsg\n        code\n      }\n    }\n  }\n": types.LogoutDocument,
    "\n  query PostCommentFeed($input: CommentsInput!) {\n    comments(input: $input) {\n      edges {\n        node {\n          body\n          created_at\n          id\n          owner {\n            id\n            username\n          }\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n": types.PostCommentFeedDocument,
    "\n  mutation CreateComment($input: CreateCommentInput!) {\n    createComment(input: $input) {\n      ... on CreateCommentSuccess {\n        __typename\n        successMsg\n        code\n      }\n      ... on Error {\n        __typename\n        errorMsg\n        code\n      }\n    }\n  }\n": types.CreateCommentDocument,
    "\n  query CommunitiesSearch($input: CommunitiesInput!) {\n    communities(input: $input) {\n      edges {\n        node {\n          id\n          memberCount\n          title\n          created_at\n        }\n      }\n    }\n  }\n": types.CommunitiesSearchDocument,
    "\n  query UsersSearch($input: UsersInput!) {\n    users(input: $input) {\n      edges {\n        node {\n          username\n          created_at\n          postsCount\n          commentsCount\n        }\n      }\n    }\n  }\n": types.UsersSearchDocument,
    "\n  query AuthUser {\n    authUser {\n      ... on AuthUserSuccess {\n        __typename\n        successMsg\n        code\n        user {\n          username\n          updated_at\n          provider\n          id\n          created_at\n        }\n      }\n    }\n  }\n": types.AuthUserDocument,
    "\n  mutation VotePost($input: VotePostInput!) {\n    votePost(input: $input) {\n      ... on VotePostSuccess {\n        successMsg\n        code\n        post {\n          id\n          body\n          created_at\n          title\n          commentCount\n          voteSum\n          voteStatus\n          community {\n            id\n            title\n          }\n          owner {\n            id\n            username\n          }\n        }\n      }\n    }\n  }\n": types.VotePostDocument,
    "\n  query Community($input: CommunityInput!) {\n    community(input: $input) {\n      id\n      memberCount\n      postCount\n      inCommunity\n      owner {\n        id\n        username\n      }\n      title\n      created_at\n      updated_at\n    }\n  }\n": types.CommunityDocument,
    "\n  query CommunityTitleExists($title: String!) {\n    titleExists(title: $title)\n  }\n": types.CommunityTitleExistsDocument,
    "\n  mutation CreateCommunity($input: CreateCommunityInput!) {\n    createCommunity(input: $input) {\n      ... on CreateCommunitySuccess {\n        __typename\n        successMsg\n        code\n      }\n      ... on Error {\n        __typename\n        errorMsg\n        code\n      }\n    }\n  }\n": types.CreateCommunityDocument,
    "\n  mutation LoginUsername($input: LoginUsernameInput!) {\n    loginUsername(input: $input) {\n      ... on LoginUsernameSuccess {\n        __typename\n        successMsg\n        code\n      }\n      ... on Error {\n        __typename\n        errorMsg\n        code\n      }\n    }\n  }\n": types.LoginUsernameDocument,
    "\n  query SinglePost($input: PostInput!) {\n    post(input: $input) {\n      id\n      body\n      created_at\n      title\n      commentCount\n      voteSum\n      voteStatus\n      community {\n        id\n        title\n      }\n      owner {\n        id\n        username\n      }\n    }\n  }\n": types.SinglePostDocument,
    "\n  mutation RegisterUsername($input: RegisterUsernameInput!) {\n    registerUsername(input: $input) {\n      ... on RegisterUsernameSuccess {\n        __typename\n        successMsg\n        code\n      }\n      ... on Error {\n        __typename\n        errorMsg\n        code\n      }\n    }\n  }\n": types.RegisterUsernameDocument,
    "\n  query UsernameExists($username: String!) {\n    usernameExists(username: $username)\n  }\n": types.UsernameExistsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UserJoinCommunity($input: UserJoinCommunityInput!) {\n    userJoinCommunity(input: $input) {\n      ... on UserJoinCommunitySuccess {\n        __typename\n        successMsg\n        code\n        community {\n          id\n          memberCount\n          postCount\n          inCommunity\n          owner {\n            id\n            username\n          }\n          title\n          created_at\n          updated_at\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UserJoinCommunity($input: UserJoinCommunityInput!) {\n    userJoinCommunity(input: $input) {\n      ... on UserJoinCommunitySuccess {\n        __typename\n        successMsg\n        code\n        community {\n          id\n          memberCount\n          postCount\n          inCommunity\n          owner {\n            id\n            username\n          }\n          title\n          created_at\n          updated_at\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PostFeed($input: PostsInput!) {\n    posts(input: $input) {\n      edges {\n        node {\n          id\n          body\n          created_at\n          title\n          commentCount\n          voteSum\n          voteStatus\n          community {\n            id\n            title\n          }\n          owner {\n            id\n            username\n          }\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n"): (typeof documents)["\n  query PostFeed($input: PostsInput!) {\n    posts(input: $input) {\n      edges {\n        node {\n          id\n          body\n          created_at\n          title\n          commentCount\n          voteSum\n          voteStatus\n          community {\n            id\n            title\n          }\n          owner {\n            id\n            username\n          }\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCommunityPost($input: CreatePostInput!) {\n    createPost(input: $input) {\n      ... on CreatePostSuccess {\n        __typename\n        successMsg\n        code\n      }\n      ... on Error {\n        __typename\n        errorMsg\n        code\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCommunityPost($input: CreatePostInput!) {\n    createPost(input: $input) {\n      ... on CreatePostSuccess {\n        __typename\n        successMsg\n        code\n      }\n      ... on Error {\n        __typename\n        errorMsg\n        code\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Logout {\n    logout {\n      ... on LogoutSuccess {\n        __typename\n        successMsg\n        code\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Logout {\n    logout {\n      ... on LogoutSuccess {\n        __typename\n        successMsg\n        code\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query PostCommentFeed($input: CommentsInput!) {\n    comments(input: $input) {\n      edges {\n        node {\n          body\n          created_at\n          id\n          owner {\n            id\n            username\n          }\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n"): (typeof documents)["\n  query PostCommentFeed($input: CommentsInput!) {\n    comments(input: $input) {\n      edges {\n        node {\n          body\n          created_at\n          id\n          owner {\n            id\n            username\n          }\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateComment($input: CreateCommentInput!) {\n    createComment(input: $input) {\n      ... on CreateCommentSuccess {\n        __typename\n        successMsg\n        code\n      }\n      ... on Error {\n        __typename\n        errorMsg\n        code\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateComment($input: CreateCommentInput!) {\n    createComment(input: $input) {\n      ... on CreateCommentSuccess {\n        __typename\n        successMsg\n        code\n      }\n      ... on Error {\n        __typename\n        errorMsg\n        code\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CommunitiesSearch($input: CommunitiesInput!) {\n    communities(input: $input) {\n      edges {\n        node {\n          id\n          memberCount\n          title\n          created_at\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query CommunitiesSearch($input: CommunitiesInput!) {\n    communities(input: $input) {\n      edges {\n        node {\n          id\n          memberCount\n          title\n          created_at\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query UsersSearch($input: UsersInput!) {\n    users(input: $input) {\n      edges {\n        node {\n          username\n          created_at\n          postsCount\n          commentsCount\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query UsersSearch($input: UsersInput!) {\n    users(input: $input) {\n      edges {\n        node {\n          username\n          created_at\n          postsCount\n          commentsCount\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AuthUser {\n    authUser {\n      ... on AuthUserSuccess {\n        __typename\n        successMsg\n        code\n        user {\n          username\n          updated_at\n          provider\n          id\n          created_at\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query AuthUser {\n    authUser {\n      ... on AuthUserSuccess {\n        __typename\n        successMsg\n        code\n        user {\n          username\n          updated_at\n          provider\n          id\n          created_at\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation VotePost($input: VotePostInput!) {\n    votePost(input: $input) {\n      ... on VotePostSuccess {\n        successMsg\n        code\n        post {\n          id\n          body\n          created_at\n          title\n          commentCount\n          voteSum\n          voteStatus\n          community {\n            id\n            title\n          }\n          owner {\n            id\n            username\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation VotePost($input: VotePostInput!) {\n    votePost(input: $input) {\n      ... on VotePostSuccess {\n        successMsg\n        code\n        post {\n          id\n          body\n          created_at\n          title\n          commentCount\n          voteSum\n          voteStatus\n          community {\n            id\n            title\n          }\n          owner {\n            id\n            username\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Community($input: CommunityInput!) {\n    community(input: $input) {\n      id\n      memberCount\n      postCount\n      inCommunity\n      owner {\n        id\n        username\n      }\n      title\n      created_at\n      updated_at\n    }\n  }\n"): (typeof documents)["\n  query Community($input: CommunityInput!) {\n    community(input: $input) {\n      id\n      memberCount\n      postCount\n      inCommunity\n      owner {\n        id\n        username\n      }\n      title\n      created_at\n      updated_at\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CommunityTitleExists($title: String!) {\n    titleExists(title: $title)\n  }\n"): (typeof documents)["\n  query CommunityTitleExists($title: String!) {\n    titleExists(title: $title)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCommunity($input: CreateCommunityInput!) {\n    createCommunity(input: $input) {\n      ... on CreateCommunitySuccess {\n        __typename\n        successMsg\n        code\n      }\n      ... on Error {\n        __typename\n        errorMsg\n        code\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCommunity($input: CreateCommunityInput!) {\n    createCommunity(input: $input) {\n      ... on CreateCommunitySuccess {\n        __typename\n        successMsg\n        code\n      }\n      ... on Error {\n        __typename\n        errorMsg\n        code\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation LoginUsername($input: LoginUsernameInput!) {\n    loginUsername(input: $input) {\n      ... on LoginUsernameSuccess {\n        __typename\n        successMsg\n        code\n      }\n      ... on Error {\n        __typename\n        errorMsg\n        code\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation LoginUsername($input: LoginUsernameInput!) {\n    loginUsername(input: $input) {\n      ... on LoginUsernameSuccess {\n        __typename\n        successMsg\n        code\n      }\n      ... on Error {\n        __typename\n        errorMsg\n        code\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SinglePost($input: PostInput!) {\n    post(input: $input) {\n      id\n      body\n      created_at\n      title\n      commentCount\n      voteSum\n      voteStatus\n      community {\n        id\n        title\n      }\n      owner {\n        id\n        username\n      }\n    }\n  }\n"): (typeof documents)["\n  query SinglePost($input: PostInput!) {\n    post(input: $input) {\n      id\n      body\n      created_at\n      title\n      commentCount\n      voteSum\n      voteStatus\n      community {\n        id\n        title\n      }\n      owner {\n        id\n        username\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RegisterUsername($input: RegisterUsernameInput!) {\n    registerUsername(input: $input) {\n      ... on RegisterUsernameSuccess {\n        __typename\n        successMsg\n        code\n      }\n      ... on Error {\n        __typename\n        errorMsg\n        code\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation RegisterUsername($input: RegisterUsernameInput!) {\n    registerUsername(input: $input) {\n      ... on RegisterUsernameSuccess {\n        __typename\n        successMsg\n        code\n      }\n      ... on Error {\n        __typename\n        errorMsg\n        code\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query UsernameExists($username: String!) {\n    usernameExists(username: $username)\n  }\n"): (typeof documents)["\n  query UsernameExists($username: String!) {\n    usernameExists(username: $username)\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;