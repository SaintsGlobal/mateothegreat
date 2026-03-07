#!/bin/zsh
# ┌───────────────────────────────────────────────────────────────────────────┐
# │  Ralph Activity Dashboard - Real-time monitoring for autonomous agents    │
# │  Usage: ./ralph-watch.sh [prd-name]                                       │
# └───────────────────────────────────────────────────────────────────────────┘

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PRD_NAME="${1:-}"

# ═══════════════════════════════════════════════════════════════════════════
# Configuration
# ═══════════════════════════════════════════════════════════════════════════

CLAUDE_DEBUG_DIR="$HOME/.claude/debug"
CLAUDE_TEAMS_DIR="$HOME/.claude/teams"
CLAUDE_PROJECTS_DIR="$HOME/.claude/projects"

# Derive project path based on where ralph runs from
# If PRD is specified, ralph runs from prds/<name>/ which creates its own project dir
if [ -n "$PRD_NAME" ]; then
  # Ralph runs from PRD directory, so project path is based on that
  PRD_WORKING_DIR="$SCRIPT_DIR/prds/$PRD_NAME"
  PROJECT_PATH=$(echo "$PRD_WORKING_DIR" | sed 's|/|-|g')
else
  # Use git root for non-PRD runs
  GIT_ROOT=$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel 2>/dev/null || pwd)
  PROJECT_PATH=$(echo "$GIT_ROOT" | sed 's|/|-|g')
fi
CLAUDE_PROJECT_DIR="$CLAUDE_PROJECTS_DIR/$PROJECT_PATH"

if [ -n "$PRD_NAME" ]; then
  PRD_DIR="$SCRIPT_DIR/prds/$PRD_NAME"
  PRD_FILE="$PRD_DIR/prd.json"
  PROGRESS_FILE="$PRD_DIR/progress.txt"
  ACTIVITY_LOG="$PRD_DIR/activity.log"
  RALPH_LOG="$PRD_DIR/ralph.log"
  mkdir -p "$PRD_DIR"
else
  PRD_FILE="$SCRIPT_DIR/prd.json"
  PROGRESS_FILE="$SCRIPT_DIR/progress.txt"
  ACTIVITY_LOG="$SCRIPT_DIR/activity.log"
  RALPH_LOG="$SCRIPT_DIR/ralph.log"
fi

# ═══════════════════════════════════════════════════════════════════════════
# ANSI Escape Codes
# ═══════════════════════════════════════════════════════════════════════════

ESC=$'\033'
CSI="${ESC}["

# Cursor control
HIDE_CURSOR="${CSI}?25l"
SHOW_CURSOR="${CSI}?25h"
CLEAR_LINE="${CSI}2K"
CLEAR_SCREEN="${CSI}2J"
HOME="${CSI}H"

# Reset
C_RESET="${CSI}0m"
C_BOLD="${CSI}1m"
C_DIM="${CSI}2m"

# Foreground - 256 color helper
c_fg() { echo "${CSI}38;5;${1}m"; }

# ═══════════════════════════════════════════════════════════════════════════
# OpenClaw "Lobster" Palette
# ═══════════════════════════════════════════════════════════════════════════

C_ACCENT=$(c_fg 208)    # Orange - primary accent (#FF5A2D)
C_SUCCESS=$(c_fg 43)    # Teal green - success (#2FBF71)
C_ERROR=$(c_fg 160)     # Red - errors (#E23D2D)
C_MUTED=$(c_fg 101)     # Warm gray - secondary (#8B7F77)
C_DIM_FG=$(c_fg 239)    # Dark gray - borders (#4A4A4A)
C_TEXT=$(c_fg 254)      # Light gray - primary text (#E5E5E5)
C_SUBTLE=$(c_fg 242)    # Medium gray - de-emphasized (#6B6B6B)
C_HIGHLIGHT=$(c_fg 223) # Warm highlight for current items

# ═══════════════════════════════════════════════════════════════════════════
# Fixed-Width Unicode Symbols (no emojis inline)
# ═══════════════════════════════════════════════════════════════════════════

SYM_CHECK="✓"       # 1 cell
SYM_CROSS="✗"       # 1 cell
SYM_DOT="●"         # 1 cell
SYM_CIRCLE="○"      # 1 cell
SYM_ARROW="→"       # 1 cell
SYM_PLAY="▶"        # 1 cell
SYM_TREE_L="└"      # 1 cell
SYM_TREE_T="├"      # 1 cell
SYM_TREE_V="│"      # 1 cell
SYM_DASH="─"        # 1 cell

# Box drawing - clean borders
BOX_TL="┌"
BOX_TR="┐"
BOX_BL="└"
BOX_BR="┘"
BOX_H="─"
BOX_V="│"
BOX_T_DOWN="┬"
BOX_T_UP="┴"
BOX_T_RIGHT="├"
BOX_T_LEFT="┤"

# Progress bar
PROG_FULL="█"
PROG_LIGHT="░"

# Spinner frames for active operations
SPINNER_FRAMES=("⠋" "⠙" "⠹" "⠸" "⠼" "⠴" "⠦" "⠧" "⠇" "⠏")
SPINNER_IDX=0

# ═══════════════════════════════════════════════════════════════════════════
# State Variables
# ═══════════════════════════════════════════════════════════════════════════

START_TIME=$(date +%s)
TOOL_COUNT=0
READ_COUNT=0
WRITE_COUNT=0
BASH_COUNT=0
AGENT_COUNT=0
ERROR_COUNT=0
COST_ESTIMATE="0.00"
ACTIVITY_LINES=()
MAX_ACTIVITY_LINES=12
TERM_WIDTH=$(tput cols)
TERM_HEIGHT=$(tput lines)
SESSION_ID=""
SESSION_STATUS="waiting"  # waiting, running, complete, idle, error
KNOWN_TEAMS=$(ls -1 "$CLAUDE_TEAMS_DIR" 2>/dev/null | sort)
LAST_MOD_TIME=0
IDLE_THRESHOLD=10
PENDING_DETAIL=""
LAST_TOOL=""
CURRENT_FILE=""
LEFT_PANEL_WIDTH=30

# PRD State
declare -a USER_STORY_IDS
declare -a USER_STORY_TITLES
declare -a USER_STORY_STATUS
TOTAL_STORIES=0
COMPLETED_STORIES=0

# Real token tracking (aggregated across all sessions)
TOTAL_INPUT_TOKENS=0
TOTAL_OUTPUT_TOKENS=0
TOTAL_CACHE_WRITE_TOKENS=0
TOTAL_CACHE_READ_TOKENS=0
COST_WITHOUT_CACHE="0.00"
CACHE_SAVINGS="0.00"
CACHE_HIT_RATE=0

# Session tracking
SESSION_COUNT=0
declare -a KNOWN_JSONL_FILES

# Subagent tracking (using tool_use events, not system events)
declare -A ACTIVE_AGENTS           # tool_use_id -> description
declare -A AGENT_TOOL_COUNT        # tool_use_id -> tool count
declare -A AGENT_STATUS            # tool_use_id -> running|complete
ACTIVE_AGENT_COUNT=0               # Currently running agents
TOTAL_AGENT_SPAWNS=0               # Total agents spawned this session
CURRENT_PHASE=""                   # Current implementation phase

# Scrolling/pagination state
SCROLL_OFFSET=0                    # For activity panel scrolling
STORY_SCROLL_OFFSET=0              # For story list scrolling
CURRENT_WORKING_STORY=""           # Currently being worked on

# State persistence (for subshell variable sharing)
STATE_FILE="/tmp/ralph-watch-$$.state"
COMPLETE_FLAG="/tmp/ralph-watch-complete-$$"
MONITOR_PID=""

save_state() {
  cat > "$STATE_FILE" << EOF
TOOL_COUNT=$TOOL_COUNT
READ_COUNT=$READ_COUNT
WRITE_COUNT=$WRITE_COUNT
BASH_COUNT=$BASH_COUNT
AGENT_COUNT=$AGENT_COUNT
ERROR_COUNT=$ERROR_COUNT
COMPLETED_STORIES=$COMPLETED_STORIES
TOTAL_INPUT_TOKENS=$TOTAL_INPUT_TOKENS
TOTAL_OUTPUT_TOKENS=$TOTAL_OUTPUT_TOKENS
TOTAL_CACHE_WRITE_TOKENS=$TOTAL_CACHE_WRITE_TOKENS
TOTAL_CACHE_READ_TOKENS=$TOTAL_CACHE_READ_TOKENS
SESSION_COUNT=$SESSION_COUNT
COST_ESTIMATE=$COST_ESTIMATE
COST_WITHOUT_CACHE=$COST_WITHOUT_CACHE
CACHE_SAVINGS=$CACHE_SAVINGS
CACHE_HIT_RATE=$CACHE_HIT_RATE
ACTIVE_AGENT_COUNT=$ACTIVE_AGENT_COUNT
TOTAL_AGENT_SPAWNS=$TOTAL_AGENT_SPAWNS
EOF
}

