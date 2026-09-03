require("dotenv").config();
const express=require("express"), cors=require("cors"), crypto=require("crypto");
const app=express(); app.use(cors()); app.use(express.json()); app.use(express.static("public"));
const consents=[
 {id:"c_001",app:"Fintech Labs",scope:"Credit profile",access:"Read only",status:"active"},
 {id:"c_002",app:"HealthSync",scope:"Wellness data",access:"30 days",status:"active"},
 {id:"c_003",app:"Market Research Co.",scope:"Preferences",access:"Anonymized",status:"expiring"}
];
const events=[
 {actor:"Fintech Labs",action:"accessed credit profile",time:"2m ago"},
 {actor:"StarVault",action:"encrypted new document",time:"18m ago"},
 {actor:"HealthSync",action:"consent renewed",time:"3h ago"},
 {actor:"You",action:"revoked Analytics access",time:"Yesterday"}
];
app.get("/api/health",(req,res)=>res.json({ok:true,service:"StarVault",version:"2.0"}));
app.get("/api/vault",(req,res)=>res.json({
 health:100,assets:24,categories:6,encrypted:true,
 categories:[
  {name:"Identity",assets:7,coverage:88},
  {name:"Preferences",assets:5,coverage:64},
  {name:"Activity",assets:9,coverage:76},
  {name:"Documents",assets:3,coverage:42}
 ]}));
app.get("/api/consents",(req,res)=>res.json(consents));
app.post("/api/consents/:id/revoke",(req,res)=>{
 const c=consents.find(x=>x.id===req.params.id);
 if(!c)return res.status(404).json({error:"Consent not found"});
 c.status="revoked"; events.unshift({actor:c.app,action:"access revoked by user",time:"just now"});
 res.json(c);
});
app.get("/api/audit",(req,res)=>res.json(events));
app.post("/api/identity/claims",(req,res)=>{
 const payload={id:"sv:"+crypto.randomBytes(6).toString("hex").toUpperCase(),verified:true,claims:["name","age_range","country","email_verified"]};
 res.json(payload);
});
app.listen(process.env.PORT||3000,()=>console.log("StarVault V2 running"));
