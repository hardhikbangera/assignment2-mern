import React from 'react'; import type { Experience } from '../types';
export default function ExperienceCard({exp, onView}:{exp:Experience; onView:(id:number)=>void}){
  return (
    <div className="bg-white rounded overflow-hidden shadow">
      <img src={exp.image_url} className="w-full h-40 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-start"><h3 className="font-semibold">{exp.name}</h3><span className="text-sm text-gray-500">{exp.location}</span></div>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{exp.description}</p>
        <div className="flex justify-between items-center mt-4">
          <div><span className="text-sm text-gray-500">From </span><span className="font-bold">₹{exp.price}</span></div>
          <button onClick={()=>onView(exp.id)} className="px-3 py-2 bg-yellow-400 rounded">View Details</button>
        </div>
      </div>
    </div>
  );
}