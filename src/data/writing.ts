export interface WritingEntry {
  readonly id: string;
  /** YYYY.MM.DD */
  readonly date: string;
  readonly title: string;
  readonly readTime: string;
  readonly href: string;
}

/**
 * Nothing published yet. Add newest-first: the home feed takes the top
 * `WRITING_FEED_LIMIT`, and `/writing` lists everything.
 */
export const WRITING: readonly WritingEntry[] = [];

/** How many entries the home page feed shows before `READ MORE`. */
export const WRITING_FEED_LIMIT = 3;
