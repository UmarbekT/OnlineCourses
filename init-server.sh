#!/bin/bash

set -e # Har qanday xatolikda to‘xtasin

PROJECT_DIR="/var/www/saftoWeb/to-do"

APP_NAME="todo-app"

TARGET_BRANCH="imtihon"

echo "📁 [1] Loyihaga kirilmoqda: $PROJECT_DIR"

cd "$PROJECT_DIR" || { echo "❌ Loyihani topib bo‘lmadi"; exit 1; }

echo "🔄 [2] Git fetch qilinmoqda..."

git fetch origin

# Agar branch mavjud bo‘lmasa, yaratiladi

if git show-ref --verify --quiet refs/heads/$TARGET_BRANCH; then

 echo "✅ [$TARGET_BRANCH] branch allaqachon mavjud"

else

 echo "🆕 [$TARGET_BRANCH] branch yaratilmoqda..."

 git checkout -b $TARGET_BRANCH origin/main

fi

echo "🔀 [3] [$TARGET_BRANCH] branchga o'tish..."

git checkout $TARGET_BRANCH

echo "🔁 [4] main branch bilan sinxronlash..."

git merge origin/main --no-edit || {

 echo "❌ Merge xatolik berdi. Qo‘lda tekshiring.";

 exit 1;

}

echo "📦 [5] npm install bajarilmoqda..."

npm install

echo "🏗️ [6] Build qilinmoqda..."

npm run build || echo "⚠️ build skript topilmadi — o'tkazib yuborildi"

echo "🔁 [7] PM2 orqali ilova qayta ishga tushirilmoqda: $APP_NAME"

pm2 restart $APP_NAME || {

 echo "❌ pm2 restart ishlamadi. Iltimos, '$APP_NAME' nomini tekshiring.";

 exit 1;

}

echo "✅ BARCHASI MUVAFFAQIYATLI BAJARILDI. [$TARGET_BRANCH] branch yangilandi va ilova ishga tushdi."