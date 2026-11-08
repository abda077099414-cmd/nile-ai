require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
app.use(express.json({limit:"2mb"}));
app.use(express.static(path.join(__dirname,"public")));

const RUNWAY_BASE="https://api.dev.runwayml.com/v1";
const RUNWAY_VERSION="2024-11-06";

app.get("/api/config",(req,res)=>res.json({
 videoReady:!!process.env.RUNWAY_API_KEY,
 voiceReady:!!process.env.OPENAI_API_KEY
}));

app.post("/api/video",(req,res)=> {
  if(!process.env.RUNWAY_API_KEY) return res.status(503).json({error:"أضف RUNWAY_API_KEY داخل ملف .env أولاً."});
  const {prompt,duration=5,ratio="720:1280",model="gen4.5"}=req.body||{};
  if(!prompt || !prompt.trim()) return res.status(400).json({error:"اكتب وصف الفيديو."});
  if(![5,10].includes(Number(duration))) return res.status(400).json({error:"اختر مدة 5 أو 10 ثوانٍ."});
  fetch(`${RUNWAY_BASE}/text_to_video`,{
    method:"POST",
    headers:{"Authorization":`Bearer ${process.env.RUNWAY_API_KEY}`,"Content-Type":"application/json","X-Runway-Version":RUNWAY_VERSION},
    body:JSON.stringify({model,promptText:prompt,ratio,duration:Number(duration)})
  }).then(async r=>{
    const data=await r.json();
    if(!r.ok) return res.status(r.status).json({error:data?.error?.message||data?.message||"فشل بدء الفيديو",details:data});
    res.json({taskId:data.id||data.task_id,status:data.status||"PENDING"});
  }).catch(e=>res.status(500).json({error:"تعذر الاتصال بخدمة الفيديو: "+e.message}));
});

app.get("/api/video/:id",async(req,res)=>{
 if(!process.env.RUNWAY_API_KEY) return res.status(503).json({error:"مفتاح Runway غير مضبوط."});
 try{
  const r=await fetch(`${RUNWAY_BASE}/tasks/${encodeURIComponent(req.params.id)}`,{headers:{"Authorization":`Bearer ${process.env.RUNWAY_API_KEY}`,"X-Runway-Version":RUNWAY_VERSION}});
  const d=await r.json();
  if(!r.ok)return res.status(r.status).json({error:d?.error?.message||"تعذر جلب حالة الفيديو",details:d});
  const output=Array.isArray(d.output)?d.output[0]:d.output;
  res.json({status:d.status,videoUrl:typeof output==="string"?output:(output?.url||output?.video_url||null),error:d.failure||d.error||null});
 }catch(e){res.status(500).json({error:e.message});}
});

app.post("/api/voice",async(req,res)=>{
 if(!process.env.OPENAI_API_KEY)return res.status(503).json({error:"أضف OPENAI_API_KEY داخل ملف .env أولاً."});
 const {text,voice="onyx",instructions="Speak Arabic clearly, naturally, and warmly."}=req.body||{};
 if(!text||!text.trim())return res.status(400).json({error:"اكتب النص المراد تحويله إلى صوت."});
 try{
  const r=await fetch("https://api.openai.com/v1/audio/speech",{method:"POST",headers:{"Authorization":`Bearer ${process.env.OPENAI_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({model:"gpt-4o-mini-tts",voice,input:text,instructions,response_format:"mp3"})});
  if(!r.ok){const e=await r.json().catch(()=>({}));return res.status(r.status).json({error:e?.error?.message||"فشل إنشاء الصوت"});}
  res.setHeader("Content-Type","audio/mpeg");res.setHeader("Content-Disposition",'inline; filename="nile-voice.mp3"');r.body.pipeTo(new WritableStream({write(chunk){res.write(Buffer.from(chunk));},close(){res.end();},abort(){res.end();}}));
 }catch(e){res.status(500).json({error:e.message});}
});

app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
const port=process.env.PORT||3000;
app.listen(port,()=>console.log(`Nile AI running at http://localhost:${port}`));