restore_state() {
  if [ -f "$STATE_FILE" ]; then
    source "$STATE_FILE"
    rm -f "$STATE_FILE"
  fi
}

# ═══════════════════════════════════════════════════════════════════════════
# Utility Functions
# ═══════════════════════════════════════════════════════════════════════════

move_to() { echo -en "${CSI}${1};${2}H"; }
clear_to_eol() { echo -en "${CSI}K"; }

# Draw a complete row, filling all columns explicitly
draw_row() {
  local row=$1
  local content="$2"
  local left_border="${3:-true}"
  local right_border="${4:-true}"

  move_to $row 1

  # Clear entire line first
  printf "%${TERM_WIDTH}s" ""
  move_to $row 1

  # Draw left border
  [ "$left_border" = "true" ] && echo -en "${C_DIM_FG}${BOX_V}${C_RESET}"

  # Draw content
  echo -en "$content"

  # Position at exact right edge and draw border
  [ "$right_border" = "true" ] && {
    move_to $row $TERM_WIDTH
    echo -en "${C_DIM_FG}${BOX_V}${C_RESET}"
  }
}

# Draw horizontal line with proper box-drawing characters
draw_hline() {
  local row=$1
  local left_char="$2"
  local right_char="$3"
  local mid_char="${4:-}"
  local mid_col="${5:-0}"

  move_to $row 1
  printf "%${TERM_WIDTH}s" ""
  move_to $row 1

  echo -en "${C_DIM_FG}${left_char}"

  local width=$((TERM_WIDTH - 2))
  if [ -n "$mid_char" ] && [ "$mid_col" -gt 0 ]; then
    for ((i=1; i<mid_col; i++)); do echo -en "${BOX_H}"; done
    echo -en "${mid_char}"
    for ((i=mid_col+1; i<=width; i++)); do echo -en "${BOX_H}"; done
  else
    for ((i=0; i<width; i++)); do echo -en "${BOX_H}"; done
  fi

  echo -en "${right_char}${C_RESET}"
}

get_elapsed() {
  local now=$(date +%s)
  local elapsed=$((now - START_TIME))
  local hrs=$((elapsed / 3600))
  local mins=$(((elapsed % 3600) / 60))
  local secs=$((elapsed % 60))
  if [ $hrs -gt 0 ]; then
    printf "%d:%02d:%02d" $hrs $mins $secs
  else
    printf "%02d:%02d" $mins $secs
  fi
}

truncate_str() {
  local str="$1"
  local max="$2"
  if [ ${#str} -gt $max ]; then
    echo "${str:0:$((max-1))}…"
  else
    echo "$str"
  fi
}

# Progress bar - compact
progress_bar() {
  local current=$1
  local total=$2
  local width=$3

  if [ $total -eq 0 ]; then
    echo -n "${C_DIM_FG}"
    for ((i=0; i<width; i++)); do echo -n "$PROG_LIGHT"; done
    echo -n "${C_RESET}"
    return
  fi

  local filled=$((current * width / total))
  local empty=$((width - filled))

  echo -n "${C_SUCCESS}"
  for ((i=0; i<filled; i++)); do echo -n "$PROG_FULL"; done
  echo -n "${C_DIM_FG}"
  for ((i=0; i<empty; i++)); do echo -n "$PROG_LIGHT"; done
  echo -n "${C_RESET}"
}

# ═══════════════════════════════════════════════════════════════════════════
# PRD Parsing
# ═══════════════════════════════════════════════════════════════════════════

load_prd() {
  if [ ! -f "$PRD_FILE" ]; then
    return
  fi

  local stories=$(jq -r '.userStories[]? | "\(.id)|\(.title)|\(.passes)"' "$PRD_FILE" 2>/dev/null)

  TOTAL_STORIES=0
  COMPLETED_STORIES=0
  USER_STORY_IDS=()
  USER_STORY_TITLES=()
  USER_STORY_STATUS=()

  while IFS='|' read -r id title passes; do
    [ -z "$id" ] && continue
    USER_STORY_IDS+=("$id")
    USER_STORY_TITLES+=("$title")
    if [ "$passes" = "true" ]; then
      USER_STORY_STATUS+=("done")
      COMPLETED_STORIES=$((COMPLETED_STORIES + 1))
    else
      USER_STORY_STATUS+=("pending")
    fi
    TOTAL_STORIES=$((TOTAL_STORIES + 1))
  done <<< "$stories"
}

refresh_prd() {
  if [ ! -f "$PRD_FILE" ]; then
    return
  fi

  # First check IMPLEMENTATION_PLAN.md for completion status (ghuntley workflow)
  local impl_plan="$PRD_DIR/IMPLEMENTATION_PLAN.md"
  if [ -f "$impl_plan" ]; then
    # Parse status line like "Status: 36/36 stories complete"
    local status_line=$(grep -iE "status.*[0-9]+/[0-9]+|[0-9]+/[0-9]+.*complete" "$impl_plan" 2>/dev/null | head -1)
    if [ -n "$status_line" ]; then
      local nums=$(echo "$status_line" | grep -oE '[0-9]+/[0-9]+' | head -1)
      if [ -n "$nums" ]; then
        COMPLETED_STORIES=$(echo "$nums" | cut -d'/' -f1)
      fi
    fi

    # Check for "ALL DONE" marker
    if grep -qiE "all done|implementation complete|all.*stories.*complete" "$impl_plan" 2>/dev/null; then
      COMPLETED_STORIES=$TOTAL_STORIES
      # Mark all as done
      for ((idx=0; idx<TOTAL_STORIES; idx++)); do
        USER_STORY_STATUS[$idx]="done"
      done
    fi

    # Detect current phase being worked on
    CURRENT_PHASE=$(grep -oE "Phase [0-9]+" "$impl_plan" 2>/dev/null | tail -1)
  fi

  # Fallback: check prd.json passes (legacy)
  if [ "$COMPLETED_STORIES" -eq 0 ]; then
    local idx=0
    for id in "${USER_STORY_IDS[@]}"; do
      local passes=$(jq -r ".userStories[]? | select(.id == \"$id\") | .passes" "$PRD_FILE" 2>/dev/null)
      if [ "$passes" = "true" ]; then
        USER_STORY_STATUS[$idx]="done"
        COMPLETED_STORIES=$((COMPLETED_STORIES + 1))
      fi
      idx=$((idx + 1))
    done
  fi
}

# Detect current working story from file path or description
detect_working_story() {
  local text="$1"
  # Look for story ID patterns like FD-001, US-001, etc.
  local story_id=$(echo "$text" | grep -oE '[A-Z]{2,}-[0-9]{3}' | head -1)
  if [ -n "$story_id" ]; then
    CURRENT_WORKING_STORY="$story_id"
    # Auto-scroll to show the working story
    for ((i=0; i<TOTAL_STORIES; i++)); do
      if [ "${USER_STORY_IDS[$i]}" = "$story_id" ]; then
        # Set scroll offset to show this story in view
        local visible=$((MAX_ACTIVITY_LINES - 2))
        if [ $i -ge $visible ]; then
          STORY_SCROLL_OFFSET=$((i - visible / 2))
          [ $STORY_SCROLL_OFFSET -lt 0 ] && STORY_SCROLL_OFFSET=0
        fi
        break
      fi
    done
  fi
}

# ═══════════════════════════════════════════════════════════════════════════
# Activity Log - Tree Structure
# ═══════════════════════════════════════════════════════════════════════════

add_activity() {
  local tool="$1"
  local detail="$2"
  local type="${3:-tool}"  # tool, sub, agent, status, done

  # Try to detect working story from activity
  detect_working_story "$detail"

  local entry
  case "$type" in
    sub)
      # Sub-item with tree connector
      entry="  ${C_DIM_FG}${SYM_TREE_L}${SYM_DASH}${C_RESET} ${C_SUBTLE}${detail}${C_RESET}"
      ;;
    agent)
      # Agent/Team with diamond marker
      entry="${C_HIGHLIGHT}◆${C_RESET} ${C_ACCENT}@${tool}${C_RESET} ${C_TEXT}${detail}${C_RESET}"
      ;;
    status)
      # Status update with dot
      entry="${C_SUCCESS}●${C_RESET} ${C_MUTED}${detail}${C_RESET}"
      ;;
    done)
      # Completed with checkmark
      entry="${C_SUCCESS}${SYM_CHECK}${C_RESET} ${C_DIM}${detail}${C_RESET}"
      ;;
    *)
      # Main tool line with colored indicator
      local color="$C_TEXT"
      local icon="$SYM_PLAY"
      case "$tool" in
        READ|GLOB|GREP) color="$C_MUTED"; icon="◇" ;;
        WRITE|EDIT)     color="$C_ACCENT"; icon="◆" ;;
        BASH)           color="$C_SUBTLE"; icon="▸" ;;
        AGENT|TEAM)     color="$C_HIGHLIGHT"; icon="◆" ;;
        LOAD)           color="$C_SUCCESS"; icon="↓" ;;
        ERROR)          color="$C_ERROR"; icon="✗" ;;
        DONE)           color="$C_SUCCESS"; icon="✓" ;;
        TEST)           color="$C_ACCENT"; icon="▶" ;;
        GIT)            color="$C_MUTED"; icon="⎇" ;;
        MCP)            color="$C_SUBTLE"; icon="⚡" ;;
        START|SESSION)  color="$C_SUCCESS"; icon="●" ;;
      esac
      entry="${C_DIM_FG}${icon}${C_RESET} ${color}${C_BOLD}$(printf '%-5s' "$tool")${C_RESET} ${C_TEXT}${detail}${C_RESET}"
      ;;
  esac

  ACTIVITY_LINES+=("$entry")

  # Keep only last N lines
  if [ ${#ACTIVITY_LINES[@]} -gt $MAX_ACTIVITY_LINES ]; then
    ACTIVITY_LINES=("${ACTIVITY_LINES[@]:1}")
  fi

  # Write to log file (plain text)
  local timestamp=$(date '+%H:%M:%S')
  case "$type" in
    sub)
      echo "       └─ $detail" >> "$ACTIVITY_LOG"
      ;;
    agent)
      echo "[$timestamp] [@$tool] $detail" >> "$ACTIVITY_LOG"
      ;;
    *)
      echo "[$timestamp] [$tool] $detail" >> "$ACTIVITY_LOG"
      ;;
  esac
}

