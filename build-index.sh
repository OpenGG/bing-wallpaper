#!/usr/bin/env bash

cd Wallpaper

find . -type f -iname '*.jpg'|sort -rn > all.txt
head -n1 all.txt > current.txt

for file in ./*/
do
    cd $file
    ls *.jpg|sort -rn > all.txt
    head -n1 all.txt > current.txt
    cd -
done
