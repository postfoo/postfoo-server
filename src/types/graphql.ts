/* IMP NOTE: This file is auto-generated by npm run gql:codegen, don't change manually */
/* eslint-disable */
export type Maybe<T> = T | undefined;
export type InputMaybe<T> = T | undefined;
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
  /**  https://the-guild.dev/graphql/scalars/docs/usage   */
  BigInt: { input: number; output: number; }
  /**  2007-12-03  */
  Date: { input: string; output: string; }
  /**  2007-12-03T10:15:30Z  */
  DateTime: { input: string; output: string; }
  EmailAddress: { input: string; output: string; }
  JWT: { input: string; output: string; }
  /**  Can take valid scalar values also  */
  Json: { input: any; output: any; }
  /**  Same as Json but validates it's a object  */
  JsonObject: { input: any; output: any; }
  NonEmptyString: { input: string; output: string; }
  /**  E.164 specification  */
  PhoneNumber: { input: string; output: string; }
  URL: { input: string; output: string; }
  Void: { input: void; output: void; }
};

export type Code = Node & {
  /**  The OTP code that was sent to the user  */
  code: Scalars['NonEmptyString']['output'];
  createdAt: Scalars['DateTime']['output'];
  /**  When the code expires if set  */
  expireAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  /**  The user that this code is for  */
  user: User;
};

export type CreateFieldInput = {
  name: Scalars['NonEmptyString']['input'];
  portfolioId: Scalars['ID']['input'];
  value: Scalars['JsonObject']['input'];
};

export type CreateFundInput = {
  category?: InputMaybe<FundCategory>;
  description?: InputMaybe<Scalars['String']['input']>;
  lastNav: Scalars['Float']['input'];
  name: Scalars['String']['input'];
  plan: FundPlan;
  symbol1?: InputMaybe<Scalars['String']['input']>;
  symbol2?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<FundType>;
};

export type CreatePortfolioFundInput = {
  cost: Scalars['Float']['input'];
  fundId: Scalars['ID']['input'];
  portfolioId: Scalars['ID']['input'];
  units: Scalars['Float']['input'];
};

export type CreatePortfolioInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreatePortfolioStockInput = {
  cost: Scalars['Float']['input'];
  portfolioId: Scalars['ID']['input'];
  stockId: Scalars['ID']['input'];
  units: Scalars['Float']['input'];
};

export type CreateStockInput = {
  exchange: Exchange;
  lastNav: Scalars['Float']['input'];
  name: Scalars['String']['input'];
  symbol: Scalars['String']['input'];
};

export type DeleteFieldInput = {
  fieldId: Scalars['ID']['input'];
};

export type DeleteFundInput = {
  fundId: Scalars['ID']['input'];
};

export type DeletePortfolioFundInput = {
  portfolioFundId: Scalars['ID']['input'];
};

export type DeletePortfolioInput = {
  portfolioId: Scalars['ID']['input'];
};

export type DeletePortfolioStockInput = {
  portfolioStockId: Scalars['ID']['input'];
};

export type DeleteStockInput = {
  stockId: Scalars['ID']['input'];
};

/**  Error codes  */
export enum ErrorCode {
  BAD_USER_INPUT = 'BAD_USER_INPUT',
  CONFLICT = 'CONFLICT',
  DATABASE_ERROR = 'DATABASE_ERROR',
  FORBIDDEN = 'FORBIDDEN',
  GRAPHQL_PARSE_FAILED = 'GRAPHQL_PARSE_FAILED',
  GRAPHQL_VALIDATION_FAILED = 'GRAPHQL_VALIDATION_FAILED',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  LOCKED = 'LOCKED',
  METHOD_NOT_ALLOWED = 'METHOD_NOT_ALLOWED',
  NOT_FOUND = 'NOT_FOUND',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  UNAUTHENTICATED = 'UNAUTHENTICATED'
}

export enum Exchange {
  BOM = 'BOM',
  LSE = 'LSE',
  NASDAQ = 'NASDAQ',
  NSE = 'NSE',
  NYSE = 'NYSE'
}