add_detail() {
  local detail="$1"
  add_activity "" "$detail" "sub"
}

add_status() {
  local detail="$1"
  add_activity "" "$detail" "status"
}

# Add agent activity with nested tree display
add_agent_activity() {
  local task_id="$1"
  local tool="$2"
  local detail="$3"

  local agent_name="${ACTIVE_AGENTS[$task_id]:-Agent}"
  local short_id="${task_id:0:8}"

  local entry
  case "$tool" in
    SPAWN)
      # Root-level agent spawn
      entry="${C_HIGHLIGHT}◆${C_RESET} ${C_ACCENT}[$short_id]${C_RESET} ${C_TEXT}${detail}${C_RESET}"
      ;;
    DONE)
      # Agent completion with checkmark
      entry="${C_SUCCESS}${SYM_CHECK}${C_RESET} ${C_MUTED}[$short_id]${C_RESET} ${C_DIM}${detail}${C_RESET}"
      ;;
    *)
      # Nested tool call (indented with tree connector)
      local icon="◇"
      local color="$C_SUBTLE"
      case "$tool" in
        Read|Glob|Grep) icon="◇"; color="$C_MUTED" ;;
        Write|Edit)     icon="◆"; color="$C_ACCENT" ;;
        Bash)           icon="▸"; color="$C_SUBTLE" ;;
        Agent)          icon="◆"; color="$C_HIGHLIGHT" ;;
        *)              icon="○"; color="$C_SUBTLE" ;;
      esac
      entry="  ${C_DIM_FG}├─${C_RESET} ${color}${icon} ${tool}${C_RESET} ${C_SUBTLE}${detail}${C_RESET}"
      ;;
  esac

  ACTIVITY_LINES+=("$entry")
  # Keep last N lines
  [ ${#ACTIVITY_LINES[@]} -gt $MAX_ACTIVITY_LINES ] && ACTIVITY_LINES=("${ACTIVITY_LINES[@]:1}")

  # Write to log file (plain text)
  local timestamp=$(date '+%H:%M:%S')
  case "$tool" in
    SPAWN)
      echo "[$timestamp] [AGENT:$short_id] SPAWN: $detail" >> "$ACTIVITY_LOG"
      ;;
    DONE)
      echo "[$timestamp] [AGENT:$short_id] DONE: $detail" >> "$ACTIVITY_LOG"
      ;;
    *)
      echo "[$timestamp]   └─ $tool: $detail" >> "$ACTIVITY_LOG"
      ;;
  esac
}

# ═══════════════════════════════════════════════════════════════════════════
# Real Token Tracking from JSONL
# ═══════════════════════════════════════════════════════════════════════════

