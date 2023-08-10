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
    "\n  query CommunitiesSearch($input: CommunitiesInput!) {\n    communities(input: $input) {\n      edges {\n        node {\n          memberCount\n          title\n          created_at\n        }\n      }\n    }\n  }\n": types.CommunitiesSearchDocument,
    "\n  mutation Logout {\n    logout {\n      ... on LogoutSuccess {\n        __typename\n        successMsg\n        code\n      }\n      ... on Error {\n        __typename\n        errorMsg\n        code\n      }\n    }\n  }\n": types.LogoutDocument,
    "\n  query UsersSearch($input: UsersInput!) {\n    users(input: $input) {\n      edges {\n        node {\n          username\n          created_at\n          postsCount\n        }\n      }\n    }\n  }\n": types.UsersSearchDocument,
    "\n  query AuthUser {\n    authUser {\n      ... on AuthUserSuccess {\n        successMsg\n        code\n        user {\n          username\n          updated_at\n          provider\n          image\n          id\n          email_verified\n          email\n          created_at\n        }\n      }\n    }\n  }\n": types.AuthUserDocument,
    "\n  query CommunityTitleExists($title: String!) {\n    titleExists(title: $title)\n  }\n": types.CommunityTitleExistsDocument,
    "\n  mutation CreateCommunity($input: CreateCommunityInput!) {\n    createCommunity(input: $input) {\n      ... on CreateCommunitySuccess {\n        __typename\n        successMsg\n        code\n      }\n      ... on Error {\n        __typename\n        errorMsg\n        code\n      }\n      ... on CreateCommunityInputError {\n        inputErrors {\n          title\n        }\n      }\n    }\n  }\n": types.CreateCommunityDocument,
    "\n  mutation EmailLogin($input: LoginEmailInput!) {\n    loginEmail(input: $input) {\n      ... on LoginEmailSuccess {\n        __typename\n        successMsg\n        code\n      }\n      ... on LoginEmailInputError {\n        __typename\n        errorMsg\n        code\n      }\n    }\n  }\n": types.EmailLoginDocument,
    "\n  mutation EmailRegister($input: RegisterEmailInput!) {\n    registerEmail(input: $input) {\n      ... on RegisterEmailSuccess {\n        __typename\n        successMsg\n        code\n      }\n      ... on Error {\n        __typename\n        errorMsg\n        code\n      }\n      ... on RegisterEmailInputError {\n        inputErrors {\n          email\n          password\n          username\n        }\n      }\n    }\n  }\n": types.EmailRegisterDocument,
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
export function graphql(source: "\n  query CommunitiesSearch($input: CommunitiesInput!) {\n    communities(input: $input) {\n      edges {\n        node {\n          memberCount\n          title\n          created_at\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query CommunitiesSearch($input: CommunitiesInput!) {\n    communities(input: $input) {\n      edges {\n        node {\n          memberCount\n          title\n          created_at\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Logout {\n    logout {\n      ... on LogoutSuccess {\n        __typename\n        successMsg\n        code\n      }\n      ... on Error {\n        __typename\n        errorMsg\n        code\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Logout {\n    logout {\n      ... on LogoutSuccess {\n        __typename\n        successMsg\n        code\n      }\n      ... on Error {\n        __typename\n        errorMsg\n        code\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query UsersSearch($input: UsersInput!) {\n    users(input: $input) {\n      edges {\n        node {\n          username\n          created_at\n          postsCount\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query UsersSearch($input: UsersInput!) {\n    users(input: $input) {\n      edges {\n        node {\n          username\n          created_at\n          postsCount\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query AuthUser {\n    authUser {\n      ... on AuthUserSuccess {\n        successMsg\n        code\n        user {\n          username\n          updated_at\n          provider\n          image\n          id\n          email_verified\n          email\n          created_at\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query AuthUser {\n    authUser {\n      ... on AuthUserSuccess {\n        successMsg\n        code\n        user {\n          username\n          updated_at\n          provider\n          image\n          id\n          email_verified\n          email\n          created_at\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CommunityTitleExists($title: String!) {\n    titleExists(title: $title)\n  }\n"): (typeof documents)["\n  query CommunityTitleExists($title: String!) {\n    titleExists(title: $title)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCommunity($input: CreateCommunityInput!) {\n    createCommunity(input: $input) {\n      ... on CreateCommunitySuccess {\n        __typename\n        successMsg\n        code\n      }\n      ... on Error {\n        __typename\n        errorMsg\n        code\n      }\n      ... on CreateCommunityInputError {\n        inputErrors {\n          title\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCommunity($input: CreateCommunityInput!) {\n    createCommunity(input: $input) {\n      ... on CreateCommunitySuccess {\n        __typename\n        successMsg\n        code\n      }\n      ... on Error {\n        __typename\n        errorMsg\n        code\n      }\n      ... on CreateCommunityInputError {\n        inputErrors {\n          title\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation EmailLogin($input: LoginEmailInput!) {\n    loginEmail(input: $input) {\n      ... on LoginEmailSuccess {\n        __typename\n        successMsg\n        code\n      }\n      ... on LoginEmailInputError {\n        __typename\n        errorMsg\n        code\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation EmailLogin($input: LoginEmailInput!) {\n    loginEmail(input: $input) {\n      ... on LoginEmailSuccess {\n        __typename\n        successMsg\n        code\n      }\n      ... on LoginEmailInputError {\n        __typename\n        errorMsg\n        code\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation EmailRegister($input: RegisterEmailInput!) {\n    registerEmail(input: $input) {\n      ... on RegisterEmailSuccess {\n        __typename\n        successMsg\n        code\n      }\n      ... on Error {\n        __typename\n        errorMsg\n        code\n      }\n      ... on RegisterEmailInputError {\n        inputErrors {\n          email\n          password\n          username\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation EmailRegister($input: RegisterEmailInput!) {\n    registerEmail(input: $input) {\n      ... on RegisterEmailSuccess {\n        __typename\n        successMsg\n        code\n      }\n      ... on Error {\n        __typename\n        errorMsg\n        code\n      }\n      ... on RegisterEmailInputError {\n        inputErrors {\n          email\n          password\n          username\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;