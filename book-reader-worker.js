'use strict';
self.window=self;
importScripts('book-search-corpus.js','book-reader-engine.js');
const indexes=new Map();let topics=[];
self.onmessage=event=>{
  const message=event.data;
  try{
    if(message.type==='configure'){topics=message.topics;return;}
    const start=performance.now();
    if(!indexes.has(message.bookId))indexes.set(message.bookId,new self.BookReaderEngine.BookIndex(self.BOOK_SEARCH_CORPUS.chunks.filter(chunk=>chunk.s===message.bookId),self.BOOK_SEARCH_CORPUS.predictions,topics));
    const index=indexes.get(message.bookId);
    if(message.type==='prepare'){self.postMessage({...message,ready:true,phrases:index.candidates.length,ms:performance.now()-start});return;}
    const items=message.type==='predict'?index.predict(message.query,message.language):index.search(message.query,message.options);
    self.postMessage({type:message.type,bookId:message.bookId,id:message.id,items,ms:performance.now()-start});
  }catch(error){self.postMessage({type:message.type,bookId:message.bookId,id:message.id,error:String(error.message||error)});}
};
