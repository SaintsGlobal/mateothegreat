#!/bin/bash
# Ralph Wiggum - Long-running AI agent loop
# Usage: ./ralph.sh --prd <name> [max_iterations]
# Usage: ./ralph.sh [--tool claude|amp] [max_iterations]  (legacy)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Parse arguments
TOOL="claude"  # Default to claude CLI
MAX_ITERATIONS=10
PRD_NAME=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --prd)
      PRD_NAME="$2"
      shift 2
      ;;
    --prd=*)
      PRD_NAME="${1#*=}"
      shift
      ;;
    --tool)
      TOOL="$2"
      shift 2
      ;;
    --tool=*)
      TOOL="${1#*=}"
      shift
      ;;
    *)
      # Assume it's max_iterations if it's a number
      if [[ "$1" =~ ^[0-9]+$ ]]; then
        MAX_ITERATIONS="$1"
      fi
      shift
      ;;
  esac
done

# Validate tool choice
if [[ "$TOOL" != "amp" && "$TOOL" != "claude" ]]; then
  echo "Error: Invalid tool '$TOOL'. Must be 'amp' or 'claude'."
  exit 1
fi

# Set up paths based on PRD name
if [ -n "$PRD_NAME" ]; then
  PRD_DIR="$SCRIPT_DIR/prds/$PRD_NAME"
  if [ ! -d "$PRD_DIR" ]; then
    echo "Error: PRD directory not found: $PRD_DIR"
    exit 1
  fi
  PRD_FILE="$PRD_DIR/prd.json"
  PROGRESS_FILE="$PRD_DIR/progress.txt"
  ARCHIVE_DIR="$PRD_DIR/archive"
  LAST_BRANCH_FILE="$PRD_DIR/.last-branch"
  RALPH_LOG="$PRD_DIR/ralph.log"
  WORKING_DIR="$PRD_DIR"
else
  PRD_FILE="$SCRIPT_DIR/prd.json"
  PROGRESS_FILE="$SCRIPT_DIR/progress.txt"
  ARCHIVE_DIR="$SCRIPT_DIR/archive"
  LAST_BRANCH_FILE="$SCRIPT_DIR/.last-branch"
  RALPH_LOG="$SCRIPT_DIR/ralph.log"
  WORKING_DIR="$SCRIPT_DIR"
fi

# Archive previous run if branch changed
if [ -f "$PRD_FILE" ] && [ -f "$LAST_BRANCH_FILE" ]; then
  CURRENT_BRANCH=$(jq -r '.branchName // empty' "$PRD_FILE" 2>/dev/null || echo "")
  LAST_BRANCH=$(cat "$LAST_BRANCH_FILE" 2>/dev/null || echo "")

  if [ -n "$CURRENT_BRANCH" ] && [ -n "$LAST_BRANCH" ] && [ "$CURRENT_BRANCH" != "$LAST_BRANCH" ]; then
    # Archive the previous run
    DATE=$(date +%Y-%m-%d)
    # Strip "ralph/" prefix from branch name for folder
    FOLDER_NAME=$(echo "$LAST_BRANCH" | sed 's|^ralph/||')
    ARCHIVE_FOLDER="$ARCHIVE_DIR/$DATE-$FOLDER_NAME"

    echo "Archiving previous run: $LAST_BRANCH"
    mkdir -p "$ARCHIVE_FOLDER"
    [ -f "$PRD_FILE" ] && cp "$PRD_FILE" "$ARCHIVE_FOLDER/"
    [ -f "$PROGRESS_FILE" ] && cp "$PROGRESS_FILE" "$ARCHIVE_FOLDER/"
    echo "   Archived to: $ARCHIVE_FOLDER"

    # Reset progress file for new run
    echo "# Ralph Progress Log" > "$PROGRESS_FILE"
    echo "Started: $(date)" >> "$PROGRESS_FILE"
    echo "---" >> "$PROGRESS_FILE"
  fi
fi

# Track current branch
if [ -f "$PRD_FILE" ]; then
  CURRENT_BRANCH=$(jq -r '.branchName // empty' "$PRD_FILE" 2>/dev/null || echo "")
  if [ -n "$CURRENT_BRANCH" ]; then
    echo "$CURRENT_BRANCH" > "$LAST_BRANCH_FILE"
  fi
fi

# Initialize progress file if it doesn't exist
if [ ! -f "$PROGRESS_FILE" ]; then
  echo "# Ralph Progress Log" > "$PROGRESS_FILE"
  echo "Started: $(date)" >> "$PROGRESS_FILE"
  echo "---" >> "$PROGRESS_FILE"
fi

echo "Starting Ralph - PRD: ${PRD_NAME:-default} - Tool: $TOOL - Max iterations: $MAX_ITERATIONS"
echo "Working directory: $WORKING_DIR"

# Initialize ralph log
echo "# Ralph Run Log - $(date)" > "$RALPH_LOG"
echo "PRD: ${PRD_NAME:-default}" >> "$RALPH_LOG"
echo "Tool: $TOOL" >> "$RALPH_LOG"
echo "---" >> "$RALPH_LOG"

for i in $(seq 1 $MAX_ITERATIONS); do
  echo ""
  echo "==============================================================="
  echo "  Ralph Iteration $i of $MAX_ITERATIONS ($TOOL)"
  echo "==============================================================="
  echo "Iteration $i started at $(date)" >> "$RALPH_LOG"

  # Run the selected tool from the working directory
  cd "$WORKING_DIR"

  if [[ "$TOOL" == "amp" ]]; then
    OUTPUT=$(cat "$SCRIPT_DIR/prompt.md" | amp --dangerously-allow-all 2>&1 | tee /dev/stderr) || true
  else
    # Claude Code: use --dangerously-skip-permissions for autonomous operation
    # Run from PRD directory so it finds the local prd.json and progress.txt
    OUTPUT=$(claude --dangerously-skip-permissions --print < "$SCRIPT_DIR/CLAUDE.md" 2>&1 | tee /dev/stderr) || true
  fi

  # Check for completion signal
  if echo "$OUTPUT" | grep -q "<promise>COMPLETE</promise>"; then
    echo ""
    echo "Ralph completed all tasks!"
    echo "Completed at iteration $i of $MAX_ITERATIONS"
    echo "COMPLETE - Iteration $i - $(date)" >> "$RALPH_LOG"
    exit 0
  fi

  echo "Iteration $i complete. Continuing..."
  echo "Iteration $i completed at $(date)" >> "$RALPH_LOG"
  sleep 2
done

echo ""
echo "Ralph reached max iterations ($MAX_ITERATIONS) without completing all tasks."
echo "Check $PROGRESS_FILE for status."
exit 1