aggregate_all_sessions() {
  # Reset totals
  TOTAL_INPUT_TOKENS=0
  TOTAL_OUTPUT_TOKENS=0
  TOTAL_CACHE_WRITE_TOKENS=0
  TOTAL_CACHE_READ_TOKENS=0

  [ -z "$RALPH_START_TIME" ] && RALPH_START_TIME=$(get_ralph_start_time)

  # Find all JSONL files created after ralph started
  for jsonl in "$CLAUDE_PROJECT_DIR"/*.jsonl; do
    [ -f "$jsonl" ] || continue
    local file_mtime=$(stat -f %m "$jsonl" 2>/dev/null || echo "0")
    [ "$file_mtime" -lt "$((RALPH_START_TIME - 10))" ] && continue

    # Parse usage from this session using jq
    local usage=$(jq -s '
      [.[].message.usage // empty] |
      {
        input: (map(.input_tokens // 0) | add // 0),
        output: (map(.output_tokens // 0) | add // 0),
        cache_write: (map(.cache_creation_input_tokens // 0) | add // 0),
        cache_read: (map(.cache_read_input_tokens // 0) | add // 0)
      }
    ' "$jsonl" 2>/dev/null)

    # Add to totals
    local inp=$(echo "$usage" | jq -r '.input // 0' 2>/dev/null)
    local out=$(echo "$usage" | jq -r '.output // 0' 2>/dev/null)
    local cw=$(echo "$usage" | jq -r '.cache_write // 0' 2>/dev/null)
    local cr=$(echo "$usage" | jq -r '.cache_read // 0' 2>/dev/null)

    TOTAL_INPUT_TOKENS=$((TOTAL_INPUT_TOKENS + ${inp:-0}))
    TOTAL_OUTPUT_TOKENS=$((TOTAL_OUTPUT_TOKENS + ${out:-0}))
    TOTAL_CACHE_WRITE_TOKENS=$((TOTAL_CACHE_WRITE_TOKENS + ${cw:-0}))
    TOTAL_CACHE_READ_TOKENS=$((TOTAL_CACHE_READ_TOKENS + ${cr:-0}))
  done

  calculate_cost
}

calculate_cost() {
  # Opus pricing per million tokens
  local PRICE_INPUT=15.00
  local PRICE_OUTPUT=75.00
  local PRICE_CACHE_WRITE=18.75   # 1.25x input
  local PRICE_CACHE_READ=1.50     # 0.1x input (90% discount)

  # Calculate costs using bc for precision
  local cost_input=$(echo "scale=6; $TOTAL_INPUT_TOKENS * $PRICE_INPUT / 1000000" | bc 2>/dev/null || echo "0")
  local cost_output=$(echo "scale=6; $TOTAL_OUTPUT_TOKENS * $PRICE_OUTPUT / 1000000" | bc 2>/dev/null || echo "0")
  local cost_cache_write=$(echo "scale=6; $TOTAL_CACHE_WRITE_TOKENS * $PRICE_CACHE_WRITE / 1000000" | bc 2>/dev/null || echo "0")
  local cost_cache_read=$(echo "scale=6; $TOTAL_CACHE_READ_TOKENS * $PRICE_CACHE_READ / 1000000" | bc 2>/dev/null || echo "0")

  COST_ESTIMATE=$(printf "%.2f" $(echo "scale=2; $cost_input + $cost_output + $cost_cache_write + $cost_cache_read" | bc 2>/dev/null || echo "0"))

  # Calculate what it would cost without caching
  local uncached_input=$((TOTAL_INPUT_TOKENS + TOTAL_CACHE_WRITE_TOKENS + TOTAL_CACHE_READ_TOKENS))
  COST_WITHOUT_CACHE=$(printf "%.2f" $(echo "scale=2; $uncached_input * $PRICE_INPUT / 1000000 + $TOTAL_OUTPUT_TOKENS * $PRICE_OUTPUT / 1000000" | bc 2>/dev/null || echo "0"))
  CACHE_SAVINGS=$(printf "%.2f" $(echo "scale=2; $COST_WITHOUT_CACHE - $COST_ESTIMATE" | bc 2>/dev/null || echo "0"))

  # Cache hit rate
  local total_cache=$((TOTAL_CACHE_WRITE_TOKENS + TOTAL_CACHE_READ_TOKENS))
  if [ $total_cache -gt 0 ]; then
    CACHE_HIT_RATE=$((TOTAL_CACHE_READ_TOKENS * 100 / total_cache))
  else
    CACHE_HIT_RATE=0
  fi
}

check_new_sessions() {
  local current_sessions=()
  for jsonl in "$CLAUDE_PROJECT_DIR"/*.jsonl; do
    [ -f "$jsonl" ] || continue
    local file_mtime=$(stat -f %m "$jsonl" 2>/dev/null || echo "0")
    [ "$file_mtime" -ge "$((RALPH_START_TIME - 10))" ] && current_sessions+=("$jsonl")
  done

  # Detect new sessions
  for session in "${current_sessions[@]}"; do
    local is_known=false
    for known in "${KNOWN_JSONL_FILES[@]}"; do
      [ "$session" = "$known" ] && is_known=true && break
    done

    if [ "$is_known" = "false" ]; then
      KNOWN_JSONL_FILES+=("$session")
      local session_id=$(basename "$session" .jsonl)
      add_activity "SESSION" "New: ${session_id:0:8}..."
    fi
  done

  SESSION_COUNT=${#KNOWN_JSONL_FILES[@]}
}

format_tokens() {
  local tokens="${1:-0}"
  if [ $tokens -gt 1000000 ]; then
    printf "%.1fM" $(echo "scale=1; $tokens / 1000000" | bc 2>/dev/null || echo "0")
  elif [ $tokens -gt 1000 ]; then
    printf "%.1fK" $(echo "scale=1; $tokens / 1000" | bc 2>/dev/null || echo "0")
  else
    echo "$tokens"
  fi
}

# ═══════════════════════════════════════════════════════════════════════════
# JSONL Session File Discovery
# ═══════════════════════════════════════════════════════════════════════════

RALPH_START_TIME=""

get_ralph_start_time() {
  # Get when the ralph run started from ralph.log modification time
  if [ -f "$RALPH_LOG" ]; then
    stat -f %m "$RALPH_LOG" 2>/dev/null || date +%s
  else
    date +%s
  fi
}

find_ralph_jsonl() {
  # Find JSONL file that was created/modified AFTER ralph started
  # This avoids picking up other unrelated Claude sessions
  if [ -z "$RALPH_START_TIME" ]; then
    RALPH_START_TIME=$(get_ralph_start_time)
  fi

  if [ -d "$CLAUDE_PROJECT_DIR" ]; then
    # Find JSONL files modified after ralph started, sorted by modification time
    for jsonl in $(ls -t "$CLAUDE_PROJECT_DIR"/*.jsonl 2>/dev/null); do
      local file_mtime=$(stat -f %m "$jsonl" 2>/dev/null || echo "0")
      # Allow 10 seconds of leeway before ralph start time
      if [ "$file_mtime" -ge "$((RALPH_START_TIME - 10))" ]; then
        echo "$jsonl"
        return
      fi
    done
  fi
}

find_latest_jsonl() {
  # First try to find ralph-specific session
  local ralph_session=$(find_ralph_jsonl)
  if [ -n "$ralph_session" ]; then
    echo "$ralph_session"
  else
    # Fallback to most recent JSONL
    if [ -d "$CLAUDE_PROJECT_DIR" ]; then
      ls -t "$CLAUDE_PROJECT_DIR"/*.jsonl 2>/dev/null | head -1
    fi
  fi
}

get_session_id_from_jsonl() {
  local jsonl_file="$1"
  if [ -n "$jsonl_file" ]; then
    basename "$jsonl_file" .jsonl
  fi
}

# ═══════════════════════════════════════════════════════════════════════════
# Session Status Detection
# ═══════════════════════════════════════════════════════════════════════════

check_session_status() {
  # Check ralph.log for completion
  if [ -f "$RALPH_LOG" ] && grep -q "COMPLETE" "$RALPH_LOG" 2>/dev/null; then
    SESSION_STATUS="complete"
    return
  fi

  # Check debug log for session end signals
  if [ -L "$CLAUDE_DEBUG_DIR/latest" ]; then
    local debug_file=$(readlink "$CLAUDE_DEBUG_DIR/latest" 2>/dev/null)
    if [ -f "$debug_file" ]; then
      if tail -50 "$debug_file" 2>/dev/null | grep -qE "Session ended|Goodbye|Total cost:|Conversation ended"; then
        SESSION_STATUS="complete"
        return
      fi

      # Check for idle (no modification in IDLE_THRESHOLD seconds)
      local current_mod=$(stat -f %m "$debug_file" 2>/dev/null || echo "0")
      local now=$(date +%s)
      if [ "$LAST_MOD_TIME" -eq "$current_mod" ]; then
        local idle_time=$((now - current_mod))
        if [ $idle_time -gt $IDLE_THRESHOLD ] && [ "$SESSION_STATUS" = "running" ]; then
          # Still check if it's truly complete
          if tail -100 "$debug_file" 2>/dev/null | grep -qE "Total cost:|Session complete"; then
            SESSION_STATUS="complete"
          fi
        fi
      else
        LAST_MOD_TIME=$current_mod
        if [ "$SESSION_STATUS" != "complete" ]; then
          SESSION_STATUS="running"
        fi
      fi
    fi
  fi
}

render_status() {
  case "$SESSION_STATUS" in
    running)   echo -en "${C_SUCCESS}${SYM_DOT} Running${C_RESET}" ;;
    complete)  echo -en "${C_ACCENT}${SYM_CHECK} Complete${C_RESET}" ;;
    idle)      echo -en "${C_MUTED}${SYM_CIRCLE} Idle${C_RESET}" ;;
    error)     echo -en "${C_ERROR}${SYM_CROSS} Error${C_RESET}" ;;
    waiting)   echo -en "${C_SUBTLE}${SYM_CIRCLE} Waiting${C_RESET}" ;;
  esac
}

# ═══════════════════════════════════════════════════════════════════════════
# Dashboard Rendering
# ═══════════════════════════════════════════════════════════════════════════

render_header() {
  # Top border
  draw_hline 1 "$BOX_TL" "$BOX_TR"

  # Title row
  local prd_display="${PRD_NAME:-default}"
  local title_content=" ${C_BOLD}${C_ACCENT}Ralph Activity Dashboard${C_RESET}  ${C_MUTED}PRD:${C_RESET} ${C_TEXT}${prd_display}${C_RESET}  ${C_MUTED}$(get_elapsed)${C_RESET}"
  draw_row 2 "$title_content"

  # Stats row - show real token breakdown
  local total_tokens=$((TOTAL_INPUT_TOKENS + TOTAL_OUTPUT_TOKENS + TOTAL_CACHE_WRITE_TOKENS + TOTAL_CACHE_READ_TOKENS))
  local formatted_total=$(format_tokens $total_tokens)
  local formatted_in=$(format_tokens $TOTAL_INPUT_TOKENS)
  local formatted_out=$(format_tokens $TOTAL_OUTPUT_TOKENS)

  local stats_content=" ${C_MUTED}Sessions:${C_RESET} ${C_TEXT}${SESSION_COUNT}${C_RESET}"
  stats_content+="  ${C_DIM_FG}│${C_RESET}  ${C_MUTED}Agents:${C_RESET} ${C_HIGHLIGHT}${ACTIVE_AGENT_COUNT}${C_MUTED}/${C_TEXT}${TOTAL_AGENT_SPAWNS}${C_RESET}"
  stats_content+="  ${C_DIM_FG}│${C_RESET}  ${C_MUTED}In:${C_RESET} ${C_TEXT}${formatted_in}${C_RESET}"
  stats_content+="  ${C_MUTED}Out:${C_RESET} ${C_TEXT}${formatted_out}${C_RESET}"
  stats_content+="  ${C_DIM_FG}│${C_RESET}  ${C_MUTED}Cache:${C_RESET} ${C_SUCCESS}${CACHE_HIT_RATE}%${C_RESET}"
  stats_content+="  ${C_DIM_FG}│${C_RESET}  ${C_SUCCESS}\$${COST_ESTIMATE}${C_RESET}"
  if [ "$CACHE_SAVINGS" != "0.00" ] && [ -n "$CACHE_SAVINGS" ]; then
    stats_content+=" ${C_MUTED}(saved \$${CACHE_SAVINGS})${C_RESET}"
  fi
  draw_row 3 "$stats_content"

  # Separator with column divider
  draw_hline 4 "$BOX_T_RIGHT" "$BOX_T_LEFT" "$BOX_T_DOWN" "$LEFT_PANEL_WIDTH"
}

render_prd_panel() {
  local start_row=5
  local max_stories=$((MAX_ACTIVITY_LINES))
  local col=$((LEFT_PANEL_WIDTH + 1))

  # PRD Header with progress bar
  local header_content=" ${C_BOLD}${C_TEXT}User Stories${C_RESET}"
  if [ $TOTAL_STORIES -gt 0 ]; then
    header_content+=" "
    # Build progress bar inline
    local divisor=$((TOTAL_STORIES > 0 ? TOTAL_STORIES : 1))
    local filled=$((COMPLETED_STORIES * 6 / divisor))
    local empty=$((6 - filled))
    header_content+="${C_SUCCESS}"
    for ((pb=0; pb<filled; pb++)); do header_content+="$PROG_FULL"; done
    header_content+="${C_DIM_FG}"
    for ((pb=0; pb<empty; pb++)); do header_content+="$PROG_LIGHT"; done
    header_content+="${C_RESET} ${C_SUCCESS}${COMPLETED_STORIES}${C_MUTED}/${C_TEXT}${TOTAL_STORIES}${C_RESET}"
  fi

  # Draw header row with explicit fill
  move_to $start_row 1
  printf "%${TERM_WIDTH}s" ""
  move_to $start_row 1
  echo -en "${C_DIM_FG}${BOX_V}${C_RESET}${header_content}"
  move_to $start_row $col
  echo -en "${C_DIM_FG}${BOX_V}${C_RESET}"
  move_to $start_row $TERM_WIDTH
  echo -en "${C_DIM_FG}${BOX_V}${C_RESET}"

  # Stories list with smart scrolling
  local row=$((start_row + 1))
  local shown=0

  # For many stories, show summary + scroll to relevant section
  local start_idx=$STORY_SCROLL_OFFSET
  if [ $TOTAL_STORIES -gt $max_stories ]; then
    # Show scroll indicator if not at top
    if [ $start_idx -gt 0 ]; then
      move_to $row 1
      printf "%${TERM_WIDTH}s" ""
      move_to $row 1
      echo -en "${C_DIM_FG}${BOX_V}${C_RESET} ${C_MUTED}↑ $start_idx more above${C_RESET}"
      move_to $row $col
      echo -en "${C_DIM_FG}${BOX_V}${C_RESET}"
      move_to $row $TERM_WIDTH
      echo -en "${C_DIM_FG}${BOX_V}${C_RESET}"
      row=$((row + 1))
      shown=$((shown + 1))
      max_stories=$((max_stories - 1))
    fi
  fi

  for ((i=start_idx; i<TOTAL_STORIES && shown<max_stories; i++)); do
    move_to $row 1
    printf "%${TERM_WIDTH}s" ""
    move_to $row 1

    echo -en "${C_DIM_FG}${BOX_V}${C_RESET} "

    local story_status="${USER_STORY_STATUS[$i]}"
    local id="${USER_STORY_IDS[$i]}"
    local title=$(truncate_str "${USER_STORY_TITLES[$i]}" $((LEFT_PANEL_WIDTH - 13)))

    # Check if this story is being worked on (detected from current activity)
    local is_working=false
    if [ -n "$CURRENT_WORKING_STORY" ] && [ "$id" = "$CURRENT_WORKING_STORY" ]; then
      is_working=true
      story_status="working"
    fi

    case "$story_status" in
      done)
        echo -en "${C_SUCCESS}${SYM_CHECK}${C_RESET} ${C_SUBTLE}${id}${C_RESET} ${C_MUTED}${title}${C_RESET}"
        ;;
      working)
        echo -en "${C_ACCENT}${SYM_DOT}${C_RESET} ${C_ACCENT}${id}${C_RESET} ${C_TEXT}${title}${C_RESET}"
        ;;
      *)
        echo -en "${C_SUBTLE}${SYM_CIRCLE}${C_RESET} ${C_SUBTLE}${id}${C_RESET} ${C_SUBTLE}${title}${C_RESET}"
        ;;
    esac

    move_to $row $col
    echo -en "${C_DIM_FG}${BOX_V}${C_RESET}"
    move_to $row $TERM_WIDTH
    echo -en "${C_DIM_FG}${BOX_V}${C_RESET}"
    row=$((row + 1))
    shown=$((shown + 1))
  done

  # Show scroll indicator if more below
  local remaining=$((TOTAL_STORIES - start_idx - shown))
  if [ $remaining -gt 0 ]; then
    if [ $shown -lt $((max_stories)) ]; then
      move_to $row 1
      printf "%${TERM_WIDTH}s" ""
      move_to $row 1
      echo -en "${C_DIM_FG}${BOX_V}${C_RESET} ${C_MUTED}↓ $remaining more below${C_RESET}"
      move_to $row $col
      echo -en "${C_DIM_FG}${BOX_V}${C_RESET}"
      move_to $row $TERM_WIDTH
      echo -en "${C_DIM_FG}${BOX_V}${C_RESET}"
      row=$((row + 1))
      shown=$((shown + 1))
    fi
  fi

  # Fill remaining rows with explicit clear
  while [ $row -lt $((start_row + max_stories + 1)) ]; do
    move_to $row 1
    printf "%${TERM_WIDTH}s" ""
    move_to $row 1
    echo -en "${C_DIM_FG}${BOX_V}${C_RESET}"
    move_to $row $col
    echo -en "${C_DIM_FG}${BOX_V}${C_RESET}"
    move_to $row $TERM_WIDTH
    echo -en "${C_DIM_FG}${BOX_V}${C_RESET}"
    row=$((row + 1))
  done
}

render_activity_panel() {
  local start_row=5
  local start_col=$((LEFT_PANEL_WIDTH + 2))
  local panel_width=$((TERM_WIDTH - start_col - 1))
  local max_lines=$((MAX_ACTIVITY_LINES))

  # Activity header (rendered via render_prd_panel row, just fill right side)
  move_to $start_row $start_col
  echo -en " ${C_BOLD}${C_TEXT}Live Activity${C_RESET}"

  # Activity lines
  local row=$((start_row + 1))
  local activity_count=${#ACTIVITY_LINES[@]}

  for ((i=0; i<max_lines; i++)); do
    move_to $row $start_col
    # Clear from start_col to right edge
    printf "%$((TERM_WIDTH - start_col))s" ""
    move_to $row $start_col

    if [ $i -lt $activity_count ]; then
      local line="${ACTIVITY_LINES[$i]}"
      echo -en " $line"
    fi

    move_to $row $TERM_WIDTH
    echo -en "${C_DIM_FG}${BOX_V}${C_RESET}"
    row=$((row + 1))
  done
}

render_current_action() {
  # Panel ends at row 5 + MAX_ACTIVITY_LINES (header + content rows)
  # Separator at 5 + MAX + 1
  # Current action at 5 + MAX + 2
  local separator_row=$((5 + MAX_ACTIVITY_LINES + 1))
  local content_row=$((5 + MAX_ACTIVITY_LINES + 2))

  # Separator
  draw_hline $separator_row "$BOX_T_RIGHT" "$BOX_T_LEFT"

  local row=$content_row

  # Current action + status row
  move_to $row 1
  printf "%${TERM_WIDTH}s" ""
  move_to $row 1

  echo -en "${C_DIM_FG}${BOX_V}${C_RESET} "

  if [ -n "$CURRENT_FILE" ] && [ "$SESSION_STATUS" = "running" ]; then
    # Show spinner when actively processing
    local spinner="${SPINNER_FRAMES[$SPINNER_IDX]}"
    SPINNER_IDX=$(( (SPINNER_IDX + 1) % ${#SPINNER_FRAMES[@]} ))

    echo -en "${C_SUCCESS}${spinner}${C_RESET} "
    echo -en "${C_ACCENT}${LAST_TOOL}${C_RESET} "
    echo -en "${C_DIM_FG}${SYM_ARROW}${C_RESET} "
    echo -en "${C_TEXT}$(truncate_str "$CURRENT_FILE" 50)${C_RESET}"
  elif [ "$SESSION_STATUS" = "complete" ]; then
    echo -en "${C_SUCCESS}${SYM_CHECK}${C_RESET} ${C_MUTED}Session complete${C_RESET}"
  elif [ "$SESSION_STATUS" = "waiting" ]; then
    echo -en "${C_SUBTLE}${SYM_CIRCLE}${C_RESET} ${C_MUTED}Waiting for session...${C_RESET}"
  else
    # Idle spinner
    local spinner="${SPINNER_FRAMES[$SPINNER_IDX]}"
    SPINNER_IDX=$(( (SPINNER_IDX + 1) % ${#SPINNER_FRAMES[@]} ))
    echo -en "${C_SUBTLE}${spinner}${C_RESET} ${C_MUTED}Monitoring...${C_RESET}"
  fi

  # Status on the right side
  local status_col=$((TERM_WIDTH - 15))
  move_to $row $status_col
  render_status

  move_to $row $TERM_WIDTH
  echo -en "${C_DIM_FG}${BOX_V}${C_RESET}"
}

render_footer() {
  # Footer border immediately follows current action row
  # Current action at 5 + MAX + 2, so footer at 5 + MAX + 3
  local row=$((5 + MAX_ACTIVITY_LINES + 3))

  # Bottom border
  draw_hline $row "$BOX_BL" "$BOX_BR"

  # Session info line (outside box)
  move_to $((row + 1)) 1
  printf "%${TERM_WIDTH}s" ""
  move_to $((row + 1)) 1
  echo -en "  ${C_SUBTLE}Session: ${SESSION_ID:0:12}${C_RESET}"

  # Show current phase if detected
  if [ -n "$CURRENT_PHASE" ]; then
    echo -en "   ${C_DIM_FG}│${C_RESET}   ${C_ACCENT}${CURRENT_PHASE}${C_RESET}"
  fi

  # Show scroll hint if there are more stories than visible
  if [ $TOTAL_STORIES -gt $MAX_ACTIVITY_LINES ]; then
    echo -en "   ${C_DIM_FG}│${C_RESET}   ${C_MUTED}${COMPLETED_STORIES}/${TOTAL_STORIES} stories${C_RESET}"
  fi

  echo -en "   ${C_DIM_FG}│${C_RESET}   ${C_SUBTLE}Ctrl+C to exit${C_RESET}"
}

render_dashboard() {
  # Refresh terminal dimensions
  local new_width=$(tput cols)
  local new_height=$(tput lines)

  # Enforce minimum size
  [ $new_width -lt 60 ] && new_width=60
  [ $new_height -lt 15 ] && new_height=15

  TERM_WIDTH=$new_width
  TERM_HEIGHT=$new_height

  # Clear any lines below our dashboard area
  # Dashboard: 4 header rows + 1 panel header + MAX activity + 1 separator + 1 current action + 1 footer + 1 session info
  local dashboard_height=$((5 + MAX_ACTIVITY_LINES + 4))
  for ((row=dashboard_height+1; row<=TERM_HEIGHT; row++)); do
    move_to $row 1
    printf "%${TERM_WIDTH}s" ""
  done

  render_header
  render_prd_panel
  render_activity_panel
  render_current_action
  render_footer
}

# ═══════════════════════════════════════════════════════════════════════════
# Event Processing
# ═══════════════════════════════════════════════════════════════════════════

process_jsonl_line() {
  local line="$1"

  # Skip empty lines
  [ -z "$line" ] && return

  # Parse JSON - extract tool_use entries
  local msg_type=$(echo "$line" | jq -r '.type // empty' 2>/dev/null)
  [ -z "$msg_type" ] && return

  # Handle assistant messages with tool_use content
  if [ "$msg_type" = "assistant" ]; then
    # Extract tool calls from content array
    local tools=$(echo "$line" | jq -r '.message.content[]? | select(.type == "tool_use") | "\(.name)|\(.input.file_path // .input.command // .input.pattern // .input.query // "")"' 2>/dev/null)

    while IFS='|' read -r tool_name tool_input; do
      [ -z "$tool_name" ] && continue

      TOOL_COUNT=$((TOOL_COUNT + 1))
      LAST_TOOL="$tool_name"

      # Get relative path for file operations
      local display_input="$tool_input"
      if [ -n "$tool_input" ]; then
        display_input=$(echo "$tool_input" | sed -E 's|.*/dev/[^/]+/||' | head -c 60)
        [ -z "$display_input" ] && display_input=$(basename "$tool_input" 2>/dev/null || echo "$tool_input")
      fi

      case "$tool_name" in
        Read)
          READ_COUNT=$((READ_COUNT + 1))
          [ -n "$display_input" ] && add_activity "READ" "$display_input"
          CURRENT_FILE="$display_input"
          ;;
        Write)
          WRITE_COUNT=$((WRITE_COUNT + 1))
          [ -n "$display_input" ] && add_activity "WRITE" "$display_input"
          CURRENT_FILE="$display_input"
          ;;
        Edit)
          WRITE_COUNT=$((WRITE_COUNT + 1))
          # Get file path specifically for Edit
          local edit_file=$(echo "$line" | jq -r '.message.content[]? | select(.type == "tool_use" and .name == "Edit") | .input.file_path // ""' 2>/dev/null | head -1)
          if [ -n "$edit_file" ]; then
            local rel_edit=$(echo "$edit_file" | sed -E 's|.*/dev/[^/]+/||')
            add_activity "EDIT" "$rel_edit"
            CURRENT_FILE="$rel_edit"
          fi
          ;;
        Bash)
          BASH_COUNT=$((BASH_COUNT + 1))
          # Get command with description if available
          local bash_cmd=$(echo "$line" | jq -r '.message.content[]? | select(.type == "tool_use" and .name == "Bash") | .input.command // ""' 2>/dev/null | head -1 | head -c 60)
          local bash_desc=$(echo "$line" | jq -r '.message.content[]? | select(.type == "tool_use" and .name == "Bash") | .input.description // ""' 2>/dev/null | head -1 | head -c 50)
          if [ -n "$bash_desc" ]; then
            add_activity "BASH" "$bash_desc"
          elif [ -n "$bash_cmd" ]; then
            add_activity "BASH" "$bash_cmd"
          fi
          CURRENT_FILE="${bash_desc:-$bash_cmd}"
          ;;
        Glob)
          READ_COUNT=$((READ_COUNT + 1))
          [ -n "$display_input" ] && add_activity "GLOB" "$display_input"
          ;;
        Grep)
          READ_COUNT=$((READ_COUNT + 1))
          local grep_pattern=$(echo "$line" | jq -r '.message.content[]? | select(.type == "tool_use" and .name == "Grep") | .input.pattern // ""' 2>/dev/null | head -1 | head -c 40)
          [ -n "$grep_pattern" ] && add_activity "GREP" "/$grep_pattern/"
          ;;
        ToolSearch)
          local query=$(echo "$line" | jq -r '.message.content[]? | select(.type == "tool_use" and .name == "ToolSearch") | .input.query // ""' 2>/dev/null | head -1)
          [ -n "$query" ] && add_activity "LOAD" "$query"
          ;;
        Agent)
          # Track agent using tool_use_id
          local agent_id=$(echo "$line" | jq -r '.message.content[]? | select(.type == "tool_use" and .name == "Agent") | .id // ""' 2>/dev/null | head -1)
          local agent_desc=$(echo "$line" | jq -r '.message.content[]? | select(.type == "tool_use" and .name == "Agent") | .input.description // .input.prompt // ""' 2>/dev/null | head -1 | head -c 45)

          if [ -n "$agent_id" ]; then
            ACTIVE_AGENTS["$agent_id"]="$agent_desc"
            AGENT_STATUS["$agent_id"]="running"
            AGENT_TOOL_COUNT["$agent_id"]=0
            ACTIVE_AGENT_COUNT=$((ACTIVE_AGENT_COUNT + 1))
            TOTAL_AGENT_SPAWNS=$((TOTAL_AGENT_SPAWNS + 1))
            AGENT_COUNT=$((AGENT_COUNT + 1))

            local short_id="${agent_id:0:8}"
            add_agent_activity "$agent_id" "SPAWN" "$agent_desc"
          else
            AGENT_COUNT=$((AGENT_COUNT + 1))
            add_activity "AGENT" "${agent_desc:-Sub-agent}"
          fi
          ;;
        TeamCreate)
          AGENT_COUNT=$((AGENT_COUNT + 1))
          add_activity "team" "Creating team..." "agent"
          ;;
        WebFetch|WebSearch)
          local url=$(echo "$line" | jq -r '.message.content[]? | select(.type == "tool_use") | .input.url // .input.query // ""' 2>/dev/null | head -1 | head -c 50)
          add_activity "WEB" "$url"
          ;;
        *)
          # Other tools - show name
          [ -n "$display_input" ] && add_activity "$tool_name" "$display_input"
          ;;
      esac
    done <<< "$tools"
  fi

  # Handle user messages (tool_result) - detect agent completion
  if [ "$msg_type" = "user" ]; then
    local tool_results=$(echo "$line" | jq -r '.message.content[]? | select(.type == "tool_result") | .tool_use_id // ""' 2>/dev/null)
    while read -r result_id; do
      [ -z "$result_id" ] && continue
      # Check if this is an agent completing
      if [ -n "${ACTIVE_AGENTS[$result_id]:-}" ] && [ "${AGENT_STATUS[$result_id]:-}" = "running" ]; then
        AGENT_STATUS["$result_id"]="complete"
        ACTIVE_AGENT_COUNT=$((ACTIVE_AGENT_COUNT > 0 ? ACTIVE_AGENT_COUNT - 1 : 0))
        local agent_desc="${ACTIVE_AGENTS[$result_id]}"
        add_agent_activity "$result_id" "DONE" "${agent_desc:0:30}"
      fi
    done <<< "$tool_results"
  fi

  # Handle progress messages
  if [ "$msg_type" = "progress" ]; then
    local progress_msg=$(echo "$line" | jq -r '.message // ""' 2>/dev/null | head -c 60)
    [ -n "$progress_msg" ] && add_status "$progress_msg"
  fi

  # Check for session completion in the message
  if echo "$line" | jq -e '.message.stop_reason == "end_turn"' &>/dev/null; then
    # Could indicate completion, but wait for ralph.log COMPLETE signal
    :
  fi

  # Save state periodically
  save_state
}

