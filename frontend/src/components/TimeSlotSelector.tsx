import React from 'react'; import type { Slot } from '../types';
export default function TimeSlotSelector({slots, selected, onSelect}:{slots:Slot[]; selected?:Slot | null; onSelect:(s:Slot)=>void}){
  return (
    <div className="flex gap-2 flex-wrap">
      {slots.map(s=> <button key={s.id} onClick={()=>onSelect(s)} disabled={s.available_slots===0} className={`px-3 py-2 rounded border ${selected?.id===s.id ? 'bg-yellow-400 border-yellow-400' : s.available_slots===0 ? 'bg-gray-200 border-gray-200 text-gray-500 cursor-not-allowed' : 'border-gray-300'}`}>{s.time.slice(0,5)} {s.available_slots>0? `${s.available_slots} left` : 'Sold out'}</button>)}
    </div>
  );
}