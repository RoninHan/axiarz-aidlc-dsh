#!/bin/sh
# AI-DLC skill (DeepSeek Harness port) - one-line installer.
# On any machine run:
#   curl -fsSL https://raw.githubusercontent.com/RoninHan/axiarz-aidlc-dsh/main/install.sh | sh
set -eu

REPO="RoninHan/axiarz-aidlc-dsh"
VERSION="main"               # a branch name or a tag

SKILL_DEST="${DSH_HOME:-$HOME/.dsh}/skills/aidlc"
BIN_DIR="${AIDLC_BIN_DIR:-$HOME/.local/bin}"

command -v curl >/dev/null 2>&1 || { echo "Error: curl is required." >&2; exit 1; }
command -v tar  >/dev/null 2>&1 || { echo "Error: tar is required."  >&2; exit 1; }

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "Downloading AI-DLC skill from $REPO@$VERSION ..."
curl -fsSL "https://github.com/$REPO/archive/$VERSION.tar.gz" -o "$TMP/repo.tgz"
tar -xzf "$TMP/repo.tgz" -C "$TMP"
ROOT="$(find "$TMP" -mindepth 1 -maxdepth 1 -type d | head -n 1)"

mkdir -p "$(dirname "$SKILL_DEST")"
rm -rf "$SKILL_DEST"
cp -R "$ROOT/skills/aidlc" "$SKILL_DEST"

mkdir -p "$BIN_DIR"
cp "$ROOT/dsh-aidlc" "$BIN_DIR/dsh-aidlc"
chmod +x "$BIN_DIR/dsh-aidlc"

echo "Installed skill     -> $SKILL_DEST"
echo "Installed dsh-aidlc -> $BIN_DIR/dsh-aidlc"
echo 'Done. Start a new DSH session (or refresh) and "aidlc" will appear in the skill catalog.'
