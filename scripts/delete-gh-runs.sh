#!/usr/bin/env bash
set -euo pipefail

REPO=Koen-Schockaert/electron-react-app
PER_PAGE=100

echo "This will DELETE ALL workflow runs in $REPO. Type DELETE to confirm:"
read -r CONFIRM
if [ "$CONFIRM" != "DELETE" ]; then
  echo "Aborted."
  exit 1
fi

page=1
while :; do
  echo "Listing page $page..."
  runs_json=$(gh api --paginate "/repos/$REPO/actions/runs?per_page=$PER_PAGE&page=$page" 2>/dev/null || echo '{"workflow_runs": []}')
  ids=$(echo "$runs_json" | jq -r '.workflow_runs[]?.id' || true)
  if [ -z "$ids" ]; then
    echo "No more runs. Done."
    break
  fi

  for id in $ids; do
    info=$(echo "$runs_json" | jq -r --argjson id "$id" '.workflow_runs[] | select(.id == $id) | "\(.id) | \(.name) | \(.head_branch) | \(.created_at)"')
    echo "Deleting run: $info"
    gh api -X DELETE "/repos/$REPO/actions/runs/$id"
  done

  page=$((page+1))
done
