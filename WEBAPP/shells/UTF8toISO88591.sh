#!/bin/bash
cd ../app;
find . -type f -exec recode utf-8..iso-8859-1 '{}' \;
