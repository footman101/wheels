class NotFoundError extends Error {
  constructor(cause: string) {
    super('Not found.', { cause });
  }
}

const throwNotFound = (cause: string) => {
  throw new NotFoundError(cause);
};

export const isNotFoundError = (e: Error) => e instanceof NotFoundError;

export default throwNotFound;
