#!/usr/bin/env bash

cd Wallpaper

for file in ./*/
do
    cd $file
    ls *.jpg > all.txt
    cat all.txt|sort -rn|head -n1 > current.txt
    cd -
done