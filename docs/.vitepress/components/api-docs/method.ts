export interface ApiDocsMethod {
  readonly name: string;
  readonly deprecated: string | undefined; // HTML
  readonly description: string; // HTML
  readonly since: string;
  readonly parameters: ApiDocsMethodParameter[];
  readonly returns: string;
  readonly throws: string | undefined; // HTML
  readonly signature: string; // HTML
  readonly examples: string; // HTML
  readonly refresh: (() => Promise<unknown[]>) | undefined;
  readonly seeAlsos: string[];
  readonly sourcePath: string; // URL-Suffix
}

export interface ApiDocsMethodParameter {
  readonly name: string;
  readonly type: string | undefined;
  readonly default: string | undefined;
  readonly description: string; // HTML
}
