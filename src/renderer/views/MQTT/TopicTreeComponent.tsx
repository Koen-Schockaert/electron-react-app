import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

import { TopicInfo, TopicTreeItem } from '../../types/global';

type TopicTreeProps = {
  topics: TopicInfo[];
  selectedTopics: Set<string>;
  setSelectedTopics: React.Dispatch<React.SetStateAction<Set<string>>>;
  //clearSubscribed: void;
};

export function buildTopicTree(topics: TopicInfo[]): TopicTreeItem[] {
  const root = new Map<string, any>();

  for (const { topic, count } of topics) {
    const parts = topic.split('/');
    let current = root;
    let path = '';

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      path = path ? `${path}/${part}` : part;

      if (!current.has(part)) {
        current.set(part, {
          id: path,
          label: part,
          children: new Map<string, any>(),
        });
      }

      const node = current.get(part);

      if (i === parts.length - 1) {
        node.count = count;
      }

      current = node.children;
    }
  }

  const toArray = (map: Map<string, any>): TopicTreeItem[] =>
    [...map.values()].map((node) => ({
      id: node.id,
      label: node.label,
      count: node.count,
      children: node.children.size ? toArray(node.children) : undefined,
    }));

  return toArray(root);
}

export function TopicTree({
  topics,
  selectedTopics,
  setSelectedTopics,
}: TopicTreeProps) {
  const items = React.useMemo(() => buildTopicTree(topics), [topics]);

  const handleSelectionChange = React.useCallback(
    (_event: React.SyntheticEvent | null, itemIds: string[]) => {
      // Let MUI handle Ctrl / Shift logic — just sync
      setSelectedTopics(new Set(itemIds));
    },
    [setSelectedTopics],
  );


  return (
    <Box flex={1} minHeight={0} overflow="auto">
      <RichTreeView
        items={items}
        multiSelect
        expansionTrigger="content"
        selectedItems={[...selectedTopics]}
        onSelectedItemsChange={handleSelectionChange}
        getItemLabel={(item) =>
          item.count !== undefined
            ? `${item.label} (${item.count})`
            : item.label
        }
      />
    </Box>
  );
}
