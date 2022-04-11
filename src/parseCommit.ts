import { parser, Scope, Separator, Summary, Text, Type } from '@conventional-commits/parser';

/** A type containing all the segments of a conventional commit. */
export interface Commit {
  type?: string;
  scope?: string;
  subject: string;
}

/** This is a temporary fix to patch the types from the conventional-commits package. */
type SummaryWithText = Omit<Summary, 'children'> & { children: (Type | Scope | Separator | Text)[] };

/** Parses a commit message and extracts the different segments into a commit object. */
export function parseCommit(message: string): Commit {
  if (!message.includes(':')) {
    return { subject: message };
  }

  const { children } = parser(message);

  const summary = children.find((child) => child.type === 'summary') as SummaryWithText;
  const type = summary?.children.find((child): child is Type => child.type === 'type');
  const scope = summary?.children.find((child): child is Scope => child.type === 'scope');
  const subject = summary?.children.find((child): child is Text => child.type === 'text');

  return {
    type: type?.value,
    scope: scope?.value,
    subject: subject.value,
  };
}
