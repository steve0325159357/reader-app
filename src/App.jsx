import React, { useState, useMemo } from 'react';
import { 
  Book, BookOpen, Bookmark, Upload, MoreHorizontal, 
  Search, ChevronDown, Check, Share, FolderInput, Trash2, 
  ChevronLeft, CheckCircle2, SlidersHorizontal, 
  Pin, GripVertical, Volume2, Type, List, Camera, Filter,
  X, ChevronUp
} from 'lucide-react';

// --- 精準色碼與樣式設定 (Design System) ---
const THEME = {
  bg: 'bg-[#FDFCF8]',           
  surface: 'bg-[#FFFFFF]',      
  textMain: 'text-[#2C2925]',   
  textSub: 'text-[#8C867E]',    
  accent: 'text-[#C59B58]',     
  accentBg: 'bg-[#C59B58]',     
  accentBorder: 'border-[#C59B58]',
  border: 'border-[#EAE4DB]',   
  danger: 'bg-[#E0645A]',       
  success: 'text-[#569D67]',    
};

// --- Initial Mock Data ---
const initialBooks = [
  { id: '1', title: '慶餘年', author: '貓膩', category: '歷史 / 架空歷史', format: 'EPUB', progress: 75, lastRead: '2024/05/16 20:15', words: '535.6 萬', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300', description: '一個身世神秘的少年范閒，歷經家族、江湖、廟堂的重重考驗，以智慧與謀略在波瀾壯闊的時代中書寫屬於自己的傳奇。', encyclopedia: '《慶餘年》是一部架空歷史小說，講述范閒從海邊小城出發，逐步揭開身世之謎，卷入朝堂權謀與江湖紛爭的故事。作品融合權謀、江湖、懸疑等元素，人物刻畫細膩，情節跌宕起伏。', isComic: false },
  { id: '2', title: '雪中悍刀行', author: '烽火戲諸侯', category: '玄幻 / 武俠', format: 'TXT', progress: 68, lastRead: '2024/05/15 21:48', words: '460 萬', cover: 'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?auto=format&fit=crop&q=80&w=300', description: '徐鳳年與范閒等人於北涼相識，共同面對江湖與朝堂的風雨。兩人性格迥異，卻惺惺相惜。', encyclopedia: '徐鳳年與范閒等人於北涼相識，共同面對江湖與朝堂的風雨。兩人性格迥異，卻惺惺相惜。', isComic: false },
  { id: '3', title: '長安的荔枝', author: '馬伯庸', category: '歷史 / 短篇', format: 'EPUB', progress: 42, lastRead: '2024/05/14 18:30', words: '15 萬', cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=300', description: '李善德在運送荔枝的過程中，與范閒有過一面之緣，從中獲得關鍵情報，使任務得以推進。', encyclopedia: '李善德在運送荔枝的過程中，與范閒有過一面之緣，從中獲得關鍵情報，使任務得以推進。', isComic: false },
  { id: '4', title: '大奉打更人', author: '賣報小郎君', category: '仙俠 / 漫畫', format: 'PDF', progress: 100, lastRead: '2024/05/12 23:11', words: '380 萬', cover: 'https://images.unsplash.com/photo-1629196914166-fd3e5fc73dfb?auto=format&fit=crop&q=80&w=300', description: '許七安與范閒在朝堂上有過交集，兩人皆以智謀見長，故事中多次被相提並論。', encyclopedia: '許七安與范閒在朝堂上有過交集，兩人皆以智謀見長，故事中多次被相提並論。', isComic: true },
];

const initialBookmarks = [
  { id: 'b1', group: '慶餘年 (35)', label: '范閒初入京都', bookTitle: '范閒進京，初見京都繁華，心中暗自...', date: '2024/05/16 20:10', pinned: true },
  { id: 'b2', group: '慶餘年 (35)', label: '與陳萍萍的對話', bookTitle: '陳萍萍告訴范閒，這個世界遠比他想...', date: '2024/05/15 18:22', pinned: true },
  { id: 'b3', group: '慶餘年 (35)', label: '慶帝的試探', bookTitle: '慶帝對范閒的態度耐人尋味，暗中觀察...', date: '2024/05/14 22:41' },
];

export default function App() {
  // --- Global State ---
  const [tab, setTab] = useState("library");
  const [books, setBooks] = useState(initialBooks);
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  
  // --- View States ---
  const [selectedBook, setSelectedBook] = useState(null);
  const [readerBook, setReaderBook] = useState(null);
  
  // --- Search & Filter States ---
  const [keyword, setKeyword] = useState("");
  const [wikiKeyword, setWikiKeyword] = useState("范閒");
  const [bookmarkKeyword, setBookmarkKeyword] = useState("");
  
  // --- Library Sort & Edit States ---
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortField, setSortField] = useState("recent");
  const [ascending, setAscending] = useState(false);
  const [formatFilters, setFormatFilters] = useState([]); // 預設全選(空陣列)

  // --- Settings States ---
  const [readerTheme, setReaderTheme] = useState("day");
  const [fontSize, setFontSize] = useState(18);
  const [lineSpacing, setLineSpacing] = useState(1.6);
  const [letterSpacing, setLetterSpacing] = useState(0.05);
  const [fontFamily, setFontFamily] = useState("微軟正黑體");
  const [pageTurn, setPageTurn] = useState("swipe");

  // --- Derived Data (useMemo) ---
  const filteredBooks = useMemo(() => {
    const lower = keyword.trim().toLowerCase();
    const list = books.filter((b) => {
      const keywordPass = !lower || b.title.toLowerCase().includes(lower) || b.author.toLowerCase().includes(lower);
      const formatPass = formatFilters.length === 0 || formatFilters.includes(b.format);
      return keywordPass && formatPass;
    });
    list.sort((a, b) => {
      let r = 0;
      if (sortField === "recent") r = a.lastRead.localeCompare(b.lastRead);
      if (sortField === "title") r = a.title.localeCompare(b.title, "zh-Hant");
      if (sortField === "author") r = a.author.localeCompare(b.author, "zh-Hant");
      if (sortField === "category") r = a.category.localeCompare(b.category, "zh-Hant");
      return ascending ? r : -r;
    });
    return list;
  }, [books, keyword, formatFilters, sortField, ascending]);

  const wikiBooks = useMemo(() => {
    const lower = wikiKeyword.trim().toLowerCase();
    return books.filter((b) => !lower || b.title.toLowerCase().includes(lower) || b.encyclopedia.toLowerCase().includes(lower) || b.description.toLowerCase().includes(lower));
  }, [books, wikiKeyword]);

  const groupedBookmarks = useMemo(() => {
    const lower = bookmarkKeyword.trim().toLowerCase();
    const visible = bookmarks.filter((b) => !lower || b.bookTitle.toLowerCase().includes(lower) || b.label.toLowerCase().includes(lower) || b.group.toLowerCase().includes(lower));
    const map = new Map();
    visible.forEach((item) => {
      if (!map.has(item.group)) map.set(item.group, []);
      map.get(item.group).push(item);
    });
    return Array.from(map.entries());
  }, [bookmarks, bookmarkKeyword]);

  // --- Handlers ---
  const toggleSelection = (id, e) => {
    if (e) e.stopPropagation();
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  const deleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`確定要刪除選取的 ${selectedIds.length} 本書嗎？`)) {
      setBooks((prev) => prev.filter((b) => !selectedIds.includes(b.id)));
      setSelectedIds([]);
      setIsEditMode(false);
    }
  };

  const createDemoBook = () => {
    const newBook = {
      id: String(Date.now()),
      title: "新上傳書籍",
      author: "使用者",
      category: "設計",
      format: "PDF",
      progress: 0,
      lastRead: "剛剛",
      words: "2 萬",
      cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300',
      description: "這是透過原型上傳功能動態加入的測試書籍。",
      encyclopedia: "自動整理出摘要與關鍵字。",
      isComic: false
    };
    setBooks([newBook, ...books]);
    setTab("library");
  };

  const currentBgColor = readerTheme === 'night' ? '#1A1A1A' : readerTheme === 'day' ? '#F9F8F5' : '#F5ECD9';
  const currentTextColor = readerTheme === 'night' ? '#D5D0C8' : '#36322E';

  // ============================================================================
  // Views
  // ============================================================================

  const LibraryView = () => (
    <div className={`min-h-full pb-24 px-5 pt-12 ${THEME.bg}`}>
      
      {/* 全域遮罩，點擊背景可關閉下拉選單 */}
      {(showSortDropdown || showFilterDropdown) && (
        <div className="fixed inset-0 z-20" onClick={() => { setShowSortDropdown(false); setShowFilterDropdown(false); }} />
      )}

      {/* 搜尋列 */}
      <div className={`flex items-center px-4 py-3 rounded-xl ${THEME.surface} border border-[#F0EBE1] shadow-[0_2px_12px_rgba(0,0,0,0.03)] mb-5 relative z-10`}>
        <Search className={`w-[18px] h-[18px] text-[#A69E94] mr-2`} />
        <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="搜尋書名 / 作者 / 關鍵字" className={`bg-transparent outline-none text-[15px] w-full ${THEME.textMain} placeholder:text-[#BDB6AC] font-medium`} />
      </div>

      {/* 排序 / 分類 / 編輯 列 */}
      <div className="flex justify-end gap-2.5 mb-6 relative z-30">
         <button onClick={() => { setShowSortDropdown(!showSortDropdown); setShowFilterDropdown(false); }} className={`flex items-center px-3.5 py-1.5 rounded-lg text-[14px] font-medium transition-colors ${showSortDropdown ? THEME.accentBg + ' text-white shadow-md' : 'bg-[#F7F3EB] text-[#8C867E] border border-[#EAE4DB] shadow-sm'}`}>
           排序 <ChevronDown className="w-3.5 h-3.5 ml-1" />
         </button>
         <button onClick={() => { setShowFilterDropdown(!showFilterDropdown); setShowSortDropdown(false); }} className={`flex items-center px-3.5 py-1.5 rounded-lg text-[14px] font-medium transition-colors ${showFilterDropdown ? THEME.accentBg + ' text-white shadow-md' : 'bg-[#F7F3EB] text-[#8C867E] border border-[#EAE4DB] shadow-sm'}`}>
           分類 <ChevronDown className="w-3.5 h-3.5 ml-1" />
         </button>
         <button onClick={() => { setIsEditMode(!isEditMode); setSelectedIds([]); setShowSortDropdown(false); setShowFilterDropdown(false); }} className={`px-4 py-1.5 rounded-lg text-[14px] font-medium transition-colors ${isEditMode ? THEME.accentBg + ' text-white shadow-md' : 'bg-[#F7F3EB] text-[#8C867E] border border-[#EAE4DB] shadow-sm'}`}>
           {isEditMode ? '完成' : '編輯'}
         </button>

         {/* 排序下拉選單 */}
         {showSortDropdown && !isEditMode && (
           <div className="absolute top-10 right-[88px] w-36 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-[#F0EBE1] py-1.5 z-40 animate-in fade-in slide-in-from-top-2">
             {[
               { id: "recent", label: "最近閱讀" },
               { id: "title", label: "書名" },
               { id: "author", label: "作者" },
               { id: "category", label: "分類" }
             ].map((opt) => (
                <button key={opt.id} onClick={() => { setSortField(opt.id); setShowSortDropdown(false); }} className={`w-full flex justify-between items-center px-4 py-2.5 text-[14px] ${sortField === opt.id ? 'text-[#C59B58] bg-[#FDFBF7] font-medium' : 'text-[#5C5751] hover:bg-[#F9F7F3]'}`}>
                  {opt.label} {sortField === opt.id && <Check className="w-4 h-4" />}
                </button>
             ))}
             <div className="h-[1px] bg-[#F0EBE1] my-1 mx-3" />
             <button onClick={() => { setAscending(true); setShowSortDropdown(false); }} className={`w-full flex justify-between items-center px-4 py-2.5 text-[14px] ${ascending ? 'text-[#C59B58] font-medium' : 'text-[#5C5751] hover:bg-[#F9F7F3]'}`}>正序 {ascending && <Check className="w-4 h-4" />}</button>
             <button onClick={() => { setAscending(false); setShowSortDropdown(false); }} className={`w-full flex justify-between items-center px-4 py-2.5 text-[14px] ${!ascending ? 'text-[#C59B58] font-medium' : 'text-[#5C5751] hover:bg-[#F9F7F3]'}`}>倒序 {!ascending && <Check className="w-4 h-4" />}</button>
           </div>
         )}

         {/* 分類下拉選單 */}
         {showFilterDropdown && !isEditMode && (
           <div className="absolute top-10 right-[20px] w-40 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-[#F0EBE1] py-2 z-40 animate-in fade-in slide-in-from-top-2">
             <div className="flex flex-col">
               {["PDF", "TXT", "EPUB", "其他"].map((fmt) => (
                  <label key={fmt} className="flex items-center gap-3 px-4 py-2 text-[14px] text-[#5C5751] cursor-pointer hover:bg-[#F9F7F3]">
                    <div className={`w-4 h-4 rounded-[3px] border flex items-center justify-center ${formatFilters.includes(fmt) ? 'bg-[#C59B58] border-[#C59B58]' : 'border-[#D1CCC5] bg-white'}`}>
                      {formatFilters.includes(fmt) && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </div>
                    {/* 隱藏原生 checkbox，使用客製化 UI */}
                    <input type="checkbox" className="hidden" checked={formatFilters.includes(fmt)} onChange={() => setFormatFilters(prev => prev.includes(fmt) ? prev.filter(v=>v!==fmt) : [...prev, fmt])} />
                    {fmt}
                  </label>
               ))}
             </div>
             <div className="flex justify-between items-center text-[12px] pt-2 mt-1 px-4 border-t border-[#F0EBE1]">
               <span className="text-[#8C867E]">已選擇 {formatFilters.length} 項</span>
               <button onClick={() => setFormatFilters([])} className="text-[#C59B58] font-medium">清除</button>
             </div>
           </div>
         )}
      </div>

      {/* 書籍列表 */}
      <div className="flex flex-col gap-7 relative z-10">
        {filteredBooks.map((book) => (
          <div key={book.id} className="flex gap-4 items-center cursor-pointer group" onClick={() => isEditMode ? toggleSelection(book.id) : setSelectedBook(book)}>
            
            {isEditMode && ( 
              <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 transition-colors ${selectedIds.includes(book.id) ? 'bg-[#C59B58] border-transparent shadow-sm' : 'border border-[#C5BCB1] bg-white'}`}>
                {selectedIds.includes(book.id) && <Check className="w-[14px] h-[14px] text-white" strokeWidth={3} />}
              </div>
            )}
            
            {/* 書封 */}
            <div className="w-[88px] h-[126px] rounded-sm shadow-[6px_6px_16px_rgba(0,0,0,0.12),_0_2px_4px_rgba(0,0,0,0.04)] bg-[#EBE6DF] relative shrink-0 overflow-hidden transform group-hover:-translate-y-1 transition-transform">
              <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
              <div className="absolute inset-y-0 left-0 w-[6px] bg-gradient-to-r from-black/25 via-black/5 to-transparent"></div>
              <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-sm"></div>
            </div>

            {/* 書籍資訊 */}
            <div className="flex-1 flex flex-col h-[116px] py-1 border-b border-[#EAE4DB]/50">
              <h3 className={`text-[19px] font-serif font-bold ${THEME.textMain} mb-2 line-clamp-1`}>{book.title}</h3>
              
              <div className="mt-auto">
                <p className={`text-[14px] ${THEME.textMain} font-medium mb-1.5`}>{book.progress === 100 ? '已讀完' : `${book.progress}%`}</p>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className={`text-[12px] text-[#8C867E]`}>上次閱讀：{book.lastRead}</span>
                </div>
                {/* 底部進度條 */}
                <div className="w-full h-[3px] bg-[#EAE4DB] rounded-full relative">
                  <div className="absolute left-0 top-0 h-full bg-[#C59B58] rounded-full" style={{width: `${book.progress}%`}}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredBooks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-[#8C867E] text-[14px]">找不到符合條件的書籍。</div>
        )}
      </div>

      {/* 編輯模式底部動作列 */}
      {isEditMode && (
        <div className="fixed bottom-[90px] left-5 right-5 bg-[#FCFAF6] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-[#EAE4DB] p-3 flex justify-around items-center z-40 animate-in slide-in-from-bottom-5">
          <button className="flex flex-col items-center gap-1.5 w-16" onClick={() => alert("分享選取的書籍")}><Share className="w-5 h-5 text-[#8C867E]" /><span className="text-[12px] font-medium text-[#5C5751]">分享</span></button>
          <button className="flex flex-col items-center gap-1.5 w-16" onClick={() => alert("移動選取的書籍")}><FolderInput className="w-5 h-5 text-[#8C867E]" /><span className="text-[12px] font-medium text-[#5C5751]">移動</span></button>
          <button onClick={deleteSelected} className="flex flex-col items-center gap-1.5 w-16"><Trash2 className={`w-5 h-5 ${selectedIds.length > 0 ? 'text-[#E0645A]' : 'text-[#E0645A]/50'}`} /><span className={`text-[12px] font-medium ${selectedIds.length > 0 ? 'text-[#E0645A]' : 'text-[#E0645A]/50'}`}>刪除</span></button>
        </div>
      )}
    </div>
  );

  const BookDetailView = () => {
    if (!selectedBook) return null;
    return (
      <div className={`absolute inset-0 z-[60] flex items-end animate-in fade-in duration-200 bg-black/40`}>
        {/* 背景點擊關閉 */}
        <div className="absolute inset-0" onClick={() => setSelectedBook(null)}></div>
        
        {/* 底部滑出的 Modal 面板 */}
        <div className="w-full h-[85%] bg-[#FCFAF5] rounded-t-[32px] relative flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-8 duration-300">
          
          {/* 頂部拉桿 */}
          <div className="w-full flex justify-center pt-3 pb-1 cursor-pointer shrink-0" onClick={() => setSelectedBook(null)}>
             <div className="w-10 h-1.5 bg-[#D8D2C9] rounded-full"></div>
             <ChevronDown className="absolute right-5 top-5 w-6 h-6 text-[#A69E94]" />
          </div>

          <div className="flex-1 overflow-y-auto px-6 pt-4 pb-32 no-scrollbar">
            {/* 上半部：書封與資訊 */}
            <div className="flex gap-6 mb-8 relative">
              <div className="w-[110px] h-[156px] shrink-0 rounded-sm shadow-[8px_8px_20px_rgba(0,0,0,0.15)] relative transform -mt-8 bg-white p-1">
                <img src={selectedBook.cover} alt="cover" className="w-full h-full object-cover rounded-sm" />
                <div className="absolute inset-y-1 left-1 w-[5px] bg-gradient-to-r from-black/20 to-transparent"></div>
              </div>
              <div className="flex flex-col pt-1 w-full">
                <h1 className="text-[26px] font-serif font-bold text-[#2C2925] mb-4 leading-tight">{selectedBook.title}</h1>
                <div className="space-y-2.5 text-[14px] text-[#4A4641]">
                  <p>作者：{selectedBook.author}</p>
                  <p>分類：{selectedBook.category}</p>
                  <p>格式：{selectedBook.format}</p>
                  <p>字數：{selectedBook.words}</p>
                  <p className="text-[#8C867E]">上次閱讀：{selectedBook.lastRead}</p>
                </div>
                {/* 進度條 */}
                <div className="flex items-center gap-3 mt-4">
                  <div className="flex-1 h-[4px] bg-[#EAE4DB] rounded-full relative">
                    <div className="absolute left-0 top-0 h-full bg-[#C59B58] rounded-full" style={{width: `${selectedBook.progress}%`}}></div>
                  </div>
                  <span className="text-[14px] font-medium text-[#2C2925]">{selectedBook.progress}%</span>
                </div>
              </div>
            </div>

            {/* 簡介區塊 */}
            <div className="bg-white border border-[#EAE4DB] rounded-2xl p-5 mb-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <h3 className="text-[16px] font-bold text-[#2C2925] mb-3">簡介</h3>
              <p className="text-[15px] text-[#4A4641] leading-relaxed text-justify tracking-wide">
                {selectedBook.description}
              </p>
            </div>

            {/* 百科區塊 */}
            <div className="bg-white border border-[#EAE4DB] rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-[16px] font-bold text-[#2C2925]">百科</h3>
                <span className="text-[11px] text-[#8C867E] bg-[#F7F3EB] px-2 py-0.5 rounded-full">(AI 整理)</span>
              </div>
              <p className="text-[15px] text-[#4A4641] leading-relaxed text-justify mb-5 tracking-wide line-clamp-3">
                {selectedBook.encyclopedia}
              </p>
              <div className="flex justify-end">
                <button className="text-[13px] text-[#8C867E] border border-[#EAE4DB] px-4 py-1.5 rounded-full flex items-center shadow-sm hover:bg-[#FDFCF8] transition-colors" onClick={() => { setTab('wiki'); setWikiKeyword(selectedBook.title); setSelectedBook(null); }}>
                  查看百科條目 <ChevronLeft className="w-4 h-4 ml-1 rotate-180" />
                </button>
              </div>
            </div>
          </div>

          {/* 固定於底部的動作區塊 (Sticky Footer) */}
          <div className="absolute bottom-0 left-0 right-0 p-6 pt-4 bg-gradient-to-t from-[#FCFAF5] via-[#FCFAF5] to-transparent">
            <div className="flex gap-4">
              <button className="flex-1 py-3.5 bg-[#FCFAF5] border border-[#C59B58] text-[#C59B58] text-[16px] font-bold rounded-xl shadow-sm tracking-widest active:bg-[#F5ECD9]" onClick={() => alert("編輯表單功能示意")}>
                編輯
              </button>
              <button className="flex-[1.5] py-3.5 bg-[#C59B58] text-white text-[16px] font-bold rounded-xl shadow-[0_4px_16px_rgba(197,155,88,0.3)] flex items-center justify-center gap-2 tracking-widest active:bg-[#B38C4F]" onClick={() => { setReaderBook(selectedBook); setSelectedBook(null); }}>
                <BookOpen className="w-5 h-5 fill-current opacity-90" /> 繼續觀看
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ReaderOverlay = () => {
    if (!readerBook) return null;
    const [showToolbar, setShowToolbar] = useState(false);
    const [showReaderSettings, setShowReaderSettings] = useState(false);

    return (
      <div className="absolute inset-0 z-50 flex flex-col transition-colors duration-300" style={{ backgroundColor: readerBook.isComic ? '#111' : currentBgColor }}>
        
        {/* 點擊背景關閉工具列與設定選單 */}
        {showReaderSettings && (
          <div className="absolute inset-0 z-10" onClick={() => setShowReaderSettings(false)} />
        )}

        {/* Top Toolbar */}
        <div className={`absolute top-0 left-0 right-0 p-4 pt-12 md:pt-12 flex justify-between items-center transition-transform duration-300 z-20 ${showToolbar ? 'translate-y-0' : '-translate-y-full'} bg-[#FDFCF8]/95 backdrop-blur-md border-b border-[#EAE4DB]`}>
          <div className="flex items-center gap-3">
            <button onClick={() => setReaderBook(null)} className="p-2 -ml-2 rounded-full text-[#2C2925]">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex flex-col">
              <span className="text-sm font-serif font-bold text-[#2C2925] truncate w-32">{readerBook.title}</span>
              <span className="text-[10px] text-[#8C867E]">目前進度 {readerBook.progress}%</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[#2C2925] relative">
            <button className="p-2" onClick={() => alert("語音朗讀功能示意")}><Volume2 className="w-5 h-5" /></button>
            
            {/* 點擊展開懸浮設定選單 */}
            <button className={`p-2 rounded-full transition-colors ${showReaderSettings ? 'bg-[#F5ECD9] text-[#C59B58]' : ''}`} onClick={(e) => { e.stopPropagation(); setShowReaderSettings(!showReaderSettings); }}>
               <Type className="w-5 h-5" />
            </button>
            <button className="p-2"><List className="w-5 h-5" /></button>

            {/* 懸浮設定面板 */}
            {showReaderSettings && (
              <div className="absolute top-14 right-2 w-64 bg-white rounded-2xl shadow-xl border border-[#EAE4DB] p-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 z-30" onClick={e => e.stopPropagation()}>
                 <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[13px] font-bold text-[#2C2925]">字體大小</span>
                      <span className="text-[12px] text-[#8C867E]">{fontSize}</span>
                    </div>
                    <input type="range" min={14} max={26} step={1} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full accent-[#C59B58]" />
                 </div>
                 <div>
                    <span className="text-[13px] font-bold text-[#2C2925] mb-2 block">背景主題</span>
                    <div className="flex border border-[#EAE4DB] rounded-lg overflow-hidden bg-[#FDFCF8] p-1">
                      <button onClick={() => setReaderTheme('day')} className={`flex-1 py-1.5 text-[12px] rounded-md ${readerTheme==='day' ? 'bg-white shadow-sm font-bold text-[#2C2925]' : 'text-[#8C867E]'}`}>日間</button>
                      <button onClick={() => setReaderTheme('night')} className={`flex-1 py-1.5 text-[12px] rounded-md ${readerTheme==='night' ? 'bg-[#2C2925] shadow-sm font-bold text-white' : 'text-[#8C867E]'}`}>夜間</button>
                      <button onClick={() => setReaderTheme('custom')} className={`flex-1 py-1.5 text-[12px] rounded-md ${readerTheme==='custom' ? 'bg-[#F5ECD9] shadow-sm font-bold text-[#C59B58]' : 'text-[#8C867E]'}`}>自訂</button>
                    </div>
                 </div>
                 <button onClick={() => { setTab('settings'); setReaderBook(null); }} className="w-full py-2 text-[12px] text-[#C59B58] font-bold border border-[#C59B58] rounded-lg mt-1">前往完整設定</button>
              </div>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto cursor-pointer flex justify-center pb-20 no-scrollbar" onClick={() => { setShowToolbar(!showToolbar); setShowReaderSettings(false); }}>
          {readerBook.isComic ? (
             <div className="w-full h-full flex items-center justify-center flex-col gap-4 text-white/50 p-6">
                <img src={readerBook.cover} alt="Comic Page" className="max-w-full max-h-[70vh] object-contain rounded-md shadow-2xl" />
                <p className="text-[13px]">漫畫預覽 (向{pageTurn==='swipe'?'左':'下'}翻頁)</p>
             </div>
          ) : (
            <div className="w-full max-w-2xl px-6 py-24 flex flex-col" style={{ gap: `${lineSpacing}rem` }}>
              <h1 className="text-[28px] font-bold mb-8 text-center tracking-widest font-serif" style={{ color: currentTextColor }}>第一章：晨光微露</h1>
              <p className="text-justify indent-8" style={{ color: currentTextColor, fontSize, lineHeight: lineSpacing, letterSpacing: `${letterSpacing}em` }}>
                晨光透過半開的窗簾灑進房間，書頁邊緣泛著柔和的光澤。他把昨天未讀完的段落重新翻回，停在那行被鉛筆淡淡畫下底線的句子前。
              </p>
              <p className="text-justify indent-8" style={{ color: currentTextColor, fontSize, lineHeight: lineSpacing, letterSpacing: `${letterSpacing}em` }}>
                這段文字是動態渲染的。您可以隨時點擊畫面上方工具列的「字體(A)」圖示即時調整字級與背景，或者前往「設定」頁面進行更進階的排版微調。
              </p>
              <p className="text-justify indent-8" style={{ color: currentTextColor, fontSize, lineHeight: lineSpacing, letterSpacing: `${letterSpacing}em` }}>
                這套「溫潤極簡閱讀系統」結合了最新的 React 架構與樣式，並完美重現了設計稿中的視覺風格。
              </p>
            </div>
          )}
        </div>

        {/* Bottom Progress Bar */}
        <div className={`absolute bottom-0 left-0 right-0 p-6 pt-4 transition-transform duration-300 z-10 ${showToolbar ? 'translate-y-0' : 'translate-y-full'} bg-[#FDFCF8]/95 backdrop-blur-md border-t border-[#EAE4DB]`}>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#8C867E] w-10 text-right">上一章</span>
            <div className="flex-1 h-[4px] rounded-full bg-[#EAE4DB] relative cursor-pointer">
              <div className="absolute left-0 top-0 h-full rounded-full bg-[#C59B58]" style={{ width: `${readerBook.progress}%` }}></div>
              <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#C59B58] shadow-sm" style={{ left: `${readerBook.progress}%` }}></div>
            </div>
            <span className="text-xs text-[#8C867E] w-10">下一章</span>
          </div>
        </div>
      </div>
    );
  };

  const WikiView = () => (
    <div className={`min-h-full pb-24 px-5 pt-12 ${THEME.bg}`}>
      {/* 搜尋列 */}
      <div className={`flex items-center px-4 py-3 rounded-xl ${THEME.surface} border border-[#F0EBE1] mb-5 shadow-sm`}>
        <Search className={`w-[18px] h-[18px] text-[#A69E94] mr-2`} />
        <input type="text" value={wikiKeyword} onChange={e => setWikiKeyword(e.target.value)} placeholder="搜尋書名 / 人物 / 關鍵字" className={`bg-transparent outline-none text-[15px] w-full ${THEME.textMain} placeholder:text-[#BDB6AC] font-medium`} />
      </div>

      <div className="text-[14px] text-[#2C2925] mb-5 font-medium">
        找到 {wikiBooks.length} 條結果 {wikiKeyword && <span className="text-[#8C867E] font-normal">(關鍵字：<span className="text-[#C59B58] underline underline-offset-4 decoration-[#C59B58]/40">{wikiKeyword}</span>)</span>}
      </div>

      <div className="space-y-4">
        {wikiBooks.map((res) => (
          <div key={res.id} onClick={() => setSelectedBook(res)} className="bg-white border border-[#EAE4DB] rounded-2xl p-4 flex gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] relative cursor-pointer hover:shadow-md transition-shadow">
            <div className="w-[72px] h-[104px] rounded-sm shadow-[4px_4px_10px_rgba(0,0,0,0.1)] shrink-0 overflow-hidden relative">
               <img src={res.cover} alt="cover" className="w-full h-full object-cover" />
               <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-r from-black/20 to-transparent"></div>
            </div>
            <div className="flex-1 flex flex-col justify-between pt-1 pb-1">
              <div>
                <h4 className="text-[17px] font-serif font-bold text-[#2C2925] mb-2">{res.title}</h4>
                <p className="text-[14px] text-[#5C5751] leading-relaxed line-clamp-3">
                  {wikiKeyword ? <span dangerouslySetInnerHTML={{__html: res.encyclopedia.replace(new RegExp(wikiKeyword, 'g'), `<mark>${wikiKeyword}</mark>`).replace(/<mark>/g, '<span style="background-color:#FCEBA1; color:#2C2925; padding:0 2px; border-radius:2px; font-weight:500;">').replace(/<\/mark>/g, '</span>')}} /> : res.encyclopedia}
                </p>
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-[13px] text-[#8C867E]">{res.category.includes('/') ? res.category.split('/')[0] + '關係' : '相關內容'}</span>
                <span className="text-[11px] text-[#C59B58] border border-[#C59B58]/30 bg-[#FDFCF8] px-2 py-0.5 rounded-full">AI 整理</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const BookmarksView = () => (
    <div className={`min-h-full pb-24 pt-12 ${THEME.bg}`}>
      {/* 搜尋列與篩選 */}
      <div className="px-5 mb-5 flex items-center gap-3">
        <div className={`flex-1 flex items-center px-4 py-3 rounded-xl ${THEME.surface} border border-[#F0EBE1] shadow-sm`}>
          <Search className={`w-[18px] h-[18px] text-[#A69E94] mr-2`} />
          <input type="text" value={bookmarkKeyword} onChange={e => setBookmarkKeyword(e.target.value)} placeholder="搜尋書籤內容 / 書名" className={`bg-transparent outline-none text-[15px] w-full ${THEME.textMain} placeholder:text-[#BDB6AC] font-medium`} />
        </div>
        <div className="w-12 h-12 border border-[#EAE4DB] bg-white rounded-xl flex items-center justify-center shadow-sm">
           <Filter className="w-5 h-5 text-[#8C867E]" />
        </div>
      </div>

      <div className="px-5 flex justify-between items-center mb-5">
        <button className="text-[14px] font-bold text-[#2C2925] flex items-center">排序：最近新增 <ChevronDown className="w-4 h-4 ml-1 text-[#8C867E]" /></button>
        <button className="text-[13px] text-[#C59B58] font-medium">管理群組</button>
      </div>

      {/* 橫向捲動分類 Pills */}
      <div className="flex px-5 gap-3 mb-6 overflow-x-auto no-scrollbar pb-2">
         {['全部 (128)', '慶餘年 (35)', '雪中悍刀行 (28)', '大奉打更人 (22)'].map((p, i) => (
           <div key={i} className={`whitespace-nowrap px-4 py-2 rounded-full border text-[13px] font-medium ${i===0 ? THEME.accentBg + ' text-white border-transparent shadow-md' : 'bg-white border-[#EAE4DB] text-[#5C5751]'}`}>
             {p}
           </div>
         ))}
      </div>

      {/* 書籤列表 */}
      <div className="px-5 space-y-4">
        {groupedBookmarks.map(([group, items]) => (
          <div key={group} className="bg-white border border-[#EAE4DB] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
            {/* 群組標頭 */}
            <div className="px-5 py-4 bg-[#FDFCF8] border-b border-[#EAE4DB] flex justify-between items-center cursor-pointer">
              <span className="text-[15px] font-bold text-[#2C2925] flex items-center gap-2"><GripVertical className="w-4 h-4 text-[#D8D2C9]" /> {group}</span>
              <ChevronUp className="w-5 h-5 text-[#8C867E]" />
            </div>
            
            {/* 列表項目 */}
            <div className="divide-y divide-[#F5F2EC]">
              {items.map(item => (
                <div key={item.id} className="relative overflow-hidden bg-white group cursor-pointer hover:bg-[#FDFCF8]">
                   <div className="px-5 py-4 flex gap-3 relative">
                      {item.pinned && <div className="w-[3px] h-[40px] absolute left-0 top-[20%] bg-[#C59B58] rounded-r"></div>}
                      <div className="flex-1 pl-1">
                        <h4 className="text-[15px] font-bold text-[#2C2925] mb-1.5">{item.label}</h4>
                        <p className="text-[13px] text-[#8C867E] mb-2.5 truncate">{item.bookTitle}</p>
                        <p className="text-[11px] text-[#A69E94]">{item.date}</p>
                      </div>
                      {item.pinned ? <Pin className="w-5 h-5 text-[#C59B58] fill-current mt-1" /> : <Pin className="w-5 h-5 text-[#D8D2C9] mt-1" />}
                   </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const UploadView = () => (
    <div className={`min-h-full pb-24 px-5 pt-12 ${THEME.bg}`}>
      {/* 標題列 */}
      <div className="flex justify-between items-center mb-8">
        <ChevronLeft className="w-6 h-6 text-[#2C2925]" />
        <h2 className="text-[18px] font-bold text-[#2C2925]">上傳書籍</h2>
        <span className="text-[13px] text-[#C59B58] font-medium">歷史記錄</span>
      </div>

      <div className="space-y-8">
        {/* Step 1 */}
        <div>
          <h3 className="text-[16px] font-bold text-[#2C2925] mb-4 flex items-center gap-2">
            <span className="w-[22px] h-[22px] rounded-full bg-[#C59B58] text-white flex items-center justify-center text-[12px]">1</span> 選擇檔案
          </h3>
          <div className="grid grid-cols-4 gap-2.5 mb-3">
             {['PDF', 'TXT', 'EPUB', '其他'].map((f, i) => (
                <div key={f} className={`py-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-[13px] font-medium shadow-sm ${i===0 ? THEME.accentBorder + ' bg-[#FDFCF8] text-[#C59B58]' : 'border-[#EAE4DB] bg-white text-[#8C867E]'}`}>
                  {i===0 && <div className="w-3.5 h-3.5 bg-[#E0645A] rounded-[4px] flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-[1px]"></div></div>}
                  {i===1 && <div className="w-3.5 h-3.5 bg-[#5D8CE0] rounded-[4px] flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-[1px]"></div></div>}
                  {i===2 && <div className="w-3.5 h-3.5 bg-[#569D67] rounded-[4px] flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-[1px]"></div></div>}
                  {i===3 && <div className="w-3.5 h-3.5 bg-[#D8D2C9] rounded-[4px] flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-[1px]"></div></div>}
                  {f}
                </div>
             ))}
          </div>
          <div className="bg-[#FDFCF8] border border-[#EAE4DB] rounded-2xl p-4 flex justify-between items-center shadow-sm">
             <div className="flex items-center gap-3">
               <FolderInput className="w-6 h-6 text-[#A69E94]" />
               <div>
                 <p className="text-[15px] text-[#2C2925] font-bold leading-tight mb-1">ZIP / RAR</p>
                 <p className="text-[12px] text-[#8C867E]">上傳後將自動解壓</p>
               </div>
             </div>
             <span className="text-[12px] text-[#569D67] font-medium flex items-center gap-1.5 border border-[#569D67]/30 bg-[#569D67]/5 px-3 py-1.5 rounded-lg"><CheckCircle2 className="w-4 h-4" /> 自動解壓</span>
          </div>
        </div>

        {/* Step 2 */}
        <div>
          <h3 className="text-[16px] font-bold text-[#2C2925] mb-5 flex items-center gap-2">
            <span className="w-[22px] h-[22px] rounded-full bg-[#C59B58] text-white flex items-center justify-center text-[12px]">2</span> 書籍資訊
          </h3>
          <div className="space-y-5 bg-white p-5 rounded-2xl border border-[#EAE4DB] shadow-sm">
            <div className="flex items-center border border-[#EAE4DB] rounded-xl px-4 py-3 bg-[#FDFCF8]">
              <label className="w-[60px] text-[14px] text-[#2C2925] font-medium">書名<span className="text-[#E0645A] ml-0.5">*</span></label>
              <input type="text" placeholder="請輸入書名" className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#D8D2C9]" />
            </div>
            <div className="flex items-center border border-[#EAE4DB] rounded-xl px-4 py-3 bg-[#FDFCF8]">
              <label className="w-[60px] text-[14px] text-[#2C2925] font-medium">作者</label>
              <input type="text" placeholder="請輸入作者" className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#D8D2C9]" />
            </div>
            <div className="flex items-center border border-[#EAE4DB] rounded-xl px-4 py-3 bg-[#FDFCF8]">
              <label className="w-[60px] text-[14px] text-[#2C2925] font-medium">分類</label>
              <input type="text" placeholder="請選擇分類" className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#D8D2C9]" />
              <ChevronDown className="w-4 h-4 text-[#A69E94]" />
            </div>
            <div className="flex items-start border border-[#EAE4DB] rounded-xl px-4 py-3 bg-[#FDFCF8]">
              <label className="w-[60px] text-[14px] text-[#2C2925] font-medium mt-1">介紹</label>
              <div className="flex-1 relative">
                <textarea placeholder="請輸入書籍簡介..." className="w-full bg-transparent text-[14px] h-20 outline-none resize-none placeholder:text-[#D8D2C9] leading-relaxed"></textarea>
                <div className="absolute bottom-0 right-0 text-[10px] text-[#BDB6AC]">0/500</div>
              </div>
            </div>
            
            <div>
              <label className="text-[14px] text-[#2C2925] font-medium block mb-3">封面上傳</label>
              <div className="w-full h-24 border-2 border-dashed border-[#D8D2C9] rounded-xl flex flex-col items-center justify-center text-[#A69E94] bg-[#FDFCF8] cursor-pointer hover:bg-white transition-colors">
                <Camera className="w-6 h-6 mb-2 text-[#C59B58]" />
                <span className="text-[13px] font-medium text-[#5C5751]">拍照 / 上傳檔案</span>
              </div>
            </div>
            
            <div>
               <label className="text-[14px] text-[#2C2925] font-medium block mb-2">來源網址 <span className="text-[#A69E94] text-[12px] font-normal">(選填)</span></label>
               <input type="text" placeholder="https://example.com/book" className="w-full border border-[#EAE4DB] rounded-xl px-4 py-3 bg-[#FDFCF8] text-[14px] outline-none placeholder:text-[#D8D2C9]" />
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div>
          <h3 className="text-[16px] font-bold text-[#2C2925] mb-4 flex items-center gap-2">
            <span className="w-[22px] h-[22px] rounded-full bg-[#C59B58] text-white flex items-center justify-center text-[12px]">3</span> AI 摘要 <span className="text-[#A69E94] text-[13px] font-normal">(選填)</span>
          </h3>
          <div className="flex justify-between items-center bg-white border border-[#EAE4DB] p-4 rounded-xl shadow-sm">
            <label className="flex items-center gap-3 text-[14px] text-[#2C2925] font-medium cursor-pointer">
               <div className="w-[18px] h-[18px] border border-[#C59B58] bg-white rounded-[4px] flex items-center justify-center">
                 <Check className="w-[12px] h-[12px] text-[#C59B58]" strokeWidth={3} />
               </div>
               自動生成書籍摘要
            </label>
            <span className="text-[12px] text-[#569D67] font-medium flex items-center gap-1.5 border border-[#569D67]/30 bg-[#569D67]/5 px-3 py-1.5 rounded-lg"><CheckCircle2 className="w-4 h-4" /> AI 安全 RAG</span>
          </div>
        </div>

        <button onClick={createDemoBook} className="w-full py-4 bg-[#C59B58] text-white rounded-2xl text-[17px] font-bold shadow-[0_6px_20px_rgba(197,155,88,0.3)] mt-6 tracking-widest hover:bg-[#B38C4F] transition-colors">
          開始上傳
        </button>
      </div>
    </div>
  );

  const SettingsView = () => (
    <div className={`min-h-full pb-24 pt-12 flex flex-col h-full ${THEME.bg} overflow-y-auto no-scrollbar`}>
      {/* 頂部 Header */}
      <div className="flex justify-between items-center mb-6 shrink-0 px-5">
        <ChevronLeft className="w-6 h-6 text-[#2C2925]" />
        <h2 className="text-[18px] font-bold text-[#2C2925]">閱讀設定</h2>
        <span className="text-[14px] text-[#C59B58] font-bold cursor-pointer" onClick={() => {setFontSize(18); setLineSpacing(1.6); setLetterSpacing(0.05); setReaderTheme("custom"); setPageTurn("swipe"); setFontFamily("微軟正黑體");}}>重設</span>
      </div>

      <div className="flex flex-col gap-6 w-full">
        
        {/* 頂部預覽區塊 - 將預覽放在上方最顯眼處 */}
        <div className="px-5">
          <div className="w-full border border-[#EAE4DB] rounded-2xl p-5 relative shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col transition-colors duration-300 overflow-hidden min-h-[220px]" style={{backgroundColor: currentBgColor}}>
             <h4 className="text-[15px] font-bold mb-4 tracking-widest" style={{color: currentTextColor}}>預覽效果</h4>
             <div className="space-y-3 z-10 relative">
               <p className="text-justify font-medium transition-all tracking-wider" style={{color: currentTextColor, fontSize: `${fontSize*0.8}px`, lineHeight: lineSpacing, letterSpacing: `${letterSpacing}em`, fontFamily}}>
                 這是一段預覽文字，用於即時顯示您的閱讀設定效果。
               </p>
               <p className="text-justify font-medium transition-all tracking-wider" style={{color: currentTextColor, fontSize: `${fontSize*0.8}px`, lineHeight: lineSpacing, letterSpacing: `${letterSpacing}em`, fontFamily}}>
                 您可以調整字體、行距、字距、字體大小與翻頁模式，查看最適合自己的閱讀體驗。
               </p>
             </div>
             
             {/* 底部裝飾圖 */}
             <div className="absolute bottom-0 left-0 right-0 h-32 mix-blend-multiply opacity-60 pointer-events-none" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1558470598-a5dda9640f68?auto=format&fit=crop&q=80)', backgroundSize: 'cover', backgroundPosition: 'center bottom', maskImage: 'linear-gradient(to top, black, transparent)'}}></div>
          </div>
        </div>

        {/* 下方各種設定項的垂直列表 */}
        <div className="px-5 space-y-8 pb-10">
          
          {/* 翻頁模式 */}
          <div className="bg-white p-5 rounded-2xl border border-[#EAE4DB] shadow-sm">
            <h4 className="text-[15px] font-bold text-[#2C2925] mb-4">翻頁模式</h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'swipe', label: '左右滑動', icon: <div className="w-[26px] h-[20px] border-2 border-current rounded-sm flex"><div className="w-1/2 bg-current opacity-20"></div></div> },
                { id: 'scroll', label: '上下滾動', icon: <div className="w-[20px] h-[26px] border-2 border-current rounded-sm flex flex-col"><div className="h-1/2 bg-current opacity-20"></div></div> },
                { id: 'flip', label: '仿真翻頁', icon: <BookOpen className="w-6 h-6" /> }
              ].map((m) => (
                <div key={m.id} onClick={() => setPageTurn(m.id)} className={`py-4 rounded-xl border flex flex-col items-center gap-3 cursor-pointer transition-colors shadow-sm ${pageTurn === m.id ? THEME.accentBorder + ' bg-[#FDFCF8] text-[#C59B58]' : 'border-[#EAE4DB] bg-white text-[#8C867E]'}`}>
                  {m.icon}
                  <span className={`text-[12px] font-bold`}>{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 排版設定 (字級、行距、字距) */}
          <div className="bg-white p-5 rounded-2xl border border-[#EAE4DB] shadow-sm space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[15px] font-bold text-[#2C2925]">字體大小</span>
                <span className="text-[14px] text-[#5C5751] bg-[#F7F3EB] px-2 py-0.5 rounded-md">{fontSize} px</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[14px] font-bold text-[#8C867E]">小</span>
                <input type="range" min={14} max={26} step={1} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="flex-1 h-2 bg-[#EAE4DB] rounded-lg appearance-none cursor-pointer accent-[#C59B58]" />
                <span className="text-[18px] font-bold text-[#2C2925]">大</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[15px] font-bold text-[#2C2925]">行距</span>
                <span className="text-[14px] text-[#5C5751] bg-[#F7F3EB] px-2 py-0.5 rounded-md">{lineSpacing.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-3">
                <List className="w-5 h-5 text-[#8C867E]" />
                <input type="range" min={1.2} max={2.4} step={0.1} value={lineSpacing} onChange={e => setLineSpacing(Number(e.target.value))} className="flex-1 h-2 bg-[#EAE4DB] rounded-lg appearance-none cursor-pointer accent-[#C59B58]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[15px] font-bold text-[#2C2925]">字距</span>
                <span className="text-[14px] text-[#5C5751] bg-[#F7F3EB] px-2 py-0.5 rounded-md">{letterSpacing.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-3">
                <Type className="w-5 h-5 text-[#8C867E]" />
                <input type="range" min={0} max={0.2} step={0.01} value={letterSpacing} onChange={e => setLetterSpacing(Number(e.target.value))} className="flex-1 h-2 bg-[#EAE4DB] rounded-lg appearance-none cursor-pointer accent-[#C59B58]" />
              </div>
            </div>
          </div>

          {/* 字體選擇 */}
          <div className="bg-white p-5 rounded-2xl border border-[#EAE4DB] shadow-sm">
            <h4 className="text-[15px] font-bold text-[#2C2925] mb-4">字體選擇</h4>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {['微軟正黑體', '標楷體', '圓體', '魏碑', '隸書', '楷體', '宋體', '雅痞'].map((f) => (
                <button key={f} onClick={() => setFontFamily(f)} className={`py-2.5 text-[13px] rounded-xl border bg-white shadow-sm font-bold ${fontFamily===f ? THEME.accentBorder + ' text-[#C59B58] bg-[#FDFCF8]' : 'border-[#EAE4DB] text-[#5C5751]'}`}>{f}</button>
              ))}
            </div>
            <button className="w-full py-3.5 rounded-xl border border-[#EAE4DB] bg-[#FDFCF8] text-[#C59B58] text-[14px] font-bold shadow-sm hover:bg-[#F5ECD9] transition-colors flex items-center justify-center gap-2">
              <Upload className="w-4 h-4" /> 上傳字體 (.ttf / .otf)
            </button>
          </div>

          {/* 主題模式 */}
          <div className="bg-white p-5 rounded-2xl border border-[#EAE4DB] shadow-sm">
            <h4 className="text-[15px] font-bold text-[#2C2925] mb-4">主題背景</h4>
            <div className="flex border border-[#EAE4DB] rounded-xl overflow-hidden bg-[#FDFCF8] p-1 shadow-sm mb-4">
               <button onClick={() => setReaderTheme('day')} className={`flex-1 py-2.5 text-[14px] rounded-lg ${readerTheme==='day' ? 'bg-white border border-[#EAE4DB] text-[#2C2925] font-bold shadow-sm' : 'text-[#8C867E] hover:bg-[#FDFCF8]'}`}>日間</button>
               <button onClick={() => setReaderTheme('night')} className={`flex-1 py-2.5 text-[14px] rounded-lg ${readerTheme==='night' ? 'bg-[#2C2925] border border-[#2C2925] text-white font-bold shadow-sm' : 'text-[#8C867E] hover:bg-[#FDFCF8]'}`}>夜間</button>
               <button onClick={() => setReaderTheme('custom')} className={`flex-1 py-2.5 text-[14px] rounded-lg ${readerTheme==='custom' ? 'bg-[#F5ECD9] border border-[#C59B58] text-[#C59B58] font-bold shadow-sm' : 'text-[#8C867E] hover:bg-[#FDFCF8]'}`}>自訂 (古風)</button>
            </div>
            
            {readerTheme === 'custom' && (
              <div className="flex items-center gap-4 pt-2">
                 <div className="w-12 h-12 rounded-xl border border-[#EAE4DB] shadow-sm bg-[#F5ECD9] shrink-0"></div>
                 <div className="flex flex-1 gap-2">
                   {['R', 'G', 'B'].map((c, i) => (
                      <div key={c} className="flex-1 border border-[#EAE4DB] rounded-xl bg-[#FDFCF8] flex items-center justify-between px-3 py-2.5 shadow-sm">
                        <span className="text-[12px] text-[#A69E94] font-bold">{c}</span>
                        <span className="text-[14px] text-[#5C5751] font-bold">{[245, 236, 217][i]}</span>
                      </div>
                   ))}
                 </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0EBE6] flex items-center justify-center p-4">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      {/* 模擬手機外框 */}
      <div className="w-full max-w-[414px] h-[896px] max-h-[95vh] bg-[#FDFCF8] relative overflow-hidden sm:rounded-[45px] sm:border-[12px] border-[#2C2925] shadow-2xl flex flex-col font-sans">
        
        {/* iOS Status Bar Mock */}
        <div className="h-12 w-full flex justify-between items-end px-7 pb-2 shrink-0 bg-transparent relative z-40">
           <span className="text-[14px] font-bold text-[#1C1C1E]">9:41</span>
           <div className="flex gap-1.5 items-center pb-0.5">
             <div className="w-4 h-3 flex items-end gap-0.5"><div className="w-[3px] h-1 bg-[#1C1C1E] rounded-sm"></div><div className="w-[3px] h-1.5 bg-[#1C1C1E] rounded-sm"></div><div className="w-[3px] h-2 bg-[#1C1C1E] rounded-sm"></div><div className="w-[3px] h-2.5 bg-[#1C1C1E] rounded-sm"></div></div>
             <div className="w-4 h-3"><svg viewBox="0 0 24 24" fill="currentColor" className="text-[#1C1C1E]"><path d="M12 21c-5-5-9-8.4-9-12.6C3 5.4 5.4 3 8.4 3c1.7 0 3.4.8 4.6 2.1C14.2 3.8 15.9 3 17.6 3 20.6 3 23 5.4 23 8.4c0 4.2-4 7.6-9 12.6-.3.3-.8.3-1 0z"/></svg></div>
             <div className="w-6 h-3 border border-[#1C1C1E] rounded-sm p-0.5 flex"><div className="w-4 h-full bg-[#1C1C1E] rounded-[1px]"></div></div>
           </div>
        </div>

        <main className="flex-1 overflow-y-auto no-scrollbar relative">
          {tab === 'library' && <LibraryView />}
          {tab === 'wiki' && <WikiView />}
          {tab === 'bookmarks' && <BookmarksView />}
          {tab === 'upload' && <UploadView />}
          {tab === 'settings' && <SettingsView />}
          
          {/* Bottom Sheet 渲染層 */}
          <BookDetailView />
        </main>

        {/* 底部導覽列 */}
        <nav className="absolute bottom-0 left-0 right-0 bg-[#FDFCF8]/95 backdrop-blur-xl border-t border-[#EAE4DB] pb-8 pt-3 px-4 flex justify-around items-center z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          {[
            { id: 'library', icon: Book, label: '書櫃' },
            { id: 'wiki', icon: BookOpen, label: '百科' },
            { id: 'bookmarks', icon: Bookmark, label: '書籤' },
            { id: 'upload', icon: Upload, label: '上傳' },
            { id: 'settings', icon: MoreHorizontal, label: '其他' }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => { setTab(item.id); setSelectedBook(null); setReaderBook(null); setIsEditMode(false); }}
              className={`flex flex-col items-center justify-center w-16 gap-1.5 transition-colors ${tab === item.id ? THEME.accent : 'text-[#A69E94]'}`}
            >
              <item.icon className={`w-[22px] h-[22px] ${tab === item.id && item.id !== 'settings' ? 'fill-current opacity-20' : ''}`} strokeWidth={tab === item.id ? 2.5 : 2} />
              <span className={`text-[11px] ${tab === item.id ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* 閱讀器全螢幕疊層 */}
        <ReaderOverlay />
      </div>
    </div>
  );
}