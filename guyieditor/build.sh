#! /bin/bash

echo "Guyi script starting..."
echo "Building web app"
npm run build

echo "Web app built"
echo "copying build files to server"
cp -r ./build/* ../guyiserver/guyi
echo "moving to build server dir"

cd ../guyiserver
echo "packaging server for windows and linux"
pwd
pkg .

echo "completed successfully"

