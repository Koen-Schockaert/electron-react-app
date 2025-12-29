import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

import { TopicInfo, TopicTreeItem } from '../../types/global';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { styled, alpha } from '@mui/material/styles';

type TopicTreeProps = {
  topics: TopicInfo[];
  selectedTopics: Set<string>;
  setSelectedTopics: React.Dispatch<React.SetStateAction<Set<string>>>;
};

function buildTopicTree(topics: TopicInfo[]): TopicTreeItem[] {
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

  const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
    color: theme.palette.grey[200],

    [`& .${treeItemClasses.content}`]: {
      [`& .${treeItemClasses.label}`]: {
        fontSize: '0.8rem',
        fontWeight: 500,
      },

      // 🔹 selected state using data-selected (inside content!)
      '&[data-selected="true"]': {
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        color: '#fff',

        [`& .${treeItemClasses.label}`]: {
          color: '#fff',
          fontWeight: 500,
        },
      },

      '&[data-selected="true"]:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.18)',
      },
    },

    [`& .${treeItemClasses.iconContainer}`]: {
      ...theme.applyStyles('light', {
        backgroundColor: alpha(theme.palette.primary.main, 0.25),
      }),
      ...theme.applyStyles('dark', {
        color: theme.palette.primary.contrastText,
      }),
    },

    [`& .${treeItemClasses.groupTransition}`]: {
      borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
    },

    ...theme.applyStyles('light', {
      color: theme.palette.common.white,
    }),
  }));

  return (
    <Box flex={1} minHeight={0} overflow="auto">
      <RichTreeView
        items={items}
        multiSelect
        expansionTrigger="content"
        selectedItems={[...selectedTopics]}
        onSelectedItemsChange={handleSelectionChange}
        slots={{ item: CustomTreeItem }}
        getItemLabel={(item) =>
          item.count !== undefined
            ? `${item.label} (${item.count})`
            : item.label
        }
      />
    </Box>
  );
}