export type Field = Node & {
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['NonEmptyString']['output'];
  portfolio: Portfolio;
  updatedAt: Scalars['DateTime']['output'];
  value: Scalars['JsonObject']['output'];
};

export type FieldsInput = {
  name?: InputMaybe<Scalars['NonEmptyString']['input']>;
  portfolioId: Scalars['ID']['input'];
};

export type ForgotPasswordInput = {
  from__confirm?: InputMaybe<Scalars['String']['input']>;
  mobile: Scalars['PhoneNumber']['input'];
  name__confirm?: InputMaybe<Scalars['String']['input']>;
};

export type Fund = Node & {
  /**  Hybrid or Equity or Debt or FOF  */
  category?: Maybe<FundCategory>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastNav: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  /**  Direct or Regular  */
  plan?: Maybe<FundPlan>;
  /**  Store google finance symbol  */
  symbol1?: Maybe<Scalars['String']['output']>;
  /**  Any other external symbol for future  */
  symbol2?: Maybe<Scalars['String']['output']>;
  /**  Growth or IDCW  */
  type?: Maybe<FundType>;
  updatedAt: Scalars['DateTime']['output'];
};

export enum FundCategory {
  CHILDRENS_FUND = 'CHILDRENS_FUND',
  DEBT_BANKING_AND_PSU = 'DEBT_BANKING_AND_PSU',
  DEBT_CORPORATE_BOND = 'DEBT_CORPORATE_BOND',
  DEBT_CREDIT_RISK = 'DEBT_CREDIT_RISK',
  DEBT_DYNAMIC_BOND = 'DEBT_DYNAMIC_BOND',
  DEBT_FLOATER = 'DEBT_FLOATER',
  DEBT_GILT = 'DEBT_GILT',
  DEBT_GILT_10_YEARS_CONSTANT = 'DEBT_GILT_10_YEARS_CONSTANT',
  DEBT_LIQUID = 'DEBT_LIQUID',
  DEBT_LONG_DURATION = 'DEBT_LONG_DURATION',
  DEBT_LOW_DURATION = 'DEBT_LOW_DURATION',
  DEBT_MEDIUM_DURATION = 'DEBT_MEDIUM_DURATION',
  DEBT_MEDIUM_TO_LONG_DURATION = 'DEBT_MEDIUM_TO_LONG_DURATION',
  DEBT_MONEY_MARKET = 'DEBT_MONEY_MARKET',
  DEBT_OVERNIGHT = 'DEBT_OVERNIGHT',
  DEBT_SHORT_DURATION = 'DEBT_SHORT_DURATION',
  DEBT_ULTRA_SHORT_DURATION = 'DEBT_ULTRA_SHORT_DURATION',
  EQUITY_DIVIDEND_YIELD = 'EQUITY_DIVIDEND_YIELD',
  EQUITY_ELSS = 'EQUITY_ELSS',
  EQUITY_FLEXI_CAP = 'EQUITY_FLEXI_CAP',
  EQUITY_FOCUSED = 'EQUITY_FOCUSED',
  EQUITY_LARGE_AND_MID_CAP = 'EQUITY_LARGE_AND_MID_CAP',
  EQUITY_LARGE_CAP = 'EQUITY_LARGE_CAP',
  EQUITY_MID_CAP = 'EQUITY_MID_CAP',
  EQUITY_MULTI_CAP = 'EQUITY_MULTI_CAP',
  EQUITY_SECTORAL_BANKING_AND_FINANCIAL_SERVICES = 'EQUITY_SECTORAL_BANKING_AND_FINANCIAL_SERVICES',
  EQUITY_SECTORAL_INFRASTRUCTURE = 'EQUITY_SECTORAL_INFRASTRUCTURE',
  EQUITY_SECTORAL_PHARMA_AND_HEALTHCARE = 'EQUITY_SECTORAL_PHARMA_AND_HEALTHCARE',
  EQUITY_SECTORAL_TECHNOLOGY = 'EQUITY_SECTORAL_TECHNOLOGY',
  EQUITY_SMALL_CAP = 'EQUITY_SMALL_CAP',
  EQUITY_THEMATIC_CONSUMPTION = 'EQUITY_THEMATIC_CONSUMPTION',
  EQUITY_THEMATIC_ESG = 'EQUITY_THEMATIC_ESG',
  EQUITY_THEMATIC_INTERNATIONAL = 'EQUITY_THEMATIC_INTERNATIONAL',
  EQUITY_THEMATIC_MANUFACTURING = 'EQUITY_THEMATIC_MANUFACTURING',
  EQUITY_THEMATIC_MNC = 'EQUITY_THEMATIC_MNC',
  EQUITY_THEMATIC_OTHERS = 'EQUITY_THEMATIC_OTHERS',
  EQUITY_THEMATIC_PSU = 'EQUITY_THEMATIC_PSU',
  EQUITY_THEMATIC_QUANTITATIVE = 'EQUITY_THEMATIC_QUANTITATIVE',
  EQUITY_THEMATIC_TRANSPORTATION = 'EQUITY_THEMATIC_TRANSPORTATION',
  EQUITY_VALUE = 'EQUITY_VALUE',
  ETF = 'ETF',
  FOF_DOMESTIC_DEBT = 'FOF_DOMESTIC_DEBT',
  FOF_DOMESTIC_EQUITY = 'FOF_DOMESTIC_EQUITY',
  FOF_DOMESTIC_GOLD = 'FOF_DOMESTIC_GOLD',
  FOF_DOMESTIC_HYBRID = 'FOF_DOMESTIC_HYBRID',
  FOF_DOMESTIC_SILVER = 'FOF_DOMESTIC_SILVER',
  FOF_OVERSEAS = 'FOF_OVERSEAS',
  HYBRID_AGGRESSIVE = 'HYBRID_AGGRESSIVE',
  HYBRID_ARBITRAGE = 'HYBRID_ARBITRAGE',
  HYBRID_CONSERVATIVE = 'HYBRID_CONSERVATIVE',
  HYBRID_DYNAMIC_ASSET_ALLOCATION = 'HYBRID_DYNAMIC_ASSET_ALLOCATION',
  HYBRID_EQUITY_SAVINGS = 'HYBRID_EQUITY_SAVINGS',
  HYBRID_MULTI_ASSET_ALLOCATION = 'HYBRID_MULTI_ASSET_ALLOCATION',
  INDEX_FUND = 'INDEX_FUND',
  RETIREMENT_FUND = 'RETIREMENT_FUND'
}

