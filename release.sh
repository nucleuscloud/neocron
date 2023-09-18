#!/bin/sh

VERSION="v$(cat package.json | jq -r .version)"
echo Tagging origin/main with: "$VERSION"

git fetch
git tag "$VERSION" origin/main
git push origin --tags