# Process stream-json output from ralph.log (from --output-format=stream-json)
process_stream_json_line() {
  local line="$1"

  # Skip empty lines
  [ -z "$line" ] && return

  # Try to parse as JSON
  local event_type=$(echo "$line" | jq -r '.type // empty' 2>/dev/null)
  [ -z "$event_type" ] && return

  case "$event_type" in
    assistant)
      # Extract tool calls from assistant messages
      local tool_name=$(echo "$line" | jq -r '.content_block.name // empty' 2>/dev/null)
      if [ -n "$tool_name" ]; then
        TOOL_COUNT=$((TOOL_COUNT + 1))
        LAST_TOOL="$tool_name"
        add_activity "$tool_name" "executing..."
        CURRENT_FILE="$tool_name"
      fi
      ;;
    content_block_start)
      local block_type=$(echo "$line" | jq -r '.content_block.type // empty' 2>/dev/null)
      if [ "$block_type" = "tool_use" ]; then
        local tool_name=$(echo "$line" | jq -r '.content_block.name // empty' 2>/dev/null)
        [ -n "$tool_name" ] && add_activity "$tool_name" "starting..."
      fi
      ;;
    tool_result)
      # Tool completed
      add_status "Tool completed"
      ;;
    message_stop)
      # Message finished
      :
      ;;
  esac
}

