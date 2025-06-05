type SystemContent = {
  type: string;
  content: string;
}

type ScriptTypeMap = {
  systems: {
    type: 'systems';
    contents: Array<SystemContent>;
  },
  comment: {
    type: 'comment';
    content: string;
  },
  line: {
    type: 'line';
    character: string;
    content: string;
    systems?: Array<SystemContent>;
  }
};

export type StoryScript = Array<
  ScriptTypeMap[keyof ScriptTypeMap]
>;