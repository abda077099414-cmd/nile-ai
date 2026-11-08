# النيلي AI — مشروع جاهز للنشر

## الوظائف
- توليد فيديو من النص عبر Runway API.
- مراقبة المهمة وعرض الفيديو بعد اكتماله.
- توليد صوت عربي MP3 عبر OpenAI TTS.
- واجهة عربية RTL متجاوبة.

## قبل النشر
يلزم حساب ومفاتيح API من مزودي الخدمات. تكاليف الفيديو والصوت حسب استخدامك، ولا يوجد توليد غير محدود مجاني.

## نشر بنقرة إعداد (Render Blueprint)
1. ارفع محتويات هذا المجلد إلى مستودع GitHub خاص أو عام.
2. افتح Render واختر **New → Blueprint** ثم اربط مستودع GitHub.
3. Render يقرأ `render.yaml` ويجهز الخدمة.
4. في إعدادات الخدمة أضف قيم `RUNWAY_API_KEY` و`OPENAI_API_KEY` الحقيقية.
5. انتظر اكتمال النشر، وافتح رابط `onrender.com` الذي يظهر لك.

## رفع المشروع إلى GitHub من الكمبيوتر
```bash
git init
git add .
git commit -m "Nile AI initial release"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/nile-ai.git
git push -u origin main
```
استبدل `YOUR-USERNAME` واسم المستودع بما أنشأته.

## تشغيل محلي
```bash
npm install
cp .env.example .env
# عدّل .env وضع مفاتيح API
npm start
```
افتح `http://localhost:3000`.

## حماية المفاتيح
- لا تضع مفاتيح API داخل `public/index.html`.
- لا ترسل ملف `.env` أو ترفعه إلى GitHub.
- ضع المفاتيح في Environment Variables في Render فقط.

## ملاحظات
- هذه حزمة مشروع جاهزة للنشر، لكن لا يمكن إنشاء رابط عام أو إدخال مفاتيح حسابك من داخل هذه المحادثة. يلزم تنفيذ خطوات ربط حساب GitHub/Render وإضافة مفاتيح الخدمات.
- قد تتغير واجهات مزودي API أو قيودهم؛ تحقق من حساب Runway/OpenAI قبل الاستخدام.
