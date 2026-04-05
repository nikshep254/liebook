export type Severity = 1 | 2 | 3 | 4 | 5;
export type Status = 'active' | 'safe' | 'busted';

export type Lie = {
  id: string;
  name: string;
  who: string;
  what: string;
  where: string;
  why: string;
  date: string;
  severity: Severity;
  status: Status;
  tags: string[];
  expirationDate?: string;
};
