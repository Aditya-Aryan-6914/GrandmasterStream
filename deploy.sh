#!/bin/bash

# Build the project
echo "Building project..."
npm run build

# Navigate to dist directory
cd dist

# Initialize a new git repository
git init
git add -A
git commit -m 'deploy'

# Push to gh-pages branch
echo "Deploying to gh-pages..."
git push -f https://github.com/Aditya-Aryan-6914/GrandmasterStream.git main:gh-pages

cd -
echo "Deployment complete!"
