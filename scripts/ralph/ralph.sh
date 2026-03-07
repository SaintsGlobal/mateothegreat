#!/bin/bash
# Ralph Wiggum - Long-running AI agent loop
# Usage: ./ralph.sh --prd <name> [--mode plan|build] [--no-watch] [max_iterations]
# Usage: ./ralph.sh [--tool claude|amp] [max_iterations]  (legacy)
#
# Options:
#   --prd <name>      PRD directory name (required for most use cases)
#   --mode plan|build Plan mode (analyze) or build mode (implement)
#   --no-watch        Don't auto-launch the watcher in a new terminal
#   --tool claude|amp Which AI tool to use (default: claude)
#   [number]          Max iterations (default: 10)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Parse arguments
TOOL="claude"  # Default to claude CLI
MAX_ITERATIONS=10
PRD_NAME=""
MODE="build"  # Default mode: plan or build
NO_WATCH=false  # Auto-launch watcher by default

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
    --mode)
      MODE="$2"
      shift 2
      ;;
    --mode=*)
      MODE="${1#*=}"
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
    --no-watch)
      NO_WATCH=true
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

# Validate mode
if [[ "$MODE" != "plan" && "$MODE" != "build" ]]; then
  echo "Error: Invalid mode '$MODE'. Must be 'plan' or 'build'."
  exit 1
fi

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

# Create AGENTS.md from template if it doesn't exist (for PRD directories)
if [ -n "$PRD_NAME" ]; then
  AGENTS_FILE="$PRD_DIR/AGENTS.md"
  if [ ! -f "$AGENTS_FILE" ] && [ -f "$SCRIPT_DIR/AGENTS_TEMPLATE.md" ]; then
    cp "$SCRIPT_DIR/AGENTS_TEMPLATE.md" "$AGENTS_FILE"
    echo "Created AGENTS.md from template"
  fi
fi

# Select prompt based on mode
if [[ "$MODE" == "plan" ]]; then
  PROMPT_FILE="$SCRIPT_DIR/PROMPT_plan.md"
  echo "Starting Ralph in PLANNING mode..."
else
  PROMPT_FILE="$SCRIPT_DIR/PROMPT_build.md"
  echo "Starting Ralph in BUILDING mode..."
fi

echo "PRD: ${PRD_NAME:-default} | Tool: $TOOL | Max iterations: $MAX_ITERATIONS"
echo "Working directory: $WORKING_DIR"

# Auto-launch watcher in a new terminal
WATCHER_PID=""
launch_watcher() {
  if [ "$NO_WATCH" = true ]; then
    echo "Watcher disabled (--no-watch)"
    return
  fi

  if [ -n "$PRD_NAME" ]; then
    # Try to launch in a new terminal window (macOS)
    if command -v osascript &> /dev/null; then
      osascript -e "tell application \"Terminal\" to do script \"cd '$SCRIPT_DIR' && ./ralph-watch.sh '$PRD_NAME'\"" &> /dev/null &
      echo "Watcher launched in new Terminal window"
    # Fallback: launch in background with output to file
    else
      "$SCRIPT_DIR/ralph-watch.sh" "$PRD_NAME" &> "$PRD_DIR/watcher.log" &
      WATCHER_PID=$!
      echo "Watcher running in background (PID: $WATCHER_PID)"
    fi
  fi
}

# Cleanup watcher on exit
cleanup_watcher() {
  if [ -n "$WATCHER_PID" ]; then
    kill "$WATCHER_PID" 2>/dev/null || true
  fi
}
trap cleanup_watcher EXIT

# Launch the watcher
launch_watcher

# Initialize ralph log
echo "# Ralph Run Log - $(date)" > "$RALPH_LOG"
echo "PRD: ${PRD_NAME:-default}" >> "$RALPH_LOG"
echo "Mode: $MODE" >> "$RALPH_LOG"
echo "Tool: $TOOL" >> "$RALPH_LOG"
echo "---" >> "$RALPH_LOG"

for i in $(seq 1 $MAX_ITERATIONS); do
  echo ""
  echo "==============================================================="
  echo "  Ralph Iteration $i of $MAX_ITERATIONS ($MODE mode, $TOOL)"
  echo "==============================================================="
  echo "Iteration $i started at $(date)" >> "$RALPH_LOG"

  # Run the selected tool from the working directory
  cd "$WORKING_DIR"

  if [[ "$TOOL" == "amp" ]]; then
    OUTPUT=$(cat "$SCRIPT_DIR/prompt.md" | amp --dangerously-allow-all 2>&1 | tee /dev/stderr) || true
  else
    # Claude Code: use --dangerously-skip-permissions for autonomous operation
    # Run from PRD directory so it finds the local prd.json and progress.txt
    # Use mode-specific prompt file
    # Flags: stream-json for structured output, opus model, verbose logging
    OUTPUT=$(cat "$PROMPT_FILE" | claude -p \
      --dangerously-skip-permissions \
      --output-format=stream-json \
      --model opus \
      --verbose \
      2>&1 | tee "$RALPH_LOG" | tee /dev/stderr) || true
  fi

  # Check for completion signal
  if echo "$OUTPUT" | grep -q "<promise>COMPLETE</promise>"; then
    echo ""
    echo "Ralph completed all tasks!"
    echo "Completed at iteration $i of $MAX_ITERATIONS"
    echo "COMPLETE - Iteration $i - $(date)" >> "$RALPH_LOG"

    # Create version tag on completion (build mode only)
    if [[ "$MODE" == "build" ]]; then
      cd "$SCRIPT_DIR/../.."  # Go to repo root
      TAG="ralph-$(date +%Y%m%d.%H%M%S)"
      if [ -n "$PRD_NAME" ]; then
        TAG="ralph-${PRD_NAME}-$(date +%Y%m%d.%H%M%S)"
      fi
      git tag -a "$TAG" -m "Ralph completed ${PRD_NAME:-session}" 2>/dev/null || true
      git push --tags 2>/dev/null || true
      echo "Created tag: $TAG"
    fi

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