export enum FundPlan {
  Direct = 'Direct',
  Regular = 'Regular'
}

export enum FundType {
  BONUS = 'BONUS',
  GROWTH = 'GROWTH',
  IDCW = 'IDCW',
  IDCW_DAILY_PAYOUT = 'IDCW_DAILY_PAYOUT',
  IDCW_DAILY_REINVESTMENT = 'IDCW_DAILY_REINVESTMENT',
  IDCW_HALFYEARLY_PAYOUT = 'IDCW_HALFYEARLY_PAYOUT',
  IDCW_HALFYEARLY_REINVESTMENT = 'IDCW_HALFYEARLY_REINVESTMENT',
  IDCW_MONTHLY_PAYOUT = 'IDCW_MONTHLY_PAYOUT',
  IDCW_MONTHLY_REINVESTMENT = 'IDCW_MONTHLY_REINVESTMENT',
  IDCW_PAYOUT = 'IDCW_PAYOUT',
  IDCW_QUARTERLY_PAYOUT = 'IDCW_QUARTERLY_PAYOUT',
  IDCW_QUARTERLY_REINVESTMENT = 'IDCW_QUARTERLY_REINVESTMENT',
  IDCW_REINVESTMENT = 'IDCW_REINVESTMENT',
  IDCW_WEEKLY_PAYOUT = 'IDCW_WEEKLY_PAYOUT',
  IDCW_WEEKLY_REINVESTMENT = 'IDCW_WEEKLY_REINVESTMENT',
  IDCW_YEARLY_PAYOUT = 'IDCW_YEARLY_PAYOUT',
  IDCW_YEARLY_REINVESTMENT = 'IDCW_YEARLY_REINVESTMENT'
}

