#!/usr/bin/env bash

perl -i -0pe 's/(# Latest wallpapers)[\s\S]*/$1\n\n/m' README.md

cd wallpaper

head -n 10 all.txt|cut -d ' ' -f 1|xargs cat |sed 's/^#/##/' >> ../README.md

cd -

mkdir -p archive

cat ./wallpaper/all.txt | cut -d ' ' -f 1|perl -pe 's/(\d{4})\/(\d{2}).*/$1-$2/'|sort -rn|uniq|tr '-' '\n'|xargs -n2 sh -c 'mkdir -p "./archive/$0"; echo "# $0-$1" > "./archive/$0/$1.md"; echo "" >> "./archive/$0/$1.md"'
cat ./wallpaper/all.txt | cut -d ' ' -f 1|perl -pe 'print $_; s/(\d{4})\/(\d{2}).*/$1-$2/'|tr '-' '\n'|xargs -n3 sh -c 'cat "./wallpaper/$0"|sed "s/^#/##/" >> "./archive/$1/$2.md"'

echo "# Archives" >> README.md
echo "" >> README.md

find ./archive/ -iname '*.md'|sort -rn|perl -pe 'print $_; s/.*(\d{4})\/(\d{2}).*/$1-$2/'|xargs -n2 sh -c 'echo "[$1]($0)" >> README.md; echo "" >> README.md'

