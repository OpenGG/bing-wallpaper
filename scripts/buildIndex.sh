#!/usr/bin/env bash

cd wallpaper

grep -r -oP ' \[[^]]+\]\(https://[^)]+\)' .|perl -pe 's/.md: .*https:\/\//.md https:\/\//; s/\)$//; s/^.\///'|sort -rn > all.txt
head -n1 all.txt > current.txt

for file in ./*/
do
    cd $file
    grep -r -oP ' \[[^]]+\]\(https://[^)]+\)' .|perl -pe 's/.md: .*https:\/\//.md https:\/\//; s/\)$//; s/^.\///'|sort -rn > all.txt
    head -n1 all.txt > current.txt
    cd -
done
