
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Hospital
 * 
 */
export type Hospital = $Result.DefaultSelection<Prisma.$HospitalPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model OtpVerification
 * 
 */
export type OtpVerification = $Result.DefaultSelection<Prisma.$OtpVerificationPayload>
/**
 * Model RefreshToken
 * 
 */
export type RefreshToken = $Result.DefaultSelection<Prisma.$RefreshTokenPayload>
/**
 * Model MotherProfile
 * 
 */
export type MotherProfile = $Result.DefaultSelection<Prisma.$MotherProfilePayload>
/**
 * Model BabyProfile
 * 
 */
export type BabyProfile = $Result.DefaultSelection<Prisma.$BabyProfilePayload>
/**
 * Model NurseProfile
 * 
 */
export type NurseProfile = $Result.DefaultSelection<Prisma.$NurseProfilePayload>
/**
 * Model ResearcherProfile
 * 
 */
export type ResearcherProfile = $Result.DefaultSelection<Prisma.$ResearcherProfilePayload>
/**
 * Model FollowUpSchedule
 * 
 */
export type FollowUpSchedule = $Result.DefaultSelection<Prisma.$FollowUpSchedulePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Hospitals
 * const hospitals = await prisma.hospital.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Hospitals
   * const hospitals = await prisma.hospital.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.hospital`: Exposes CRUD operations for the **Hospital** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Hospitals
    * const hospitals = await prisma.hospital.findMany()
    * ```
    */
  get hospital(): Prisma.HospitalDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.otpVerification`: Exposes CRUD operations for the **OtpVerification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OtpVerifications
    * const otpVerifications = await prisma.otpVerification.findMany()
    * ```
    */
  get otpVerification(): Prisma.OtpVerificationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.refreshToken`: Exposes CRUD operations for the **RefreshToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RefreshTokens
    * const refreshTokens = await prisma.refreshToken.findMany()
    * ```
    */
  get refreshToken(): Prisma.RefreshTokenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.motherProfile`: Exposes CRUD operations for the **MotherProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MotherProfiles
    * const motherProfiles = await prisma.motherProfile.findMany()
    * ```
    */
  get motherProfile(): Prisma.MotherProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.babyProfile`: Exposes CRUD operations for the **BabyProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BabyProfiles
    * const babyProfiles = await prisma.babyProfile.findMany()
    * ```
    */
  get babyProfile(): Prisma.BabyProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.nurseProfile`: Exposes CRUD operations for the **NurseProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NurseProfiles
    * const nurseProfiles = await prisma.nurseProfile.findMany()
    * ```
    */
  get nurseProfile(): Prisma.NurseProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.researcherProfile`: Exposes CRUD operations for the **ResearcherProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ResearcherProfiles
    * const researcherProfiles = await prisma.researcherProfile.findMany()
    * ```
    */
  get researcherProfile(): Prisma.ResearcherProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.followUpSchedule`: Exposes CRUD operations for the **FollowUpSchedule** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FollowUpSchedules
    * const followUpSchedules = await prisma.followUpSchedule.findMany()
    * ```
    */
  get followUpSchedule(): Prisma.FollowUpScheduleDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Hospital: 'Hospital',
    User: 'User',
    OtpVerification: 'OtpVerification',
    RefreshToken: 'RefreshToken',
    MotherProfile: 'MotherProfile',
    BabyProfile: 'BabyProfile',
    NurseProfile: 'NurseProfile',
    ResearcherProfile: 'ResearcherProfile',
    FollowUpSchedule: 'FollowUpSchedule'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "hospital" | "user" | "otpVerification" | "refreshToken" | "motherProfile" | "babyProfile" | "nurseProfile" | "researcherProfile" | "followUpSchedule"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Hospital: {
        payload: Prisma.$HospitalPayload<ExtArgs>
        fields: Prisma.HospitalFieldRefs
        operations: {
          findUnique: {
            args: Prisma.HospitalFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HospitalPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.HospitalFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HospitalPayload>
          }
          findFirst: {
            args: Prisma.HospitalFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HospitalPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.HospitalFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HospitalPayload>
          }
          findMany: {
            args: Prisma.HospitalFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HospitalPayload>[]
          }
          create: {
            args: Prisma.HospitalCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HospitalPayload>
          }
          createMany: {
            args: Prisma.HospitalCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.HospitalCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HospitalPayload>[]
          }
          delete: {
            args: Prisma.HospitalDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HospitalPayload>
          }
          update: {
            args: Prisma.HospitalUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HospitalPayload>
          }
          deleteMany: {
            args: Prisma.HospitalDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.HospitalUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.HospitalUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HospitalPayload>[]
          }
          upsert: {
            args: Prisma.HospitalUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HospitalPayload>
          }
          aggregate: {
            args: Prisma.HospitalAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateHospital>
          }
          groupBy: {
            args: Prisma.HospitalGroupByArgs<ExtArgs>
            result: $Utils.Optional<HospitalGroupByOutputType>[]
          }
          count: {
            args: Prisma.HospitalCountArgs<ExtArgs>
            result: $Utils.Optional<HospitalCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      OtpVerification: {
        payload: Prisma.$OtpVerificationPayload<ExtArgs>
        fields: Prisma.OtpVerificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OtpVerificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpVerificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OtpVerificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpVerificationPayload>
          }
          findFirst: {
            args: Prisma.OtpVerificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpVerificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OtpVerificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpVerificationPayload>
          }
          findMany: {
            args: Prisma.OtpVerificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpVerificationPayload>[]
          }
          create: {
            args: Prisma.OtpVerificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpVerificationPayload>
          }
          createMany: {
            args: Prisma.OtpVerificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OtpVerificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpVerificationPayload>[]
          }
          delete: {
            args: Prisma.OtpVerificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpVerificationPayload>
          }
          update: {
            args: Prisma.OtpVerificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpVerificationPayload>
          }
          deleteMany: {
            args: Prisma.OtpVerificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OtpVerificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OtpVerificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpVerificationPayload>[]
          }
          upsert: {
            args: Prisma.OtpVerificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpVerificationPayload>
          }
          aggregate: {
            args: Prisma.OtpVerificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOtpVerification>
          }
          groupBy: {
            args: Prisma.OtpVerificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<OtpVerificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.OtpVerificationCountArgs<ExtArgs>
            result: $Utils.Optional<OtpVerificationCountAggregateOutputType> | number
          }
        }
      }
      RefreshToken: {
        payload: Prisma.$RefreshTokenPayload<ExtArgs>
        fields: Prisma.RefreshTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RefreshTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RefreshTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          findFirst: {
            args: Prisma.RefreshTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RefreshTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          findMany: {
            args: Prisma.RefreshTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[]
          }
          create: {
            args: Prisma.RefreshTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          createMany: {
            args: Prisma.RefreshTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RefreshTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[]
          }
          delete: {
            args: Prisma.RefreshTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          update: {
            args: Prisma.RefreshTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          deleteMany: {
            args: Prisma.RefreshTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RefreshTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RefreshTokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[]
          }
          upsert: {
            args: Prisma.RefreshTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          aggregate: {
            args: Prisma.RefreshTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRefreshToken>
          }
          groupBy: {
            args: Prisma.RefreshTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<RefreshTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.RefreshTokenCountArgs<ExtArgs>
            result: $Utils.Optional<RefreshTokenCountAggregateOutputType> | number
          }
        }
      }
      MotherProfile: {
        payload: Prisma.$MotherProfilePayload<ExtArgs>
        fields: Prisma.MotherProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MotherProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MotherProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherProfilePayload>
          }
          findFirst: {
            args: Prisma.MotherProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MotherProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherProfilePayload>
          }
          findMany: {
            args: Prisma.MotherProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherProfilePayload>[]
          }
          create: {
            args: Prisma.MotherProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherProfilePayload>
          }
          createMany: {
            args: Prisma.MotherProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MotherProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherProfilePayload>[]
          }
          delete: {
            args: Prisma.MotherProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherProfilePayload>
          }
          update: {
            args: Prisma.MotherProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherProfilePayload>
          }
          deleteMany: {
            args: Prisma.MotherProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MotherProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MotherProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherProfilePayload>[]
          }
          upsert: {
            args: Prisma.MotherProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherProfilePayload>
          }
          aggregate: {
            args: Prisma.MotherProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMotherProfile>
          }
          groupBy: {
            args: Prisma.MotherProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<MotherProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.MotherProfileCountArgs<ExtArgs>
            result: $Utils.Optional<MotherProfileCountAggregateOutputType> | number
          }
        }
      }
      BabyProfile: {
        payload: Prisma.$BabyProfilePayload<ExtArgs>
        fields: Prisma.BabyProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BabyProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BabyProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BabyProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BabyProfilePayload>
          }
          findFirst: {
            args: Prisma.BabyProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BabyProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BabyProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BabyProfilePayload>
          }
          findMany: {
            args: Prisma.BabyProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BabyProfilePayload>[]
          }
          create: {
            args: Prisma.BabyProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BabyProfilePayload>
          }
          createMany: {
            args: Prisma.BabyProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BabyProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BabyProfilePayload>[]
          }
          delete: {
            args: Prisma.BabyProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BabyProfilePayload>
          }
          update: {
            args: Prisma.BabyProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BabyProfilePayload>
          }
          deleteMany: {
            args: Prisma.BabyProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BabyProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BabyProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BabyProfilePayload>[]
          }
          upsert: {
            args: Prisma.BabyProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BabyProfilePayload>
          }
          aggregate: {
            args: Prisma.BabyProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBabyProfile>
          }
          groupBy: {
            args: Prisma.BabyProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<BabyProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.BabyProfileCountArgs<ExtArgs>
            result: $Utils.Optional<BabyProfileCountAggregateOutputType> | number
          }
        }
      }
      NurseProfile: {
        payload: Prisma.$NurseProfilePayload<ExtArgs>
        fields: Prisma.NurseProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NurseProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NurseProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NurseProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NurseProfilePayload>
          }
          findFirst: {
            args: Prisma.NurseProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NurseProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NurseProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NurseProfilePayload>
          }
          findMany: {
            args: Prisma.NurseProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NurseProfilePayload>[]
          }
          create: {
            args: Prisma.NurseProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NurseProfilePayload>
          }
          createMany: {
            args: Prisma.NurseProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NurseProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NurseProfilePayload>[]
          }
          delete: {
            args: Prisma.NurseProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NurseProfilePayload>
          }
          update: {
            args: Prisma.NurseProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NurseProfilePayload>
          }
          deleteMany: {
            args: Prisma.NurseProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NurseProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NurseProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NurseProfilePayload>[]
          }
          upsert: {
            args: Prisma.NurseProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NurseProfilePayload>
          }
          aggregate: {
            args: Prisma.NurseProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNurseProfile>
          }
          groupBy: {
            args: Prisma.NurseProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<NurseProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.NurseProfileCountArgs<ExtArgs>
            result: $Utils.Optional<NurseProfileCountAggregateOutputType> | number
          }
        }
      }
      ResearcherProfile: {
        payload: Prisma.$ResearcherProfilePayload<ExtArgs>
        fields: Prisma.ResearcherProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ResearcherProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResearcherProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ResearcherProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResearcherProfilePayload>
          }
          findFirst: {
            args: Prisma.ResearcherProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResearcherProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ResearcherProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResearcherProfilePayload>
          }
          findMany: {
            args: Prisma.ResearcherProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResearcherProfilePayload>[]
          }
          create: {
            args: Prisma.ResearcherProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResearcherProfilePayload>
          }
          createMany: {
            args: Prisma.ResearcherProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ResearcherProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResearcherProfilePayload>[]
          }
          delete: {
            args: Prisma.ResearcherProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResearcherProfilePayload>
          }
          update: {
            args: Prisma.ResearcherProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResearcherProfilePayload>
          }
          deleteMany: {
            args: Prisma.ResearcherProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ResearcherProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ResearcherProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResearcherProfilePayload>[]
          }
          upsert: {
            args: Prisma.ResearcherProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ResearcherProfilePayload>
          }
          aggregate: {
            args: Prisma.ResearcherProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateResearcherProfile>
          }
          groupBy: {
            args: Prisma.ResearcherProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<ResearcherProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.ResearcherProfileCountArgs<ExtArgs>
            result: $Utils.Optional<ResearcherProfileCountAggregateOutputType> | number
          }
        }
      }
      FollowUpSchedule: {
        payload: Prisma.$FollowUpSchedulePayload<ExtArgs>
        fields: Prisma.FollowUpScheduleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FollowUpScheduleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FollowUpSchedulePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FollowUpScheduleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FollowUpSchedulePayload>
          }
          findFirst: {
            args: Prisma.FollowUpScheduleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FollowUpSchedulePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FollowUpScheduleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FollowUpSchedulePayload>
          }
          findMany: {
            args: Prisma.FollowUpScheduleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FollowUpSchedulePayload>[]
          }
          create: {
            args: Prisma.FollowUpScheduleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FollowUpSchedulePayload>
          }
          createMany: {
            args: Prisma.FollowUpScheduleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FollowUpScheduleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FollowUpSchedulePayload>[]
          }
          delete: {
            args: Prisma.FollowUpScheduleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FollowUpSchedulePayload>
          }
          update: {
            args: Prisma.FollowUpScheduleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FollowUpSchedulePayload>
          }
          deleteMany: {
            args: Prisma.FollowUpScheduleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FollowUpScheduleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FollowUpScheduleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FollowUpSchedulePayload>[]
          }
          upsert: {
            args: Prisma.FollowUpScheduleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FollowUpSchedulePayload>
          }
          aggregate: {
            args: Prisma.FollowUpScheduleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFollowUpSchedule>
          }
          groupBy: {
            args: Prisma.FollowUpScheduleGroupByArgs<ExtArgs>
            result: $Utils.Optional<FollowUpScheduleGroupByOutputType>[]
          }
          count: {
            args: Prisma.FollowUpScheduleCountArgs<ExtArgs>
            result: $Utils.Optional<FollowUpScheduleCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    hospital?: HospitalOmit
    user?: UserOmit
    otpVerification?: OtpVerificationOmit
    refreshToken?: RefreshTokenOmit
    motherProfile?: MotherProfileOmit
    babyProfile?: BabyProfileOmit
    nurseProfile?: NurseProfileOmit
    researcherProfile?: ResearcherProfileOmit
    followUpSchedule?: FollowUpScheduleOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type HospitalCountOutputType
   */

  export type HospitalCountOutputType = {
    users: number
    motherProfiles: number
    nurseProfiles: number
  }

  export type HospitalCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | HospitalCountOutputTypeCountUsersArgs
    motherProfiles?: boolean | HospitalCountOutputTypeCountMotherProfilesArgs
    nurseProfiles?: boolean | HospitalCountOutputTypeCountNurseProfilesArgs
  }

  // Custom InputTypes
  /**
   * HospitalCountOutputType without action
   */
  export type HospitalCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HospitalCountOutputType
     */
    select?: HospitalCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * HospitalCountOutputType without action
   */
  export type HospitalCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * HospitalCountOutputType without action
   */
  export type HospitalCountOutputTypeCountMotherProfilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MotherProfileWhereInput
  }

  /**
   * HospitalCountOutputType without action
   */
  export type HospitalCountOutputTypeCountNurseProfilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NurseProfileWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    refreshTokens: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    refreshTokens?: boolean | UserCountOutputTypeCountRefreshTokensArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountRefreshTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RefreshTokenWhereInput
  }


  /**
   * Count Type MotherProfileCountOutputType
   */

  export type MotherProfileCountOutputType = {
    followUpSchedules: number
  }

  export type MotherProfileCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    followUpSchedules?: boolean | MotherProfileCountOutputTypeCountFollowUpSchedulesArgs
  }

  // Custom InputTypes
  /**
   * MotherProfileCountOutputType without action
   */
  export type MotherProfileCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MotherProfileCountOutputType
     */
    select?: MotherProfileCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MotherProfileCountOutputType without action
   */
  export type MotherProfileCountOutputTypeCountFollowUpSchedulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FollowUpScheduleWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Hospital
   */

  export type AggregateHospital = {
    _count: HospitalCountAggregateOutputType | null
    _avg: HospitalAvgAggregateOutputType | null
    _sum: HospitalSumAggregateOutputType | null
    _min: HospitalMinAggregateOutputType | null
    _max: HospitalMaxAggregateOutputType | null
  }

  export type HospitalAvgAggregateOutputType = {
    nextParticipantNumber: number | null
  }

  export type HospitalSumAggregateOutputType = {
    nextParticipantNumber: number | null
  }

  export type HospitalMinAggregateOutputType = {
    id: string | null
    name: string | null
    code: string | null
    district: string | null
    state: string | null
    type: string | null
    emergencyPhone: string | null
    isActive: boolean | null
    nextParticipantNumber: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type HospitalMaxAggregateOutputType = {
    id: string | null
    name: string | null
    code: string | null
    district: string | null
    state: string | null
    type: string | null
    emergencyPhone: string | null
    isActive: boolean | null
    nextParticipantNumber: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type HospitalCountAggregateOutputType = {
    id: number
    name: number
    code: number
    district: number
    state: number
    type: number
    emergencyPhone: number
    isActive: number
    nextParticipantNumber: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type HospitalAvgAggregateInputType = {
    nextParticipantNumber?: true
  }

  export type HospitalSumAggregateInputType = {
    nextParticipantNumber?: true
  }

  export type HospitalMinAggregateInputType = {
    id?: true
    name?: true
    code?: true
    district?: true
    state?: true
    type?: true
    emergencyPhone?: true
    isActive?: true
    nextParticipantNumber?: true
    createdAt?: true
    updatedAt?: true
  }

  export type HospitalMaxAggregateInputType = {
    id?: true
    name?: true
    code?: true
    district?: true
    state?: true
    type?: true
    emergencyPhone?: true
    isActive?: true
    nextParticipantNumber?: true
    createdAt?: true
    updatedAt?: true
  }

  export type HospitalCountAggregateInputType = {
    id?: true
    name?: true
    code?: true
    district?: true
    state?: true
    type?: true
    emergencyPhone?: true
    isActive?: true
    nextParticipantNumber?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type HospitalAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Hospital to aggregate.
     */
    where?: HospitalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Hospitals to fetch.
     */
    orderBy?: HospitalOrderByWithRelationInput | HospitalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: HospitalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Hospitals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Hospitals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Hospitals
    **/
    _count?: true | HospitalCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: HospitalAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: HospitalSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: HospitalMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: HospitalMaxAggregateInputType
  }

  export type GetHospitalAggregateType<T extends HospitalAggregateArgs> = {
        [P in keyof T & keyof AggregateHospital]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHospital[P]>
      : GetScalarType<T[P], AggregateHospital[P]>
  }




  export type HospitalGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HospitalWhereInput
    orderBy?: HospitalOrderByWithAggregationInput | HospitalOrderByWithAggregationInput[]
    by: HospitalScalarFieldEnum[] | HospitalScalarFieldEnum
    having?: HospitalScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: HospitalCountAggregateInputType | true
    _avg?: HospitalAvgAggregateInputType
    _sum?: HospitalSumAggregateInputType
    _min?: HospitalMinAggregateInputType
    _max?: HospitalMaxAggregateInputType
  }

  export type HospitalGroupByOutputType = {
    id: string
    name: string
    code: string
    district: string
    state: string
    type: string
    emergencyPhone: string | null
    isActive: boolean
    nextParticipantNumber: number
    createdAt: Date
    updatedAt: Date
    _count: HospitalCountAggregateOutputType | null
    _avg: HospitalAvgAggregateOutputType | null
    _sum: HospitalSumAggregateOutputType | null
    _min: HospitalMinAggregateOutputType | null
    _max: HospitalMaxAggregateOutputType | null
  }

  type GetHospitalGroupByPayload<T extends HospitalGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<HospitalGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof HospitalGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], HospitalGroupByOutputType[P]>
            : GetScalarType<T[P], HospitalGroupByOutputType[P]>
        }
      >
    >


  export type HospitalSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    code?: boolean
    district?: boolean
    state?: boolean
    type?: boolean
    emergencyPhone?: boolean
    isActive?: boolean
    nextParticipantNumber?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    users?: boolean | Hospital$usersArgs<ExtArgs>
    motherProfiles?: boolean | Hospital$motherProfilesArgs<ExtArgs>
    nurseProfiles?: boolean | Hospital$nurseProfilesArgs<ExtArgs>
    _count?: boolean | HospitalCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["hospital"]>

  export type HospitalSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    code?: boolean
    district?: boolean
    state?: boolean
    type?: boolean
    emergencyPhone?: boolean
    isActive?: boolean
    nextParticipantNumber?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["hospital"]>

  export type HospitalSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    code?: boolean
    district?: boolean
    state?: boolean
    type?: boolean
    emergencyPhone?: boolean
    isActive?: boolean
    nextParticipantNumber?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["hospital"]>

  export type HospitalSelectScalar = {
    id?: boolean
    name?: boolean
    code?: boolean
    district?: boolean
    state?: boolean
    type?: boolean
    emergencyPhone?: boolean
    isActive?: boolean
    nextParticipantNumber?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type HospitalOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "code" | "district" | "state" | "type" | "emergencyPhone" | "isActive" | "nextParticipantNumber" | "createdAt" | "updatedAt", ExtArgs["result"]["hospital"]>
  export type HospitalInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | Hospital$usersArgs<ExtArgs>
    motherProfiles?: boolean | Hospital$motherProfilesArgs<ExtArgs>
    nurseProfiles?: boolean | Hospital$nurseProfilesArgs<ExtArgs>
    _count?: boolean | HospitalCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type HospitalIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type HospitalIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $HospitalPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Hospital"
    objects: {
      users: Prisma.$UserPayload<ExtArgs>[]
      motherProfiles: Prisma.$MotherProfilePayload<ExtArgs>[]
      nurseProfiles: Prisma.$NurseProfilePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      code: string
      district: string
      state: string
      type: string
      emergencyPhone: string | null
      isActive: boolean
      nextParticipantNumber: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["hospital"]>
    composites: {}
  }

  type HospitalGetPayload<S extends boolean | null | undefined | HospitalDefaultArgs> = $Result.GetResult<Prisma.$HospitalPayload, S>

  type HospitalCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<HospitalFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: HospitalCountAggregateInputType | true
    }

  export interface HospitalDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Hospital'], meta: { name: 'Hospital' } }
    /**
     * Find zero or one Hospital that matches the filter.
     * @param {HospitalFindUniqueArgs} args - Arguments to find a Hospital
     * @example
     * // Get one Hospital
     * const hospital = await prisma.hospital.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends HospitalFindUniqueArgs>(args: SelectSubset<T, HospitalFindUniqueArgs<ExtArgs>>): Prisma__HospitalClient<$Result.GetResult<Prisma.$HospitalPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Hospital that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {HospitalFindUniqueOrThrowArgs} args - Arguments to find a Hospital
     * @example
     * // Get one Hospital
     * const hospital = await prisma.hospital.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends HospitalFindUniqueOrThrowArgs>(args: SelectSubset<T, HospitalFindUniqueOrThrowArgs<ExtArgs>>): Prisma__HospitalClient<$Result.GetResult<Prisma.$HospitalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Hospital that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HospitalFindFirstArgs} args - Arguments to find a Hospital
     * @example
     * // Get one Hospital
     * const hospital = await prisma.hospital.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends HospitalFindFirstArgs>(args?: SelectSubset<T, HospitalFindFirstArgs<ExtArgs>>): Prisma__HospitalClient<$Result.GetResult<Prisma.$HospitalPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Hospital that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HospitalFindFirstOrThrowArgs} args - Arguments to find a Hospital
     * @example
     * // Get one Hospital
     * const hospital = await prisma.hospital.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends HospitalFindFirstOrThrowArgs>(args?: SelectSubset<T, HospitalFindFirstOrThrowArgs<ExtArgs>>): Prisma__HospitalClient<$Result.GetResult<Prisma.$HospitalPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Hospitals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HospitalFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Hospitals
     * const hospitals = await prisma.hospital.findMany()
     * 
     * // Get first 10 Hospitals
     * const hospitals = await prisma.hospital.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const hospitalWithIdOnly = await prisma.hospital.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends HospitalFindManyArgs>(args?: SelectSubset<T, HospitalFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HospitalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Hospital.
     * @param {HospitalCreateArgs} args - Arguments to create a Hospital.
     * @example
     * // Create one Hospital
     * const Hospital = await prisma.hospital.create({
     *   data: {
     *     // ... data to create a Hospital
     *   }
     * })
     * 
     */
    create<T extends HospitalCreateArgs>(args: SelectSubset<T, HospitalCreateArgs<ExtArgs>>): Prisma__HospitalClient<$Result.GetResult<Prisma.$HospitalPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Hospitals.
     * @param {HospitalCreateManyArgs} args - Arguments to create many Hospitals.
     * @example
     * // Create many Hospitals
     * const hospital = await prisma.hospital.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends HospitalCreateManyArgs>(args?: SelectSubset<T, HospitalCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Hospitals and returns the data saved in the database.
     * @param {HospitalCreateManyAndReturnArgs} args - Arguments to create many Hospitals.
     * @example
     * // Create many Hospitals
     * const hospital = await prisma.hospital.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Hospitals and only return the `id`
     * const hospitalWithIdOnly = await prisma.hospital.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends HospitalCreateManyAndReturnArgs>(args?: SelectSubset<T, HospitalCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HospitalPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Hospital.
     * @param {HospitalDeleteArgs} args - Arguments to delete one Hospital.
     * @example
     * // Delete one Hospital
     * const Hospital = await prisma.hospital.delete({
     *   where: {
     *     // ... filter to delete one Hospital
     *   }
     * })
     * 
     */
    delete<T extends HospitalDeleteArgs>(args: SelectSubset<T, HospitalDeleteArgs<ExtArgs>>): Prisma__HospitalClient<$Result.GetResult<Prisma.$HospitalPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Hospital.
     * @param {HospitalUpdateArgs} args - Arguments to update one Hospital.
     * @example
     * // Update one Hospital
     * const hospital = await prisma.hospital.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends HospitalUpdateArgs>(args: SelectSubset<T, HospitalUpdateArgs<ExtArgs>>): Prisma__HospitalClient<$Result.GetResult<Prisma.$HospitalPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Hospitals.
     * @param {HospitalDeleteManyArgs} args - Arguments to filter Hospitals to delete.
     * @example
     * // Delete a few Hospitals
     * const { count } = await prisma.hospital.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends HospitalDeleteManyArgs>(args?: SelectSubset<T, HospitalDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Hospitals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HospitalUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Hospitals
     * const hospital = await prisma.hospital.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends HospitalUpdateManyArgs>(args: SelectSubset<T, HospitalUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Hospitals and returns the data updated in the database.
     * @param {HospitalUpdateManyAndReturnArgs} args - Arguments to update many Hospitals.
     * @example
     * // Update many Hospitals
     * const hospital = await prisma.hospital.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Hospitals and only return the `id`
     * const hospitalWithIdOnly = await prisma.hospital.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends HospitalUpdateManyAndReturnArgs>(args: SelectSubset<T, HospitalUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HospitalPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Hospital.
     * @param {HospitalUpsertArgs} args - Arguments to update or create a Hospital.
     * @example
     * // Update or create a Hospital
     * const hospital = await prisma.hospital.upsert({
     *   create: {
     *     // ... data to create a Hospital
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Hospital we want to update
     *   }
     * })
     */
    upsert<T extends HospitalUpsertArgs>(args: SelectSubset<T, HospitalUpsertArgs<ExtArgs>>): Prisma__HospitalClient<$Result.GetResult<Prisma.$HospitalPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Hospitals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HospitalCountArgs} args - Arguments to filter Hospitals to count.
     * @example
     * // Count the number of Hospitals
     * const count = await prisma.hospital.count({
     *   where: {
     *     // ... the filter for the Hospitals we want to count
     *   }
     * })
    **/
    count<T extends HospitalCountArgs>(
      args?: Subset<T, HospitalCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], HospitalCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Hospital.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HospitalAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends HospitalAggregateArgs>(args: Subset<T, HospitalAggregateArgs>): Prisma.PrismaPromise<GetHospitalAggregateType<T>>

    /**
     * Group by Hospital.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HospitalGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends HospitalGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: HospitalGroupByArgs['orderBy'] }
        : { orderBy?: HospitalGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, HospitalGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHospitalGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Hospital model
   */
  readonly fields: HospitalFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Hospital.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__HospitalClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends Hospital$usersArgs<ExtArgs> = {}>(args?: Subset<T, Hospital$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    motherProfiles<T extends Hospital$motherProfilesArgs<ExtArgs> = {}>(args?: Subset<T, Hospital$motherProfilesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MotherProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    nurseProfiles<T extends Hospital$nurseProfilesArgs<ExtArgs> = {}>(args?: Subset<T, Hospital$nurseProfilesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NurseProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Hospital model
   */
  interface HospitalFieldRefs {
    readonly id: FieldRef<"Hospital", 'String'>
    readonly name: FieldRef<"Hospital", 'String'>
    readonly code: FieldRef<"Hospital", 'String'>
    readonly district: FieldRef<"Hospital", 'String'>
    readonly state: FieldRef<"Hospital", 'String'>
    readonly type: FieldRef<"Hospital", 'String'>
    readonly emergencyPhone: FieldRef<"Hospital", 'String'>
    readonly isActive: FieldRef<"Hospital", 'Boolean'>
    readonly nextParticipantNumber: FieldRef<"Hospital", 'Int'>
    readonly createdAt: FieldRef<"Hospital", 'DateTime'>
    readonly updatedAt: FieldRef<"Hospital", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Hospital findUnique
   */
  export type HospitalFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hospital
     */
    select?: HospitalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hospital
     */
    omit?: HospitalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HospitalInclude<ExtArgs> | null
    /**
     * Filter, which Hospital to fetch.
     */
    where: HospitalWhereUniqueInput
  }

  /**
   * Hospital findUniqueOrThrow
   */
  export type HospitalFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hospital
     */
    select?: HospitalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hospital
     */
    omit?: HospitalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HospitalInclude<ExtArgs> | null
    /**
     * Filter, which Hospital to fetch.
     */
    where: HospitalWhereUniqueInput
  }

  /**
   * Hospital findFirst
   */
  export type HospitalFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hospital
     */
    select?: HospitalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hospital
     */
    omit?: HospitalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HospitalInclude<ExtArgs> | null
    /**
     * Filter, which Hospital to fetch.
     */
    where?: HospitalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Hospitals to fetch.
     */
    orderBy?: HospitalOrderByWithRelationInput | HospitalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Hospitals.
     */
    cursor?: HospitalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Hospitals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Hospitals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Hospitals.
     */
    distinct?: HospitalScalarFieldEnum | HospitalScalarFieldEnum[]
  }

  /**
   * Hospital findFirstOrThrow
   */
  export type HospitalFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hospital
     */
    select?: HospitalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hospital
     */
    omit?: HospitalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HospitalInclude<ExtArgs> | null
    /**
     * Filter, which Hospital to fetch.
     */
    where?: HospitalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Hospitals to fetch.
     */
    orderBy?: HospitalOrderByWithRelationInput | HospitalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Hospitals.
     */
    cursor?: HospitalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Hospitals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Hospitals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Hospitals.
     */
    distinct?: HospitalScalarFieldEnum | HospitalScalarFieldEnum[]
  }

  /**
   * Hospital findMany
   */
  export type HospitalFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hospital
     */
    select?: HospitalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hospital
     */
    omit?: HospitalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HospitalInclude<ExtArgs> | null
    /**
     * Filter, which Hospitals to fetch.
     */
    where?: HospitalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Hospitals to fetch.
     */
    orderBy?: HospitalOrderByWithRelationInput | HospitalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Hospitals.
     */
    cursor?: HospitalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Hospitals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Hospitals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Hospitals.
     */
    distinct?: HospitalScalarFieldEnum | HospitalScalarFieldEnum[]
  }

  /**
   * Hospital create
   */
  export type HospitalCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hospital
     */
    select?: HospitalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hospital
     */
    omit?: HospitalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HospitalInclude<ExtArgs> | null
    /**
     * The data needed to create a Hospital.
     */
    data: XOR<HospitalCreateInput, HospitalUncheckedCreateInput>
  }

  /**
   * Hospital createMany
   */
  export type HospitalCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Hospitals.
     */
    data: HospitalCreateManyInput | HospitalCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Hospital createManyAndReturn
   */
  export type HospitalCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hospital
     */
    select?: HospitalSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Hospital
     */
    omit?: HospitalOmit<ExtArgs> | null
    /**
     * The data used to create many Hospitals.
     */
    data: HospitalCreateManyInput | HospitalCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Hospital update
   */
  export type HospitalUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hospital
     */
    select?: HospitalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hospital
     */
    omit?: HospitalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HospitalInclude<ExtArgs> | null
    /**
     * The data needed to update a Hospital.
     */
    data: XOR<HospitalUpdateInput, HospitalUncheckedUpdateInput>
    /**
     * Choose, which Hospital to update.
     */
    where: HospitalWhereUniqueInput
  }

  /**
   * Hospital updateMany
   */
  export type HospitalUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Hospitals.
     */
    data: XOR<HospitalUpdateManyMutationInput, HospitalUncheckedUpdateManyInput>
    /**
     * Filter which Hospitals to update
     */
    where?: HospitalWhereInput
    /**
     * Limit how many Hospitals to update.
     */
    limit?: number
  }

  /**
   * Hospital updateManyAndReturn
   */
  export type HospitalUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hospital
     */
    select?: HospitalSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Hospital
     */
    omit?: HospitalOmit<ExtArgs> | null
    /**
     * The data used to update Hospitals.
     */
    data: XOR<HospitalUpdateManyMutationInput, HospitalUncheckedUpdateManyInput>
    /**
     * Filter which Hospitals to update
     */
    where?: HospitalWhereInput
    /**
     * Limit how many Hospitals to update.
     */
    limit?: number
  }

  /**
   * Hospital upsert
   */
  export type HospitalUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hospital
     */
    select?: HospitalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hospital
     */
    omit?: HospitalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HospitalInclude<ExtArgs> | null
    /**
     * The filter to search for the Hospital to update in case it exists.
     */
    where: HospitalWhereUniqueInput
    /**
     * In case the Hospital found by the `where` argument doesn't exist, create a new Hospital with this data.
     */
    create: XOR<HospitalCreateInput, HospitalUncheckedCreateInput>
    /**
     * In case the Hospital was found with the provided `where` argument, update it with this data.
     */
    update: XOR<HospitalUpdateInput, HospitalUncheckedUpdateInput>
  }

  /**
   * Hospital delete
   */
  export type HospitalDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hospital
     */
    select?: HospitalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hospital
     */
    omit?: HospitalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HospitalInclude<ExtArgs> | null
    /**
     * Filter which Hospital to delete.
     */
    where: HospitalWhereUniqueInput
  }

  /**
   * Hospital deleteMany
   */
  export type HospitalDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Hospitals to delete
     */
    where?: HospitalWhereInput
    /**
     * Limit how many Hospitals to delete.
     */
    limit?: number
  }

  /**
   * Hospital.users
   */
  export type Hospital$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Hospital.motherProfiles
   */
  export type Hospital$motherProfilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MotherProfile
     */
    select?: MotherProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MotherProfile
     */
    omit?: MotherProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherProfileInclude<ExtArgs> | null
    where?: MotherProfileWhereInput
    orderBy?: MotherProfileOrderByWithRelationInput | MotherProfileOrderByWithRelationInput[]
    cursor?: MotherProfileWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MotherProfileScalarFieldEnum | MotherProfileScalarFieldEnum[]
  }

  /**
   * Hospital.nurseProfiles
   */
  export type Hospital$nurseProfilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NurseProfile
     */
    select?: NurseProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NurseProfile
     */
    omit?: NurseProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NurseProfileInclude<ExtArgs> | null
    where?: NurseProfileWhereInput
    orderBy?: NurseProfileOrderByWithRelationInput | NurseProfileOrderByWithRelationInput[]
    cursor?: NurseProfileWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NurseProfileScalarFieldEnum | NurseProfileScalarFieldEnum[]
  }

  /**
   * Hospital without action
   */
  export type HospitalDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hospital
     */
    select?: HospitalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hospital
     */
    omit?: HospitalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HospitalInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    failedPasswordAttempts: number | null
    failedPinAttempts: number | null
  }

  export type UserSumAggregateOutputType = {
    failedPasswordAttempts: number | null
    failedPinAttempts: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    phone: string | null
    phoneVerified: boolean | null
    email: string | null
    passwordHash: string | null
    pinHash: string | null
    role: string | null
    preferredLanguage: string | null
    hospitalId: string | null
    isActive: boolean | null
    lastLoginAt: Date | null
    failedPasswordAttempts: number | null
    passwordLockedUntil: Date | null
    failedPinAttempts: number | null
    pinLockedUntil: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    phone: string | null
    phoneVerified: boolean | null
    email: string | null
    passwordHash: string | null
    pinHash: string | null
    role: string | null
    preferredLanguage: string | null
    hospitalId: string | null
    isActive: boolean | null
    lastLoginAt: Date | null
    failedPasswordAttempts: number | null
    passwordLockedUntil: Date | null
    failedPinAttempts: number | null
    pinLockedUntil: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    phone: number
    phoneVerified: number
    email: number
    passwordHash: number
    pinHash: number
    role: number
    preferredLanguage: number
    hospitalId: number
    isActive: number
    lastLoginAt: number
    failedPasswordAttempts: number
    passwordLockedUntil: number
    failedPinAttempts: number
    pinLockedUntil: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    failedPasswordAttempts?: true
    failedPinAttempts?: true
  }

  export type UserSumAggregateInputType = {
    failedPasswordAttempts?: true
    failedPinAttempts?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    phone?: true
    phoneVerified?: true
    email?: true
    passwordHash?: true
    pinHash?: true
    role?: true
    preferredLanguage?: true
    hospitalId?: true
    isActive?: true
    lastLoginAt?: true
    failedPasswordAttempts?: true
    passwordLockedUntil?: true
    failedPinAttempts?: true
    pinLockedUntil?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    phone?: true
    phoneVerified?: true
    email?: true
    passwordHash?: true
    pinHash?: true
    role?: true
    preferredLanguage?: true
    hospitalId?: true
    isActive?: true
    lastLoginAt?: true
    failedPasswordAttempts?: true
    passwordLockedUntil?: true
    failedPinAttempts?: true
    pinLockedUntil?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    phone?: true
    phoneVerified?: true
    email?: true
    passwordHash?: true
    pinHash?: true
    role?: true
    preferredLanguage?: true
    hospitalId?: true
    isActive?: true
    lastLoginAt?: true
    failedPasswordAttempts?: true
    passwordLockedUntil?: true
    failedPinAttempts?: true
    pinLockedUntil?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    phone: string
    phoneVerified: boolean
    email: string | null
    passwordHash: string
    pinHash: string | null
    role: string
    preferredLanguage: string
    hospitalId: string | null
    isActive: boolean
    lastLoginAt: Date | null
    failedPasswordAttempts: number
    passwordLockedUntil: Date | null
    failedPinAttempts: number
    pinLockedUntil: Date | null
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone?: boolean
    phoneVerified?: boolean
    email?: boolean
    passwordHash?: boolean
    pinHash?: boolean
    role?: boolean
    preferredLanguage?: boolean
    hospitalId?: boolean
    isActive?: boolean
    lastLoginAt?: boolean
    failedPasswordAttempts?: boolean
    passwordLockedUntil?: boolean
    failedPinAttempts?: boolean
    pinLockedUntil?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    hospital?: boolean | User$hospitalArgs<ExtArgs>
    motherProfile?: boolean | User$motherProfileArgs<ExtArgs>
    nurseProfile?: boolean | User$nurseProfileArgs<ExtArgs>
    researcherProfile?: boolean | User$researcherProfileArgs<ExtArgs>
    refreshTokens?: boolean | User$refreshTokensArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone?: boolean
    phoneVerified?: boolean
    email?: boolean
    passwordHash?: boolean
    pinHash?: boolean
    role?: boolean
    preferredLanguage?: boolean
    hospitalId?: boolean
    isActive?: boolean
    lastLoginAt?: boolean
    failedPasswordAttempts?: boolean
    passwordLockedUntil?: boolean
    failedPinAttempts?: boolean
    pinLockedUntil?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    hospital?: boolean | User$hospitalArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone?: boolean
    phoneVerified?: boolean
    email?: boolean
    passwordHash?: boolean
    pinHash?: boolean
    role?: boolean
    preferredLanguage?: boolean
    hospitalId?: boolean
    isActive?: boolean
    lastLoginAt?: boolean
    failedPasswordAttempts?: boolean
    passwordLockedUntil?: boolean
    failedPinAttempts?: boolean
    pinLockedUntil?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    hospital?: boolean | User$hospitalArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    phone?: boolean
    phoneVerified?: boolean
    email?: boolean
    passwordHash?: boolean
    pinHash?: boolean
    role?: boolean
    preferredLanguage?: boolean
    hospitalId?: boolean
    isActive?: boolean
    lastLoginAt?: boolean
    failedPasswordAttempts?: boolean
    passwordLockedUntil?: boolean
    failedPinAttempts?: boolean
    pinLockedUntil?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "phone" | "phoneVerified" | "email" | "passwordHash" | "pinHash" | "role" | "preferredLanguage" | "hospitalId" | "isActive" | "lastLoginAt" | "failedPasswordAttempts" | "passwordLockedUntil" | "failedPinAttempts" | "pinLockedUntil" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    hospital?: boolean | User$hospitalArgs<ExtArgs>
    motherProfile?: boolean | User$motherProfileArgs<ExtArgs>
    nurseProfile?: boolean | User$nurseProfileArgs<ExtArgs>
    researcherProfile?: boolean | User$researcherProfileArgs<ExtArgs>
    refreshTokens?: boolean | User$refreshTokensArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    hospital?: boolean | User$hospitalArgs<ExtArgs>
  }
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    hospital?: boolean | User$hospitalArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      hospital: Prisma.$HospitalPayload<ExtArgs> | null
      motherProfile: Prisma.$MotherProfilePayload<ExtArgs> | null
      nurseProfile: Prisma.$NurseProfilePayload<ExtArgs> | null
      researcherProfile: Prisma.$ResearcherProfilePayload<ExtArgs> | null
      refreshTokens: Prisma.$RefreshTokenPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      /**
       * Normalised to +91XXXXXXXXXX. Unique username for this app.
       */
      phone: string
      phoneVerified: boolean
      email: string | null
      passwordHash: string
      pinHash: string | null
      role: string
      preferredLanguage: string
      hospitalId: string | null
      isActive: boolean
      lastLoginAt: Date | null
      /**
       * Password brute-force protection
       */
      failedPasswordAttempts: number
      passwordLockedUntil: Date | null
      /**
       * PIN brute-force protection  (used from Day 3 onwards)
       */
      failedPinAttempts: number
      pinLockedUntil: Date | null
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    hospital<T extends User$hospitalArgs<ExtArgs> = {}>(args?: Subset<T, User$hospitalArgs<ExtArgs>>): Prisma__HospitalClient<$Result.GetResult<Prisma.$HospitalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    motherProfile<T extends User$motherProfileArgs<ExtArgs> = {}>(args?: Subset<T, User$motherProfileArgs<ExtArgs>>): Prisma__MotherProfileClient<$Result.GetResult<Prisma.$MotherProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    nurseProfile<T extends User$nurseProfileArgs<ExtArgs> = {}>(args?: Subset<T, User$nurseProfileArgs<ExtArgs>>): Prisma__NurseProfileClient<$Result.GetResult<Prisma.$NurseProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    researcherProfile<T extends User$researcherProfileArgs<ExtArgs> = {}>(args?: Subset<T, User$researcherProfileArgs<ExtArgs>>): Prisma__ResearcherProfileClient<$Result.GetResult<Prisma.$ResearcherProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    refreshTokens<T extends User$refreshTokensArgs<ExtArgs> = {}>(args?: Subset<T, User$refreshTokensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly phoneVerified: FieldRef<"User", 'Boolean'>
    readonly email: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly pinHash: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly preferredLanguage: FieldRef<"User", 'String'>
    readonly hospitalId: FieldRef<"User", 'String'>
    readonly isActive: FieldRef<"User", 'Boolean'>
    readonly lastLoginAt: FieldRef<"User", 'DateTime'>
    readonly failedPasswordAttempts: FieldRef<"User", 'Int'>
    readonly passwordLockedUntil: FieldRef<"User", 'DateTime'>
    readonly failedPinAttempts: FieldRef<"User", 'Int'>
    readonly pinLockedUntil: FieldRef<"User", 'DateTime'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly deletedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.hospital
   */
  export type User$hospitalArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hospital
     */
    select?: HospitalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hospital
     */
    omit?: HospitalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HospitalInclude<ExtArgs> | null
    where?: HospitalWhereInput
  }

  /**
   * User.motherProfile
   */
  export type User$motherProfileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MotherProfile
     */
    select?: MotherProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MotherProfile
     */
    omit?: MotherProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherProfileInclude<ExtArgs> | null
    where?: MotherProfileWhereInput
  }

  /**
   * User.nurseProfile
   */
  export type User$nurseProfileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NurseProfile
     */
    select?: NurseProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NurseProfile
     */
    omit?: NurseProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NurseProfileInclude<ExtArgs> | null
    where?: NurseProfileWhereInput
  }

  /**
   * User.researcherProfile
   */
  export type User$researcherProfileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResearcherProfile
     */
    select?: ResearcherProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResearcherProfile
     */
    omit?: ResearcherProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResearcherProfileInclude<ExtArgs> | null
    where?: ResearcherProfileWhereInput
  }

  /**
   * User.refreshTokens
   */
  export type User$refreshTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    where?: RefreshTokenWhereInput
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    cursor?: RefreshTokenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model OtpVerification
   */

  export type AggregateOtpVerification = {
    _count: OtpVerificationCountAggregateOutputType | null
    _avg: OtpVerificationAvgAggregateOutputType | null
    _sum: OtpVerificationSumAggregateOutputType | null
    _min: OtpVerificationMinAggregateOutputType | null
    _max: OtpVerificationMaxAggregateOutputType | null
  }

  export type OtpVerificationAvgAggregateOutputType = {
    attempts: number | null
  }

  export type OtpVerificationSumAggregateOutputType = {
    attempts: number | null
  }

  export type OtpVerificationMinAggregateOutputType = {
    id: string | null
    phone: string | null
    otpHash: string | null
    purpose: string | null
    isUsed: boolean | null
    attempts: number | null
    expiresAt: Date | null
    createdAt: Date | null
    usedAt: Date | null
  }

  export type OtpVerificationMaxAggregateOutputType = {
    id: string | null
    phone: string | null
    otpHash: string | null
    purpose: string | null
    isUsed: boolean | null
    attempts: number | null
    expiresAt: Date | null
    createdAt: Date | null
    usedAt: Date | null
  }

  export type OtpVerificationCountAggregateOutputType = {
    id: number
    phone: number
    otpHash: number
    purpose: number
    isUsed: number
    attempts: number
    expiresAt: number
    createdAt: number
    usedAt: number
    _all: number
  }


  export type OtpVerificationAvgAggregateInputType = {
    attempts?: true
  }

  export type OtpVerificationSumAggregateInputType = {
    attempts?: true
  }

  export type OtpVerificationMinAggregateInputType = {
    id?: true
    phone?: true
    otpHash?: true
    purpose?: true
    isUsed?: true
    attempts?: true
    expiresAt?: true
    createdAt?: true
    usedAt?: true
  }

  export type OtpVerificationMaxAggregateInputType = {
    id?: true
    phone?: true
    otpHash?: true
    purpose?: true
    isUsed?: true
    attempts?: true
    expiresAt?: true
    createdAt?: true
    usedAt?: true
  }

  export type OtpVerificationCountAggregateInputType = {
    id?: true
    phone?: true
    otpHash?: true
    purpose?: true
    isUsed?: true
    attempts?: true
    expiresAt?: true
    createdAt?: true
    usedAt?: true
    _all?: true
  }

  export type OtpVerificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OtpVerification to aggregate.
     */
    where?: OtpVerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OtpVerifications to fetch.
     */
    orderBy?: OtpVerificationOrderByWithRelationInput | OtpVerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OtpVerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OtpVerifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OtpVerifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OtpVerifications
    **/
    _count?: true | OtpVerificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OtpVerificationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OtpVerificationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OtpVerificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OtpVerificationMaxAggregateInputType
  }

  export type GetOtpVerificationAggregateType<T extends OtpVerificationAggregateArgs> = {
        [P in keyof T & keyof AggregateOtpVerification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOtpVerification[P]>
      : GetScalarType<T[P], AggregateOtpVerification[P]>
  }




  export type OtpVerificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OtpVerificationWhereInput
    orderBy?: OtpVerificationOrderByWithAggregationInput | OtpVerificationOrderByWithAggregationInput[]
    by: OtpVerificationScalarFieldEnum[] | OtpVerificationScalarFieldEnum
    having?: OtpVerificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OtpVerificationCountAggregateInputType | true
    _avg?: OtpVerificationAvgAggregateInputType
    _sum?: OtpVerificationSumAggregateInputType
    _min?: OtpVerificationMinAggregateInputType
    _max?: OtpVerificationMaxAggregateInputType
  }

  export type OtpVerificationGroupByOutputType = {
    id: string
    phone: string
    otpHash: string
    purpose: string
    isUsed: boolean
    attempts: number
    expiresAt: Date
    createdAt: Date
    usedAt: Date | null
    _count: OtpVerificationCountAggregateOutputType | null
    _avg: OtpVerificationAvgAggregateOutputType | null
    _sum: OtpVerificationSumAggregateOutputType | null
    _min: OtpVerificationMinAggregateOutputType | null
    _max: OtpVerificationMaxAggregateOutputType | null
  }

  type GetOtpVerificationGroupByPayload<T extends OtpVerificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OtpVerificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OtpVerificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OtpVerificationGroupByOutputType[P]>
            : GetScalarType<T[P], OtpVerificationGroupByOutputType[P]>
        }
      >
    >


  export type OtpVerificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone?: boolean
    otpHash?: boolean
    purpose?: boolean
    isUsed?: boolean
    attempts?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    usedAt?: boolean
  }, ExtArgs["result"]["otpVerification"]>

  export type OtpVerificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone?: boolean
    otpHash?: boolean
    purpose?: boolean
    isUsed?: boolean
    attempts?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    usedAt?: boolean
  }, ExtArgs["result"]["otpVerification"]>

  export type OtpVerificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    phone?: boolean
    otpHash?: boolean
    purpose?: boolean
    isUsed?: boolean
    attempts?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    usedAt?: boolean
  }, ExtArgs["result"]["otpVerification"]>

  export type OtpVerificationSelectScalar = {
    id?: boolean
    phone?: boolean
    otpHash?: boolean
    purpose?: boolean
    isUsed?: boolean
    attempts?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    usedAt?: boolean
  }

  export type OtpVerificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "phone" | "otpHash" | "purpose" | "isUsed" | "attempts" | "expiresAt" | "createdAt" | "usedAt", ExtArgs["result"]["otpVerification"]>

  export type $OtpVerificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OtpVerification"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      phone: string
      otpHash: string
      purpose: string
      isUsed: boolean
      attempts: number
      expiresAt: Date
      createdAt: Date
      usedAt: Date | null
    }, ExtArgs["result"]["otpVerification"]>
    composites: {}
  }

  type OtpVerificationGetPayload<S extends boolean | null | undefined | OtpVerificationDefaultArgs> = $Result.GetResult<Prisma.$OtpVerificationPayload, S>

  type OtpVerificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OtpVerificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OtpVerificationCountAggregateInputType | true
    }

  export interface OtpVerificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OtpVerification'], meta: { name: 'OtpVerification' } }
    /**
     * Find zero or one OtpVerification that matches the filter.
     * @param {OtpVerificationFindUniqueArgs} args - Arguments to find a OtpVerification
     * @example
     * // Get one OtpVerification
     * const otpVerification = await prisma.otpVerification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OtpVerificationFindUniqueArgs>(args: SelectSubset<T, OtpVerificationFindUniqueArgs<ExtArgs>>): Prisma__OtpVerificationClient<$Result.GetResult<Prisma.$OtpVerificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OtpVerification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OtpVerificationFindUniqueOrThrowArgs} args - Arguments to find a OtpVerification
     * @example
     * // Get one OtpVerification
     * const otpVerification = await prisma.otpVerification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OtpVerificationFindUniqueOrThrowArgs>(args: SelectSubset<T, OtpVerificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OtpVerificationClient<$Result.GetResult<Prisma.$OtpVerificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OtpVerification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OtpVerificationFindFirstArgs} args - Arguments to find a OtpVerification
     * @example
     * // Get one OtpVerification
     * const otpVerification = await prisma.otpVerification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OtpVerificationFindFirstArgs>(args?: SelectSubset<T, OtpVerificationFindFirstArgs<ExtArgs>>): Prisma__OtpVerificationClient<$Result.GetResult<Prisma.$OtpVerificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OtpVerification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OtpVerificationFindFirstOrThrowArgs} args - Arguments to find a OtpVerification
     * @example
     * // Get one OtpVerification
     * const otpVerification = await prisma.otpVerification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OtpVerificationFindFirstOrThrowArgs>(args?: SelectSubset<T, OtpVerificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__OtpVerificationClient<$Result.GetResult<Prisma.$OtpVerificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OtpVerifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OtpVerificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OtpVerifications
     * const otpVerifications = await prisma.otpVerification.findMany()
     * 
     * // Get first 10 OtpVerifications
     * const otpVerifications = await prisma.otpVerification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const otpVerificationWithIdOnly = await prisma.otpVerification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OtpVerificationFindManyArgs>(args?: SelectSubset<T, OtpVerificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OtpVerificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OtpVerification.
     * @param {OtpVerificationCreateArgs} args - Arguments to create a OtpVerification.
     * @example
     * // Create one OtpVerification
     * const OtpVerification = await prisma.otpVerification.create({
     *   data: {
     *     // ... data to create a OtpVerification
     *   }
     * })
     * 
     */
    create<T extends OtpVerificationCreateArgs>(args: SelectSubset<T, OtpVerificationCreateArgs<ExtArgs>>): Prisma__OtpVerificationClient<$Result.GetResult<Prisma.$OtpVerificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OtpVerifications.
     * @param {OtpVerificationCreateManyArgs} args - Arguments to create many OtpVerifications.
     * @example
     * // Create many OtpVerifications
     * const otpVerification = await prisma.otpVerification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OtpVerificationCreateManyArgs>(args?: SelectSubset<T, OtpVerificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OtpVerifications and returns the data saved in the database.
     * @param {OtpVerificationCreateManyAndReturnArgs} args - Arguments to create many OtpVerifications.
     * @example
     * // Create many OtpVerifications
     * const otpVerification = await prisma.otpVerification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OtpVerifications and only return the `id`
     * const otpVerificationWithIdOnly = await prisma.otpVerification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OtpVerificationCreateManyAndReturnArgs>(args?: SelectSubset<T, OtpVerificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OtpVerificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OtpVerification.
     * @param {OtpVerificationDeleteArgs} args - Arguments to delete one OtpVerification.
     * @example
     * // Delete one OtpVerification
     * const OtpVerification = await prisma.otpVerification.delete({
     *   where: {
     *     // ... filter to delete one OtpVerification
     *   }
     * })
     * 
     */
    delete<T extends OtpVerificationDeleteArgs>(args: SelectSubset<T, OtpVerificationDeleteArgs<ExtArgs>>): Prisma__OtpVerificationClient<$Result.GetResult<Prisma.$OtpVerificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OtpVerification.
     * @param {OtpVerificationUpdateArgs} args - Arguments to update one OtpVerification.
     * @example
     * // Update one OtpVerification
     * const otpVerification = await prisma.otpVerification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OtpVerificationUpdateArgs>(args: SelectSubset<T, OtpVerificationUpdateArgs<ExtArgs>>): Prisma__OtpVerificationClient<$Result.GetResult<Prisma.$OtpVerificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OtpVerifications.
     * @param {OtpVerificationDeleteManyArgs} args - Arguments to filter OtpVerifications to delete.
     * @example
     * // Delete a few OtpVerifications
     * const { count } = await prisma.otpVerification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OtpVerificationDeleteManyArgs>(args?: SelectSubset<T, OtpVerificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OtpVerifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OtpVerificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OtpVerifications
     * const otpVerification = await prisma.otpVerification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OtpVerificationUpdateManyArgs>(args: SelectSubset<T, OtpVerificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OtpVerifications and returns the data updated in the database.
     * @param {OtpVerificationUpdateManyAndReturnArgs} args - Arguments to update many OtpVerifications.
     * @example
     * // Update many OtpVerifications
     * const otpVerification = await prisma.otpVerification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OtpVerifications and only return the `id`
     * const otpVerificationWithIdOnly = await prisma.otpVerification.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OtpVerificationUpdateManyAndReturnArgs>(args: SelectSubset<T, OtpVerificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OtpVerificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OtpVerification.
     * @param {OtpVerificationUpsertArgs} args - Arguments to update or create a OtpVerification.
     * @example
     * // Update or create a OtpVerification
     * const otpVerification = await prisma.otpVerification.upsert({
     *   create: {
     *     // ... data to create a OtpVerification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OtpVerification we want to update
     *   }
     * })
     */
    upsert<T extends OtpVerificationUpsertArgs>(args: SelectSubset<T, OtpVerificationUpsertArgs<ExtArgs>>): Prisma__OtpVerificationClient<$Result.GetResult<Prisma.$OtpVerificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OtpVerifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OtpVerificationCountArgs} args - Arguments to filter OtpVerifications to count.
     * @example
     * // Count the number of OtpVerifications
     * const count = await prisma.otpVerification.count({
     *   where: {
     *     // ... the filter for the OtpVerifications we want to count
     *   }
     * })
    **/
    count<T extends OtpVerificationCountArgs>(
      args?: Subset<T, OtpVerificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OtpVerificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OtpVerification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OtpVerificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OtpVerificationAggregateArgs>(args: Subset<T, OtpVerificationAggregateArgs>): Prisma.PrismaPromise<GetOtpVerificationAggregateType<T>>

    /**
     * Group by OtpVerification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OtpVerificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OtpVerificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OtpVerificationGroupByArgs['orderBy'] }
        : { orderBy?: OtpVerificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OtpVerificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOtpVerificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OtpVerification model
   */
  readonly fields: OtpVerificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OtpVerification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OtpVerificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OtpVerification model
   */
  interface OtpVerificationFieldRefs {
    readonly id: FieldRef<"OtpVerification", 'String'>
    readonly phone: FieldRef<"OtpVerification", 'String'>
    readonly otpHash: FieldRef<"OtpVerification", 'String'>
    readonly purpose: FieldRef<"OtpVerification", 'String'>
    readonly isUsed: FieldRef<"OtpVerification", 'Boolean'>
    readonly attempts: FieldRef<"OtpVerification", 'Int'>
    readonly expiresAt: FieldRef<"OtpVerification", 'DateTime'>
    readonly createdAt: FieldRef<"OtpVerification", 'DateTime'>
    readonly usedAt: FieldRef<"OtpVerification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OtpVerification findUnique
   */
  export type OtpVerificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpVerification
     */
    select?: OtpVerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OtpVerification
     */
    omit?: OtpVerificationOmit<ExtArgs> | null
    /**
     * Filter, which OtpVerification to fetch.
     */
    where: OtpVerificationWhereUniqueInput
  }

  /**
   * OtpVerification findUniqueOrThrow
   */
  export type OtpVerificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpVerification
     */
    select?: OtpVerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OtpVerification
     */
    omit?: OtpVerificationOmit<ExtArgs> | null
    /**
     * Filter, which OtpVerification to fetch.
     */
    where: OtpVerificationWhereUniqueInput
  }

  /**
   * OtpVerification findFirst
   */
  export type OtpVerificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpVerification
     */
    select?: OtpVerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OtpVerification
     */
    omit?: OtpVerificationOmit<ExtArgs> | null
    /**
     * Filter, which OtpVerification to fetch.
     */
    where?: OtpVerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OtpVerifications to fetch.
     */
    orderBy?: OtpVerificationOrderByWithRelationInput | OtpVerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OtpVerifications.
     */
    cursor?: OtpVerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OtpVerifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OtpVerifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OtpVerifications.
     */
    distinct?: OtpVerificationScalarFieldEnum | OtpVerificationScalarFieldEnum[]
  }

  /**
   * OtpVerification findFirstOrThrow
   */
  export type OtpVerificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpVerification
     */
    select?: OtpVerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OtpVerification
     */
    omit?: OtpVerificationOmit<ExtArgs> | null
    /**
     * Filter, which OtpVerification to fetch.
     */
    where?: OtpVerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OtpVerifications to fetch.
     */
    orderBy?: OtpVerificationOrderByWithRelationInput | OtpVerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OtpVerifications.
     */
    cursor?: OtpVerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OtpVerifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OtpVerifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OtpVerifications.
     */
    distinct?: OtpVerificationScalarFieldEnum | OtpVerificationScalarFieldEnum[]
  }

  /**
   * OtpVerification findMany
   */
  export type OtpVerificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpVerification
     */
    select?: OtpVerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OtpVerification
     */
    omit?: OtpVerificationOmit<ExtArgs> | null
    /**
     * Filter, which OtpVerifications to fetch.
     */
    where?: OtpVerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OtpVerifications to fetch.
     */
    orderBy?: OtpVerificationOrderByWithRelationInput | OtpVerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OtpVerifications.
     */
    cursor?: OtpVerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OtpVerifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OtpVerifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OtpVerifications.
     */
    distinct?: OtpVerificationScalarFieldEnum | OtpVerificationScalarFieldEnum[]
  }

  /**
   * OtpVerification create
   */
  export type OtpVerificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpVerification
     */
    select?: OtpVerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OtpVerification
     */
    omit?: OtpVerificationOmit<ExtArgs> | null
    /**
     * The data needed to create a OtpVerification.
     */
    data: XOR<OtpVerificationCreateInput, OtpVerificationUncheckedCreateInput>
  }

  /**
   * OtpVerification createMany
   */
  export type OtpVerificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OtpVerifications.
     */
    data: OtpVerificationCreateManyInput | OtpVerificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OtpVerification createManyAndReturn
   */
  export type OtpVerificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpVerification
     */
    select?: OtpVerificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OtpVerification
     */
    omit?: OtpVerificationOmit<ExtArgs> | null
    /**
     * The data used to create many OtpVerifications.
     */
    data: OtpVerificationCreateManyInput | OtpVerificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OtpVerification update
   */
  export type OtpVerificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpVerification
     */
    select?: OtpVerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OtpVerification
     */
    omit?: OtpVerificationOmit<ExtArgs> | null
    /**
     * The data needed to update a OtpVerification.
     */
    data: XOR<OtpVerificationUpdateInput, OtpVerificationUncheckedUpdateInput>
    /**
     * Choose, which OtpVerification to update.
     */
    where: OtpVerificationWhereUniqueInput
  }

  /**
   * OtpVerification updateMany
   */
  export type OtpVerificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OtpVerifications.
     */
    data: XOR<OtpVerificationUpdateManyMutationInput, OtpVerificationUncheckedUpdateManyInput>
    /**
     * Filter which OtpVerifications to update
     */
    where?: OtpVerificationWhereInput
    /**
     * Limit how many OtpVerifications to update.
     */
    limit?: number
  }

  /**
   * OtpVerification updateManyAndReturn
   */
  export type OtpVerificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpVerification
     */
    select?: OtpVerificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OtpVerification
     */
    omit?: OtpVerificationOmit<ExtArgs> | null
    /**
     * The data used to update OtpVerifications.
     */
    data: XOR<OtpVerificationUpdateManyMutationInput, OtpVerificationUncheckedUpdateManyInput>
    /**
     * Filter which OtpVerifications to update
     */
    where?: OtpVerificationWhereInput
    /**
     * Limit how many OtpVerifications to update.
     */
    limit?: number
  }

  /**
   * OtpVerification upsert
   */
  export type OtpVerificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpVerification
     */
    select?: OtpVerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OtpVerification
     */
    omit?: OtpVerificationOmit<ExtArgs> | null
    /**
     * The filter to search for the OtpVerification to update in case it exists.
     */
    where: OtpVerificationWhereUniqueInput
    /**
     * In case the OtpVerification found by the `where` argument doesn't exist, create a new OtpVerification with this data.
     */
    create: XOR<OtpVerificationCreateInput, OtpVerificationUncheckedCreateInput>
    /**
     * In case the OtpVerification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OtpVerificationUpdateInput, OtpVerificationUncheckedUpdateInput>
  }

  /**
   * OtpVerification delete
   */
  export type OtpVerificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpVerification
     */
    select?: OtpVerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OtpVerification
     */
    omit?: OtpVerificationOmit<ExtArgs> | null
    /**
     * Filter which OtpVerification to delete.
     */
    where: OtpVerificationWhereUniqueInput
  }

  /**
   * OtpVerification deleteMany
   */
  export type OtpVerificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OtpVerifications to delete
     */
    where?: OtpVerificationWhereInput
    /**
     * Limit how many OtpVerifications to delete.
     */
    limit?: number
  }

  /**
   * OtpVerification without action
   */
  export type OtpVerificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpVerification
     */
    select?: OtpVerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OtpVerification
     */
    omit?: OtpVerificationOmit<ExtArgs> | null
  }


  /**
   * Model RefreshToken
   */

  export type AggregateRefreshToken = {
    _count: RefreshTokenCountAggregateOutputType | null
    _min: RefreshTokenMinAggregateOutputType | null
    _max: RefreshTokenMaxAggregateOutputType | null
  }

  export type RefreshTokenMinAggregateOutputType = {
    id: string | null
    userId: string | null
    tokenHash: string | null
    deviceInfo: string | null
    expiresAt: Date | null
    revokedAt: Date | null
    createdAt: Date | null
  }

  export type RefreshTokenMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    tokenHash: string | null
    deviceInfo: string | null
    expiresAt: Date | null
    revokedAt: Date | null
    createdAt: Date | null
  }

  export type RefreshTokenCountAggregateOutputType = {
    id: number
    userId: number
    tokenHash: number
    deviceInfo: number
    expiresAt: number
    revokedAt: number
    createdAt: number
    _all: number
  }


  export type RefreshTokenMinAggregateInputType = {
    id?: true
    userId?: true
    tokenHash?: true
    deviceInfo?: true
    expiresAt?: true
    revokedAt?: true
    createdAt?: true
  }

  export type RefreshTokenMaxAggregateInputType = {
    id?: true
    userId?: true
    tokenHash?: true
    deviceInfo?: true
    expiresAt?: true
    revokedAt?: true
    createdAt?: true
  }

  export type RefreshTokenCountAggregateInputType = {
    id?: true
    userId?: true
    tokenHash?: true
    deviceInfo?: true
    expiresAt?: true
    revokedAt?: true
    createdAt?: true
    _all?: true
  }

  export type RefreshTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RefreshToken to aggregate.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RefreshTokens
    **/
    _count?: true | RefreshTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RefreshTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RefreshTokenMaxAggregateInputType
  }

  export type GetRefreshTokenAggregateType<T extends RefreshTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateRefreshToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRefreshToken[P]>
      : GetScalarType<T[P], AggregateRefreshToken[P]>
  }




  export type RefreshTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RefreshTokenWhereInput
    orderBy?: RefreshTokenOrderByWithAggregationInput | RefreshTokenOrderByWithAggregationInput[]
    by: RefreshTokenScalarFieldEnum[] | RefreshTokenScalarFieldEnum
    having?: RefreshTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RefreshTokenCountAggregateInputType | true
    _min?: RefreshTokenMinAggregateInputType
    _max?: RefreshTokenMaxAggregateInputType
  }

  export type RefreshTokenGroupByOutputType = {
    id: string
    userId: string
    tokenHash: string
    deviceInfo: string | null
    expiresAt: Date
    revokedAt: Date | null
    createdAt: Date
    _count: RefreshTokenCountAggregateOutputType | null
    _min: RefreshTokenMinAggregateOutputType | null
    _max: RefreshTokenMaxAggregateOutputType | null
  }

  type GetRefreshTokenGroupByPayload<T extends RefreshTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RefreshTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RefreshTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RefreshTokenGroupByOutputType[P]>
            : GetScalarType<T[P], RefreshTokenGroupByOutputType[P]>
        }
      >
    >


  export type RefreshTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tokenHash?: boolean
    deviceInfo?: boolean
    expiresAt?: boolean
    revokedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refreshToken"]>

  export type RefreshTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tokenHash?: boolean
    deviceInfo?: boolean
    expiresAt?: boolean
    revokedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refreshToken"]>

  export type RefreshTokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    tokenHash?: boolean
    deviceInfo?: boolean
    expiresAt?: boolean
    revokedAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refreshToken"]>

  export type RefreshTokenSelectScalar = {
    id?: boolean
    userId?: boolean
    tokenHash?: boolean
    deviceInfo?: boolean
    expiresAt?: boolean
    revokedAt?: boolean
    createdAt?: boolean
  }

  export type RefreshTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "tokenHash" | "deviceInfo" | "expiresAt" | "revokedAt" | "createdAt", ExtArgs["result"]["refreshToken"]>
  export type RefreshTokenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type RefreshTokenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type RefreshTokenIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $RefreshTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RefreshToken"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      tokenHash: string
      deviceInfo: string | null
      expiresAt: Date
      revokedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["refreshToken"]>
    composites: {}
  }

  type RefreshTokenGetPayload<S extends boolean | null | undefined | RefreshTokenDefaultArgs> = $Result.GetResult<Prisma.$RefreshTokenPayload, S>

  type RefreshTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RefreshTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RefreshTokenCountAggregateInputType | true
    }

  export interface RefreshTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RefreshToken'], meta: { name: 'RefreshToken' } }
    /**
     * Find zero or one RefreshToken that matches the filter.
     * @param {RefreshTokenFindUniqueArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RefreshTokenFindUniqueArgs>(args: SelectSubset<T, RefreshTokenFindUniqueArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RefreshToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RefreshTokenFindUniqueOrThrowArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RefreshTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, RefreshTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RefreshToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenFindFirstArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RefreshTokenFindFirstArgs>(args?: SelectSubset<T, RefreshTokenFindFirstArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RefreshToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenFindFirstOrThrowArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RefreshTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, RefreshTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RefreshTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RefreshTokens
     * const refreshTokens = await prisma.refreshToken.findMany()
     * 
     * // Get first 10 RefreshTokens
     * const refreshTokens = await prisma.refreshToken.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const refreshTokenWithIdOnly = await prisma.refreshToken.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RefreshTokenFindManyArgs>(args?: SelectSubset<T, RefreshTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RefreshToken.
     * @param {RefreshTokenCreateArgs} args - Arguments to create a RefreshToken.
     * @example
     * // Create one RefreshToken
     * const RefreshToken = await prisma.refreshToken.create({
     *   data: {
     *     // ... data to create a RefreshToken
     *   }
     * })
     * 
     */
    create<T extends RefreshTokenCreateArgs>(args: SelectSubset<T, RefreshTokenCreateArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RefreshTokens.
     * @param {RefreshTokenCreateManyArgs} args - Arguments to create many RefreshTokens.
     * @example
     * // Create many RefreshTokens
     * const refreshToken = await prisma.refreshToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RefreshTokenCreateManyArgs>(args?: SelectSubset<T, RefreshTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RefreshTokens and returns the data saved in the database.
     * @param {RefreshTokenCreateManyAndReturnArgs} args - Arguments to create many RefreshTokens.
     * @example
     * // Create many RefreshTokens
     * const refreshToken = await prisma.refreshToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RefreshTokens and only return the `id`
     * const refreshTokenWithIdOnly = await prisma.refreshToken.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RefreshTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, RefreshTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RefreshToken.
     * @param {RefreshTokenDeleteArgs} args - Arguments to delete one RefreshToken.
     * @example
     * // Delete one RefreshToken
     * const RefreshToken = await prisma.refreshToken.delete({
     *   where: {
     *     // ... filter to delete one RefreshToken
     *   }
     * })
     * 
     */
    delete<T extends RefreshTokenDeleteArgs>(args: SelectSubset<T, RefreshTokenDeleteArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RefreshToken.
     * @param {RefreshTokenUpdateArgs} args - Arguments to update one RefreshToken.
     * @example
     * // Update one RefreshToken
     * const refreshToken = await prisma.refreshToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RefreshTokenUpdateArgs>(args: SelectSubset<T, RefreshTokenUpdateArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RefreshTokens.
     * @param {RefreshTokenDeleteManyArgs} args - Arguments to filter RefreshTokens to delete.
     * @example
     * // Delete a few RefreshTokens
     * const { count } = await prisma.refreshToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RefreshTokenDeleteManyArgs>(args?: SelectSubset<T, RefreshTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RefreshTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RefreshTokens
     * const refreshToken = await prisma.refreshToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RefreshTokenUpdateManyArgs>(args: SelectSubset<T, RefreshTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RefreshTokens and returns the data updated in the database.
     * @param {RefreshTokenUpdateManyAndReturnArgs} args - Arguments to update many RefreshTokens.
     * @example
     * // Update many RefreshTokens
     * const refreshToken = await prisma.refreshToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RefreshTokens and only return the `id`
     * const refreshTokenWithIdOnly = await prisma.refreshToken.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RefreshTokenUpdateManyAndReturnArgs>(args: SelectSubset<T, RefreshTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RefreshToken.
     * @param {RefreshTokenUpsertArgs} args - Arguments to update or create a RefreshToken.
     * @example
     * // Update or create a RefreshToken
     * const refreshToken = await prisma.refreshToken.upsert({
     *   create: {
     *     // ... data to create a RefreshToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RefreshToken we want to update
     *   }
     * })
     */
    upsert<T extends RefreshTokenUpsertArgs>(args: SelectSubset<T, RefreshTokenUpsertArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RefreshTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenCountArgs} args - Arguments to filter RefreshTokens to count.
     * @example
     * // Count the number of RefreshTokens
     * const count = await prisma.refreshToken.count({
     *   where: {
     *     // ... the filter for the RefreshTokens we want to count
     *   }
     * })
    **/
    count<T extends RefreshTokenCountArgs>(
      args?: Subset<T, RefreshTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RefreshTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RefreshToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RefreshTokenAggregateArgs>(args: Subset<T, RefreshTokenAggregateArgs>): Prisma.PrismaPromise<GetRefreshTokenAggregateType<T>>

    /**
     * Group by RefreshToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RefreshTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RefreshTokenGroupByArgs['orderBy'] }
        : { orderBy?: RefreshTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RefreshTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRefreshTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RefreshToken model
   */
  readonly fields: RefreshTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RefreshToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RefreshTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RefreshToken model
   */
  interface RefreshTokenFieldRefs {
    readonly id: FieldRef<"RefreshToken", 'String'>
    readonly userId: FieldRef<"RefreshToken", 'String'>
    readonly tokenHash: FieldRef<"RefreshToken", 'String'>
    readonly deviceInfo: FieldRef<"RefreshToken", 'String'>
    readonly expiresAt: FieldRef<"RefreshToken", 'DateTime'>
    readonly revokedAt: FieldRef<"RefreshToken", 'DateTime'>
    readonly createdAt: FieldRef<"RefreshToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RefreshToken findUnique
   */
  export type RefreshTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken findUniqueOrThrow
   */
  export type RefreshTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken findFirst
   */
  export type RefreshTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RefreshTokens.
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RefreshTokens.
     */
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * RefreshToken findFirstOrThrow
   */
  export type RefreshTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RefreshTokens.
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RefreshTokens.
     */
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * RefreshToken findMany
   */
  export type RefreshTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshTokens to fetch.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RefreshTokens.
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RefreshTokens.
     */
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * RefreshToken create
   */
  export type RefreshTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * The data needed to create a RefreshToken.
     */
    data: XOR<RefreshTokenCreateInput, RefreshTokenUncheckedCreateInput>
  }

  /**
   * RefreshToken createMany
   */
  export type RefreshTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RefreshTokens.
     */
    data: RefreshTokenCreateManyInput | RefreshTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RefreshToken createManyAndReturn
   */
  export type RefreshTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * The data used to create many RefreshTokens.
     */
    data: RefreshTokenCreateManyInput | RefreshTokenCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RefreshToken update
   */
  export type RefreshTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * The data needed to update a RefreshToken.
     */
    data: XOR<RefreshTokenUpdateInput, RefreshTokenUncheckedUpdateInput>
    /**
     * Choose, which RefreshToken to update.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken updateMany
   */
  export type RefreshTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RefreshTokens.
     */
    data: XOR<RefreshTokenUpdateManyMutationInput, RefreshTokenUncheckedUpdateManyInput>
    /**
     * Filter which RefreshTokens to update
     */
    where?: RefreshTokenWhereInput
    /**
     * Limit how many RefreshTokens to update.
     */
    limit?: number
  }

  /**
   * RefreshToken updateManyAndReturn
   */
  export type RefreshTokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * The data used to update RefreshTokens.
     */
    data: XOR<RefreshTokenUpdateManyMutationInput, RefreshTokenUncheckedUpdateManyInput>
    /**
     * Filter which RefreshTokens to update
     */
    where?: RefreshTokenWhereInput
    /**
     * Limit how many RefreshTokens to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RefreshToken upsert
   */
  export type RefreshTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * The filter to search for the RefreshToken to update in case it exists.
     */
    where: RefreshTokenWhereUniqueInput
    /**
     * In case the RefreshToken found by the `where` argument doesn't exist, create a new RefreshToken with this data.
     */
    create: XOR<RefreshTokenCreateInput, RefreshTokenUncheckedCreateInput>
    /**
     * In case the RefreshToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RefreshTokenUpdateInput, RefreshTokenUncheckedUpdateInput>
  }

  /**
   * RefreshToken delete
   */
  export type RefreshTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter which RefreshToken to delete.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken deleteMany
   */
  export type RefreshTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RefreshTokens to delete
     */
    where?: RefreshTokenWhereInput
    /**
     * Limit how many RefreshTokens to delete.
     */
    limit?: number
  }

  /**
   * RefreshToken without action
   */
  export type RefreshTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
  }


  /**
   * Model MotherProfile
   */

  export type AggregateMotherProfile = {
    _count: MotherProfileCountAggregateOutputType | null
    _min: MotherProfileMinAggregateOutputType | null
    _max: MotherProfileMaxAggregateOutputType | null
  }

  export type MotherProfileMinAggregateOutputType = {
    id: string | null
    userId: string | null
    participantCode: string | null
    studyGroup: string | null
    hospitalId: string | null
    fullName: string | null
    ageRange: string | null
    educationMother: string | null
    educationFather: string | null
    occupationMother: string | null
    occupationFather: string | null
    incomeClass: string | null
    familyType: string | null
    familyMembersCount: string | null
    religion: string | null
    residenceType: string | null
    contactNumber: string | null
    prevPretermEducation: boolean | null
    enrolledAt: Date | null
    onboardingCompletedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MotherProfileMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    participantCode: string | null
    studyGroup: string | null
    hospitalId: string | null
    fullName: string | null
    ageRange: string | null
    educationMother: string | null
    educationFather: string | null
    occupationMother: string | null
    occupationFather: string | null
    incomeClass: string | null
    familyType: string | null
    familyMembersCount: string | null
    religion: string | null
    residenceType: string | null
    contactNumber: string | null
    prevPretermEducation: boolean | null
    enrolledAt: Date | null
    onboardingCompletedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MotherProfileCountAggregateOutputType = {
    id: number
    userId: number
    participantCode: number
    studyGroup: number
    hospitalId: number
    fullName: number
    ageRange: number
    educationMother: number
    educationFather: number
    occupationMother: number
    occupationFather: number
    incomeClass: number
    familyType: number
    familyMembersCount: number
    religion: number
    residenceType: number
    contactNumber: number
    prevPretermEducation: number
    educationSource: number
    enrolledAt: number
    onboardingCompletedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MotherProfileMinAggregateInputType = {
    id?: true
    userId?: true
    participantCode?: true
    studyGroup?: true
    hospitalId?: true
    fullName?: true
    ageRange?: true
    educationMother?: true
    educationFather?: true
    occupationMother?: true
    occupationFather?: true
    incomeClass?: true
    familyType?: true
    familyMembersCount?: true
    religion?: true
    residenceType?: true
    contactNumber?: true
    prevPretermEducation?: true
    enrolledAt?: true
    onboardingCompletedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MotherProfileMaxAggregateInputType = {
    id?: true
    userId?: true
    participantCode?: true
    studyGroup?: true
    hospitalId?: true
    fullName?: true
    ageRange?: true
    educationMother?: true
    educationFather?: true
    occupationMother?: true
    occupationFather?: true
    incomeClass?: true
    familyType?: true
    familyMembersCount?: true
    religion?: true
    residenceType?: true
    contactNumber?: true
    prevPretermEducation?: true
    enrolledAt?: true
    onboardingCompletedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MotherProfileCountAggregateInputType = {
    id?: true
    userId?: true
    participantCode?: true
    studyGroup?: true
    hospitalId?: true
    fullName?: true
    ageRange?: true
    educationMother?: true
    educationFather?: true
    occupationMother?: true
    occupationFather?: true
    incomeClass?: true
    familyType?: true
    familyMembersCount?: true
    religion?: true
    residenceType?: true
    contactNumber?: true
    prevPretermEducation?: true
    educationSource?: true
    enrolledAt?: true
    onboardingCompletedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MotherProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MotherProfile to aggregate.
     */
    where?: MotherProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MotherProfiles to fetch.
     */
    orderBy?: MotherProfileOrderByWithRelationInput | MotherProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MotherProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MotherProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MotherProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MotherProfiles
    **/
    _count?: true | MotherProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MotherProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MotherProfileMaxAggregateInputType
  }

  export type GetMotherProfileAggregateType<T extends MotherProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateMotherProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMotherProfile[P]>
      : GetScalarType<T[P], AggregateMotherProfile[P]>
  }




  export type MotherProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MotherProfileWhereInput
    orderBy?: MotherProfileOrderByWithAggregationInput | MotherProfileOrderByWithAggregationInput[]
    by: MotherProfileScalarFieldEnum[] | MotherProfileScalarFieldEnum
    having?: MotherProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MotherProfileCountAggregateInputType | true
    _min?: MotherProfileMinAggregateInputType
    _max?: MotherProfileMaxAggregateInputType
  }

  export type MotherProfileGroupByOutputType = {
    id: string
    userId: string
    participantCode: string | null
    studyGroup: string | null
    hospitalId: string | null
    fullName: string | null
    ageRange: string
    educationMother: string
    educationFather: string
    occupationMother: string
    occupationFather: string
    incomeClass: string
    familyType: string
    familyMembersCount: string
    religion: string
    residenceType: string
    contactNumber: string | null
    prevPretermEducation: boolean
    educationSource: string[]
    enrolledAt: Date
    onboardingCompletedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: MotherProfileCountAggregateOutputType | null
    _min: MotherProfileMinAggregateOutputType | null
    _max: MotherProfileMaxAggregateOutputType | null
  }

  type GetMotherProfileGroupByPayload<T extends MotherProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MotherProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MotherProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MotherProfileGroupByOutputType[P]>
            : GetScalarType<T[P], MotherProfileGroupByOutputType[P]>
        }
      >
    >


  export type MotherProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    participantCode?: boolean
    studyGroup?: boolean
    hospitalId?: boolean
    fullName?: boolean
    ageRange?: boolean
    educationMother?: boolean
    educationFather?: boolean
    occupationMother?: boolean
    occupationFather?: boolean
    incomeClass?: boolean
    familyType?: boolean
    familyMembersCount?: boolean
    religion?: boolean
    residenceType?: boolean
    contactNumber?: boolean
    prevPretermEducation?: boolean
    educationSource?: boolean
    enrolledAt?: boolean
    onboardingCompletedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    hospital?: boolean | MotherProfile$hospitalArgs<ExtArgs>
    babyProfile?: boolean | MotherProfile$babyProfileArgs<ExtArgs>
    followUpSchedules?: boolean | MotherProfile$followUpSchedulesArgs<ExtArgs>
    _count?: boolean | MotherProfileCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["motherProfile"]>

  export type MotherProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    participantCode?: boolean
    studyGroup?: boolean
    hospitalId?: boolean
    fullName?: boolean
    ageRange?: boolean
    educationMother?: boolean
    educationFather?: boolean
    occupationMother?: boolean
    occupationFather?: boolean
    incomeClass?: boolean
    familyType?: boolean
    familyMembersCount?: boolean
    religion?: boolean
    residenceType?: boolean
    contactNumber?: boolean
    prevPretermEducation?: boolean
    educationSource?: boolean
    enrolledAt?: boolean
    onboardingCompletedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    hospital?: boolean | MotherProfile$hospitalArgs<ExtArgs>
  }, ExtArgs["result"]["motherProfile"]>

  export type MotherProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    participantCode?: boolean
    studyGroup?: boolean
    hospitalId?: boolean
    fullName?: boolean
    ageRange?: boolean
    educationMother?: boolean
    educationFather?: boolean
    occupationMother?: boolean
    occupationFather?: boolean
    incomeClass?: boolean
    familyType?: boolean
    familyMembersCount?: boolean
    religion?: boolean
    residenceType?: boolean
    contactNumber?: boolean
    prevPretermEducation?: boolean
    educationSource?: boolean
    enrolledAt?: boolean
    onboardingCompletedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    hospital?: boolean | MotherProfile$hospitalArgs<ExtArgs>
  }, ExtArgs["result"]["motherProfile"]>

  export type MotherProfileSelectScalar = {
    id?: boolean
    userId?: boolean
    participantCode?: boolean
    studyGroup?: boolean
    hospitalId?: boolean
    fullName?: boolean
    ageRange?: boolean
    educationMother?: boolean
    educationFather?: boolean
    occupationMother?: boolean
    occupationFather?: boolean
    incomeClass?: boolean
    familyType?: boolean
    familyMembersCount?: boolean
    religion?: boolean
    residenceType?: boolean
    contactNumber?: boolean
    prevPretermEducation?: boolean
    educationSource?: boolean
    enrolledAt?: boolean
    onboardingCompletedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MotherProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "participantCode" | "studyGroup" | "hospitalId" | "fullName" | "ageRange" | "educationMother" | "educationFather" | "occupationMother" | "occupationFather" | "incomeClass" | "familyType" | "familyMembersCount" | "religion" | "residenceType" | "contactNumber" | "prevPretermEducation" | "educationSource" | "enrolledAt" | "onboardingCompletedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["motherProfile"]>
  export type MotherProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    hospital?: boolean | MotherProfile$hospitalArgs<ExtArgs>
    babyProfile?: boolean | MotherProfile$babyProfileArgs<ExtArgs>
    followUpSchedules?: boolean | MotherProfile$followUpSchedulesArgs<ExtArgs>
    _count?: boolean | MotherProfileCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MotherProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    hospital?: boolean | MotherProfile$hospitalArgs<ExtArgs>
  }
  export type MotherProfileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    hospital?: boolean | MotherProfile$hospitalArgs<ExtArgs>
  }

  export type $MotherProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MotherProfile"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      hospital: Prisma.$HospitalPayload<ExtArgs> | null
      babyProfile: Prisma.$BabyProfilePayload<ExtArgs> | null
      followUpSchedules: Prisma.$FollowUpSchedulePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      participantCode: string | null
      studyGroup: string | null
      hospitalId: string | null
      fullName: string | null
      ageRange: string
      educationMother: string
      educationFather: string
      occupationMother: string
      occupationFather: string
      incomeClass: string
      familyType: string
      familyMembersCount: string
      religion: string
      residenceType: string
      contactNumber: string | null
      prevPretermEducation: boolean
      educationSource: string[]
      enrolledAt: Date
      onboardingCompletedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["motherProfile"]>
    composites: {}
  }

  type MotherProfileGetPayload<S extends boolean | null | undefined | MotherProfileDefaultArgs> = $Result.GetResult<Prisma.$MotherProfilePayload, S>

  type MotherProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MotherProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MotherProfileCountAggregateInputType | true
    }

  export interface MotherProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MotherProfile'], meta: { name: 'MotherProfile' } }
    /**
     * Find zero or one MotherProfile that matches the filter.
     * @param {MotherProfileFindUniqueArgs} args - Arguments to find a MotherProfile
     * @example
     * // Get one MotherProfile
     * const motherProfile = await prisma.motherProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MotherProfileFindUniqueArgs>(args: SelectSubset<T, MotherProfileFindUniqueArgs<ExtArgs>>): Prisma__MotherProfileClient<$Result.GetResult<Prisma.$MotherProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MotherProfile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MotherProfileFindUniqueOrThrowArgs} args - Arguments to find a MotherProfile
     * @example
     * // Get one MotherProfile
     * const motherProfile = await prisma.motherProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MotherProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, MotherProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MotherProfileClient<$Result.GetResult<Prisma.$MotherProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MotherProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MotherProfileFindFirstArgs} args - Arguments to find a MotherProfile
     * @example
     * // Get one MotherProfile
     * const motherProfile = await prisma.motherProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MotherProfileFindFirstArgs>(args?: SelectSubset<T, MotherProfileFindFirstArgs<ExtArgs>>): Prisma__MotherProfileClient<$Result.GetResult<Prisma.$MotherProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MotherProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MotherProfileFindFirstOrThrowArgs} args - Arguments to find a MotherProfile
     * @example
     * // Get one MotherProfile
     * const motherProfile = await prisma.motherProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MotherProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, MotherProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__MotherProfileClient<$Result.GetResult<Prisma.$MotherProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MotherProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MotherProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MotherProfiles
     * const motherProfiles = await prisma.motherProfile.findMany()
     * 
     * // Get first 10 MotherProfiles
     * const motherProfiles = await prisma.motherProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const motherProfileWithIdOnly = await prisma.motherProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MotherProfileFindManyArgs>(args?: SelectSubset<T, MotherProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MotherProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MotherProfile.
     * @param {MotherProfileCreateArgs} args - Arguments to create a MotherProfile.
     * @example
     * // Create one MotherProfile
     * const MotherProfile = await prisma.motherProfile.create({
     *   data: {
     *     // ... data to create a MotherProfile
     *   }
     * })
     * 
     */
    create<T extends MotherProfileCreateArgs>(args: SelectSubset<T, MotherProfileCreateArgs<ExtArgs>>): Prisma__MotherProfileClient<$Result.GetResult<Prisma.$MotherProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MotherProfiles.
     * @param {MotherProfileCreateManyArgs} args - Arguments to create many MotherProfiles.
     * @example
     * // Create many MotherProfiles
     * const motherProfile = await prisma.motherProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MotherProfileCreateManyArgs>(args?: SelectSubset<T, MotherProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MotherProfiles and returns the data saved in the database.
     * @param {MotherProfileCreateManyAndReturnArgs} args - Arguments to create many MotherProfiles.
     * @example
     * // Create many MotherProfiles
     * const motherProfile = await prisma.motherProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MotherProfiles and only return the `id`
     * const motherProfileWithIdOnly = await prisma.motherProfile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MotherProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, MotherProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MotherProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MotherProfile.
     * @param {MotherProfileDeleteArgs} args - Arguments to delete one MotherProfile.
     * @example
     * // Delete one MotherProfile
     * const MotherProfile = await prisma.motherProfile.delete({
     *   where: {
     *     // ... filter to delete one MotherProfile
     *   }
     * })
     * 
     */
    delete<T extends MotherProfileDeleteArgs>(args: SelectSubset<T, MotherProfileDeleteArgs<ExtArgs>>): Prisma__MotherProfileClient<$Result.GetResult<Prisma.$MotherProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MotherProfile.
     * @param {MotherProfileUpdateArgs} args - Arguments to update one MotherProfile.
     * @example
     * // Update one MotherProfile
     * const motherProfile = await prisma.motherProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MotherProfileUpdateArgs>(args: SelectSubset<T, MotherProfileUpdateArgs<ExtArgs>>): Prisma__MotherProfileClient<$Result.GetResult<Prisma.$MotherProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MotherProfiles.
     * @param {MotherProfileDeleteManyArgs} args - Arguments to filter MotherProfiles to delete.
     * @example
     * // Delete a few MotherProfiles
     * const { count } = await prisma.motherProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MotherProfileDeleteManyArgs>(args?: SelectSubset<T, MotherProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MotherProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MotherProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MotherProfiles
     * const motherProfile = await prisma.motherProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MotherProfileUpdateManyArgs>(args: SelectSubset<T, MotherProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MotherProfiles and returns the data updated in the database.
     * @param {MotherProfileUpdateManyAndReturnArgs} args - Arguments to update many MotherProfiles.
     * @example
     * // Update many MotherProfiles
     * const motherProfile = await prisma.motherProfile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MotherProfiles and only return the `id`
     * const motherProfileWithIdOnly = await prisma.motherProfile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MotherProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, MotherProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MotherProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MotherProfile.
     * @param {MotherProfileUpsertArgs} args - Arguments to update or create a MotherProfile.
     * @example
     * // Update or create a MotherProfile
     * const motherProfile = await prisma.motherProfile.upsert({
     *   create: {
     *     // ... data to create a MotherProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MotherProfile we want to update
     *   }
     * })
     */
    upsert<T extends MotherProfileUpsertArgs>(args: SelectSubset<T, MotherProfileUpsertArgs<ExtArgs>>): Prisma__MotherProfileClient<$Result.GetResult<Prisma.$MotherProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MotherProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MotherProfileCountArgs} args - Arguments to filter MotherProfiles to count.
     * @example
     * // Count the number of MotherProfiles
     * const count = await prisma.motherProfile.count({
     *   where: {
     *     // ... the filter for the MotherProfiles we want to count
     *   }
     * })
    **/
    count<T extends MotherProfileCountArgs>(
      args?: Subset<T, MotherProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MotherProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MotherProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MotherProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MotherProfileAggregateArgs>(args: Subset<T, MotherProfileAggregateArgs>): Prisma.PrismaPromise<GetMotherProfileAggregateType<T>>

    /**
     * Group by MotherProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MotherProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MotherProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MotherProfileGroupByArgs['orderBy'] }
        : { orderBy?: MotherProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MotherProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMotherProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MotherProfile model
   */
  readonly fields: MotherProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MotherProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MotherProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    hospital<T extends MotherProfile$hospitalArgs<ExtArgs> = {}>(args?: Subset<T, MotherProfile$hospitalArgs<ExtArgs>>): Prisma__HospitalClient<$Result.GetResult<Prisma.$HospitalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    babyProfile<T extends MotherProfile$babyProfileArgs<ExtArgs> = {}>(args?: Subset<T, MotherProfile$babyProfileArgs<ExtArgs>>): Prisma__BabyProfileClient<$Result.GetResult<Prisma.$BabyProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    followUpSchedules<T extends MotherProfile$followUpSchedulesArgs<ExtArgs> = {}>(args?: Subset<T, MotherProfile$followUpSchedulesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FollowUpSchedulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MotherProfile model
   */
  interface MotherProfileFieldRefs {
    readonly id: FieldRef<"MotherProfile", 'String'>
    readonly userId: FieldRef<"MotherProfile", 'String'>
    readonly participantCode: FieldRef<"MotherProfile", 'String'>
    readonly studyGroup: FieldRef<"MotherProfile", 'String'>
    readonly hospitalId: FieldRef<"MotherProfile", 'String'>
    readonly fullName: FieldRef<"MotherProfile", 'String'>
    readonly ageRange: FieldRef<"MotherProfile", 'String'>
    readonly educationMother: FieldRef<"MotherProfile", 'String'>
    readonly educationFather: FieldRef<"MotherProfile", 'String'>
    readonly occupationMother: FieldRef<"MotherProfile", 'String'>
    readonly occupationFather: FieldRef<"MotherProfile", 'String'>
    readonly incomeClass: FieldRef<"MotherProfile", 'String'>
    readonly familyType: FieldRef<"MotherProfile", 'String'>
    readonly familyMembersCount: FieldRef<"MotherProfile", 'String'>
    readonly religion: FieldRef<"MotherProfile", 'String'>
    readonly residenceType: FieldRef<"MotherProfile", 'String'>
    readonly contactNumber: FieldRef<"MotherProfile", 'String'>
    readonly prevPretermEducation: FieldRef<"MotherProfile", 'Boolean'>
    readonly educationSource: FieldRef<"MotherProfile", 'String[]'>
    readonly enrolledAt: FieldRef<"MotherProfile", 'DateTime'>
    readonly onboardingCompletedAt: FieldRef<"MotherProfile", 'DateTime'>
    readonly createdAt: FieldRef<"MotherProfile", 'DateTime'>
    readonly updatedAt: FieldRef<"MotherProfile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MotherProfile findUnique
   */
  export type MotherProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MotherProfile
     */
    select?: MotherProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MotherProfile
     */
    omit?: MotherProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherProfileInclude<ExtArgs> | null
    /**
     * Filter, which MotherProfile to fetch.
     */
    where: MotherProfileWhereUniqueInput
  }

  /**
   * MotherProfile findUniqueOrThrow
   */
  export type MotherProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MotherProfile
     */
    select?: MotherProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MotherProfile
     */
    omit?: MotherProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherProfileInclude<ExtArgs> | null
    /**
     * Filter, which MotherProfile to fetch.
     */
    where: MotherProfileWhereUniqueInput
  }

  /**
   * MotherProfile findFirst
   */
  export type MotherProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MotherProfile
     */
    select?: MotherProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MotherProfile
     */
    omit?: MotherProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherProfileInclude<ExtArgs> | null
    /**
     * Filter, which MotherProfile to fetch.
     */
    where?: MotherProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MotherProfiles to fetch.
     */
    orderBy?: MotherProfileOrderByWithRelationInput | MotherProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MotherProfiles.
     */
    cursor?: MotherProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MotherProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MotherProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MotherProfiles.
     */
    distinct?: MotherProfileScalarFieldEnum | MotherProfileScalarFieldEnum[]
  }

  /**
   * MotherProfile findFirstOrThrow
   */
  export type MotherProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MotherProfile
     */
    select?: MotherProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MotherProfile
     */
    omit?: MotherProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherProfileInclude<ExtArgs> | null
    /**
     * Filter, which MotherProfile to fetch.
     */
    where?: MotherProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MotherProfiles to fetch.
     */
    orderBy?: MotherProfileOrderByWithRelationInput | MotherProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MotherProfiles.
     */
    cursor?: MotherProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MotherProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MotherProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MotherProfiles.
     */
    distinct?: MotherProfileScalarFieldEnum | MotherProfileScalarFieldEnum[]
  }

  /**
   * MotherProfile findMany
   */
  export type MotherProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MotherProfile
     */
    select?: MotherProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MotherProfile
     */
    omit?: MotherProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherProfileInclude<ExtArgs> | null
    /**
     * Filter, which MotherProfiles to fetch.
     */
    where?: MotherProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MotherProfiles to fetch.
     */
    orderBy?: MotherProfileOrderByWithRelationInput | MotherProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MotherProfiles.
     */
    cursor?: MotherProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MotherProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MotherProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MotherProfiles.
     */
    distinct?: MotherProfileScalarFieldEnum | MotherProfileScalarFieldEnum[]
  }

  /**
   * MotherProfile create
   */
  export type MotherProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MotherProfile
     */
    select?: MotherProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MotherProfile
     */
    omit?: MotherProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a MotherProfile.
     */
    data: XOR<MotherProfileCreateInput, MotherProfileUncheckedCreateInput>
  }

  /**
   * MotherProfile createMany
   */
  export type MotherProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MotherProfiles.
     */
    data: MotherProfileCreateManyInput | MotherProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MotherProfile createManyAndReturn
   */
  export type MotherProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MotherProfile
     */
    select?: MotherProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MotherProfile
     */
    omit?: MotherProfileOmit<ExtArgs> | null
    /**
     * The data used to create many MotherProfiles.
     */
    data: MotherProfileCreateManyInput | MotherProfileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherProfileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MotherProfile update
   */
  export type MotherProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MotherProfile
     */
    select?: MotherProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MotherProfile
     */
    omit?: MotherProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a MotherProfile.
     */
    data: XOR<MotherProfileUpdateInput, MotherProfileUncheckedUpdateInput>
    /**
     * Choose, which MotherProfile to update.
     */
    where: MotherProfileWhereUniqueInput
  }

  /**
   * MotherProfile updateMany
   */
  export type MotherProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MotherProfiles.
     */
    data: XOR<MotherProfileUpdateManyMutationInput, MotherProfileUncheckedUpdateManyInput>
    /**
     * Filter which MotherProfiles to update
     */
    where?: MotherProfileWhereInput
    /**
     * Limit how many MotherProfiles to update.
     */
    limit?: number
  }

  /**
   * MotherProfile updateManyAndReturn
   */
  export type MotherProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MotherProfile
     */
    select?: MotherProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MotherProfile
     */
    omit?: MotherProfileOmit<ExtArgs> | null
    /**
     * The data used to update MotherProfiles.
     */
    data: XOR<MotherProfileUpdateManyMutationInput, MotherProfileUncheckedUpdateManyInput>
    /**
     * Filter which MotherProfiles to update
     */
    where?: MotherProfileWhereInput
    /**
     * Limit how many MotherProfiles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherProfileIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MotherProfile upsert
   */
  export type MotherProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MotherProfile
     */
    select?: MotherProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MotherProfile
     */
    omit?: MotherProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the MotherProfile to update in case it exists.
     */
    where: MotherProfileWhereUniqueInput
    /**
     * In case the MotherProfile found by the `where` argument doesn't exist, create a new MotherProfile with this data.
     */
    create: XOR<MotherProfileCreateInput, MotherProfileUncheckedCreateInput>
    /**
     * In case the MotherProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MotherProfileUpdateInput, MotherProfileUncheckedUpdateInput>
  }

  /**
   * MotherProfile delete
   */
  export type MotherProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MotherProfile
     */
    select?: MotherProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MotherProfile
     */
    omit?: MotherProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherProfileInclude<ExtArgs> | null
    /**
     * Filter which MotherProfile to delete.
     */
    where: MotherProfileWhereUniqueInput
  }

  /**
   * MotherProfile deleteMany
   */
  export type MotherProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MotherProfiles to delete
     */
    where?: MotherProfileWhereInput
    /**
     * Limit how many MotherProfiles to delete.
     */
    limit?: number
  }

  /**
   * MotherProfile.hospital
   */
  export type MotherProfile$hospitalArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hospital
     */
    select?: HospitalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hospital
     */
    omit?: HospitalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HospitalInclude<ExtArgs> | null
    where?: HospitalWhereInput
  }

  /**
   * MotherProfile.babyProfile
   */
  export type MotherProfile$babyProfileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BabyProfile
     */
    select?: BabyProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BabyProfile
     */
    omit?: BabyProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BabyProfileInclude<ExtArgs> | null
    where?: BabyProfileWhereInput
  }

  /**
   * MotherProfile.followUpSchedules
   */
  export type MotherProfile$followUpSchedulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FollowUpSchedule
     */
    select?: FollowUpScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FollowUpSchedule
     */
    omit?: FollowUpScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowUpScheduleInclude<ExtArgs> | null
    where?: FollowUpScheduleWhereInput
    orderBy?: FollowUpScheduleOrderByWithRelationInput | FollowUpScheduleOrderByWithRelationInput[]
    cursor?: FollowUpScheduleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FollowUpScheduleScalarFieldEnum | FollowUpScheduleScalarFieldEnum[]
  }

  /**
   * MotherProfile without action
   */
  export type MotherProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MotherProfile
     */
    select?: MotherProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MotherProfile
     */
    omit?: MotherProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherProfileInclude<ExtArgs> | null
  }


  /**
   * Model BabyProfile
   */

  export type AggregateBabyProfile = {
    _count: BabyProfileCountAggregateOutputType | null
    _avg: BabyProfileAvgAggregateOutputType | null
    _sum: BabyProfileSumAggregateOutputType | null
    _min: BabyProfileMinAggregateOutputType | null
    _max: BabyProfileMaxAggregateOutputType | null
  }

  export type BabyProfileAvgAggregateOutputType = {
    gestationalAgeWeeks: Decimal | null
    birthWeightGrams: number | null
    weightAtDischargeGrams: number | null
    nicuStayDays: number | null
  }

  export type BabyProfileSumAggregateOutputType = {
    gestationalAgeWeeks: Decimal | null
    birthWeightGrams: number | null
    weightAtDischargeGrams: number | null
    nicuStayDays: number | null
  }

  export type BabyProfileMinAggregateOutputType = {
    id: string | null
    motherProfileId: string | null
    babyName: string | null
    sex: string | null
    dateOfBirth: Date | null
    gestationalAgeWeeks: Decimal | null
    birthWeightGrams: number | null
    weightAtDischargeGrams: number | null
    placeOfDelivery: string | null
    nicuStayDays: number | null
    skinToSkinAtBirth: boolean | null
    kmcInNicu: boolean | null
    feedingAtDischarge: string | null
    criedAtBirth: boolean | null
    neededResuscitation: boolean | null
    birthWeightStratum: string | null
    dischargeDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BabyProfileMaxAggregateOutputType = {
    id: string | null
    motherProfileId: string | null
    babyName: string | null
    sex: string | null
    dateOfBirth: Date | null
    gestationalAgeWeeks: Decimal | null
    birthWeightGrams: number | null
    weightAtDischargeGrams: number | null
    placeOfDelivery: string | null
    nicuStayDays: number | null
    skinToSkinAtBirth: boolean | null
    kmcInNicu: boolean | null
    feedingAtDischarge: string | null
    criedAtBirth: boolean | null
    neededResuscitation: boolean | null
    birthWeightStratum: string | null
    dischargeDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BabyProfileCountAggregateOutputType = {
    id: number
    motherProfileId: number
    babyName: number
    sex: number
    dateOfBirth: number
    gestationalAgeWeeks: number
    birthWeightGrams: number
    weightAtDischargeGrams: number
    placeOfDelivery: number
    nicuStayDays: number
    skinToSkinAtBirth: number
    kmcInNicu: number
    feedingAtDischarge: number
    criedAtBirth: number
    neededResuscitation: number
    birthWeightStratum: number
    dischargeDate: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BabyProfileAvgAggregateInputType = {
    gestationalAgeWeeks?: true
    birthWeightGrams?: true
    weightAtDischargeGrams?: true
    nicuStayDays?: true
  }

  export type BabyProfileSumAggregateInputType = {
    gestationalAgeWeeks?: true
    birthWeightGrams?: true
    weightAtDischargeGrams?: true
    nicuStayDays?: true
  }

  export type BabyProfileMinAggregateInputType = {
    id?: true
    motherProfileId?: true
    babyName?: true
    sex?: true
    dateOfBirth?: true
    gestationalAgeWeeks?: true
    birthWeightGrams?: true
    weightAtDischargeGrams?: true
    placeOfDelivery?: true
    nicuStayDays?: true
    skinToSkinAtBirth?: true
    kmcInNicu?: true
    feedingAtDischarge?: true
    criedAtBirth?: true
    neededResuscitation?: true
    birthWeightStratum?: true
    dischargeDate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BabyProfileMaxAggregateInputType = {
    id?: true
    motherProfileId?: true
    babyName?: true
    sex?: true
    dateOfBirth?: true
    gestationalAgeWeeks?: true
    birthWeightGrams?: true
    weightAtDischargeGrams?: true
    placeOfDelivery?: true
    nicuStayDays?: true
    skinToSkinAtBirth?: true
    kmcInNicu?: true
    feedingAtDischarge?: true
    criedAtBirth?: true
    neededResuscitation?: true
    birthWeightStratum?: true
    dischargeDate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BabyProfileCountAggregateInputType = {
    id?: true
    motherProfileId?: true
    babyName?: true
    sex?: true
    dateOfBirth?: true
    gestationalAgeWeeks?: true
    birthWeightGrams?: true
    weightAtDischargeGrams?: true
    placeOfDelivery?: true
    nicuStayDays?: true
    skinToSkinAtBirth?: true
    kmcInNicu?: true
    feedingAtDischarge?: true
    criedAtBirth?: true
    neededResuscitation?: true
    birthWeightStratum?: true
    dischargeDate?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BabyProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BabyProfile to aggregate.
     */
    where?: BabyProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BabyProfiles to fetch.
     */
    orderBy?: BabyProfileOrderByWithRelationInput | BabyProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BabyProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BabyProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BabyProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BabyProfiles
    **/
    _count?: true | BabyProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BabyProfileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BabyProfileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BabyProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BabyProfileMaxAggregateInputType
  }

  export type GetBabyProfileAggregateType<T extends BabyProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateBabyProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBabyProfile[P]>
      : GetScalarType<T[P], AggregateBabyProfile[P]>
  }




  export type BabyProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BabyProfileWhereInput
    orderBy?: BabyProfileOrderByWithAggregationInput | BabyProfileOrderByWithAggregationInput[]
    by: BabyProfileScalarFieldEnum[] | BabyProfileScalarFieldEnum
    having?: BabyProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BabyProfileCountAggregateInputType | true
    _avg?: BabyProfileAvgAggregateInputType
    _sum?: BabyProfileSumAggregateInputType
    _min?: BabyProfileMinAggregateInputType
    _max?: BabyProfileMaxAggregateInputType
  }

  export type BabyProfileGroupByOutputType = {
    id: string
    motherProfileId: string
    babyName: string | null
    sex: string
    dateOfBirth: Date
    gestationalAgeWeeks: Decimal
    birthWeightGrams: number
    weightAtDischargeGrams: number
    placeOfDelivery: string
    nicuStayDays: number
    skinToSkinAtBirth: boolean
    kmcInNicu: boolean
    feedingAtDischarge: string
    criedAtBirth: boolean
    neededResuscitation: boolean
    birthWeightStratum: string
    dischargeDate: Date
    createdAt: Date
    updatedAt: Date
    _count: BabyProfileCountAggregateOutputType | null
    _avg: BabyProfileAvgAggregateOutputType | null
    _sum: BabyProfileSumAggregateOutputType | null
    _min: BabyProfileMinAggregateOutputType | null
    _max: BabyProfileMaxAggregateOutputType | null
  }

  type GetBabyProfileGroupByPayload<T extends BabyProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BabyProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BabyProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BabyProfileGroupByOutputType[P]>
            : GetScalarType<T[P], BabyProfileGroupByOutputType[P]>
        }
      >
    >


  export type BabyProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    motherProfileId?: boolean
    babyName?: boolean
    sex?: boolean
    dateOfBirth?: boolean
    gestationalAgeWeeks?: boolean
    birthWeightGrams?: boolean
    weightAtDischargeGrams?: boolean
    placeOfDelivery?: boolean
    nicuStayDays?: boolean
    skinToSkinAtBirth?: boolean
    kmcInNicu?: boolean
    feedingAtDischarge?: boolean
    criedAtBirth?: boolean
    neededResuscitation?: boolean
    birthWeightStratum?: boolean
    dischargeDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    motherProfile?: boolean | MotherProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["babyProfile"]>

  export type BabyProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    motherProfileId?: boolean
    babyName?: boolean
    sex?: boolean
    dateOfBirth?: boolean
    gestationalAgeWeeks?: boolean
    birthWeightGrams?: boolean
    weightAtDischargeGrams?: boolean
    placeOfDelivery?: boolean
    nicuStayDays?: boolean
    skinToSkinAtBirth?: boolean
    kmcInNicu?: boolean
    feedingAtDischarge?: boolean
    criedAtBirth?: boolean
    neededResuscitation?: boolean
    birthWeightStratum?: boolean
    dischargeDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    motherProfile?: boolean | MotherProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["babyProfile"]>

  export type BabyProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    motherProfileId?: boolean
    babyName?: boolean
    sex?: boolean
    dateOfBirth?: boolean
    gestationalAgeWeeks?: boolean
    birthWeightGrams?: boolean
    weightAtDischargeGrams?: boolean
    placeOfDelivery?: boolean
    nicuStayDays?: boolean
    skinToSkinAtBirth?: boolean
    kmcInNicu?: boolean
    feedingAtDischarge?: boolean
    criedAtBirth?: boolean
    neededResuscitation?: boolean
    birthWeightStratum?: boolean
    dischargeDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    motherProfile?: boolean | MotherProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["babyProfile"]>

  export type BabyProfileSelectScalar = {
    id?: boolean
    motherProfileId?: boolean
    babyName?: boolean
    sex?: boolean
    dateOfBirth?: boolean
    gestationalAgeWeeks?: boolean
    birthWeightGrams?: boolean
    weightAtDischargeGrams?: boolean
    placeOfDelivery?: boolean
    nicuStayDays?: boolean
    skinToSkinAtBirth?: boolean
    kmcInNicu?: boolean
    feedingAtDischarge?: boolean
    criedAtBirth?: boolean
    neededResuscitation?: boolean
    birthWeightStratum?: boolean
    dischargeDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BabyProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "motherProfileId" | "babyName" | "sex" | "dateOfBirth" | "gestationalAgeWeeks" | "birthWeightGrams" | "weightAtDischargeGrams" | "placeOfDelivery" | "nicuStayDays" | "skinToSkinAtBirth" | "kmcInNicu" | "feedingAtDischarge" | "criedAtBirth" | "neededResuscitation" | "birthWeightStratum" | "dischargeDate" | "createdAt" | "updatedAt", ExtArgs["result"]["babyProfile"]>
  export type BabyProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    motherProfile?: boolean | MotherProfileDefaultArgs<ExtArgs>
  }
  export type BabyProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    motherProfile?: boolean | MotherProfileDefaultArgs<ExtArgs>
  }
  export type BabyProfileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    motherProfile?: boolean | MotherProfileDefaultArgs<ExtArgs>
  }

  export type $BabyProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BabyProfile"
    objects: {
      motherProfile: Prisma.$MotherProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      motherProfileId: string
      babyName: string | null
      sex: string
      dateOfBirth: Date
      gestationalAgeWeeks: Prisma.Decimal
      birthWeightGrams: number
      weightAtDischargeGrams: number
      placeOfDelivery: string
      nicuStayDays: number
      skinToSkinAtBirth: boolean
      kmcInNicu: boolean
      feedingAtDischarge: string
      criedAtBirth: boolean
      neededResuscitation: boolean
      birthWeightStratum: string
      dischargeDate: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["babyProfile"]>
    composites: {}
  }

  type BabyProfileGetPayload<S extends boolean | null | undefined | BabyProfileDefaultArgs> = $Result.GetResult<Prisma.$BabyProfilePayload, S>

  type BabyProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BabyProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BabyProfileCountAggregateInputType | true
    }

  export interface BabyProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BabyProfile'], meta: { name: 'BabyProfile' } }
    /**
     * Find zero or one BabyProfile that matches the filter.
     * @param {BabyProfileFindUniqueArgs} args - Arguments to find a BabyProfile
     * @example
     * // Get one BabyProfile
     * const babyProfile = await prisma.babyProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BabyProfileFindUniqueArgs>(args: SelectSubset<T, BabyProfileFindUniqueArgs<ExtArgs>>): Prisma__BabyProfileClient<$Result.GetResult<Prisma.$BabyProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BabyProfile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BabyProfileFindUniqueOrThrowArgs} args - Arguments to find a BabyProfile
     * @example
     * // Get one BabyProfile
     * const babyProfile = await prisma.babyProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BabyProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, BabyProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BabyProfileClient<$Result.GetResult<Prisma.$BabyProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BabyProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BabyProfileFindFirstArgs} args - Arguments to find a BabyProfile
     * @example
     * // Get one BabyProfile
     * const babyProfile = await prisma.babyProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BabyProfileFindFirstArgs>(args?: SelectSubset<T, BabyProfileFindFirstArgs<ExtArgs>>): Prisma__BabyProfileClient<$Result.GetResult<Prisma.$BabyProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BabyProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BabyProfileFindFirstOrThrowArgs} args - Arguments to find a BabyProfile
     * @example
     * // Get one BabyProfile
     * const babyProfile = await prisma.babyProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BabyProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, BabyProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__BabyProfileClient<$Result.GetResult<Prisma.$BabyProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BabyProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BabyProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BabyProfiles
     * const babyProfiles = await prisma.babyProfile.findMany()
     * 
     * // Get first 10 BabyProfiles
     * const babyProfiles = await prisma.babyProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const babyProfileWithIdOnly = await prisma.babyProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BabyProfileFindManyArgs>(args?: SelectSubset<T, BabyProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BabyProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BabyProfile.
     * @param {BabyProfileCreateArgs} args - Arguments to create a BabyProfile.
     * @example
     * // Create one BabyProfile
     * const BabyProfile = await prisma.babyProfile.create({
     *   data: {
     *     // ... data to create a BabyProfile
     *   }
     * })
     * 
     */
    create<T extends BabyProfileCreateArgs>(args: SelectSubset<T, BabyProfileCreateArgs<ExtArgs>>): Prisma__BabyProfileClient<$Result.GetResult<Prisma.$BabyProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BabyProfiles.
     * @param {BabyProfileCreateManyArgs} args - Arguments to create many BabyProfiles.
     * @example
     * // Create many BabyProfiles
     * const babyProfile = await prisma.babyProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BabyProfileCreateManyArgs>(args?: SelectSubset<T, BabyProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BabyProfiles and returns the data saved in the database.
     * @param {BabyProfileCreateManyAndReturnArgs} args - Arguments to create many BabyProfiles.
     * @example
     * // Create many BabyProfiles
     * const babyProfile = await prisma.babyProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BabyProfiles and only return the `id`
     * const babyProfileWithIdOnly = await prisma.babyProfile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BabyProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, BabyProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BabyProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BabyProfile.
     * @param {BabyProfileDeleteArgs} args - Arguments to delete one BabyProfile.
     * @example
     * // Delete one BabyProfile
     * const BabyProfile = await prisma.babyProfile.delete({
     *   where: {
     *     // ... filter to delete one BabyProfile
     *   }
     * })
     * 
     */
    delete<T extends BabyProfileDeleteArgs>(args: SelectSubset<T, BabyProfileDeleteArgs<ExtArgs>>): Prisma__BabyProfileClient<$Result.GetResult<Prisma.$BabyProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BabyProfile.
     * @param {BabyProfileUpdateArgs} args - Arguments to update one BabyProfile.
     * @example
     * // Update one BabyProfile
     * const babyProfile = await prisma.babyProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BabyProfileUpdateArgs>(args: SelectSubset<T, BabyProfileUpdateArgs<ExtArgs>>): Prisma__BabyProfileClient<$Result.GetResult<Prisma.$BabyProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BabyProfiles.
     * @param {BabyProfileDeleteManyArgs} args - Arguments to filter BabyProfiles to delete.
     * @example
     * // Delete a few BabyProfiles
     * const { count } = await prisma.babyProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BabyProfileDeleteManyArgs>(args?: SelectSubset<T, BabyProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BabyProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BabyProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BabyProfiles
     * const babyProfile = await prisma.babyProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BabyProfileUpdateManyArgs>(args: SelectSubset<T, BabyProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BabyProfiles and returns the data updated in the database.
     * @param {BabyProfileUpdateManyAndReturnArgs} args - Arguments to update many BabyProfiles.
     * @example
     * // Update many BabyProfiles
     * const babyProfile = await prisma.babyProfile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BabyProfiles and only return the `id`
     * const babyProfileWithIdOnly = await prisma.babyProfile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BabyProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, BabyProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BabyProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BabyProfile.
     * @param {BabyProfileUpsertArgs} args - Arguments to update or create a BabyProfile.
     * @example
     * // Update or create a BabyProfile
     * const babyProfile = await prisma.babyProfile.upsert({
     *   create: {
     *     // ... data to create a BabyProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BabyProfile we want to update
     *   }
     * })
     */
    upsert<T extends BabyProfileUpsertArgs>(args: SelectSubset<T, BabyProfileUpsertArgs<ExtArgs>>): Prisma__BabyProfileClient<$Result.GetResult<Prisma.$BabyProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BabyProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BabyProfileCountArgs} args - Arguments to filter BabyProfiles to count.
     * @example
     * // Count the number of BabyProfiles
     * const count = await prisma.babyProfile.count({
     *   where: {
     *     // ... the filter for the BabyProfiles we want to count
     *   }
     * })
    **/
    count<T extends BabyProfileCountArgs>(
      args?: Subset<T, BabyProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BabyProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BabyProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BabyProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BabyProfileAggregateArgs>(args: Subset<T, BabyProfileAggregateArgs>): Prisma.PrismaPromise<GetBabyProfileAggregateType<T>>

    /**
     * Group by BabyProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BabyProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BabyProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BabyProfileGroupByArgs['orderBy'] }
        : { orderBy?: BabyProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BabyProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBabyProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BabyProfile model
   */
  readonly fields: BabyProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BabyProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BabyProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    motherProfile<T extends MotherProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MotherProfileDefaultArgs<ExtArgs>>): Prisma__MotherProfileClient<$Result.GetResult<Prisma.$MotherProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BabyProfile model
   */
  interface BabyProfileFieldRefs {
    readonly id: FieldRef<"BabyProfile", 'String'>
    readonly motherProfileId: FieldRef<"BabyProfile", 'String'>
    readonly babyName: FieldRef<"BabyProfile", 'String'>
    readonly sex: FieldRef<"BabyProfile", 'String'>
    readonly dateOfBirth: FieldRef<"BabyProfile", 'DateTime'>
    readonly gestationalAgeWeeks: FieldRef<"BabyProfile", 'Decimal'>
    readonly birthWeightGrams: FieldRef<"BabyProfile", 'Int'>
    readonly weightAtDischargeGrams: FieldRef<"BabyProfile", 'Int'>
    readonly placeOfDelivery: FieldRef<"BabyProfile", 'String'>
    readonly nicuStayDays: FieldRef<"BabyProfile", 'Int'>
    readonly skinToSkinAtBirth: FieldRef<"BabyProfile", 'Boolean'>
    readonly kmcInNicu: FieldRef<"BabyProfile", 'Boolean'>
    readonly feedingAtDischarge: FieldRef<"BabyProfile", 'String'>
    readonly criedAtBirth: FieldRef<"BabyProfile", 'Boolean'>
    readonly neededResuscitation: FieldRef<"BabyProfile", 'Boolean'>
    readonly birthWeightStratum: FieldRef<"BabyProfile", 'String'>
    readonly dischargeDate: FieldRef<"BabyProfile", 'DateTime'>
    readonly createdAt: FieldRef<"BabyProfile", 'DateTime'>
    readonly updatedAt: FieldRef<"BabyProfile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BabyProfile findUnique
   */
  export type BabyProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BabyProfile
     */
    select?: BabyProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BabyProfile
     */
    omit?: BabyProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BabyProfileInclude<ExtArgs> | null
    /**
     * Filter, which BabyProfile to fetch.
     */
    where: BabyProfileWhereUniqueInput
  }

  /**
   * BabyProfile findUniqueOrThrow
   */
  export type BabyProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BabyProfile
     */
    select?: BabyProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BabyProfile
     */
    omit?: BabyProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BabyProfileInclude<ExtArgs> | null
    /**
     * Filter, which BabyProfile to fetch.
     */
    where: BabyProfileWhereUniqueInput
  }

  /**
   * BabyProfile findFirst
   */
  export type BabyProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BabyProfile
     */
    select?: BabyProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BabyProfile
     */
    omit?: BabyProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BabyProfileInclude<ExtArgs> | null
    /**
     * Filter, which BabyProfile to fetch.
     */
    where?: BabyProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BabyProfiles to fetch.
     */
    orderBy?: BabyProfileOrderByWithRelationInput | BabyProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BabyProfiles.
     */
    cursor?: BabyProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BabyProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BabyProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BabyProfiles.
     */
    distinct?: BabyProfileScalarFieldEnum | BabyProfileScalarFieldEnum[]
  }

  /**
   * BabyProfile findFirstOrThrow
   */
  export type BabyProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BabyProfile
     */
    select?: BabyProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BabyProfile
     */
    omit?: BabyProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BabyProfileInclude<ExtArgs> | null
    /**
     * Filter, which BabyProfile to fetch.
     */
    where?: BabyProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BabyProfiles to fetch.
     */
    orderBy?: BabyProfileOrderByWithRelationInput | BabyProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BabyProfiles.
     */
    cursor?: BabyProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BabyProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BabyProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BabyProfiles.
     */
    distinct?: BabyProfileScalarFieldEnum | BabyProfileScalarFieldEnum[]
  }

  /**
   * BabyProfile findMany
   */
  export type BabyProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BabyProfile
     */
    select?: BabyProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BabyProfile
     */
    omit?: BabyProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BabyProfileInclude<ExtArgs> | null
    /**
     * Filter, which BabyProfiles to fetch.
     */
    where?: BabyProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BabyProfiles to fetch.
     */
    orderBy?: BabyProfileOrderByWithRelationInput | BabyProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BabyProfiles.
     */
    cursor?: BabyProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BabyProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BabyProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BabyProfiles.
     */
    distinct?: BabyProfileScalarFieldEnum | BabyProfileScalarFieldEnum[]
  }

  /**
   * BabyProfile create
   */
  export type BabyProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BabyProfile
     */
    select?: BabyProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BabyProfile
     */
    omit?: BabyProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BabyProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a BabyProfile.
     */
    data: XOR<BabyProfileCreateInput, BabyProfileUncheckedCreateInput>
  }

  /**
   * BabyProfile createMany
   */
  export type BabyProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BabyProfiles.
     */
    data: BabyProfileCreateManyInput | BabyProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BabyProfile createManyAndReturn
   */
  export type BabyProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BabyProfile
     */
    select?: BabyProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BabyProfile
     */
    omit?: BabyProfileOmit<ExtArgs> | null
    /**
     * The data used to create many BabyProfiles.
     */
    data: BabyProfileCreateManyInput | BabyProfileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BabyProfileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BabyProfile update
   */
  export type BabyProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BabyProfile
     */
    select?: BabyProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BabyProfile
     */
    omit?: BabyProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BabyProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a BabyProfile.
     */
    data: XOR<BabyProfileUpdateInput, BabyProfileUncheckedUpdateInput>
    /**
     * Choose, which BabyProfile to update.
     */
    where: BabyProfileWhereUniqueInput
  }

  /**
   * BabyProfile updateMany
   */
  export type BabyProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BabyProfiles.
     */
    data: XOR<BabyProfileUpdateManyMutationInput, BabyProfileUncheckedUpdateManyInput>
    /**
     * Filter which BabyProfiles to update
     */
    where?: BabyProfileWhereInput
    /**
     * Limit how many BabyProfiles to update.
     */
    limit?: number
  }

  /**
   * BabyProfile updateManyAndReturn
   */
  export type BabyProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BabyProfile
     */
    select?: BabyProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BabyProfile
     */
    omit?: BabyProfileOmit<ExtArgs> | null
    /**
     * The data used to update BabyProfiles.
     */
    data: XOR<BabyProfileUpdateManyMutationInput, BabyProfileUncheckedUpdateManyInput>
    /**
     * Filter which BabyProfiles to update
     */
    where?: BabyProfileWhereInput
    /**
     * Limit how many BabyProfiles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BabyProfileIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * BabyProfile upsert
   */
  export type BabyProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BabyProfile
     */
    select?: BabyProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BabyProfile
     */
    omit?: BabyProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BabyProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the BabyProfile to update in case it exists.
     */
    where: BabyProfileWhereUniqueInput
    /**
     * In case the BabyProfile found by the `where` argument doesn't exist, create a new BabyProfile with this data.
     */
    create: XOR<BabyProfileCreateInput, BabyProfileUncheckedCreateInput>
    /**
     * In case the BabyProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BabyProfileUpdateInput, BabyProfileUncheckedUpdateInput>
  }

  /**
   * BabyProfile delete
   */
  export type BabyProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BabyProfile
     */
    select?: BabyProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BabyProfile
     */
    omit?: BabyProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BabyProfileInclude<ExtArgs> | null
    /**
     * Filter which BabyProfile to delete.
     */
    where: BabyProfileWhereUniqueInput
  }

  /**
   * BabyProfile deleteMany
   */
  export type BabyProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BabyProfiles to delete
     */
    where?: BabyProfileWhereInput
    /**
     * Limit how many BabyProfiles to delete.
     */
    limit?: number
  }

  /**
   * BabyProfile without action
   */
  export type BabyProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BabyProfile
     */
    select?: BabyProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BabyProfile
     */
    omit?: BabyProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BabyProfileInclude<ExtArgs> | null
  }


  /**
   * Model NurseProfile
   */

  export type AggregateNurseProfile = {
    _count: NurseProfileCountAggregateOutputType | null
    _min: NurseProfileMinAggregateOutputType | null
    _max: NurseProfileMaxAggregateOutputType | null
  }

  export type NurseProfileMinAggregateOutputType = {
    id: string | null
    userId: string | null
    hospitalId: string | null
    fullName: string | null
    employeeId: string | null
    isActive: boolean | null
    createdAt: Date | null
  }

  export type NurseProfileMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    hospitalId: string | null
    fullName: string | null
    employeeId: string | null
    isActive: boolean | null
    createdAt: Date | null
  }

  export type NurseProfileCountAggregateOutputType = {
    id: number
    userId: number
    hospitalId: number
    fullName: number
    employeeId: number
    isActive: number
    createdAt: number
    _all: number
  }


  export type NurseProfileMinAggregateInputType = {
    id?: true
    userId?: true
    hospitalId?: true
    fullName?: true
    employeeId?: true
    isActive?: true
    createdAt?: true
  }

  export type NurseProfileMaxAggregateInputType = {
    id?: true
    userId?: true
    hospitalId?: true
    fullName?: true
    employeeId?: true
    isActive?: true
    createdAt?: true
  }

  export type NurseProfileCountAggregateInputType = {
    id?: true
    userId?: true
    hospitalId?: true
    fullName?: true
    employeeId?: true
    isActive?: true
    createdAt?: true
    _all?: true
  }

  export type NurseProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NurseProfile to aggregate.
     */
    where?: NurseProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NurseProfiles to fetch.
     */
    orderBy?: NurseProfileOrderByWithRelationInput | NurseProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NurseProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NurseProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NurseProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NurseProfiles
    **/
    _count?: true | NurseProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NurseProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NurseProfileMaxAggregateInputType
  }

  export type GetNurseProfileAggregateType<T extends NurseProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateNurseProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNurseProfile[P]>
      : GetScalarType<T[P], AggregateNurseProfile[P]>
  }




  export type NurseProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NurseProfileWhereInput
    orderBy?: NurseProfileOrderByWithAggregationInput | NurseProfileOrderByWithAggregationInput[]
    by: NurseProfileScalarFieldEnum[] | NurseProfileScalarFieldEnum
    having?: NurseProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NurseProfileCountAggregateInputType | true
    _min?: NurseProfileMinAggregateInputType
    _max?: NurseProfileMaxAggregateInputType
  }

  export type NurseProfileGroupByOutputType = {
    id: string
    userId: string
    hospitalId: string
    fullName: string
    employeeId: string | null
    isActive: boolean
    createdAt: Date
    _count: NurseProfileCountAggregateOutputType | null
    _min: NurseProfileMinAggregateOutputType | null
    _max: NurseProfileMaxAggregateOutputType | null
  }

  type GetNurseProfileGroupByPayload<T extends NurseProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NurseProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NurseProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NurseProfileGroupByOutputType[P]>
            : GetScalarType<T[P], NurseProfileGroupByOutputType[P]>
        }
      >
    >


  export type NurseProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    hospitalId?: boolean
    fullName?: boolean
    employeeId?: boolean
    isActive?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    hospital?: boolean | HospitalDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["nurseProfile"]>

  export type NurseProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    hospitalId?: boolean
    fullName?: boolean
    employeeId?: boolean
    isActive?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    hospital?: boolean | HospitalDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["nurseProfile"]>

  export type NurseProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    hospitalId?: boolean
    fullName?: boolean
    employeeId?: boolean
    isActive?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    hospital?: boolean | HospitalDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["nurseProfile"]>

  export type NurseProfileSelectScalar = {
    id?: boolean
    userId?: boolean
    hospitalId?: boolean
    fullName?: boolean
    employeeId?: boolean
    isActive?: boolean
    createdAt?: boolean
  }

  export type NurseProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "hospitalId" | "fullName" | "employeeId" | "isActive" | "createdAt", ExtArgs["result"]["nurseProfile"]>
  export type NurseProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    hospital?: boolean | HospitalDefaultArgs<ExtArgs>
  }
  export type NurseProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    hospital?: boolean | HospitalDefaultArgs<ExtArgs>
  }
  export type NurseProfileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    hospital?: boolean | HospitalDefaultArgs<ExtArgs>
  }

  export type $NurseProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NurseProfile"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      hospital: Prisma.$HospitalPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      hospitalId: string
      fullName: string
      employeeId: string | null
      isActive: boolean
      createdAt: Date
    }, ExtArgs["result"]["nurseProfile"]>
    composites: {}
  }

  type NurseProfileGetPayload<S extends boolean | null | undefined | NurseProfileDefaultArgs> = $Result.GetResult<Prisma.$NurseProfilePayload, S>

  type NurseProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NurseProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NurseProfileCountAggregateInputType | true
    }

  export interface NurseProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NurseProfile'], meta: { name: 'NurseProfile' } }
    /**
     * Find zero or one NurseProfile that matches the filter.
     * @param {NurseProfileFindUniqueArgs} args - Arguments to find a NurseProfile
     * @example
     * // Get one NurseProfile
     * const nurseProfile = await prisma.nurseProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NurseProfileFindUniqueArgs>(args: SelectSubset<T, NurseProfileFindUniqueArgs<ExtArgs>>): Prisma__NurseProfileClient<$Result.GetResult<Prisma.$NurseProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one NurseProfile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NurseProfileFindUniqueOrThrowArgs} args - Arguments to find a NurseProfile
     * @example
     * // Get one NurseProfile
     * const nurseProfile = await prisma.nurseProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NurseProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, NurseProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NurseProfileClient<$Result.GetResult<Prisma.$NurseProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NurseProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NurseProfileFindFirstArgs} args - Arguments to find a NurseProfile
     * @example
     * // Get one NurseProfile
     * const nurseProfile = await prisma.nurseProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NurseProfileFindFirstArgs>(args?: SelectSubset<T, NurseProfileFindFirstArgs<ExtArgs>>): Prisma__NurseProfileClient<$Result.GetResult<Prisma.$NurseProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NurseProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NurseProfileFindFirstOrThrowArgs} args - Arguments to find a NurseProfile
     * @example
     * // Get one NurseProfile
     * const nurseProfile = await prisma.nurseProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NurseProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, NurseProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__NurseProfileClient<$Result.GetResult<Prisma.$NurseProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more NurseProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NurseProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NurseProfiles
     * const nurseProfiles = await prisma.nurseProfile.findMany()
     * 
     * // Get first 10 NurseProfiles
     * const nurseProfiles = await prisma.nurseProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const nurseProfileWithIdOnly = await prisma.nurseProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NurseProfileFindManyArgs>(args?: SelectSubset<T, NurseProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NurseProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a NurseProfile.
     * @param {NurseProfileCreateArgs} args - Arguments to create a NurseProfile.
     * @example
     * // Create one NurseProfile
     * const NurseProfile = await prisma.nurseProfile.create({
     *   data: {
     *     // ... data to create a NurseProfile
     *   }
     * })
     * 
     */
    create<T extends NurseProfileCreateArgs>(args: SelectSubset<T, NurseProfileCreateArgs<ExtArgs>>): Prisma__NurseProfileClient<$Result.GetResult<Prisma.$NurseProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many NurseProfiles.
     * @param {NurseProfileCreateManyArgs} args - Arguments to create many NurseProfiles.
     * @example
     * // Create many NurseProfiles
     * const nurseProfile = await prisma.nurseProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NurseProfileCreateManyArgs>(args?: SelectSubset<T, NurseProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NurseProfiles and returns the data saved in the database.
     * @param {NurseProfileCreateManyAndReturnArgs} args - Arguments to create many NurseProfiles.
     * @example
     * // Create many NurseProfiles
     * const nurseProfile = await prisma.nurseProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NurseProfiles and only return the `id`
     * const nurseProfileWithIdOnly = await prisma.nurseProfile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NurseProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, NurseProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NurseProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a NurseProfile.
     * @param {NurseProfileDeleteArgs} args - Arguments to delete one NurseProfile.
     * @example
     * // Delete one NurseProfile
     * const NurseProfile = await prisma.nurseProfile.delete({
     *   where: {
     *     // ... filter to delete one NurseProfile
     *   }
     * })
     * 
     */
    delete<T extends NurseProfileDeleteArgs>(args: SelectSubset<T, NurseProfileDeleteArgs<ExtArgs>>): Prisma__NurseProfileClient<$Result.GetResult<Prisma.$NurseProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one NurseProfile.
     * @param {NurseProfileUpdateArgs} args - Arguments to update one NurseProfile.
     * @example
     * // Update one NurseProfile
     * const nurseProfile = await prisma.nurseProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NurseProfileUpdateArgs>(args: SelectSubset<T, NurseProfileUpdateArgs<ExtArgs>>): Prisma__NurseProfileClient<$Result.GetResult<Prisma.$NurseProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more NurseProfiles.
     * @param {NurseProfileDeleteManyArgs} args - Arguments to filter NurseProfiles to delete.
     * @example
     * // Delete a few NurseProfiles
     * const { count } = await prisma.nurseProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NurseProfileDeleteManyArgs>(args?: SelectSubset<T, NurseProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NurseProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NurseProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NurseProfiles
     * const nurseProfile = await prisma.nurseProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NurseProfileUpdateManyArgs>(args: SelectSubset<T, NurseProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NurseProfiles and returns the data updated in the database.
     * @param {NurseProfileUpdateManyAndReturnArgs} args - Arguments to update many NurseProfiles.
     * @example
     * // Update many NurseProfiles
     * const nurseProfile = await prisma.nurseProfile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more NurseProfiles and only return the `id`
     * const nurseProfileWithIdOnly = await prisma.nurseProfile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NurseProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, NurseProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NurseProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one NurseProfile.
     * @param {NurseProfileUpsertArgs} args - Arguments to update or create a NurseProfile.
     * @example
     * // Update or create a NurseProfile
     * const nurseProfile = await prisma.nurseProfile.upsert({
     *   create: {
     *     // ... data to create a NurseProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NurseProfile we want to update
     *   }
     * })
     */
    upsert<T extends NurseProfileUpsertArgs>(args: SelectSubset<T, NurseProfileUpsertArgs<ExtArgs>>): Prisma__NurseProfileClient<$Result.GetResult<Prisma.$NurseProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of NurseProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NurseProfileCountArgs} args - Arguments to filter NurseProfiles to count.
     * @example
     * // Count the number of NurseProfiles
     * const count = await prisma.nurseProfile.count({
     *   where: {
     *     // ... the filter for the NurseProfiles we want to count
     *   }
     * })
    **/
    count<T extends NurseProfileCountArgs>(
      args?: Subset<T, NurseProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NurseProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NurseProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NurseProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NurseProfileAggregateArgs>(args: Subset<T, NurseProfileAggregateArgs>): Prisma.PrismaPromise<GetNurseProfileAggregateType<T>>

    /**
     * Group by NurseProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NurseProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NurseProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NurseProfileGroupByArgs['orderBy'] }
        : { orderBy?: NurseProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NurseProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNurseProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NurseProfile model
   */
  readonly fields: NurseProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NurseProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NurseProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    hospital<T extends HospitalDefaultArgs<ExtArgs> = {}>(args?: Subset<T, HospitalDefaultArgs<ExtArgs>>): Prisma__HospitalClient<$Result.GetResult<Prisma.$HospitalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the NurseProfile model
   */
  interface NurseProfileFieldRefs {
    readonly id: FieldRef<"NurseProfile", 'String'>
    readonly userId: FieldRef<"NurseProfile", 'String'>
    readonly hospitalId: FieldRef<"NurseProfile", 'String'>
    readonly fullName: FieldRef<"NurseProfile", 'String'>
    readonly employeeId: FieldRef<"NurseProfile", 'String'>
    readonly isActive: FieldRef<"NurseProfile", 'Boolean'>
    readonly createdAt: FieldRef<"NurseProfile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * NurseProfile findUnique
   */
  export type NurseProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NurseProfile
     */
    select?: NurseProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NurseProfile
     */
    omit?: NurseProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NurseProfileInclude<ExtArgs> | null
    /**
     * Filter, which NurseProfile to fetch.
     */
    where: NurseProfileWhereUniqueInput
  }

  /**
   * NurseProfile findUniqueOrThrow
   */
  export type NurseProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NurseProfile
     */
    select?: NurseProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NurseProfile
     */
    omit?: NurseProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NurseProfileInclude<ExtArgs> | null
    /**
     * Filter, which NurseProfile to fetch.
     */
    where: NurseProfileWhereUniqueInput
  }

  /**
   * NurseProfile findFirst
   */
  export type NurseProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NurseProfile
     */
    select?: NurseProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NurseProfile
     */
    omit?: NurseProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NurseProfileInclude<ExtArgs> | null
    /**
     * Filter, which NurseProfile to fetch.
     */
    where?: NurseProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NurseProfiles to fetch.
     */
    orderBy?: NurseProfileOrderByWithRelationInput | NurseProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NurseProfiles.
     */
    cursor?: NurseProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NurseProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NurseProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NurseProfiles.
     */
    distinct?: NurseProfileScalarFieldEnum | NurseProfileScalarFieldEnum[]
  }

  /**
   * NurseProfile findFirstOrThrow
   */
  export type NurseProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NurseProfile
     */
    select?: NurseProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NurseProfile
     */
    omit?: NurseProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NurseProfileInclude<ExtArgs> | null
    /**
     * Filter, which NurseProfile to fetch.
     */
    where?: NurseProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NurseProfiles to fetch.
     */
    orderBy?: NurseProfileOrderByWithRelationInput | NurseProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NurseProfiles.
     */
    cursor?: NurseProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NurseProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NurseProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NurseProfiles.
     */
    distinct?: NurseProfileScalarFieldEnum | NurseProfileScalarFieldEnum[]
  }

  /**
   * NurseProfile findMany
   */
  export type NurseProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NurseProfile
     */
    select?: NurseProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NurseProfile
     */
    omit?: NurseProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NurseProfileInclude<ExtArgs> | null
    /**
     * Filter, which NurseProfiles to fetch.
     */
    where?: NurseProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NurseProfiles to fetch.
     */
    orderBy?: NurseProfileOrderByWithRelationInput | NurseProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NurseProfiles.
     */
    cursor?: NurseProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NurseProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NurseProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NurseProfiles.
     */
    distinct?: NurseProfileScalarFieldEnum | NurseProfileScalarFieldEnum[]
  }

  /**
   * NurseProfile create
   */
  export type NurseProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NurseProfile
     */
    select?: NurseProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NurseProfile
     */
    omit?: NurseProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NurseProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a NurseProfile.
     */
    data: XOR<NurseProfileCreateInput, NurseProfileUncheckedCreateInput>
  }

  /**
   * NurseProfile createMany
   */
  export type NurseProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NurseProfiles.
     */
    data: NurseProfileCreateManyInput | NurseProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NurseProfile createManyAndReturn
   */
  export type NurseProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NurseProfile
     */
    select?: NurseProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NurseProfile
     */
    omit?: NurseProfileOmit<ExtArgs> | null
    /**
     * The data used to create many NurseProfiles.
     */
    data: NurseProfileCreateManyInput | NurseProfileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NurseProfileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * NurseProfile update
   */
  export type NurseProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NurseProfile
     */
    select?: NurseProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NurseProfile
     */
    omit?: NurseProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NurseProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a NurseProfile.
     */
    data: XOR<NurseProfileUpdateInput, NurseProfileUncheckedUpdateInput>
    /**
     * Choose, which NurseProfile to update.
     */
    where: NurseProfileWhereUniqueInput
  }

  /**
   * NurseProfile updateMany
   */
  export type NurseProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NurseProfiles.
     */
    data: XOR<NurseProfileUpdateManyMutationInput, NurseProfileUncheckedUpdateManyInput>
    /**
     * Filter which NurseProfiles to update
     */
    where?: NurseProfileWhereInput
    /**
     * Limit how many NurseProfiles to update.
     */
    limit?: number
  }

  /**
   * NurseProfile updateManyAndReturn
   */
  export type NurseProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NurseProfile
     */
    select?: NurseProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NurseProfile
     */
    omit?: NurseProfileOmit<ExtArgs> | null
    /**
     * The data used to update NurseProfiles.
     */
    data: XOR<NurseProfileUpdateManyMutationInput, NurseProfileUncheckedUpdateManyInput>
    /**
     * Filter which NurseProfiles to update
     */
    where?: NurseProfileWhereInput
    /**
     * Limit how many NurseProfiles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NurseProfileIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * NurseProfile upsert
   */
  export type NurseProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NurseProfile
     */
    select?: NurseProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NurseProfile
     */
    omit?: NurseProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NurseProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the NurseProfile to update in case it exists.
     */
    where: NurseProfileWhereUniqueInput
    /**
     * In case the NurseProfile found by the `where` argument doesn't exist, create a new NurseProfile with this data.
     */
    create: XOR<NurseProfileCreateInput, NurseProfileUncheckedCreateInput>
    /**
     * In case the NurseProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NurseProfileUpdateInput, NurseProfileUncheckedUpdateInput>
  }

  /**
   * NurseProfile delete
   */
  export type NurseProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NurseProfile
     */
    select?: NurseProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NurseProfile
     */
    omit?: NurseProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NurseProfileInclude<ExtArgs> | null
    /**
     * Filter which NurseProfile to delete.
     */
    where: NurseProfileWhereUniqueInput
  }

  /**
   * NurseProfile deleteMany
   */
  export type NurseProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NurseProfiles to delete
     */
    where?: NurseProfileWhereInput
    /**
     * Limit how many NurseProfiles to delete.
     */
    limit?: number
  }

  /**
   * NurseProfile without action
   */
  export type NurseProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NurseProfile
     */
    select?: NurseProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NurseProfile
     */
    omit?: NurseProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NurseProfileInclude<ExtArgs> | null
  }


  /**
   * Model ResearcherProfile
   */

  export type AggregateResearcherProfile = {
    _count: ResearcherProfileCountAggregateOutputType | null
    _min: ResearcherProfileMinAggregateOutputType | null
    _max: ResearcherProfileMaxAggregateOutputType | null
  }

  export type ResearcherProfileMinAggregateOutputType = {
    id: string | null
    userId: string | null
    fullName: string | null
    designation: string | null
    email: string | null
    accessLevel: string | null
    createdAt: Date | null
  }

  export type ResearcherProfileMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    fullName: string | null
    designation: string | null
    email: string | null
    accessLevel: string | null
    createdAt: Date | null
  }

  export type ResearcherProfileCountAggregateOutputType = {
    id: number
    userId: number
    fullName: number
    designation: number
    email: number
    accessLevel: number
    createdAt: number
    _all: number
  }


  export type ResearcherProfileMinAggregateInputType = {
    id?: true
    userId?: true
    fullName?: true
    designation?: true
    email?: true
    accessLevel?: true
    createdAt?: true
  }

  export type ResearcherProfileMaxAggregateInputType = {
    id?: true
    userId?: true
    fullName?: true
    designation?: true
    email?: true
    accessLevel?: true
    createdAt?: true
  }

  export type ResearcherProfileCountAggregateInputType = {
    id?: true
    userId?: true
    fullName?: true
    designation?: true
    email?: true
    accessLevel?: true
    createdAt?: true
    _all?: true
  }

  export type ResearcherProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ResearcherProfile to aggregate.
     */
    where?: ResearcherProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ResearcherProfiles to fetch.
     */
    orderBy?: ResearcherProfileOrderByWithRelationInput | ResearcherProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ResearcherProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ResearcherProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ResearcherProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ResearcherProfiles
    **/
    _count?: true | ResearcherProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ResearcherProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ResearcherProfileMaxAggregateInputType
  }

  export type GetResearcherProfileAggregateType<T extends ResearcherProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateResearcherProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateResearcherProfile[P]>
      : GetScalarType<T[P], AggregateResearcherProfile[P]>
  }




  export type ResearcherProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ResearcherProfileWhereInput
    orderBy?: ResearcherProfileOrderByWithAggregationInput | ResearcherProfileOrderByWithAggregationInput[]
    by: ResearcherProfileScalarFieldEnum[] | ResearcherProfileScalarFieldEnum
    having?: ResearcherProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ResearcherProfileCountAggregateInputType | true
    _min?: ResearcherProfileMinAggregateInputType
    _max?: ResearcherProfileMaxAggregateInputType
  }

  export type ResearcherProfileGroupByOutputType = {
    id: string
    userId: string
    fullName: string
    designation: string | null
    email: string
    accessLevel: string
    createdAt: Date
    _count: ResearcherProfileCountAggregateOutputType | null
    _min: ResearcherProfileMinAggregateOutputType | null
    _max: ResearcherProfileMaxAggregateOutputType | null
  }

  type GetResearcherProfileGroupByPayload<T extends ResearcherProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ResearcherProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ResearcherProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ResearcherProfileGroupByOutputType[P]>
            : GetScalarType<T[P], ResearcherProfileGroupByOutputType[P]>
        }
      >
    >


  export type ResearcherProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    fullName?: boolean
    designation?: boolean
    email?: boolean
    accessLevel?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["researcherProfile"]>

  export type ResearcherProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    fullName?: boolean
    designation?: boolean
    email?: boolean
    accessLevel?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["researcherProfile"]>

  export type ResearcherProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    fullName?: boolean
    designation?: boolean
    email?: boolean
    accessLevel?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["researcherProfile"]>

  export type ResearcherProfileSelectScalar = {
    id?: boolean
    userId?: boolean
    fullName?: boolean
    designation?: boolean
    email?: boolean
    accessLevel?: boolean
    createdAt?: boolean
  }

  export type ResearcherProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "fullName" | "designation" | "email" | "accessLevel" | "createdAt", ExtArgs["result"]["researcherProfile"]>
  export type ResearcherProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ResearcherProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ResearcherProfileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ResearcherProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ResearcherProfile"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      fullName: string
      designation: string | null
      email: string
      accessLevel: string
      createdAt: Date
    }, ExtArgs["result"]["researcherProfile"]>
    composites: {}
  }

  type ResearcherProfileGetPayload<S extends boolean | null | undefined | ResearcherProfileDefaultArgs> = $Result.GetResult<Prisma.$ResearcherProfilePayload, S>

  type ResearcherProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ResearcherProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ResearcherProfileCountAggregateInputType | true
    }

  export interface ResearcherProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ResearcherProfile'], meta: { name: 'ResearcherProfile' } }
    /**
     * Find zero or one ResearcherProfile that matches the filter.
     * @param {ResearcherProfileFindUniqueArgs} args - Arguments to find a ResearcherProfile
     * @example
     * // Get one ResearcherProfile
     * const researcherProfile = await prisma.researcherProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ResearcherProfileFindUniqueArgs>(args: SelectSubset<T, ResearcherProfileFindUniqueArgs<ExtArgs>>): Prisma__ResearcherProfileClient<$Result.GetResult<Prisma.$ResearcherProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ResearcherProfile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ResearcherProfileFindUniqueOrThrowArgs} args - Arguments to find a ResearcherProfile
     * @example
     * // Get one ResearcherProfile
     * const researcherProfile = await prisma.researcherProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ResearcherProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, ResearcherProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ResearcherProfileClient<$Result.GetResult<Prisma.$ResearcherProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ResearcherProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResearcherProfileFindFirstArgs} args - Arguments to find a ResearcherProfile
     * @example
     * // Get one ResearcherProfile
     * const researcherProfile = await prisma.researcherProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ResearcherProfileFindFirstArgs>(args?: SelectSubset<T, ResearcherProfileFindFirstArgs<ExtArgs>>): Prisma__ResearcherProfileClient<$Result.GetResult<Prisma.$ResearcherProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ResearcherProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResearcherProfileFindFirstOrThrowArgs} args - Arguments to find a ResearcherProfile
     * @example
     * // Get one ResearcherProfile
     * const researcherProfile = await prisma.researcherProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ResearcherProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, ResearcherProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__ResearcherProfileClient<$Result.GetResult<Prisma.$ResearcherProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ResearcherProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResearcherProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ResearcherProfiles
     * const researcherProfiles = await prisma.researcherProfile.findMany()
     * 
     * // Get first 10 ResearcherProfiles
     * const researcherProfiles = await prisma.researcherProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const researcherProfileWithIdOnly = await prisma.researcherProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ResearcherProfileFindManyArgs>(args?: SelectSubset<T, ResearcherProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResearcherProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ResearcherProfile.
     * @param {ResearcherProfileCreateArgs} args - Arguments to create a ResearcherProfile.
     * @example
     * // Create one ResearcherProfile
     * const ResearcherProfile = await prisma.researcherProfile.create({
     *   data: {
     *     // ... data to create a ResearcherProfile
     *   }
     * })
     * 
     */
    create<T extends ResearcherProfileCreateArgs>(args: SelectSubset<T, ResearcherProfileCreateArgs<ExtArgs>>): Prisma__ResearcherProfileClient<$Result.GetResult<Prisma.$ResearcherProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ResearcherProfiles.
     * @param {ResearcherProfileCreateManyArgs} args - Arguments to create many ResearcherProfiles.
     * @example
     * // Create many ResearcherProfiles
     * const researcherProfile = await prisma.researcherProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ResearcherProfileCreateManyArgs>(args?: SelectSubset<T, ResearcherProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ResearcherProfiles and returns the data saved in the database.
     * @param {ResearcherProfileCreateManyAndReturnArgs} args - Arguments to create many ResearcherProfiles.
     * @example
     * // Create many ResearcherProfiles
     * const researcherProfile = await prisma.researcherProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ResearcherProfiles and only return the `id`
     * const researcherProfileWithIdOnly = await prisma.researcherProfile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ResearcherProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, ResearcherProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResearcherProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ResearcherProfile.
     * @param {ResearcherProfileDeleteArgs} args - Arguments to delete one ResearcherProfile.
     * @example
     * // Delete one ResearcherProfile
     * const ResearcherProfile = await prisma.researcherProfile.delete({
     *   where: {
     *     // ... filter to delete one ResearcherProfile
     *   }
     * })
     * 
     */
    delete<T extends ResearcherProfileDeleteArgs>(args: SelectSubset<T, ResearcherProfileDeleteArgs<ExtArgs>>): Prisma__ResearcherProfileClient<$Result.GetResult<Prisma.$ResearcherProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ResearcherProfile.
     * @param {ResearcherProfileUpdateArgs} args - Arguments to update one ResearcherProfile.
     * @example
     * // Update one ResearcherProfile
     * const researcherProfile = await prisma.researcherProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ResearcherProfileUpdateArgs>(args: SelectSubset<T, ResearcherProfileUpdateArgs<ExtArgs>>): Prisma__ResearcherProfileClient<$Result.GetResult<Prisma.$ResearcherProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ResearcherProfiles.
     * @param {ResearcherProfileDeleteManyArgs} args - Arguments to filter ResearcherProfiles to delete.
     * @example
     * // Delete a few ResearcherProfiles
     * const { count } = await prisma.researcherProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ResearcherProfileDeleteManyArgs>(args?: SelectSubset<T, ResearcherProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ResearcherProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResearcherProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ResearcherProfiles
     * const researcherProfile = await prisma.researcherProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ResearcherProfileUpdateManyArgs>(args: SelectSubset<T, ResearcherProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ResearcherProfiles and returns the data updated in the database.
     * @param {ResearcherProfileUpdateManyAndReturnArgs} args - Arguments to update many ResearcherProfiles.
     * @example
     * // Update many ResearcherProfiles
     * const researcherProfile = await prisma.researcherProfile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ResearcherProfiles and only return the `id`
     * const researcherProfileWithIdOnly = await prisma.researcherProfile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ResearcherProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, ResearcherProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ResearcherProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ResearcherProfile.
     * @param {ResearcherProfileUpsertArgs} args - Arguments to update or create a ResearcherProfile.
     * @example
     * // Update or create a ResearcherProfile
     * const researcherProfile = await prisma.researcherProfile.upsert({
     *   create: {
     *     // ... data to create a ResearcherProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ResearcherProfile we want to update
     *   }
     * })
     */
    upsert<T extends ResearcherProfileUpsertArgs>(args: SelectSubset<T, ResearcherProfileUpsertArgs<ExtArgs>>): Prisma__ResearcherProfileClient<$Result.GetResult<Prisma.$ResearcherProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ResearcherProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResearcherProfileCountArgs} args - Arguments to filter ResearcherProfiles to count.
     * @example
     * // Count the number of ResearcherProfiles
     * const count = await prisma.researcherProfile.count({
     *   where: {
     *     // ... the filter for the ResearcherProfiles we want to count
     *   }
     * })
    **/
    count<T extends ResearcherProfileCountArgs>(
      args?: Subset<T, ResearcherProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ResearcherProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ResearcherProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResearcherProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ResearcherProfileAggregateArgs>(args: Subset<T, ResearcherProfileAggregateArgs>): Prisma.PrismaPromise<GetResearcherProfileAggregateType<T>>

    /**
     * Group by ResearcherProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResearcherProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ResearcherProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ResearcherProfileGroupByArgs['orderBy'] }
        : { orderBy?: ResearcherProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ResearcherProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetResearcherProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ResearcherProfile model
   */
  readonly fields: ResearcherProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ResearcherProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ResearcherProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ResearcherProfile model
   */
  interface ResearcherProfileFieldRefs {
    readonly id: FieldRef<"ResearcherProfile", 'String'>
    readonly userId: FieldRef<"ResearcherProfile", 'String'>
    readonly fullName: FieldRef<"ResearcherProfile", 'String'>
    readonly designation: FieldRef<"ResearcherProfile", 'String'>
    readonly email: FieldRef<"ResearcherProfile", 'String'>
    readonly accessLevel: FieldRef<"ResearcherProfile", 'String'>
    readonly createdAt: FieldRef<"ResearcherProfile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ResearcherProfile findUnique
   */
  export type ResearcherProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResearcherProfile
     */
    select?: ResearcherProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResearcherProfile
     */
    omit?: ResearcherProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResearcherProfileInclude<ExtArgs> | null
    /**
     * Filter, which ResearcherProfile to fetch.
     */
    where: ResearcherProfileWhereUniqueInput
  }

  /**
   * ResearcherProfile findUniqueOrThrow
   */
  export type ResearcherProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResearcherProfile
     */
    select?: ResearcherProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResearcherProfile
     */
    omit?: ResearcherProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResearcherProfileInclude<ExtArgs> | null
    /**
     * Filter, which ResearcherProfile to fetch.
     */
    where: ResearcherProfileWhereUniqueInput
  }

  /**
   * ResearcherProfile findFirst
   */
  export type ResearcherProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResearcherProfile
     */
    select?: ResearcherProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResearcherProfile
     */
    omit?: ResearcherProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResearcherProfileInclude<ExtArgs> | null
    /**
     * Filter, which ResearcherProfile to fetch.
     */
    where?: ResearcherProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ResearcherProfiles to fetch.
     */
    orderBy?: ResearcherProfileOrderByWithRelationInput | ResearcherProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ResearcherProfiles.
     */
    cursor?: ResearcherProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ResearcherProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ResearcherProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ResearcherProfiles.
     */
    distinct?: ResearcherProfileScalarFieldEnum | ResearcherProfileScalarFieldEnum[]
  }

  /**
   * ResearcherProfile findFirstOrThrow
   */
  export type ResearcherProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResearcherProfile
     */
    select?: ResearcherProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResearcherProfile
     */
    omit?: ResearcherProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResearcherProfileInclude<ExtArgs> | null
    /**
     * Filter, which ResearcherProfile to fetch.
     */
    where?: ResearcherProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ResearcherProfiles to fetch.
     */
    orderBy?: ResearcherProfileOrderByWithRelationInput | ResearcherProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ResearcherProfiles.
     */
    cursor?: ResearcherProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ResearcherProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ResearcherProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ResearcherProfiles.
     */
    distinct?: ResearcherProfileScalarFieldEnum | ResearcherProfileScalarFieldEnum[]
  }

  /**
   * ResearcherProfile findMany
   */
  export type ResearcherProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResearcherProfile
     */
    select?: ResearcherProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResearcherProfile
     */
    omit?: ResearcherProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResearcherProfileInclude<ExtArgs> | null
    /**
     * Filter, which ResearcherProfiles to fetch.
     */
    where?: ResearcherProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ResearcherProfiles to fetch.
     */
    orderBy?: ResearcherProfileOrderByWithRelationInput | ResearcherProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ResearcherProfiles.
     */
    cursor?: ResearcherProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ResearcherProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ResearcherProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ResearcherProfiles.
     */
    distinct?: ResearcherProfileScalarFieldEnum | ResearcherProfileScalarFieldEnum[]
  }

  /**
   * ResearcherProfile create
   */
  export type ResearcherProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResearcherProfile
     */
    select?: ResearcherProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResearcherProfile
     */
    omit?: ResearcherProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResearcherProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a ResearcherProfile.
     */
    data: XOR<ResearcherProfileCreateInput, ResearcherProfileUncheckedCreateInput>
  }

  /**
   * ResearcherProfile createMany
   */
  export type ResearcherProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ResearcherProfiles.
     */
    data: ResearcherProfileCreateManyInput | ResearcherProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ResearcherProfile createManyAndReturn
   */
  export type ResearcherProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResearcherProfile
     */
    select?: ResearcherProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ResearcherProfile
     */
    omit?: ResearcherProfileOmit<ExtArgs> | null
    /**
     * The data used to create many ResearcherProfiles.
     */
    data: ResearcherProfileCreateManyInput | ResearcherProfileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResearcherProfileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ResearcherProfile update
   */
  export type ResearcherProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResearcherProfile
     */
    select?: ResearcherProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResearcherProfile
     */
    omit?: ResearcherProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResearcherProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a ResearcherProfile.
     */
    data: XOR<ResearcherProfileUpdateInput, ResearcherProfileUncheckedUpdateInput>
    /**
     * Choose, which ResearcherProfile to update.
     */
    where: ResearcherProfileWhereUniqueInput
  }

  /**
   * ResearcherProfile updateMany
   */
  export type ResearcherProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ResearcherProfiles.
     */
    data: XOR<ResearcherProfileUpdateManyMutationInput, ResearcherProfileUncheckedUpdateManyInput>
    /**
     * Filter which ResearcherProfiles to update
     */
    where?: ResearcherProfileWhereInput
    /**
     * Limit how many ResearcherProfiles to update.
     */
    limit?: number
  }

  /**
   * ResearcherProfile updateManyAndReturn
   */
  export type ResearcherProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResearcherProfile
     */
    select?: ResearcherProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ResearcherProfile
     */
    omit?: ResearcherProfileOmit<ExtArgs> | null
    /**
     * The data used to update ResearcherProfiles.
     */
    data: XOR<ResearcherProfileUpdateManyMutationInput, ResearcherProfileUncheckedUpdateManyInput>
    /**
     * Filter which ResearcherProfiles to update
     */
    where?: ResearcherProfileWhereInput
    /**
     * Limit how many ResearcherProfiles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResearcherProfileIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ResearcherProfile upsert
   */
  export type ResearcherProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResearcherProfile
     */
    select?: ResearcherProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResearcherProfile
     */
    omit?: ResearcherProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResearcherProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the ResearcherProfile to update in case it exists.
     */
    where: ResearcherProfileWhereUniqueInput
    /**
     * In case the ResearcherProfile found by the `where` argument doesn't exist, create a new ResearcherProfile with this data.
     */
    create: XOR<ResearcherProfileCreateInput, ResearcherProfileUncheckedCreateInput>
    /**
     * In case the ResearcherProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ResearcherProfileUpdateInput, ResearcherProfileUncheckedUpdateInput>
  }

  /**
   * ResearcherProfile delete
   */
  export type ResearcherProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResearcherProfile
     */
    select?: ResearcherProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResearcherProfile
     */
    omit?: ResearcherProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResearcherProfileInclude<ExtArgs> | null
    /**
     * Filter which ResearcherProfile to delete.
     */
    where: ResearcherProfileWhereUniqueInput
  }

  /**
   * ResearcherProfile deleteMany
   */
  export type ResearcherProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ResearcherProfiles to delete
     */
    where?: ResearcherProfileWhereInput
    /**
     * Limit how many ResearcherProfiles to delete.
     */
    limit?: number
  }

  /**
   * ResearcherProfile without action
   */
  export type ResearcherProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ResearcherProfile
     */
    select?: ResearcherProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ResearcherProfile
     */
    omit?: ResearcherProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ResearcherProfileInclude<ExtArgs> | null
  }


  /**
   * Model FollowUpSchedule
   */

  export type AggregateFollowUpSchedule = {
    _count: FollowUpScheduleCountAggregateOutputType | null
    _min: FollowUpScheduleMinAggregateOutputType | null
    _max: FollowUpScheduleMaxAggregateOutputType | null
  }

  export type FollowUpScheduleMinAggregateOutputType = {
    id: string | null
    motherProfileId: string | null
    timePoint: string | null
    scheduledDate: Date | null
    actualDate: Date | null
    status: string | null
    dataComplete: boolean | null
    collectedByUserId: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FollowUpScheduleMaxAggregateOutputType = {
    id: string | null
    motherProfileId: string | null
    timePoint: string | null
    scheduledDate: Date | null
    actualDate: Date | null
    status: string | null
    dataComplete: boolean | null
    collectedByUserId: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FollowUpScheduleCountAggregateOutputType = {
    id: number
    motherProfileId: number
    timePoint: number
    scheduledDate: number
    actualDate: number
    status: number
    dataComplete: number
    collectedByUserId: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FollowUpScheduleMinAggregateInputType = {
    id?: true
    motherProfileId?: true
    timePoint?: true
    scheduledDate?: true
    actualDate?: true
    status?: true
    dataComplete?: true
    collectedByUserId?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FollowUpScheduleMaxAggregateInputType = {
    id?: true
    motherProfileId?: true
    timePoint?: true
    scheduledDate?: true
    actualDate?: true
    status?: true
    dataComplete?: true
    collectedByUserId?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FollowUpScheduleCountAggregateInputType = {
    id?: true
    motherProfileId?: true
    timePoint?: true
    scheduledDate?: true
    actualDate?: true
    status?: true
    dataComplete?: true
    collectedByUserId?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FollowUpScheduleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FollowUpSchedule to aggregate.
     */
    where?: FollowUpScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FollowUpSchedules to fetch.
     */
    orderBy?: FollowUpScheduleOrderByWithRelationInput | FollowUpScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FollowUpScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FollowUpSchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FollowUpSchedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FollowUpSchedules
    **/
    _count?: true | FollowUpScheduleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FollowUpScheduleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FollowUpScheduleMaxAggregateInputType
  }

  export type GetFollowUpScheduleAggregateType<T extends FollowUpScheduleAggregateArgs> = {
        [P in keyof T & keyof AggregateFollowUpSchedule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFollowUpSchedule[P]>
      : GetScalarType<T[P], AggregateFollowUpSchedule[P]>
  }




  export type FollowUpScheduleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FollowUpScheduleWhereInput
    orderBy?: FollowUpScheduleOrderByWithAggregationInput | FollowUpScheduleOrderByWithAggregationInput[]
    by: FollowUpScheduleScalarFieldEnum[] | FollowUpScheduleScalarFieldEnum
    having?: FollowUpScheduleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FollowUpScheduleCountAggregateInputType | true
    _min?: FollowUpScheduleMinAggregateInputType
    _max?: FollowUpScheduleMaxAggregateInputType
  }

  export type FollowUpScheduleGroupByOutputType = {
    id: string
    motherProfileId: string
    timePoint: string
    scheduledDate: Date
    actualDate: Date | null
    status: string
    dataComplete: boolean
    collectedByUserId: string | null
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: FollowUpScheduleCountAggregateOutputType | null
    _min: FollowUpScheduleMinAggregateOutputType | null
    _max: FollowUpScheduleMaxAggregateOutputType | null
  }

  type GetFollowUpScheduleGroupByPayload<T extends FollowUpScheduleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FollowUpScheduleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FollowUpScheduleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FollowUpScheduleGroupByOutputType[P]>
            : GetScalarType<T[P], FollowUpScheduleGroupByOutputType[P]>
        }
      >
    >


  export type FollowUpScheduleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    motherProfileId?: boolean
    timePoint?: boolean
    scheduledDate?: boolean
    actualDate?: boolean
    status?: boolean
    dataComplete?: boolean
    collectedByUserId?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    motherProfile?: boolean | MotherProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["followUpSchedule"]>

  export type FollowUpScheduleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    motherProfileId?: boolean
    timePoint?: boolean
    scheduledDate?: boolean
    actualDate?: boolean
    status?: boolean
    dataComplete?: boolean
    collectedByUserId?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    motherProfile?: boolean | MotherProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["followUpSchedule"]>

  export type FollowUpScheduleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    motherProfileId?: boolean
    timePoint?: boolean
    scheduledDate?: boolean
    actualDate?: boolean
    status?: boolean
    dataComplete?: boolean
    collectedByUserId?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    motherProfile?: boolean | MotherProfileDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["followUpSchedule"]>

  export type FollowUpScheduleSelectScalar = {
    id?: boolean
    motherProfileId?: boolean
    timePoint?: boolean
    scheduledDate?: boolean
    actualDate?: boolean
    status?: boolean
    dataComplete?: boolean
    collectedByUserId?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FollowUpScheduleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "motherProfileId" | "timePoint" | "scheduledDate" | "actualDate" | "status" | "dataComplete" | "collectedByUserId" | "notes" | "createdAt" | "updatedAt", ExtArgs["result"]["followUpSchedule"]>
  export type FollowUpScheduleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    motherProfile?: boolean | MotherProfileDefaultArgs<ExtArgs>
  }
  export type FollowUpScheduleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    motherProfile?: boolean | MotherProfileDefaultArgs<ExtArgs>
  }
  export type FollowUpScheduleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    motherProfile?: boolean | MotherProfileDefaultArgs<ExtArgs>
  }

  export type $FollowUpSchedulePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FollowUpSchedule"
    objects: {
      motherProfile: Prisma.$MotherProfilePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      motherProfileId: string
      timePoint: string
      scheduledDate: Date
      actualDate: Date | null
      status: string
      dataComplete: boolean
      collectedByUserId: string | null
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["followUpSchedule"]>
    composites: {}
  }

  type FollowUpScheduleGetPayload<S extends boolean | null | undefined | FollowUpScheduleDefaultArgs> = $Result.GetResult<Prisma.$FollowUpSchedulePayload, S>

  type FollowUpScheduleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FollowUpScheduleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FollowUpScheduleCountAggregateInputType | true
    }

  export interface FollowUpScheduleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FollowUpSchedule'], meta: { name: 'FollowUpSchedule' } }
    /**
     * Find zero or one FollowUpSchedule that matches the filter.
     * @param {FollowUpScheduleFindUniqueArgs} args - Arguments to find a FollowUpSchedule
     * @example
     * // Get one FollowUpSchedule
     * const followUpSchedule = await prisma.followUpSchedule.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FollowUpScheduleFindUniqueArgs>(args: SelectSubset<T, FollowUpScheduleFindUniqueArgs<ExtArgs>>): Prisma__FollowUpScheduleClient<$Result.GetResult<Prisma.$FollowUpSchedulePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FollowUpSchedule that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FollowUpScheduleFindUniqueOrThrowArgs} args - Arguments to find a FollowUpSchedule
     * @example
     * // Get one FollowUpSchedule
     * const followUpSchedule = await prisma.followUpSchedule.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FollowUpScheduleFindUniqueOrThrowArgs>(args: SelectSubset<T, FollowUpScheduleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FollowUpScheduleClient<$Result.GetResult<Prisma.$FollowUpSchedulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FollowUpSchedule that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FollowUpScheduleFindFirstArgs} args - Arguments to find a FollowUpSchedule
     * @example
     * // Get one FollowUpSchedule
     * const followUpSchedule = await prisma.followUpSchedule.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FollowUpScheduleFindFirstArgs>(args?: SelectSubset<T, FollowUpScheduleFindFirstArgs<ExtArgs>>): Prisma__FollowUpScheduleClient<$Result.GetResult<Prisma.$FollowUpSchedulePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FollowUpSchedule that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FollowUpScheduleFindFirstOrThrowArgs} args - Arguments to find a FollowUpSchedule
     * @example
     * // Get one FollowUpSchedule
     * const followUpSchedule = await prisma.followUpSchedule.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FollowUpScheduleFindFirstOrThrowArgs>(args?: SelectSubset<T, FollowUpScheduleFindFirstOrThrowArgs<ExtArgs>>): Prisma__FollowUpScheduleClient<$Result.GetResult<Prisma.$FollowUpSchedulePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FollowUpSchedules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FollowUpScheduleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FollowUpSchedules
     * const followUpSchedules = await prisma.followUpSchedule.findMany()
     * 
     * // Get first 10 FollowUpSchedules
     * const followUpSchedules = await prisma.followUpSchedule.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const followUpScheduleWithIdOnly = await prisma.followUpSchedule.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FollowUpScheduleFindManyArgs>(args?: SelectSubset<T, FollowUpScheduleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FollowUpSchedulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FollowUpSchedule.
     * @param {FollowUpScheduleCreateArgs} args - Arguments to create a FollowUpSchedule.
     * @example
     * // Create one FollowUpSchedule
     * const FollowUpSchedule = await prisma.followUpSchedule.create({
     *   data: {
     *     // ... data to create a FollowUpSchedule
     *   }
     * })
     * 
     */
    create<T extends FollowUpScheduleCreateArgs>(args: SelectSubset<T, FollowUpScheduleCreateArgs<ExtArgs>>): Prisma__FollowUpScheduleClient<$Result.GetResult<Prisma.$FollowUpSchedulePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FollowUpSchedules.
     * @param {FollowUpScheduleCreateManyArgs} args - Arguments to create many FollowUpSchedules.
     * @example
     * // Create many FollowUpSchedules
     * const followUpSchedule = await prisma.followUpSchedule.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FollowUpScheduleCreateManyArgs>(args?: SelectSubset<T, FollowUpScheduleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FollowUpSchedules and returns the data saved in the database.
     * @param {FollowUpScheduleCreateManyAndReturnArgs} args - Arguments to create many FollowUpSchedules.
     * @example
     * // Create many FollowUpSchedules
     * const followUpSchedule = await prisma.followUpSchedule.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FollowUpSchedules and only return the `id`
     * const followUpScheduleWithIdOnly = await prisma.followUpSchedule.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FollowUpScheduleCreateManyAndReturnArgs>(args?: SelectSubset<T, FollowUpScheduleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FollowUpSchedulePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FollowUpSchedule.
     * @param {FollowUpScheduleDeleteArgs} args - Arguments to delete one FollowUpSchedule.
     * @example
     * // Delete one FollowUpSchedule
     * const FollowUpSchedule = await prisma.followUpSchedule.delete({
     *   where: {
     *     // ... filter to delete one FollowUpSchedule
     *   }
     * })
     * 
     */
    delete<T extends FollowUpScheduleDeleteArgs>(args: SelectSubset<T, FollowUpScheduleDeleteArgs<ExtArgs>>): Prisma__FollowUpScheduleClient<$Result.GetResult<Prisma.$FollowUpSchedulePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FollowUpSchedule.
     * @param {FollowUpScheduleUpdateArgs} args - Arguments to update one FollowUpSchedule.
     * @example
     * // Update one FollowUpSchedule
     * const followUpSchedule = await prisma.followUpSchedule.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FollowUpScheduleUpdateArgs>(args: SelectSubset<T, FollowUpScheduleUpdateArgs<ExtArgs>>): Prisma__FollowUpScheduleClient<$Result.GetResult<Prisma.$FollowUpSchedulePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FollowUpSchedules.
     * @param {FollowUpScheduleDeleteManyArgs} args - Arguments to filter FollowUpSchedules to delete.
     * @example
     * // Delete a few FollowUpSchedules
     * const { count } = await prisma.followUpSchedule.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FollowUpScheduleDeleteManyArgs>(args?: SelectSubset<T, FollowUpScheduleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FollowUpSchedules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FollowUpScheduleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FollowUpSchedules
     * const followUpSchedule = await prisma.followUpSchedule.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FollowUpScheduleUpdateManyArgs>(args: SelectSubset<T, FollowUpScheduleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FollowUpSchedules and returns the data updated in the database.
     * @param {FollowUpScheduleUpdateManyAndReturnArgs} args - Arguments to update many FollowUpSchedules.
     * @example
     * // Update many FollowUpSchedules
     * const followUpSchedule = await prisma.followUpSchedule.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FollowUpSchedules and only return the `id`
     * const followUpScheduleWithIdOnly = await prisma.followUpSchedule.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FollowUpScheduleUpdateManyAndReturnArgs>(args: SelectSubset<T, FollowUpScheduleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FollowUpSchedulePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FollowUpSchedule.
     * @param {FollowUpScheduleUpsertArgs} args - Arguments to update or create a FollowUpSchedule.
     * @example
     * // Update or create a FollowUpSchedule
     * const followUpSchedule = await prisma.followUpSchedule.upsert({
     *   create: {
     *     // ... data to create a FollowUpSchedule
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FollowUpSchedule we want to update
     *   }
     * })
     */
    upsert<T extends FollowUpScheduleUpsertArgs>(args: SelectSubset<T, FollowUpScheduleUpsertArgs<ExtArgs>>): Prisma__FollowUpScheduleClient<$Result.GetResult<Prisma.$FollowUpSchedulePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FollowUpSchedules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FollowUpScheduleCountArgs} args - Arguments to filter FollowUpSchedules to count.
     * @example
     * // Count the number of FollowUpSchedules
     * const count = await prisma.followUpSchedule.count({
     *   where: {
     *     // ... the filter for the FollowUpSchedules we want to count
     *   }
     * })
    **/
    count<T extends FollowUpScheduleCountArgs>(
      args?: Subset<T, FollowUpScheduleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FollowUpScheduleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FollowUpSchedule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FollowUpScheduleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FollowUpScheduleAggregateArgs>(args: Subset<T, FollowUpScheduleAggregateArgs>): Prisma.PrismaPromise<GetFollowUpScheduleAggregateType<T>>

    /**
     * Group by FollowUpSchedule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FollowUpScheduleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FollowUpScheduleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FollowUpScheduleGroupByArgs['orderBy'] }
        : { orderBy?: FollowUpScheduleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FollowUpScheduleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFollowUpScheduleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FollowUpSchedule model
   */
  readonly fields: FollowUpScheduleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FollowUpSchedule.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FollowUpScheduleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    motherProfile<T extends MotherProfileDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MotherProfileDefaultArgs<ExtArgs>>): Prisma__MotherProfileClient<$Result.GetResult<Prisma.$MotherProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FollowUpSchedule model
   */
  interface FollowUpScheduleFieldRefs {
    readonly id: FieldRef<"FollowUpSchedule", 'String'>
    readonly motherProfileId: FieldRef<"FollowUpSchedule", 'String'>
    readonly timePoint: FieldRef<"FollowUpSchedule", 'String'>
    readonly scheduledDate: FieldRef<"FollowUpSchedule", 'DateTime'>
    readonly actualDate: FieldRef<"FollowUpSchedule", 'DateTime'>
    readonly status: FieldRef<"FollowUpSchedule", 'String'>
    readonly dataComplete: FieldRef<"FollowUpSchedule", 'Boolean'>
    readonly collectedByUserId: FieldRef<"FollowUpSchedule", 'String'>
    readonly notes: FieldRef<"FollowUpSchedule", 'String'>
    readonly createdAt: FieldRef<"FollowUpSchedule", 'DateTime'>
    readonly updatedAt: FieldRef<"FollowUpSchedule", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FollowUpSchedule findUnique
   */
  export type FollowUpScheduleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FollowUpSchedule
     */
    select?: FollowUpScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FollowUpSchedule
     */
    omit?: FollowUpScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowUpScheduleInclude<ExtArgs> | null
    /**
     * Filter, which FollowUpSchedule to fetch.
     */
    where: FollowUpScheduleWhereUniqueInput
  }

  /**
   * FollowUpSchedule findUniqueOrThrow
   */
  export type FollowUpScheduleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FollowUpSchedule
     */
    select?: FollowUpScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FollowUpSchedule
     */
    omit?: FollowUpScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowUpScheduleInclude<ExtArgs> | null
    /**
     * Filter, which FollowUpSchedule to fetch.
     */
    where: FollowUpScheduleWhereUniqueInput
  }

  /**
   * FollowUpSchedule findFirst
   */
  export type FollowUpScheduleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FollowUpSchedule
     */
    select?: FollowUpScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FollowUpSchedule
     */
    omit?: FollowUpScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowUpScheduleInclude<ExtArgs> | null
    /**
     * Filter, which FollowUpSchedule to fetch.
     */
    where?: FollowUpScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FollowUpSchedules to fetch.
     */
    orderBy?: FollowUpScheduleOrderByWithRelationInput | FollowUpScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FollowUpSchedules.
     */
    cursor?: FollowUpScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FollowUpSchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FollowUpSchedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FollowUpSchedules.
     */
    distinct?: FollowUpScheduleScalarFieldEnum | FollowUpScheduleScalarFieldEnum[]
  }

  /**
   * FollowUpSchedule findFirstOrThrow
   */
  export type FollowUpScheduleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FollowUpSchedule
     */
    select?: FollowUpScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FollowUpSchedule
     */
    omit?: FollowUpScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowUpScheduleInclude<ExtArgs> | null
    /**
     * Filter, which FollowUpSchedule to fetch.
     */
    where?: FollowUpScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FollowUpSchedules to fetch.
     */
    orderBy?: FollowUpScheduleOrderByWithRelationInput | FollowUpScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FollowUpSchedules.
     */
    cursor?: FollowUpScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FollowUpSchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FollowUpSchedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FollowUpSchedules.
     */
    distinct?: FollowUpScheduleScalarFieldEnum | FollowUpScheduleScalarFieldEnum[]
  }

  /**
   * FollowUpSchedule findMany
   */
  export type FollowUpScheduleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FollowUpSchedule
     */
    select?: FollowUpScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FollowUpSchedule
     */
    omit?: FollowUpScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowUpScheduleInclude<ExtArgs> | null
    /**
     * Filter, which FollowUpSchedules to fetch.
     */
    where?: FollowUpScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FollowUpSchedules to fetch.
     */
    orderBy?: FollowUpScheduleOrderByWithRelationInput | FollowUpScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FollowUpSchedules.
     */
    cursor?: FollowUpScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FollowUpSchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FollowUpSchedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FollowUpSchedules.
     */
    distinct?: FollowUpScheduleScalarFieldEnum | FollowUpScheduleScalarFieldEnum[]
  }

  /**
   * FollowUpSchedule create
   */
  export type FollowUpScheduleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FollowUpSchedule
     */
    select?: FollowUpScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FollowUpSchedule
     */
    omit?: FollowUpScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowUpScheduleInclude<ExtArgs> | null
    /**
     * The data needed to create a FollowUpSchedule.
     */
    data: XOR<FollowUpScheduleCreateInput, FollowUpScheduleUncheckedCreateInput>
  }

  /**
   * FollowUpSchedule createMany
   */
  export type FollowUpScheduleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FollowUpSchedules.
     */
    data: FollowUpScheduleCreateManyInput | FollowUpScheduleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FollowUpSchedule createManyAndReturn
   */
  export type FollowUpScheduleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FollowUpSchedule
     */
    select?: FollowUpScheduleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FollowUpSchedule
     */
    omit?: FollowUpScheduleOmit<ExtArgs> | null
    /**
     * The data used to create many FollowUpSchedules.
     */
    data: FollowUpScheduleCreateManyInput | FollowUpScheduleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowUpScheduleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FollowUpSchedule update
   */
  export type FollowUpScheduleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FollowUpSchedule
     */
    select?: FollowUpScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FollowUpSchedule
     */
    omit?: FollowUpScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowUpScheduleInclude<ExtArgs> | null
    /**
     * The data needed to update a FollowUpSchedule.
     */
    data: XOR<FollowUpScheduleUpdateInput, FollowUpScheduleUncheckedUpdateInput>
    /**
     * Choose, which FollowUpSchedule to update.
     */
    where: FollowUpScheduleWhereUniqueInput
  }

  /**
   * FollowUpSchedule updateMany
   */
  export type FollowUpScheduleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FollowUpSchedules.
     */
    data: XOR<FollowUpScheduleUpdateManyMutationInput, FollowUpScheduleUncheckedUpdateManyInput>
    /**
     * Filter which FollowUpSchedules to update
     */
    where?: FollowUpScheduleWhereInput
    /**
     * Limit how many FollowUpSchedules to update.
     */
    limit?: number
  }

  /**
   * FollowUpSchedule updateManyAndReturn
   */
  export type FollowUpScheduleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FollowUpSchedule
     */
    select?: FollowUpScheduleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FollowUpSchedule
     */
    omit?: FollowUpScheduleOmit<ExtArgs> | null
    /**
     * The data used to update FollowUpSchedules.
     */
    data: XOR<FollowUpScheduleUpdateManyMutationInput, FollowUpScheduleUncheckedUpdateManyInput>
    /**
     * Filter which FollowUpSchedules to update
     */
    where?: FollowUpScheduleWhereInput
    /**
     * Limit how many FollowUpSchedules to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowUpScheduleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * FollowUpSchedule upsert
   */
  export type FollowUpScheduleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FollowUpSchedule
     */
    select?: FollowUpScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FollowUpSchedule
     */
    omit?: FollowUpScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowUpScheduleInclude<ExtArgs> | null
    /**
     * The filter to search for the FollowUpSchedule to update in case it exists.
     */
    where: FollowUpScheduleWhereUniqueInput
    /**
     * In case the FollowUpSchedule found by the `where` argument doesn't exist, create a new FollowUpSchedule with this data.
     */
    create: XOR<FollowUpScheduleCreateInput, FollowUpScheduleUncheckedCreateInput>
    /**
     * In case the FollowUpSchedule was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FollowUpScheduleUpdateInput, FollowUpScheduleUncheckedUpdateInput>
  }

  /**
   * FollowUpSchedule delete
   */
  export type FollowUpScheduleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FollowUpSchedule
     */
    select?: FollowUpScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FollowUpSchedule
     */
    omit?: FollowUpScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowUpScheduleInclude<ExtArgs> | null
    /**
     * Filter which FollowUpSchedule to delete.
     */
    where: FollowUpScheduleWhereUniqueInput
  }

  /**
   * FollowUpSchedule deleteMany
   */
  export type FollowUpScheduleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FollowUpSchedules to delete
     */
    where?: FollowUpScheduleWhereInput
    /**
     * Limit how many FollowUpSchedules to delete.
     */
    limit?: number
  }

  /**
   * FollowUpSchedule without action
   */
  export type FollowUpScheduleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FollowUpSchedule
     */
    select?: FollowUpScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FollowUpSchedule
     */
    omit?: FollowUpScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowUpScheduleInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const HospitalScalarFieldEnum: {
    id: 'id',
    name: 'name',
    code: 'code',
    district: 'district',
    state: 'state',
    type: 'type',
    emergencyPhone: 'emergencyPhone',
    isActive: 'isActive',
    nextParticipantNumber: 'nextParticipantNumber',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type HospitalScalarFieldEnum = (typeof HospitalScalarFieldEnum)[keyof typeof HospitalScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    phone: 'phone',
    phoneVerified: 'phoneVerified',
    email: 'email',
    passwordHash: 'passwordHash',
    pinHash: 'pinHash',
    role: 'role',
    preferredLanguage: 'preferredLanguage',
    hospitalId: 'hospitalId',
    isActive: 'isActive',
    lastLoginAt: 'lastLoginAt',
    failedPasswordAttempts: 'failedPasswordAttempts',
    passwordLockedUntil: 'passwordLockedUntil',
    failedPinAttempts: 'failedPinAttempts',
    pinLockedUntil: 'pinLockedUntil',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const OtpVerificationScalarFieldEnum: {
    id: 'id',
    phone: 'phone',
    otpHash: 'otpHash',
    purpose: 'purpose',
    isUsed: 'isUsed',
    attempts: 'attempts',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    usedAt: 'usedAt'
  };

  export type OtpVerificationScalarFieldEnum = (typeof OtpVerificationScalarFieldEnum)[keyof typeof OtpVerificationScalarFieldEnum]


  export const RefreshTokenScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    tokenHash: 'tokenHash',
    deviceInfo: 'deviceInfo',
    expiresAt: 'expiresAt',
    revokedAt: 'revokedAt',
    createdAt: 'createdAt'
  };

  export type RefreshTokenScalarFieldEnum = (typeof RefreshTokenScalarFieldEnum)[keyof typeof RefreshTokenScalarFieldEnum]


  export const MotherProfileScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    participantCode: 'participantCode',
    studyGroup: 'studyGroup',
    hospitalId: 'hospitalId',
    fullName: 'fullName',
    ageRange: 'ageRange',
    educationMother: 'educationMother',
    educationFather: 'educationFather',
    occupationMother: 'occupationMother',
    occupationFather: 'occupationFather',
    incomeClass: 'incomeClass',
    familyType: 'familyType',
    familyMembersCount: 'familyMembersCount',
    religion: 'religion',
    residenceType: 'residenceType',
    contactNumber: 'contactNumber',
    prevPretermEducation: 'prevPretermEducation',
    educationSource: 'educationSource',
    enrolledAt: 'enrolledAt',
    onboardingCompletedAt: 'onboardingCompletedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MotherProfileScalarFieldEnum = (typeof MotherProfileScalarFieldEnum)[keyof typeof MotherProfileScalarFieldEnum]


  export const BabyProfileScalarFieldEnum: {
    id: 'id',
    motherProfileId: 'motherProfileId',
    babyName: 'babyName',
    sex: 'sex',
    dateOfBirth: 'dateOfBirth',
    gestationalAgeWeeks: 'gestationalAgeWeeks',
    birthWeightGrams: 'birthWeightGrams',
    weightAtDischargeGrams: 'weightAtDischargeGrams',
    placeOfDelivery: 'placeOfDelivery',
    nicuStayDays: 'nicuStayDays',
    skinToSkinAtBirth: 'skinToSkinAtBirth',
    kmcInNicu: 'kmcInNicu',
    feedingAtDischarge: 'feedingAtDischarge',
    criedAtBirth: 'criedAtBirth',
    neededResuscitation: 'neededResuscitation',
    birthWeightStratum: 'birthWeightStratum',
    dischargeDate: 'dischargeDate',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BabyProfileScalarFieldEnum = (typeof BabyProfileScalarFieldEnum)[keyof typeof BabyProfileScalarFieldEnum]


  export const NurseProfileScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    hospitalId: 'hospitalId',
    fullName: 'fullName',
    employeeId: 'employeeId',
    isActive: 'isActive',
    createdAt: 'createdAt'
  };

  export type NurseProfileScalarFieldEnum = (typeof NurseProfileScalarFieldEnum)[keyof typeof NurseProfileScalarFieldEnum]


  export const ResearcherProfileScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    fullName: 'fullName',
    designation: 'designation',
    email: 'email',
    accessLevel: 'accessLevel',
    createdAt: 'createdAt'
  };

  export type ResearcherProfileScalarFieldEnum = (typeof ResearcherProfileScalarFieldEnum)[keyof typeof ResearcherProfileScalarFieldEnum]


  export const FollowUpScheduleScalarFieldEnum: {
    id: 'id',
    motherProfileId: 'motherProfileId',
    timePoint: 'timePoint',
    scheduledDate: 'scheduledDate',
    actualDate: 'actualDate',
    status: 'status',
    dataComplete: 'dataComplete',
    collectedByUserId: 'collectedByUserId',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FollowUpScheduleScalarFieldEnum = (typeof FollowUpScheduleScalarFieldEnum)[keyof typeof FollowUpScheduleScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type HospitalWhereInput = {
    AND?: HospitalWhereInput | HospitalWhereInput[]
    OR?: HospitalWhereInput[]
    NOT?: HospitalWhereInput | HospitalWhereInput[]
    id?: UuidFilter<"Hospital"> | string
    name?: StringFilter<"Hospital"> | string
    code?: StringFilter<"Hospital"> | string
    district?: StringFilter<"Hospital"> | string
    state?: StringFilter<"Hospital"> | string
    type?: StringFilter<"Hospital"> | string
    emergencyPhone?: StringNullableFilter<"Hospital"> | string | null
    isActive?: BoolFilter<"Hospital"> | boolean
    nextParticipantNumber?: IntFilter<"Hospital"> | number
    createdAt?: DateTimeFilter<"Hospital"> | Date | string
    updatedAt?: DateTimeFilter<"Hospital"> | Date | string
    users?: UserListRelationFilter
    motherProfiles?: MotherProfileListRelationFilter
    nurseProfiles?: NurseProfileListRelationFilter
  }

  export type HospitalOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    district?: SortOrder
    state?: SortOrder
    type?: SortOrder
    emergencyPhone?: SortOrderInput | SortOrder
    isActive?: SortOrder
    nextParticipantNumber?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    users?: UserOrderByRelationAggregateInput
    motherProfiles?: MotherProfileOrderByRelationAggregateInput
    nurseProfiles?: NurseProfileOrderByRelationAggregateInput
  }

  export type HospitalWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    AND?: HospitalWhereInput | HospitalWhereInput[]
    OR?: HospitalWhereInput[]
    NOT?: HospitalWhereInput | HospitalWhereInput[]
    name?: StringFilter<"Hospital"> | string
    district?: StringFilter<"Hospital"> | string
    state?: StringFilter<"Hospital"> | string
    type?: StringFilter<"Hospital"> | string
    emergencyPhone?: StringNullableFilter<"Hospital"> | string | null
    isActive?: BoolFilter<"Hospital"> | boolean
    nextParticipantNumber?: IntFilter<"Hospital"> | number
    createdAt?: DateTimeFilter<"Hospital"> | Date | string
    updatedAt?: DateTimeFilter<"Hospital"> | Date | string
    users?: UserListRelationFilter
    motherProfiles?: MotherProfileListRelationFilter
    nurseProfiles?: NurseProfileListRelationFilter
  }, "id" | "code">

  export type HospitalOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    district?: SortOrder
    state?: SortOrder
    type?: SortOrder
    emergencyPhone?: SortOrderInput | SortOrder
    isActive?: SortOrder
    nextParticipantNumber?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: HospitalCountOrderByAggregateInput
    _avg?: HospitalAvgOrderByAggregateInput
    _max?: HospitalMaxOrderByAggregateInput
    _min?: HospitalMinOrderByAggregateInput
    _sum?: HospitalSumOrderByAggregateInput
  }

  export type HospitalScalarWhereWithAggregatesInput = {
    AND?: HospitalScalarWhereWithAggregatesInput | HospitalScalarWhereWithAggregatesInput[]
    OR?: HospitalScalarWhereWithAggregatesInput[]
    NOT?: HospitalScalarWhereWithAggregatesInput | HospitalScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Hospital"> | string
    name?: StringWithAggregatesFilter<"Hospital"> | string
    code?: StringWithAggregatesFilter<"Hospital"> | string
    district?: StringWithAggregatesFilter<"Hospital"> | string
    state?: StringWithAggregatesFilter<"Hospital"> | string
    type?: StringWithAggregatesFilter<"Hospital"> | string
    emergencyPhone?: StringNullableWithAggregatesFilter<"Hospital"> | string | null
    isActive?: BoolWithAggregatesFilter<"Hospital"> | boolean
    nextParticipantNumber?: IntWithAggregatesFilter<"Hospital"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Hospital"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Hospital"> | Date | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: UuidFilter<"User"> | string
    phone?: StringFilter<"User"> | string
    phoneVerified?: BoolFilter<"User"> | boolean
    email?: StringNullableFilter<"User"> | string | null
    passwordHash?: StringFilter<"User"> | string
    pinHash?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    preferredLanguage?: StringFilter<"User"> | string
    hospitalId?: UuidNullableFilter<"User"> | string | null
    isActive?: BoolFilter<"User"> | boolean
    lastLoginAt?: DateTimeNullableFilter<"User"> | Date | string | null
    failedPasswordAttempts?: IntFilter<"User"> | number
    passwordLockedUntil?: DateTimeNullableFilter<"User"> | Date | string | null
    failedPinAttempts?: IntFilter<"User"> | number
    pinLockedUntil?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    deletedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    hospital?: XOR<HospitalNullableScalarRelationFilter, HospitalWhereInput> | null
    motherProfile?: XOR<MotherProfileNullableScalarRelationFilter, MotherProfileWhereInput> | null
    nurseProfile?: XOR<NurseProfileNullableScalarRelationFilter, NurseProfileWhereInput> | null
    researcherProfile?: XOR<ResearcherProfileNullableScalarRelationFilter, ResearcherProfileWhereInput> | null
    refreshTokens?: RefreshTokenListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    phone?: SortOrder
    phoneVerified?: SortOrder
    email?: SortOrderInput | SortOrder
    passwordHash?: SortOrder
    pinHash?: SortOrderInput | SortOrder
    role?: SortOrder
    preferredLanguage?: SortOrder
    hospitalId?: SortOrderInput | SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    failedPasswordAttempts?: SortOrder
    passwordLockedUntil?: SortOrderInput | SortOrder
    failedPinAttempts?: SortOrder
    pinLockedUntil?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    hospital?: HospitalOrderByWithRelationInput
    motherProfile?: MotherProfileOrderByWithRelationInput
    nurseProfile?: NurseProfileOrderByWithRelationInput
    researcherProfile?: ResearcherProfileOrderByWithRelationInput
    refreshTokens?: RefreshTokenOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    phone?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    phoneVerified?: BoolFilter<"User"> | boolean
    passwordHash?: StringFilter<"User"> | string
    pinHash?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    preferredLanguage?: StringFilter<"User"> | string
    hospitalId?: UuidNullableFilter<"User"> | string | null
    isActive?: BoolFilter<"User"> | boolean
    lastLoginAt?: DateTimeNullableFilter<"User"> | Date | string | null
    failedPasswordAttempts?: IntFilter<"User"> | number
    passwordLockedUntil?: DateTimeNullableFilter<"User"> | Date | string | null
    failedPinAttempts?: IntFilter<"User"> | number
    pinLockedUntil?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    deletedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    hospital?: XOR<HospitalNullableScalarRelationFilter, HospitalWhereInput> | null
    motherProfile?: XOR<MotherProfileNullableScalarRelationFilter, MotherProfileWhereInput> | null
    nurseProfile?: XOR<NurseProfileNullableScalarRelationFilter, NurseProfileWhereInput> | null
    researcherProfile?: XOR<ResearcherProfileNullableScalarRelationFilter, ResearcherProfileWhereInput> | null
    refreshTokens?: RefreshTokenListRelationFilter
  }, "id" | "phone" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    phone?: SortOrder
    phoneVerified?: SortOrder
    email?: SortOrderInput | SortOrder
    passwordHash?: SortOrder
    pinHash?: SortOrderInput | SortOrder
    role?: SortOrder
    preferredLanguage?: SortOrder
    hospitalId?: SortOrderInput | SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    failedPasswordAttempts?: SortOrder
    passwordLockedUntil?: SortOrderInput | SortOrder
    failedPinAttempts?: SortOrder
    pinLockedUntil?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"User"> | string
    phone?: StringWithAggregatesFilter<"User"> | string
    phoneVerified?: BoolWithAggregatesFilter<"User"> | boolean
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    pinHash?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: StringWithAggregatesFilter<"User"> | string
    preferredLanguage?: StringWithAggregatesFilter<"User"> | string
    hospitalId?: UuidNullableWithAggregatesFilter<"User"> | string | null
    isActive?: BoolWithAggregatesFilter<"User"> | boolean
    lastLoginAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    failedPasswordAttempts?: IntWithAggregatesFilter<"User"> | number
    passwordLockedUntil?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    failedPinAttempts?: IntWithAggregatesFilter<"User"> | number
    pinLockedUntil?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
  }

  export type OtpVerificationWhereInput = {
    AND?: OtpVerificationWhereInput | OtpVerificationWhereInput[]
    OR?: OtpVerificationWhereInput[]
    NOT?: OtpVerificationWhereInput | OtpVerificationWhereInput[]
    id?: UuidFilter<"OtpVerification"> | string
    phone?: StringFilter<"OtpVerification"> | string
    otpHash?: StringFilter<"OtpVerification"> | string
    purpose?: StringFilter<"OtpVerification"> | string
    isUsed?: BoolFilter<"OtpVerification"> | boolean
    attempts?: IntFilter<"OtpVerification"> | number
    expiresAt?: DateTimeFilter<"OtpVerification"> | Date | string
    createdAt?: DateTimeFilter<"OtpVerification"> | Date | string
    usedAt?: DateTimeNullableFilter<"OtpVerification"> | Date | string | null
  }

  export type OtpVerificationOrderByWithRelationInput = {
    id?: SortOrder
    phone?: SortOrder
    otpHash?: SortOrder
    purpose?: SortOrder
    isUsed?: SortOrder
    attempts?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    usedAt?: SortOrderInput | SortOrder
  }

  export type OtpVerificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OtpVerificationWhereInput | OtpVerificationWhereInput[]
    OR?: OtpVerificationWhereInput[]
    NOT?: OtpVerificationWhereInput | OtpVerificationWhereInput[]
    phone?: StringFilter<"OtpVerification"> | string
    otpHash?: StringFilter<"OtpVerification"> | string
    purpose?: StringFilter<"OtpVerification"> | string
    isUsed?: BoolFilter<"OtpVerification"> | boolean
    attempts?: IntFilter<"OtpVerification"> | number
    expiresAt?: DateTimeFilter<"OtpVerification"> | Date | string
    createdAt?: DateTimeFilter<"OtpVerification"> | Date | string
    usedAt?: DateTimeNullableFilter<"OtpVerification"> | Date | string | null
  }, "id">

  export type OtpVerificationOrderByWithAggregationInput = {
    id?: SortOrder
    phone?: SortOrder
    otpHash?: SortOrder
    purpose?: SortOrder
    isUsed?: SortOrder
    attempts?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    usedAt?: SortOrderInput | SortOrder
    _count?: OtpVerificationCountOrderByAggregateInput
    _avg?: OtpVerificationAvgOrderByAggregateInput
    _max?: OtpVerificationMaxOrderByAggregateInput
    _min?: OtpVerificationMinOrderByAggregateInput
    _sum?: OtpVerificationSumOrderByAggregateInput
  }

  export type OtpVerificationScalarWhereWithAggregatesInput = {
    AND?: OtpVerificationScalarWhereWithAggregatesInput | OtpVerificationScalarWhereWithAggregatesInput[]
    OR?: OtpVerificationScalarWhereWithAggregatesInput[]
    NOT?: OtpVerificationScalarWhereWithAggregatesInput | OtpVerificationScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"OtpVerification"> | string
    phone?: StringWithAggregatesFilter<"OtpVerification"> | string
    otpHash?: StringWithAggregatesFilter<"OtpVerification"> | string
    purpose?: StringWithAggregatesFilter<"OtpVerification"> | string
    isUsed?: BoolWithAggregatesFilter<"OtpVerification"> | boolean
    attempts?: IntWithAggregatesFilter<"OtpVerification"> | number
    expiresAt?: DateTimeWithAggregatesFilter<"OtpVerification"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"OtpVerification"> | Date | string
    usedAt?: DateTimeNullableWithAggregatesFilter<"OtpVerification"> | Date | string | null
  }

  export type RefreshTokenWhereInput = {
    AND?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    OR?: RefreshTokenWhereInput[]
    NOT?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    id?: UuidFilter<"RefreshToken"> | string
    userId?: UuidFilter<"RefreshToken"> | string
    tokenHash?: StringFilter<"RefreshToken"> | string
    deviceInfo?: StringNullableFilter<"RefreshToken"> | string | null
    expiresAt?: DateTimeFilter<"RefreshToken"> | Date | string
    revokedAt?: DateTimeNullableFilter<"RefreshToken"> | Date | string | null
    createdAt?: DateTimeFilter<"RefreshToken"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type RefreshTokenOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    deviceInfo?: SortOrderInput | SortOrder
    expiresAt?: SortOrder
    revokedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type RefreshTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tokenHash?: string
    AND?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    OR?: RefreshTokenWhereInput[]
    NOT?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    userId?: UuidFilter<"RefreshToken"> | string
    deviceInfo?: StringNullableFilter<"RefreshToken"> | string | null
    expiresAt?: DateTimeFilter<"RefreshToken"> | Date | string
    revokedAt?: DateTimeNullableFilter<"RefreshToken"> | Date | string | null
    createdAt?: DateTimeFilter<"RefreshToken"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "tokenHash">

  export type RefreshTokenOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    deviceInfo?: SortOrderInput | SortOrder
    expiresAt?: SortOrder
    revokedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: RefreshTokenCountOrderByAggregateInput
    _max?: RefreshTokenMaxOrderByAggregateInput
    _min?: RefreshTokenMinOrderByAggregateInput
  }

  export type RefreshTokenScalarWhereWithAggregatesInput = {
    AND?: RefreshTokenScalarWhereWithAggregatesInput | RefreshTokenScalarWhereWithAggregatesInput[]
    OR?: RefreshTokenScalarWhereWithAggregatesInput[]
    NOT?: RefreshTokenScalarWhereWithAggregatesInput | RefreshTokenScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"RefreshToken"> | string
    userId?: UuidWithAggregatesFilter<"RefreshToken"> | string
    tokenHash?: StringWithAggregatesFilter<"RefreshToken"> | string
    deviceInfo?: StringNullableWithAggregatesFilter<"RefreshToken"> | string | null
    expiresAt?: DateTimeWithAggregatesFilter<"RefreshToken"> | Date | string
    revokedAt?: DateTimeNullableWithAggregatesFilter<"RefreshToken"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"RefreshToken"> | Date | string
  }

  export type MotherProfileWhereInput = {
    AND?: MotherProfileWhereInput | MotherProfileWhereInput[]
    OR?: MotherProfileWhereInput[]
    NOT?: MotherProfileWhereInput | MotherProfileWhereInput[]
    id?: UuidFilter<"MotherProfile"> | string
    userId?: UuidFilter<"MotherProfile"> | string
    participantCode?: StringNullableFilter<"MotherProfile"> | string | null
    studyGroup?: StringNullableFilter<"MotherProfile"> | string | null
    hospitalId?: UuidNullableFilter<"MotherProfile"> | string | null
    fullName?: StringNullableFilter<"MotherProfile"> | string | null
    ageRange?: StringFilter<"MotherProfile"> | string
    educationMother?: StringFilter<"MotherProfile"> | string
    educationFather?: StringFilter<"MotherProfile"> | string
    occupationMother?: StringFilter<"MotherProfile"> | string
    occupationFather?: StringFilter<"MotherProfile"> | string
    incomeClass?: StringFilter<"MotherProfile"> | string
    familyType?: StringFilter<"MotherProfile"> | string
    familyMembersCount?: StringFilter<"MotherProfile"> | string
    religion?: StringFilter<"MotherProfile"> | string
    residenceType?: StringFilter<"MotherProfile"> | string
    contactNumber?: StringNullableFilter<"MotherProfile"> | string | null
    prevPretermEducation?: BoolFilter<"MotherProfile"> | boolean
    educationSource?: StringNullableListFilter<"MotherProfile">
    enrolledAt?: DateTimeFilter<"MotherProfile"> | Date | string
    onboardingCompletedAt?: DateTimeNullableFilter<"MotherProfile"> | Date | string | null
    createdAt?: DateTimeFilter<"MotherProfile"> | Date | string
    updatedAt?: DateTimeFilter<"MotherProfile"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    hospital?: XOR<HospitalNullableScalarRelationFilter, HospitalWhereInput> | null
    babyProfile?: XOR<BabyProfileNullableScalarRelationFilter, BabyProfileWhereInput> | null
    followUpSchedules?: FollowUpScheduleListRelationFilter
  }

  export type MotherProfileOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    participantCode?: SortOrderInput | SortOrder
    studyGroup?: SortOrderInput | SortOrder
    hospitalId?: SortOrderInput | SortOrder
    fullName?: SortOrderInput | SortOrder
    ageRange?: SortOrder
    educationMother?: SortOrder
    educationFather?: SortOrder
    occupationMother?: SortOrder
    occupationFather?: SortOrder
    incomeClass?: SortOrder
    familyType?: SortOrder
    familyMembersCount?: SortOrder
    religion?: SortOrder
    residenceType?: SortOrder
    contactNumber?: SortOrderInput | SortOrder
    prevPretermEducation?: SortOrder
    educationSource?: SortOrder
    enrolledAt?: SortOrder
    onboardingCompletedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    hospital?: HospitalOrderByWithRelationInput
    babyProfile?: BabyProfileOrderByWithRelationInput
    followUpSchedules?: FollowUpScheduleOrderByRelationAggregateInput
  }

  export type MotherProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    participantCode?: string
    AND?: MotherProfileWhereInput | MotherProfileWhereInput[]
    OR?: MotherProfileWhereInput[]
    NOT?: MotherProfileWhereInput | MotherProfileWhereInput[]
    studyGroup?: StringNullableFilter<"MotherProfile"> | string | null
    hospitalId?: UuidNullableFilter<"MotherProfile"> | string | null
    fullName?: StringNullableFilter<"MotherProfile"> | string | null
    ageRange?: StringFilter<"MotherProfile"> | string
    educationMother?: StringFilter<"MotherProfile"> | string
    educationFather?: StringFilter<"MotherProfile"> | string
    occupationMother?: StringFilter<"MotherProfile"> | string
    occupationFather?: StringFilter<"MotherProfile"> | string
    incomeClass?: StringFilter<"MotherProfile"> | string
    familyType?: StringFilter<"MotherProfile"> | string
    familyMembersCount?: StringFilter<"MotherProfile"> | string
    religion?: StringFilter<"MotherProfile"> | string
    residenceType?: StringFilter<"MotherProfile"> | string
    contactNumber?: StringNullableFilter<"MotherProfile"> | string | null
    prevPretermEducation?: BoolFilter<"MotherProfile"> | boolean
    educationSource?: StringNullableListFilter<"MotherProfile">
    enrolledAt?: DateTimeFilter<"MotherProfile"> | Date | string
    onboardingCompletedAt?: DateTimeNullableFilter<"MotherProfile"> | Date | string | null
    createdAt?: DateTimeFilter<"MotherProfile"> | Date | string
    updatedAt?: DateTimeFilter<"MotherProfile"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    hospital?: XOR<HospitalNullableScalarRelationFilter, HospitalWhereInput> | null
    babyProfile?: XOR<BabyProfileNullableScalarRelationFilter, BabyProfileWhereInput> | null
    followUpSchedules?: FollowUpScheduleListRelationFilter
  }, "id" | "userId" | "participantCode">

  export type MotherProfileOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    participantCode?: SortOrderInput | SortOrder
    studyGroup?: SortOrderInput | SortOrder
    hospitalId?: SortOrderInput | SortOrder
    fullName?: SortOrderInput | SortOrder
    ageRange?: SortOrder
    educationMother?: SortOrder
    educationFather?: SortOrder
    occupationMother?: SortOrder
    occupationFather?: SortOrder
    incomeClass?: SortOrder
    familyType?: SortOrder
    familyMembersCount?: SortOrder
    religion?: SortOrder
    residenceType?: SortOrder
    contactNumber?: SortOrderInput | SortOrder
    prevPretermEducation?: SortOrder
    educationSource?: SortOrder
    enrolledAt?: SortOrder
    onboardingCompletedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MotherProfileCountOrderByAggregateInput
    _max?: MotherProfileMaxOrderByAggregateInput
    _min?: MotherProfileMinOrderByAggregateInput
  }

  export type MotherProfileScalarWhereWithAggregatesInput = {
    AND?: MotherProfileScalarWhereWithAggregatesInput | MotherProfileScalarWhereWithAggregatesInput[]
    OR?: MotherProfileScalarWhereWithAggregatesInput[]
    NOT?: MotherProfileScalarWhereWithAggregatesInput | MotherProfileScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"MotherProfile"> | string
    userId?: UuidWithAggregatesFilter<"MotherProfile"> | string
    participantCode?: StringNullableWithAggregatesFilter<"MotherProfile"> | string | null
    studyGroup?: StringNullableWithAggregatesFilter<"MotherProfile"> | string | null
    hospitalId?: UuidNullableWithAggregatesFilter<"MotherProfile"> | string | null
    fullName?: StringNullableWithAggregatesFilter<"MotherProfile"> | string | null
    ageRange?: StringWithAggregatesFilter<"MotherProfile"> | string
    educationMother?: StringWithAggregatesFilter<"MotherProfile"> | string
    educationFather?: StringWithAggregatesFilter<"MotherProfile"> | string
    occupationMother?: StringWithAggregatesFilter<"MotherProfile"> | string
    occupationFather?: StringWithAggregatesFilter<"MotherProfile"> | string
    incomeClass?: StringWithAggregatesFilter<"MotherProfile"> | string
    familyType?: StringWithAggregatesFilter<"MotherProfile"> | string
    familyMembersCount?: StringWithAggregatesFilter<"MotherProfile"> | string
    religion?: StringWithAggregatesFilter<"MotherProfile"> | string
    residenceType?: StringWithAggregatesFilter<"MotherProfile"> | string
    contactNumber?: StringNullableWithAggregatesFilter<"MotherProfile"> | string | null
    prevPretermEducation?: BoolWithAggregatesFilter<"MotherProfile"> | boolean
    educationSource?: StringNullableListFilter<"MotherProfile">
    enrolledAt?: DateTimeWithAggregatesFilter<"MotherProfile"> | Date | string
    onboardingCompletedAt?: DateTimeNullableWithAggregatesFilter<"MotherProfile"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"MotherProfile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"MotherProfile"> | Date | string
  }

  export type BabyProfileWhereInput = {
    AND?: BabyProfileWhereInput | BabyProfileWhereInput[]
    OR?: BabyProfileWhereInput[]
    NOT?: BabyProfileWhereInput | BabyProfileWhereInput[]
    id?: UuidFilter<"BabyProfile"> | string
    motherProfileId?: UuidFilter<"BabyProfile"> | string
    babyName?: StringNullableFilter<"BabyProfile"> | string | null
    sex?: StringFilter<"BabyProfile"> | string
    dateOfBirth?: DateTimeFilter<"BabyProfile"> | Date | string
    gestationalAgeWeeks?: DecimalFilter<"BabyProfile"> | Decimal | DecimalJsLike | number | string
    birthWeightGrams?: IntFilter<"BabyProfile"> | number
    weightAtDischargeGrams?: IntFilter<"BabyProfile"> | number
    placeOfDelivery?: StringFilter<"BabyProfile"> | string
    nicuStayDays?: IntFilter<"BabyProfile"> | number
    skinToSkinAtBirth?: BoolFilter<"BabyProfile"> | boolean
    kmcInNicu?: BoolFilter<"BabyProfile"> | boolean
    feedingAtDischarge?: StringFilter<"BabyProfile"> | string
    criedAtBirth?: BoolFilter<"BabyProfile"> | boolean
    neededResuscitation?: BoolFilter<"BabyProfile"> | boolean
    birthWeightStratum?: StringFilter<"BabyProfile"> | string
    dischargeDate?: DateTimeFilter<"BabyProfile"> | Date | string
    createdAt?: DateTimeFilter<"BabyProfile"> | Date | string
    updatedAt?: DateTimeFilter<"BabyProfile"> | Date | string
    motherProfile?: XOR<MotherProfileScalarRelationFilter, MotherProfileWhereInput>
  }

  export type BabyProfileOrderByWithRelationInput = {
    id?: SortOrder
    motherProfileId?: SortOrder
    babyName?: SortOrderInput | SortOrder
    sex?: SortOrder
    dateOfBirth?: SortOrder
    gestationalAgeWeeks?: SortOrder
    birthWeightGrams?: SortOrder
    weightAtDischargeGrams?: SortOrder
    placeOfDelivery?: SortOrder
    nicuStayDays?: SortOrder
    skinToSkinAtBirth?: SortOrder
    kmcInNicu?: SortOrder
    feedingAtDischarge?: SortOrder
    criedAtBirth?: SortOrder
    neededResuscitation?: SortOrder
    birthWeightStratum?: SortOrder
    dischargeDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    motherProfile?: MotherProfileOrderByWithRelationInput
  }

  export type BabyProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    motherProfileId?: string
    AND?: BabyProfileWhereInput | BabyProfileWhereInput[]
    OR?: BabyProfileWhereInput[]
    NOT?: BabyProfileWhereInput | BabyProfileWhereInput[]
    babyName?: StringNullableFilter<"BabyProfile"> | string | null
    sex?: StringFilter<"BabyProfile"> | string
    dateOfBirth?: DateTimeFilter<"BabyProfile"> | Date | string
    gestationalAgeWeeks?: DecimalFilter<"BabyProfile"> | Decimal | DecimalJsLike | number | string
    birthWeightGrams?: IntFilter<"BabyProfile"> | number
    weightAtDischargeGrams?: IntFilter<"BabyProfile"> | number
    placeOfDelivery?: StringFilter<"BabyProfile"> | string
    nicuStayDays?: IntFilter<"BabyProfile"> | number
    skinToSkinAtBirth?: BoolFilter<"BabyProfile"> | boolean
    kmcInNicu?: BoolFilter<"BabyProfile"> | boolean
    feedingAtDischarge?: StringFilter<"BabyProfile"> | string
    criedAtBirth?: BoolFilter<"BabyProfile"> | boolean
    neededResuscitation?: BoolFilter<"BabyProfile"> | boolean
    birthWeightStratum?: StringFilter<"BabyProfile"> | string
    dischargeDate?: DateTimeFilter<"BabyProfile"> | Date | string
    createdAt?: DateTimeFilter<"BabyProfile"> | Date | string
    updatedAt?: DateTimeFilter<"BabyProfile"> | Date | string
    motherProfile?: XOR<MotherProfileScalarRelationFilter, MotherProfileWhereInput>
  }, "id" | "motherProfileId">

  export type BabyProfileOrderByWithAggregationInput = {
    id?: SortOrder
    motherProfileId?: SortOrder
    babyName?: SortOrderInput | SortOrder
    sex?: SortOrder
    dateOfBirth?: SortOrder
    gestationalAgeWeeks?: SortOrder
    birthWeightGrams?: SortOrder
    weightAtDischargeGrams?: SortOrder
    placeOfDelivery?: SortOrder
    nicuStayDays?: SortOrder
    skinToSkinAtBirth?: SortOrder
    kmcInNicu?: SortOrder
    feedingAtDischarge?: SortOrder
    criedAtBirth?: SortOrder
    neededResuscitation?: SortOrder
    birthWeightStratum?: SortOrder
    dischargeDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BabyProfileCountOrderByAggregateInput
    _avg?: BabyProfileAvgOrderByAggregateInput
    _max?: BabyProfileMaxOrderByAggregateInput
    _min?: BabyProfileMinOrderByAggregateInput
    _sum?: BabyProfileSumOrderByAggregateInput
  }

  export type BabyProfileScalarWhereWithAggregatesInput = {
    AND?: BabyProfileScalarWhereWithAggregatesInput | BabyProfileScalarWhereWithAggregatesInput[]
    OR?: BabyProfileScalarWhereWithAggregatesInput[]
    NOT?: BabyProfileScalarWhereWithAggregatesInput | BabyProfileScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"BabyProfile"> | string
    motherProfileId?: UuidWithAggregatesFilter<"BabyProfile"> | string
    babyName?: StringNullableWithAggregatesFilter<"BabyProfile"> | string | null
    sex?: StringWithAggregatesFilter<"BabyProfile"> | string
    dateOfBirth?: DateTimeWithAggregatesFilter<"BabyProfile"> | Date | string
    gestationalAgeWeeks?: DecimalWithAggregatesFilter<"BabyProfile"> | Decimal | DecimalJsLike | number | string
    birthWeightGrams?: IntWithAggregatesFilter<"BabyProfile"> | number
    weightAtDischargeGrams?: IntWithAggregatesFilter<"BabyProfile"> | number
    placeOfDelivery?: StringWithAggregatesFilter<"BabyProfile"> | string
    nicuStayDays?: IntWithAggregatesFilter<"BabyProfile"> | number
    skinToSkinAtBirth?: BoolWithAggregatesFilter<"BabyProfile"> | boolean
    kmcInNicu?: BoolWithAggregatesFilter<"BabyProfile"> | boolean
    feedingAtDischarge?: StringWithAggregatesFilter<"BabyProfile"> | string
    criedAtBirth?: BoolWithAggregatesFilter<"BabyProfile"> | boolean
    neededResuscitation?: BoolWithAggregatesFilter<"BabyProfile"> | boolean
    birthWeightStratum?: StringWithAggregatesFilter<"BabyProfile"> | string
    dischargeDate?: DateTimeWithAggregatesFilter<"BabyProfile"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"BabyProfile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"BabyProfile"> | Date | string
  }

  export type NurseProfileWhereInput = {
    AND?: NurseProfileWhereInput | NurseProfileWhereInput[]
    OR?: NurseProfileWhereInput[]
    NOT?: NurseProfileWhereInput | NurseProfileWhereInput[]
    id?: UuidFilter<"NurseProfile"> | string
    userId?: UuidFilter<"NurseProfile"> | string
    hospitalId?: UuidFilter<"NurseProfile"> | string
    fullName?: StringFilter<"NurseProfile"> | string
    employeeId?: StringNullableFilter<"NurseProfile"> | string | null
    isActive?: BoolFilter<"NurseProfile"> | boolean
    createdAt?: DateTimeFilter<"NurseProfile"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    hospital?: XOR<HospitalScalarRelationFilter, HospitalWhereInput>
  }

  export type NurseProfileOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    hospitalId?: SortOrder
    fullName?: SortOrder
    employeeId?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    hospital?: HospitalOrderByWithRelationInput
  }

  export type NurseProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: NurseProfileWhereInput | NurseProfileWhereInput[]
    OR?: NurseProfileWhereInput[]
    NOT?: NurseProfileWhereInput | NurseProfileWhereInput[]
    hospitalId?: UuidFilter<"NurseProfile"> | string
    fullName?: StringFilter<"NurseProfile"> | string
    employeeId?: StringNullableFilter<"NurseProfile"> | string | null
    isActive?: BoolFilter<"NurseProfile"> | boolean
    createdAt?: DateTimeFilter<"NurseProfile"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    hospital?: XOR<HospitalScalarRelationFilter, HospitalWhereInput>
  }, "id" | "userId">

  export type NurseProfileOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    hospitalId?: SortOrder
    fullName?: SortOrder
    employeeId?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    _count?: NurseProfileCountOrderByAggregateInput
    _max?: NurseProfileMaxOrderByAggregateInput
    _min?: NurseProfileMinOrderByAggregateInput
  }

  export type NurseProfileScalarWhereWithAggregatesInput = {
    AND?: NurseProfileScalarWhereWithAggregatesInput | NurseProfileScalarWhereWithAggregatesInput[]
    OR?: NurseProfileScalarWhereWithAggregatesInput[]
    NOT?: NurseProfileScalarWhereWithAggregatesInput | NurseProfileScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"NurseProfile"> | string
    userId?: UuidWithAggregatesFilter<"NurseProfile"> | string
    hospitalId?: UuidWithAggregatesFilter<"NurseProfile"> | string
    fullName?: StringWithAggregatesFilter<"NurseProfile"> | string
    employeeId?: StringNullableWithAggregatesFilter<"NurseProfile"> | string | null
    isActive?: BoolWithAggregatesFilter<"NurseProfile"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"NurseProfile"> | Date | string
  }

  export type ResearcherProfileWhereInput = {
    AND?: ResearcherProfileWhereInput | ResearcherProfileWhereInput[]
    OR?: ResearcherProfileWhereInput[]
    NOT?: ResearcherProfileWhereInput | ResearcherProfileWhereInput[]
    id?: UuidFilter<"ResearcherProfile"> | string
    userId?: UuidFilter<"ResearcherProfile"> | string
    fullName?: StringFilter<"ResearcherProfile"> | string
    designation?: StringNullableFilter<"ResearcherProfile"> | string | null
    email?: StringFilter<"ResearcherProfile"> | string
    accessLevel?: StringFilter<"ResearcherProfile"> | string
    createdAt?: DateTimeFilter<"ResearcherProfile"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type ResearcherProfileOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    fullName?: SortOrder
    designation?: SortOrderInput | SortOrder
    email?: SortOrder
    accessLevel?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type ResearcherProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    email?: string
    AND?: ResearcherProfileWhereInput | ResearcherProfileWhereInput[]
    OR?: ResearcherProfileWhereInput[]
    NOT?: ResearcherProfileWhereInput | ResearcherProfileWhereInput[]
    fullName?: StringFilter<"ResearcherProfile"> | string
    designation?: StringNullableFilter<"ResearcherProfile"> | string | null
    accessLevel?: StringFilter<"ResearcherProfile"> | string
    createdAt?: DateTimeFilter<"ResearcherProfile"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId" | "email">

  export type ResearcherProfileOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    fullName?: SortOrder
    designation?: SortOrderInput | SortOrder
    email?: SortOrder
    accessLevel?: SortOrder
    createdAt?: SortOrder
    _count?: ResearcherProfileCountOrderByAggregateInput
    _max?: ResearcherProfileMaxOrderByAggregateInput
    _min?: ResearcherProfileMinOrderByAggregateInput
  }

  export type ResearcherProfileScalarWhereWithAggregatesInput = {
    AND?: ResearcherProfileScalarWhereWithAggregatesInput | ResearcherProfileScalarWhereWithAggregatesInput[]
    OR?: ResearcherProfileScalarWhereWithAggregatesInput[]
    NOT?: ResearcherProfileScalarWhereWithAggregatesInput | ResearcherProfileScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ResearcherProfile"> | string
    userId?: UuidWithAggregatesFilter<"ResearcherProfile"> | string
    fullName?: StringWithAggregatesFilter<"ResearcherProfile"> | string
    designation?: StringNullableWithAggregatesFilter<"ResearcherProfile"> | string | null
    email?: StringWithAggregatesFilter<"ResearcherProfile"> | string
    accessLevel?: StringWithAggregatesFilter<"ResearcherProfile"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ResearcherProfile"> | Date | string
  }

  export type FollowUpScheduleWhereInput = {
    AND?: FollowUpScheduleWhereInput | FollowUpScheduleWhereInput[]
    OR?: FollowUpScheduleWhereInput[]
    NOT?: FollowUpScheduleWhereInput | FollowUpScheduleWhereInput[]
    id?: UuidFilter<"FollowUpSchedule"> | string
    motherProfileId?: UuidFilter<"FollowUpSchedule"> | string
    timePoint?: StringFilter<"FollowUpSchedule"> | string
    scheduledDate?: DateTimeFilter<"FollowUpSchedule"> | Date | string
    actualDate?: DateTimeNullableFilter<"FollowUpSchedule"> | Date | string | null
    status?: StringFilter<"FollowUpSchedule"> | string
    dataComplete?: BoolFilter<"FollowUpSchedule"> | boolean
    collectedByUserId?: UuidNullableFilter<"FollowUpSchedule"> | string | null
    notes?: StringNullableFilter<"FollowUpSchedule"> | string | null
    createdAt?: DateTimeFilter<"FollowUpSchedule"> | Date | string
    updatedAt?: DateTimeFilter<"FollowUpSchedule"> | Date | string
    motherProfile?: XOR<MotherProfileScalarRelationFilter, MotherProfileWhereInput>
  }

  export type FollowUpScheduleOrderByWithRelationInput = {
    id?: SortOrder
    motherProfileId?: SortOrder
    timePoint?: SortOrder
    scheduledDate?: SortOrder
    actualDate?: SortOrderInput | SortOrder
    status?: SortOrder
    dataComplete?: SortOrder
    collectedByUserId?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    motherProfile?: MotherProfileOrderByWithRelationInput
  }

  export type FollowUpScheduleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    motherProfileId_timePoint?: FollowUpScheduleMotherProfileIdTimePointCompoundUniqueInput
    AND?: FollowUpScheduleWhereInput | FollowUpScheduleWhereInput[]
    OR?: FollowUpScheduleWhereInput[]
    NOT?: FollowUpScheduleWhereInput | FollowUpScheduleWhereInput[]
    motherProfileId?: UuidFilter<"FollowUpSchedule"> | string
    timePoint?: StringFilter<"FollowUpSchedule"> | string
    scheduledDate?: DateTimeFilter<"FollowUpSchedule"> | Date | string
    actualDate?: DateTimeNullableFilter<"FollowUpSchedule"> | Date | string | null
    status?: StringFilter<"FollowUpSchedule"> | string
    dataComplete?: BoolFilter<"FollowUpSchedule"> | boolean
    collectedByUserId?: UuidNullableFilter<"FollowUpSchedule"> | string | null
    notes?: StringNullableFilter<"FollowUpSchedule"> | string | null
    createdAt?: DateTimeFilter<"FollowUpSchedule"> | Date | string
    updatedAt?: DateTimeFilter<"FollowUpSchedule"> | Date | string
    motherProfile?: XOR<MotherProfileScalarRelationFilter, MotherProfileWhereInput>
  }, "id" | "motherProfileId_timePoint">

  export type FollowUpScheduleOrderByWithAggregationInput = {
    id?: SortOrder
    motherProfileId?: SortOrder
    timePoint?: SortOrder
    scheduledDate?: SortOrder
    actualDate?: SortOrderInput | SortOrder
    status?: SortOrder
    dataComplete?: SortOrder
    collectedByUserId?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FollowUpScheduleCountOrderByAggregateInput
    _max?: FollowUpScheduleMaxOrderByAggregateInput
    _min?: FollowUpScheduleMinOrderByAggregateInput
  }

  export type FollowUpScheduleScalarWhereWithAggregatesInput = {
    AND?: FollowUpScheduleScalarWhereWithAggregatesInput | FollowUpScheduleScalarWhereWithAggregatesInput[]
    OR?: FollowUpScheduleScalarWhereWithAggregatesInput[]
    NOT?: FollowUpScheduleScalarWhereWithAggregatesInput | FollowUpScheduleScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"FollowUpSchedule"> | string
    motherProfileId?: UuidWithAggregatesFilter<"FollowUpSchedule"> | string
    timePoint?: StringWithAggregatesFilter<"FollowUpSchedule"> | string
    scheduledDate?: DateTimeWithAggregatesFilter<"FollowUpSchedule"> | Date | string
    actualDate?: DateTimeNullableWithAggregatesFilter<"FollowUpSchedule"> | Date | string | null
    status?: StringWithAggregatesFilter<"FollowUpSchedule"> | string
    dataComplete?: BoolWithAggregatesFilter<"FollowUpSchedule"> | boolean
    collectedByUserId?: UuidNullableWithAggregatesFilter<"FollowUpSchedule"> | string | null
    notes?: StringNullableWithAggregatesFilter<"FollowUpSchedule"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"FollowUpSchedule"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"FollowUpSchedule"> | Date | string
  }

  export type HospitalCreateInput = {
    id?: string
    name: string
    code: string
    district: string
    state?: string
    type: string
    emergencyPhone?: string | null
    isActive?: boolean
    nextParticipantNumber?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserCreateNestedManyWithoutHospitalInput
    motherProfiles?: MotherProfileCreateNestedManyWithoutHospitalInput
    nurseProfiles?: NurseProfileCreateNestedManyWithoutHospitalInput
  }

  export type HospitalUncheckedCreateInput = {
    id?: string
    name: string
    code: string
    district: string
    state?: string
    type: string
    emergencyPhone?: string | null
    isActive?: boolean
    nextParticipantNumber?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutHospitalInput
    motherProfiles?: MotherProfileUncheckedCreateNestedManyWithoutHospitalInput
    nurseProfiles?: NurseProfileUncheckedCreateNestedManyWithoutHospitalInput
  }

  export type HospitalUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    district?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    nextParticipantNumber?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutHospitalNestedInput
    motherProfiles?: MotherProfileUpdateManyWithoutHospitalNestedInput
    nurseProfiles?: NurseProfileUpdateManyWithoutHospitalNestedInput
  }

  export type HospitalUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    district?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    nextParticipantNumber?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutHospitalNestedInput
    motherProfiles?: MotherProfileUncheckedUpdateManyWithoutHospitalNestedInput
    nurseProfiles?: NurseProfileUncheckedUpdateManyWithoutHospitalNestedInput
  }

  export type HospitalCreateManyInput = {
    id?: string
    name: string
    code: string
    district: string
    state?: string
    type: string
    emergencyPhone?: string | null
    isActive?: boolean
    nextParticipantNumber?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type HospitalUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    district?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    nextParticipantNumber?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HospitalUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    district?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    nextParticipantNumber?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    id?: string
    phone: string
    phoneVerified?: boolean
    email?: string | null
    passwordHash: string
    pinHash?: string | null
    role: string
    preferredLanguage?: string
    isActive?: boolean
    lastLoginAt?: Date | string | null
    failedPasswordAttempts?: number
    passwordLockedUntil?: Date | string | null
    failedPinAttempts?: number
    pinLockedUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    hospital?: HospitalCreateNestedOneWithoutUsersInput
    motherProfile?: MotherProfileCreateNestedOneWithoutUserInput
    nurseProfile?: NurseProfileCreateNestedOneWithoutUserInput
    researcherProfile?: ResearcherProfileCreateNestedOneWithoutUserInput
    refreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    phone: string
    phoneVerified?: boolean
    email?: string | null
    passwordHash: string
    pinHash?: string | null
    role: string
    preferredLanguage?: string
    hospitalId?: string | null
    isActive?: boolean
    lastLoginAt?: Date | string | null
    failedPasswordAttempts?: number
    passwordLockedUntil?: Date | string | null
    failedPinAttempts?: number
    pinLockedUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    motherProfile?: MotherProfileUncheckedCreateNestedOneWithoutUserInput
    nurseProfile?: NurseProfileUncheckedCreateNestedOneWithoutUserInput
    researcherProfile?: ResearcherProfileUncheckedCreateNestedOneWithoutUserInput
    refreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    phoneVerified?: BoolFieldUpdateOperationsInput | boolean
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    pinHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedPasswordAttempts?: IntFieldUpdateOperationsInput | number
    passwordLockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedPinAttempts?: IntFieldUpdateOperationsInput | number
    pinLockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    hospital?: HospitalUpdateOneWithoutUsersNestedInput
    motherProfile?: MotherProfileUpdateOneWithoutUserNestedInput
    nurseProfile?: NurseProfileUpdateOneWithoutUserNestedInput
    researcherProfile?: ResearcherProfileUpdateOneWithoutUserNestedInput
    refreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    phoneVerified?: BoolFieldUpdateOperationsInput | boolean
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    pinHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    hospitalId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedPasswordAttempts?: IntFieldUpdateOperationsInput | number
    passwordLockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedPinAttempts?: IntFieldUpdateOperationsInput | number
    pinLockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    motherProfile?: MotherProfileUncheckedUpdateOneWithoutUserNestedInput
    nurseProfile?: NurseProfileUncheckedUpdateOneWithoutUserNestedInput
    researcherProfile?: ResearcherProfileUncheckedUpdateOneWithoutUserNestedInput
    refreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    phone: string
    phoneVerified?: boolean
    email?: string | null
    passwordHash: string
    pinHash?: string | null
    role: string
    preferredLanguage?: string
    hospitalId?: string | null
    isActive?: boolean
    lastLoginAt?: Date | string | null
    failedPasswordAttempts?: number
    passwordLockedUntil?: Date | string | null
    failedPinAttempts?: number
    pinLockedUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    phoneVerified?: BoolFieldUpdateOperationsInput | boolean
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    pinHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedPasswordAttempts?: IntFieldUpdateOperationsInput | number
    passwordLockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedPinAttempts?: IntFieldUpdateOperationsInput | number
    pinLockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    phoneVerified?: BoolFieldUpdateOperationsInput | boolean
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    pinHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    hospitalId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedPasswordAttempts?: IntFieldUpdateOperationsInput | number
    passwordLockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedPinAttempts?: IntFieldUpdateOperationsInput | number
    pinLockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type OtpVerificationCreateInput = {
    id?: string
    phone: string
    otpHash: string
    purpose: string
    isUsed?: boolean
    attempts?: number
    expiresAt: Date | string
    createdAt?: Date | string
    usedAt?: Date | string | null
  }

  export type OtpVerificationUncheckedCreateInput = {
    id?: string
    phone: string
    otpHash: string
    purpose: string
    isUsed?: boolean
    attempts?: number
    expiresAt: Date | string
    createdAt?: Date | string
    usedAt?: Date | string | null
  }

  export type OtpVerificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    otpHash?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    isUsed?: BoolFieldUpdateOperationsInput | boolean
    attempts?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type OtpVerificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    otpHash?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    isUsed?: BoolFieldUpdateOperationsInput | boolean
    attempts?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type OtpVerificationCreateManyInput = {
    id?: string
    phone: string
    otpHash: string
    purpose: string
    isUsed?: boolean
    attempts?: number
    expiresAt: Date | string
    createdAt?: Date | string
    usedAt?: Date | string | null
  }

  export type OtpVerificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    otpHash?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    isUsed?: BoolFieldUpdateOperationsInput | boolean
    attempts?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type OtpVerificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    otpHash?: StringFieldUpdateOperationsInput | string
    purpose?: StringFieldUpdateOperationsInput | string
    isUsed?: BoolFieldUpdateOperationsInput | boolean
    attempts?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RefreshTokenCreateInput = {
    id?: string
    tokenHash: string
    deviceInfo?: string | null
    expiresAt: Date | string
    revokedAt?: Date | string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutRefreshTokensInput
  }

  export type RefreshTokenUncheckedCreateInput = {
    id?: string
    userId: string
    tokenHash: string
    deviceInfo?: string | null
    expiresAt: Date | string
    revokedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type RefreshTokenUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutRefreshTokensNestedInput
  }

  export type RefreshTokenUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenCreateManyInput = {
    id?: string
    userId: string
    tokenHash: string
    deviceInfo?: string | null
    expiresAt: Date | string
    revokedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type RefreshTokenUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MotherProfileCreateInput = {
    id?: string
    participantCode?: string | null
    studyGroup?: string | null
    fullName?: string | null
    ageRange: string
    educationMother: string
    educationFather: string
    occupationMother: string
    occupationFather: string
    incomeClass: string
    familyType: string
    familyMembersCount: string
    religion: string
    residenceType: string
    contactNumber?: string | null
    prevPretermEducation?: boolean
    educationSource?: MotherProfileCreateeducationSourceInput | string[]
    enrolledAt?: Date | string
    onboardingCompletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutMotherProfileInput
    hospital?: HospitalCreateNestedOneWithoutMotherProfilesInput
    babyProfile?: BabyProfileCreateNestedOneWithoutMotherProfileInput
    followUpSchedules?: FollowUpScheduleCreateNestedManyWithoutMotherProfileInput
  }

  export type MotherProfileUncheckedCreateInput = {
    id?: string
    userId: string
    participantCode?: string | null
    studyGroup?: string | null
    hospitalId?: string | null
    fullName?: string | null
    ageRange: string
    educationMother: string
    educationFather: string
    occupationMother: string
    occupationFather: string
    incomeClass: string
    familyType: string
    familyMembersCount: string
    religion: string
    residenceType: string
    contactNumber?: string | null
    prevPretermEducation?: boolean
    educationSource?: MotherProfileCreateeducationSourceInput | string[]
    enrolledAt?: Date | string
    onboardingCompletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    babyProfile?: BabyProfileUncheckedCreateNestedOneWithoutMotherProfileInput
    followUpSchedules?: FollowUpScheduleUncheckedCreateNestedManyWithoutMotherProfileInput
  }

  export type MotherProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    participantCode?: NullableStringFieldUpdateOperationsInput | string | null
    studyGroup?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    ageRange?: StringFieldUpdateOperationsInput | string
    educationMother?: StringFieldUpdateOperationsInput | string
    educationFather?: StringFieldUpdateOperationsInput | string
    occupationMother?: StringFieldUpdateOperationsInput | string
    occupationFather?: StringFieldUpdateOperationsInput | string
    incomeClass?: StringFieldUpdateOperationsInput | string
    familyType?: StringFieldUpdateOperationsInput | string
    familyMembersCount?: StringFieldUpdateOperationsInput | string
    religion?: StringFieldUpdateOperationsInput | string
    residenceType?: StringFieldUpdateOperationsInput | string
    contactNumber?: NullableStringFieldUpdateOperationsInput | string | null
    prevPretermEducation?: BoolFieldUpdateOperationsInput | boolean
    educationSource?: MotherProfileUpdateeducationSourceInput | string[]
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMotherProfileNestedInput
    hospital?: HospitalUpdateOneWithoutMotherProfilesNestedInput
    babyProfile?: BabyProfileUpdateOneWithoutMotherProfileNestedInput
    followUpSchedules?: FollowUpScheduleUpdateManyWithoutMotherProfileNestedInput
  }

  export type MotherProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    participantCode?: NullableStringFieldUpdateOperationsInput | string | null
    studyGroup?: NullableStringFieldUpdateOperationsInput | string | null
    hospitalId?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    ageRange?: StringFieldUpdateOperationsInput | string
    educationMother?: StringFieldUpdateOperationsInput | string
    educationFather?: StringFieldUpdateOperationsInput | string
    occupationMother?: StringFieldUpdateOperationsInput | string
    occupationFather?: StringFieldUpdateOperationsInput | string
    incomeClass?: StringFieldUpdateOperationsInput | string
    familyType?: StringFieldUpdateOperationsInput | string
    familyMembersCount?: StringFieldUpdateOperationsInput | string
    religion?: StringFieldUpdateOperationsInput | string
    residenceType?: StringFieldUpdateOperationsInput | string
    contactNumber?: NullableStringFieldUpdateOperationsInput | string | null
    prevPretermEducation?: BoolFieldUpdateOperationsInput | boolean
    educationSource?: MotherProfileUpdateeducationSourceInput | string[]
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    babyProfile?: BabyProfileUncheckedUpdateOneWithoutMotherProfileNestedInput
    followUpSchedules?: FollowUpScheduleUncheckedUpdateManyWithoutMotherProfileNestedInput
  }

  export type MotherProfileCreateManyInput = {
    id?: string
    userId: string
    participantCode?: string | null
    studyGroup?: string | null
    hospitalId?: string | null
    fullName?: string | null
    ageRange: string
    educationMother: string
    educationFather: string
    occupationMother: string
    occupationFather: string
    incomeClass: string
    familyType: string
    familyMembersCount: string
    religion: string
    residenceType: string
    contactNumber?: string | null
    prevPretermEducation?: boolean
    educationSource?: MotherProfileCreateeducationSourceInput | string[]
    enrolledAt?: Date | string
    onboardingCompletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MotherProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    participantCode?: NullableStringFieldUpdateOperationsInput | string | null
    studyGroup?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    ageRange?: StringFieldUpdateOperationsInput | string
    educationMother?: StringFieldUpdateOperationsInput | string
    educationFather?: StringFieldUpdateOperationsInput | string
    occupationMother?: StringFieldUpdateOperationsInput | string
    occupationFather?: StringFieldUpdateOperationsInput | string
    incomeClass?: StringFieldUpdateOperationsInput | string
    familyType?: StringFieldUpdateOperationsInput | string
    familyMembersCount?: StringFieldUpdateOperationsInput | string
    religion?: StringFieldUpdateOperationsInput | string
    residenceType?: StringFieldUpdateOperationsInput | string
    contactNumber?: NullableStringFieldUpdateOperationsInput | string | null
    prevPretermEducation?: BoolFieldUpdateOperationsInput | boolean
    educationSource?: MotherProfileUpdateeducationSourceInput | string[]
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MotherProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    participantCode?: NullableStringFieldUpdateOperationsInput | string | null
    studyGroup?: NullableStringFieldUpdateOperationsInput | string | null
    hospitalId?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    ageRange?: StringFieldUpdateOperationsInput | string
    educationMother?: StringFieldUpdateOperationsInput | string
    educationFather?: StringFieldUpdateOperationsInput | string
    occupationMother?: StringFieldUpdateOperationsInput | string
    occupationFather?: StringFieldUpdateOperationsInput | string
    incomeClass?: StringFieldUpdateOperationsInput | string
    familyType?: StringFieldUpdateOperationsInput | string
    familyMembersCount?: StringFieldUpdateOperationsInput | string
    religion?: StringFieldUpdateOperationsInput | string
    residenceType?: StringFieldUpdateOperationsInput | string
    contactNumber?: NullableStringFieldUpdateOperationsInput | string | null
    prevPretermEducation?: BoolFieldUpdateOperationsInput | boolean
    educationSource?: MotherProfileUpdateeducationSourceInput | string[]
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BabyProfileCreateInput = {
    id?: string
    babyName?: string | null
    sex: string
    dateOfBirth: Date | string
    gestationalAgeWeeks: Decimal | DecimalJsLike | number | string
    birthWeightGrams: number
    weightAtDischargeGrams: number
    placeOfDelivery: string
    nicuStayDays: number
    skinToSkinAtBirth: boolean
    kmcInNicu: boolean
    feedingAtDischarge: string
    criedAtBirth: boolean
    neededResuscitation: boolean
    birthWeightStratum: string
    dischargeDate: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    motherProfile: MotherProfileCreateNestedOneWithoutBabyProfileInput
  }

  export type BabyProfileUncheckedCreateInput = {
    id?: string
    motherProfileId: string
    babyName?: string | null
    sex: string
    dateOfBirth: Date | string
    gestationalAgeWeeks: Decimal | DecimalJsLike | number | string
    birthWeightGrams: number
    weightAtDischargeGrams: number
    placeOfDelivery: string
    nicuStayDays: number
    skinToSkinAtBirth: boolean
    kmcInNicu: boolean
    feedingAtDischarge: string
    criedAtBirth: boolean
    neededResuscitation: boolean
    birthWeightStratum: string
    dischargeDate: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BabyProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    babyName?: NullableStringFieldUpdateOperationsInput | string | null
    sex?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gestationalAgeWeeks?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    birthWeightGrams?: IntFieldUpdateOperationsInput | number
    weightAtDischargeGrams?: IntFieldUpdateOperationsInput | number
    placeOfDelivery?: StringFieldUpdateOperationsInput | string
    nicuStayDays?: IntFieldUpdateOperationsInput | number
    skinToSkinAtBirth?: BoolFieldUpdateOperationsInput | boolean
    kmcInNicu?: BoolFieldUpdateOperationsInput | boolean
    feedingAtDischarge?: StringFieldUpdateOperationsInput | string
    criedAtBirth?: BoolFieldUpdateOperationsInput | boolean
    neededResuscitation?: BoolFieldUpdateOperationsInput | boolean
    birthWeightStratum?: StringFieldUpdateOperationsInput | string
    dischargeDate?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    motherProfile?: MotherProfileUpdateOneRequiredWithoutBabyProfileNestedInput
  }

  export type BabyProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    motherProfileId?: StringFieldUpdateOperationsInput | string
    babyName?: NullableStringFieldUpdateOperationsInput | string | null
    sex?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gestationalAgeWeeks?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    birthWeightGrams?: IntFieldUpdateOperationsInput | number
    weightAtDischargeGrams?: IntFieldUpdateOperationsInput | number
    placeOfDelivery?: StringFieldUpdateOperationsInput | string
    nicuStayDays?: IntFieldUpdateOperationsInput | number
    skinToSkinAtBirth?: BoolFieldUpdateOperationsInput | boolean
    kmcInNicu?: BoolFieldUpdateOperationsInput | boolean
    feedingAtDischarge?: StringFieldUpdateOperationsInput | string
    criedAtBirth?: BoolFieldUpdateOperationsInput | boolean
    neededResuscitation?: BoolFieldUpdateOperationsInput | boolean
    birthWeightStratum?: StringFieldUpdateOperationsInput | string
    dischargeDate?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BabyProfileCreateManyInput = {
    id?: string
    motherProfileId: string
    babyName?: string | null
    sex: string
    dateOfBirth: Date | string
    gestationalAgeWeeks: Decimal | DecimalJsLike | number | string
    birthWeightGrams: number
    weightAtDischargeGrams: number
    placeOfDelivery: string
    nicuStayDays: number
    skinToSkinAtBirth: boolean
    kmcInNicu: boolean
    feedingAtDischarge: string
    criedAtBirth: boolean
    neededResuscitation: boolean
    birthWeightStratum: string
    dischargeDate: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BabyProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    babyName?: NullableStringFieldUpdateOperationsInput | string | null
    sex?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gestationalAgeWeeks?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    birthWeightGrams?: IntFieldUpdateOperationsInput | number
    weightAtDischargeGrams?: IntFieldUpdateOperationsInput | number
    placeOfDelivery?: StringFieldUpdateOperationsInput | string
    nicuStayDays?: IntFieldUpdateOperationsInput | number
    skinToSkinAtBirth?: BoolFieldUpdateOperationsInput | boolean
    kmcInNicu?: BoolFieldUpdateOperationsInput | boolean
    feedingAtDischarge?: StringFieldUpdateOperationsInput | string
    criedAtBirth?: BoolFieldUpdateOperationsInput | boolean
    neededResuscitation?: BoolFieldUpdateOperationsInput | boolean
    birthWeightStratum?: StringFieldUpdateOperationsInput | string
    dischargeDate?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BabyProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    motherProfileId?: StringFieldUpdateOperationsInput | string
    babyName?: NullableStringFieldUpdateOperationsInput | string | null
    sex?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gestationalAgeWeeks?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    birthWeightGrams?: IntFieldUpdateOperationsInput | number
    weightAtDischargeGrams?: IntFieldUpdateOperationsInput | number
    placeOfDelivery?: StringFieldUpdateOperationsInput | string
    nicuStayDays?: IntFieldUpdateOperationsInput | number
    skinToSkinAtBirth?: BoolFieldUpdateOperationsInput | boolean
    kmcInNicu?: BoolFieldUpdateOperationsInput | boolean
    feedingAtDischarge?: StringFieldUpdateOperationsInput | string
    criedAtBirth?: BoolFieldUpdateOperationsInput | boolean
    neededResuscitation?: BoolFieldUpdateOperationsInput | boolean
    birthWeightStratum?: StringFieldUpdateOperationsInput | string
    dischargeDate?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NurseProfileCreateInput = {
    id?: string
    fullName: string
    employeeId?: string | null
    isActive?: boolean
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutNurseProfileInput
    hospital: HospitalCreateNestedOneWithoutNurseProfilesInput
  }

  export type NurseProfileUncheckedCreateInput = {
    id?: string
    userId: string
    hospitalId: string
    fullName: string
    employeeId?: string | null
    isActive?: boolean
    createdAt?: Date | string
  }

  export type NurseProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutNurseProfileNestedInput
    hospital?: HospitalUpdateOneRequiredWithoutNurseProfilesNestedInput
  }

  export type NurseProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    hospitalId?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NurseProfileCreateManyInput = {
    id?: string
    userId: string
    hospitalId: string
    fullName: string
    employeeId?: string | null
    isActive?: boolean
    createdAt?: Date | string
  }

  export type NurseProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NurseProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    hospitalId?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResearcherProfileCreateInput = {
    id?: string
    fullName: string
    designation?: string | null
    email: string
    accessLevel?: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutResearcherProfileInput
  }

  export type ResearcherProfileUncheckedCreateInput = {
    id?: string
    userId: string
    fullName: string
    designation?: string | null
    email: string
    accessLevel?: string
    createdAt?: Date | string
  }

  export type ResearcherProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    designation?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    accessLevel?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutResearcherProfileNestedInput
  }

  export type ResearcherProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    designation?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    accessLevel?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResearcherProfileCreateManyInput = {
    id?: string
    userId: string
    fullName: string
    designation?: string | null
    email: string
    accessLevel?: string
    createdAt?: Date | string
  }

  export type ResearcherProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    designation?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    accessLevel?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResearcherProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    designation?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    accessLevel?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FollowUpScheduleCreateInput = {
    id?: string
    timePoint: string
    scheduledDate: Date | string
    actualDate?: Date | string | null
    status?: string
    dataComplete?: boolean
    collectedByUserId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    motherProfile: MotherProfileCreateNestedOneWithoutFollowUpSchedulesInput
  }

  export type FollowUpScheduleUncheckedCreateInput = {
    id?: string
    motherProfileId: string
    timePoint: string
    scheduledDate: Date | string
    actualDate?: Date | string | null
    status?: string
    dataComplete?: boolean
    collectedByUserId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FollowUpScheduleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timePoint?: StringFieldUpdateOperationsInput | string
    scheduledDate?: DateTimeFieldUpdateOperationsInput | Date | string
    actualDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    dataComplete?: BoolFieldUpdateOperationsInput | boolean
    collectedByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    motherProfile?: MotherProfileUpdateOneRequiredWithoutFollowUpSchedulesNestedInput
  }

  export type FollowUpScheduleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    motherProfileId?: StringFieldUpdateOperationsInput | string
    timePoint?: StringFieldUpdateOperationsInput | string
    scheduledDate?: DateTimeFieldUpdateOperationsInput | Date | string
    actualDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    dataComplete?: BoolFieldUpdateOperationsInput | boolean
    collectedByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FollowUpScheduleCreateManyInput = {
    id?: string
    motherProfileId: string
    timePoint: string
    scheduledDate: Date | string
    actualDate?: Date | string | null
    status?: string
    dataComplete?: boolean
    collectedByUserId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FollowUpScheduleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    timePoint?: StringFieldUpdateOperationsInput | string
    scheduledDate?: DateTimeFieldUpdateOperationsInput | Date | string
    actualDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    dataComplete?: BoolFieldUpdateOperationsInput | boolean
    collectedByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FollowUpScheduleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    motherProfileId?: StringFieldUpdateOperationsInput | string
    timePoint?: StringFieldUpdateOperationsInput | string
    scheduledDate?: DateTimeFieldUpdateOperationsInput | Date | string
    actualDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    dataComplete?: BoolFieldUpdateOperationsInput | boolean
    collectedByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type MotherProfileListRelationFilter = {
    every?: MotherProfileWhereInput
    some?: MotherProfileWhereInput
    none?: MotherProfileWhereInput
  }

  export type NurseProfileListRelationFilter = {
    every?: NurseProfileWhereInput
    some?: NurseProfileWhereInput
    none?: NurseProfileWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MotherProfileOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NurseProfileOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type HospitalCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    district?: SortOrder
    state?: SortOrder
    type?: SortOrder
    emergencyPhone?: SortOrder
    isActive?: SortOrder
    nextParticipantNumber?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type HospitalAvgOrderByAggregateInput = {
    nextParticipantNumber?: SortOrder
  }

  export type HospitalMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    district?: SortOrder
    state?: SortOrder
    type?: SortOrder
    emergencyPhone?: SortOrder
    isActive?: SortOrder
    nextParticipantNumber?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type HospitalMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    district?: SortOrder
    state?: SortOrder
    type?: SortOrder
    emergencyPhone?: SortOrder
    isActive?: SortOrder
    nextParticipantNumber?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type HospitalSumOrderByAggregateInput = {
    nextParticipantNumber?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type HospitalNullableScalarRelationFilter = {
    is?: HospitalWhereInput | null
    isNot?: HospitalWhereInput | null
  }

  export type MotherProfileNullableScalarRelationFilter = {
    is?: MotherProfileWhereInput | null
    isNot?: MotherProfileWhereInput | null
  }

  export type NurseProfileNullableScalarRelationFilter = {
    is?: NurseProfileWhereInput | null
    isNot?: NurseProfileWhereInput | null
  }

  export type ResearcherProfileNullableScalarRelationFilter = {
    is?: ResearcherProfileWhereInput | null
    isNot?: ResearcherProfileWhereInput | null
  }

  export type RefreshTokenListRelationFilter = {
    every?: RefreshTokenWhereInput
    some?: RefreshTokenWhereInput
    none?: RefreshTokenWhereInput
  }

  export type RefreshTokenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    phone?: SortOrder
    phoneVerified?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    pinHash?: SortOrder
    role?: SortOrder
    preferredLanguage?: SortOrder
    hospitalId?: SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrder
    failedPasswordAttempts?: SortOrder
    passwordLockedUntil?: SortOrder
    failedPinAttempts?: SortOrder
    pinLockedUntil?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    failedPasswordAttempts?: SortOrder
    failedPinAttempts?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    phone?: SortOrder
    phoneVerified?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    pinHash?: SortOrder
    role?: SortOrder
    preferredLanguage?: SortOrder
    hospitalId?: SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrder
    failedPasswordAttempts?: SortOrder
    passwordLockedUntil?: SortOrder
    failedPinAttempts?: SortOrder
    pinLockedUntil?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    phone?: SortOrder
    phoneVerified?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    pinHash?: SortOrder
    role?: SortOrder
    preferredLanguage?: SortOrder
    hospitalId?: SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrder
    failedPasswordAttempts?: SortOrder
    passwordLockedUntil?: SortOrder
    failedPinAttempts?: SortOrder
    pinLockedUntil?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    failedPasswordAttempts?: SortOrder
    failedPinAttempts?: SortOrder
  }

  export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type OtpVerificationCountOrderByAggregateInput = {
    id?: SortOrder
    phone?: SortOrder
    otpHash?: SortOrder
    purpose?: SortOrder
    isUsed?: SortOrder
    attempts?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    usedAt?: SortOrder
  }

  export type OtpVerificationAvgOrderByAggregateInput = {
    attempts?: SortOrder
  }

  export type OtpVerificationMaxOrderByAggregateInput = {
    id?: SortOrder
    phone?: SortOrder
    otpHash?: SortOrder
    purpose?: SortOrder
    isUsed?: SortOrder
    attempts?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    usedAt?: SortOrder
  }

  export type OtpVerificationMinOrderByAggregateInput = {
    id?: SortOrder
    phone?: SortOrder
    otpHash?: SortOrder
    purpose?: SortOrder
    isUsed?: SortOrder
    attempts?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    usedAt?: SortOrder
  }

  export type OtpVerificationSumOrderByAggregateInput = {
    attempts?: SortOrder
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type RefreshTokenCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    deviceInfo?: SortOrder
    expiresAt?: SortOrder
    revokedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type RefreshTokenMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    deviceInfo?: SortOrder
    expiresAt?: SortOrder
    revokedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type RefreshTokenMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    tokenHash?: SortOrder
    deviceInfo?: SortOrder
    expiresAt?: SortOrder
    revokedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type BabyProfileNullableScalarRelationFilter = {
    is?: BabyProfileWhereInput | null
    isNot?: BabyProfileWhereInput | null
  }

  export type FollowUpScheduleListRelationFilter = {
    every?: FollowUpScheduleWhereInput
    some?: FollowUpScheduleWhereInput
    none?: FollowUpScheduleWhereInput
  }

  export type FollowUpScheduleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MotherProfileCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    participantCode?: SortOrder
    studyGroup?: SortOrder
    hospitalId?: SortOrder
    fullName?: SortOrder
    ageRange?: SortOrder
    educationMother?: SortOrder
    educationFather?: SortOrder
    occupationMother?: SortOrder
    occupationFather?: SortOrder
    incomeClass?: SortOrder
    familyType?: SortOrder
    familyMembersCount?: SortOrder
    religion?: SortOrder
    residenceType?: SortOrder
    contactNumber?: SortOrder
    prevPretermEducation?: SortOrder
    educationSource?: SortOrder
    enrolledAt?: SortOrder
    onboardingCompletedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MotherProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    participantCode?: SortOrder
    studyGroup?: SortOrder
    hospitalId?: SortOrder
    fullName?: SortOrder
    ageRange?: SortOrder
    educationMother?: SortOrder
    educationFather?: SortOrder
    occupationMother?: SortOrder
    occupationFather?: SortOrder
    incomeClass?: SortOrder
    familyType?: SortOrder
    familyMembersCount?: SortOrder
    religion?: SortOrder
    residenceType?: SortOrder
    contactNumber?: SortOrder
    prevPretermEducation?: SortOrder
    enrolledAt?: SortOrder
    onboardingCompletedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MotherProfileMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    participantCode?: SortOrder
    studyGroup?: SortOrder
    hospitalId?: SortOrder
    fullName?: SortOrder
    ageRange?: SortOrder
    educationMother?: SortOrder
    educationFather?: SortOrder
    occupationMother?: SortOrder
    occupationFather?: SortOrder
    incomeClass?: SortOrder
    familyType?: SortOrder
    familyMembersCount?: SortOrder
    religion?: SortOrder
    residenceType?: SortOrder
    contactNumber?: SortOrder
    prevPretermEducation?: SortOrder
    enrolledAt?: SortOrder
    onboardingCompletedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type MotherProfileScalarRelationFilter = {
    is?: MotherProfileWhereInput
    isNot?: MotherProfileWhereInput
  }

  export type BabyProfileCountOrderByAggregateInput = {
    id?: SortOrder
    motherProfileId?: SortOrder
    babyName?: SortOrder
    sex?: SortOrder
    dateOfBirth?: SortOrder
    gestationalAgeWeeks?: SortOrder
    birthWeightGrams?: SortOrder
    weightAtDischargeGrams?: SortOrder
    placeOfDelivery?: SortOrder
    nicuStayDays?: SortOrder
    skinToSkinAtBirth?: SortOrder
    kmcInNicu?: SortOrder
    feedingAtDischarge?: SortOrder
    criedAtBirth?: SortOrder
    neededResuscitation?: SortOrder
    birthWeightStratum?: SortOrder
    dischargeDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BabyProfileAvgOrderByAggregateInput = {
    gestationalAgeWeeks?: SortOrder
    birthWeightGrams?: SortOrder
    weightAtDischargeGrams?: SortOrder
    nicuStayDays?: SortOrder
  }

  export type BabyProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    motherProfileId?: SortOrder
    babyName?: SortOrder
    sex?: SortOrder
    dateOfBirth?: SortOrder
    gestationalAgeWeeks?: SortOrder
    birthWeightGrams?: SortOrder
    weightAtDischargeGrams?: SortOrder
    placeOfDelivery?: SortOrder
    nicuStayDays?: SortOrder
    skinToSkinAtBirth?: SortOrder
    kmcInNicu?: SortOrder
    feedingAtDischarge?: SortOrder
    criedAtBirth?: SortOrder
    neededResuscitation?: SortOrder
    birthWeightStratum?: SortOrder
    dischargeDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BabyProfileMinOrderByAggregateInput = {
    id?: SortOrder
    motherProfileId?: SortOrder
    babyName?: SortOrder
    sex?: SortOrder
    dateOfBirth?: SortOrder
    gestationalAgeWeeks?: SortOrder
    birthWeightGrams?: SortOrder
    weightAtDischargeGrams?: SortOrder
    placeOfDelivery?: SortOrder
    nicuStayDays?: SortOrder
    skinToSkinAtBirth?: SortOrder
    kmcInNicu?: SortOrder
    feedingAtDischarge?: SortOrder
    criedAtBirth?: SortOrder
    neededResuscitation?: SortOrder
    birthWeightStratum?: SortOrder
    dischargeDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BabyProfileSumOrderByAggregateInput = {
    gestationalAgeWeeks?: SortOrder
    birthWeightGrams?: SortOrder
    weightAtDischargeGrams?: SortOrder
    nicuStayDays?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type HospitalScalarRelationFilter = {
    is?: HospitalWhereInput
    isNot?: HospitalWhereInput
  }

  export type NurseProfileCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    hospitalId?: SortOrder
    fullName?: SortOrder
    employeeId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type NurseProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    hospitalId?: SortOrder
    fullName?: SortOrder
    employeeId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type NurseProfileMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    hospitalId?: SortOrder
    fullName?: SortOrder
    employeeId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type ResearcherProfileCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    fullName?: SortOrder
    designation?: SortOrder
    email?: SortOrder
    accessLevel?: SortOrder
    createdAt?: SortOrder
  }

  export type ResearcherProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    fullName?: SortOrder
    designation?: SortOrder
    email?: SortOrder
    accessLevel?: SortOrder
    createdAt?: SortOrder
  }

  export type ResearcherProfileMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    fullName?: SortOrder
    designation?: SortOrder
    email?: SortOrder
    accessLevel?: SortOrder
    createdAt?: SortOrder
  }

  export type FollowUpScheduleMotherProfileIdTimePointCompoundUniqueInput = {
    motherProfileId: string
    timePoint: string
  }

  export type FollowUpScheduleCountOrderByAggregateInput = {
    id?: SortOrder
    motherProfileId?: SortOrder
    timePoint?: SortOrder
    scheduledDate?: SortOrder
    actualDate?: SortOrder
    status?: SortOrder
    dataComplete?: SortOrder
    collectedByUserId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FollowUpScheduleMaxOrderByAggregateInput = {
    id?: SortOrder
    motherProfileId?: SortOrder
    timePoint?: SortOrder
    scheduledDate?: SortOrder
    actualDate?: SortOrder
    status?: SortOrder
    dataComplete?: SortOrder
    collectedByUserId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FollowUpScheduleMinOrderByAggregateInput = {
    id?: SortOrder
    motherProfileId?: SortOrder
    timePoint?: SortOrder
    scheduledDate?: SortOrder
    actualDate?: SortOrder
    status?: SortOrder
    dataComplete?: SortOrder
    collectedByUserId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserCreateNestedManyWithoutHospitalInput = {
    create?: XOR<UserCreateWithoutHospitalInput, UserUncheckedCreateWithoutHospitalInput> | UserCreateWithoutHospitalInput[] | UserUncheckedCreateWithoutHospitalInput[]
    connectOrCreate?: UserCreateOrConnectWithoutHospitalInput | UserCreateOrConnectWithoutHospitalInput[]
    createMany?: UserCreateManyHospitalInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type MotherProfileCreateNestedManyWithoutHospitalInput = {
    create?: XOR<MotherProfileCreateWithoutHospitalInput, MotherProfileUncheckedCreateWithoutHospitalInput> | MotherProfileCreateWithoutHospitalInput[] | MotherProfileUncheckedCreateWithoutHospitalInput[]
    connectOrCreate?: MotherProfileCreateOrConnectWithoutHospitalInput | MotherProfileCreateOrConnectWithoutHospitalInput[]
    createMany?: MotherProfileCreateManyHospitalInputEnvelope
    connect?: MotherProfileWhereUniqueInput | MotherProfileWhereUniqueInput[]
  }

  export type NurseProfileCreateNestedManyWithoutHospitalInput = {
    create?: XOR<NurseProfileCreateWithoutHospitalInput, NurseProfileUncheckedCreateWithoutHospitalInput> | NurseProfileCreateWithoutHospitalInput[] | NurseProfileUncheckedCreateWithoutHospitalInput[]
    connectOrCreate?: NurseProfileCreateOrConnectWithoutHospitalInput | NurseProfileCreateOrConnectWithoutHospitalInput[]
    createMany?: NurseProfileCreateManyHospitalInputEnvelope
    connect?: NurseProfileWhereUniqueInput | NurseProfileWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutHospitalInput = {
    create?: XOR<UserCreateWithoutHospitalInput, UserUncheckedCreateWithoutHospitalInput> | UserCreateWithoutHospitalInput[] | UserUncheckedCreateWithoutHospitalInput[]
    connectOrCreate?: UserCreateOrConnectWithoutHospitalInput | UserCreateOrConnectWithoutHospitalInput[]
    createMany?: UserCreateManyHospitalInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type MotherProfileUncheckedCreateNestedManyWithoutHospitalInput = {
    create?: XOR<MotherProfileCreateWithoutHospitalInput, MotherProfileUncheckedCreateWithoutHospitalInput> | MotherProfileCreateWithoutHospitalInput[] | MotherProfileUncheckedCreateWithoutHospitalInput[]
    connectOrCreate?: MotherProfileCreateOrConnectWithoutHospitalInput | MotherProfileCreateOrConnectWithoutHospitalInput[]
    createMany?: MotherProfileCreateManyHospitalInputEnvelope
    connect?: MotherProfileWhereUniqueInput | MotherProfileWhereUniqueInput[]
  }

  export type NurseProfileUncheckedCreateNestedManyWithoutHospitalInput = {
    create?: XOR<NurseProfileCreateWithoutHospitalInput, NurseProfileUncheckedCreateWithoutHospitalInput> | NurseProfileCreateWithoutHospitalInput[] | NurseProfileUncheckedCreateWithoutHospitalInput[]
    connectOrCreate?: NurseProfileCreateOrConnectWithoutHospitalInput | NurseProfileCreateOrConnectWithoutHospitalInput[]
    createMany?: NurseProfileCreateManyHospitalInputEnvelope
    connect?: NurseProfileWhereUniqueInput | NurseProfileWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserUpdateManyWithoutHospitalNestedInput = {
    create?: XOR<UserCreateWithoutHospitalInput, UserUncheckedCreateWithoutHospitalInput> | UserCreateWithoutHospitalInput[] | UserUncheckedCreateWithoutHospitalInput[]
    connectOrCreate?: UserCreateOrConnectWithoutHospitalInput | UserCreateOrConnectWithoutHospitalInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutHospitalInput | UserUpsertWithWhereUniqueWithoutHospitalInput[]
    createMany?: UserCreateManyHospitalInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutHospitalInput | UserUpdateWithWhereUniqueWithoutHospitalInput[]
    updateMany?: UserUpdateManyWithWhereWithoutHospitalInput | UserUpdateManyWithWhereWithoutHospitalInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type MotherProfileUpdateManyWithoutHospitalNestedInput = {
    create?: XOR<MotherProfileCreateWithoutHospitalInput, MotherProfileUncheckedCreateWithoutHospitalInput> | MotherProfileCreateWithoutHospitalInput[] | MotherProfileUncheckedCreateWithoutHospitalInput[]
    connectOrCreate?: MotherProfileCreateOrConnectWithoutHospitalInput | MotherProfileCreateOrConnectWithoutHospitalInput[]
    upsert?: MotherProfileUpsertWithWhereUniqueWithoutHospitalInput | MotherProfileUpsertWithWhereUniqueWithoutHospitalInput[]
    createMany?: MotherProfileCreateManyHospitalInputEnvelope
    set?: MotherProfileWhereUniqueInput | MotherProfileWhereUniqueInput[]
    disconnect?: MotherProfileWhereUniqueInput | MotherProfileWhereUniqueInput[]
    delete?: MotherProfileWhereUniqueInput | MotherProfileWhereUniqueInput[]
    connect?: MotherProfileWhereUniqueInput | MotherProfileWhereUniqueInput[]
    update?: MotherProfileUpdateWithWhereUniqueWithoutHospitalInput | MotherProfileUpdateWithWhereUniqueWithoutHospitalInput[]
    updateMany?: MotherProfileUpdateManyWithWhereWithoutHospitalInput | MotherProfileUpdateManyWithWhereWithoutHospitalInput[]
    deleteMany?: MotherProfileScalarWhereInput | MotherProfileScalarWhereInput[]
  }

  export type NurseProfileUpdateManyWithoutHospitalNestedInput = {
    create?: XOR<NurseProfileCreateWithoutHospitalInput, NurseProfileUncheckedCreateWithoutHospitalInput> | NurseProfileCreateWithoutHospitalInput[] | NurseProfileUncheckedCreateWithoutHospitalInput[]
    connectOrCreate?: NurseProfileCreateOrConnectWithoutHospitalInput | NurseProfileCreateOrConnectWithoutHospitalInput[]
    upsert?: NurseProfileUpsertWithWhereUniqueWithoutHospitalInput | NurseProfileUpsertWithWhereUniqueWithoutHospitalInput[]
    createMany?: NurseProfileCreateManyHospitalInputEnvelope
    set?: NurseProfileWhereUniqueInput | NurseProfileWhereUniqueInput[]
    disconnect?: NurseProfileWhereUniqueInput | NurseProfileWhereUniqueInput[]
    delete?: NurseProfileWhereUniqueInput | NurseProfileWhereUniqueInput[]
    connect?: NurseProfileWhereUniqueInput | NurseProfileWhereUniqueInput[]
    update?: NurseProfileUpdateWithWhereUniqueWithoutHospitalInput | NurseProfileUpdateWithWhereUniqueWithoutHospitalInput[]
    updateMany?: NurseProfileUpdateManyWithWhereWithoutHospitalInput | NurseProfileUpdateManyWithWhereWithoutHospitalInput[]
    deleteMany?: NurseProfileScalarWhereInput | NurseProfileScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutHospitalNestedInput = {
    create?: XOR<UserCreateWithoutHospitalInput, UserUncheckedCreateWithoutHospitalInput> | UserCreateWithoutHospitalInput[] | UserUncheckedCreateWithoutHospitalInput[]
    connectOrCreate?: UserCreateOrConnectWithoutHospitalInput | UserCreateOrConnectWithoutHospitalInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutHospitalInput | UserUpsertWithWhereUniqueWithoutHospitalInput[]
    createMany?: UserCreateManyHospitalInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutHospitalInput | UserUpdateWithWhereUniqueWithoutHospitalInput[]
    updateMany?: UserUpdateManyWithWhereWithoutHospitalInput | UserUpdateManyWithWhereWithoutHospitalInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type MotherProfileUncheckedUpdateManyWithoutHospitalNestedInput = {
    create?: XOR<MotherProfileCreateWithoutHospitalInput, MotherProfileUncheckedCreateWithoutHospitalInput> | MotherProfileCreateWithoutHospitalInput[] | MotherProfileUncheckedCreateWithoutHospitalInput[]
    connectOrCreate?: MotherProfileCreateOrConnectWithoutHospitalInput | MotherProfileCreateOrConnectWithoutHospitalInput[]
    upsert?: MotherProfileUpsertWithWhereUniqueWithoutHospitalInput | MotherProfileUpsertWithWhereUniqueWithoutHospitalInput[]
    createMany?: MotherProfileCreateManyHospitalInputEnvelope
    set?: MotherProfileWhereUniqueInput | MotherProfileWhereUniqueInput[]
    disconnect?: MotherProfileWhereUniqueInput | MotherProfileWhereUniqueInput[]
    delete?: MotherProfileWhereUniqueInput | MotherProfileWhereUniqueInput[]
    connect?: MotherProfileWhereUniqueInput | MotherProfileWhereUniqueInput[]
    update?: MotherProfileUpdateWithWhereUniqueWithoutHospitalInput | MotherProfileUpdateWithWhereUniqueWithoutHospitalInput[]
    updateMany?: MotherProfileUpdateManyWithWhereWithoutHospitalInput | MotherProfileUpdateManyWithWhereWithoutHospitalInput[]
    deleteMany?: MotherProfileScalarWhereInput | MotherProfileScalarWhereInput[]
  }

  export type NurseProfileUncheckedUpdateManyWithoutHospitalNestedInput = {
    create?: XOR<NurseProfileCreateWithoutHospitalInput, NurseProfileUncheckedCreateWithoutHospitalInput> | NurseProfileCreateWithoutHospitalInput[] | NurseProfileUncheckedCreateWithoutHospitalInput[]
    connectOrCreate?: NurseProfileCreateOrConnectWithoutHospitalInput | NurseProfileCreateOrConnectWithoutHospitalInput[]
    upsert?: NurseProfileUpsertWithWhereUniqueWithoutHospitalInput | NurseProfileUpsertWithWhereUniqueWithoutHospitalInput[]
    createMany?: NurseProfileCreateManyHospitalInputEnvelope
    set?: NurseProfileWhereUniqueInput | NurseProfileWhereUniqueInput[]
    disconnect?: NurseProfileWhereUniqueInput | NurseProfileWhereUniqueInput[]
    delete?: NurseProfileWhereUniqueInput | NurseProfileWhereUniqueInput[]
    connect?: NurseProfileWhereUniqueInput | NurseProfileWhereUniqueInput[]
    update?: NurseProfileUpdateWithWhereUniqueWithoutHospitalInput | NurseProfileUpdateWithWhereUniqueWithoutHospitalInput[]
    updateMany?: NurseProfileUpdateManyWithWhereWithoutHospitalInput | NurseProfileUpdateManyWithWhereWithoutHospitalInput[]
    deleteMany?: NurseProfileScalarWhereInput | NurseProfileScalarWhereInput[]
  }

  export type HospitalCreateNestedOneWithoutUsersInput = {
    create?: XOR<HospitalCreateWithoutUsersInput, HospitalUncheckedCreateWithoutUsersInput>
    connectOrCreate?: HospitalCreateOrConnectWithoutUsersInput
    connect?: HospitalWhereUniqueInput
  }

  export type MotherProfileCreateNestedOneWithoutUserInput = {
    create?: XOR<MotherProfileCreateWithoutUserInput, MotherProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: MotherProfileCreateOrConnectWithoutUserInput
    connect?: MotherProfileWhereUniqueInput
  }

  export type NurseProfileCreateNestedOneWithoutUserInput = {
    create?: XOR<NurseProfileCreateWithoutUserInput, NurseProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: NurseProfileCreateOrConnectWithoutUserInput
    connect?: NurseProfileWhereUniqueInput
  }

  export type ResearcherProfileCreateNestedOneWithoutUserInput = {
    create?: XOR<ResearcherProfileCreateWithoutUserInput, ResearcherProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: ResearcherProfileCreateOrConnectWithoutUserInput
    connect?: ResearcherProfileWhereUniqueInput
  }

  export type RefreshTokenCreateNestedManyWithoutUserInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
  }

  export type MotherProfileUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<MotherProfileCreateWithoutUserInput, MotherProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: MotherProfileCreateOrConnectWithoutUserInput
    connect?: MotherProfileWhereUniqueInput
  }

  export type NurseProfileUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<NurseProfileCreateWithoutUserInput, NurseProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: NurseProfileCreateOrConnectWithoutUserInput
    connect?: NurseProfileWhereUniqueInput
  }

  export type ResearcherProfileUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<ResearcherProfileCreateWithoutUserInput, ResearcherProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: ResearcherProfileCreateOrConnectWithoutUserInput
    connect?: ResearcherProfileWhereUniqueInput
  }

  export type RefreshTokenUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type HospitalUpdateOneWithoutUsersNestedInput = {
    create?: XOR<HospitalCreateWithoutUsersInput, HospitalUncheckedCreateWithoutUsersInput>
    connectOrCreate?: HospitalCreateOrConnectWithoutUsersInput
    upsert?: HospitalUpsertWithoutUsersInput
    disconnect?: HospitalWhereInput | boolean
    delete?: HospitalWhereInput | boolean
    connect?: HospitalWhereUniqueInput
    update?: XOR<XOR<HospitalUpdateToOneWithWhereWithoutUsersInput, HospitalUpdateWithoutUsersInput>, HospitalUncheckedUpdateWithoutUsersInput>
  }

  export type MotherProfileUpdateOneWithoutUserNestedInput = {
    create?: XOR<MotherProfileCreateWithoutUserInput, MotherProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: MotherProfileCreateOrConnectWithoutUserInput
    upsert?: MotherProfileUpsertWithoutUserInput
    disconnect?: MotherProfileWhereInput | boolean
    delete?: MotherProfileWhereInput | boolean
    connect?: MotherProfileWhereUniqueInput
    update?: XOR<XOR<MotherProfileUpdateToOneWithWhereWithoutUserInput, MotherProfileUpdateWithoutUserInput>, MotherProfileUncheckedUpdateWithoutUserInput>
  }

  export type NurseProfileUpdateOneWithoutUserNestedInput = {
    create?: XOR<NurseProfileCreateWithoutUserInput, NurseProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: NurseProfileCreateOrConnectWithoutUserInput
    upsert?: NurseProfileUpsertWithoutUserInput
    disconnect?: NurseProfileWhereInput | boolean
    delete?: NurseProfileWhereInput | boolean
    connect?: NurseProfileWhereUniqueInput
    update?: XOR<XOR<NurseProfileUpdateToOneWithWhereWithoutUserInput, NurseProfileUpdateWithoutUserInput>, NurseProfileUncheckedUpdateWithoutUserInput>
  }

  export type ResearcherProfileUpdateOneWithoutUserNestedInput = {
    create?: XOR<ResearcherProfileCreateWithoutUserInput, ResearcherProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: ResearcherProfileCreateOrConnectWithoutUserInput
    upsert?: ResearcherProfileUpsertWithoutUserInput
    disconnect?: ResearcherProfileWhereInput | boolean
    delete?: ResearcherProfileWhereInput | boolean
    connect?: ResearcherProfileWhereUniqueInput
    update?: XOR<XOR<ResearcherProfileUpdateToOneWithWhereWithoutUserInput, ResearcherProfileUpdateWithoutUserInput>, ResearcherProfileUncheckedUpdateWithoutUserInput>
  }

  export type RefreshTokenUpdateManyWithoutUserNestedInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    upsert?: RefreshTokenUpsertWithWhereUniqueWithoutUserInput | RefreshTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    set?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    disconnect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    delete?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    update?: RefreshTokenUpdateWithWhereUniqueWithoutUserInput | RefreshTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RefreshTokenUpdateManyWithWhereWithoutUserInput | RefreshTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RefreshTokenScalarWhereInput | RefreshTokenScalarWhereInput[]
  }

  export type MotherProfileUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<MotherProfileCreateWithoutUserInput, MotherProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: MotherProfileCreateOrConnectWithoutUserInput
    upsert?: MotherProfileUpsertWithoutUserInput
    disconnect?: MotherProfileWhereInput | boolean
    delete?: MotherProfileWhereInput | boolean
    connect?: MotherProfileWhereUniqueInput
    update?: XOR<XOR<MotherProfileUpdateToOneWithWhereWithoutUserInput, MotherProfileUpdateWithoutUserInput>, MotherProfileUncheckedUpdateWithoutUserInput>
  }

  export type NurseProfileUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<NurseProfileCreateWithoutUserInput, NurseProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: NurseProfileCreateOrConnectWithoutUserInput
    upsert?: NurseProfileUpsertWithoutUserInput
    disconnect?: NurseProfileWhereInput | boolean
    delete?: NurseProfileWhereInput | boolean
    connect?: NurseProfileWhereUniqueInput
    update?: XOR<XOR<NurseProfileUpdateToOneWithWhereWithoutUserInput, NurseProfileUpdateWithoutUserInput>, NurseProfileUncheckedUpdateWithoutUserInput>
  }

  export type ResearcherProfileUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<ResearcherProfileCreateWithoutUserInput, ResearcherProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: ResearcherProfileCreateOrConnectWithoutUserInput
    upsert?: ResearcherProfileUpsertWithoutUserInput
    disconnect?: ResearcherProfileWhereInput | boolean
    delete?: ResearcherProfileWhereInput | boolean
    connect?: ResearcherProfileWhereUniqueInput
    update?: XOR<XOR<ResearcherProfileUpdateToOneWithWhereWithoutUserInput, ResearcherProfileUpdateWithoutUserInput>, ResearcherProfileUncheckedUpdateWithoutUserInput>
  }

  export type RefreshTokenUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    upsert?: RefreshTokenUpsertWithWhereUniqueWithoutUserInput | RefreshTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    set?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    disconnect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    delete?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    update?: RefreshTokenUpdateWithWhereUniqueWithoutUserInput | RefreshTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RefreshTokenUpdateManyWithWhereWithoutUserInput | RefreshTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RefreshTokenScalarWhereInput | RefreshTokenScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutRefreshTokensInput = {
    create?: XOR<UserCreateWithoutRefreshTokensInput, UserUncheckedCreateWithoutRefreshTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutRefreshTokensInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutRefreshTokensNestedInput = {
    create?: XOR<UserCreateWithoutRefreshTokensInput, UserUncheckedCreateWithoutRefreshTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutRefreshTokensInput
    upsert?: UserUpsertWithoutRefreshTokensInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutRefreshTokensInput, UserUpdateWithoutRefreshTokensInput>, UserUncheckedUpdateWithoutRefreshTokensInput>
  }

  export type MotherProfileCreateeducationSourceInput = {
    set: string[]
  }

  export type UserCreateNestedOneWithoutMotherProfileInput = {
    create?: XOR<UserCreateWithoutMotherProfileInput, UserUncheckedCreateWithoutMotherProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutMotherProfileInput
    connect?: UserWhereUniqueInput
  }

  export type HospitalCreateNestedOneWithoutMotherProfilesInput = {
    create?: XOR<HospitalCreateWithoutMotherProfilesInput, HospitalUncheckedCreateWithoutMotherProfilesInput>
    connectOrCreate?: HospitalCreateOrConnectWithoutMotherProfilesInput
    connect?: HospitalWhereUniqueInput
  }

  export type BabyProfileCreateNestedOneWithoutMotherProfileInput = {
    create?: XOR<BabyProfileCreateWithoutMotherProfileInput, BabyProfileUncheckedCreateWithoutMotherProfileInput>
    connectOrCreate?: BabyProfileCreateOrConnectWithoutMotherProfileInput
    connect?: BabyProfileWhereUniqueInput
  }

  export type FollowUpScheduleCreateNestedManyWithoutMotherProfileInput = {
    create?: XOR<FollowUpScheduleCreateWithoutMotherProfileInput, FollowUpScheduleUncheckedCreateWithoutMotherProfileInput> | FollowUpScheduleCreateWithoutMotherProfileInput[] | FollowUpScheduleUncheckedCreateWithoutMotherProfileInput[]
    connectOrCreate?: FollowUpScheduleCreateOrConnectWithoutMotherProfileInput | FollowUpScheduleCreateOrConnectWithoutMotherProfileInput[]
    createMany?: FollowUpScheduleCreateManyMotherProfileInputEnvelope
    connect?: FollowUpScheduleWhereUniqueInput | FollowUpScheduleWhereUniqueInput[]
  }

  export type BabyProfileUncheckedCreateNestedOneWithoutMotherProfileInput = {
    create?: XOR<BabyProfileCreateWithoutMotherProfileInput, BabyProfileUncheckedCreateWithoutMotherProfileInput>
    connectOrCreate?: BabyProfileCreateOrConnectWithoutMotherProfileInput
    connect?: BabyProfileWhereUniqueInput
  }

  export type FollowUpScheduleUncheckedCreateNestedManyWithoutMotherProfileInput = {
    create?: XOR<FollowUpScheduleCreateWithoutMotherProfileInput, FollowUpScheduleUncheckedCreateWithoutMotherProfileInput> | FollowUpScheduleCreateWithoutMotherProfileInput[] | FollowUpScheduleUncheckedCreateWithoutMotherProfileInput[]
    connectOrCreate?: FollowUpScheduleCreateOrConnectWithoutMotherProfileInput | FollowUpScheduleCreateOrConnectWithoutMotherProfileInput[]
    createMany?: FollowUpScheduleCreateManyMotherProfileInputEnvelope
    connect?: FollowUpScheduleWhereUniqueInput | FollowUpScheduleWhereUniqueInput[]
  }

  export type MotherProfileUpdateeducationSourceInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserUpdateOneRequiredWithoutMotherProfileNestedInput = {
    create?: XOR<UserCreateWithoutMotherProfileInput, UserUncheckedCreateWithoutMotherProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutMotherProfileInput
    upsert?: UserUpsertWithoutMotherProfileInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMotherProfileInput, UserUpdateWithoutMotherProfileInput>, UserUncheckedUpdateWithoutMotherProfileInput>
  }

  export type HospitalUpdateOneWithoutMotherProfilesNestedInput = {
    create?: XOR<HospitalCreateWithoutMotherProfilesInput, HospitalUncheckedCreateWithoutMotherProfilesInput>
    connectOrCreate?: HospitalCreateOrConnectWithoutMotherProfilesInput
    upsert?: HospitalUpsertWithoutMotherProfilesInput
    disconnect?: HospitalWhereInput | boolean
    delete?: HospitalWhereInput | boolean
    connect?: HospitalWhereUniqueInput
    update?: XOR<XOR<HospitalUpdateToOneWithWhereWithoutMotherProfilesInput, HospitalUpdateWithoutMotherProfilesInput>, HospitalUncheckedUpdateWithoutMotherProfilesInput>
  }

  export type BabyProfileUpdateOneWithoutMotherProfileNestedInput = {
    create?: XOR<BabyProfileCreateWithoutMotherProfileInput, BabyProfileUncheckedCreateWithoutMotherProfileInput>
    connectOrCreate?: BabyProfileCreateOrConnectWithoutMotherProfileInput
    upsert?: BabyProfileUpsertWithoutMotherProfileInput
    disconnect?: BabyProfileWhereInput | boolean
    delete?: BabyProfileWhereInput | boolean
    connect?: BabyProfileWhereUniqueInput
    update?: XOR<XOR<BabyProfileUpdateToOneWithWhereWithoutMotherProfileInput, BabyProfileUpdateWithoutMotherProfileInput>, BabyProfileUncheckedUpdateWithoutMotherProfileInput>
  }

  export type FollowUpScheduleUpdateManyWithoutMotherProfileNestedInput = {
    create?: XOR<FollowUpScheduleCreateWithoutMotherProfileInput, FollowUpScheduleUncheckedCreateWithoutMotherProfileInput> | FollowUpScheduleCreateWithoutMotherProfileInput[] | FollowUpScheduleUncheckedCreateWithoutMotherProfileInput[]
    connectOrCreate?: FollowUpScheduleCreateOrConnectWithoutMotherProfileInput | FollowUpScheduleCreateOrConnectWithoutMotherProfileInput[]
    upsert?: FollowUpScheduleUpsertWithWhereUniqueWithoutMotherProfileInput | FollowUpScheduleUpsertWithWhereUniqueWithoutMotherProfileInput[]
    createMany?: FollowUpScheduleCreateManyMotherProfileInputEnvelope
    set?: FollowUpScheduleWhereUniqueInput | FollowUpScheduleWhereUniqueInput[]
    disconnect?: FollowUpScheduleWhereUniqueInput | FollowUpScheduleWhereUniqueInput[]
    delete?: FollowUpScheduleWhereUniqueInput | FollowUpScheduleWhereUniqueInput[]
    connect?: FollowUpScheduleWhereUniqueInput | FollowUpScheduleWhereUniqueInput[]
    update?: FollowUpScheduleUpdateWithWhereUniqueWithoutMotherProfileInput | FollowUpScheduleUpdateWithWhereUniqueWithoutMotherProfileInput[]
    updateMany?: FollowUpScheduleUpdateManyWithWhereWithoutMotherProfileInput | FollowUpScheduleUpdateManyWithWhereWithoutMotherProfileInput[]
    deleteMany?: FollowUpScheduleScalarWhereInput | FollowUpScheduleScalarWhereInput[]
  }

  export type BabyProfileUncheckedUpdateOneWithoutMotherProfileNestedInput = {
    create?: XOR<BabyProfileCreateWithoutMotherProfileInput, BabyProfileUncheckedCreateWithoutMotherProfileInput>
    connectOrCreate?: BabyProfileCreateOrConnectWithoutMotherProfileInput
    upsert?: BabyProfileUpsertWithoutMotherProfileInput
    disconnect?: BabyProfileWhereInput | boolean
    delete?: BabyProfileWhereInput | boolean
    connect?: BabyProfileWhereUniqueInput
    update?: XOR<XOR<BabyProfileUpdateToOneWithWhereWithoutMotherProfileInput, BabyProfileUpdateWithoutMotherProfileInput>, BabyProfileUncheckedUpdateWithoutMotherProfileInput>
  }

  export type FollowUpScheduleUncheckedUpdateManyWithoutMotherProfileNestedInput = {
    create?: XOR<FollowUpScheduleCreateWithoutMotherProfileInput, FollowUpScheduleUncheckedCreateWithoutMotherProfileInput> | FollowUpScheduleCreateWithoutMotherProfileInput[] | FollowUpScheduleUncheckedCreateWithoutMotherProfileInput[]
    connectOrCreate?: FollowUpScheduleCreateOrConnectWithoutMotherProfileInput | FollowUpScheduleCreateOrConnectWithoutMotherProfileInput[]
    upsert?: FollowUpScheduleUpsertWithWhereUniqueWithoutMotherProfileInput | FollowUpScheduleUpsertWithWhereUniqueWithoutMotherProfileInput[]
    createMany?: FollowUpScheduleCreateManyMotherProfileInputEnvelope
    set?: FollowUpScheduleWhereUniqueInput | FollowUpScheduleWhereUniqueInput[]
    disconnect?: FollowUpScheduleWhereUniqueInput | FollowUpScheduleWhereUniqueInput[]
    delete?: FollowUpScheduleWhereUniqueInput | FollowUpScheduleWhereUniqueInput[]
    connect?: FollowUpScheduleWhereUniqueInput | FollowUpScheduleWhereUniqueInput[]
    update?: FollowUpScheduleUpdateWithWhereUniqueWithoutMotherProfileInput | FollowUpScheduleUpdateWithWhereUniqueWithoutMotherProfileInput[]
    updateMany?: FollowUpScheduleUpdateManyWithWhereWithoutMotherProfileInput | FollowUpScheduleUpdateManyWithWhereWithoutMotherProfileInput[]
    deleteMany?: FollowUpScheduleScalarWhereInput | FollowUpScheduleScalarWhereInput[]
  }

  export type MotherProfileCreateNestedOneWithoutBabyProfileInput = {
    create?: XOR<MotherProfileCreateWithoutBabyProfileInput, MotherProfileUncheckedCreateWithoutBabyProfileInput>
    connectOrCreate?: MotherProfileCreateOrConnectWithoutBabyProfileInput
    connect?: MotherProfileWhereUniqueInput
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type MotherProfileUpdateOneRequiredWithoutBabyProfileNestedInput = {
    create?: XOR<MotherProfileCreateWithoutBabyProfileInput, MotherProfileUncheckedCreateWithoutBabyProfileInput>
    connectOrCreate?: MotherProfileCreateOrConnectWithoutBabyProfileInput
    upsert?: MotherProfileUpsertWithoutBabyProfileInput
    connect?: MotherProfileWhereUniqueInput
    update?: XOR<XOR<MotherProfileUpdateToOneWithWhereWithoutBabyProfileInput, MotherProfileUpdateWithoutBabyProfileInput>, MotherProfileUncheckedUpdateWithoutBabyProfileInput>
  }

  export type UserCreateNestedOneWithoutNurseProfileInput = {
    create?: XOR<UserCreateWithoutNurseProfileInput, UserUncheckedCreateWithoutNurseProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutNurseProfileInput
    connect?: UserWhereUniqueInput
  }

  export type HospitalCreateNestedOneWithoutNurseProfilesInput = {
    create?: XOR<HospitalCreateWithoutNurseProfilesInput, HospitalUncheckedCreateWithoutNurseProfilesInput>
    connectOrCreate?: HospitalCreateOrConnectWithoutNurseProfilesInput
    connect?: HospitalWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutNurseProfileNestedInput = {
    create?: XOR<UserCreateWithoutNurseProfileInput, UserUncheckedCreateWithoutNurseProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutNurseProfileInput
    upsert?: UserUpsertWithoutNurseProfileInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutNurseProfileInput, UserUpdateWithoutNurseProfileInput>, UserUncheckedUpdateWithoutNurseProfileInput>
  }

  export type HospitalUpdateOneRequiredWithoutNurseProfilesNestedInput = {
    create?: XOR<HospitalCreateWithoutNurseProfilesInput, HospitalUncheckedCreateWithoutNurseProfilesInput>
    connectOrCreate?: HospitalCreateOrConnectWithoutNurseProfilesInput
    upsert?: HospitalUpsertWithoutNurseProfilesInput
    connect?: HospitalWhereUniqueInput
    update?: XOR<XOR<HospitalUpdateToOneWithWhereWithoutNurseProfilesInput, HospitalUpdateWithoutNurseProfilesInput>, HospitalUncheckedUpdateWithoutNurseProfilesInput>
  }

  export type UserCreateNestedOneWithoutResearcherProfileInput = {
    create?: XOR<UserCreateWithoutResearcherProfileInput, UserUncheckedCreateWithoutResearcherProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutResearcherProfileInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutResearcherProfileNestedInput = {
    create?: XOR<UserCreateWithoutResearcherProfileInput, UserUncheckedCreateWithoutResearcherProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutResearcherProfileInput
    upsert?: UserUpsertWithoutResearcherProfileInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutResearcherProfileInput, UserUpdateWithoutResearcherProfileInput>, UserUncheckedUpdateWithoutResearcherProfileInput>
  }

  export type MotherProfileCreateNestedOneWithoutFollowUpSchedulesInput = {
    create?: XOR<MotherProfileCreateWithoutFollowUpSchedulesInput, MotherProfileUncheckedCreateWithoutFollowUpSchedulesInput>
    connectOrCreate?: MotherProfileCreateOrConnectWithoutFollowUpSchedulesInput
    connect?: MotherProfileWhereUniqueInput
  }

  export type MotherProfileUpdateOneRequiredWithoutFollowUpSchedulesNestedInput = {
    create?: XOR<MotherProfileCreateWithoutFollowUpSchedulesInput, MotherProfileUncheckedCreateWithoutFollowUpSchedulesInput>
    connectOrCreate?: MotherProfileCreateOrConnectWithoutFollowUpSchedulesInput
    upsert?: MotherProfileUpsertWithoutFollowUpSchedulesInput
    connect?: MotherProfileWhereUniqueInput
    update?: XOR<XOR<MotherProfileUpdateToOneWithWhereWithoutFollowUpSchedulesInput, MotherProfileUpdateWithoutFollowUpSchedulesInput>, MotherProfileUncheckedUpdateWithoutFollowUpSchedulesInput>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type UserCreateWithoutHospitalInput = {
    id?: string
    phone: string
    phoneVerified?: boolean
    email?: string | null
    passwordHash: string
    pinHash?: string | null
    role: string
    preferredLanguage?: string
    isActive?: boolean
    lastLoginAt?: Date | string | null
    failedPasswordAttempts?: number
    passwordLockedUntil?: Date | string | null
    failedPinAttempts?: number
    pinLockedUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    motherProfile?: MotherProfileCreateNestedOneWithoutUserInput
    nurseProfile?: NurseProfileCreateNestedOneWithoutUserInput
    researcherProfile?: ResearcherProfileCreateNestedOneWithoutUserInput
    refreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutHospitalInput = {
    id?: string
    phone: string
    phoneVerified?: boolean
    email?: string | null
    passwordHash: string
    pinHash?: string | null
    role: string
    preferredLanguage?: string
    isActive?: boolean
    lastLoginAt?: Date | string | null
    failedPasswordAttempts?: number
    passwordLockedUntil?: Date | string | null
    failedPinAttempts?: number
    pinLockedUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    motherProfile?: MotherProfileUncheckedCreateNestedOneWithoutUserInput
    nurseProfile?: NurseProfileUncheckedCreateNestedOneWithoutUserInput
    researcherProfile?: ResearcherProfileUncheckedCreateNestedOneWithoutUserInput
    refreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutHospitalInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutHospitalInput, UserUncheckedCreateWithoutHospitalInput>
  }

  export type UserCreateManyHospitalInputEnvelope = {
    data: UserCreateManyHospitalInput | UserCreateManyHospitalInput[]
    skipDuplicates?: boolean
  }

  export type MotherProfileCreateWithoutHospitalInput = {
    id?: string
    participantCode?: string | null
    studyGroup?: string | null
    fullName?: string | null
    ageRange: string
    educationMother: string
    educationFather: string
    occupationMother: string
    occupationFather: string
    incomeClass: string
    familyType: string
    familyMembersCount: string
    religion: string
    residenceType: string
    contactNumber?: string | null
    prevPretermEducation?: boolean
    educationSource?: MotherProfileCreateeducationSourceInput | string[]
    enrolledAt?: Date | string
    onboardingCompletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutMotherProfileInput
    babyProfile?: BabyProfileCreateNestedOneWithoutMotherProfileInput
    followUpSchedules?: FollowUpScheduleCreateNestedManyWithoutMotherProfileInput
  }

  export type MotherProfileUncheckedCreateWithoutHospitalInput = {
    id?: string
    userId: string
    participantCode?: string | null
    studyGroup?: string | null
    fullName?: string | null
    ageRange: string
    educationMother: string
    educationFather: string
    occupationMother: string
    occupationFather: string
    incomeClass: string
    familyType: string
    familyMembersCount: string
    religion: string
    residenceType: string
    contactNumber?: string | null
    prevPretermEducation?: boolean
    educationSource?: MotherProfileCreateeducationSourceInput | string[]
    enrolledAt?: Date | string
    onboardingCompletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    babyProfile?: BabyProfileUncheckedCreateNestedOneWithoutMotherProfileInput
    followUpSchedules?: FollowUpScheduleUncheckedCreateNestedManyWithoutMotherProfileInput
  }

  export type MotherProfileCreateOrConnectWithoutHospitalInput = {
    where: MotherProfileWhereUniqueInput
    create: XOR<MotherProfileCreateWithoutHospitalInput, MotherProfileUncheckedCreateWithoutHospitalInput>
  }

  export type MotherProfileCreateManyHospitalInputEnvelope = {
    data: MotherProfileCreateManyHospitalInput | MotherProfileCreateManyHospitalInput[]
    skipDuplicates?: boolean
  }

  export type NurseProfileCreateWithoutHospitalInput = {
    id?: string
    fullName: string
    employeeId?: string | null
    isActive?: boolean
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutNurseProfileInput
  }

  export type NurseProfileUncheckedCreateWithoutHospitalInput = {
    id?: string
    userId: string
    fullName: string
    employeeId?: string | null
    isActive?: boolean
    createdAt?: Date | string
  }

  export type NurseProfileCreateOrConnectWithoutHospitalInput = {
    where: NurseProfileWhereUniqueInput
    create: XOR<NurseProfileCreateWithoutHospitalInput, NurseProfileUncheckedCreateWithoutHospitalInput>
  }

  export type NurseProfileCreateManyHospitalInputEnvelope = {
    data: NurseProfileCreateManyHospitalInput | NurseProfileCreateManyHospitalInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithWhereUniqueWithoutHospitalInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutHospitalInput, UserUncheckedUpdateWithoutHospitalInput>
    create: XOR<UserCreateWithoutHospitalInput, UserUncheckedCreateWithoutHospitalInput>
  }

  export type UserUpdateWithWhereUniqueWithoutHospitalInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutHospitalInput, UserUncheckedUpdateWithoutHospitalInput>
  }

  export type UserUpdateManyWithWhereWithoutHospitalInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutHospitalInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: UuidFilter<"User"> | string
    phone?: StringFilter<"User"> | string
    phoneVerified?: BoolFilter<"User"> | boolean
    email?: StringNullableFilter<"User"> | string | null
    passwordHash?: StringFilter<"User"> | string
    pinHash?: StringNullableFilter<"User"> | string | null
    role?: StringFilter<"User"> | string
    preferredLanguage?: StringFilter<"User"> | string
    hospitalId?: UuidNullableFilter<"User"> | string | null
    isActive?: BoolFilter<"User"> | boolean
    lastLoginAt?: DateTimeNullableFilter<"User"> | Date | string | null
    failedPasswordAttempts?: IntFilter<"User"> | number
    passwordLockedUntil?: DateTimeNullableFilter<"User"> | Date | string | null
    failedPinAttempts?: IntFilter<"User"> | number
    pinLockedUntil?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    deletedAt?: DateTimeNullableFilter<"User"> | Date | string | null
  }

  export type MotherProfileUpsertWithWhereUniqueWithoutHospitalInput = {
    where: MotherProfileWhereUniqueInput
    update: XOR<MotherProfileUpdateWithoutHospitalInput, MotherProfileUncheckedUpdateWithoutHospitalInput>
    create: XOR<MotherProfileCreateWithoutHospitalInput, MotherProfileUncheckedCreateWithoutHospitalInput>
  }

  export type MotherProfileUpdateWithWhereUniqueWithoutHospitalInput = {
    where: MotherProfileWhereUniqueInput
    data: XOR<MotherProfileUpdateWithoutHospitalInput, MotherProfileUncheckedUpdateWithoutHospitalInput>
  }

  export type MotherProfileUpdateManyWithWhereWithoutHospitalInput = {
    where: MotherProfileScalarWhereInput
    data: XOR<MotherProfileUpdateManyMutationInput, MotherProfileUncheckedUpdateManyWithoutHospitalInput>
  }

  export type MotherProfileScalarWhereInput = {
    AND?: MotherProfileScalarWhereInput | MotherProfileScalarWhereInput[]
    OR?: MotherProfileScalarWhereInput[]
    NOT?: MotherProfileScalarWhereInput | MotherProfileScalarWhereInput[]
    id?: UuidFilter<"MotherProfile"> | string
    userId?: UuidFilter<"MotherProfile"> | string
    participantCode?: StringNullableFilter<"MotherProfile"> | string | null
    studyGroup?: StringNullableFilter<"MotherProfile"> | string | null
    hospitalId?: UuidNullableFilter<"MotherProfile"> | string | null
    fullName?: StringNullableFilter<"MotherProfile"> | string | null
    ageRange?: StringFilter<"MotherProfile"> | string
    educationMother?: StringFilter<"MotherProfile"> | string
    educationFather?: StringFilter<"MotherProfile"> | string
    occupationMother?: StringFilter<"MotherProfile"> | string
    occupationFather?: StringFilter<"MotherProfile"> | string
    incomeClass?: StringFilter<"MotherProfile"> | string
    familyType?: StringFilter<"MotherProfile"> | string
    familyMembersCount?: StringFilter<"MotherProfile"> | string
    religion?: StringFilter<"MotherProfile"> | string
    residenceType?: StringFilter<"MotherProfile"> | string
    contactNumber?: StringNullableFilter<"MotherProfile"> | string | null
    prevPretermEducation?: BoolFilter<"MotherProfile"> | boolean
    educationSource?: StringNullableListFilter<"MotherProfile">
    enrolledAt?: DateTimeFilter<"MotherProfile"> | Date | string
    onboardingCompletedAt?: DateTimeNullableFilter<"MotherProfile"> | Date | string | null
    createdAt?: DateTimeFilter<"MotherProfile"> | Date | string
    updatedAt?: DateTimeFilter<"MotherProfile"> | Date | string
  }

  export type NurseProfileUpsertWithWhereUniqueWithoutHospitalInput = {
    where: NurseProfileWhereUniqueInput
    update: XOR<NurseProfileUpdateWithoutHospitalInput, NurseProfileUncheckedUpdateWithoutHospitalInput>
    create: XOR<NurseProfileCreateWithoutHospitalInput, NurseProfileUncheckedCreateWithoutHospitalInput>
  }

  export type NurseProfileUpdateWithWhereUniqueWithoutHospitalInput = {
    where: NurseProfileWhereUniqueInput
    data: XOR<NurseProfileUpdateWithoutHospitalInput, NurseProfileUncheckedUpdateWithoutHospitalInput>
  }

  export type NurseProfileUpdateManyWithWhereWithoutHospitalInput = {
    where: NurseProfileScalarWhereInput
    data: XOR<NurseProfileUpdateManyMutationInput, NurseProfileUncheckedUpdateManyWithoutHospitalInput>
  }

  export type NurseProfileScalarWhereInput = {
    AND?: NurseProfileScalarWhereInput | NurseProfileScalarWhereInput[]
    OR?: NurseProfileScalarWhereInput[]
    NOT?: NurseProfileScalarWhereInput | NurseProfileScalarWhereInput[]
    id?: UuidFilter<"NurseProfile"> | string
    userId?: UuidFilter<"NurseProfile"> | string
    hospitalId?: UuidFilter<"NurseProfile"> | string
    fullName?: StringFilter<"NurseProfile"> | string
    employeeId?: StringNullableFilter<"NurseProfile"> | string | null
    isActive?: BoolFilter<"NurseProfile"> | boolean
    createdAt?: DateTimeFilter<"NurseProfile"> | Date | string
  }

  export type HospitalCreateWithoutUsersInput = {
    id?: string
    name: string
    code: string
    district: string
    state?: string
    type: string
    emergencyPhone?: string | null
    isActive?: boolean
    nextParticipantNumber?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    motherProfiles?: MotherProfileCreateNestedManyWithoutHospitalInput
    nurseProfiles?: NurseProfileCreateNestedManyWithoutHospitalInput
  }

  export type HospitalUncheckedCreateWithoutUsersInput = {
    id?: string
    name: string
    code: string
    district: string
    state?: string
    type: string
    emergencyPhone?: string | null
    isActive?: boolean
    nextParticipantNumber?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    motherProfiles?: MotherProfileUncheckedCreateNestedManyWithoutHospitalInput
    nurseProfiles?: NurseProfileUncheckedCreateNestedManyWithoutHospitalInput
  }

  export type HospitalCreateOrConnectWithoutUsersInput = {
    where: HospitalWhereUniqueInput
    create: XOR<HospitalCreateWithoutUsersInput, HospitalUncheckedCreateWithoutUsersInput>
  }

  export type MotherProfileCreateWithoutUserInput = {
    id?: string
    participantCode?: string | null
    studyGroup?: string | null
    fullName?: string | null
    ageRange: string
    educationMother: string
    educationFather: string
    occupationMother: string
    occupationFather: string
    incomeClass: string
    familyType: string
    familyMembersCount: string
    religion: string
    residenceType: string
    contactNumber?: string | null
    prevPretermEducation?: boolean
    educationSource?: MotherProfileCreateeducationSourceInput | string[]
    enrolledAt?: Date | string
    onboardingCompletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    hospital?: HospitalCreateNestedOneWithoutMotherProfilesInput
    babyProfile?: BabyProfileCreateNestedOneWithoutMotherProfileInput
    followUpSchedules?: FollowUpScheduleCreateNestedManyWithoutMotherProfileInput
  }

  export type MotherProfileUncheckedCreateWithoutUserInput = {
    id?: string
    participantCode?: string | null
    studyGroup?: string | null
    hospitalId?: string | null
    fullName?: string | null
    ageRange: string
    educationMother: string
    educationFather: string
    occupationMother: string
    occupationFather: string
    incomeClass: string
    familyType: string
    familyMembersCount: string
    religion: string
    residenceType: string
    contactNumber?: string | null
    prevPretermEducation?: boolean
    educationSource?: MotherProfileCreateeducationSourceInput | string[]
    enrolledAt?: Date | string
    onboardingCompletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    babyProfile?: BabyProfileUncheckedCreateNestedOneWithoutMotherProfileInput
    followUpSchedules?: FollowUpScheduleUncheckedCreateNestedManyWithoutMotherProfileInput
  }

  export type MotherProfileCreateOrConnectWithoutUserInput = {
    where: MotherProfileWhereUniqueInput
    create: XOR<MotherProfileCreateWithoutUserInput, MotherProfileUncheckedCreateWithoutUserInput>
  }

  export type NurseProfileCreateWithoutUserInput = {
    id?: string
    fullName: string
    employeeId?: string | null
    isActive?: boolean
    createdAt?: Date | string
    hospital: HospitalCreateNestedOneWithoutNurseProfilesInput
  }

  export type NurseProfileUncheckedCreateWithoutUserInput = {
    id?: string
    hospitalId: string
    fullName: string
    employeeId?: string | null
    isActive?: boolean
    createdAt?: Date | string
  }

  export type NurseProfileCreateOrConnectWithoutUserInput = {
    where: NurseProfileWhereUniqueInput
    create: XOR<NurseProfileCreateWithoutUserInput, NurseProfileUncheckedCreateWithoutUserInput>
  }

  export type ResearcherProfileCreateWithoutUserInput = {
    id?: string
    fullName: string
    designation?: string | null
    email: string
    accessLevel?: string
    createdAt?: Date | string
  }

  export type ResearcherProfileUncheckedCreateWithoutUserInput = {
    id?: string
    fullName: string
    designation?: string | null
    email: string
    accessLevel?: string
    createdAt?: Date | string
  }

  export type ResearcherProfileCreateOrConnectWithoutUserInput = {
    where: ResearcherProfileWhereUniqueInput
    create: XOR<ResearcherProfileCreateWithoutUserInput, ResearcherProfileUncheckedCreateWithoutUserInput>
  }

  export type RefreshTokenCreateWithoutUserInput = {
    id?: string
    tokenHash: string
    deviceInfo?: string | null
    expiresAt: Date | string
    revokedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type RefreshTokenUncheckedCreateWithoutUserInput = {
    id?: string
    tokenHash: string
    deviceInfo?: string | null
    expiresAt: Date | string
    revokedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type RefreshTokenCreateOrConnectWithoutUserInput = {
    where: RefreshTokenWhereUniqueInput
    create: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput>
  }

  export type RefreshTokenCreateManyUserInputEnvelope = {
    data: RefreshTokenCreateManyUserInput | RefreshTokenCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type HospitalUpsertWithoutUsersInput = {
    update: XOR<HospitalUpdateWithoutUsersInput, HospitalUncheckedUpdateWithoutUsersInput>
    create: XOR<HospitalCreateWithoutUsersInput, HospitalUncheckedCreateWithoutUsersInput>
    where?: HospitalWhereInput
  }

  export type HospitalUpdateToOneWithWhereWithoutUsersInput = {
    where?: HospitalWhereInput
    data: XOR<HospitalUpdateWithoutUsersInput, HospitalUncheckedUpdateWithoutUsersInput>
  }

  export type HospitalUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    district?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    nextParticipantNumber?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    motherProfiles?: MotherProfileUpdateManyWithoutHospitalNestedInput
    nurseProfiles?: NurseProfileUpdateManyWithoutHospitalNestedInput
  }

  export type HospitalUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    district?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    nextParticipantNumber?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    motherProfiles?: MotherProfileUncheckedUpdateManyWithoutHospitalNestedInput
    nurseProfiles?: NurseProfileUncheckedUpdateManyWithoutHospitalNestedInput
  }

  export type MotherProfileUpsertWithoutUserInput = {
    update: XOR<MotherProfileUpdateWithoutUserInput, MotherProfileUncheckedUpdateWithoutUserInput>
    create: XOR<MotherProfileCreateWithoutUserInput, MotherProfileUncheckedCreateWithoutUserInput>
    where?: MotherProfileWhereInput
  }

  export type MotherProfileUpdateToOneWithWhereWithoutUserInput = {
    where?: MotherProfileWhereInput
    data: XOR<MotherProfileUpdateWithoutUserInput, MotherProfileUncheckedUpdateWithoutUserInput>
  }

  export type MotherProfileUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    participantCode?: NullableStringFieldUpdateOperationsInput | string | null
    studyGroup?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    ageRange?: StringFieldUpdateOperationsInput | string
    educationMother?: StringFieldUpdateOperationsInput | string
    educationFather?: StringFieldUpdateOperationsInput | string
    occupationMother?: StringFieldUpdateOperationsInput | string
    occupationFather?: StringFieldUpdateOperationsInput | string
    incomeClass?: StringFieldUpdateOperationsInput | string
    familyType?: StringFieldUpdateOperationsInput | string
    familyMembersCount?: StringFieldUpdateOperationsInput | string
    religion?: StringFieldUpdateOperationsInput | string
    residenceType?: StringFieldUpdateOperationsInput | string
    contactNumber?: NullableStringFieldUpdateOperationsInput | string | null
    prevPretermEducation?: BoolFieldUpdateOperationsInput | boolean
    educationSource?: MotherProfileUpdateeducationSourceInput | string[]
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hospital?: HospitalUpdateOneWithoutMotherProfilesNestedInput
    babyProfile?: BabyProfileUpdateOneWithoutMotherProfileNestedInput
    followUpSchedules?: FollowUpScheduleUpdateManyWithoutMotherProfileNestedInput
  }

  export type MotherProfileUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    participantCode?: NullableStringFieldUpdateOperationsInput | string | null
    studyGroup?: NullableStringFieldUpdateOperationsInput | string | null
    hospitalId?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    ageRange?: StringFieldUpdateOperationsInput | string
    educationMother?: StringFieldUpdateOperationsInput | string
    educationFather?: StringFieldUpdateOperationsInput | string
    occupationMother?: StringFieldUpdateOperationsInput | string
    occupationFather?: StringFieldUpdateOperationsInput | string
    incomeClass?: StringFieldUpdateOperationsInput | string
    familyType?: StringFieldUpdateOperationsInput | string
    familyMembersCount?: StringFieldUpdateOperationsInput | string
    religion?: StringFieldUpdateOperationsInput | string
    residenceType?: StringFieldUpdateOperationsInput | string
    contactNumber?: NullableStringFieldUpdateOperationsInput | string | null
    prevPretermEducation?: BoolFieldUpdateOperationsInput | boolean
    educationSource?: MotherProfileUpdateeducationSourceInput | string[]
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    babyProfile?: BabyProfileUncheckedUpdateOneWithoutMotherProfileNestedInput
    followUpSchedules?: FollowUpScheduleUncheckedUpdateManyWithoutMotherProfileNestedInput
  }

  export type NurseProfileUpsertWithoutUserInput = {
    update: XOR<NurseProfileUpdateWithoutUserInput, NurseProfileUncheckedUpdateWithoutUserInput>
    create: XOR<NurseProfileCreateWithoutUserInput, NurseProfileUncheckedCreateWithoutUserInput>
    where?: NurseProfileWhereInput
  }

  export type NurseProfileUpdateToOneWithWhereWithoutUserInput = {
    where?: NurseProfileWhereInput
    data: XOR<NurseProfileUpdateWithoutUserInput, NurseProfileUncheckedUpdateWithoutUserInput>
  }

  export type NurseProfileUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hospital?: HospitalUpdateOneRequiredWithoutNurseProfilesNestedInput
  }

  export type NurseProfileUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    hospitalId?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResearcherProfileUpsertWithoutUserInput = {
    update: XOR<ResearcherProfileUpdateWithoutUserInput, ResearcherProfileUncheckedUpdateWithoutUserInput>
    create: XOR<ResearcherProfileCreateWithoutUserInput, ResearcherProfileUncheckedCreateWithoutUserInput>
    where?: ResearcherProfileWhereInput
  }

  export type ResearcherProfileUpdateToOneWithWhereWithoutUserInput = {
    where?: ResearcherProfileWhereInput
    data: XOR<ResearcherProfileUpdateWithoutUserInput, ResearcherProfileUncheckedUpdateWithoutUserInput>
  }

  export type ResearcherProfileUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    designation?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    accessLevel?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ResearcherProfileUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    designation?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    accessLevel?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenUpsertWithWhereUniqueWithoutUserInput = {
    where: RefreshTokenWhereUniqueInput
    update: XOR<RefreshTokenUpdateWithoutUserInput, RefreshTokenUncheckedUpdateWithoutUserInput>
    create: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput>
  }

  export type RefreshTokenUpdateWithWhereUniqueWithoutUserInput = {
    where: RefreshTokenWhereUniqueInput
    data: XOR<RefreshTokenUpdateWithoutUserInput, RefreshTokenUncheckedUpdateWithoutUserInput>
  }

  export type RefreshTokenUpdateManyWithWhereWithoutUserInput = {
    where: RefreshTokenScalarWhereInput
    data: XOR<RefreshTokenUpdateManyMutationInput, RefreshTokenUncheckedUpdateManyWithoutUserInput>
  }

  export type RefreshTokenScalarWhereInput = {
    AND?: RefreshTokenScalarWhereInput | RefreshTokenScalarWhereInput[]
    OR?: RefreshTokenScalarWhereInput[]
    NOT?: RefreshTokenScalarWhereInput | RefreshTokenScalarWhereInput[]
    id?: UuidFilter<"RefreshToken"> | string
    userId?: UuidFilter<"RefreshToken"> | string
    tokenHash?: StringFilter<"RefreshToken"> | string
    deviceInfo?: StringNullableFilter<"RefreshToken"> | string | null
    expiresAt?: DateTimeFilter<"RefreshToken"> | Date | string
    revokedAt?: DateTimeNullableFilter<"RefreshToken"> | Date | string | null
    createdAt?: DateTimeFilter<"RefreshToken"> | Date | string
  }

  export type UserCreateWithoutRefreshTokensInput = {
    id?: string
    phone: string
    phoneVerified?: boolean
    email?: string | null
    passwordHash: string
    pinHash?: string | null
    role: string
    preferredLanguage?: string
    isActive?: boolean
    lastLoginAt?: Date | string | null
    failedPasswordAttempts?: number
    passwordLockedUntil?: Date | string | null
    failedPinAttempts?: number
    pinLockedUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    hospital?: HospitalCreateNestedOneWithoutUsersInput
    motherProfile?: MotherProfileCreateNestedOneWithoutUserInput
    nurseProfile?: NurseProfileCreateNestedOneWithoutUserInput
    researcherProfile?: ResearcherProfileCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutRefreshTokensInput = {
    id?: string
    phone: string
    phoneVerified?: boolean
    email?: string | null
    passwordHash: string
    pinHash?: string | null
    role: string
    preferredLanguage?: string
    hospitalId?: string | null
    isActive?: boolean
    lastLoginAt?: Date | string | null
    failedPasswordAttempts?: number
    passwordLockedUntil?: Date | string | null
    failedPinAttempts?: number
    pinLockedUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    motherProfile?: MotherProfileUncheckedCreateNestedOneWithoutUserInput
    nurseProfile?: NurseProfileUncheckedCreateNestedOneWithoutUserInput
    researcherProfile?: ResearcherProfileUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutRefreshTokensInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRefreshTokensInput, UserUncheckedCreateWithoutRefreshTokensInput>
  }

  export type UserUpsertWithoutRefreshTokensInput = {
    update: XOR<UserUpdateWithoutRefreshTokensInput, UserUncheckedUpdateWithoutRefreshTokensInput>
    create: XOR<UserCreateWithoutRefreshTokensInput, UserUncheckedCreateWithoutRefreshTokensInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutRefreshTokensInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutRefreshTokensInput, UserUncheckedUpdateWithoutRefreshTokensInput>
  }

  export type UserUpdateWithoutRefreshTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    phoneVerified?: BoolFieldUpdateOperationsInput | boolean
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    pinHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedPasswordAttempts?: IntFieldUpdateOperationsInput | number
    passwordLockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedPinAttempts?: IntFieldUpdateOperationsInput | number
    pinLockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    hospital?: HospitalUpdateOneWithoutUsersNestedInput
    motherProfile?: MotherProfileUpdateOneWithoutUserNestedInput
    nurseProfile?: NurseProfileUpdateOneWithoutUserNestedInput
    researcherProfile?: ResearcherProfileUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutRefreshTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    phoneVerified?: BoolFieldUpdateOperationsInput | boolean
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    pinHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    hospitalId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedPasswordAttempts?: IntFieldUpdateOperationsInput | number
    passwordLockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedPinAttempts?: IntFieldUpdateOperationsInput | number
    pinLockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    motherProfile?: MotherProfileUncheckedUpdateOneWithoutUserNestedInput
    nurseProfile?: NurseProfileUncheckedUpdateOneWithoutUserNestedInput
    researcherProfile?: ResearcherProfileUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutMotherProfileInput = {
    id?: string
    phone: string
    phoneVerified?: boolean
    email?: string | null
    passwordHash: string
    pinHash?: string | null
    role: string
    preferredLanguage?: string
    isActive?: boolean
    lastLoginAt?: Date | string | null
    failedPasswordAttempts?: number
    passwordLockedUntil?: Date | string | null
    failedPinAttempts?: number
    pinLockedUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    hospital?: HospitalCreateNestedOneWithoutUsersInput
    nurseProfile?: NurseProfileCreateNestedOneWithoutUserInput
    researcherProfile?: ResearcherProfileCreateNestedOneWithoutUserInput
    refreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutMotherProfileInput = {
    id?: string
    phone: string
    phoneVerified?: boolean
    email?: string | null
    passwordHash: string
    pinHash?: string | null
    role: string
    preferredLanguage?: string
    hospitalId?: string | null
    isActive?: boolean
    lastLoginAt?: Date | string | null
    failedPasswordAttempts?: number
    passwordLockedUntil?: Date | string | null
    failedPinAttempts?: number
    pinLockedUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    nurseProfile?: NurseProfileUncheckedCreateNestedOneWithoutUserInput
    researcherProfile?: ResearcherProfileUncheckedCreateNestedOneWithoutUserInput
    refreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutMotherProfileInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMotherProfileInput, UserUncheckedCreateWithoutMotherProfileInput>
  }

  export type HospitalCreateWithoutMotherProfilesInput = {
    id?: string
    name: string
    code: string
    district: string
    state?: string
    type: string
    emergencyPhone?: string | null
    isActive?: boolean
    nextParticipantNumber?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserCreateNestedManyWithoutHospitalInput
    nurseProfiles?: NurseProfileCreateNestedManyWithoutHospitalInput
  }

  export type HospitalUncheckedCreateWithoutMotherProfilesInput = {
    id?: string
    name: string
    code: string
    district: string
    state?: string
    type: string
    emergencyPhone?: string | null
    isActive?: boolean
    nextParticipantNumber?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutHospitalInput
    nurseProfiles?: NurseProfileUncheckedCreateNestedManyWithoutHospitalInput
  }

  export type HospitalCreateOrConnectWithoutMotherProfilesInput = {
    where: HospitalWhereUniqueInput
    create: XOR<HospitalCreateWithoutMotherProfilesInput, HospitalUncheckedCreateWithoutMotherProfilesInput>
  }

  export type BabyProfileCreateWithoutMotherProfileInput = {
    id?: string
    babyName?: string | null
    sex: string
    dateOfBirth: Date | string
    gestationalAgeWeeks: Decimal | DecimalJsLike | number | string
    birthWeightGrams: number
    weightAtDischargeGrams: number
    placeOfDelivery: string
    nicuStayDays: number
    skinToSkinAtBirth: boolean
    kmcInNicu: boolean
    feedingAtDischarge: string
    criedAtBirth: boolean
    neededResuscitation: boolean
    birthWeightStratum: string
    dischargeDate: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BabyProfileUncheckedCreateWithoutMotherProfileInput = {
    id?: string
    babyName?: string | null
    sex: string
    dateOfBirth: Date | string
    gestationalAgeWeeks: Decimal | DecimalJsLike | number | string
    birthWeightGrams: number
    weightAtDischargeGrams: number
    placeOfDelivery: string
    nicuStayDays: number
    skinToSkinAtBirth: boolean
    kmcInNicu: boolean
    feedingAtDischarge: string
    criedAtBirth: boolean
    neededResuscitation: boolean
    birthWeightStratum: string
    dischargeDate: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BabyProfileCreateOrConnectWithoutMotherProfileInput = {
    where: BabyProfileWhereUniqueInput
    create: XOR<BabyProfileCreateWithoutMotherProfileInput, BabyProfileUncheckedCreateWithoutMotherProfileInput>
  }

  export type FollowUpScheduleCreateWithoutMotherProfileInput = {
    id?: string
    timePoint: string
    scheduledDate: Date | string
    actualDate?: Date | string | null
    status?: string
    dataComplete?: boolean
    collectedByUserId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FollowUpScheduleUncheckedCreateWithoutMotherProfileInput = {
    id?: string
    timePoint: string
    scheduledDate: Date | string
    actualDate?: Date | string | null
    status?: string
    dataComplete?: boolean
    collectedByUserId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FollowUpScheduleCreateOrConnectWithoutMotherProfileInput = {
    where: FollowUpScheduleWhereUniqueInput
    create: XOR<FollowUpScheduleCreateWithoutMotherProfileInput, FollowUpScheduleUncheckedCreateWithoutMotherProfileInput>
  }

  export type FollowUpScheduleCreateManyMotherProfileInputEnvelope = {
    data: FollowUpScheduleCreateManyMotherProfileInput | FollowUpScheduleCreateManyMotherProfileInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutMotherProfileInput = {
    update: XOR<UserUpdateWithoutMotherProfileInput, UserUncheckedUpdateWithoutMotherProfileInput>
    create: XOR<UserCreateWithoutMotherProfileInput, UserUncheckedCreateWithoutMotherProfileInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMotherProfileInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMotherProfileInput, UserUncheckedUpdateWithoutMotherProfileInput>
  }

  export type UserUpdateWithoutMotherProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    phoneVerified?: BoolFieldUpdateOperationsInput | boolean
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    pinHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedPasswordAttempts?: IntFieldUpdateOperationsInput | number
    passwordLockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedPinAttempts?: IntFieldUpdateOperationsInput | number
    pinLockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    hospital?: HospitalUpdateOneWithoutUsersNestedInput
    nurseProfile?: NurseProfileUpdateOneWithoutUserNestedInput
    researcherProfile?: ResearcherProfileUpdateOneWithoutUserNestedInput
    refreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutMotherProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    phoneVerified?: BoolFieldUpdateOperationsInput | boolean
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    pinHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    hospitalId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedPasswordAttempts?: IntFieldUpdateOperationsInput | number
    passwordLockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedPinAttempts?: IntFieldUpdateOperationsInput | number
    pinLockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nurseProfile?: NurseProfileUncheckedUpdateOneWithoutUserNestedInput
    researcherProfile?: ResearcherProfileUncheckedUpdateOneWithoutUserNestedInput
    refreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type HospitalUpsertWithoutMotherProfilesInput = {
    update: XOR<HospitalUpdateWithoutMotherProfilesInput, HospitalUncheckedUpdateWithoutMotherProfilesInput>
    create: XOR<HospitalCreateWithoutMotherProfilesInput, HospitalUncheckedCreateWithoutMotherProfilesInput>
    where?: HospitalWhereInput
  }

  export type HospitalUpdateToOneWithWhereWithoutMotherProfilesInput = {
    where?: HospitalWhereInput
    data: XOR<HospitalUpdateWithoutMotherProfilesInput, HospitalUncheckedUpdateWithoutMotherProfilesInput>
  }

  export type HospitalUpdateWithoutMotherProfilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    district?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    nextParticipantNumber?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutHospitalNestedInput
    nurseProfiles?: NurseProfileUpdateManyWithoutHospitalNestedInput
  }

  export type HospitalUncheckedUpdateWithoutMotherProfilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    district?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    nextParticipantNumber?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutHospitalNestedInput
    nurseProfiles?: NurseProfileUncheckedUpdateManyWithoutHospitalNestedInput
  }

  export type BabyProfileUpsertWithoutMotherProfileInput = {
    update: XOR<BabyProfileUpdateWithoutMotherProfileInput, BabyProfileUncheckedUpdateWithoutMotherProfileInput>
    create: XOR<BabyProfileCreateWithoutMotherProfileInput, BabyProfileUncheckedCreateWithoutMotherProfileInput>
    where?: BabyProfileWhereInput
  }

  export type BabyProfileUpdateToOneWithWhereWithoutMotherProfileInput = {
    where?: BabyProfileWhereInput
    data: XOR<BabyProfileUpdateWithoutMotherProfileInput, BabyProfileUncheckedUpdateWithoutMotherProfileInput>
  }

  export type BabyProfileUpdateWithoutMotherProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    babyName?: NullableStringFieldUpdateOperationsInput | string | null
    sex?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gestationalAgeWeeks?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    birthWeightGrams?: IntFieldUpdateOperationsInput | number
    weightAtDischargeGrams?: IntFieldUpdateOperationsInput | number
    placeOfDelivery?: StringFieldUpdateOperationsInput | string
    nicuStayDays?: IntFieldUpdateOperationsInput | number
    skinToSkinAtBirth?: BoolFieldUpdateOperationsInput | boolean
    kmcInNicu?: BoolFieldUpdateOperationsInput | boolean
    feedingAtDischarge?: StringFieldUpdateOperationsInput | string
    criedAtBirth?: BoolFieldUpdateOperationsInput | boolean
    neededResuscitation?: BoolFieldUpdateOperationsInput | boolean
    birthWeightStratum?: StringFieldUpdateOperationsInput | string
    dischargeDate?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BabyProfileUncheckedUpdateWithoutMotherProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    babyName?: NullableStringFieldUpdateOperationsInput | string | null
    sex?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gestationalAgeWeeks?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    birthWeightGrams?: IntFieldUpdateOperationsInput | number
    weightAtDischargeGrams?: IntFieldUpdateOperationsInput | number
    placeOfDelivery?: StringFieldUpdateOperationsInput | string
    nicuStayDays?: IntFieldUpdateOperationsInput | number
    skinToSkinAtBirth?: BoolFieldUpdateOperationsInput | boolean
    kmcInNicu?: BoolFieldUpdateOperationsInput | boolean
    feedingAtDischarge?: StringFieldUpdateOperationsInput | string
    criedAtBirth?: BoolFieldUpdateOperationsInput | boolean
    neededResuscitation?: BoolFieldUpdateOperationsInput | boolean
    birthWeightStratum?: StringFieldUpdateOperationsInput | string
    dischargeDate?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FollowUpScheduleUpsertWithWhereUniqueWithoutMotherProfileInput = {
    where: FollowUpScheduleWhereUniqueInput
    update: XOR<FollowUpScheduleUpdateWithoutMotherProfileInput, FollowUpScheduleUncheckedUpdateWithoutMotherProfileInput>
    create: XOR<FollowUpScheduleCreateWithoutMotherProfileInput, FollowUpScheduleUncheckedCreateWithoutMotherProfileInput>
  }

  export type FollowUpScheduleUpdateWithWhereUniqueWithoutMotherProfileInput = {
    where: FollowUpScheduleWhereUniqueInput
    data: XOR<FollowUpScheduleUpdateWithoutMotherProfileInput, FollowUpScheduleUncheckedUpdateWithoutMotherProfileInput>
  }

  export type FollowUpScheduleUpdateManyWithWhereWithoutMotherProfileInput = {
    where: FollowUpScheduleScalarWhereInput
    data: XOR<FollowUpScheduleUpdateManyMutationInput, FollowUpScheduleUncheckedUpdateManyWithoutMotherProfileInput>
  }

  export type FollowUpScheduleScalarWhereInput = {
    AND?: FollowUpScheduleScalarWhereInput | FollowUpScheduleScalarWhereInput[]
    OR?: FollowUpScheduleScalarWhereInput[]
    NOT?: FollowUpScheduleScalarWhereInput | FollowUpScheduleScalarWhereInput[]
    id?: UuidFilter<"FollowUpSchedule"> | string
    motherProfileId?: UuidFilter<"FollowUpSchedule"> | string
    timePoint?: StringFilter<"FollowUpSchedule"> | string
    scheduledDate?: DateTimeFilter<"FollowUpSchedule"> | Date | string
    actualDate?: DateTimeNullableFilter<"FollowUpSchedule"> | Date | string | null
    status?: StringFilter<"FollowUpSchedule"> | string
    dataComplete?: BoolFilter<"FollowUpSchedule"> | boolean
    collectedByUserId?: UuidNullableFilter<"FollowUpSchedule"> | string | null
    notes?: StringNullableFilter<"FollowUpSchedule"> | string | null
    createdAt?: DateTimeFilter<"FollowUpSchedule"> | Date | string
    updatedAt?: DateTimeFilter<"FollowUpSchedule"> | Date | string
  }

  export type MotherProfileCreateWithoutBabyProfileInput = {
    id?: string
    participantCode?: string | null
    studyGroup?: string | null
    fullName?: string | null
    ageRange: string
    educationMother: string
    educationFather: string
    occupationMother: string
    occupationFather: string
    incomeClass: string
    familyType: string
    familyMembersCount: string
    religion: string
    residenceType: string
    contactNumber?: string | null
    prevPretermEducation?: boolean
    educationSource?: MotherProfileCreateeducationSourceInput | string[]
    enrolledAt?: Date | string
    onboardingCompletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutMotherProfileInput
    hospital?: HospitalCreateNestedOneWithoutMotherProfilesInput
    followUpSchedules?: FollowUpScheduleCreateNestedManyWithoutMotherProfileInput
  }

  export type MotherProfileUncheckedCreateWithoutBabyProfileInput = {
    id?: string
    userId: string
    participantCode?: string | null
    studyGroup?: string | null
    hospitalId?: string | null
    fullName?: string | null
    ageRange: string
    educationMother: string
    educationFather: string
    occupationMother: string
    occupationFather: string
    incomeClass: string
    familyType: string
    familyMembersCount: string
    religion: string
    residenceType: string
    contactNumber?: string | null
    prevPretermEducation?: boolean
    educationSource?: MotherProfileCreateeducationSourceInput | string[]
    enrolledAt?: Date | string
    onboardingCompletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    followUpSchedules?: FollowUpScheduleUncheckedCreateNestedManyWithoutMotherProfileInput
  }

  export type MotherProfileCreateOrConnectWithoutBabyProfileInput = {
    where: MotherProfileWhereUniqueInput
    create: XOR<MotherProfileCreateWithoutBabyProfileInput, MotherProfileUncheckedCreateWithoutBabyProfileInput>
  }

  export type MotherProfileUpsertWithoutBabyProfileInput = {
    update: XOR<MotherProfileUpdateWithoutBabyProfileInput, MotherProfileUncheckedUpdateWithoutBabyProfileInput>
    create: XOR<MotherProfileCreateWithoutBabyProfileInput, MotherProfileUncheckedCreateWithoutBabyProfileInput>
    where?: MotherProfileWhereInput
  }

  export type MotherProfileUpdateToOneWithWhereWithoutBabyProfileInput = {
    where?: MotherProfileWhereInput
    data: XOR<MotherProfileUpdateWithoutBabyProfileInput, MotherProfileUncheckedUpdateWithoutBabyProfileInput>
  }

  export type MotherProfileUpdateWithoutBabyProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    participantCode?: NullableStringFieldUpdateOperationsInput | string | null
    studyGroup?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    ageRange?: StringFieldUpdateOperationsInput | string
    educationMother?: StringFieldUpdateOperationsInput | string
    educationFather?: StringFieldUpdateOperationsInput | string
    occupationMother?: StringFieldUpdateOperationsInput | string
    occupationFather?: StringFieldUpdateOperationsInput | string
    incomeClass?: StringFieldUpdateOperationsInput | string
    familyType?: StringFieldUpdateOperationsInput | string
    familyMembersCount?: StringFieldUpdateOperationsInput | string
    religion?: StringFieldUpdateOperationsInput | string
    residenceType?: StringFieldUpdateOperationsInput | string
    contactNumber?: NullableStringFieldUpdateOperationsInput | string | null
    prevPretermEducation?: BoolFieldUpdateOperationsInput | boolean
    educationSource?: MotherProfileUpdateeducationSourceInput | string[]
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMotherProfileNestedInput
    hospital?: HospitalUpdateOneWithoutMotherProfilesNestedInput
    followUpSchedules?: FollowUpScheduleUpdateManyWithoutMotherProfileNestedInput
  }

  export type MotherProfileUncheckedUpdateWithoutBabyProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    participantCode?: NullableStringFieldUpdateOperationsInput | string | null
    studyGroup?: NullableStringFieldUpdateOperationsInput | string | null
    hospitalId?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    ageRange?: StringFieldUpdateOperationsInput | string
    educationMother?: StringFieldUpdateOperationsInput | string
    educationFather?: StringFieldUpdateOperationsInput | string
    occupationMother?: StringFieldUpdateOperationsInput | string
    occupationFather?: StringFieldUpdateOperationsInput | string
    incomeClass?: StringFieldUpdateOperationsInput | string
    familyType?: StringFieldUpdateOperationsInput | string
    familyMembersCount?: StringFieldUpdateOperationsInput | string
    religion?: StringFieldUpdateOperationsInput | string
    residenceType?: StringFieldUpdateOperationsInput | string
    contactNumber?: NullableStringFieldUpdateOperationsInput | string | null
    prevPretermEducation?: BoolFieldUpdateOperationsInput | boolean
    educationSource?: MotherProfileUpdateeducationSourceInput | string[]
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    followUpSchedules?: FollowUpScheduleUncheckedUpdateManyWithoutMotherProfileNestedInput
  }

  export type UserCreateWithoutNurseProfileInput = {
    id?: string
    phone: string
    phoneVerified?: boolean
    email?: string | null
    passwordHash: string
    pinHash?: string | null
    role: string
    preferredLanguage?: string
    isActive?: boolean
    lastLoginAt?: Date | string | null
    failedPasswordAttempts?: number
    passwordLockedUntil?: Date | string | null
    failedPinAttempts?: number
    pinLockedUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    hospital?: HospitalCreateNestedOneWithoutUsersInput
    motherProfile?: MotherProfileCreateNestedOneWithoutUserInput
    researcherProfile?: ResearcherProfileCreateNestedOneWithoutUserInput
    refreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutNurseProfileInput = {
    id?: string
    phone: string
    phoneVerified?: boolean
    email?: string | null
    passwordHash: string
    pinHash?: string | null
    role: string
    preferredLanguage?: string
    hospitalId?: string | null
    isActive?: boolean
    lastLoginAt?: Date | string | null
    failedPasswordAttempts?: number
    passwordLockedUntil?: Date | string | null
    failedPinAttempts?: number
    pinLockedUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    motherProfile?: MotherProfileUncheckedCreateNestedOneWithoutUserInput
    researcherProfile?: ResearcherProfileUncheckedCreateNestedOneWithoutUserInput
    refreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutNurseProfileInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutNurseProfileInput, UserUncheckedCreateWithoutNurseProfileInput>
  }

  export type HospitalCreateWithoutNurseProfilesInput = {
    id?: string
    name: string
    code: string
    district: string
    state?: string
    type: string
    emergencyPhone?: string | null
    isActive?: boolean
    nextParticipantNumber?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserCreateNestedManyWithoutHospitalInput
    motherProfiles?: MotherProfileCreateNestedManyWithoutHospitalInput
  }

  export type HospitalUncheckedCreateWithoutNurseProfilesInput = {
    id?: string
    name: string
    code: string
    district: string
    state?: string
    type: string
    emergencyPhone?: string | null
    isActive?: boolean
    nextParticipantNumber?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutHospitalInput
    motherProfiles?: MotherProfileUncheckedCreateNestedManyWithoutHospitalInput
  }

  export type HospitalCreateOrConnectWithoutNurseProfilesInput = {
    where: HospitalWhereUniqueInput
    create: XOR<HospitalCreateWithoutNurseProfilesInput, HospitalUncheckedCreateWithoutNurseProfilesInput>
  }

  export type UserUpsertWithoutNurseProfileInput = {
    update: XOR<UserUpdateWithoutNurseProfileInput, UserUncheckedUpdateWithoutNurseProfileInput>
    create: XOR<UserCreateWithoutNurseProfileInput, UserUncheckedCreateWithoutNurseProfileInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutNurseProfileInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutNurseProfileInput, UserUncheckedUpdateWithoutNurseProfileInput>
  }

  export type UserUpdateWithoutNurseProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    phoneVerified?: BoolFieldUpdateOperationsInput | boolean
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    pinHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedPasswordAttempts?: IntFieldUpdateOperationsInput | number
    passwordLockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedPinAttempts?: IntFieldUpdateOperationsInput | number
    pinLockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    hospital?: HospitalUpdateOneWithoutUsersNestedInput
    motherProfile?: MotherProfileUpdateOneWithoutUserNestedInput
    researcherProfile?: ResearcherProfileUpdateOneWithoutUserNestedInput
    refreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutNurseProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    phoneVerified?: BoolFieldUpdateOperationsInput | boolean
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    pinHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    hospitalId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedPasswordAttempts?: IntFieldUpdateOperationsInput | number
    passwordLockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedPinAttempts?: IntFieldUpdateOperationsInput | number
    pinLockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    motherProfile?: MotherProfileUncheckedUpdateOneWithoutUserNestedInput
    researcherProfile?: ResearcherProfileUncheckedUpdateOneWithoutUserNestedInput
    refreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type HospitalUpsertWithoutNurseProfilesInput = {
    update: XOR<HospitalUpdateWithoutNurseProfilesInput, HospitalUncheckedUpdateWithoutNurseProfilesInput>
    create: XOR<HospitalCreateWithoutNurseProfilesInput, HospitalUncheckedCreateWithoutNurseProfilesInput>
    where?: HospitalWhereInput
  }

  export type HospitalUpdateToOneWithWhereWithoutNurseProfilesInput = {
    where?: HospitalWhereInput
    data: XOR<HospitalUpdateWithoutNurseProfilesInput, HospitalUncheckedUpdateWithoutNurseProfilesInput>
  }

  export type HospitalUpdateWithoutNurseProfilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    district?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    nextParticipantNumber?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutHospitalNestedInput
    motherProfiles?: MotherProfileUpdateManyWithoutHospitalNestedInput
  }

  export type HospitalUncheckedUpdateWithoutNurseProfilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    district?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    emergencyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    nextParticipantNumber?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutHospitalNestedInput
    motherProfiles?: MotherProfileUncheckedUpdateManyWithoutHospitalNestedInput
  }

  export type UserCreateWithoutResearcherProfileInput = {
    id?: string
    phone: string
    phoneVerified?: boolean
    email?: string | null
    passwordHash: string
    pinHash?: string | null
    role: string
    preferredLanguage?: string
    isActive?: boolean
    lastLoginAt?: Date | string | null
    failedPasswordAttempts?: number
    passwordLockedUntil?: Date | string | null
    failedPinAttempts?: number
    pinLockedUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    hospital?: HospitalCreateNestedOneWithoutUsersInput
    motherProfile?: MotherProfileCreateNestedOneWithoutUserInput
    nurseProfile?: NurseProfileCreateNestedOneWithoutUserInput
    refreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutResearcherProfileInput = {
    id?: string
    phone: string
    phoneVerified?: boolean
    email?: string | null
    passwordHash: string
    pinHash?: string | null
    role: string
    preferredLanguage?: string
    hospitalId?: string | null
    isActive?: boolean
    lastLoginAt?: Date | string | null
    failedPasswordAttempts?: number
    passwordLockedUntil?: Date | string | null
    failedPinAttempts?: number
    pinLockedUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    motherProfile?: MotherProfileUncheckedCreateNestedOneWithoutUserInput
    nurseProfile?: NurseProfileUncheckedCreateNestedOneWithoutUserInput
    refreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutResearcherProfileInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutResearcherProfileInput, UserUncheckedCreateWithoutResearcherProfileInput>
  }

  export type UserUpsertWithoutResearcherProfileInput = {
    update: XOR<UserUpdateWithoutResearcherProfileInput, UserUncheckedUpdateWithoutResearcherProfileInput>
    create: XOR<UserCreateWithoutResearcherProfileInput, UserUncheckedCreateWithoutResearcherProfileInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutResearcherProfileInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutResearcherProfileInput, UserUncheckedUpdateWithoutResearcherProfileInput>
  }

  export type UserUpdateWithoutResearcherProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    phoneVerified?: BoolFieldUpdateOperationsInput | boolean
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    pinHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedPasswordAttempts?: IntFieldUpdateOperationsInput | number
    passwordLockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedPinAttempts?: IntFieldUpdateOperationsInput | number
    pinLockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    hospital?: HospitalUpdateOneWithoutUsersNestedInput
    motherProfile?: MotherProfileUpdateOneWithoutUserNestedInput
    nurseProfile?: NurseProfileUpdateOneWithoutUserNestedInput
    refreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutResearcherProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    phoneVerified?: BoolFieldUpdateOperationsInput | boolean
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    pinHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    hospitalId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedPasswordAttempts?: IntFieldUpdateOperationsInput | number
    passwordLockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedPinAttempts?: IntFieldUpdateOperationsInput | number
    pinLockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    motherProfile?: MotherProfileUncheckedUpdateOneWithoutUserNestedInput
    nurseProfile?: NurseProfileUncheckedUpdateOneWithoutUserNestedInput
    refreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type MotherProfileCreateWithoutFollowUpSchedulesInput = {
    id?: string
    participantCode?: string | null
    studyGroup?: string | null
    fullName?: string | null
    ageRange: string
    educationMother: string
    educationFather: string
    occupationMother: string
    occupationFather: string
    incomeClass: string
    familyType: string
    familyMembersCount: string
    religion: string
    residenceType: string
    contactNumber?: string | null
    prevPretermEducation?: boolean
    educationSource?: MotherProfileCreateeducationSourceInput | string[]
    enrolledAt?: Date | string
    onboardingCompletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutMotherProfileInput
    hospital?: HospitalCreateNestedOneWithoutMotherProfilesInput
    babyProfile?: BabyProfileCreateNestedOneWithoutMotherProfileInput
  }

  export type MotherProfileUncheckedCreateWithoutFollowUpSchedulesInput = {
    id?: string
    userId: string
    participantCode?: string | null
    studyGroup?: string | null
    hospitalId?: string | null
    fullName?: string | null
    ageRange: string
    educationMother: string
    educationFather: string
    occupationMother: string
    occupationFather: string
    incomeClass: string
    familyType: string
    familyMembersCount: string
    religion: string
    residenceType: string
    contactNumber?: string | null
    prevPretermEducation?: boolean
    educationSource?: MotherProfileCreateeducationSourceInput | string[]
    enrolledAt?: Date | string
    onboardingCompletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    babyProfile?: BabyProfileUncheckedCreateNestedOneWithoutMotherProfileInput
  }

  export type MotherProfileCreateOrConnectWithoutFollowUpSchedulesInput = {
    where: MotherProfileWhereUniqueInput
    create: XOR<MotherProfileCreateWithoutFollowUpSchedulesInput, MotherProfileUncheckedCreateWithoutFollowUpSchedulesInput>
  }

  export type MotherProfileUpsertWithoutFollowUpSchedulesInput = {
    update: XOR<MotherProfileUpdateWithoutFollowUpSchedulesInput, MotherProfileUncheckedUpdateWithoutFollowUpSchedulesInput>
    create: XOR<MotherProfileCreateWithoutFollowUpSchedulesInput, MotherProfileUncheckedCreateWithoutFollowUpSchedulesInput>
    where?: MotherProfileWhereInput
  }

  export type MotherProfileUpdateToOneWithWhereWithoutFollowUpSchedulesInput = {
    where?: MotherProfileWhereInput
    data: XOR<MotherProfileUpdateWithoutFollowUpSchedulesInput, MotherProfileUncheckedUpdateWithoutFollowUpSchedulesInput>
  }

  export type MotherProfileUpdateWithoutFollowUpSchedulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    participantCode?: NullableStringFieldUpdateOperationsInput | string | null
    studyGroup?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    ageRange?: StringFieldUpdateOperationsInput | string
    educationMother?: StringFieldUpdateOperationsInput | string
    educationFather?: StringFieldUpdateOperationsInput | string
    occupationMother?: StringFieldUpdateOperationsInput | string
    occupationFather?: StringFieldUpdateOperationsInput | string
    incomeClass?: StringFieldUpdateOperationsInput | string
    familyType?: StringFieldUpdateOperationsInput | string
    familyMembersCount?: StringFieldUpdateOperationsInput | string
    religion?: StringFieldUpdateOperationsInput | string
    residenceType?: StringFieldUpdateOperationsInput | string
    contactNumber?: NullableStringFieldUpdateOperationsInput | string | null
    prevPretermEducation?: BoolFieldUpdateOperationsInput | boolean
    educationSource?: MotherProfileUpdateeducationSourceInput | string[]
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMotherProfileNestedInput
    hospital?: HospitalUpdateOneWithoutMotherProfilesNestedInput
    babyProfile?: BabyProfileUpdateOneWithoutMotherProfileNestedInput
  }

  export type MotherProfileUncheckedUpdateWithoutFollowUpSchedulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    participantCode?: NullableStringFieldUpdateOperationsInput | string | null
    studyGroup?: NullableStringFieldUpdateOperationsInput | string | null
    hospitalId?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    ageRange?: StringFieldUpdateOperationsInput | string
    educationMother?: StringFieldUpdateOperationsInput | string
    educationFather?: StringFieldUpdateOperationsInput | string
    occupationMother?: StringFieldUpdateOperationsInput | string
    occupationFather?: StringFieldUpdateOperationsInput | string
    incomeClass?: StringFieldUpdateOperationsInput | string
    familyType?: StringFieldUpdateOperationsInput | string
    familyMembersCount?: StringFieldUpdateOperationsInput | string
    religion?: StringFieldUpdateOperationsInput | string
    residenceType?: StringFieldUpdateOperationsInput | string
    contactNumber?: NullableStringFieldUpdateOperationsInput | string | null
    prevPretermEducation?: BoolFieldUpdateOperationsInput | boolean
    educationSource?: MotherProfileUpdateeducationSourceInput | string[]
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    babyProfile?: BabyProfileUncheckedUpdateOneWithoutMotherProfileNestedInput
  }

  export type UserCreateManyHospitalInput = {
    id?: string
    phone: string
    phoneVerified?: boolean
    email?: string | null
    passwordHash: string
    pinHash?: string | null
    role: string
    preferredLanguage?: string
    isActive?: boolean
    lastLoginAt?: Date | string | null
    failedPasswordAttempts?: number
    passwordLockedUntil?: Date | string | null
    failedPinAttempts?: number
    pinLockedUntil?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type MotherProfileCreateManyHospitalInput = {
    id?: string
    userId: string
    participantCode?: string | null
    studyGroup?: string | null
    fullName?: string | null
    ageRange: string
    educationMother: string
    educationFather: string
    occupationMother: string
    occupationFather: string
    incomeClass: string
    familyType: string
    familyMembersCount: string
    religion: string
    residenceType: string
    contactNumber?: string | null
    prevPretermEducation?: boolean
    educationSource?: MotherProfileCreateeducationSourceInput | string[]
    enrolledAt?: Date | string
    onboardingCompletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type NurseProfileCreateManyHospitalInput = {
    id?: string
    userId: string
    fullName: string
    employeeId?: string | null
    isActive?: boolean
    createdAt?: Date | string
  }

  export type UserUpdateWithoutHospitalInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    phoneVerified?: BoolFieldUpdateOperationsInput | boolean
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    pinHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedPasswordAttempts?: IntFieldUpdateOperationsInput | number
    passwordLockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedPinAttempts?: IntFieldUpdateOperationsInput | number
    pinLockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    motherProfile?: MotherProfileUpdateOneWithoutUserNestedInput
    nurseProfile?: NurseProfileUpdateOneWithoutUserNestedInput
    researcherProfile?: ResearcherProfileUpdateOneWithoutUserNestedInput
    refreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutHospitalInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    phoneVerified?: BoolFieldUpdateOperationsInput | boolean
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    pinHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedPasswordAttempts?: IntFieldUpdateOperationsInput | number
    passwordLockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedPinAttempts?: IntFieldUpdateOperationsInput | number
    pinLockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    motherProfile?: MotherProfileUncheckedUpdateOneWithoutUserNestedInput
    nurseProfile?: NurseProfileUncheckedUpdateOneWithoutUserNestedInput
    researcherProfile?: ResearcherProfileUncheckedUpdateOneWithoutUserNestedInput
    refreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutHospitalInput = {
    id?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    phoneVerified?: BoolFieldUpdateOperationsInput | boolean
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    pinHash?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    preferredLanguage?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedPasswordAttempts?: IntFieldUpdateOperationsInput | number
    passwordLockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedPinAttempts?: IntFieldUpdateOperationsInput | number
    pinLockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MotherProfileUpdateWithoutHospitalInput = {
    id?: StringFieldUpdateOperationsInput | string
    participantCode?: NullableStringFieldUpdateOperationsInput | string | null
    studyGroup?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    ageRange?: StringFieldUpdateOperationsInput | string
    educationMother?: StringFieldUpdateOperationsInput | string
    educationFather?: StringFieldUpdateOperationsInput | string
    occupationMother?: StringFieldUpdateOperationsInput | string
    occupationFather?: StringFieldUpdateOperationsInput | string
    incomeClass?: StringFieldUpdateOperationsInput | string
    familyType?: StringFieldUpdateOperationsInput | string
    familyMembersCount?: StringFieldUpdateOperationsInput | string
    religion?: StringFieldUpdateOperationsInput | string
    residenceType?: StringFieldUpdateOperationsInput | string
    contactNumber?: NullableStringFieldUpdateOperationsInput | string | null
    prevPretermEducation?: BoolFieldUpdateOperationsInput | boolean
    educationSource?: MotherProfileUpdateeducationSourceInput | string[]
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMotherProfileNestedInput
    babyProfile?: BabyProfileUpdateOneWithoutMotherProfileNestedInput
    followUpSchedules?: FollowUpScheduleUpdateManyWithoutMotherProfileNestedInput
  }

  export type MotherProfileUncheckedUpdateWithoutHospitalInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    participantCode?: NullableStringFieldUpdateOperationsInput | string | null
    studyGroup?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    ageRange?: StringFieldUpdateOperationsInput | string
    educationMother?: StringFieldUpdateOperationsInput | string
    educationFather?: StringFieldUpdateOperationsInput | string
    occupationMother?: StringFieldUpdateOperationsInput | string
    occupationFather?: StringFieldUpdateOperationsInput | string
    incomeClass?: StringFieldUpdateOperationsInput | string
    familyType?: StringFieldUpdateOperationsInput | string
    familyMembersCount?: StringFieldUpdateOperationsInput | string
    religion?: StringFieldUpdateOperationsInput | string
    residenceType?: StringFieldUpdateOperationsInput | string
    contactNumber?: NullableStringFieldUpdateOperationsInput | string | null
    prevPretermEducation?: BoolFieldUpdateOperationsInput | boolean
    educationSource?: MotherProfileUpdateeducationSourceInput | string[]
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    babyProfile?: BabyProfileUncheckedUpdateOneWithoutMotherProfileNestedInput
    followUpSchedules?: FollowUpScheduleUncheckedUpdateManyWithoutMotherProfileNestedInput
  }

  export type MotherProfileUncheckedUpdateManyWithoutHospitalInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    participantCode?: NullableStringFieldUpdateOperationsInput | string | null
    studyGroup?: NullableStringFieldUpdateOperationsInput | string | null
    fullName?: NullableStringFieldUpdateOperationsInput | string | null
    ageRange?: StringFieldUpdateOperationsInput | string
    educationMother?: StringFieldUpdateOperationsInput | string
    educationFather?: StringFieldUpdateOperationsInput | string
    occupationMother?: StringFieldUpdateOperationsInput | string
    occupationFather?: StringFieldUpdateOperationsInput | string
    incomeClass?: StringFieldUpdateOperationsInput | string
    familyType?: StringFieldUpdateOperationsInput | string
    familyMembersCount?: StringFieldUpdateOperationsInput | string
    religion?: StringFieldUpdateOperationsInput | string
    residenceType?: StringFieldUpdateOperationsInput | string
    contactNumber?: NullableStringFieldUpdateOperationsInput | string | null
    prevPretermEducation?: BoolFieldUpdateOperationsInput | boolean
    educationSource?: MotherProfileUpdateeducationSourceInput | string[]
    enrolledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    onboardingCompletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NurseProfileUpdateWithoutHospitalInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutNurseProfileNestedInput
  }

  export type NurseProfileUncheckedUpdateWithoutHospitalInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NurseProfileUncheckedUpdateManyWithoutHospitalInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    employeeId?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenCreateManyUserInput = {
    id?: string
    tokenHash: string
    deviceInfo?: string | null
    expiresAt: Date | string
    revokedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type RefreshTokenUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tokenHash?: StringFieldUpdateOperationsInput | string
    deviceInfo?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FollowUpScheduleCreateManyMotherProfileInput = {
    id?: string
    timePoint: string
    scheduledDate: Date | string
    actualDate?: Date | string | null
    status?: string
    dataComplete?: boolean
    collectedByUserId?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FollowUpScheduleUpdateWithoutMotherProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    timePoint?: StringFieldUpdateOperationsInput | string
    scheduledDate?: DateTimeFieldUpdateOperationsInput | Date | string
    actualDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    dataComplete?: BoolFieldUpdateOperationsInput | boolean
    collectedByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FollowUpScheduleUncheckedUpdateWithoutMotherProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    timePoint?: StringFieldUpdateOperationsInput | string
    scheduledDate?: DateTimeFieldUpdateOperationsInput | Date | string
    actualDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    dataComplete?: BoolFieldUpdateOperationsInput | boolean
    collectedByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FollowUpScheduleUncheckedUpdateManyWithoutMotherProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    timePoint?: StringFieldUpdateOperationsInput | string
    scheduledDate?: DateTimeFieldUpdateOperationsInput | Date | string
    actualDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    dataComplete?: BoolFieldUpdateOperationsInput | boolean
    collectedByUserId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}