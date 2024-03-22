#!/bin/bash

git checkout -b gh-deploy
quire build
touch _site/.nojekyll
git add -f _site && git commit -m "Github pages deploy at `date`"
git push origin --delete gh-pages
git subtree push --prefix _site origin gh-pages
git checkout main && git branch -D gh-deploy