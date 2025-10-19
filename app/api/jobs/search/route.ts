import { NextRequest, NextResponse } from 'next/server'; import { Store } from '@/lib/store';
export async function GET(req:NextRequest){ const {searchParams}=new URL(req.url); const q=(searchParams.get('q')||'').toLowerCase().trim();
  const useExternal=process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY;
  if(useExternal){ try{ const appId=process.env.ADZUNA_APP_ID!; const appKey=process.env.ADZUNA_APP_KEY!; const url=`https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=100&what=${encodeURIComponent(q)}`;
      const r=await fetch(url,{cache:'no-store'}); if(r.ok){ const data=await r.json(); const mapped=(data.results||[]).map((x:any,idx:number)=>({
        id:String(x.id||idx), title:x.title||'Job', company:x.company?.display_name||'Company', location:x.location?.display_name||'Remote/Onsite',
        type:x.contract_type||'N/A', tags:(x.category?.label?[x.category.label]:[]), description:x.description||'', salary:x.salary_max?`$${Math.round(x.salary_min||0)}–$${Math.round(x.salary_max)}`:'—', postedAt:x.created?x.created.slice(0,10):'—'
      })); return NextResponse.json(mapped); } }catch(e){} }
  const all=Store.getJobs(); const filtered=q? all.filter(j=>(j.title+' '+j.company+' '+j.description+' '+j.tags.join(' ')).toLowerCase().includes(q)) : all; return NextResponse.json(filtered); }
