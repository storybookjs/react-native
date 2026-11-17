/** An error whose message is written for the person or agent running the command. */
export class CliError extends Error {
  readonly code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = 'CliError';
    this.code = code;
  }
}
