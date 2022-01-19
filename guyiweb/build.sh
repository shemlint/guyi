#! /bin/bash

echo "Starting guyi web build, gulp and copy to runners"
echo "Build guyiweb"
npm run build

echo "Running gulp, will install gulp if not installed"
npx gulp --yes

cp ./build1/index.html ./build1/guyi.html
echo "copying build to guyi desktop runners"

cp ./build1/guyi.html ../guyidesk/guyi.html
echo "copying build to guyi phone runners"
cp ./build1/guyi.html ../guyiphone/guyiandroid/app/src/main/assets/guyi.html
cp ./build1/guyi.html /media/teddy/DATA/PROJECTS/AndroidProjs/GuyiAndroid/app/src/main/assets

echo "building android "

# cd /media/teddy/DATA/PROJECTS/AndroidProjs/GuyiAndroid
# ./gradlew assembleDebug

echo "Completed successfully "

