import React from 'react';
import { Box, IconButton, List, ListItemButton, Typography } from '@mui/material';
import { ExpandMore, ChevronRight, FiberManualRecord } from '@mui/icons-material';
import type { TopicTreeItem } from '../../types/global';

type Props = {
  topics: TopicTreeItem[]; // may also be [{ topic: string }]
  selectedTopics: Set<string>;
  setSelectedTopics: (s: Set<string>) => void;
  expandedTopics: Set<string>;
  setExpandedTopics: (s: Set<string>) => void;
};

export const TopicTree: React.FC<Props> = ({
  topics,
  selectedTopics,
  setSelectedTopics,
  expandedTopics,
  setExpandedTopics,
}) => {
  const buildTreeFromStrings = (items: any[]): TopicTreeItem[] => {
    const nodesByPath = new Map<string, TopicTreeItem>();
    const roots: TopicTreeItem[] = [];

    for (const it of items) {
      const topicStr = typeof it === 'string' ? it : it.topic;
      if (!topicStr) continue;
      const parts = topicStr.split('/');

      let accum = '';
      for (let i = 0; i < parts.length; i++) {
        accum = accum ? `${accum}/${parts[i]}` : parts[i];
        if (!nodesByPath.has(accum)) {
          const node: TopicTreeItem = { id: accum, children: [] };
          nodesByPath.set(accum, node);
          if (i === 0) {
            roots.push(node);
          } else {
            const parentPath = accum.split('/').slice(0, i).join('/');
            const parent = nodesByPath.get(parentPath);
            if (parent) {
              parent.children = parent.children ?? [];
              parent.children.push(node);
            }
          }
        }
      }
    }

    return roots;
  };

  const tree: TopicTreeItem[] =
    topics.length === 0
      ? []
      : ('topic' in (topics as any)[0] ? buildTreeFromStrings(topics as any[]) : (topics as TopicTreeItem[]));

  // restore selection when tree changes: prefer currently selected if still available,
  // otherwise try persisted selection from localStorage, otherwise pick the first item.
  React.useEffect(() => {
    const available = new Set<string>();
    const walk = (nodes: TopicTreeItem[]) => {
      for (const n of nodes) {
        available.add(n.id);
        if (n.children && n.children.length) walk(n.children);
      }
    };
    walk(tree);

    // if any current selection is still available — keep it
    for (const s of selectedTopics) {
      if (available.has(s)) return;
    }

    // try persisted selection
    try {
      const raw = localStorage.getItem('mqtt.discoveredSelected');
      if (raw) {
        const arr = JSON.parse(raw) as string[];
        const next = new Set<string>();
        for (const a of arr) if (available.has(a)) next.add(a);
        if (next.size) {
          setSelectedTopics(next);
          return;
        }
      }
    } catch (e) {
      /* ignore */
    }

    // fall back: select first available topic (optional)
    const first = available.values().next();
    if (!first.done) {
      setSelectedTopics(new Set([first.value]));
    }
  }, [tree]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleExpand = (id: string) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onSelect = (id: string, e: React.MouseEvent) => {
    const isMulti = e.ctrlKey || e.metaKey;
    setSelectedTopics((prev) => {
      const next = new Set(prev);
      if (isMulti) {
        if (next.has(id)) next.delete(id);
        else next.add(id);
      } else {
        next.clear();
        next.add(id);
      }
      return next;
    });
  };

  const renderNode = (node: TopicTreeItem, level = 0) => {
    const isExpanded = expandedTopics.has(node.id);
    const hasChildren = !!(node.children && node.children.length);

    return (
      <Box key={node.id} pl={level * 1.5}>
        <ListItemButton
          onClick={(e) => onSelect(node.id, e)}
          selected={selectedTopics.has(node.id)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 0.5,
            py: 0.4,
            gap: 0.75,
            borderRadius: 1,
            minHeight: 28,
            color: 'rgba(203,213,225,0.95)',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.03)' },
            '&.Mui-selected': { backgroundColor: 'rgba(255,255,255,0.06)' },
            '& .topic-icon': { color: 'rgba(148,163,184,0.95)' },
          }}
        >
          {hasChildren ? (
            <IconButton
              className="topic-icon"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node.id);
              }}
              sx={{
                width: 24,
                height: 24,
                p: 0,
                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 120ms ease',
                mr: 0.25,
              }}
            >
              <ChevronRight fontSize="small" />
            </IconButton>
          ) : (
            <FiberManualRecord sx={{ width: 8, height: 8, color: 'rgba(148,163,184,0.6)', ml: '4px' }} />
          )}

          <Typography
            fontSize={12}
            noWrap
            title={node.id}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: selectedTopics.has(node.id) ? 'common.white' : 'rgba(203,213,225,0.95)',
              fontWeight: selectedTopics.has(node.id) ? 600 : 500,
            }}
          >
            {node.id.includes('/') ? node.id.split('/').pop() : node.id}
          </Typography>
        </ListItemButton>

        {hasChildren && isExpanded && (
          <List disablePadding>{node.children!.map((c) => renderNode(c, level + 1))}</List>
        )}
      </Box>
    );
  };

  return <List dense disablePadding>{tree.map((t) => renderNode(t))}</List>;
};