export type FundsInput = {
  category?: InputMaybe<FundCategory>;
  page?: InputMaybe<PageInput>;
  plan?: InputMaybe<FundPlan>;
  search?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<FundType>;
};

export type FundsPayload = PagePayload & {
  nodes: Array<Fund>;
  pageInfo: PageInfo;
  total: Scalars['Int']['output'];
};

export type Membership = Node & {
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  portfolio: Portfolio;
  role: UserRole;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

export type Mutation = {
  createField: Field;
  createFund: Fund;
  createPortfolio: Portfolio;
  createPortfolioFund: PortfolioFund;
  createPortfolioStock: PortfolioStock;
  createStock: Stock;
  deleteField: SuccessPayload;
  deleteFund: SuccessPayload;
  deletePortfolio: SuccessPayload;
  deletePortfolioFund: SuccessPayload;
  deletePortfolioStock: SuccessPayload;
  deleteStock: SuccessPayload;
  forgotPassword: SuccessPayload;
  resendCode: SuccessPayload;
  resetPassword: SuccessPayload;
  signIn: User;
  signUp: User;
  updateField: Field;
  updateFund: Fund;
  updatePortfolio: Portfolio;
  updatePortfolioFund: PortfolioFund;
  updatePortfolioStock: PortfolioStock;
  updateStock: Stock;
  verifyCode: SuccessPayload;
};


export type MutationCreateFieldArgs = {
  input: CreateFieldInput;
};


export type MutationCreateFundArgs = {
  input: CreateFundInput;
};


export type MutationCreatePortfolioArgs = {
  input: CreatePortfolioInput;
};


export type MutationCreatePortfolioFundArgs = {
  input: CreatePortfolioFundInput;
};


export type MutationCreatePortfolioStockArgs = {
  input: CreatePortfolioStockInput;
};


export type MutationCreateStockArgs = {
  input: CreateStockInput;
};


export type MutationDeleteFieldArgs = {
  input: DeleteFieldInput;
};


export type MutationDeleteFundArgs = {
  input: DeleteFundInput;
};


export type MutationDeletePortfolioArgs = {
  input: DeletePortfolioInput;
};


export type MutationDeletePortfolioFundArgs = {
  input: DeletePortfolioFundInput;
};


export type MutationDeletePortfolioStockArgs = {
  input: DeletePortfolioStockInput;
};


export type MutationDeleteStockArgs = {
  input: DeleteStockInput;
};


export type MutationForgotPasswordArgs = {
  input: ForgotPasswordInput;
};


export type MutationResendCodeArgs = {
  input: ResendCodeInput;
};


export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};


export type MutationSignInArgs = {
  input: SignInInput;
};


export type MutationSignUpArgs = {
  input: SignUpInput;
};


export type MutationUpdateFieldArgs = {
  input: UpdateFieldInput;
};


export type MutationUpdateFundArgs = {
  input: UpdateFundInput;
};


export type MutationUpdatePortfolioArgs = {
  input: UpdatePortfolioInput;
};


export type MutationUpdatePortfolioFundArgs = {
  input: UpdatePortfolioFundInput;
};


export type MutationUpdatePortfolioStockArgs = {
  input: UpdatePortfolioStockInput;
};


export type MutationUpdateStockArgs = {
  input: UpdateStockInput;
};


export type MutationVerifyCodeArgs = {
  input: VerifyCodeInput;
};