# Monitor ralph.log for stream-json output (secondary source)
monitor_ralph_log() {
  local last_line_count=0

  while [ ! -f "$COMPLETE_FLAG" ]; do
    if [ -f "$RALPH_LOG" ]; then
      local current_lines=$(wc -l < "$RALPH_LOG" 2>/dev/null || echo "0")
      if [ "$current_lines" -gt "$last_line_count" ]; then
        # Process new lines
        tail -n +$((last_line_count + 1)) "$RALPH_LOG" 2>/dev/null | while read -r line; do
          process_stream_json_line "$line"
        done
        last_line_count=$current_lines
      fi
    fi
    sleep 0.5
  done
}

# ═══════════════════════════════════════════════════════════════════════════
# Terminal Resize Handler
# ═══════════════════════════════════════════════════════════════════════════

handle_resize() {
  # Get new dimensions
  TERM_WIDTH=$(tput cols)
  TERM_HEIGHT=$(tput lines)

  # Enforce minimum size
  [ $TERM_WIDTH -lt 60 ] && TERM_WIDTH=60
  [ $TERM_HEIGHT -lt 15 ] && TERM_HEIGHT=15

  # Recalculate layout
  LEFT_PANEL_WIDTH=$((TERM_WIDTH * 35 / 100))
  [ $LEFT_PANEL_WIDTH -lt 30 ] && LEFT_PANEL_WIDTH=30
  [ $LEFT_PANEL_WIDTH -gt 50 ] && LEFT_PANEL_WIDTH=50

  MAX_ACTIVITY_LINES=$((TERM_HEIGHT - 10))
  [ $MAX_ACTIVITY_LINES -lt 4 ] && MAX_ACTIVITY_LINES=4
  [ $MAX_ACTIVITY_LINES -gt 15 ] && MAX_ACTIVITY_LINES=15

  # Full screen clear - move cursor home, clear entire screen, then clear scrollback
  echo -en "${CSI}H${CSI}2J${CSI}3J"

  # Redraw
  render_dashboard
}

