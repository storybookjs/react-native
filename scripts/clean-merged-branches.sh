#!/bin/sh
#/ Usage: clean-merged-branches [-f]
#/ Delete merged branches from the origin remote.
#/
#/ Options:
#/   -f            Really delete the branches. Without this branches are shown
#/                 but nothing is deleted.
set -e

# show usage maybe
[ "$1" = "--help" ] && {
    grep '^#/' <"$0"| cut -c4-
    exit 0
}

# fetch and prune remote branches
git fetch origin --prune

# grab list of merged branches
branches=$(
  git branch -a --merged origin/master |
  grep remotes/origin/ |
  grep -v origin/master |
  grep -v 'enterprise-.*-release' |
  sed 's@remotes/origin/@@'
)

# bail out with no branches
[ -z "$branches" ] && {
    echo "no merged branches detected" 1>&2
    exit 0
}

[ "$1" != -f ] && {
    echo "These branches will be deleted:" 1>&2
    echo "$branches"
    read -p "Press 'y' if you're sure. " -n 1 -r
    echo    # move to a new line
}

# delete the branches or just show what would be done without -f
if [ "$1" = -f ] || [[ $REPLY =~ ^[Yy]$ ]]; then
    git push origin $(echo "$branches" | sed 's/^ */:/')
fi
