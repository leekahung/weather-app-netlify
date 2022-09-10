#!/bin/bash

for image in orig/*.jpg
do
   cwebp -q 50 $image -o ${image%.jpg}.webp
done

mv orig/*.webp webp/
