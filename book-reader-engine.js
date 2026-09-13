(function(root){
  'use strict';
  const normalize=value=>String(value||'').normalize('NFKD').replace(/[\u064b-\u065f\u0670\u06d6-\u06ed\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ؤ/g,'و').replace(/ئ/g,'ي').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').replace(/\s+/g,' ').trim();
  const words=value=>normalize(value).split(' ').filter(Boolean);
  const stop=new Set(('a an the and or of in on to for from at by as is are be been being was were it its this that these those with without shall should may can must will would could have has had not no such any all each other than then also both more most less about into through during between before after under over up out their there they them we our you your which what when where why how who does do did use used using including include includes following based accordance example figure table page copyright international recommended practice inc author chapter section contents acknowledgement acknowledgments www org com years year project projects يتم تم في من على الي عن او ان اذا فان كما كل هذا هذه ذلك تلك التي الذي هو هي ما لا قد مع عند حتى بين خلال بعد قبل يجب يمكن انه حيث و أو إن إلى الا علي به له لها بها اي دون وفق طبقا حسب وقد تكون يكون ضمن وكذلك لكي وما كما فيه فيها').split(' '));
  const escapeReg=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const hasPhrase=(body,phrase)=>(' '+body+' ').includes(' '+phrase+' ');
  const editOne=(a,b)=>{
    if(Math.abs(a.length-b.length)>1)return false;
    let i=0,j=0,errors=0;
    while(i<a.length&&j<b.length){if(a[i]===b[j]){i++;j++;continue;}if(++errors>1)return false;if(a.length>=b.length)i++;if(b.length>=a.length)j++;}
    return errors+(i<a.length||j<b.length?1:0)<=1;
  };
  class Trie{
    constructor(){this.root={next:new Map(),ids:new Set()};}
    add(text,id){let node=this.root;for(const char of text){if(!node.next.has(char))node.next.set(char,{next:new Map(),ids:new Set()});node=node.next.get(char);node.ids.add(id);}}
    find(prefix){let node=this.root;for(const char of prefix){node=node.next.get(char);if(!node)return [];}return [...node.ids];}
  }
  class BookIndex{
    constructor(chunks,predictions,topics){
      this.chunks=chunks;this.topics=topics;this.postings=new Map();this.candidates=[];this.trie=new Trie();
      this.documents=chunks.map((chunk,id)=>{
        const body=normalize(chunk.t);const tokens=words(chunk.t);const tf=new Map();
        tokens.forEach(token=>tf.set(token,(tf.get(token)||0)+1));
        tf.forEach((count,token)=>{if(!this.postings.has(token))this.postings.set(token,new Map());this.postings.get(token).set(id,count);});
        return {body,tokens,tf,length:tokens.length};
      });
      this.averageLength=this.documents.reduce((sum,doc)=>sum+doc.length,0)/Math.max(chunks.length,1);
      const phraseMap=new Map();
      const add=(phrase,docId)=>{if(!phraseMap.has(phrase))phraseMap.set(phrase,{count:0,docs:new Set()});const item=phraseMap.get(phrase);item.count++;item.docs.add(docId);};
      this.documents.forEach((doc,id)=>{
        // Learn 1-4 word phrases from contiguous words on the same text line.
        chunks[id].t.split(/[\n.!?;:؟؛]+/).forEach(line=>{
          const tokens=words(line);
          for(let start=0;start<tokens.length;start++){
            const first=tokens[start];if(first.length<4||stop.has(first)||/\d/.test(first))continue;
            for(let size=1;size<=4&&start+size<=tokens.length;size++){
              const slice=tokens.slice(start,start+size),last=slice[slice.length-1];
              if(last.length<3||stop.has(last)||slice.some(token=>/\d/.test(token)))continue;
              if(slice.filter(token=>stop.has(token)).length>1)continue;
              add(slice.join(' '),id);
            }
          }
        });
      });
      const used=new Set();
      const store=candidate=>{
        const key=normalize(candidate.label.en);if(used.has(key))return;used.add(key);
        const id=this.candidates.length;this.candidates.push(candidate);
        const aliases=new Set([candidate.label.en,candidate.label.ar,...candidate.aliases].map(normalize));
        aliases.forEach(alias=>{const tokens=alias.split(' ');tokens.forEach((_,i)=>this.trie.add(tokens.slice(i).join(' '),id));});
      };
      predictions.forEach(prediction=>{
        const aliases=[...new Set([prediction.label.en,prediction.label.ar,...prediction.aliases].map(normalize))];
        const docs=new Set();let count=0;
        this.documents.forEach((doc,id)=>{let hits=0;aliases.forEach(alias=>{if(!alias)return;const re=new RegExp('(?:^| )'+escapeReg(alias)+'(?= |$)','g');hits+=Array.from(doc.body.matchAll(re)).length;});if(hits){docs.add(id);count+=hits;}});
        if(docs.size)store({label:prediction.label,aliases:prediction.aliases,terms:aliases,topicId:prediction.topicId,docs:[...docs],count,kind:'concept'});
      });
      const learned=[...phraseMap.entries()].filter(([phrase,item])=>item.count>=2||phrase.split(' ').length===1)
        .sort((a,b)=>(b[1].count*Math.min(b[0].split(' ').length,3))-(a[1].count*Math.min(a[0].split(' ').length,3))).slice(0,6500);
      learned.forEach(([phrase,item])=>store({label:{en:phrase,ar:phrase},aliases:[],terms:[phrase],docs:[...item.docs],count:item.count,kind:'phrase'}));
      this.topicEvidence=new Map(topics.map(topic=>[topic.id,this.documents.map((doc,id)=>topic.terms.some(term=>hasPhrase(doc.body,normalize(term)))?id:-1).filter(id=>id>=0)]));
    }
    predict(query,language='en'){
      const q=normalize(query);if(!q)return [];
      let candidateIds=this.trie.find(q),correction=false;
      if(!candidateIds.length&&q.length>=4&&!q.includes(' ')){
        this.postings.forEach((_,term)=>{if(term.length>=4&&editOne(q,term)){candidateIds.push(...this.trie.find(term));}});correction=candidateIds.length>0;
      }
      const items=[...new Set(candidateIds)].map(id=>{
        const c=this.candidates[id];const label=c.label[language]||c.label.en;
        const forms=[label,...c.aliases,c.label.en,c.label.ar].map(normalize);
        const starts=forms.some(form=>form.startsWith(q));const exact=forms.includes(q);
        const score=(exact?140:starts?90:64)+Math.log1p(c.count)*7+Math.min(c.docs.length,20)*.6+(c.kind==='concept'?14:0);
        return {id,label,kind:correction?'correction':c.kind,count:c.count,pages:new Set(c.docs.map(id=>this.chunks[id].p)).size,score,topicId:c.topicId};
      }).sort((a,b)=>b.score-a.score||a.label.length-b.label.length).slice(0,9);
      // Related subjects only for a completed broad concept, never for a longer partial phrase.
      if(!q.includes(' ')){
        this.topics.forEach(topic=>{
          if(!topic.roots.some(root=>normalize(root)===q))return;
          const docs=this.topicEvidence.get(topic.id)||[];if(!docs.length)return;
          const label=topic.label[language]||topic.label.en;
          if(!items.some(item=>normalize(item.label)===normalize(label)))items.push({id:'topic:'+topic.id,label,kind:'related',count:docs.length,pages:new Set(docs.map(id=>this.chunks[id].p)).size,score:50,topicId:topic.id});
        });
      }
      return items.slice(0,15);
    }
    search(query,{candidateId=null,related=true}={}){
      const q=normalize(query);if(!q)return [];
      const quoted=/^\s*["“].+["”]\s*$/.test(query);
      const raw=words(q).filter(term=>!stop.has(term));
      const terms=raw.length?raw:words(q);
      let selected=null,selectedTopic=null;
      if(typeof candidateId==='number')selected=this.candidates[candidateId];
      if(typeof candidateId==='string'&&candidateId.startsWith('topic:'))selectedTopic=this.topics.find(topic=>topic.id===candidateId.slice(6));
      const semanticTerms=selected?selected.terms:selectedTopic?selectedTopic.terms.map(normalize):[];
      if(related&&!quoted&&!semanticTerms.length){
        const exactConcept=this.candidates.find(c=>c.kind==='concept'&&[c.label.en,c.label.ar,...c.aliases].some(alias=>normalize(alias)===q));
        if(exactConcept)semanticTerms.push(...exactConcept.terms);
        this.topics.forEach(topic=>{if(topic.roots.some(root=>normalize(root)===q))semanticTerms.push(...topic.terms.map(normalize));});
      }
      const result=[];const n=this.documents.length;
      this.documents.forEach((doc,id)=>{
        const exact=hasPhrase(doc.body,q);
        let hits=0,score=0;
        terms.forEach(term=>{
          const tf=doc.tf.get(term)||0;if(!tf)return;hits++;
          const df=this.postings.get(term)?.size||0;
          const idf=Math.log(1+(n-df+.5)/(df+.5));
          score+=idf*((tf*2.2)/(tf+1.2*(.25+.75*doc.length/this.averageLength)));
        });
        const relatedHits=related&&!quoted?semanticTerms.filter(term=>hasPhrase(doc.body,term)):[];
        if(quoted&&!exact)return;
        if(!exact&&hits<terms.length&&!relatedHits.length)return;
        if(exact)score+=25;
        if(hits===terms.length)score+=12;
        score+=Math.min(relatedHits.length,5)*2;
        if(this.chunks[id].p<=2&&/copyright|acknowledg/i.test(this.chunks[id].t))score-=12;
        result.push({id,page:this.chunks[id].p,text:this.chunks[id].t,mode:this.chunks[id].m,score,match:exact?'exact':hits===terms.length?'words':'related',terms:[q,...terms,...relatedHits],topics:this.chunks[id].u});
      });
      return result.sort((a,b)=>b.score-a.score||a.page-b.page);
    }
  }
  root.BookReaderEngine={BookIndex,normalize};
  if(typeof module!=='undefined')module.exports=root.BookReaderEngine;
})(typeof self!=='undefined'?self:globalThis);