trap handle_resize SIGWINCH

# ═══════════════════════════════════════════════════════════════════════════
# Cleanup
# ═══════════════════════════════════════════════════════════════════════════

cleanup() {
  # Restore state from file (subshell variables are lost otherwise)
  restore_state

  # Final aggregation of all sessions
  aggregate_all_sessions

  # Also refresh PRD one final time
  refresh_prd

  # Clean up temp files
  rm -f "$STATE_FILE" "$COMPLETE_FLAG"

  echo -en "$SHOW_CURSOR"
  clear

  local width=56

  echo ""
  echo -e "${C_DIM_FG}┌$(printf '%*s' $width '' | tr ' ' '─')┐${C_RESET}"
  echo -e "${C_DIM_FG}│${C_RESET}  ${C_BOLD}${C_ACCENT}Ralph Session Complete${C_RESET}$(printf '%*s' $((width - 24)) '')${C_DIM_FG}│${C_RESET}"
  echo -e "${C_DIM_FG}├$(printf '%*s' $width '' | tr ' ' '─')┤${C_RESET}"
  echo -e "${C_DIM_FG}│${C_RESET}$(printf '%*s' $width '')${C_DIM_FG}│${C_RESET}"
  printf "${C_DIM_FG}│${C_RESET}   ${C_MUTED}Duration:${C_RESET}    ${C_TEXT}%-10s${C_RESET}%*s${C_DIM_FG}│${C_RESET}\n" "$(get_elapsed)" $((width - 25)) ""
  printf "${C_DIM_FG}│${C_RESET}   ${C_MUTED}Sessions:${C_RESET}    ${C_TEXT}%-10s${C_RESET}%*s${C_DIM_FG}│${C_RESET}\n" "$SESSION_COUNT" $((width - 25)) ""
  printf "${C_DIM_FG}│${C_RESET}   ${C_MUTED}Tools:${C_RESET}       ${C_TEXT}%-10s${C_RESET}%*s${C_DIM_FG}│${C_RESET}\n" "${TOOL_COUNT} calls" $((width - 25)) ""
  printf "${C_DIM_FG}│${C_RESET}   ${C_MUTED}Reads:${C_RESET}       ${C_TEXT}%-10s${C_RESET}%*s${C_DIM_FG}│${C_RESET}\n" "$READ_COUNT" $((width - 25)) ""
  printf "${C_DIM_FG}│${C_RESET}   ${C_MUTED}Writes:${C_RESET}      ${C_TEXT}%-10s${C_RESET}%*s${C_DIM_FG}│${C_RESET}\n" "$WRITE_COUNT" $((width - 25)) ""
  printf "${C_DIM_FG}│${C_RESET}   ${C_MUTED}Commands:${C_RESET}    ${C_TEXT}%-10s${C_RESET}%*s${C_DIM_FG}│${C_RESET}\n" "$BASH_COUNT" $((width - 25)) ""
  printf "${C_DIM_FG}│${C_RESET}   ${C_MUTED}Subagents:${C_RESET}   ${C_TEXT}%-10s${C_RESET}%*s${C_DIM_FG}│${C_RESET}\n" "$TOTAL_AGENT_SPAWNS spawned" $((width - 25)) ""
  printf "${C_DIM_FG}│${C_RESET}   ${C_MUTED}Errors:${C_RESET}      ${C_ERROR}%-10s${C_RESET}%*s${C_DIM_FG}│${C_RESET}\n" "$ERROR_COUNT" $((width - 25)) ""
  echo -e "${C_DIM_FG}│${C_RESET}$(printf '%*s' $width '')${C_DIM_FG}│${C_RESET}"
  echo -e "${C_DIM_FG}├$(printf '%*s' $width '' | tr ' ' '─')┤${C_RESET}"
  echo -e "${C_DIM_FG}│${C_RESET}  ${C_BOLD}${C_TEXT}Token Usage${C_RESET}$(printf '%*s' $((width - 13)) '')${C_DIM_FG}│${C_RESET}"
  echo -e "${C_DIM_FG}│${C_RESET}$(printf '%*s' $width '')${C_DIM_FG}│${C_RESET}"
  printf "${C_DIM_FG}│${C_RESET}   ${C_MUTED}Input:${C_RESET}       ${C_TEXT}%-10s${C_RESET}%*s${C_DIM_FG}│${C_RESET}\n" "$(format_tokens $TOTAL_INPUT_TOKENS)" $((width - 25)) ""
  printf "${C_DIM_FG}│${C_RESET}   ${C_MUTED}Output:${C_RESET}      ${C_TEXT}%-10s${C_RESET}%*s${C_DIM_FG}│${C_RESET}\n" "$(format_tokens $TOTAL_OUTPUT_TOKENS)" $((width - 25)) ""
  printf "${C_DIM_FG}│${C_RESET}   ${C_MUTED}Cache write:${C_RESET} ${C_TEXT}%-10s${C_RESET}%*s${C_DIM_FG}│${C_RESET}\n" "$(format_tokens $TOTAL_CACHE_WRITE_TOKENS)" $((width - 25)) ""
  printf "${C_DIM_FG}│${C_RESET}   ${C_MUTED}Cache read:${C_RESET}  ${C_SUCCESS}%-10s${C_RESET}%*s${C_DIM_FG}│${C_RESET}\n" "$(format_tokens $TOTAL_CACHE_READ_TOKENS)" $((width - 25)) ""
  printf "${C_DIM_FG}│${C_RESET}   ${C_MUTED}Cache hit:${C_RESET}   ${C_SUCCESS}%-10s${C_RESET}%*s${C_DIM_FG}│${C_RESET}\n" "${CACHE_HIT_RATE}%" $((width - 25)) ""
  echo -e "${C_DIM_FG}│${C_RESET}$(printf '%*s' $width '')${C_DIM_FG}│${C_RESET}"
  echo -e "${C_DIM_FG}├$(printf '%*s' $width '' | tr ' ' '─')┤${C_RESET}"
  echo -e "${C_DIM_FG}│${C_RESET}  ${C_BOLD}${C_TEXT}Cost${C_RESET}$(printf '%*s' $((width - 6)) '')${C_DIM_FG}│${C_RESET}"
  echo -e "${C_DIM_FG}│${C_RESET}$(printf '%*s' $width '')${C_DIM_FG}│${C_RESET}"
  printf "${C_DIM_FG}│${C_RESET}   ${C_MUTED}Total cost:${C_RESET}  ${C_SUCCESS}\$%-9s${C_RESET}%*s${C_DIM_FG}│${C_RESET}\n" "$COST_ESTIMATE" $((width - 25)) ""
  printf "${C_DIM_FG}│${C_RESET}   ${C_MUTED}No cache:${C_RESET}    ${C_TEXT}\$%-9s${C_RESET}%*s${C_DIM_FG}│${C_RESET}\n" "$COST_WITHOUT_CACHE" $((width - 25)) ""
  printf "${C_DIM_FG}│${C_RESET}   ${C_MUTED}Savings:${C_RESET}     ${C_SUCCESS}\$%-9s${C_RESET}%*s${C_DIM_FG}│${C_RESET}\n" "$CACHE_SAVINGS" $((width - 25)) ""
  echo -e "${C_DIM_FG}│${C_RESET}$(printf '%*s' $width '')${C_DIM_FG}│${C_RESET}"

  if [ $TOTAL_STORIES -gt 0 ]; then
    echo -e "${C_DIM_FG}├$(printf '%*s' $width '' | tr ' ' '─')┤${C_RESET}"
    printf "${C_DIM_FG}│${C_RESET}   ${C_MUTED}PRD Progress:${C_RESET}  ${C_SUCCESS}%d${C_MUTED}/${C_TEXT}%d${C_RESET} ${C_MUTED}stories${C_RESET}%*s${C_DIM_FG}│${C_RESET}\n" "$COMPLETED_STORIES" "$TOTAL_STORIES" $((width - 30)) ""
    echo -e "${C_DIM_FG}│${C_RESET}$(printf '%*s' $width '')${C_DIM_FG}│${C_RESET}"
  fi

  echo -e "${C_DIM_FG}└$(printf '%*s' $width '' | tr ' ' '─')┘${C_RESET}"
  echo ""
  echo -e "  ${C_SUBTLE}Log saved to: ${C_MUTED}$ACTIVITY_LOG${C_RESET}"
  echo ""

  exit 0
}

