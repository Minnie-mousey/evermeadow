import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Sprout, BookOpen, PawPrint, NotebookPen, Search, Settings, ChevronDown,
  ChevronLeft, ChevronRight, Bookmark, Highlighter, Timer, Sparkles, Flower2,
  CalendarDays, Heart, Leaf, CircleHelp, Send, Check, Plus, X, Menu, Volume2,
  CloudSun, Egg, Star, LockKeyhole, BookMarked, RotateCcw
} from 'lucide-react';
import './styles.css';

const BOOKS = [
  {name:'Genesis',chapters:50},{name:'Exodus',chapters:40},{name:'Leviticus',chapters:27},{name:'Numbers',chapters:36},{name:'Deuteronomy',chapters:34},
  {name:'Joshua',chapters:24},{name:'Judges',chapters:21},{name:'Ruth',chapters:4},{name:'1 Samuel',chapters:31},{name:'2 Samuel',chapters:24},
  {name:'1 Kings',chapters:22},{name:'2 Kings',chapters:25},{name:'Psalms',chapters:150},{name:'Proverbs',chapters:31},{name:'Ecclesiastes',chapters:12},
  {name:'Isaiah',chapters:66},{name:'Jeremiah',chapters:52},{name:'Daniel',chapters:12},{name:'Matthew',chapters:28},{name:'Mark',chapters:16},
  {name:'Luke',chapters:24},{name:'John',chapters:21},{name:'Acts',chapters:28},{name:'Romans',chapters:16},{name:'1 Corinthians',chapters:16},
  {name:'2 Corinthians',chapters:13},{name:'Galatians',chapters:6},{name:'Ephesians',chapters:6},{name:'Philippians',chapters:4},{name:'Revelation',chapters:22}
];
const LS = {
  get(key, fallback) { try { const v=localStorage.getItem('evermeadow:'+key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
  set(key, value) { try { localStorage.setItem('evermeadow:'+key, JSON.stringify(value)); } catch {} }
};
const animals = [
  {id:'lamb',name:'Daisy',kind:'Lamb',emoji:'🐑',colour:'cream',accessories:['Flower crown','Pink bow','Tiny scarf'],stages:['Little Lamb','Meadow Sheep','Cloud Shepherd'],unlock:0},
  {id:'kitten',name:'Mittens',kind:'Kitten',emoji:'🐱',colour:'pink',accessories:['Bell collar','Ribbon','Butterfly clip'],stages:['Tiny Kitten','Garden Cat','Moonlit Cat'],unlock:0},
  {id:'puppy',name:'Biscuit',kind:'Puppy',emoji:'🐶',colour:'gold',accessories:['Bandana','Daisy pin','Straw hat'],stages:['Puppy','Farm Dog','Golden Guardian'],unlock:0},
  {id:'duckling',name:'Puddle',kind:'Duckling',emoji:'🐥',colour:'yellow',accessories:['Blue bow','Rain hat','Little boots'],stages:['Duckling','Pond Duck','Meadow Swan'],unlock:60},
  {id:'calf',name:'Clover',kind:'Calf',emoji:'🐮',colour:'sage',accessories:['Bell','Flower garland','Kerchief'],stages:['Little Calf','Dairy Cow','Meadow Belle'],unlock:120},
  {id:'bunny',name:'Thimble',kind:'Bunny',emoji:'🐰',colour:'lavender',accessories:['Carrot pin','Flower crown','Cape'],stages:['Bunny Kit','Clover Bunny','Forest Hopper'],unlock:180},
  {id:'piglet',name:'Peaches',kind:'Piglet',emoji:'🐷',colour:'pink',accessories:['Straw hat','Heart glasses','Scarf'],stages:['Piglet','Orchard Pig','Rosy Guardian'],unlock:240},
  {id:'chick',name:'Sunny',kind:'Chick',emoji:'🐣',colour:'yellow',accessories:['Tiny crown','Blue ribbon','Daisy'],stages:['Hatchling','Little Hen','Sunrise Keeper'],unlock:300}
];
const samplePassage = {
  'John-1': [
    'In the beginning was the Word, and the Word was with God, and the Word was God.',
    'The same was in the beginning with God.',
    'All things were made by him; and without him was not any thing made that was made.',
    'In him was life; and the life was the light of men.',
    'And the light shineth in darkness; and the darkness comprehended it not.',
    'There was a man sent from God, whose name was John.',
    'The same came for a witness, to bear witness of the Light, that all men through him might believe.',
    'He was not that Light, but was sent to bear witness of that Light.',
    'That was the true Light, which lighteth every man that cometh into the world.',
    'He was in the world, and the world was made by him, and the world knew him not.'
  ],
  'Psalm-23': [
    'The LORD is my shepherd; I shall not want.',
    'He maketh me to lie down in green pastures: he leadeth me beside the still waters.',
    'He restoreth my soul: he leadeth me in the paths of righteousness for his name’s sake.',
    'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.',
    'Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.',
    'Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.'
  ],
  'Philippians-4': [
    'Therefore, my brethren dearly beloved and longed for, my joy and crown, so stand fast in the Lord, my dearly beloved.',
    'I beseech Euodias, and beseech Syntyche, that they be of the same mind in the Lord.',
    'And I intreat thee also, true yokefellow, help those women which laboured with me in the gospel, with Clement also, and with other my fellowlabourers, whose names are in the book of life.',
    'Rejoice in the Lord alway: and again I say, Rejoice.',
    'Let your moderation be known unto all men. The Lord is at hand.',
    'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.',
    'And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.'
  ]
};
const fallbackVerses = [
  'The LORD is my shepherd; I shall not want.',
  'Trust in the LORD with all thine heart; and lean not unto thine own understanding.',
  'For we walk by faith, not by sight.',
  'Be still, and know that I am God.',
  'I can do all things through Christ which strengtheneth me.',
  'Let all your things be done with charity.'
];

function getVerseText(book, chapter, verse) {
  const key = `${book}-${chapter}`;
  const sample = samplePassage[key];
  if (sample?.[verse-1]) return sample[verse-1];
  return null;
}
function PetArt({pet,stage=0,accessory='',large=false}) {
  return <div className={`pet-art pet-${pet.colour} ${large?'pet-large':''}`} aria-label={`${pet.kind} companion`}>
    <span className="pet-sparkle sparkle-one">✦</span><span className="pet-sparkle sparkle-two">✧</span>
    <span className="pet-emoji">{stage===0?pet.emoji:stage===1?({lamb:'🐏',kitten:'🐈',puppy:'🐕',duckling:'🦆',calf:'🐄',bunny:'🐇',piglet:'🐖',chick:'🐔'}[pet.id]||pet.emoji):({lamb:'🐑',kitten:'🐈‍⬛',puppy:'🐕‍🦺',duckling:'🦢',calf:'🐄',bunny:'🐇',piglet:'🐷',chick:'🐓'}[pet.id]||pet.emoji)}</span>
    {accessory && <span className="pet-accessory">{({'Flower crown':'🌼','Pink bow':'🎀','Tiny scarf':'🧣','Bell collar':'🔔','Ribbon':'🎀','Butterfly clip':'🦋','Bandana':'🧣','Daisy pin':'🌼','Straw hat':'👒','Blue bow':'🎀','Rain hat':'🌧️','Little boots':'🥾','Bell':'🔔','Flower garland':'🌸','Kerchief':'🧣','Carrot pin':'🥕','Cape':'🦸','Heart glasses':'🕶️','Tiny crown':'👑','Blue ribbon':'🎀','Daisy':'🌼'})[accessory]||'🌼'}</span>}
    <span className="pet-ground"></span>
  </div>;
}
function App() {
  const [page,setPage]=useState('Home');
  const [mobileNav,setMobileNav]=useState(false);
  const [profile,setProfile]=useState(()=>LS.get('profile',{name:'Friend',goal:15}));
  const [studySeconds,setStudySeconds]=useState(0);
  const [timerRunning,setTimerRunning]=useState(false);
  const [book,setBook]=useState('John');
  const [chapter,setChapter]=useState(1);
  const [verse,setVerse]=useState(1);
  const [readerSearch,setReaderSearch]=useState('');
  const [globalSearch,setGlobalSearch]=useState('');
  const [scripture,setScripture]=useState(null);
  const [scriptureError,setScriptureError]=useState('');
  const [loadingScripture,setLoadingScripture]=useState(false);
  const [notes,setNotes]=useState(()=>LS.get('notes',{}));
  const [bookmarks,setBookmarks]=useState(()=>LS.get('bookmarks',[]));
  const [highlights,setHighlights]=useState(()=>LS.get('highlights',{}));
  const [journal,setJournal]=useState(()=>LS.get('journal',[]));
  const [journalDraft,setJournalDraft]=useState('');
  const [activePetId,setActivePetId]=useState(()=>LS.get('activePetId','lamb'));
  const [petData,setPetData]=useState(()=>LS.get('petData',{}));
  const [accessories,setAccessories]=useState(()=>LS.get('accessories',{}));
  const [assistantQuestion,setAssistantQuestion]=useState('');
  const [assistantAnswer,setAssistantAnswer]=useState('');
  const [assistantLoading,setAssistantLoading]=useState(false);
  const [assistantMode,setAssistantMode]=useState('explain');
  const [planDone,setPlanDone]=useState(()=>LS.get('planDone',{}));
  const [dailySeconds,setDailySeconds]=useState(()=>LS.get('dailySeconds',0));
  const [toast,setToast]=useState('');
  const [settingsOpen,setSettingsOpen]=useState(false);
  const [readingVersion,setReadingVersion]=useState('KJV');

  const activePet=animals.find(p=>p.id===activePetId)||animals[0];
  const activeData=petData[activePetId]||{xp:0,level:1};
  const stage=activeData.level>=3?2:activeData.level>=2?1:0;
  const currentRef=`${book} ${chapter}:${verse}`;
  const currentText=getVerseText(book,chapter,verse) || scripture?.verses?.find(v=>Number(v.verse)===verse)?.text || '';
  const todayGoal=profile.goal*60;
  const progress=Math.min(100,Math.round(dailySeconds/Math.max(1,todayGoal)*100));
  const totalMinutes=Math.floor(dailySeconds/60);
  const totalXP=Object.values(petData).reduce((s,p)=>s+(p.xp||0),0);
  const unlockedAnimals=animals.filter(a=>totalXP>=a.unlock);
  const savedCount=bookmarks.length+Object.keys(notes).length;

  useEffect(()=>{ LS.set('profile',profile); },[profile]);
  useEffect(()=>{ LS.set('notes',notes); },[notes]);
  useEffect(()=>{ LS.set('bookmarks',bookmarks); },[bookmarks]);
  useEffect(()=>{ LS.set('highlights',highlights); },[highlights]);
  useEffect(()=>{ LS.set('journal',journal); },[journal]);
  useEffect(()=>{ LS.set('activePetId',activePetId); },[activePetId]);
  useEffect(()=>{ LS.set('petData',petData); },[petData]);
  useEffect(()=>{ LS.set('accessories',accessories); },[accessories]);
  useEffect(()=>{ LS.set('dailySeconds',dailySeconds); },[dailySeconds]);
  useEffect(()=>{ LS.set('planDone',planDone); },[planDone]);

  useEffect(()=>{
    if(!timerRunning)return;
    const id=setInterval(()=>{
      setStudySeconds(s=>{
        const next=s+1;
        if(next%60===0){
          setDailySeconds(d=>d+60);
          setPetData(old=>{
            const p=old[activePetId]||{xp:0,level:1};
            const xp=p.xp+1;
            return {...old,[activePetId]:{xp,level:Math.min(3,1+Math.floor(xp/60))}};
          });
        }
        return next;
      });
    },1000);
    return ()=>clearInterval(id);
  },[timerRunning,activePetId]);

  useEffect(()=>{
    if(page==='Reader') loadPassage(book,chapter);
  },[page,book,chapter,readingVersion]);

  async function loadPassage(b,c) {
    setLoadingScripture(true); setScriptureError('');
    try {
      // Public getBible API. Keep this integration replaceable; validate service terms before launch.
      const res=await fetch(`https://api.getbible.net/v2/kjv/${encodeURIComponent(b.toLowerCase())}/${c}.json`);
      if(!res.ok) throw new Error('The public Bible service did not return this chapter.');
      const data=await res.json();
      const verses=Array.isArray(data)?data:(data.verses||data.chapter?.verses||[]);
      if(!verses.length) throw new Error('No verses were returned for this chapter.');
      setScripture({verses});
    } catch(e) {
      setScripture(null);
      setScriptureError('Could not load this chapter from the public KJV service. Check your connection, or use the sample passages available in John 1, Psalm 23, and Philippians 4.');
    } finally {setLoadingScripture(false);}
  }
  function notify(msg){setToast(msg);setTimeout(()=>setToast(''),2400);}
  function changePage(p){setPage(p);setMobileNav(false);if(p==='Reader')loadPassage(book,chapter);}
  function changeBook(b){setBook(b);setChapter(1);setVerse(1);}
  function toggleBookmark(ref){
    setBookmarks(old=>old.includes(ref)?old.filter(x=>x!==ref):[...old,ref]);
    notify(bookmarks.includes(ref)?'Bookmark removed':'Passage bookmarked');
  }
  function toggleHighlight(ref){
    setHighlights(old=>{const next={...old};if(next[ref])delete next[ref];else next[ref]='butter';return next;});
  }
  function saveNote(ref,text){setNotes(old=>({...old,[ref]:text}));notify('Study note saved');}
  function addJournal(){
    if(!journalDraft.trim())return;
    setJournal(old=>[{id:Date.now(),text:journalDraft.trim(),date:new Date().toLocaleDateString(),ref:page==='Reader'?currentRef:'Personal reflection'},...old]);
    setJournalDraft('');notify('Reflection added to your journal');
  }
  async function askAssistant(e){
    e?.preventDefault(); if(!assistantQuestion.trim())return;
    setAssistantLoading(true);setAssistantAnswer('');
    try{
      const res=await fetch('/api/study-assistant',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:assistantQuestion,passage:`${currentRef} (${readingVersion}): ${currentText}`,mode:assistantMode})});
      const data=await res.json(); if(!res.ok)throw new Error(data.error||'Assistant request failed');
      setAssistantAnswer(data.answer);
    }catch(err){setAssistantAnswer(err.message||'Could not reach the study assistant.');}
    finally{setAssistantLoading(false);}
  }
  function goToReference(ref){
    const match=ref.match(/^(.+?)\s+(\d+)(?::(\d+))?$/);
    if(match){const found=BOOKS.find(b=>b.name.toLowerCase()===match[1].toLowerCase());if(found){setBook(found.name);setChapter(Number(match[2]));setVerse(Number(match[3]||1));changePage('Reader');}}
  }
  const navItems=[
    {label:'Home',icon:Sprout},{label:'Bible Study',icon:BookOpen},{label:'My Barn',icon:PawPrint},
    {label:'Study Journal',icon:NotebookPen},{label:'Reading Plans',icon:CalendarDays},{label:'Discover',icon:Sparkles}
  ];
  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav?'sidebar-open':''}`}>
      <div className="brand"><div className="brand-mark"><Sprout size={25}/></div><div><strong>evermeadow</strong><small>GROW IN THE WORD</small></div><button className="mobile-close icon-button" onClick={()=>setMobileNav(false)}><X size={18}/></button></div>
      <div className="farm-label"><span className="farm-dot"></span> YOUR LITTLE FARM</div>
      <div className="mini-farm"><div className="mini-sun">☼</div><div className="mini-cloud">☁</div><div className="mini-hill hill-one"></div><div className="mini-hill hill-two"></div><div className="mini-fence">⌁ ⌁ ⌁ ⌁</div><span className="mini-flower">✿</span><span className="mini-flower f2">✿</span></div>
      <nav className="nav-list">{navItems.map(({label,icon:Icon})=><button key={label} className={`nav-item ${page===label||(label==='Bible Study'&&page==='Reader')?'active':''}`} onClick={()=>changePage(label==='Bible Study'?'Reader':label)}><Icon size={18}/><span>{label}</span>{label==='My Barn'&&<span className="nav-count">{unlockedAnimals.length}</span>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="streak-card"><div className="streak-icon">🌼</div><div><strong>{Math.floor(totalMinutes)} min today</strong><small>A little growth counts.</small></div></div><button className="nav-item" onClick={()=>setSettingsOpen(true)}><Settings size={18}/><span>Settings</span></button><div className="profile-row"><div className="avatar">🌷</div><div><strong>{profile.name||'Friend'}</strong><small>Meadow tender</small></div><button className="icon-button" onClick={()=>setSettingsOpen(true)} aria-label="Profile settings"><ChevronDown size={17}/></button></div></div>
    </aside>
    {mobileNav&&<button className="scrim" aria-label="Close navigation" onClick={()=>setMobileNav(false)}></button>}
    <main className="main-area">
      <header className="topbar"><button className="menu-button icon-button" onClick={()=>setMobileNav(true)} aria-label="Open menu"><Menu/></button><div className="breadcrumb">Your farm <span>/</span> <strong>{page==='Reader'?'Bible Study':page}</strong></div><div className="top-actions"><div className="weather-pill"><CloudSun size={16}/><span>A peaceful day to grow</span></div><button className="icon-button search-trigger" onClick={()=>changePage('Discover')} aria-label="Search"><Search size={19}/></button><div className="top-avatar">🌼</div></div></header>
      {page==='Home'&&<section className="page-content">
        <div className="welcome-row"><div><div className="eyebrow"><Flower2 size={15}/> A LITTLE TIME WITH THE WORD</div><h1>Good day, {profile.name||'friend'} <span className="wave">✿</span></h1><p className="subtitle">Small, faithful moments make a lovely life.</p></div><div className="date-chip"><CalendarDays size={16}/>{new Date().toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'})}</div></div>
        <div className="hero-card"><div className="hero-copy"><div className="hero-badge"><Sparkles size={14}/> TODAY'S LITTLE INVITATION</div><h2>Come away and<br/>rest a little.</h2><p>Spend a few quiet minutes in Scripture. Your heart and your little friend can grow together.</p><button className="primary-button" onClick={()=>changePage('Reader')}>Begin studying <ChevronRight size={17}/></button><div className="hero-verse">“Be still, and know that I am God.” <span>Psalm 46:10</span></div></div><div className="hero-illustration"><div className="hero-sun"></div><div className="hero-cloud c1"></div><div className="hero-cloud c2"></div><div className="hero-barn"><div className="barn-roof"></div><div className="barn-body"><div className="barn-door"></div><div className="barn-window"></div></div></div><div className="hero-hill h1"></div><div className="hero-hill h2"></div><span className="hero-bloom bloom1">✿</span><span className="hero-bloom bloom2">✿</span><span className="hero-bloom bloom3">✿</span><div className="hero-pet"><PetArt pet={activePet} stage={stage} accessory={accessories[activePetId]||''} large/></div></div></div>
        <div className="stats-grid"><div className="stat-card"><div className="stat-icon green"><Timer size={19}/></div><div><small>Study time today</small><strong>{String(Math.floor(dailySeconds/60)).padStart(2,'0')} <em>min</em></strong><div className="mini-progress"><span style={{width:`${progress}%`}}></span></div></div></div><div className="stat-card"><div className="stat-icon pink"><Heart size={19}/></div><div><small>Today's goal</small><strong>{progress}% <em>complete</em></strong><div className="mini-progress pink-progress"><span style={{width:`${progress}%`}}></span></div></div></div><div className="stat-card"><div className="stat-icon lilac"><BookMarked size={19}/></div><div><small>Saved passages</small><strong>{savedCount} <em>saved</em></strong><button className="text-link" onClick={()=>changePage('Study Journal')}>Visit your journal <ChevronRight size={13}/></button></div></div></div>
        <div className="section-heading"><div><h2>Your daily rhythm</h2><p>A gentle routine, at your own pace.</p></div><button className="text-link" onClick={()=>changePage('Reading Plans')}>View plans <ChevronRight size={14}/></button></div>
        <div className="rhythm-grid"><button className="rhythm-card" onClick={()=>changePage('Reader')}><div className="rhythm-art scripture-art"><BookOpen size={30}/><span>✿</span></div><div className="rhythm-info"><span className="tag tag-green">5–15 MIN</span><h3>Read a little</h3><p>Meet today's passage with an open heart.</p><span className="card-arrow"><ChevronRight size={16}/></span></div></button><button className="rhythm-card" onClick={()=>changePage('Study Journal')}><div className="rhythm-art journal-art"><NotebookPen size={30}/><span>♡</span></div><div className="rhythm-info"><span className="tag tag-pink">REFLECT</span><h3>Write it down</h3><p>Keep a thought, a prayer, or a question.</p><span className="card-arrow"><ChevronRight size={16}/></span></div></button><button className="rhythm-card" onClick={()=>changePage('My Barn')}><div className="rhythm-art pet-card-art"><PetArt pet={activePet} stage={stage}/></div><div className="rhythm-info"><span className="tag tag-yellow">YOUR COMPANION</span><h3>Visit {activePet.name}</h3><p>Every study minute helps your friend grow.</p><span className="card-arrow"><ChevronRight size={16}/></span></div></button></div>
      </section>}
      {page==='Reader'&&<section className="page-content reader-page">
        <div className="welcome-row"><div><div className="eyebrow"><BookOpen size={15}/> SCRIPTURE & REFLECTION</div><h1>Your Bible nook</h1><p className="subtitle">Read slowly. Notice what speaks to you. Bring your questions.</p></div><select className="version-select" value={readingVersion} onChange={e=>setReadingVersion(e.target.value)}><option>KJV</option><option disabled>Other translations (coming soon)</option></select></div>
        <div className="reader-layout"><div className="reader-main card-panel"><div className="reader-toolbar"><div className="select-group"><select value={book} onChange={e=>changeBook(e.target.value)}>{BOOKS.map(b=><option key={b.name}>{b.name}</option>)}</select><span className="select-slash">/</span><select value={chapter} onChange={e=>{setChapter(Number(e.target.value));setVerse(1)}}>{Array.from({length:BOOKS.find(b=>b.name===book)?.chapters||1},(_,i)=><option key={i+1} value={i+1}>Chapter {i+1}</option>)}</select></div><div className="chapter-arrows"><button className="icon-button" disabled={chapter===1&&book==='Genesis'} onClick={()=>{if(chapter>1)setChapter(chapter-1);else{const idx=BOOKS.findIndex(b=>b.name===book);if(idx>0){setBook(BOOKS[idx-1].name);setChapter(BOOKS[idx-1].chapters)}}}}><ChevronLeft size={17}/></button><button className="icon-button" disabled={chapter===(BOOKS.find(b=>b.name===book)?.chapters||1)&&book==='Revelation'} onClick={()=>{const max=BOOKS.find(b=>b.name===book)?.chapters||1;if(chapter<max)setChapter(chapter+1);else{const idx=BOOKS.findIndex(b=>b.name===book);if(idx<BOOKS.length-1){setBook(BOOKS[idx+1].name);setChapter(1)}}}}><ChevronRight size={17}/></button></div></div>
          <div className="passage-title"><div className="eyebrow">KING JAMES VERSION</div><h2>{book} {chapter}</h2><p>Take a breath. There is no rush.</p></div>
          <div className="reader-search"><Search size={16}/><input value={readerSearch} onChange={e=>setReaderSearch(e.target.value)} placeholder="Find a word in this chapter…"/><kbd>⌕</kbd></div>
          {loadingScripture&&<div className="loading-line"><span className="spinner"></span> Opening the chapter…</div>}
          {scriptureError&&!loadingScripture&&<div className="notice-box"><CircleHelp size={17}/><span>{scriptureError}</span></div>}
          <div className="verses-list">{(scripture?.verses||((book==='John'&&chapter===1)?samplePassage['John-1']:(book==='Psalms'&&chapter===23)?samplePassage['Psalm-23']:(book==='Philippians'&&chapter===4)?samplePassage['Philippians-4']:[])).map((item,i)=>{
            const vNum=Number(item.verse)||i+1; const text=typeof item==='string'?item:item.text||''; const ref=`${book} ${chapter}:${vNum}`;
            if(readerSearch&&!text.toLowerCase().includes(readerSearch.toLowerCase()))return null;
            return <div key={ref} className={`verse-row ${verse===vNum?'verse-selected':''} ${highlights[ref]?'verse-highlighted':''}`} onClick={()=>setVerse(vNum)}><span className="verse-number">{vNum}</span><p>{text}</p><div className="verse-actions"><button title="Highlight verse" onClick={e=>{e.stopPropagation();toggleHighlight(ref)}} className={highlights[ref]?'action-active':''}><Highlighter size={15}/></button><button title="Bookmark verse" onClick={e=>{e.stopPropagation();toggleBookmark(ref)}} className={bookmarks.includes(ref)?'action-active':''}><Bookmark size={15}/></button></div></div>
          })}</div>
          <div className="reader-footer"><button className="secondary-button" onClick={()=>{setVerse(Math.max(1,verse-1))}}><ChevronLeft size={15}/> Previous verse</button><span>{currentRef}</span><button className="secondary-button" onClick={()=>setVerse(verse+1)}>Next verse <ChevronRight size={15}/></button></div>
        </div>
        <div className="study-side"><div className="card-panel note-panel"><div className="panel-title"><div className="small-panel-icon note-icon"><NotebookPen size={17}/></div><div><h3>My study notes</h3><p>For {currentRef}</p></div></div><textarea value={notes[currentRef]||''} onChange={e=>setNotes(old=>({...old,[currentRef]:e.target.value}))} placeholder="What do you notice? What questions are coming up?"></textarea><button className="primary-button full-button" onClick={()=>saveNote(currentRef,notes[currentRef]||'')}>Save note <Check size={15}/></button></div>
          <div className="card-panel assistant-panel"><div className="assistant-heading"><div className="assistant-spark"><Sparkles size={18}/></div><div><h3>Study alongside</h3><p>A thoughtful study helper</p></div><span className="beta-tag">AI</span></div><div className="assistant-context"><small>PASSAGE IN VIEW</small><strong>{currentRef}</strong><p>{currentText||'Choose a passage to begin exploring.'}</p></div><label className="field-label">I'd like help with…</label><select className="assistant-mode" value={assistantMode} onChange={e=>setAssistantMode(e.target.value)}><option value="explain">Explaining this passage</option><option value="compare">Comparing interpretations</option><option value="context">Historical & literary context</option><option value="reflect">Reflection questions</option></select><form onSubmit={askAssistant} className="assistant-form"><textarea value={assistantQuestion} onChange={e=>setAssistantQuestion(e.target.value)} placeholder="What does this passage mean by…?"/><button className="send-button" disabled={assistantLoading} aria-label="Ask study assistant"><Send size={16}/></button></form>{assistantLoading&&<p className="assistant-status">Thinking carefully…</p>}{assistantAnswer&&<div className="assistant-answer"><div className="answer-label"><Sparkles size={13}/> STUDY NOTES FROM AI</div>{assistantAnswer}</div>}<p className="tiny-disclaimer">Use this as a study aid, not as a substitute for Scripture, trusted pastoral guidance, or your own discernment.</p></div>
        </div></div>
      </section>}
      {page==='My Barn'&&<section className="page-content"><div className="welcome-row"><div><div className="eyebrow"><PawPrint size={15}/> YOUR COMPANION CORNER</div><h1>Welcome to the barn</h1><p className="subtitle">Care grows with time spent in the Word. No lost progress for taking a rest.</p></div><div className="barn-total"><Egg size={18}/><strong>{totalXP}</strong><span>growth drops</span></div></div>
        <div className="barn-feature"><div className="barn-scene"><div className="scene-sun"></div><div className="scene-fence">╱╲ ╱╲ ╱╲ ╱╲ ╱╲</div><div className="scene-hill"></div><div className="scene-flower sf1">✿</div><div className="scene-flower sf2">✿</div><PetArt pet={activePet} stage={stage} accessory={accessories[activePetId]||''} large/></div><div className="barn-details"><span className="tag tag-green">YOUR LITTLE FRIEND</span><h2>{activePet.name} <span>♡</span></h2><p className="pet-description">Your {activePet.kind.toLowerCase()} is growing with every study session. Keep showing up in small, meaningful ways.</p><div className="level-line"><span>Level {activeData.level||1}</span><span>{stage===2?'Fully grown for now':`${activeData.xp%60}/60 drops to next stage`}</span></div><div className="level-bar"><span style={{width:`${stage===2?100:((activeData.xp||0)%60)/60*100}%`}}></span></div><div className="pet-stage-list">{activePet.stages.map((s,i)=><div className={i<=stage?'stage-unlocked':'stage-locked'} key={s}><span>{i<=stage?'✿':'○'}</span>{s}</div>)}</div><button className="primary-button" onClick={()=>changePage('Reader')}>Study with {activePet.name} <BookOpen size={16}/></button></div></div>
        <div className="section-heading"><div><h2>Meet the animals</h2><p>More friends arrive as your whole farm grows.</p></div><span className="muted-label">{unlockedAnimals.length} of {animals.length} unlocked</span></div><div className="animal-grid">{animals.map(p=>{const locked=totalXP<p.unlock;const data=petData[p.id]||{xp:0,level:1};return <button key={p.id} className={`animal-card ${activePetId===p.id?'animal-active':''} ${locked?'animal-locked':''}`} onClick={()=>{if(locked){notify(`Earn ${p.unlock-totalXP} more growth drops to unlock ${p.kind.toLowerCase()}.`);return;}setActivePetId(p.id);}}><div className="animal-art-wrap">{locked?<div className="locked-pet"><LockKeyhole size={22}/><span>🔒</span></div>:<PetArt pet={p} stage={data.level>=3?2:data.level>=2?1:0} accessory={accessories[p.id]||''}/>}<span className="animal-level">{locked?`Unlock at ${p.unlock}`:`Lv. ${data.level||1}`}</span></div><strong>{locked?'Mystery friend':p.name}</strong><small>{locked?'A new friend awaits':p.stages[Math.min(2,(data.level||1)-1)]}</small>{activePetId===p.id&&<span className="selected-check"><Check size={13}/></span>}</button>})}</div>
        <div className="section-heading"><div><h2>Little finishing touches</h2><p>Choose an accessory for your current companion.</p></div></div><div className="accessory-row">{activePet.accessories.map(a=><button key={a} className={`accessory-chip ${(accessories[activePetId]||'')===a?'accessory-selected':''}`} onClick={()=>setAccessories(old=>({...old,[activePetId]:(old[activePetId]||'')===a?'':a}))}>{({'Flower crown':'🌼','Pink bow':'🎀','Tiny scarf':'🧣','Bell collar':'🔔','Ribbon':'🎀','Butterfly clip':'🦋','Bandana':'🧣','Daisy pin':'🌼','Straw hat':'👒','Blue bow':'🎀','Rain hat':'🌧️','Little boots':'🥾','Bell':'🔔','Flower garland':'🌸','Kerchief':'🧣','Carrot pin':'🥕','Cape':'🦸','Heart glasses':'🕶️','Tiny crown':'👑','Blue ribbon':'🎀','Daisy':'🌼'})[a]} <span>{a}</span></button>)}</div>
      </section>}
      {page==='Study Journal'&&<section className="page-content"><div className="welcome-row"><div><div className="eyebrow"><NotebookPen size={15}/> YOUR PRIVATE LITTLE NOTEBOOK</div><h1>Thoughts from the meadow</h1><p className="subtitle">A place for questions, prayers, discoveries, and little reminders.</p></div><div className="journal-count"><BookMarked size={18}/>{journal.length} reflections</div></div>
        <div className="journal-layout"><div className="card-panel journal-compose"><div className="journal-paper-top"><span>✿</span><span>MY REFLECTIONS</span><span>✿</span></div><h2>What is on your heart?</h2><p>Write a prayer, a question, or something you want to carry into your day.</p><textarea value={journalDraft} onChange={e=>setJournalDraft(e.target.value)} placeholder="Today I noticed…"/><div className="compose-bottom"><span>Private on this device</span><button className="primary-button" onClick={addJournal}>Save reflection <Plus size={16}/></button></div></div><div className="journal-entries"><div className="section-heading"><div><h2>Your pages</h2><p>Little thoughts worth keeping.</p></div></div>{journal.length===0?<div className="empty-state"><div>🌷</div><h3>Your first page is waiting</h3><p>There is no perfect way to begin. Add a thought whenever you are ready.</p></div>:journal.map(entry=><article className="journal-entry card-panel" key={entry.id}><div className="entry-meta"><span>{entry.date}</span><span>{entry.ref}</span></div><p>{entry.text}</p><button className="entry-delete" title="Delete reflection" onClick={()=>setJournal(old=>old.filter(e=>e.id!==entry.id))}><X size={15}/></button></article>)}</div></div>
        <div className="section-heading"><div><h2>Saved Scripture</h2><p>Your bookmarks and verse notes.</p></div></div><div className="saved-grid">{bookmarks.length===0&&Object.keys(notes).length===0?<div className="empty-state wide-empty"><div>📖</div><h3>Your saved passages will live here</h3><p>Bookmark a verse or save a note while reading.</p><button className="secondary-button" onClick={()=>changePage('Reader')}>Open Bible reader <ChevronRight size={15}/></button></div>:<>{bookmarks.map(ref=><button key={ref} className="saved-item" onClick={()=>goToReference(ref)}><Bookmark size={17}/><span>{ref}</span><ChevronRight size={15}/></button>)}{Object.entries(notes).filter(([_,v])=>v.trim()).map(([ref,v])=><button key={ref} className="saved-item note-saved" onClick={()=>goToReference(ref)}><NotebookPen size={17}/><span><strong>{ref}</strong><small>{v}</small></span><ChevronRight size={15}/></button>)}</>}</div>
      </section>}
      {page==='Reading Plans'&&<section className="page-content"><div className="welcome-row"><div><div className="eyebrow"><CalendarDays size={15}/> ONE DAY AT A TIME</div><h1>A path through the Word</h1><p className="subtitle">Choose a rhythm that fits this season of your life.</p></div></div><div className="plan-hero"><div><span className="tag tag-green">START SMALL</span><h2>Consistency over perfection.</h2><p>A plan is a companion, not a contract. You can begin again whenever you need to.</p></div><div className="plan-flower">🌼</div></div><div className="plan-grid">{[
        {id:'john',title:'Get to know Jesus',subtitle:'A journey through the Gospel of John',days:21,icon:'🌿',tone:'plan-green',desc:'Read a short section each day and notice what Jesus says and does.'},
        {id:'peace',title:'A little more peace',subtitle:'Psalms for everyday life',days:7,icon:'🕊️',tone:'plan-lilac',desc:'Prayers and poems for hope, worry, gratitude, and rest.'},
        {id:'wisdom',title:'Everyday wisdom',subtitle:'Selected passages from Proverbs',days:14,icon:'🌷',tone:'plan-pink',desc:'Explore practical wisdom for speech, relationships, work, and character.'},
        {id:'early-church',title:'A growing community',subtitle:'Acts and the early church',days:14,icon:'🌞',tone:'plan-yellow',desc:'See how the first followers shared their faith and built community.'},
        {id:'gospels',title:'The story of Jesus',subtitle:'A gentle introduction to the Gospels',days:30,icon:'📖',tone:'plan-peach',desc:'Follow the life, teachings, death, and resurrection of Jesus.'},
        {id:'gratitude',title:'Practice gratitude',subtitle:'Seven days of noticing good gifts',days:7,icon:'🍓',tone:'plan-green',desc:'Pair a short Scripture reading with a written gratitude reflection.'}
      ].map(p=>{const done=planDone[p.id]||[];return <article className="plan-card card-panel" key={p.id}><div className={`plan-art ${p.tone}`}>{p.icon}<span className="plan-art-flower">✿</span></div><div className="plan-card-body"><div className="plan-meta"><span>{p.days} DAYS</span><span>{done.length} / {p.days} complete</span></div><h3>{p.title}</h3><strong>{p.subtitle}</strong><p>{p.desc}</p><div className="plan-progress"><span style={{width:`${done.length/p.days*100}%`}}></span></div><button className="secondary-button" onClick={()=>{const next=done.length+1;if(next>p.days){notify('You completed this plan. Lovely work!');return;}setPlanDone(old=>({...old,[p.id]:[...(old[p.id]||[]),next]}));notify(`Day ${next} marked complete. Keep growing!`);}}>Mark next day complete <Check size={14}/></button></div></article>})}</div></section>}
      {page==='Discover'&&<section className="page-content"><div className="welcome-row"><div><div className="eyebrow"><Sparkles size={15}/> A LITTLE MORE TO EXPLORE</div><h1>Curious hearts welcome</h1><p className="subtitle">Tools and ideas to help you dig deeper, gently.</p></div></div><div className="discover-grid"><button className="discover-card card-panel" onClick={()=>changePage('Reader')}><div className="discover-icon icon-green"><Search size={22}/></div><h3>Find a passage</h3><p>Open the Bible reader and look for a book, chapter, or phrase.</p><span className="text-link">Explore Scripture <ChevronRight size={14}/></span></button><button className="discover-card card-panel" onClick={()=>{changePage('Reader');setAssistantMode('compare')}}><div className="discover-icon icon-lilac"><Sparkles size={22}/></div><h3>Compare perspectives</h3><p>Ask the study assistant to outline interpretations and differences.</p><span className="text-link">Study with AI <ChevronRight size={14}/></span></button><button className="discover-card card-panel" onClick={()=>changePage('Study Journal')}><div className="discover-icon icon-pink"><NotebookPen size={22}/></div><h3>Reflect & remember</h3><p>Keep questions, prayers, and insights in your journal.</p><span className="text-link">Open journal <ChevronRight size={14}/></span></button><button className="discover-card card-panel" onClick={()=>changePage('Reading Plans')}><div className="discover-icon icon-yellow"><CalendarDays size={22}/></div><h3>Build a gentle habit</h3><p>Choose a guided path, set a daily goal, and return when you can.</p><span className="text-link">Browse plans <ChevronRight size={14}/></span></button></div><div className="other-texts card-panel"><div className="other-text-icon">📚</div><div><span className="tag tag-lilac">LIBRARY ROADMAP</span><h2>More sacred texts, carefully sourced</h2><p>The first release focuses on the King James Bible. A future library can add other Bible translations and religious works, each with its edition, tradition, source, and rights clearly labelled. Public-domain texts can be prioritised; copyrighted editions need permission or a licensed provider.</p><div className="library-tags"><span>Other Bible translations</span><span>Early Christian writings</span><span>Study references</span><span>Additional traditions</span></div></div></div></section>}
      <footer className="app-footer"><div><Sprout size={15}/> <strong>evermeadow</strong> <span>· A little growth, day by day.</span></div><span>Scripture first. Grace always.</span></footer>
    </main>
    {settingsOpen&&<div className="modal-backdrop" onClick={()=>setSettingsOpen(false)}><div className="settings-modal card-panel" onClick={e=>e.stopPropagation()}><div className="modal-header"><div><span className="eyebrow">MAKE YOURSELF AT HOME</span><h2>Your little settings</h2></div><button className="icon-button" onClick={()=>setSettingsOpen(false)}><X size={18}/></button></div><label className="field-label">What should we call you?</label><input className="setting-input" value={profile.name} onChange={e=>setProfile(old=>({...old,name:e.target.value}))} maxLength={30}/><label className="field-label">Daily study goal</label><div className="goal-options">{[5,10,15,20,30,45].map(n=><button key={n} className={profile.goal===n?'goal-selected':''} onClick={()=>setProfile(old=>({...old,goal:n}))}>{n} min</button>)}</div><div className="settings-note"><Heart size={17}/><span>Your progress is saved in this browser. This starter app does not yet have accounts or cloud backups.</span></div><button className="secondary-button full-button" onClick={()=>{setSettingsOpen(false);notify('Your preferences are saved.')}}>All tucked in <Check size={15}/></button><button className="reset-link" onClick={()=>{if(confirm('Reset all local Evermeadow data on this browser? This cannot be undone.')){Object.keys(localStorage).filter(k=>k.startsWith('evermeadow:')).forEach(k=>localStorage.removeItem(k));location.reload();}}}><RotateCcw size={13}/> Reset local app data</button></div></div>}
    {toast&&<div className="toast"><span>✿</span>{toast}</div>}
  </div>;
}
createRoot(document.getElementById('root')).render(<App/>);