export type Node = {
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type PageInfo = {
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PageInput = {
  /**  Cursor-based pagination, load after this cursor  */
  after?: InputMaybe<Scalars['String']['input']>;
  /**  How many to load (from the start), supports 0 for getting the `total`  */
  first?: InputMaybe<Scalars['Int']['input']>;
  /**  How many to load (from the end, reversed results)  */
  last?: InputMaybe<Scalars['Int']['input']>;
  /**  Offset-based pagination, skip this many  */
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type PagePayload = {
  nodes: Array<Node>;
  pageInfo: PageInfo;
  total: Scalars['Int']['output'];
};

export type Plan = {
  description: Scalars['NonEmptyString']['output'];
  features: Array<Scalars['NonEmptyString']['output']>;
  id: SubscriptionPlan;
  monthlyPrice: Scalars['Int']['output'];
  popular: Scalars['Boolean']['output'];
  title: Scalars['NonEmptyString']['output'];
  yearlyPrice: Scalars['Int']['output'];
};

export type PlanPermission = {
  familyMembers: Scalars['Int']['output'];
  funds: Scalars['Int']['output'];
  id: SubscriptionPlan;
  portfolios: Scalars['Int']['output'];
  schemes: Scalars['Int']['output'];
  stocks: Scalars['Int']['output'];
  uploadFiles: Scalars['Boolean']['output'];
};

export type PlansPayload = {
  planPermissions: Array<PlanPermission>;
  plans: Array<Plan>;
};

export type Portfolio = Node & {
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  funds: Array<PortfolioFund>;
  id: Scalars['ID']['output'];
  members: Array<Membership>;
  name: Scalars['String']['output'];
  stocks: Array<PortfolioStock>;
  updatedAt: Scalars['DateTime']['output'];
};

export type PortfolioFund = Node & {
  cost: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  fund: Fund;
  id: Scalars['ID']['output'];
  portfolio: Portfolio;
  units: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type PortfolioFundsInput = {
  page?: InputMaybe<PageInput>;
  portfolioId: Scalars['ID']['input'];
};

export type PortfolioFundsPayload = PagePayload & {
  nodes: Array<PortfolioFund>;
  pageInfo: PageInfo;
  total: Scalars['Int']['output'];
};

export type PortfolioStock = Node & {
  cost: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  portfolio: Portfolio;
  stock: Stock;
  units: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type PortfolioStocksInput = {
  page?: InputMaybe<PageInput>;
  portfolioId: Scalars['ID']['input'];
};

export type PortfolioStocksPayload = PagePayload & {
  nodes: Array<PortfolioStock>;
  pageInfo: PageInfo;
  total: Scalars['Int']['output'];
};

export type Query = {
  field: Field;
  fields: Array<Field>;
  fund: Fund;
  funds: FundsPayload;
  me?: Maybe<User>;
  plans: PlansPayload;
  portfolio: Portfolio;
  portfolioFund: PortfolioFund;
  portfolioFunds: PortfolioFundsPayload;
  portfolioStock: PortfolioStock;
  portfolioStocks: PortfolioStocksPayload;
  stock: Stock;
  stocks: StocksPayload;
};


export type QueryFieldArgs = {
  fieldId: Scalars['ID']['input'];
};


export type QueryFieldsArgs = {
  input: FieldsInput;
};


export type QueryFundArgs = {
  fundId: Scalars['ID']['input'];
};


export type QueryFundsArgs = {
  input?: InputMaybe<FundsInput>;
};


export type QueryPortfolioArgs = {
  portfolioId: Scalars['ID']['input'];
};


export type QueryPortfolioFundArgs = {
  portfolioFundId: Scalars['ID']['input'];
};


export type QueryPortfolioFundsArgs = {
  input: PortfolioFundsInput;
};


export type QueryPortfolioStockArgs = {
  portfolioStockId: Scalars['ID']['input'];
};


export type QueryPortfolioStocksArgs = {
  input: PortfolioStocksInput;
};


export type QueryStockArgs = {
  stockId: Scalars['ID']['input'];
};


export type QueryStocksArgs = {
  input?: InputMaybe<StocksInput>;
};

export type ResendCodeInput = {
  from__confirm?: InputMaybe<Scalars['String']['input']>;
  mobile?: InputMaybe<Scalars['PhoneNumber']['input']>;
  name__confirm?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type ResetPasswordInput = {
  code: Scalars['NonEmptyString']['input'];
  from__confirm?: InputMaybe<Scalars['String']['input']>;
  mobile: Scalars['PhoneNumber']['input'];
  name__confirm?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['NonEmptyString']['input'];
};

export type SignInInput = {
  from__confirm?: InputMaybe<Scalars['String']['input']>;
  mobile: Scalars['PhoneNumber']['input'];
  name__confirm?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['NonEmptyString']['input'];
};

export type SignUpInput = {
  firstName: Scalars['NonEmptyString']['input'];
  lastName?: InputMaybe<Scalars['NonEmptyString']['input']>;
  mobile: Scalars['PhoneNumber']['input'];
  password: Scalars['NonEmptyString']['input'];
};

export type Stock = Node & {
  createdAt: Scalars['DateTime']['output'];
  /**  Exchange + Symbol should be unique  */
  exchange: Exchange;
  id: Scalars['ID']['output'];
  lastPrice: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type StocksInput = {
  exchange?: InputMaybe<Exchange>;
  page?: InputMaybe<PageInput>;
  search?: InputMaybe<Scalars['String']['input']>;
  symbol?: InputMaybe<Scalars['String']['input']>;
};

export type StocksPayload = PagePayload & {
  nodes: Array<Stock>;
  pageInfo: PageInfo;
  total: Scalars['Int']['output'];
};

export enum SubscriptionPlan {
  ADVANCED = 'ADVANCED',
  BASIC = 'BASIC',
  PRO = 'PRO'
}

export type SuccessPayload = {
  error?: Maybe<ErrorCode>;
};

export type UpdateFieldInput = {
  fieldId: Scalars['ID']['input'];
  name: Scalars['NonEmptyString']['input'];
  value: Scalars['JsonObject']['input'];
};

export type UpdateFundInput = {
  category?: InputMaybe<FundCategory>;
  description?: InputMaybe<Scalars['String']['input']>;
  fundId: Scalars['ID']['input'];
  lastNav: Scalars['Float']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  plan?: InputMaybe<FundPlan>;
  symbol1?: InputMaybe<Scalars['String']['input']>;
  symbol2?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<FundType>;
};

export type UpdatePortfolioFundInput = {
  cost?: InputMaybe<Scalars['Float']['input']>;
  portfolioFundId: Scalars['ID']['input'];
  units?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdatePortfolioInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  portfolioId: Scalars['ID']['input'];
};

export type UpdatePortfolioStockInput = {
  cost?: InputMaybe<Scalars['Float']['input']>;
  portfolioStockId: Scalars['ID']['input'];
  units?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateStockInput = {
  exchange?: InputMaybe<Exchange>;
  lastNav: Scalars['Float']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  stockId: Scalars['ID']['input'];
  symbol?: InputMaybe<Scalars['String']['input']>;
};

export type User = Node & {
  codes: Array<Code>;
  createdAt: Scalars['DateTime']['output'];
  firstName: Scalars['NonEmptyString']['output'];
  id: Scalars['ID']['output'];
  isBlocked: Scalars['Boolean']['output'];
  isVerified: Scalars['Boolean']['output'];
  lastName?: Maybe<Scalars['NonEmptyString']['output']>;
  memberships: Array<Membership>;
  mobile: Scalars['PhoneNumber']['output'];
  /**  The generated full (first+last) name  */
  name: Scalars['NonEmptyString']['output'];
  password: Scalars['NonEmptyString']['output'];
  salt: Scalars['NonEmptyString']['output'];
  status: UserStatus;
  /**  A fresh JWT for the user  */
  token: Scalars['JWT']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export enum UserRole {
  Admin = 'Admin',
  Member = 'Member'
}

export enum UserStatus {
  Superadmin = 'Superadmin',
  User = 'User'
}

export type VerifyCodeInput = {
  code: Scalars['NonEmptyString']['input'];
  from__confirm?: InputMaybe<Scalars['String']['input']>;
  mobile?: InputMaybe<Scalars['PhoneNumber']['input']>;
  name__confirm?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};