trap 'kill $MONITOR_PID 2>/dev/null; cleanup' SIGINT SIGTERM

# ═══════════════════════════════════════════════════════════════════════════
# Main
# ═══════════════════════════════════════════════════════════════════════════

# Initialize
echo "# Ralph Activity Log - $(date)" > "$ACTIVITY_LOG"
echo "# PRD: ${PRD_NAME:-default}" >> "$ACTIVITY_LOG"
echo "---" >> "$ACTIVITY_LOG"

# Load PRD
load_prd

# Calculate layout
# Wider panel: at least 40 chars or 35% of terminal, max 50
LEFT_PANEL_WIDTH=$((TERM_WIDTH * 35 / 100))
[ $LEFT_PANEL_WIDTH -lt 40 ] && LEFT_PANEL_WIDTH=40
[ $LEFT_PANEL_WIDTH -gt 50 ] && LEFT_PANEL_WIDTH=50
MAX_ACTIVITY_LINES=$((TERM_HEIGHT - 10))
[ $MAX_ACTIVITY_LINES -lt 6 ] && MAX_ACTIVITY_LINES=6
[ $MAX_ACTIVITY_LINES -gt 15 ] && MAX_ACTIVITY_LINES=15

# Hide cursor and clear screen
echo -en "$HIDE_CURSOR"
clear

# Initial render
render_dashboard

# Wait for JSONL session file
CURRENT_JSONL=""
while [ -z "$CURRENT_JSONL" ]; do
  CURRENT_JSONL=$(find_latest_jsonl)
  if [ -z "$CURRENT_JSONL" ]; then
    check_session_status
    render_dashboard
    sleep 0.5
  fi
done

SESSION_ID=$(get_session_id_from_jsonl "$CURRENT_JSONL")
SESSION_STATUS="running"
KNOWN_JSONL_FILES+=("$CURRENT_JSONL")
SESSION_COUNT=1
add_activity "START" "Session ${SESSION_ID:0:8}..."
aggregate_all_sessions  # Initial token count

LAST_REFRESH=0
LAST_LINE_COUNT=0

# Background monitor for ralph.log COMPLETE signal
(
  while true; do
    if [ -f "$RALPH_LOG" ] && grep -q "COMPLETE" "$RALPH_LOG" 2>/dev/null; then
      touch "$COMPLETE_FLAG"
      break
    fi
    sleep 1
  done
) &
MONITOR_PID=$!

# Main processing loop - tail the JSONL file
tail -n +1 -F "$CURRENT_JSONL" 2>/dev/null | while true; do
  # Read with timeout for smooth timer updates
  if read -t 1 -r line; then
    # Process the JSONL line
    process_jsonl_line "$line"
  fi

  # Check for new/different JSONL session (note: check_new_sessions() tracks activity)
  NEW_JSONL=$(find_latest_jsonl)
  if [ -n "$NEW_JSONL" ] && [ "$NEW_JSONL" != "$CURRENT_JSONL" ]; then
    CURRENT_JSONL="$NEW_JSONL"
    SESSION_ID=$(get_session_id_from_jsonl "$CURRENT_JSONL")
    SESSION_STATUS="running"
    # Restart tail on new file - break out and re-exec would be complex
    # For now, the new lines from old file are just ignored
  fi

  # Check for completion flag from background monitor
  if [ -f "$COMPLETE_FLAG" ]; then
    SESSION_STATUS="complete"
  fi

  # Refresh data periodically (every 2 seconds)
  NOW=$(date +%s)
  if [ $((NOW - LAST_REFRESH)) -gt 2 ]; then
    refresh_prd
    check_session_status
    check_new_sessions
    aggregate_all_sessions  # Re-aggregate real tokens from all JSONL files
    LAST_REFRESH=$NOW
  fi

  # Check for new teams
  current_teams=$(ls -1 "$CLAUDE_TEAMS_DIR" 2>/dev/null | sort)
  if [ "$current_teams" != "$KNOWN_TEAMS" ]; then
    new_teams=$(comm -13 <(echo "$KNOWN_TEAMS") <(echo "$current_teams"))
    for team in $new_teams; do
      AGENT_COUNT=$((AGENT_COUNT + 1))
      add_activity "team" "New: $team" "agent"
    done
    KNOWN_TEAMS="$current_teams"
  fi

  # Always render (timer updates smoothly even without new log lines)
  render_dashboard

  # Auto-exit on completion
  if [ "$SESSION_STATUS" = "complete" ]; then
    save_state
    sleep 1  # Let user see "Complete" status
    kill $MONITOR_PID 2>/dev/null
    cleanup
  fi
done
